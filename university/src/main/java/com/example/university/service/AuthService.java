package com.example.university.service;

import com.example.university.dto.AuthResponse;
import com.example.university.dto.LoginRequest;
import com.example.university.dto.RegisterRequest;
import com.example.university.model.AccessLevel;
import com.example.university.model.UserAccount;
import com.example.university.repository.UserAccountJpaRepository;
import com.example.university.repository.StudentJpaRepository;
import com.example.university.security.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
public class AuthService {

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    @Autowired
    private UserAccountJpaRepository userAccountJpaRepository;

    @Autowired
    private StudentJpaRepository studentJpaRepository;

    @Autowired
    private JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        String fullName = required(request.getFullName(), "Full name");
        String email = normalizeEmail(request.getEmail());
        String password = required(request.getPassword(), "Password");

        if (password.length() < 6) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Password must contain at least 6 characters"
            );
        }

        if (userAccountJpaRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Email already registered"
            );
        }

        UserAccount userAccount = new UserAccount();
        userAccount.setFullName(fullName);
        userAccount.setEmail(email);
        userAccount.setPasswordHash(passwordEncoder.encode(password));
        userAccount.setAccessLevel(parseAccessLevel(request.getAccessLevel()));

        if (userAccount.getAccessLevel() != AccessLevel.STUDENT) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only student self-registration is allowed. Admin creates staff accounts."
            );
        }

        UserAccount savedUser = userAccountJpaRepository.save(userAccount);
        createStudentProfileIfMissing(savedUser);

        return new AuthResponse(savedUser, jwtService.createToken(savedUser));
    }

    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.getEmail());
        String password = required(request.getPassword(), "Password");

        UserAccount userAccount = userAccountJpaRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid email or password"
                ));

        if (!userAccount.isActive() ||
                !passwordEncoder.matches(password, userAccount.getPasswordHash())) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        return new AuthResponse(userAccount, jwtService.createToken(userAccount));
    }

    public AuthResponse createStaffAccount(RegisterRequest request) {
        String fullName = required(request.getFullName(), "Full name");
        String email = normalizeEmail(request.getEmail());
        String password = required(request.getPassword(), "Password");
        AccessLevel accessLevel = parseAccessLevel(request.getAccessLevel());

        if (accessLevel == AccessLevel.STUDENT) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Use student registration for student accounts"
            );
        }

        if (userAccountJpaRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Email already registered"
            );
        }

        UserAccount userAccount = new UserAccount();
        userAccount.setFullName(fullName);
        userAccount.setEmail(email);
        userAccount.setPasswordHash(passwordEncoder.encode(password));
        userAccount.setAccessLevel(accessLevel);

        UserAccount savedUser = userAccountJpaRepository.save(userAccount);
        return new AuthResponse(savedUser, jwtService.createToken(savedUser));
    }

    private void createStudentProfileIfMissing(UserAccount userAccount) {
        if (studentJpaRepository.existsByEmail(userAccount.getEmail())) {
            return;
        }

        com.example.university.model.Student student =
                new com.example.university.model.Student();
        student.setStudentName(userAccount.getFullName());
        student.setEmail(userAccount.getEmail());
        studentJpaRepository.save(student);
    }

    private AccessLevel parseAccessLevel(String value) {
        if (value == null || value.trim().isEmpty()) {
            return AccessLevel.STUDENT;
        }

        try {
            return AccessLevel.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid access level"
            );
        }
    }

    private String normalizeEmail(String value) {
        return required(value, "Email").toLowerCase(Locale.ROOT);
    }

    private String required(String value, String fieldName) {
        if (value == null || value.trim().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    fieldName + " is required"
            );
        }

        return value.trim();
    }
}

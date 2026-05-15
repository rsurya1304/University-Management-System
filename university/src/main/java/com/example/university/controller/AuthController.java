package com.example.university.controller;

import com.example.university.dto.AuthResponse;
import com.example.university.dto.LoginRequest;
import com.example.university.dto.RegisterRequest;
import com.example.university.model.AccessLevel;
import com.example.university.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/staff")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse createStaffAccount(@RequestBody RegisterRequest request) {
        return authService.createStaffAccount(request);
    }

    @GetMapping("/access-levels")
    public List<String> getAccessLevels() {
        return Arrays.stream(AccessLevel.values())
                .map(Enum::name)
                .toList();
    }
}

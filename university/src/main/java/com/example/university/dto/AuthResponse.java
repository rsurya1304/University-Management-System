package com.example.university.dto;

import com.example.university.model.UserAccount;

public class AuthResponse {

    private int userId;
    private String fullName;
    private String email;
    private String accessLevel;
    private String token;

    public AuthResponse(UserAccount userAccount, String token) {
        this.userId = userAccount.getUserId();
        this.fullName = userAccount.getFullName();
        this.email = userAccount.getEmail();
        this.accessLevel = userAccount.getAccessLevel().name();
        this.token = token;
    }

    public int getUserId() {
        return userId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getAccessLevel() {
        return accessLevel;
    }

    public String getToken() {
        return token;
    }
}

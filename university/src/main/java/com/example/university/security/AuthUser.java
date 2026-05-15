package com.example.university.security;

public class AuthUser {

    private final int userId;
    private final String email;
    private final String accessLevel;

    public AuthUser(int userId, String email, String accessLevel) {
        this.userId = userId;
        this.email = email;
        this.accessLevel = accessLevel;
    }

    public int getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getAccessLevel() {
        return accessLevel;
    }
}

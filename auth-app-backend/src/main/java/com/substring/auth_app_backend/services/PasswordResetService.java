package com.substring.auth_app_backend.services;

public interface PasswordResetService {

    /**
     * Looks up the user by email and sends a forgot-password email.
     * Always succeeds silently to prevent user enumeration.
     */
    void initiatePasswordReset(String email);
}
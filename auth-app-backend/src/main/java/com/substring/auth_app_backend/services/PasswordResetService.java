package com.substring.auth_app_backend.services;

public interface PasswordResetService {

    /**
     * Looks up the user by email, creates a reset token, and sends a reset link via email.
     * Always returns success to prevent user enumeration attacks.
     */
    void initiatePasswordReset(String email);

    /**
     * Validates the token and updates the user's password.
     */
    void resetPassword(String token, String newPassword);
}
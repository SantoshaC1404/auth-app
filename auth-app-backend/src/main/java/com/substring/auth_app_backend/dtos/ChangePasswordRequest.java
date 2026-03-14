package com.substring.auth_app_backend.dtos;

public record ChangePasswordRequest(
        String currentPassword,
        String newPassword
) {
}
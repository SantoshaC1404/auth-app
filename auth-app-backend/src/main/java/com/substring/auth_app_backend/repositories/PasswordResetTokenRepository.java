package com.substring.auth_app_backend.repositories;

import com.substring.auth_app_backend.entities.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    /**
     * Find by the reset token (issued after OTP verification)
     */
    Optional<PasswordResetToken> findByResetToken(String resetToken);

    /**
     * Find latest active OTP entry for a user
     */
    Optional<PasswordResetToken> findTopByUserEmailOrderByIdDesc(String email);

    @Modifying
    @Query("DELETE FROM PasswordResetToken t WHERE t.user.id = :userId")
    void deleteAllByUserId(String userId);
}

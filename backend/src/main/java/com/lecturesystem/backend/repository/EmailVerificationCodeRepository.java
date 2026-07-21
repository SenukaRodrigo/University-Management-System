package com.lecturesystem.backend.repository;

import com.lecturesystem.backend.model.EmailVerificationCode;
import com.lecturesystem.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailVerificationCodeRepository extends JpaRepository<EmailVerificationCode, Long> {
    Optional<EmailVerificationCode> findByUser(User user);
}

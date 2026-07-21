package com.lecturesystem.backend.service;

import com.lecturesystem.backend.exception.AlreadyVerifiedException;
import com.lecturesystem.backend.exception.InvalidVerificationCodeException;
import com.lecturesystem.backend.exception.VerificationCodeExpiredException;
import com.lecturesystem.backend.model.EmailVerificationCode;
import com.lecturesystem.backend.model.User;
import com.lecturesystem.backend.repository.EmailVerificationCodeRepository;
import com.lecturesystem.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class EmailVerificationService {

    private final EmailVerificationCodeRepository codeRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final EmailDomainService emailDomainService;
    private final int codeExpiryMinutes;
    private final SecureRandom random = new SecureRandom();

    public EmailVerificationService(EmailVerificationCodeRepository codeRepository,
                                     UserRepository userRepository,
                                     EmailService emailService,
                                     EmailDomainService emailDomainService,
                                     @Value("${app.verification.code-expiry-minutes}") int codeExpiryMinutes) {
        this.codeRepository = codeRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.emailDomainService = emailDomainService;
        this.codeExpiryMinutes = codeExpiryMinutes;
    }

    // Generates a fresh 6-digit code for `user`, overwriting any existing one
    // (one active code per user — a new code invalidates the previous one),
    // and emails it. Used by both signup and /resend.
    @Transactional
    public void issueCode(User user) {
        String code = String.valueOf(100_000 + random.nextInt(900_000));
        Instant expiresAt = Instant.now().plus(codeExpiryMinutes, ChronoUnit.MINUTES);

        EmailVerificationCode record = codeRepository.findByUser(user)
                .orElseGet(EmailVerificationCode::new);
        record.setUser(user);
        record.setCode(code);
        record.setExpiresAt(expiresAt);
        codeRepository.save(record);

        emailService.sendVerificationCode(user.getEmail(), code, codeExpiryMinutes);
    }

    // Verifies `code` for `email`. On success, enables the user and consumes
    // (deletes) the code so it can't be replayed.
    @Transactional
    public void verify(String rawEmail, String code) {
        String email = emailDomainService.normalize(rawEmail);

        // Deliberately generic ("Invalid code") if the email doesn't match any
        // account, rather than a distinct "no such user" message — same
        // don't-leak-registered-emails posture as /resend.
        User user = userRepository.findByEmail(email)
                .orElseThrow(InvalidVerificationCodeException::new);

        if (user.isEnabled()) {
            throw new AlreadyVerifiedException();
        }

        EmailVerificationCode record = codeRepository.findByUser(user)
                .orElseThrow(InvalidVerificationCodeException::new);

        if (!record.getCode().equals(code)) {
            throw new InvalidVerificationCodeException();
        }
        if (record.getExpiresAt().isBefore(Instant.now())) {
            throw new VerificationCodeExpiredException();
        }

        user.setEnabled(true);
        userRepository.save(user);
        codeRepository.delete(record);
    }

    // Re-issues a code if (and only if) the email belongs to a real,
    // not-yet-verified account. Never throws and never reports which case it
    // was — the caller always returns the same generic response, so this
    // endpoint can't be used to test which emails are registered.
    @Transactional
    public void resendIfEligible(String rawEmail) {
        String email = emailDomainService.normalize(rawEmail);
        userRepository.findByEmail(email)
                .filter(u -> !u.isEnabled())
                .ifPresent(this::issueCode);
    }
}

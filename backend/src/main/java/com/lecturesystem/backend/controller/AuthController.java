package com.lecturesystem.backend.controller;

import com.lecturesystem.backend.dto.AuthResponse;
import com.lecturesystem.backend.dto.CreateUserRequest;
import com.lecturesystem.backend.dto.LoginRequest;
import com.lecturesystem.backend.dto.MessageResponse;
import com.lecturesystem.backend.dto.ResendVerificationRequest;
import com.lecturesystem.backend.dto.VerifyEmailRequest;
import com.lecturesystem.backend.service.AuthService;
import com.lecturesystem.backend.service.EmailVerificationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final EmailVerificationService emailVerificationService;

    public AuthController(AuthService authService, EmailVerificationService emailVerificationService) {
        this.authService = authService;
        this.emailVerificationService = emailVerificationService;
    }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public MessageResponse signup(@Valid @RequestBody CreateUserRequest req) {
        return authService.signup(req);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest req) {
        return authService.login(req);
    }

    @PostMapping("/verify")
    public MessageResponse verify(@Valid @RequestBody VerifyEmailRequest req) {
        emailVerificationService.verify(req.email(), req.code());
        return new MessageResponse("Email verified. You can now log in.");
    }

    @PostMapping("/resend")
    public MessageResponse resend(@Valid @RequestBody ResendVerificationRequest req) {
        // Always the same response, whether or not the email is registered or
        // already verified — see EmailVerificationService.resendIfEligible.
        emailVerificationService.resendIfEligible(req.email());
        return new MessageResponse("A new code has been sent.");
    }
}

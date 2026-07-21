package com.lecturesystem.backend.service;

import com.lecturesystem.backend.dto.AuthResponse;
import com.lecturesystem.backend.dto.CreateUserRequest;
import com.lecturesystem.backend.dto.LoginRequest;
import com.lecturesystem.backend.dto.MessageResponse;
import com.lecturesystem.backend.exception.EmailAlreadyExistsException;
import com.lecturesystem.backend.exception.UnverifiedEmailException;
import com.lecturesystem.backend.model.Role;
import com.lecturesystem.backend.model.User;
import com.lecturesystem.backend.repository.UserRepository;
import com.lecturesystem.backend.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserService userService;
    private final EmailDomainService emailDomainService;
    private final EmailVerificationService emailVerificationService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       UserService userService,
                       EmailDomainService emailDomainService,
                       EmailVerificationService emailVerificationService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userService = userService;
        this.emailDomainService = emailDomainService;
        this.emailVerificationService = emailVerificationService;
    }

    public MessageResponse signup(CreateUserRequest req) {
        // Normalize first so the duplicate check and the stored email are
        // case-insensitive and whitespace-tolerant.
        String email = emailDomainService.normalize(req.email());

        if (userRepository.findByEmail(email).isPresent()) {
            throw new EmailAlreadyExistsException(email);
        }

        // The role is derived from the email domain — the client never chooses it.
        Role role = emailDomainService.resolveRole(email);

        // Created disabled: the account can't log in until the emailed code is
        // confirmed via /api/auth/verify. This is what closes the email-ownership
        // gap that used to be flagged as a TODO in EmailDomainService — anyone
        // can *type* a lecturer-domain address, but only the real owner can read
        // the code that lands in that inbox.
        userService.create(req, role);
        User user = userRepository.findByEmail(email).orElseThrow();

        emailVerificationService.issueCode(user);

        return new MessageResponse("Account created. Check your email for a verification code.");
    }

    public AuthResponse login(LoginRequest req) {
        // findByEmail returns Optional<User>.  filter() discards it if the
        // password doesn't match — so "user not found" and "wrong password"
        // both fall through to orElseThrow, giving the same generic 401.
        var user = userRepository.findByEmail(req.email())
                .filter(u -> passwordEncoder.matches(req.password(), u.getPassword()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        // Distinct from the 401 above: we know exactly who this is (the
        // password matched), they just haven't confirmed their email yet.
        if (!user.isEnabled()) {
            throw new UnverifiedEmailException();
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getRole(), user.getId());
    }
}

package com.lecturesystem.backend.service;

import com.lecturesystem.backend.dto.AuthResponse;
import com.lecturesystem.backend.dto.CreateUserRequest;
import com.lecturesystem.backend.dto.LoginRequest;
import com.lecturesystem.backend.exception.EmailAlreadyExistsException;
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

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       UserService userService,
                       EmailDomainService emailDomainService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userService = userService;
        this.emailDomainService = emailDomainService;
    }

    public AuthResponse signup(CreateUserRequest req) {
        // Normalize first so the duplicate check and the stored email are
        // case-insensitive and whitespace-tolerant.
        String email = emailDomainService.normalize(req.email());

        if (userRepository.findByEmail(email).isPresent()) {
            throw new EmailAlreadyExistsException(email);
        }

        // The role is derived from the email domain — the client never chooses it.
        // (See EmailDomainService for the domain->role mapping and the ownership TODO.)
        Role role = emailDomainService.resolveRole(email);

        userService.create(req, role);
        User user = userRepository.findByEmail(email).orElseThrow();
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getRole(), user.getId());
    }

    public AuthResponse login(LoginRequest req) {
        // findByEmail returns Optional<User>.  filter() discards it if the
        // password doesn't match — so "user not found" and "wrong password"
        // both fall through to orElseThrow, giving the same generic 401.
        var user = userRepository.findByEmail(req.email())
                .filter(u -> passwordEncoder.matches(req.password(), u.getPassword()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getRole(), user.getId());
    }
}

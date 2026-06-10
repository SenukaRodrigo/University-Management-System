package com.lecturesystem.backend.service;

import com.lecturesystem.backend.dto.AuthResponse;
import com.lecturesystem.backend.dto.CreateUserRequest;
import com.lecturesystem.backend.dto.LoginRequest;
import com.lecturesystem.backend.exception.EmailAlreadyExistsException;
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

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       UserService userService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    public AuthResponse signup(CreateUserRequest req) {
        if (userRepository.findByEmail(req.email()).isPresent()) {
            throw new EmailAlreadyExistsException(req.email());
        }
        userService.create(req);
        User user = userRepository.findByEmail(req.email()).orElseThrow();
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

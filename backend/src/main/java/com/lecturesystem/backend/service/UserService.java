package com.lecturesystem.backend.service;

import com.lecturesystem.backend.dto.CreateUserRequest;
import com.lecturesystem.backend.dto.UpdateUserRequest;
import com.lecturesystem.backend.dto.UserResponse;
import com.lecturesystem.backend.model.Role;
import com.lecturesystem.backend.model.User;
import com.lecturesystem.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailDomainService emailDomainService;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       EmailDomainService emailDomainService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailDomainService = emailDomainService;
    }

    // Role is supplied by the caller (derived from the email domain), never taken
    // from client input. The email is normalized here so stored emails stay
    // consistent regardless of which path created the user.
    public UserResponse create(CreateUserRequest req, Role role) {
        User user = new User();
        user.setFullName(req.fullName());
        user.setEmail(emailDomainService.normalize(req.email()));
        user.setPassword(passwordEncoder.encode(req.password()));
        user.setRole(role);
        return toResponse(userRepository.save(user));
    }

    public List<UserResponse> getAll() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public UserResponse getById(Long id) {
        return userRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public UserResponse update(Long id, UpdateUserRequest req) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        user.setFullName(req.fullName());
        user.setEmail(req.email());
        user.setRole(req.role());
        return toResponse(userRepository.save(user));
    }

    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        userRepository.deleteById(id);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}

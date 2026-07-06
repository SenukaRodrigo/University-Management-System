package com.lecturesystem.backend.controller;

import com.lecturesystem.backend.dto.CreateUserRequest;
import com.lecturesystem.backend.dto.UpdateUserRequest;
import com.lecturesystem.backend.dto.UserResponse;
import com.lecturesystem.backend.model.Role;
import com.lecturesystem.backend.service.EmailDomainService;
import com.lecturesystem.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final EmailDomainService emailDomainService;

    public UserController(UserService userService, EmailDomainService emailDomainService) {
        this.userService = userService;
        this.emailDomainService = emailDomainService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse create(@Valid @RequestBody CreateUserRequest req) {
        // Same rule as signup: the role comes from the email domain, not the client.
        Role role = emailDomainService.resolveRole(emailDomainService.normalize(req.email()));
        return userService.create(req, role);
    }

    @GetMapping
    public List<UserResponse> getAll() {
        return userService.getAll();
    }

    @GetMapping("/{id}")
    public UserResponse getOne(@PathVariable Long id) {
        return userService.getById(id);
    }

    @PutMapping("/{id}")
    public UserResponse update(@PathVariable Long id, @RequestBody UpdateUserRequest req) {
        return userService.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
}

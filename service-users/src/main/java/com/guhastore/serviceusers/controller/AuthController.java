package com.guhastore.serviceusers.controller;

import com.guhastore.serviceusers.dto.JwtAuthResponseDto;
import com.guhastore.serviceusers.dto.LoginDto;
import com.guhastore.serviceusers.dto.RegisterDto;
import com.guhastore.serviceusers.dto.UserDto;
import com.guhastore.serviceusers.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.AuthenticationException;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * POST http://localhost:8082/api/v1/auth/register
     * API Đăng ký tài khoản người dùng
     */
    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody RegisterDto registerDto) {
        try {
            UserDto registeredUser = authService.register(registerDto);
            return ResponseEntity.ok(registeredUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * POST http://localhost:8082/api/v1/auth/login
     * API Đăng nhập và nhận JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        try {
            JwtAuthResponseDto response = authService.login(loginDto);
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Sai email hoặc mật khẩu");
        }
    }
}
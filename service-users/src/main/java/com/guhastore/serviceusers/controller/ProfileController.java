package com.guhastore.serviceusers.controller;

import com.guhastore.serviceusers.dto.UserDto;
import com.guhastore.serviceusers.dto.ChangePasswordDto;
import com.guhastore.serviceusers.model.User;
import com.guhastore.serviceusers.repository.UserRepository;
import com.guhastore.serviceusers.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (Long) authentication.getPrincipal();
    }

    private UserDto mapUserToUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setFullName(user.getFullName());
        userDto.setEmail(user.getEmail());
        userDto.setPhoneNumber(user.getPhoneNumber());
        userDto.setAddress(user.getAddress());
        userDto.setRole(user.getRole());
        return userDto;
    }

    /**
     * GET http://localhost:8082/api/v1/profile
     * Lấy thông tin hồ sơ người dùng hiện tại
     */
    @GetMapping
    public ResponseEntity<UserDto> getProfile() {
        Long currentUserId = getCurrentUserId();
        
        Optional<User> userOpt = userRepository.findById(currentUserId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(mapUserToUserDto(userOpt.get()));
    }

    /**
     * PUT http://localhost:8082/api/v1/profile
     * Cập nhật thông tin hồ sơ người dùng
     */
    @PutMapping
    public ResponseEntity<UserDto> updateProfile(@RequestBody UserDto updatedInfo) {
        Long currentUserId = getCurrentUserId();
        
        Optional<User> userOpt = userRepository.findById(currentUserId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        user.setFullName(updatedInfo.getFullName());
        user.setPhoneNumber(updatedInfo.getPhoneNumber());
        user.setAddress(updatedInfo.getAddress());
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(mapUserToUserDto(savedUser));
    }

    /**
     * PUT http://localhost:8082/api/v1/profile/change-password
     * Thay đổi mật khẩu người dùng
     */
    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordDto changePasswordDto) {
        Long currentUserId = getCurrentUserId();
        try {
            authService.changePassword(currentUserId, changePasswordDto);
            return ResponseEntity.ok("Đổi mật khẩu thành công!");
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(400).body("Mật khẩu hiện tại không đúng");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi máy chủ");
        }
    }
}
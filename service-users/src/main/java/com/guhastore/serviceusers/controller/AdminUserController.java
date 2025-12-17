package com.guhastore.serviceusers.controller;

import com.guhastore.serviceusers.model.Role; 
import com.guhastore.serviceusers.model.User;
import com.guhastore.serviceusers.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/admin/users")
public class AdminUserController {

    @Autowired
    private UserRepository userRepository;

    @PutMapping("/{id}/role")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> requestBody) {
        
        String newRoleStr = requestBody.get("role"); 

      
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        User user = userOpt.get();

        
        try {
            
            Role newRole = Role.valueOf(newRoleStr); 
            user.setRole(newRole);
            userRepository.save(user);
            
            return ResponseEntity.ok("Đã cập nhật quyền thành công!");
        } catch (IllegalArgumentException e) {
            
            return ResponseEntity.badRequest().body("Role không hợp lệ! Chỉ chấp nhận: ADMIN, CUSTOMER, EMPLOYEE");
        }
    }
    
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
}
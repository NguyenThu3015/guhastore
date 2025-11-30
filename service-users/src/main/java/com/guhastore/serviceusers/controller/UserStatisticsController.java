package com.guhastore.serviceusers.controller;

import com.guhastore.serviceusers.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/statistics")
@CrossOrigin(origins = "http://localhost:3000")
public class UserStatisticsController {

    @Autowired
    private UserRepository userRepository;

    /**
     * GET http://localhost:8082/api/v1/admin/statistics/new-users-count
     * Lấy thống kê số lượng người dùng mới trong khoảng thời gian
     */
    @GetMapping("/new-users-count")
    public ResponseEntity<Map<String, Long>> getNewUserCount(
            @RequestParam("start") Instant startDate,
            @RequestParam("end") Instant endDate) {

        Long count = userRepository.countNewUsersBetween(startDate, endDate);
        return ResponseEntity.ok(Map.of("newUsersCount", count));
    }
}
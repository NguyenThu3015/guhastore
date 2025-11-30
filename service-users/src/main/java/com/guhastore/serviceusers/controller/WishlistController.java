package com.guhastore.serviceusers.controller;

import com.guhastore.serviceusers.model.WishlistItem;
import com.guhastore.serviceusers.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/wishlist")
@CrossOrigin(origins = "http://localhost:3000")
public class WishlistController {

    @Autowired
    private WishlistRepository wishlistRepository;

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (Long) authentication.getPrincipal();
    }

    /**
     * POST http://localhost:8082/api/v1/wishlist/add
     * Thêm sản phẩm vào danh sách yêu thích
     */
    @PostMapping("/add")
    public ResponseEntity<WishlistItem> addToWishlist(@RequestBody WishlistItem wishlistItem) {
        Long userId = getCurrentUserId();
        wishlistItem.setUserId(userId);
        Optional<WishlistItem> existing = wishlistRepository.findByUserIdAndProductId(userId, wishlistItem.getProductId());
        if (existing.isPresent()) {
            return ResponseEntity.ok(existing.get());
        }
        WishlistItem savedItem = wishlistRepository.save(wishlistItem);
        return ResponseEntity.ok(savedItem);
    }

    /**
     * DELETE http://localhost:8082/api/v1/wishlist/remove/{productId}
     * Xóa sản phẩm khỏi danh sách yêu thích
     */
    @DeleteMapping("/remove/{productId}")
    @Transactional
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Long productId) {
        Long userId = getCurrentUserId();
        wishlistRepository.delete(wishlistRepository.findByUserIdAndProductId(userId, productId)
            .orElse(null));
        return ResponseEntity.ok().build();
    }

    /**
     * GET http://localhost:8082/api/v1/wishlist
     * Lấy danh sách sản phẩm yêu thích của người dùng
     */
    @GetMapping
    public ResponseEntity<List<WishlistItem>> getWishlist() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(wishlistRepository.findByUserId(userId));
    }
}
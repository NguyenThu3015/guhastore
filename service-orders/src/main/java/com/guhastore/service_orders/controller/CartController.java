package com.guhastore.service_orders.controller;

import com.guhastore.service_orders.model.CartItem;
import com.guhastore.service_orders.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import java.util.List;
@RestController
@RequestMapping("/api/v1/cart")
public class CartController {

    @Autowired
    private CartItemRepository cartItemRepository;

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@RequestBody CartItem cartItem) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long currentUserId = (Long) authentication.getPrincipal();

        System.out.println("Yêu cầu thêm giỏ hàng từ UserID: " + currentUserId);
        
        cartItem.setUserId(currentUserId);

        Optional<CartItem> existingItem = cartItemRepository.findByUserIdAndProductId(
            cartItem.getUserId(), 
            cartItem.getProductId()
        );

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + cartItem.getQuantity());
            CartItem savedItem = cartItemRepository.save(item);
            return ResponseEntity.ok(savedItem);
        } else {
            CartItem savedItem = cartItemRepository.save(cartItem);
            return ResponseEntity.ok(savedItem);
        }
    }
    @GetMapping
    public ResponseEntity<List<CartItem>> getCartItems() {

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    Long currentUserId = (Long) authentication.getPrincipal();

    System.out.println("Lấy giỏ hàng cho UserID: " + currentUserId);

    List<CartItem> cartItems = cartItemRepository.findByUserId(currentUserId);

    return ResponseEntity.ok(cartItems);
    }
    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> deleteCartItem(@PathVariable Long itemId) {

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    Long currentUserId = (Long) authentication.getPrincipal();

    Optional<CartItem> itemOptional = cartItemRepository.findById(itemId);

    if (itemOptional.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    CartItem item = itemOptional.get();
    if (!item.getUserId().equals(currentUserId)) {
        return ResponseEntity.status(403).build();
    }

    cartItemRepository.delete(item);

    return ResponseEntity.ok().build();
    }
    @PutMapping("/update/{itemId}")
    public ResponseEntity<CartItem> updateCartItem(@PathVariable Long itemId,
                                             @RequestParam Integer quantity) {

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    Long currentUserId = (Long) authentication.getPrincipal();

    Optional<CartItem> itemOptional = cartItemRepository.findById(itemId);

    if (itemOptional.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    CartItem item = itemOptional.get();
    if (!item.getUserId().equals(currentUserId)) {
        return ResponseEntity.status(403).build();
    }

    if (quantity <= 0) {
        cartItemRepository.delete(item);
        return ResponseEntity.ok(null);
    } else {
        item.setQuantity(quantity);
        CartItem savedItem = cartItemRepository.save(item);
        return ResponseEntity.ok(savedItem);
    }
    }
}
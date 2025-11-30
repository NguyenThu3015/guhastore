
package com.guhastore.serviceproducts.controller;

import com.guhastore.serviceproducts.dto.PurchaseOrderRequestDto;
import com.guhastore.serviceproducts.model.PurchaseOrder;
import com.guhastore.serviceproducts.repository.PurchaseOrderRepository;
import com.guhastore.serviceproducts.service.PurchaseOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/purchase-orders")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasAuthority('ADMIN')")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderService purchaseOrderService;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    
    @PostMapping
    public ResponseEntity<PurchaseOrder> createPurchaseOrder(@RequestBody PurchaseOrderRequestDto request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String adminName = "Admin " + authentication.getPrincipal().toString();
        PurchaseOrder po = purchaseOrderService.createAndCompletePurchaseOrder(request, adminName);
        return ResponseEntity.ok(po);
    }

    
    @GetMapping
    public ResponseEntity<List<PurchaseOrder>> getPurchaseOrderHistory() {
        return ResponseEntity.ok(purchaseOrderRepository.findAllByOrderByImportDateDesc());
    }

    
    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrder> getPurchaseOrderById(@PathVariable Long id) {
        Optional<PurchaseOrder> purchaseOrderOptional = purchaseOrderRepository.findById(id);
        if (purchaseOrderOptional.isPresent()) {
            return ResponseEntity.ok(purchaseOrderOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
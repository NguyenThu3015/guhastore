package com.guhastore.serviceproducts.repository;

import com.guhastore.serviceproducts.model.PurchaseOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseOrderItemRepository extends JpaRepository<PurchaseOrderItem, Long> {
    void deleteByProductId(Long productId);
}
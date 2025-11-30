//com.guhastore.service_orders.dto
package com.guhastore.service_orders.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor 
public class TopProductDto {
    private Long productId;
    private Long totalSold; 
}
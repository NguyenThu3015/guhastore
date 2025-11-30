//com.guhastore.serviceorders.dto
package com.guhastore.service_orders.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class OrderStatusCountDto {
    private String status;
    private Long count;
}
package com.guhastore.serviceusers.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JwtAuthResponseDto {
    private String token;
    private String tokenType = "Bearer";
    private UserDto user;

    public JwtAuthResponseDto(String token, UserDto user) {
        this.token = token;
        this.user = user;
    }
}
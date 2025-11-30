package com.guhastore.serviceusers.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterDto {
    private String fullName;
    private String email;
    private String password;
    private String phoneNumber;
    private String address;
}
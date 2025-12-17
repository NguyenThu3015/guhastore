package com.guhastore.serviceusers.dto;

import lombok.Getter;
import lombok.Setter;

import com.guhastore.serviceusers.model.Role; 

@Getter
@Setter
public class UserDto {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String address;
    
    
    private Role role; 
}
package com.ecommerse.shopify.model; 

import lombok.Data;

@Data
public class UserDTO {
    private String username;
    private String email;
    private String password;
}
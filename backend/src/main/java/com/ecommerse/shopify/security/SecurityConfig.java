package com.ecommerse.shopify.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            //  (Commonly required for stateless APIs/testing)
            .csrf(csrf -> csrf.disable())
            
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOrigins(List.of("http://localhost:5173"));
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(List.of("*"));
                return config;
            }))

            // defining URLs -- public / protected
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // <-- tnan user mka login/register
                .anyRequest().authenticated()               // <-- E lock tanan
            );

        return http.build();
    }
}
package com.guhastore.serviceproducts.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter; 

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            ) 
            .authorizeHttpRequests(auth -> auth
            
                .requestMatchers("/uploads/**").permitAll()

                //  API CÔNG KHAI 
                .requestMatchers(HttpMethod.GET, "/api/v1/products/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/brands/**", "/api/v1/articles/**").permitAll()
                .requestMatchers("/api/v1/internal/stock/**").permitAll() // API nội bộ
                        
                // --- 3. QUYỀN ADMIN 
                .requestMatchers("/api/v1/admin/statistics/**").hasAuthority("ADMIN") // Thống kê
                .requestMatchers("/api/v1/admin/inventory/**").hasAuthority("ADMIN")  // Kho hàng
                .requestMatchers("/api/v1/admin/purchase-orders/**").hasAuthority("ADMIN") // Nhập hàng

                // --- 4. QUYỀN ADMIN & NHÂN VIÊN
                // Import sản phẩm
                .requestMatchers(HttpMethod.POST, "/api/v1/products/import").hasAnyAuthority("ADMIN", "EMPLOYEE")
                
                // Quản lý Sản phẩm (Thêm/Sửa/Xóa)
                .requestMatchers(HttpMethod.POST, "/api/v1/products/**").hasAnyAuthority("ADMIN", "EMPLOYEE")
                .requestMatchers(HttpMethod.PUT, "/api/v1/products/**").hasAnyAuthority("ADMIN", "EMPLOYEE")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/products/**").hasAnyAuthority("ADMIN", "EMPLOYEE")

                // Quản lý Catalog (Danh mục/Thương hiệu)
                .requestMatchers("/api/v1/categories/**").hasAnyAuthority("ADMIN", "EMPLOYEE")
                .requestMatchers("/api/v1/brands/**").hasAnyAuthority("ADMIN", "EMPLOYEE")
                
                // Quản lý Bài viết
                .requestMatchers("/api/v1/admin/articles/**").hasAnyAuthority("ADMIN", "EMPLOYEE")

                // --- 5. KHÁCH HÀNG (Đã đăng nhập) ---
                .requestMatchers(HttpMethod.POST, "/api/v1/reviews/**").authenticated()

                // --- 6. CÁC API KHÁC ---
                .anyRequest().authenticated() 
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
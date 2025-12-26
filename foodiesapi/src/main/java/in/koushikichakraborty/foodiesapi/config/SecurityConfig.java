package in.koushikichakraborty.foodiesapi.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource; 
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import in.koushikichakraborty.foodiesapi.filters.JwtAuthenticationFilter;
import in.koushikichakraborty.foodiesapi.service.AdminAuthService;


import lombok.AllArgsConstructor;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AdminAuthService adminAuthService;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults()) 
            .csrf(AbstractHttpConfigurer::disable)
            .headers(headers -> headers
            .frameOptions(frame -> frame.disable())
        )
            .authorizeHttpRequests(auth -> auth
                
                // 1. PUBLIC ROUTES
                .requestMatchers("/api/register", "/api/login", "/api/admin/auth/**").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/foods/**").permitAll() // Allow everyone to VIEW foods
                .requestMatchers("/ws-tracking/**").permitAll()

                // 2. ADMIN ONLY ROUTES
                .requestMatchers("/api/foods/**").hasAuthority("ADMIN") 
                .requestMatchers("/api/orders/all", "/api/orders/status/**").hasAuthority("ADMIN")

                // 3. USER/AUTHENTICATED ROUTES
                .requestMatchers("/api/cart/**").authenticated() // Explicitly put cart here
                .requestMatchers("/api/orders/**").authenticated()
                .requestMatchers("/api/orders/confirm").authenticated()
                
                // 4. FALLBACK
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    

    @Bean // <-- 2. ADD @Bean HERE
    public CorsConfigurationSource corsConfigurationSource() { // <-- 3. Make PUBLIC
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173", "http://localhost:5174"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService); 
        authProvider.setPasswordEncoder(passwordEncoder);

        return new ProviderManager(authProvider);
    }

    @Bean
    public UserDetailsService createAdminUserDetailsService() {
        return email -> adminAuthService.loadAdminByEmail(email);
    }
}

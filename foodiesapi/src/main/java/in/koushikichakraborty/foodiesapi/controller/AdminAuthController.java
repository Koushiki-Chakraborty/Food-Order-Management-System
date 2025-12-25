package in.koushikichakraborty.foodiesapi.controller;

import in.koushikichakraborty.foodiesapi.entity.AdminUser;
import in.koushikichakraborty.foodiesapi.io.AuthenticationRequest;
import in.koushikichakraborty.foodiesapi.io.AuthenticationResponse;
import in.koushikichakraborty.foodiesapi.service.AdminAuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/auth")
public class AdminAuthController {

    @Autowired
    private AdminAuthService adminAuthService;

    /**
     * Endpoint for Admin Registration: POST /api/admin/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<String> registerAdmin(@RequestBody AdminUser adminUser) {
        return adminAuthService.registerAdmin(adminUser);
    }

    /**
     * Endpoint for Admin Login and JWT Generation: POST /api/admin/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> loginAdmin(@RequestBody AuthenticationRequest authenticationRequest) {
        // Note: The logic in AdminAuthService handles the AuthenticationException 
        // (Invalid credentials) and returns an appropriate response.
        try {
            AuthenticationResponse response = adminAuthService.loginAdmin(authenticationRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Catch authentication failure (invalid credentials) or user not found
            return ResponseEntity.status(401).build(); 
        }
    }

}

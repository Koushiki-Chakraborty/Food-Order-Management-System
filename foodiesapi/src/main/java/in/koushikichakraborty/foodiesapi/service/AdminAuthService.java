package in.koushikichakraborty.foodiesapi.service;

import in.koushikichakraborty.foodiesapi.entity.AdminUser;
import in.koushikichakraborty.foodiesapi.io.AuthenticationRequest;
import in.koushikichakraborty.foodiesapi.io.AuthenticationResponse;
import in.koushikichakraborty.foodiesapi.repository.AdminUserRepository;
import in.koushikichakraborty.foodiesapi.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;



@Service
public class AdminAuthService {

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Lazy
    @Autowired
    private AuthenticationManager authenticationManager; // Required for login

    @Autowired
    private JwtUtil jwtUtil; // For token generation

    /**
     * Handles admin registration, hashing the password and saving to MongoDB.
     * @param request The request containing name, email, and password.
     * @return ResponseEntity with success or conflict status.
     */
    public ResponseEntity<String> registerAdmin(AdminUser request) {
        if (adminUserRepository.findByEmail(request.getEmail()).isPresent()) {
            return new ResponseEntity<>("Email already registered as an Admin.", HttpStatus.CONFLICT);
        }

        // 1. Hash the password
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        
        // 2. Create and save the new admin user
        AdminUser newAdmin = new AdminUser(
            request.getName(),
            request.getEmail(),
            hashedPassword
        );
        adminUserRepository.save(newAdmin);

        return new ResponseEntity<>("Admin registered successfully.", HttpStatus.CREATED);
    }

    /**
     * Handles admin login, authenticates credentials, and generates a JWT.
     * @param request The request containing email and password.
     * @return AuthenticationResponse containing the JWT token.
     */
    public AuthenticationResponse loginAdmin(AuthenticationRequest request) {
        // 1. Authenticate credentials using Spring Security's AuthenticationManager
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // 2. Load the authenticated user (AdminUser implements UserDetails)
        final AdminUser adminUser = adminUserRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UsernameNotFoundException("Admin not found with email: " + request.getEmail()));

        // 3. Generate JWT
        final String jwt = jwtUtil.generateToken(adminUser);

        // 4. Return the JWT in the response structure
        return new AuthenticationResponse(jwt, adminUser.getEmail());
    }

    /**
     * Loads admin user details by email for internal use (e.g., security filters).
     */
    public AdminUser loadAdminByEmail(String email) {
        return adminUserRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Admin user not found: " + email));
    }
}
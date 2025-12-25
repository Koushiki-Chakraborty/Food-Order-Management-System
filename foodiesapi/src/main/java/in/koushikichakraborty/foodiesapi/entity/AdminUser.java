package in.koushikichakraborty.foodiesapi.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data; // Assumes Lombok is used
import lombok.NoArgsConstructor;

// Spring Security Imports
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Data
@NoArgsConstructor
@Document(collection = "adminUsers")
public class AdminUser implements UserDetails {

    @Id
    private String id;
    private String name;

    @Indexed(unique = true)
    private String email; 
    private String password; // Hashed password storage
    private String role = "ADMIN"; 

    public AdminUser(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    // --- UserDetails Implementation ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Grants the ADMIN role authority
        return Collections.singletonList(new SimpleGrantedAuthority(this.role));
    }

    @Override
    public String getUsername() {
        return this.email;
    }
    
    // Default Security flags
    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}
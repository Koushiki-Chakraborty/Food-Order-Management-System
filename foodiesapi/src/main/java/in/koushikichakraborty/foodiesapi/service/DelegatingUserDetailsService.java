package in.koushikichakraborty.foodiesapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

// This service will check both the regular User repository and the Admin repository.
@Service("delegatingUserDetailsService")
public class DelegatingUserDetailsService implements UserDetailsService{

    @Autowired
    private AppUserDetailsService appUserDetailsService;

    @Autowired
    private AdminAuthService adminAuthService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Try to load as a regular user
        try {
            return appUserDetailsService.loadUserByUsername(email);
        } catch (UsernameNotFoundException e) {
            // 2. If regular user lookup fails, try to load as an admin user
            try {
                // Assuming adminAuthService.loadAdminByEmail returns AdminUser (which implements UserDetails)
                return adminAuthService.loadAdminByEmail(email);
            } catch (UsernameNotFoundException ex) {
                // 3. If still not found, throw the final exception
                throw new UsernameNotFoundException("User or Admin not found with email: " + email);
            }
        }
    }
}

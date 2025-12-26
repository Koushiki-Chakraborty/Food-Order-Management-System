package in.koushikichakraborty.foodiesapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service("delegatingUserDetailsService")
@Primary
public class DelegatingUserDetailsService implements UserDetailsService {

    @Autowired
    private AppUserDetailsService appUserDetailsService;

    @Autowired
    private AdminAuthService adminAuthService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        try {
            // Priority 1: Check regular users
            return appUserDetailsService.loadUserByUsername(email);
        } catch (UsernameNotFoundException e) {
            // Priority 2: Fallback to Admin users
            try {
                return adminAuthService.loadAdminByEmail(email);
            } catch (Exception ex) {
                // Final Fallback: Neither exists
                throw new UsernameNotFoundException("No account found for: " + email);
            }
        }
    }
}

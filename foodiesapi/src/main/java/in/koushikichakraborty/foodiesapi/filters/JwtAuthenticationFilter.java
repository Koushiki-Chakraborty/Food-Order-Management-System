package in.koushikichakraborty.foodiesapi.filters;

import in.koushikichakraborty.foodiesapi.util.JwtUtil;
import java.util.Arrays;
import java.util.List;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.http.HttpMethod; // NEW IMPORT: To check the method
import org.springframework.security.web.util.matcher.AntPathRequestMatcher; // NEW IMPORT
import org.springframework.security.web.util.matcher.RequestMatcher;

import java.io.IOException;


@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // Define public paths that should be ignored by the filter
    private final List<RequestMatcher> publicMatchers = Arrays.asList(
        // Allow GET access to /api/foods without a token (for menu viewing)
        new AntPathRequestMatcher("/api/foods", HttpMethod.GET.name()), 
        
        // Allow POST access for registration/login
        new AntPathRequestMatcher("/api/register", HttpMethod.POST.name()),
        new AntPathRequestMatcher("/api/login", HttpMethod.POST.name()),
        new AntPathRequestMatcher("/api/admin/auth/register", HttpMethod.POST.name()),
        new AntPathRequestMatcher("/api/admin/auth/login", HttpMethod.POST.name()),

        new AntPathRequestMatcher("/ws-tracking/**")
    );

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    @Qualifier("delegatingUserDetailsService")
    private UserDetailsService userDetailsService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        return path.startsWith("/ws"); // This tells the filter "don't look for a token if it's a websocket"
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            
            try {
                String email = jwtUtil.extractUsername(token);

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                    if (jwtUtil.validateToken(token, userDetails)) {
                        UsernamePasswordAuthenticationToken authenticationToken =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        userDetails.getAuthorities()
                                );
                        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                        
                        // CHANGE: Helpful log for development
                        System.out.println("JWT Filter: Authenticated user " + email);
                    } else {
                        // CHANGE: Log if validation fails
                        System.out.println("JWT Filter: Token validation FAILED for " + email);
                    }
                }
            } catch (Exception e) {
                // CHANGE: Log the specific error (expired token, malformed, etc.)
                System.err.println("JWT Filter Error: " + e.getMessage());
            }
        } else {
            // CHANGE: Added a check for protected URLs missing a token
            String path = request.getRequestURI();
            if (!path.equals("/api/login") && !path.equals("/api/register") && !path.equals("/api/foods")) {
                System.out.println("JWT Filter: No Bearer token found for protected path: " + path);
            }
        }

        filterChain.doFilter(request, response);
    }


}

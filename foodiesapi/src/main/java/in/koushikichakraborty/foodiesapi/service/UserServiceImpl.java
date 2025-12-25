package in.koushikichakraborty.foodiesapi.service;


import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import in.koushikichakraborty.foodiesapi.entity.UserEntity;
import in.koushikichakraborty.foodiesapi.io.UserRequest;
import in.koushikichakraborty.foodiesapi.io.UserResponse;
import in.koushikichakraborty.foodiesapi.repository.UserRepository;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserServiceImpl implements userService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationFacade authenticationFacade;

    @Override
    public UserResponse registerUser(UserRequest request) {
        UserEntity newUser = convertToEntity(request);
        newUser = userRepository.save(newUser);
        return convertToResponse(newUser);
    }

    private UserEntity convertToEntity(UserRequest request){
        return UserEntity.builder()
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .name(request.getName())
            .build();

    }

    private UserResponse convertToResponse(UserEntity registeredUser){
        return UserResponse.builder()
            .id(registeredUser.getId())
            .name(registeredUser.getName())
            .email(registeredUser.getEmail())
            .build();
    }

    @Override
    public String findByUserId() {
        var auth = authenticationFacade.getAuthentication();
    if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not logged in");
    }
    String loggedInUserEmail = auth.getName();
    UserEntity loggedInUser = userRepository.findByEmail(loggedInUserEmail)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + loggedInUserEmail));
    return loggedInUser.getId();
    }
}

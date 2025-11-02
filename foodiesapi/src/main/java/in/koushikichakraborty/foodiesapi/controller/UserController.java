package in.koushikichakraborty.foodiesapi.controller;

import org.springframework.http.HttpStatus;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import in.koushikichakraborty.foodiesapi.io.UserRequest;
import in.koushikichakraborty.foodiesapi.io.UserResponse;
import in.koushikichakraborty.foodiesapi.service.userService;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class UserController {

    private final userService userService;
    

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@RequestBody UserRequest request){
        return userService.registerUser(request);
       
    }

}

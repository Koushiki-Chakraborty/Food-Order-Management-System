package in.koushikichakraborty.foodiesapi.service;

import in.koushikichakraborty.foodiesapi.io.UserRequest;
import in.koushikichakraborty.foodiesapi.io.UserResponse;

public interface userService {
    UserResponse registerUser(UserRequest request);

    String findByUserId();
}

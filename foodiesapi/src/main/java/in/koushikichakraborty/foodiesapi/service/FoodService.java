package in.koushikichakraborty.foodiesapi.service;
import org.springframework.web.multipart.MultipartFile;

import in.koushikichakraborty.foodiesapi.io.FoodRequest;
import in.koushikichakraborty.foodiesapi.io.FoodResponse;

public interface FoodService {

    String uploadFile(MultipartFile file);

    FoodResponse addFood(FoodRequest request, MultipartFile file);
}

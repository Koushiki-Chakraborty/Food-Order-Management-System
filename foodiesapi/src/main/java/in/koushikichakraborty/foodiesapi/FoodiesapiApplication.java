package in.koushikichakraborty.foodiesapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class FoodiesapiApplication {

	public static void main(String[] args) {
		SpringApplication.run(FoodiesapiApplication.class, args);
	}

}

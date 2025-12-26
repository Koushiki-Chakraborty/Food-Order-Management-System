package in.koushikichakraborty.foodiesapi.io;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DriverLocation {
    private String orderId;
    private double lat;
    private double lng;
    private String status; 

}

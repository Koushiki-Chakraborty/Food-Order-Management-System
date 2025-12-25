package in.koushikichakraborty.foodiesapi.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DriverLocation {

    private String orderId;
    private double latitude;
    private double longitude;
}

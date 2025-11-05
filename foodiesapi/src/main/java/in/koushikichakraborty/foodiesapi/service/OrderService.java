package in.koushikichakraborty.foodiesapi.service;

import java.util.List;


import com.stripe.exception.StripeException;

import in.koushikichakraborty.foodiesapi.io.OrderRequest;
import in.koushikichakraborty.foodiesapi.io.OrderResponse;

public interface OrderService {

    String createCheckoutSession(OrderRequest request) throws StripeException;

    void confirmOrderPayment(String orderId);

    
    List<OrderResponse> getUserOrders();
    void removeOrder(String orderId);
    List<OrderResponse> getOrdersOfAllUsers();
    void updateOrderStatus(String orderId, String status);
} 
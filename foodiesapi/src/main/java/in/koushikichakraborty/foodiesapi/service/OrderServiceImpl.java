package in.koushikichakraborty.foodiesapi.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;


import in.koushikichakraborty.foodiesapi.entity.FoodEntity;
import in.koushikichakraborty.foodiesapi.repository.CartRepository;
import in.koushikichakraborty.foodiesapi.repository.FoodRepository; 
import in.koushikichakraborty.foodiesapi.io.OrderItem; 
import in.koushikichakraborty.foodiesapi.entity.OrderEntity;
import in.koushikichakraborty.foodiesapi.io.OrderRequest;
import in.koushikichakraborty.foodiesapi.io.OrderResponse;
import in.koushikichakraborty.foodiesapi.repository.OrderRepository;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.annotation.PostConstruct; 

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final userService userService; 
    private final FoodRepository foodRepository; 

    @Value("${stripe.api.key}")
    private String STRIPE_API_KEY;

    @PostConstruct
    public void initStripe() {
        String keyUsed = STRIPE_API_KEY;
        Stripe.apiKey = keyUsed;
    System.out.println("Stripe Client Initialized with Key: " + keyUsed);
    }

    private double recalculateAmount(List<OrderItem> orderedItems) {
        double totalAmount = 0.0;
        for (OrderItem item : orderedItems) {
            FoodEntity foodItem = foodRepository.findById(item.getFoodId())
                    .orElseThrow(() -> new RuntimeException("Food item not found: " + item.getFoodId()));
            
            totalAmount += foodItem.getPrice() * item.getQuantity();
        }
        return totalAmount;
    }

    private OrderEntity convertToEntity(OrderRequest request) {
        return OrderEntity.builder()
                .userAddress(request.getUserAddress())
                .orderedItems(request.getOrderedItems())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .build();
    }

    private OrderResponse convertOrderEntityToResponse(OrderEntity order) {
        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .userAddress(order.getUserAddress())
                .amount(order.getAmount())
                .paymentStatus(order.getPaymentStatus())
                .orderStatus(order.getOrderStatus())
                .email(order.getEmail())
                .phoneNumber(order.getPhoneNumber())
                .stripePaymentIntentId(order.getStripePaymentIntentId())
                .orderedItems(order.getOrderedItems())
                .build();
    }

    @Override
    public List<OrderResponse> getUserOrders() {
        String loggedInUserId = userService.findByUserId();
        List<OrderEntity> list = orderRepository.findByUserId(loggedInUserId);
        return list.stream()
                .map(this::convertOrderEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void removeOrder(String orderId) {
       
        orderRepository.deleteById(orderId);
    }

    @Override
    public List<OrderResponse> getOrdersOfAllUsers() {
        List<OrderEntity> list = orderRepository.findAll();
        return list.stream()
                .map(this::convertOrderEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void updateOrderStatus(String orderId, String status) {
        OrderEntity entity = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        entity.setOrderStatus(status);
        orderRepository.save(entity);
    }


    @Override
    public String createCheckoutSession(OrderRequest request) throws StripeException {
        String loggedInUserId = userService.findByUserId();

        List<OrderItem> validOrderItems = request.getOrderedItems().stream()
                .filter(item -> item.getQuantity() > 0)
                .collect(Collectors.toList());

        
        double subtotal = recalculateAmount(validOrderItems);
        double tax = subtotal * 0.10;      // 10% tax
        double shipping = (subtotal > 0) ? 10.00 : 0.00; // $10 shipping
        double totalAmount = subtotal + tax + shipping;

        
        OrderEntity newOrder = convertToEntity(request);
        newOrder.setUserId(loggedInUserId);
        newOrder.setAmount(totalAmount); // Use the new secure total
        newOrder.setOrderStatus("Pending Payment");
        newOrder.setPaymentStatus("pending");
        newOrder.setOrderedItems(request.getOrderedItems());
        OrderEntity savedOrder = orderRepository.save(newOrder);
        String orderId = savedOrder.getId();

      
        String successUrl = "http://localhost:5173/verify?success=true&orderId=" + orderId;
        String cancelUrl = "http://localhost:5173/cart?cancelled=true&orderId=" + orderId;

        
        List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();
        
       
       for (OrderItem item : validOrderItems) {
            FoodEntity foodItem = foodRepository.findById(item.getFoodId())
                    .orElseThrow(() -> new RuntimeException("Food item not found"));
            
            lineItems.add(
                SessionCreateParams.LineItem.builder()
                    .setPriceData(
                        SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency("inr")
                            .setUnitAmount((long) (foodItem.getPrice() * 100))
                            .setProductData(
                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                    .setName(foodItem.getName())
                                    .build()
                            ).build()
                    ).setQuantity(Long.valueOf(item.getQuantity()))
                    .build()
            );
        }

        
        lineItems.add(
            SessionCreateParams.LineItem.builder()
                .setPriceData(
                    SessionCreateParams.LineItem.PriceData.builder()
                        .setCurrency("inr")
                        .setUnitAmount((long) (tax * 100)) 
                        .setProductData(
                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                .setName("Tax (10%)")
                                .build()
                        ).build()
                ).setQuantity(1L)
                .build()
        );

        
        lineItems.add(
            SessionCreateParams.LineItem.builder()
                .setPriceData(
                    SessionCreateParams.LineItem.PriceData.builder()
                        .setCurrency("inr")
                        .setUnitAmount((long) (shipping * 100)) 
                        .setProductData(
                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                .setName("Shipping Fee")
                                .build()
                        ).build()
                ).setQuantity(1L)
                .build()
        );

        SessionCreateParams params = SessionCreateParams.builder()
            .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
            .addAllLineItem(lineItems)
            .setMode(SessionCreateParams.Mode.PAYMENT)
            .setSuccessUrl(successUrl)
            .setCancelUrl(cancelUrl)
            .setClientReferenceId(loggedInUserId) 
            .putMetadata("orderId", orderId)
            .build();
        
        Session session = Session.create(params);

       
        savedOrder.setStripePaymentIntentId(session.getPaymentIntent());
        orderRepository.save(savedOrder);
        
        return session.getUrl();
    }

    @Override
    public void confirmOrderPayment(String orderId) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        
        order.setPaymentStatus("succeeded"); 
        order.setOrderStatus("Paid");
        orderRepository.save(order);

       
        cartRepository.deleteByUserId(order.getUserId());

    }
}
package in.koushikichakraborty.foodiesapi.service;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


import org.springframework.stereotype.Service;

import in.koushikichakraborty.foodiesapi.entity.CartEntity;
import in.koushikichakraborty.foodiesapi.io.CartRequest;
import in.koushikichakraborty.foodiesapi.io.CartResponse;
import in.koushikichakraborty.foodiesapi.repository.CartRepository;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CartServiceImpl implements CartService{

    private final CartRepository cartRepository;
    private final userService userService;

    private CartEntity getPrimaryCart(String userId) {
        // Since CartRepository now returns List<CartEntity>, we use it here.
        List<CartEntity> cartList = cartRepository.findByUserId(userId);
        
        if (cartList.isEmpty()) {
            // No cart found, return a new empty cart (assuming CartEntity has a suitable constructor)
            // NOTE: If CartEntity constructor takes only userId and Map, you must adjust this line.
            return new CartEntity(userId, new HashMap<>());
        }
        
        // Use the first cart found as the primary cart
        CartEntity primaryCart = cartList.get(0);
        
        // Cleanup: Delete any duplicate carts that caused the original crash
        if (cartList.size() > 1) {
            for (int i = 1; i < cartList.size(); i++) {
                cartRepository.delete(cartList.get(i));
            }
        }
        return primaryCart;
    }

    @Override
    public CartResponse addToCart(CartRequest request) {
        String loggedInUserId = userService.findByUserId();
        CartEntity cart = getPrimaryCart(loggedInUserId); 
        Map<String, Integer> cartItems = cart.getItems();
        cartItems.put(request.getFoodId(), cartItems.getOrDefault(request.getFoodId(), 0) + 1);
        cart.setItems(cartItems);
        cart = cartRepository.save(cart);
        return convertToResponse(cart);

    }

    private CartResponse convertToResponse(CartEntity cartEntity){
        return CartResponse.builder()
            .id(cartEntity.getId())
            .userId(cartEntity.getUserId())
            .items(cartEntity.getItems())
            .build();
    }

    @Override
    public CartResponse getCart() {
        String loggedInUserId = userService.findByUserId();
        CartEntity entity = getPrimaryCart(loggedInUserId);
        return convertToResponse(entity);
    }

    @Override
    public void clearCart(){
        String loggedInUserId = userService.findByUserId();
        cartRepository.deleteByUserId(loggedInUserId);

    }

    @Override
    public CartResponse removeFromCart(CartRequest cartRequest) {
        String loggedInUserId = userService.findByUserId();
        // FIX: Use helper function to get the primary cart
        CartEntity entity = getPrimaryCart(loggedInUserId); 
        
        Map<String, Integer> cartItems = entity.getItems();
        String foodId = cartRequest.getFoodId();

        if (cartItems.containsKey(foodId)) {
            int currentQty = cartItems.get(foodId);
            
            // --- FIX: Only decrease if > 0. Item stays in map when quantity reaches 0. ---
            if (currentQty > 0) {
                cartItems.put(foodId, currentQty - 1);
            }
            
            entity.setItems(cartItems);
            entity = cartRepository.save(entity);
        }
        return convertToResponse(entity);
    }

    @Override
    public void deleteItemFromCart(String foodId) {
        String loggedInUserId = userService.findByUserId();
        CartEntity entity = getPrimaryCart(loggedInUserId);
        
        Map<String, Integer> cartItems = entity.getItems();
        
        if (cartItems.containsKey(foodId)) {
            cartItems.remove(foodId);
            entity.setItems(cartItems);
            cartRepository.save(entity);
    }
}
}

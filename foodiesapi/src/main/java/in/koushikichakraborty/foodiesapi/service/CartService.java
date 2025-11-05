package in.koushikichakraborty.foodiesapi.service;

import in.koushikichakraborty.foodiesapi.io.CartRequest;
import in.koushikichakraborty.foodiesapi.io.CartResponse;

public interface CartService {

    CartResponse addToCart(CartRequest request);

    CartResponse getCart();

    void clearCart();

    CartResponse removeFromCart(CartRequest cartRequest);

    void deleteItemFromCart(String foodId);

}

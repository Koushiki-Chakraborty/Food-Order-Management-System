package in.koushikichakraborty.foodiesapi.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;


@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {

        // This is the prefix for messages going FROM server TO user
        config.enableSimpleBroker("/topic"); 
        
        // This is the prefix for messages coming FROM driver TO server
        config.setApplicationDestinationPrefixes("/app"); 
    }

        @Override
            public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
            registration.setMessageSizeLimit(512 * 1024); // 512KB
            registration.setSendBufferSizeLimit(1024 * 1024); // 1MB
            registration.setSendTimeLimit(20000); // 20 seconds
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // This is the URL the frontend will connect to
        registry.addEndpoint("/ws-tracking")
                .setAllowedOrigins("http://localhost:3000", "http://localhost:5173", "http://localhost:5174")
                .withSockJS();
    }
}

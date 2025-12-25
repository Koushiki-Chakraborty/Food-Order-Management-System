package in.koushikichakraborty.foodiesapi.controller;

import in.koushikichakraborty.foodiesapi.model.DriverLocation;
import in.koushikichakraborty.foodiesapi.service.DriverSimulatorService;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class TrackingController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private DriverSimulatorService driverSimulatorService;

    @MessageMapping("/update-location")
    public void broadcastLocation(DriverLocation location) {
    // This sends to a specific topic like /topic/location/657abc...
    messagingTemplate.convertAndSend("/topic/location/" + location.getOrderId(), location);
    }


    @MessageMapping("/start-tracking")
    public void startTracking(Map<String, Object> payload) {
        String orderId = (String) payload.get("orderId");
    List<Map<String, Double>> path = (List<Map<String, Double>>) payload.get("path");
    
    if (path != null && !path.isEmpty()) {
        driverSimulatorService.addOrderToTrack(orderId, path);
        
        // ✅ Send the 1st coordinate immediately so the bike jumps to the start of the blue line
        Map<String, Double> startNode = path.get(0);
        messagingTemplate.convertAndSend("/topic/location/" + orderId, 
            new DriverLocation(orderId, startNode.get("latitude"), startNode.get("longitude")));
    }
    }
}
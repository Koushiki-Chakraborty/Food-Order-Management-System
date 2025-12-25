package in.koushikichakraborty.foodiesapi.service;

import in.koushikichakraborty.foodiesapi.model.DriverLocation;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Map;

import java.util.concurrent.ConcurrentHashMap;

@Service
@EnableScheduling
public class DriverSimulatorService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Stores the road path for each order
    private final Map<String, List<Map<String, Double>>> pathsMap = new ConcurrentHashMap<>();
    // Stores the current index (how far the bike is along the road)
    private final Map<String, Integer> indexMap = new ConcurrentHashMap<>();

    public void addOrderToTrack(String orderId, List<Map<String, Double>> path) {
        pathsMap.put(orderId, path);
        indexMap.put(orderId, 0);
    }
    @Scheduled(fixedRate = 500) // Increase frequency to 500ms for smoother movement
    public void simulateDriverMovement() {
    for (String orderId : pathsMap.keySet()) {
        List<Map<String, Double>> path = pathsMap.get(orderId);
        int currentIndex = indexMap.get(orderId);

        // ✅ Change '+ 1' to '+ 10' or '+ 20' to skip tiny points and move faster along the road
        int nextIndex = currentIndex + 20; 

        if (nextIndex < path.size()) {
            Map<String, Double> coords = path.get(nextIndex);
            
            DriverLocation location = new DriverLocation(
                orderId, 
                coords.get("latitude"), 
                coords.get("longitude")
            );

            messagingTemplate.convertAndSend("/topic/location/" + orderId, location);
            
            indexMap.put(orderId, nextIndex);
        } else {
            Map<String, Double> finalPoint = path.get(path.size() - 1);
            // Send the exact destination one last time
            messagingTemplate.convertAndSend("/topic/location/" + orderId, 
                new DriverLocation(orderId, finalPoint.get("latitude"), finalPoint.get("longitude")));
            
            // Cleanup memory
            pathsMap.remove(orderId);
            indexMap.remove(orderId);
            System.out.println("Driver has arrived at Durgapur for order: " + orderId);
        }
    }
}
}
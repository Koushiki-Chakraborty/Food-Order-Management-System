package in.koushikichakraborty.foodiesapi.service;

import in.koushikichakraborty.foodiesapi.io.DriverLocation;
import in.koushikichakraborty.foodiesapi.repository.OrderRepository;
import in.koushikichakraborty.foodiesapi.entity.OrderEntity;
import lombok.RequiredArgsConstructor;


import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class DriverSimulatorService {
    private final SimpMessagingTemplate messagingTemplate;
    private final OrderRepository orderRepository;

    // A simplified route from Kolkata to Durgapur
    private final double[][] route = {
         {22.5726, 88.3639},
            {22.60, 88.30},
            {22.65, 88.20},
            {22.72, 88.10},
            {22.80, 88.00},
            {22.90, 87.90},
            {22.98, 87.85},
            {23.10, 87.70},
            {23.25, 87.50},
            {23.35, 87.40},
            {23.4846, 87.3188}
    };

    @Async
    public void startDeliverySimulation(String orderId) {
        int microSteps = 20; // smaller = smoother

    for (int i = 0; i < route.length - 1; i++) {

        double startLat = route[i][0];
        double startLng = route[i][1];

        double endLat = route[i + 1][0];
        double endLng = route[i + 1][1];

        double latStep = (endLat - startLat) / microSteps;
        double lngStep = (endLng - startLng) / microSteps;

        double currentLat = startLat;
        double currentLng = startLng;

        for (int j = 0; j < microSteps; j++) {

            DriverLocation loc =
            new DriverLocation(orderId, currentLat, currentLng, "MOVING");

            // System.out.println(
            //     "Driver moving -> lat=" + currentLat + ", lng=" + currentLng
            // );

            messagingTemplate.convertAndSend(
                "/topic/delivery/" + orderId,
                loc
            );

            currentLat += latStep;
            currentLng += lngStep;

            try {
                Thread.sleep(500); // smooth movement
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
            double[] finalPoint = route[route.length - 1];

            orderRepository.findById(orderId).ifPresent(order -> {
                order.setOrderStatus("Delivered");
                orderRepository.save(order);
            });

                DriverLocation completed =
                    new DriverLocation(
                        orderId,
                        finalPoint[0],
                        finalPoint[1],
                        "COMPLETED"
                    );

                messagingTemplate.convertAndSend(
                    "/topic/delivery/" + orderId,
                    completed
                );

                System.out.println("Delivery completed for order " + orderId);

    }
}
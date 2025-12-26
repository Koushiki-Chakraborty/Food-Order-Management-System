import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { assets } from "../../assets/assets";

const bikeIcon = new L.Icon({
  iconUrl: assets.bike, // Use the bike property from the assets object
  iconSize: [40, 40],
  iconAnchor: [20, 20], // Centering the anchor makes rotation look better later
  popupAnchor: [0, -20],
});

// Helper to center map when driver moves
const RecenterMap = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(coords);
  }, [coords]);
  return null;
};

const MapBounds = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, points]);
  return null;
};

const TrackOrder = () => {
  const { orderId } = useParams();
  const [driverPos, setDriverPos] = useState([22.5726, 88.3639]); // Start: Kolkata
  const [showMap, setShowMap] = useState(true);

  const fullRoute = [
    [22.5726, 88.3639], // Kolkata
    [22.621, 88.393], // Dankuni
    [22.9868, 87.855], // Bardhaman
    [23.2324, 87.8631], // Panagarh
    [23.4846, 87.3188], // Durgapur
  ];

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log("Connected to Tracker");
      stompClient.subscribe(`/topic/delivery/${orderId}`, (message) => {
        console.log("Coordinate received:", message.body);
        const location = JSON.parse(message.body);

        if (location.status === "COMPLETED") {
          setDriverPos([location.lat, location.lng]);
          setShowMap(false);
          alert("Delivery Completed!");
          return;
        }

        setDriverPos([location.lat, location.lng]);
      });
    });

    return () => {
      if (stompClient) stompClient.disconnect();
    };
  }, [orderId]);

  return (
    <div className="container py-5">
      <h3>Live Tracking for Order: {orderId}</h3>
      {showMap && (
        <div
          className="card shadow-sm"
          style={{ height: "500px", overflow: "hidden" }}
        >
          <MapContainer
            center={driverPos}
            zoom={8}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

            <Polyline
              positions={fullRoute}
              color="blue"
              weight={5}
              opacity={0.6}
            />

            <Marker position={fullRoute[0]}>
              <Popup>Restaurant: Foodies Kitchen</Popup>
            </Marker>

            <Marker position={driverPos} icon={bikeIcon}>
              <Popup>Driver is here!</Popup>
            </Marker>

            <Marker position={fullRoute[fullRoute.length - 1]}>
              <Popup>Your Location</Popup>
            </Marker>

            <RecenterMap coords={driverPos} />
          </MapContainer>
        </div>
      )}

      <div className="mt-3">
        <p>
          <b>Current Status:</b>{" "}
          {showMap
            ? "Driver is on the way"
            : "Delivery Completed Successfully!"}
        </p>
      </div>
    </div>
  );
};

export default TrackOrder;

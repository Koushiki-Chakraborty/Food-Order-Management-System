# 🍔 FOOD ORDER MANAGEMENT SYSTEM (FULL-STACK)

A robust, three-tier food delivery application designed for both seamless user ordering and secure administrative management. The project features a modern stack with a focus on secure payment processing and data integrity.

---

## ✨ FEATURES

### 👨‍🍳 USER FEATURES
- **Authentication:** Secure login and registration using **JWT**.  
- **Cart Persistence:** Shopping cart contents are persistently stored in the database.  
- **Secure Checkout:** Integrates **Stripe Checkout Session** (redirect flow) for secure payments.  
- **Order Tracking:** View complete history of past orders with current **status updates**.  
- **Order Details Modal:** Detailed modal breakdown showing itemized prices, subtotal, tax, shipping, and grand total.  
- **Reorder Functionality:** Quickly add items from a previous order back to the current cart.  

### 🧑‍💼 ADMIN FEATURES
- **Dashboard Overview:** View a list of all user orders (`/api/orders/all`).  
- **Status Management:** Update order status (e.g., *Food Preparing*, *Out for Delivery*) via a dedicated **PATCH** endpoint.  
- **Customer Data Retrieval:** View customer contact details (Address, Phone, Email) via a specialized modal without exposing them in the main table view.  

---

## 🛡️ SECURITY HIGHLIGHTS
- **Server-Side Price Validation:** The final order amount, tax, and shipping are securely calculated on the server using database prices, preventing client-side manipulation.  
- **Data Robustness:** Logic implemented to handle concurrent requests and prevent database crashes from duplicate cart records.  
- **Token-Based Access:** All order and cart endpoints require a valid **JWT** (authenticated user).  

---

## 💻 TECH STACK

### 🧠 BACKEND (`foodiesapi`)
| Technology | Description |
|-------------|-------------|
| **Language** | Java 23 |
| **Framework** | Spring Boot 3.5.7 |
| **Database** | MongoDB |
| **Security** | Spring Security 6 (JWT Authentication) |
| **Payment Gateway** | Stripe Java SDK (Checkout Sessions) |

### 💅 FRONTEND (`foodies` & `adminpanel`)
| Technology | Description |
|-------------|-------------|
| **Library** | React.js (Functional Components & Hooks) |
| **Styling** | Bootstrap 5 |
| **Routing** | React Router DOM |
| **State Management** | React Context API (Global State) |

## 📁 PROJECT STRUCTURE
Food-Order-Management-System/
├── adminpanel/ # FRONTEND: Admin Interface
├── foodies/ # FRONTEND: User Interface
├── foodiesapi/ # BACKEND: Spring Boot API
└── package.json

---

## 🚀 SETUP AND INSTALLATION

### 1️⃣ DATABASE AND ENVIRONMENT
- Ensure **MongoDB** is running locally (default port `27017`).  
- Set up your **Stripe API Keys** in:
  foodiesapi/src/main/resources/application.properties
  Example:
```properties
stripe.api.key=sk_test_...
# NOTE: Use the Secret Key here.
```
### 2️⃣ BACKEND SETUP (foodiesapi)
```
cd foodiesapi
./mvnw clean install
./mvnw spring-boot:run
```
# 🧡 Developed with passion for clean code, data integrity, and a seamless food ordering experience.
The API will run at: http://localhost:8080

### 3️⃣ FRONTEND SETUP (foodies & adminpanel)

For both frontend applications (run separately on different ports):
```
npm install
```

Set the Stripe Publishable Key in the constants file:
foodies/src/util/constants.js

Then start each application:
```
npm run dev
```
## 🧾 NOTES

Ensure both frontends and backend are running simultaneously.

Use your own Stripe test keys for development.

The admin panel and user panel are independent React apps communicating with the same backend.


---

## 📁 PROJECT STRUCTURE

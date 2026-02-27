# Skyway Suites - Database Integration Guide

## Overview

This application is built with a clean separation between the frontend and backend. All database operations are centralized in the API service layer, making it easy to connect to your hosted database.

## Integration Steps

### 1. Update the API Service Layer

Open `/src/app/services/api.ts` and update the following:

#### Step 1: Set your API base URL
```typescript
const BASE_URL = 'YOUR_DATABASE_API_URL'; // Replace with your actual backend URL
// Example: 'https://api.yourserver.com' or 'http://localhost:3000/api'
```

#### Step 2: Replace mock functions with real API calls

Each function has a TODO comment showing where to add your API call. Example:

```typescript
// BEFORE (Mock):
export const getProperties = async (): Promise<Property[]> => {
  return Promise.resolve(mockProperties);
};

// AFTER (Real API):
export const getProperties = async (): Promise<Property[]> => {
  const response = await fetch(`${BASE_URL}/properties`);
  return response.json();
};
```

### 2. API Endpoints You Need to Create

Your backend should provide the following REST API endpoints:

#### Properties
- `GET /properties` - Get all properties
- `GET /properties/:id` - Get property by ID
- `POST /properties` - Create new property
- `PUT /properties/:id` - Update property
- `DELETE /properties/:id` - Delete property

#### Features
- `GET /features` - Get all features
- `POST /features` - Create new feature
- `PUT /features/:id` - Update feature
- `DELETE /features/:id` - Delete feature

#### Customers
- `GET /customers` - Get all customers
- `POST /customers` - Create new customer
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

#### Bookings
- `GET /bookings` - Get all bookings
- `POST /bookings` - Create new booking

#### Payments
- `GET /payments` - Get all payments
- `POST /payments` - Create new payment

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout

### 3. Database Schema

Your database should have the following tables:

#### Properties Table
```sql
CREATE TABLE properties (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  bedrooms INT NOT NULL,
  bathrooms INT NOT NULL,
  area INT NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Property Images Table
```sql
CREATE TABLE property_images (
  id VARCHAR(255) PRIMARY KEY,
  property_id VARCHAR(255) REFERENCES properties(id),
  url TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false
);
```

#### Property Features Table (Many-to-Many)
```sql
CREATE TABLE property_features (
  property_id VARCHAR(255) REFERENCES properties(id),
  feature_id VARCHAR(255) REFERENCES features(id),
  PRIMARY KEY (property_id, feature_id)
);
```

#### Features Table
```sql
CREATE TABLE features (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(50)
);
```

#### Customers Table
```sql
CREATE TABLE customers (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  photo TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Users Table (for authentication)
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Bookings Table
```sql
CREATE TABLE bookings (
  id VARCHAR(255) PRIMARY KEY,
  property_id VARCHAR(255) REFERENCES properties(id),
  customer_id VARCHAR(255) REFERENCES customers(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Payments Table
```sql
CREATE TABLE payments (
  id VARCHAR(255) PRIMARY KEY,
  booking_id VARCHAR(255) REFERENCES bookings(id),
  customer_id VARCHAR(255) REFERENCES customers(id),
  amount DECIMAL(10,2) NOT NULL,
  method VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Authentication Flow

The application uses localStorage for session management. When connecting to your backend:

1. Your `/auth/login` endpoint should return a JWT token or session ID
2. Store this token in the User object
3. Include the token in subsequent API requests
4. Implement proper token validation on your backend

Example:
```typescript
export const login = async (email: string, password: string): Promise<User> => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  
  return data.user;
};
```

### 5. Environment Variables

Consider using environment variables for sensitive configuration:

Create a `.env` file:
```
VITE_API_BASE_URL=https://api.yourserver.com
VITE_MPESA_TILL_NUMBER=your_till_number
VITE_STRIPE_PUBLIC_KEY=pk_...
```

Then update `api.ts`:
```typescript
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

### 6. Error Handling

Add proper error handling to all API calls:

```typescript
export const getProperties = async (): Promise<Property[]> => {
  try {
    const response = await fetch(`${BASE_URL}/properties`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};
```

### 7. CORS Configuration

Ensure your backend allows requests from your frontend domain:

```javascript
// Express.js example
app.use(cors({
  origin: 'https://yourfrontend.com',
  credentials: true
}));
```

## Testing

1. Start with one endpoint (e.g., `getProperties`)
2. Test it thoroughly
3. Gradually migrate other endpoints
4. Keep mock data as fallback during development

## Security Considerations

- ✅ Use HTTPS for all API calls in production
- ✅ Implement proper authentication and authorization
- ✅ Validate all input on the backend
- ✅ Use prepared statements to prevent SQL injection
- ✅ Hash passwords using bcrypt or similar
- ✅ Implement rate limiting
- ✅ Sanitize user input
- ✅ Use environment variables for secrets

## Admin Access

To access the admin dashboard:
- Login with an email containing "admin" (e.g., admin@example.com) in the demo
- In production, set the user's `role` field to 'admin' in your database

## Support

For questions about database integration, refer to:
- `/src/app/services/api.ts` - All API functions
- `/src/app/contexts/AuthContext.tsx` - Authentication logic
- This documentation file

---

**Note:** This application is structured for easy integration. All database operations go through the API service layer, so you only need to update one file (`api.ts`) to connect your database.

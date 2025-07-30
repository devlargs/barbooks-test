# Barbooks Test

A full-stack order management application with a React frontend and Node.js/Express backend. This project demonstrates a complete CRUD application for managing orders with real-time data visualization and summary statistics.

## 🏗️ Project Structure

```
barbooks-test/
├── backend/          # Node.js/Express API server
├── frontend/         # React/Vite frontend application
└── README.md         # This file
```

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js (>=16.0.0)
- **Framework**: Express.js 5.1.0
- **Language**: TypeScript 5.8.3
- **Database**: SQLite3 with file-based storage
- **Testing**: Jest with Supertest for integration tests
- **Development**: Nodemon for hot reloading
- **Environment**: dotenv for configuration management

### Frontend

- **Framework**: React 19.1.0
- **Build Tool**: Vite 7.0.4
- **Language**: TypeScript 5.8.3
- **Styling**: Tailwind CSS 3.4.0
- **Linting**: ESLint with TypeScript support
- **Development**: Hot module replacement with Vite

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16.0.0 (tested with v20.19.4)
- npm >= 10.0.0 (tested with v10.8.2)
- yarn package manager (alternative)

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory (optional):

   ```bash
   PORT=3000
   DB_PATH=./data.db
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

   The backend will be available at `http://localhost:3000`

5. Run tests:
   ```bash
   npm test
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

4. Build for production:
   ```bash
   npm run build
   ```

## 📊 Features

### Backend API

- **GET /api/orders** - Retrieve orders with pagination and filtering
- **POST /api/orders** - Create new orders with validation
- **DELETE /api/orders/:id** - Delete orders by ID
- **GET /api/orders/summary** - Get order summary statistics

### Frontend Application

- **Orders Dashboard** - Complete CRUD interface for order management
- **Real-time Search** - Filter orders by product name
- **Pagination** - Navigate through large datasets
- **Form Validation** - Client-side validation for order creation
- **Summary Statistics** - Display revenue, median price, top products, and unique product count
- **Responsive Design** - Modern UI built with Tailwind CSS

## 🗄️ Database Schema

The application uses SQLite with the following structure:

```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product TEXT NOT NULL,
  qty INTEGER NOT NULL,
  price REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Available Scripts

### Backend Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run seed` - Seed database with sample data

### Frontend Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🧪 Testing

The project includes comprehensive testing:

- **Backend**: Integration tests using Jest and Supertest
- **Frontend**: Component testing setup with React Testing Library
- **Utilities**: Unit tests for business logic functions

## 📁 Key Files

### Backend

- `src/server.ts` - Express server configuration
- `src/routes/orders.ts` - Order API endpoints
- `src/services/orderService.ts` - Business logic layer
- `src/database/db.ts` - Database connection and setup
- `src/utils/summarizeOrders.ts` - Order summary calculations

### Frontend

- `src/components/OrdersDashboard.tsx` - Main application component
- `src/hooks/` - Custom React hooks for API calls
- `src/App.tsx` - Application entry point

## 🌐 API Endpoints

| Method | Endpoint              | Description                              |
| ------ | --------------------- | ---------------------------------------- |
| GET    | `/api/orders`         | Get orders with pagination and filtering |
| POST   | `/api/orders`         | Create a new order                       |
| DELETE | `/api/orders/:id`     | Delete an order by ID                    |
| GET    | `/api/orders/summary` | Get order summary statistics             |

### Query Parameters

- `limit` - Number of orders to return (default: all)
- `offset` - Number of orders to skip (default: 0)
- `product` - Filter orders by product name

## 🔒 Environment Variables

### Backend

- `PORT` - Server port (default: 3000)
- `DB_PATH` - SQLite database file path (default: ./data.db)

## 📝 Development Notes

- The backend uses SQLite for simplicity and file-based storage
- Frontend communicates with backend via REST API
- All data validation happens on both client and server side
- The application includes comprehensive error handling
- TypeScript is used throughout for type safety

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is for demonstration purposes.

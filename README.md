# NTC Bus Tracker API

A real-time bus tracking system API built with Node.js and Express.js.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Route Management**: CRUD operations for bus routes
- **Bus Management**: Track and manage bus fleet
- **Trip Management**: Real-time trip tracking and management
- **Location Tracking**: Real-time location updates for buses

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS
- **Logging**: Morgan

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ntc-bus-tracker
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database
```bash
# Create PostgreSQL database
createdb ntc_bus_tracker
```

5. Run the application
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout

### Routes
- `GET /api/v1/routes` - Get all routes
- `POST /api/v1/routes` - Create new route
- `GET /api/v1/routes/:id` - Get route by ID
- `PUT /api/v1/routes/:id` - Update route
- `DELETE /api/v1/routes/:id` - Delete route

### Buses
- `GET /api/v1/buses` - Get all buses
- `POST /api/v1/buses` - Add new bus
- `GET /api/v1/buses/:id` - Get bus by ID
- `PUT /api/v1/buses/:id` - Update bus
- `DELETE /api/v1/buses/:id` - Delete bus

### Trips
- `GET /api/v1/trips` - Get all trips
- `POST /api/v1/trips` - Create new trip
- `GET /api/v1/trips/:id` - Get trip by ID
- `PUT /api/v1/trips/:id` - Update trip
- `DELETE /api/v1/trips/:id` - Delete trip

## Environment Variables

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ntc_bus_tracker
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
PORT=3000
NODE_ENV=development
```

## Development

```bash
# Run in development mode
npm run dev

# Run tests
npm test

# Seed database
npm run seed
```

## License

MIT License

# AirWatch Architecture

## System Overview

AirWatch is a full-stack air quality monitoring application built with a microservices architecture. The system provides real-time air quality data, forecasting, health alerts, and administrative capabilities.

## Architecture Components

### Frontend (React + Vite)
- **Technology**: React 18, Vite, Tailwind CSS, Leaflet.js
- **Features**: 
  - Interactive maps with real-time AQI data
  - Multi-language support (i18n)
  - Responsive design with accessibility compliance
  - Real-time updates via WebSocket/SSE
  - Chart.js for data visualization

### Backend API (Node.js + Express)
- **Technology**: Node.js, Express, PostgreSQL, Redis
- **Features**:
  - RESTful API with OpenAPI documentation
  - JWT-based authentication with refresh tokens
  - Rate limiting and security middleware
  - Caching layer with Redis
  - Background job processing

### ML Service (Python + FastAPI)
- **Technology**: Python, FastAPI, LightGBM, TensorFlow
- **Features**:
  - Air quality forecasting (24/48 hours)
  - Model training and retraining endpoints
  - Performance metrics and monitoring
  - Batch prediction capabilities

### Database Layer
- **PostgreSQL**: Primary data storage
  - User management and authentication
  - Air quality readings and historical data
  - Alert configurations and logs
- **Redis**: Caching and session storage
  - API response caching
  - Real-time data caching
  - Session management

## Data Flow

1. **Data Ingestion**: Air quality sensors → Backend API → PostgreSQL
2. **Real-time Updates**: Backend → WebSocket → Frontend
3. **Forecasting**: Historical data → ML Service → Predictions → Cache
4. **Alerts**: Threshold monitoring → Notification service → Users
5. **Admin Operations**: Admin panel → Backend API → Database/ML Service

## Security Architecture

- **Authentication**: JWT tokens with refresh mechanism
- **Authorization**: Role-based access control (User/Admin)
- **Data Protection**: Password hashing with bcrypt
- **API Security**: Rate limiting, CORS, Helmet.js
- **Input Validation**: Express-validator middleware

## Deployment Architecture

### Development
- Docker Compose with hot reloading
- Local PostgreSQL and Redis instances
- Environment-based configuration

### Production
- Container orchestration (Docker/Kubernetes)
- Load balancing with Nginx
- Database clustering and replication
- Redis cluster for high availability
- SSL/TLS termination

## API Design

### RESTful Endpoints
- `/api/auth/*` - Authentication and user management
- `/api/cities/*` - City and zone information
- `/api/zones/*` - Air quality readings and forecasts
- `/api/alerts/*` - Health alert management
- `/api/admin/*` - Administrative functions

## Data Models

### Core Entities
- **Users**: Authentication, preferences, health conditions
- **Cities**: Geographic regions with metadata
- **Zones**: Monitoring locations within cities
- **Readings**: Time-series air quality measurements
- **Alerts**: User-configured health notifications
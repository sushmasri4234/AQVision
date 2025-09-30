#!/bin/bash

echo "🚀 Starting AirWatch Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📋 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
fi

# Create necessary directories
mkdir -p logs
mkdir -p uploads
mkdir -p ml-service/models

# Start development services
echo "🔨 Starting development services..."
docker-compose up -d postgres redis

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Install dependencies and start services
echo "📦 Installing dependencies..."

# Backend
cd backend
npm install
echo "🗄️ Running database migrations and seeds..."
npm run migrate
npm run seed
npm run dev &
BACKEND_PID=$!
cd ..

# ML Service
cd ml-service
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000 &
ML_PID=$!
cd ..

# Frontend
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 Development environment started!"
echo ""
echo "📱 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   API Docs: http://localhost:5000/docs"
echo "   ML Service: http://localhost:8000"
echo ""
echo "👤 Demo credentials:"
echo "   User: demo@airwatch.test / Demo@1234"
echo "   Admin: admin@airwatch.test / Admin@1234"
echo ""
echo "🛑 To stop all services, press Ctrl+C"

# Wait for interrupt
trap "echo '🛑 Stopping services...'; kill $BACKEND_PID $ML_PID $FRONTEND_PID; docker-compose down; exit" INT
wait
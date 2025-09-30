#!/bin/bash

echo "🗄️ Running database migrations and seeding..."

cd backend

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
sleep 5

# Run migrations
echo "📊 Running database migrations..."
npm run migrate

# Run seeders
echo "🌱 Seeding database with initial data..."
npm run seed

echo "✅ Database setup completed!"
echo ""
echo "👤 Demo users created:"
echo "   User: demo@airwatch.test / Demo@1234"
echo "   Admin: admin@airwatch.test / Admin@1234"
echo ""
echo "🏙️ Cities and zones seeded:"
echo "   - Delhi NCR (6 zones)"
echo "   - Mumbai (4 zones)"
echo "   - Kolkata, Chennai, Bengaluru, Ahmedabad"
echo ""
echo "📈 Sample air quality readings generated for the last 24 hours"
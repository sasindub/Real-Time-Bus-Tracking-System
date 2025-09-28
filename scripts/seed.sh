#!/bin/bash

# NTC Bus Tracker Database Seeding Script
# This script seeds the database with initial data

echo "🚌 NTC Bus Tracker - Database Seeding Script"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create a .env file with your database configuration."
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '#' | awk '/=/ {print $1}')

# Check if database connection variables are set
if [ -z "$DB_HOST" ] || [ -z "$DB_NAME" ] || [ -z "$DB_USER" ]; then
    echo "❌ Database configuration is incomplete. Please check your .env file."
    exit 1
fi

echo "📊 Database Configuration:"
echo "   Host: $DB_HOST"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies."
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
fi

# Create seeds directory if it doesn't exist
mkdir -p seeds

# Generate simulation data if it doesn't exist
if [ ! -f "seeds/simulation.json" ]; then
    echo "🎲 Generating simulation data..."
    node -e "
    const seeder = require('./src/utils/seed.js');
    seeder.generateSimulationData();
    console.log('✅ Simulation data generated');
    "
fi

# Run the seeding script
echo "🌱 Starting database seeding..."
node -e "
const seeder = require('./src/utils/seed.js');

async function runSeeder() {
    try {
        await seeder.run();
        console.log('🎉 Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('💥 Database seeding failed:', error.message);
        process.exit(1);
    }
}

runSeeder();
"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database seeding completed successfully!"
    echo ""
    echo "📋 What was created:"
    echo "   • Database tables (users, routes, buses, trips, location_history)"
    echo "   • Sample users (admin, moderator, driver, user)"
    echo "   • Sample routes (4 routes)"
    echo "   • Sample buses (4 buses)"
    echo "   • Sample trips (3 trips)"
    echo "   • Simulation data (seeds/simulation.json)"
    echo ""
    echo "🔑 Default login credentials:"
    echo "   Admin: admin@ntc.com / password123"
    echo "   Moderator: moderator@ntc.com / password123"
    echo "   Driver: driver1@ntc.com / password123"
    echo "   User: user1@ntc.com / password123"
    echo ""
    echo "🚀 You can now start the server with: npm start"
else
    echo ""
    echo "❌ Database seeding failed. Please check the error messages above."
    exit 1
fi

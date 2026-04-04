#!/bin/bash
# VLIP Platform Setup for Google AI Studio

echo "Setting up VLIP Platform for Google AI Studio..."

# Install backend dependencies
cd backend
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
npm run seed

# Install frontend dependencies
cd ../frontend
npm install

# Build frontend
npm run build

echo "Setup complete! Start the application with:"
echo "Backend: cd backend && npm run dev"
echo "Frontend: cd frontend && npm run dev"
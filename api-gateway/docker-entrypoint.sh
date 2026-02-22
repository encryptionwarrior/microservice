#!/bin/sh
set -e

echo "🚀 Starting API Gateway..."

# Wait for all dependent services to be ready
echo "⏳ Waiting for dependent services to be ready..."

# Wait for auth-service
echo "⏳ Waiting for auth-service..."
until curl -f http://auth-services:3001/health 2>/dev/null; do
  echo "⏳ auth-service is unavailable - sleeping..."
  sleep 2
done
echo "✅ auth-service is ready"

# Wait for user-service
echo "⏳ Waiting for user-service..."
until curl -f http://user-service:3002/health 2>/dev/null; do
  echo "⏳ user-service is unavailable - sleeping..."
  sleep 2
done
echo "✅ user-service is ready"

# Wait for notes-service
echo "⏳ Waiting for notes-service..."
until curl -f http://notes-services:3003/health 2>/dev/null; do
  echo "⏳ notes-service is unavailable - sleeping..."
  sleep 2
done
echo "✅ notes-service is ready"

# Wait for tags-service
echo "⏳ Waiting for tags-service..."
until curl -f http://tags-service:3004/health 2>/dev/null; do
  echo "⏳ tags-service is unavailable - sleeping..."
  sleep 2
done
echo "✅ tags-service is ready"

# Wait for search-service
echo "⏳ Waiting for search-service..."
until curl -f http://search-service:3006/health 2>/dev/null; do
  echo "⏳ search-service is unavailable - sleeping..."
  sleep 2
done
echo "✅ search-service is ready"

echo "✅ All dependent services are ready"

# Start the application
echo "✅ Starting API Gateway application..."
exec node dist/index.js

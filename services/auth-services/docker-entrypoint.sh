#!/bin/sh 

set -e 
echo "🚀 Starting Auth Service..."

echo "⏳ Waiting for PostgreSQL to be ready..."
until node -e "
const {Client} = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL
});
client.connect()
    .then(() => {
    console.log('✅ PostgreSQL is ready');
    return client.end();
    })
    .then(() => process.exit(0))
    .catch((err) => {
    console.log('❌ PostgreSQL not ready:', err.message);
    process.exit(1);
    });
" 2>/dev/null; do 
    echo "⏳ PostgreSQL is unavailable - sleeping..."
    sleep 2
done



echo "🔄 Running database migrations..."
cd /app/services/auth-services

npx prisma migrate deploy --config prisma.config.ts 

echo "✅ Starting Auth Service application..."

exec node dist/src/index.js


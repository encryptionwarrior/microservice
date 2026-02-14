#!/bin/sh

set -e 

echo "🚀 Starting Notes Service..."


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


# Wait for Kafka to be ready
# echo "⏳ Waiting for Kafka to be ready..."
# until node -e "
# const { Kafka } = require('kafkajs');
# const kafka = new Kafka({
#   clientId: 'notes-service-health-check',
#   brokers: process.env.KAFKA_BROKERS.split(',')
# });
# const admin = kafka.admin();
# admin.connect()
#   .then(() => {
#     console.log('✅ Kafka is ready');
#     return admin.disconnect();
#   })
#   .then(() => process.exit(0))
#   .catch((err) => {
#     console.log('❌ Kafka not ready:', err.message);
#     process.exit(1);
#   });
# " 2>/dev/null; do
#   echo "⏳ Kafka is unavailable - sleeping..."
#   sleep 2
# done


echo "🔄 Running database migrations..."
cd /app/services/notes-services

npx prisma migrate deploy --config prisma.config.ts


echo "✅ Starting Notes Service application..."
# exec node dist/index.js
exec node dist/src/index.js

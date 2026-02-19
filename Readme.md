# Start everything
yarn docker:dev

# Stop
yarn docker:dev:down

# Full reset (when deps change)
yarn docker:clean
yarn docker:dev

# When you change shared/
cd shared && yarn build   # → nodemon auto-restarts the services
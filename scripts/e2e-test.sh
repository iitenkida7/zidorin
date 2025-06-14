#!/bin/bash

# Start the dev server in the background
echo "Starting development server..."
npm run dev -- --host 0.0.0.0 &
DEV_PID=$!

# Wait for the server to be ready
echo "Waiting for server to be ready..."
for i in {1..30}; do
  if curl -s http://localhost:8000 > /dev/null; then
    echo "Server is ready!"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "Server failed to start"
    kill $DEV_PID 2>/dev/null
    exit 1
  fi
  sleep 1
done

# Run the E2E tests
echo "Running E2E tests..."
npm run test:e2e
TEST_EXIT_CODE=$?

# Clean up
echo "Cleaning up..."
kill $DEV_PID 2>/dev/null

exit $TEST_EXIT_CODE
#!/bin/bash

# Crypto provider.
echo "Running cryptoprovider..."
node src/cryptoprovider.js > cryptoprovider.log 2>&1 &
provider=$!
sleep 2

# Server
echo "Running server..."
echo "---------------------------"
echo "---------------------------"
echo "---------------------------"
node example/server.js 10 &
server=$!
sleep 2

# Ask user to open the browser.
echo "---------------------------"
echo "---------------------------"
echo "---------------------------"
echo ""
echo ""
echo ""
echo "Everything is running..."
echo "Open http://localhost:3000/ in your browser and follow the prompts"
echo "---------------------------"
echo "---------------------------"
echo "---------------------------"
wait $server

# Server is closed, kill crypto provider.
echo "---------------------------"
echo "---------------------------"
echo "---------------------------"
echo ""
echo ""
echo ""
echo "Server is done, killing crypto provider..."
kill $provider
wait $provider

echo "Done!"

#!/bin/bash

cd /Users/maksimmostovoj/Downloads/Автотесты/java/tempgit/tests

if [ -f .env ]; then
    set -a; source .env; set +a
fi

echo "Cleaning old results..."
rm -rf allure-results allure-report

echo "Running tests..."
npm test

echo "Generating Allure report..."
allure generate allure-results

echo "Starting Allure server..."
allure open > /tmp/allure_output.txt 2>&1 &
SERVER_PID=$!
sleep 3

# Получаем порт из вывода allure open
PORT=$(grep -o "http://127.0.0.1:[0-9]*" /tmp/allure_output.txt | head -1 | sed 's/.*://')
if [ -n "$PORT" ] && [ "$PORT" -gt 0 ] 2>/dev/null; then
    export REPORT_LINK="http://localhost:$PORT"
    echo "Server running on port: $PORT"
else
    echo "Could not detect port, using default"
    export REPORT_LINK="http://localhost:8080"
fi

echo "Sending to Telegram..."
node scripts/send.mjs allure-report/widgets/summary.json

echo "Done!"
kill $SERVER_PID 2>/dev/null
rm -f /tmp/allure_output.txt
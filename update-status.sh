#!/bin/bash
# Update work orders 5, 6, 15, 18, 14, 24, 27, 36, 35, 38 to "in production" status

for id in 5 6 15 18 14 24 27 36 35 38; do
  echo "Updating WO #$id to 'in production'..."
  curl -s -X PATCH "http://localhost:3000/api/production/work_order?id=$id" \
    -H 'Content-Type: application/json' \
    -d "{\"status\": \"in production\"}"
  echo ""
done

echo "Done! Refresh the production page to see the work orders."

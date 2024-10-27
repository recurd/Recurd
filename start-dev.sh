#!/bin/sh
# Run this with:
# chmod -x start-dev.sh
# bash start-dev.sh

(cd backend ; npm run dev) & (cd frontend ; npm run dev)
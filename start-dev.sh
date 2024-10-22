#!/bin/sh
# Run this with:
# bash start-dev.sh

(cd backend ; npm run dev) & (cd frontend ; npm run dev)
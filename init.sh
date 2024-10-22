#!/bin/sh
# Run this with:
# bash init.sh

# cd into each directory and npm install
for d in ./*/ ; do 
    (cd "$d" && npm i);
done

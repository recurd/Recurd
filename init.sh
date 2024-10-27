#!/bin/sh
# Run this with:
# chmod -x init.sh
# bash init.sh

# cd into each directory and npm install
for d in ./*/ ; do 
    (cd "$d" && npm i);
done

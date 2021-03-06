#!/bin/bash

./_scripts/load.sh
git add .
git commit -m "Update data" 
git push origin master
vercel --prod

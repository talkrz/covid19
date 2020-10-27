#!/bin/bash

./load.sh
git add .
git commit -m "Update data" 
git push origin master
vercel --prod
vercel alias covid19.talkrz.vercel.app covid19.now.sh

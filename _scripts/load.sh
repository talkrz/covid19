#!/bin/bash

cd data_sources/COVID-19/ && git pull --rebase origin master && cd ../../
node _scripts/load.js > src/data/data.json

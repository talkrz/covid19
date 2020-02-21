#!/bin/bash

node _scripts/load-cumulative-outside-china.js > src/data/cumulative-outside-china.json
node _scripts/load-cumulative-china.js > src/data/cumulative-china.json
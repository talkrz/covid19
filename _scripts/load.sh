#!/bin/bash

node _scripts/load-cumulative.js Other_Locations > src/data/cumulative-outside-china.json
node _scripts/load-cumulative.js Mainland_China > src/data/cumulative-china.json
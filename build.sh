#!/bin/bash
export NEXT_TELEMETRY_DISABLED=1
export DO_NOT_TRACK=1
# download deps
npm ci
# nextjs build
npm run build
# rm js so it can't load LOL
rm $(find out/ -name "*.js")

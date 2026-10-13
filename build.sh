#!/bin/bash
NEXT_TELEMETRY_DISABLED=1 npm ci
NEXT_TELEMETRY_DISABLED=1 npm run build
rm $(find out/ -name "*.js")

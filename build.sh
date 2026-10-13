#!/bin/bash
npm ci
npm run build
rm $(find out/ -name "*.js")

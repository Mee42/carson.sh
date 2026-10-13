#!/bin/bash
npm run build
rm $(find out/ -name "*.js")

#!/bin/bash
npm run build
rm $(find out/ -name "*.js")
git add -A .
git commit -m "auto-commit to ./deploy"
git push
ssh ev "cd carson.sh && git pull unauth master"

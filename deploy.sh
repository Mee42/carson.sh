#!/bin/bash
npm run build
rm $(find out/ -name "*.js")
git add -A .
git commit -m "auto-commit via deploy.sh"
git push
ssh clemantis-port "cd carson.sh && git pull unauth master"

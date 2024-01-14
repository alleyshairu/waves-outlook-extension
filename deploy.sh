#!/bin/bash
echo "*** Building assets ***"
npm run build

echo "*** Uploading files to server ***"
scp -r dist igor@170.64.185.82:/home/igor/waves/

echo "*** Restarting caddy container ***"
ssh -T igor@170.64.185.82 "cd waves; cp -R dist/* mail-assistant; rm -R dist/; cd caddy; docker compose down; docker compose up -d --build"

#!/bin/bash

docker build \
  --build-arg VITE_SERVER_API_URL=http://192.168.1.4:5171/proto \
  -t video-player-frontend .

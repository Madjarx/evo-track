#!/bin/bash

if $("service evo-ingress status");
  then
    echo "up"
  else
    echo "down"
fi

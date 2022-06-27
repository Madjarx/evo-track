#!/bin/bash

ping -c3 -L google.com > /dev/null 2>&1
if [ $? -eq 0 ]
then
  echo 0
else
  echo 1
fi
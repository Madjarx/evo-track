#!/usr/bin/python3

import sys
import json
import jwt
import os
from argh import arg
import argh
import time

def main(payload, key, cert=None):
    '''
    Generates RSA JWT using private key and payload (JSON file).
    Certificate can be optionally added to the payload.
    '''

    payload = open(payload, 'r').read()
    key = open(key, 'rb').read()

    # check that payload is JSON
    try:
        payload = json.loads(payload)
    except:
        print('Header payload file is properly formatted JSON')
        sys.exit(1)

    # add iat header
    payload['iat'] = int(time.time())

    # if certificate arg exists, add it to payload
    if cert is not None:
        crt = open(cert, 'r').read()
        payload['crt'] = crt

    token = jwt.encode(payload, key, algorithm='RS256')
    
    print(token.decode("utf-8"))

argh.dispatch_command(main)


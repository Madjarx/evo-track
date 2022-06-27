# evo-track

### MEMORY LEAK: DANGLING BINDS OF MODEL IN VIEW.

## Remaining issues: 
 * Added to Moishe's ingress-server
   - Post to Google Sheets
   - Post to postgres
   - Post to elasticsearch
 * Bluetooth Scale (Still determining best approach (Android??))
 * Debian install package/script (one-shot)
 * README for installation/config (steps)
 * Save to Disk (simulator)
 * Make app read where to save to disk via config (no manual config)
 * Make config.json
   - config.py to load from json

## Modules

 - evo-ingress
 
```
./ingress
├── app-client
├── app-server
├── deploy-lambda
├── user-resources
|
├── evo-ingress
│   └── pyproject.toml
│   └── setup.py
│   └── exec-test.sh
|   |
│   └── debian
│       └── cookiecutter.json
│   └── debtools
│       └── aliases
│   └── app
│       └── configs
│           └── test.env.sh
│           └── test.json
│       └── sample
│           └── event.json
│       └── src
│           └── exec-ingress.sh
│           └── exec-watch.sh
│           └── gen-jwt.py
│           └── ingress-start.sh
│           └── ingress-stop.sh

```

## deps

```bash
sudo apt install libcairo2-dev
sudo apt install libgirepository1.0-dev
sudo PYGOBJECT_WITHOUT_PYCAIRO=1 pip3 install --no-build-isolation --no-use-pep517 pygobject
```

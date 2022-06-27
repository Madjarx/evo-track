-todo: put a link to debian packages

# EVO-INGRESS CLIENT

```
ingress/client
├── evo-ingress
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
│   └── pyproject.toml
│   └── setup.py
│   └── exec-test.sh
```

## Description

## Installer - debian package

## How it works - call-flow

put a descriptionL
this is a debian install script to install and uninstall the ___ 

this is generated from the ___
```
```
TODO: FIND THE COMMAND TO BUILD IT

description/purpose
upload usage data via HTTP POST 

the server is a lambda function and the client is a filesystem trigger
the evo ingress client is responsible to monitor a folder for new files
whenever a new file is created a filesystem event calls an upload script
the upload script locks the file via ___, attempts to upload via post, and it unlocks the file regardless of succsess

if its succsesful the file is deleted. its notable that writing files causes slight ware and tear to the sd card, therefore
it is recommended to investigate memoryfile systems that page to disk after a period of time so that most data never hits the disk.

currently out of scope unitl this project sells 


```
TODO - find a real command the right one
dpkg -i filename.deb
```

## How to rebuild the debian package

 - 

 ## References

### poetry (build dpgk)

 - https://python-poetry.org/docs/basic-usage/
 - https://python-poetry.org/docs/pyproject/
 - https://pip.pypa.io/en/stable/reference/build-system/pyproject-toml/
 - https://news.ycombinator.com/item?id=22746762
 - https://stackoverflow.com/questions/62983756/what-is-pyproject-toml-file-for
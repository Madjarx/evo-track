# evo-ingress

 ```
 source ./aliases

 debtools-build-all
 ```

## dungeon map

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

# References

## pyproject.toml
The `--use-pep517` flag (and corresponding environment variable: PIP_USE_PEP517) can be used to force all packages to build using the pyproject.toml based build system interface. There is no way to force the use of the legacy build system interface.

 - https://pip.pypa.io/en/stable/cli/pip_install/#install-use-pep517

```bash
pip install --use-pep517
```

## dpkg
 - https://linux.die.net/man/1/dpkg

## dpkg-buildpackage
 - https://man7.org/linux/man-pages/man1/dpkg-buildpackage.1.html

## mk-build-deps
 - https://helpmanual.io/help/mk-build-deps/

## debtools-build-deps
 - https://serverfault.com/questions/127625/given-a-debian-source-package-how-do-i-install-the-build-deps

## debtools-build
 - https://man7.org/linux/man-pages/man1/dpkg-buildpackage.1.html

## dch
 - https://helpmanual.io/help/dch/

## dephell
 - https://dephell.readthedocs.io/

## dh-virtualenv
 - https://dh-virtualenv.readthedocs.io/en/1.2.1/

## cookiecutter
 - https://github.com/cookiecutter/cookiecutter

## 
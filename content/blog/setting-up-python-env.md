---
title: "Setting up a fresh, sane Python environment with pyenv and pip-tools"
description: "A step-by-step process to setup a maintainable and sane working Python local environment using pyenv and pip-tools"

# The date of the post.
# Two formats are allowed: YYYY-MM-DD (2012-10-02) and RFC3339 (2002-10-02T15:00:00Z).
# Do not wrap dates in quotes; the line below only indicates that there is no default date.
date: 2023-08-27

# The last updated date of the post, if different from the date.
# Same format as `date`.
# updated =

# A draft page is only loaded if the `--drafts` flag is passed to `zola build`, `zola serve` or `zola check`.
draft: true

# If set, this slug will be used instead of the filename to make the URL.
# The section path will still be used.
# slug = ""

# The path the content will appear at.
# If set, it cannot be an empty string and will override both `slug` and the filename.
# The sections' path won't be used.
# It should not start with a `/` and the slash will be removed if it does.
# path = ""

# Use aliases if you are moving content but want to redirect previous URLs to the
# current one. This takes an array of paths, not URLs.
aliases: []

# When set to "true", the page will be in the search index. This is only used if
# `build_search_index` is set to "true" in the Zola configuration and the parent section
# hasn't set `in_search_index` to "false" in its front matter.
in_search_index: true

# Template to use to render this page.
# template = "page.html"

# The taxonomies for this page. The keys need to be the same as the taxonomy
# names configured in `config.toml` and the values are an array of String objects. For example,
# tags = ["rust", "web"].
taxonomies:
  tags: ["engineering", "python"]

# Your own data.
extra:
---

## Where's the confusion? { .group }

There seems to be a TON of confusion in the python community on how to set up a simple environment for a python project. Questions such as "why are there so many choices for package management", "how do I sequester my requirements" and "how did you get into my house". This generally comes from the glut of package managers (poetry, pipenv etc) and unfamiliar terminologies (virtual environments). Unlike python's core philosophy, there doesn't seem to be The One Way™ to do things and this is different from other languages where there's usually a single accepted package and environment manager for eg. npm for nodejs, bundler for ruby, go modules for golang and so on.

I want to provide a simple option for all these problems so you can have something light that you can work with in almost no time that's minimal but also effective. We'll use pyenv to manage our python versions as well as manage our virtual environments where we will install packages, and use the incredibly simple pip-tools to manage the dependencies our project needs.

## Starting with pyenv { .group }

Why do you even need pyenv in the first place? The simple answer is that you will most likely never work with the same python version across projects. Some of your projects might be in v3.9.2 or something might be in 3.11.1 and so on. Having multiple versions of python installed at your OS level can cause a lot of confusion especially when you install python packages and are left to wonder which version of python they were installed for.

pyenv is a great way to make it easy to manage all these versions and keep them available for your projects to use at any time. There are, of course, alternatives like [asdf](https://asdf-vm.com/) but for this article we'll stick to pyenv since it's focused on python environments as opposed to asdf which has plugins for most languages and tools.

To start, install pyenv by [following the instructions for your platform](https://github.com/pyenv/pyenv#installation). The simplest way is to run the following command which should automatically set everything up on your operating system.

```sh
curl https://pyenv.run | bash
```

You'l have to follow the instructions they display at the end to add pyenv to your path to be able to run it. It'll look a little something like this

```sh
# Load pyenv automatically by appending the following to ~/.bash_profile if it exists,
# otherwise ~/.profile (for login shells) and ~/.bashrc (for interactive shells) :

export PYENV_ROOT="$HOME/.pyenv"
command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"

# Restart your shell for the changes to take effect.

# Load pyenv-virtualenv automatically by adding
# the following to ~/.bashrc:

eval "$(pyenv virtualenv-init -)"
```

Add the commands to your shell of choice as instructed by adding the lines to your shell configuration. I use zsh on my Mac, more specifically oh-my-zsh, so I added the lines to my `$ZSH_CUSTOM/path.sh` file.

With this pyenv should be installed and youshould be able to use pyenv to manage the versions of python installed on the system.

## Installing python versions { .group }

Let's start a simple project in a specific version of python, let's say **3.10.11**. There's nothing really special about this version but it will most likely be different from the python version installed in your system because Macs, as of writing this comment, ship with Python 3.6 and Ubuntu 20.4 ships with Python 3.8.

If you need to see an exhaustive list of every single python version available to pyenv, run the command `pyenv install -l` which will give you every single version of python avaiable to download and install. It should look a little something like below

```sh
$ pyenv install -l
Available versions:
  2.1.3
  2.2.3
  2.3.7
  2.4.0
  ... (and so on)
```

Let's install Python 3.10.11 now since we need it for our sample project. To install any python versino, simply run `pyenv install <python version>` so in this case we'll do

```sh
pyenv install 3.10.11
```

If all goes well, you will get the message "*Installed Python-3.10.11 to ...*" which will also give you the exact directory where python was installed. pyenv generally installs to `$HOME/.pyenv/versions/<version>` where `$HOME` is your home directory.

## Setting your python version { .group }

You have your python version of choice installed but if you run `python --version`, you'll see that it's still showing your locally installed python version. What??? Well, that's because while pyenv *installs* any version you desire, it makes no assumptions about what version of python you want to actually use. This allows you the freedom of not only changing your global python version system-wide, you can also change your python version locally for each directory where you have a python project.

To start, set the global python version with

```sh
pyenv global 3.10.11
```

You can also check all the available python versions using `pyenv versions`. Now if you check `python --version` it should tell you that you're using 3.10.11. It's that simple!

Now let's create a directory for this fictional project with `mkdir python-env-demo` and traverse into it with `cd python-env-demo`. To make sure that we always use python 3.10.11 in this folder, we can run

```sh
pyenv local 3.10.11
```

This creates a `.python-version` file in the current directory that contains the version that pyenv should use. pyenv will automatically switch to that version when you enter this directory from here on.

> ### Note
>
> If you have a version specified in the `.python-version` file and it's not already installed with pyenv, it will not automatically install that version and trying to run python will give you the following warning
>
> ```sh
> $ python
> pyenv: version `3.10.1' is not installed (set by /<current working directory>/.python-version)
> ```

Now while we could stop here and simply install dependencies here on globally into the current python version, we will run into problems when other applications in your system have their own dependencies that use the same python version which may overwrite the dependencies you want for this project. So let's move on to creating a "virtual environment".

## Creating virtual environments { .group }

While it's a mouthful, virtual environments are simply a few bash scripts that set the $PATH variables of your current shell environment to the python executable you used to create it and also expose all the packages you install into it. Every python installation stores packages you install from pip in a `site-packages` folder and when you install packages using `pip install <package name>`, it makes that package available globally.

Let's create a simple python file that uses the "requests" package to make an API call and name it `saymoo.py` with the contents as below

```python
# saymoo.py

import requests

def saymoo():
  res = requests.get("https://httpbin.org/anything", json={"message": "Moo"})
  print(res.json()["data"])
```

This calls the API at [httpbin.org](https://httpbin.org) which simply returns exactly what you send to it. Since we've not installed any packages yet, the line `import requests` will fail.



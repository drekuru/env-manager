<!-- omit in toc -->
# Env Manager CLI

This cli tool provides a way to manage and share environment variables, but really any sensitive file.

<!-- omit in toc -->
### Table of Contents
- [What it let's you do?](#what-it-lets-you-do)
- [Why we built this?](#why-we-built-this)
- [Security and how it works](#security-and-how-it-works)
- [Installation](#installation)
- [Usage](#usage)
  - [Common Options](#common-options)
- [Examples](#examples)
  - [Generating and Encrypting a File](#generating-and-encrypting-a-file)
  - [Managing Context](#managing-context)
  - [Transforming Files](#transforming-files)
  - [Editing the Config Manually](#editing-the-config-manually)
- [Contributing](#contributing)
- [License](#license)

<a id="what-it-do"></a>
## What it let's you do?

- Generate credentials to encrypt/decrypt files 🔑
- Store these credentials 📃
- Export the credentials to share with other users 📃➡️📦
- Encrypt/Decrypt files 🔒
- Transform env files to external formats 🔄 (think Azure, AWS services, etc)

<a id="why-its-made"></a>
## Why we built this?

You can skip reading past this to the [Installation](#installation) section if you're not interested in the backstory.

> 💸 Cost Effective 💸: If you're working on a small project/team you might not have funding to store/share credentials in some cloud service. So with this tool you can store `.enc` files in your repo and anytime a new member joins, simply share the relevant credentials.

> 🔒 Permission Management 🔒: You can have many environments like `dev.env` `prod.env` but don't want to give access to all team members for prod. Different creds allow you to give scoped access.

> ➡️ Transforming ➡️: If you deploy your app to something like Azure Web Apps, you have to manually copy paste envs. We added transformation to help with converting standard `.env` format into Azure's `appsettings.json` format (and other formats as well). This allows for clean automation with CI/CD pipelines and existing cli tools from Azure. Additionally you can pull down the `appsettings.json` and convert it back to `.env` format and compare and validate it against local files.

<a id="security"></a>
## Security and how it works

When you generate a credential and choose to save it, it gets saved here:

```js
// base path is one of these
const USER_HOME = process.env.USERPROFILE || process.env.HOME;

// full path
const FULL_PATH = USER_HOME + "./.config/env-manager/config.json";
```

Is this safe? 🤔 It's as safe as storing your `.env` files on your machine. You're already doing that, right?

Currently we only support 2 algorithms `aes-256-ecb` and `aes-256-cbc`.

- `aes-256-ecb` is used if you only want to have a key to encrypt/decrypt files
- `aes-256-cbc` is used if you want to have an IV and a key to encrypt/decrypt files

We're looking to add more functionality here in the future, like letting the user select the algorithm, etc.

## Installation

To install the Env Manager CLI, you can use npm:

> ⚠️ **Warning**: This package requires **Node v20+** to run

```bash
npm install -g env-manager
```

## Usage

If you installed it globally you should be able to access it with `emg` from your terminal.

To get started run:

```bash
emg -h
```

To get help with a specific command run:

```bash
emg <command> -h
```

This applies to sub-commands as well:

```bash
emg <command> <sub-command> -h
```

### Common Options

- `-h, --help` - Display help for command
- `-v, --verbose` - Run command with verbose logging

## Examples

### Generating and Encrypting a File

1. Generate and save a new credential

```bash
emg credentials generate -t key -s mySecrets
```

2. Set new credential as the "active credential"

```bash
emg credentials set mySecrets
```

3. Encrypt a file with the active credential

```bash
emg encrypt ./.env
```

### Managing Context

You can have multiple credentials and switch between them. This is useful when you have different environments like `dev`, `prod`, or even different projects that you want to use this tool in. Additionally you can set the `working directoy` per credential, to keep context of where you are encrypting/decrypting files.

1. Generate and save credentials

```bash
emg credentials generate -t key -s dev-mushroom
emg credentials generate -t key -s prod-mushroom
emg credentials generate -t key -s dev-boop
```

Now imagine we have a directory structure like this:

```
.
├── mushroom
│   ├── dev.env
│   └── prod.env
└── boop
    └── dev.env
```

2. Set the working directory for each credential

```bash
emg credentials path set dev-mushroom -p ./mushroom
emg credentials path set prod-mushroom -p ./mushroom
```

> We can also set it by first making a credential the _active_ one

```bash
emg credentials set dev-boop
emg credentials path set -p ./boop
```

1. With the working directory set, we can encrypt, decrypt files without having to worry about the exact folder we're in.

```bash
cd ./some-other-folder

# since our context is set to dev-boop
# the tool will look for a `dev.env` file in the `./boop` directory
# and create an encrypted file in the same directory (adjacent to the original file)
emg encrypt dev.env
```

### Transforming Files

You can transform files to and from `.env` format. In the example below, we will tranform an `.env` file to an `appsettings.json` file. You do not need any credentials setup to use this command. However to accommodate for this we can pass in the `-w` flag which will use the working directory of the active credential to set the path context.

```bash
# will create a `dev.json` file in the same directory with the transformed content
emg transform ./dev.env -f azure-web-apps
```

### Editing the Config Manually

If you are using VSCode and have the `code .` command setup in your terminal, you can peek into and edit the `config.json` file with all of the credentials. This is useful if you want to import a credential from another machine or manually edit the file. (In the future we aim to add a `cred import` command to make this easier)

> ⚠️ **Warning**: Use at your own risk, as this is a raw edit of the file, and can mess up keys, etc.

```bash
emg edit
```


## Contributing
This project is open to contributions. If you have an idea for a feature, or found a bug, please open an issue or a PR.

## License

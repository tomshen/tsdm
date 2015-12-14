# tsdm
TypeScript definition manager. Not ready for use yet.

## Installation

tsdm isn't on npm yet.

```sh
> git clone git@github.com:tomshen/tsdm.git && cd tsdm
> npm install
> npm link
```

Generate a [GitHub personal access token](https://github.com/settings/tokens) (`public_repo` scope) and add a `.tsdmrc` file to your home directory to avoid GitHub rate limiting:

```json
{
    "token": "TOKEN"
}
```

## Usage

```sh
> tsdm install plottable
```

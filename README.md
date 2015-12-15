# tsdm

**Use the [typings](https://github.com/typings/typings) definition manager instead of this.**

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
Installed: plottable/plottable.d.ts
Installed: d3/d3.d.ts

> tree
.
└── typings
    ├── d3
    │   └── d3.d.ts
    └── plottable
        └── plottable.d.ts

3 directories, 2 files

> tsdm install react-redux
Installed: react-redux/react-redux.d.ts
Installed: redux/redux.d.ts
Installed: react/react.d.ts

> tsdm uninstall plottable
Uninstalled: plottable

> tree
.
└── typings
    ├── d3
    │   └── d3.d.ts
    ├── react
    │   └── react.d.ts
    ├── react-redux
    │   └── react-redux.d.ts
    └── redux
        └── redux.d.ts

6 directories, 5 files
```

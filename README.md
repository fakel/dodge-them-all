# Dodge Them All Desktop App (dodge-them-all)

A LoL Community oriented project

## Description

This is a work in progress personal project to handle one of the game community issues related to players.

This software is provided under a excplicit "No Sell" policy.

Usign the software you are becoming a "contributor".

A contributor is a sole person which, knowingly doing, get registered on the platform, is contributing information from its matches to the application database and providing feedback about their teammates.

Contributed data includes:

- Your email on signup
- A username on signup
- Your matches gameIDs
- Your summoners PUUID, DisplayName, InternalName, Region
- Your teammates PUUID, DisplayName, InternalName, Region
- Your comments and report taggings on this application (we DO NOT track in game reports)

If you want to contribute to this project, you are welcome to fork it and open issues to improve it.

## Known issues and pending tasks

- More documentation
- Provide translations
- Clean unused boilerplate code
- Implement automated code testing
- A lot more work and improvements...

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev -m electron
```


### Lint the files
```bash
yarn lint
# or
npm run lint
```

### Build the app for production
```bash
quasar build -m electron
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

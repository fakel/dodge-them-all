# Dodge Them All Desktop App (dodge-them-all)

A LoL Community Reputation Companion App

## Description

This is a work in progress personal project intended to handle one of the game issues related to players: knowing better your teammates.

With this app your are being able to provide feedback to the community about your team and also read the feedback of previous users about your teammates, providing a more transparent matchmaking experience.

This software is provided under a excplicit "No Sell" policy.

Usign the software you are becoming a "contributor".

A "contributor" is a sole person which, knowingly doing, get registered on the platform, is contributing information from its matches to the application database and providing feedback about their teammates.

Contributed data includes:

- Your email on signup
- A username on signup
- Your matches gameIDs
- Your summoners PUUID, DisplayName, InternalName, Region
- Your teammates PUUID, DisplayName, InternalName, Region
- Your comments and report taggings on this application (we DO NOT track in game reports)

If you want to contribute to this project, you are welcome to fork it and open issues to improve it.

## Improvements, Contributions, Requests and Proposals

If you want to contribute, make proposals, send requests or you have any idea you want to see in the app in the future, please comment it on this issue: https://github.com/fakel/dodge-them-all/issues/1

## Usage

The easiest way to start is to download the .exe installer in the releases section and execute it.

No special permissions required nor dependencies.

You can also build the app with the instructions provided below.

After the installation, open the app.

Create an account. You can use any email and password for now 

Open your game client and, on the app, click on connect. You should be able to see your own account data.

Find a match. You should see your teammates information and reputation stats.

End the match (win if possible).

After the match you should be able to generate individual reputation reports, once per player per game 

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


### 1. Install dependencies

I'm using "yarn" instead of "npm" and  [Lerna](https://github.com/lerna/lerna) to maintain this project. Please install yarn and lerna before continue

Run the following command to install all dependencies needed for development.

```
npx lerna bootstrap
```

#### 2 Start server and client
start client
```
yarn dev:client
```
start server express
```
yarn start:server
```
client starting at localhost:3000, server starting at localhost:3001

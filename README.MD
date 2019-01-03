
### 1. Install dependencies

I'm using "yarn" instead of "npm" and  [Lerna](https://github.com/lerna/lerna) to maintain this project. Please install yarn and lerna before continue

Run the following command to install all dependencies needed for development.

```
npx lerna bootstrap
```

#### 2 Start server and client simultaneously
i'm using "concurrently" package for run multipe command. Run the following command to install "concurrently"
```
npm i -g concurrently
```
after installed "concurrently" package, run the following command to start server and client
```
yarn start
```
client starting at localhost:3000, server starting at localhost:3001

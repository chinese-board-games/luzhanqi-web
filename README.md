Luzhanqi Web

Ensure that you have ESLint and Prettier installed and enabled in VSCode.  
If you want to run the client using a local database, install and run MongoDB in the background.

Run `npm install` to install node dependencies. Do not use `yarn`.
In your project directory, initialize a file `.env` with contents `PORT=3000`.
Run

```
cat > .env << EOF
PORT=3000
VITE_API=http://localhost:4000
EOF
```

You will also need to name a variable `MONGODB_URI` and set it to the MongoDB connection string. Please ask a member of the team for a set of credentials.
If you want to test the frontend using a local MongoDB server instead, just run MongoDB on your machine (default port 27017).  
Please note that opening more than one client on `localhost` may result in a socket connection refusal, due to CORS rules on the backend. The two whitelisted ports are `3000` and `3001`.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

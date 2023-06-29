const fs = require("fs");
const { google } = require("googleapis");
const readline = require("readline");
const TOKEN_PATH = "token.json";

// Read credentials from the credentials.json file
const credentials = JSON.parse(fs.readFileSync("credentials.json"));
const { client_secret, client_id, redirect_uris } = credentials.installed;

// Create an OAuth2 client with the obtained credentials
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

// Define the required scopes for accessing Gmail
const SCOPES = ["https://www.googleapis.com/auth/gmail.modify"];

// Function to authorize the application
const authorize = async () => {
  // Generate the authorization URL
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  console.log("Authorize this app by visiting this URL:", authUrl);

  // Create a readline interface for reading user input from the console
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Prompt the user to enter the authorization code
  const code = await new Promise((resolve) => {
    rl.question("Enter the authorization code here: ", (code) => {
      rl.close();
      resolve(code);
    });
  });

  // Exchange the authorization code for access and refresh tokens
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  console.log("Token stored to", TOKEN_PATH);
};

// Function to load the saved token or authorize if not available
exports.loadToken = async () => {
  try {
    // Read the token from the token.json file
    const token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
  } catch (err) {
    // If token file doesn't exist or is invalid, authorize the app
    await authorize();
  }
};

// Create the Gmail API client using the authorized OAuth2 client
exports.gmail = google.gmail({ version: "v1", auth: oAuth2Client });

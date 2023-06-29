# Auto Reply to Emails

This Node.js application is designed to automatically respond to emails received in a Gmail mailbox while the user is on vacation. The app utilizes Google APIs to interact with the Gmail service, allowing it to check for new emails, send replies to emails with no prior replies, and add labels to and move the emails within the mailbox. The app operates in random intervals of 45 to 120 seconds.

## Prerequisites

Before running the application, make sure you have the following:

- Node.js installed on your machine.
- A Gmail account to use for testing and configuration.
- The necessary credentials to access the Gmail API.

## Installation

To set up and run the application, follow these steps:

1. **Clone the repository or download the source code.**
2. **Navigate to the project directory using the command line.**
3. **Install the required dependencies by running the following command:**

   ```bash
   npm install
   ```

4. **Set up the required credentials:**

   1. _Create a new project on the Google Developers Console._
   2. _Enable the Gmail API for the project._
   3. _Create OAuth 2.0 credentials (client ID and client secret) for the project._
   4. _Download the credentials as a JSON file and save it as credentials.json in the project directory._

5. **Run the application using the following command:**

   ```bash
   node app.js
   ```

## Usage

Upon running the application, it will prompt you to authorize the app by visiting a generated URL. Open the provided URL in a web browser and authorize the application with your Gmail account. Copy the authorization code and paste it back into the command line interface.

The application will start checking for new emails, and if any unread emails are found, it will send an auto-reply to each email with no prior replies. The auto-reply content can be modified within the replyToEmail function in the app.js file.

The application will also create a custom label named "AUTO_REPLIED_MAILS" if it doesn't already exist. All replied emails will be labeled with this custom label and moved to the respective labeled section within the Gmail mailbox.

The process of checking for emails, sending replies, and labeling emails will repeat in random intervals between 45 and 120 seconds.

## Libraries and Technologies Used

The application is built using the following libraries and technologies:

- _Node.js - JavaScript runtime environment_
- _Google APIs - Gmail API for interacting with Gmail service_
- _googleapis package - Google API client library for Node.js_
- _fs package - File system module for reading credentials and storing tokens_
- _readline package - Interface for reading user input from the command line_

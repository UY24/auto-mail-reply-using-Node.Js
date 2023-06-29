# Mail Auto Reply

This Node.js application enables you to automatically monitor and reply to new emails in your Gmail account using the Gmail API.

## Prerequisites

Before running this application, ensure that you have the following prerequisites installed and set up:

- Node.js (version 14 or higher)
- Gmail API credentials (credentials.json) from the Google Cloud Console

## Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/ravi20930/mail-auto-reply.git
   ```

2. **Install dependencies**

   1. Navigate to the cloned repository directory
   2. Install the required dependencies:

   ```bash
   npm install
   ```

3. **Obtain Gmail API credentials**

   - Go to the Google Cloud Console.
   - Create a new project or select an existing project.
   - Enable the Gmail API for your project.
   - Create credentials (OAuth client ID) for a Web/Desktop application.
   - Download the credentials JSON file and save it as `credentials.json` in the project directory.

4. **Run the application**

   Start the application by running the following command:

   ```bash
   node app.js
   ```

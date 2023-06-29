const fs = require("fs");
const { loadToken, gmail } = require("./auth");

// Check if a file exists at the given file path
async function checkFileExists(filePath) {
  try {
    await fs.promises.access(filePath);
    return true; // File exists
  } catch (error) {
    return false; // File does not exist
  }
}

// Create the custom label if it doesn't exist
async function createLabelIfNotExists() {
  const res = await gmail.users.labels.list({ userId: "me" });
  const labels = res.data.labels;
  const labelExists = labels.some(
    (label) => label.name === "AUTO_REPLIED_MAILS"
  );

  if (!labelExists) {
    const d = await gmail.users.labels.create({
      userId: "me",
      requestBody: {
        name: "AUTO_REPLIED_MAILS",
        labelListVisibility: "labelShow",
        messageListVisibility: "show",
      },
    });
    console.log(d.data.id);
    fs.writeFileSync(
      "label",
      JSON.stringify({ name: "AUTO_REPLIED_MAILS", id: d.data.id })
    );
    console.log(`Label created.`);
  }
}

// Reply to an email with the provided emailId, subject, and body
async function replyToEmail(emailId, subject, body) {
  try {
    const email = await gmail.users.messages.get({
      userId: "me",
      id: emailId,
    });

    const originalSender = email.data.payload.headers.find(
      (header) => header.name === "From"
    ).value;

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: Buffer.from(
          `From: "me"\nTo: ${originalSender}\nSubject: ${subject}\n\n${body}`
        ).toString("base64"),
        threadId: emailId,
      },
    });
    const { id } = JSON.parse(fs.readFileSync("label"));
    await gmail.users.messages.modify({
      userId: "me",
      id: emailId,
      requestBody: {
        addLabelIds: ["INBOX", id],
        removeLabelIds: ["UNREAD"],
      },
    });
    console.log("Reply sent.");
  } catch (err) {
    console.error(err);
  }
}

// List and reply to unread emails
async function listAndReplyToEmails() {
  try {
    const res = await gmail.users.messages.list({
      userId: "me",
      labelIds: ["UNREAD", "INBOX"],
      maxResults: 5,
    });

    const emails = res.data.messages;
    if (emails && emails.length) {
      console.log("Recent emails:");
      for (const email of emails) {
        const res = await gmail.users.messages.get({
          userId: "me",
          id: email.id,
        });

        const subject = res.data.payload.headers.find(
          (header) => header.name === "Subject"
        ).value;

        const sender = res.data.payload.headers.find(
          (header) => header.name === "From"
        ).value;

        console.log("- Sender:", sender);
        console.log("- Subject:", subject);

        const body =
          "Thank you for your email. Your message has been received and will be processed shortly.";
        await replyToEmail(email.id, subject, body);
      }
    } else {
      console.log("No new emails.");
    }
  } catch (err) {
    console.error(err);
  }
}

// Start the application
async function startApp() {
  await loadToken();
  const checkLabel = await checkFileExists("label");
  if (!checkLabel) {
    console.log("Checking for label...");
    await createLabelIfNotExists();
  }

  console.log("Checking for new emails...");
  await listAndReplyToEmails();

  const randomInterval = Math.floor(Math.random() * 76) + 45; // Random interval between 45 and 120 seconds

  setTimeout(startApp, randomInterval * 1000); // Convert seconds to milliseconds
}

startApp();

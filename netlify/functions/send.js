const twilio = require("twilio");

exports.handler = async function (event, context) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  try {
    // Get Twilio credentials from Netlify Environment Variables
    const accountSid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_TOKEN;
    const fromNumber = process.env.TWILIO_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error("Missing Twilio environment variables.");
    }

    const client = twilio(accountSid, authToken);

    // Parse the request body
    const data = JSON.parse(event.body);
    const to = data.to;
    const message = data.message;

    if (!to || !message) {
      throw new Error("Missing 'to' or 'message' field.");
    }

    // Send SMS using Twilio
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: to
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        sid: result.sid
      })
    };

  } catch (error) {
    console.error("Error sending message:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};


const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
  const sqs = new AWS.SQS();

  // SQS url
  const queueUrl = process.env.sqsurl;

  try {
    // Receive messages from the SQS queue
    const receiveMessageResult = await sqs.receiveMessage({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
      VisibilityTimeout: 30, 
      WaitTimeSeconds: 20, 
    }).promise();

 
    if (receiveMessageResult.Messages && receiveMessageResult.Messages.length > 0) {
      // Process the message
      const message = receiveMessageResult.Messages[0];
      console.log('Received message:', message.Body);

      // Delete the message from the SQS queue
      await sqs.deleteMessage({
        QueueUrl: queueUrl,
        ReceiptHandle: message.ReceiptHandle,
      }).promise();

      console.log('Message deleted from the queue.');

      return {
        statusCode: 200,
        body: message.Body,
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*', // Add necessary CORS headers
        },
      };
    } else {
      console.log('No messages in the queue.');

      return {
        statusCode: 200,
        body: 'No messages in the queue.',
      };
    }

  } catch (error) {
    console.error('Error receiving messages:', error);
    return {
      statusCode: 500,
      body: 'Error receiving messages!',
    };
  }
};

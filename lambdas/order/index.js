const AWS = require('aws-sdk');

// Set the region for AWS services
AWS.config.update({ region: 'us-east-1' });

const sns = new AWS.SNS();
const sqs = new AWS.SQS();

exports.handler = async (event, context) => {
  try {
    //SNS ARN and sqs queue
    const topicArn = process.env.snsarn;
    const queueUrl = process.env.sqsurl;
    const requestBody = JSON.parse(event.body);
    const message = JSON.stringify(requestBody);

    const snsParams = {
      TopicArn: topicArn,
      Message: message,
    };
    const sqsParams = {
      MessageBody: message,
      QueueUrl: queueUrl,
    };

    // Send the message to SQS
    sqs.sendMessage(sqsParams, (err, data) => {
      if (err) {
        console.error('Error sending message to SQS:', err);
      } else {
        console.log('Message sent successfully to SQS:', data.MessageId);
      }
    });

    // Publish the message to the SNS topic
    const publishResult = await sns.publish(snsParams).promise();
    console.log('Message published successfully to SNS:', publishResult.MessageId);

    return {
      statusCode: 200,
      body: 'Message published successfully!',
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*', // Add necessary CORS headers
      },
    };
  } catch (error) {
    console.error('Error:', error);

    return {
      statusCode: 500,
      body: 'Error publishing message!',
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*', // Add necessary CORS headers
      },
    };
  }
};

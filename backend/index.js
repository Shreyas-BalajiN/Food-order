const express=require('express');
const app=express();
const cors= require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
const serverless = require('serverless-http')
const AWS = require('aws-sdk');
const params = {
    TableName: 'Restaurants',
  };
const dynamodb = new AWS.DynamoDB.DocumentClient()
app.get('/places',(req,res)=>{
    dynamodb.scan(params, (err, data) => {
        if (err) {
          console.error('Error retrieving data from DynamoDB:', err);
        } else {
          res.send(data.Items)
        }
      });
})

app.post('/order',async(req,res)=>{
  const sns = new AWS.SNS();
  const sqs = new AWS.SQS();
  // The ARN of the SNS topic you want to publish to
  const topicArn = process.env.snsarn;
  const queueUrl = process.env.sqsurl;
  console.log(req.body)
  console.log(JSON.stringify(req.body))
  // The message you want to publish to the SNS topic
  const message = JSON.stringify(req.body)

  // Prepare the parameters for the SNS publish operation
  const params = {
    TopicArn: topicArn,
    Message: message,
  };
  const sqsparams = {
    MessageBody: message,
    QueueUrl: queueUrl,
  }
  sqs.sendMessage(params, (err, data) => {
    if (err) {
      console.error('Error sending message to SQS:', err);
    } else {
      console.log('Message sent successfully:', data.MessageId);
    }
  });
  try {
    // Publish the message to the SNS topic
    const publishResult = await sns.publish(params).promise();
    console.log('Message published successfully:', publishResult.MessageId);
    return {
      statusCode: 200,
      body: 'Message published successfully!',
    };
  } catch (error) {
    console.error('Error publishing message:', error);
    return {
      statusCode: 500,
      body: 'Error publishing message!',
    };
  }
})
app.get('/recipt',async(req,res)=>{
  const sqs = new AWS.SQS();

  // The URL of the SQS queue from which you want to receive messages
  const queueUrl = process.env.sqsurl;

  try {
    // Receive messages from the SQS queue
    const receiveMessageResult = await sqs.receiveMessage({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1, // Number of messages to retrieve (adjust as needed)
      VisibilityTimeout: 30, // Visibility timeout for the messages (adjust as needed)
      WaitTimeSeconds: 20, // Long polling to wait for messages (adjust as needed)
    }).promise();

    // Process the received messages, if any
    if (receiveMessageResult.Messages && receiveMessageResult.Messages.length > 0) {
      // Process the message (assuming you are only receiving one message at a time)
      const message = receiveMessageResult.Messages[0];
      console.log('Received message:', message.Body);
      res.send(message.Body)

      // TODO: Add your custom processing logic here

      // Delete the message from the SQS queue
      await sqs.deleteMessage({
        QueueUrl: queueUrl,
        ReceiptHandle: message.ReceiptHandle,
      }).promise();

      console.log('Message deleted from the queue.');
    } else {
      console.log('No messages in the queue.');
    }

  } catch (error) {
    console.error('Error receiving messages:', error);
    return {
      statusCode: 500,
      body: 'Error receiving messages!',
    };
  }
})

module.exports.handler=serverless(app)
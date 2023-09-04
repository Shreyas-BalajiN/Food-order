const AWS = require('aws-sdk');

// Set the region for AWS services
AWS.config.update({ region: 'us-east-1' });

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  try {
    const params = {
      TableName: 'Restaurants',
    };

    const data = await dynamodb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Add necessary CORS headers
      },
    };
  } catch (err) {
    console.error('Error retrieving data from DynamoDB:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error retrieving data from DynamoDB' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Add necessary CORS headers
      },
    };
  }
};

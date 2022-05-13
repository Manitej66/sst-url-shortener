import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  try {
    const items = await dynamoDb
      .scan({
        TableName: process.env.TABLE_NAME,
      })
      .promise();

    if (items.Items) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: items.Items,
      };
    }
  } catch (error) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
};

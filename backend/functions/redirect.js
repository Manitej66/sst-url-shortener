import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  try {
    const { short_url } = event.pathParameters;

    const item = await dynamoDb
      .query({
        TableName: process.env.TABLE_NAME,
        IndexName: "shortUrlIndex",
        KeyConditionExpression: "short_url = :short_url",
        ExpressionAttributeValues: {
          ":short_url": short_url,
        },
      })
      .promise();

    if (item.Items) {
      // redirect to the short url
      return {
        statusCode: 302,
        headers: {
          Location: item.Items[0].og_url,
        },
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

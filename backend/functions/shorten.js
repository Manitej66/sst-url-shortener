import { nanoid } from "nanoid";
import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  try {
    const { og_url } = event.queryStringParameters;
    const exists = await dynamoDb
      .get({
        TableName: process.env.TABLE_NAME,
        Key: {
          og_url,
        },
      })
      .promise();

    if (exists.Item) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          short_url: exists.Item.short_url,
        }),
      };
    }

    const short_url = nanoid(6);
    await dynamoDb
      .put({
        TableName: process.env.TABLE_NAME,
        Item: {
          og_url,
          short_url,
        },
        ConditionExpression: "attribute_not_exists(og_url)",
      })
      .promise();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        short_url,
      }),
    };
  } catch (error) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
};

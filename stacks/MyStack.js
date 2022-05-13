import {
  StackContext,
  Api,
  Table,
  ViteStaticSite,
} from "@serverless-stack/resources";

/**
 * @param {StackContext} ctx
 */
export function MyStack({ stack }) {
  const table = new Table(stack, "Notes", {
    fields: {
      og_url: "string",
      short_url: "string",
    },
    primaryIndex: {
      partitionKey: "og_url",
    },
    globalIndexes: {
      shortUrlIndex: {
        partitionKey: "short_url",
      },
    },
  });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        environment: {
          TABLE_NAME: table.tableName,
        },
        permissions: [table],
      },
    },
    routes: {
      "GET /shorten": "functions/shorten.handler",
      "GET /{short_url}": "functions/redirect.handler",
      "GET /links": "functions/links.handler",
    },
  });

  let site;

  site = new ViteStaticSite(stack, "Site", {
    path: "frontend",
    environment: {
      VITE_APP_API_URL: api.url,
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    SiteUrl: site.url,
  });
}

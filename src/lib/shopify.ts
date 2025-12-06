import "@shopify/shopify-api/adapters/node";
import { shopifyApi, ApiVersion } from "@shopify/shopify-api";

export const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY || "",
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  scopes: ["read_products", "read_orders", "read_customers"],
  hostName: process.env.NEXTAUTH_URL?.replace("https://", "").replace("http://", "") || "localhost:3000",
  apiVersion: ApiVersion.October24,
  isEmbeddedApp: false,
});

export interface ShopifyConfig {
  shop: string;
  accessToken: string;
}

export async function createShopifyClient(config: ShopifyConfig) {
  const session = shopify.session.customAppSession(config.shop);
  session.accessToken = config.accessToken;
  
  return {
    session,
    graphql: new shopify.clients.Graphql({ session }),
    rest: new shopify.clients.Rest({ session }),
  };
}

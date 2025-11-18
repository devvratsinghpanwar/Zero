import { Redis } from "@upstash/redis"


const KV_REST_API_URL = process.env.KV_REST_API_URL
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN

if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
  throw new Error(
    "KV_REST_API_URL and KV_REST_API_TOKEN environment variables are not set."
  )
}

export const kv = new Redis({
  url: KV_REST_API_URL,
  token: KV_REST_API_TOKEN,
})

export async function testKvConnection() {
  try {

    await kv.set("test_connection", "working")
    const result = await kv.get("test_connection")

    return {
      success: true,
      message: "KV connection successful",
      result,
      environmentVariables: {
        KV_REST_API_URL: KV_REST_API_URL ? "Set (value hidden)" : "Not set",
        KV_REST_API_TOKEN: KV_REST_API_TOKEN ? "Set (value hidden)" : "Not set",

        NODE_ENV: process.env.NODE_ENV,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: "KV connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
      environmentVariables: {
        KV_REST_API_URL: KV_REST_API_URL ? "Set (value hidden)" : "Not set",
        KV_REST_API_TOKEN: KV_REST_API_TOKEN ? "Set (value hidden)" : "Not set",

        NODE_ENV: process.env.NODE_ENV,
      },
    }
  }
}

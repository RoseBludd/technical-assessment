import { Anthropic } from "@anthropic-ai/sdk";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function testAnthropicAPI() {
  console.log("Testing Anthropic API connection...");

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error(
      "Error: ANTHROPIC_API_KEY not found in environment variables"
    );
    process.exit(1);
  }

  console.log("API Key found:", apiKey.substring(0, 20) + "...");
  console.log("API Key length:", apiKey.length);

  const anthropic = new Anthropic({
    apiKey,
  });

  try {
    console.log("\nSending test message...");
    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: "Say hello!",
        },
      ],
    });

    console.log("\nResponse received!");
    console.log("Response ID:", response.id);
    console.log("Model used:", response.model);

    const content = response.content[0];
    if (content && "type" in content && content.type === "text") {
      console.log("\nContent received:", content.text);
      console.log("\nTest successful!");
    } else {
      console.error("\nUnexpected response format:", content);
      process.exit(1);
    }
  } catch (error: any) {
    console.error("\nError testing Anthropic API:");
    if (error.status) {
      console.error(`Status: ${error.status}`);
    }
    if (error.error?.type) {
      console.error(`Error type: ${error.error.type}`);
    }
    if (error.error?.message) {
      console.error(`Error message: ${error.error.message}`);
    }
    if (error.headers) {
      console.error("\nResponse headers:", error.headers);
    }
    process.exit(1);
  }
}

testAnthropicAPI();

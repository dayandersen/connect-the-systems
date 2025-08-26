#!/usr/bin/env bun

import { Convert, Base } from "./typescript_land/generated-src/base.js";

// Bun-specific features demonstration
console.log("🚀 Running with Bun!");

// 1. Environment variables with Bun
const port = process.env.PORT || 3000;
console.log(`Server will run on port: ${port}`);

// 2. File system operations with Bun
async function readSchemaFile() {
  try {
    const schemaContent = await Bun.file("./schemas/base.schema.json").text();
    console.log("✅ Successfully read schema file");
    return schemaContent;
  } catch (error) {
    console.error("❌ Error reading schema file:", error);
    throw error;
  }
}

// 3. Parse and validate JSON using our generated types
async function validateAndParseJson(jsonString: string) {
  try {
    const base = Convert.toBase(jsonString);
    console.log("✅ JSON validation successful");
    console.log(`Parsed object ID: ${base.properties.id.description}`);
    return base;
  } catch (error) {
    console.error("❌ JSON validation failed:", error);
    throw error;
  }
}

// 4. Create a simple HTTP server with Bun
const server = Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);
    
    if (url.pathname === "/") {
      return new Response("Welcome to Connect the Systems API! Use /validate to validate JSON");
    }
    
    if (url.pathname === "/validate" && req.method === "POST") {
      try {
        const body = await req.text();
        const parsed = await validateAndParseJson(body);
        return Response.json({
          success: true,
          data: parsed,
          message: "JSON validated successfully"
        });
      } catch (error) {
        return Response.json({
          success: false,
          error: error.message
        }, { status: 400 });
      }
    }
    
    if (url.pathname === "/health") {
      return Response.json({ status: "healthy", runtime: "Bun" });
    }
    
    return new Response("Not Found", { status: 404 });
  },
});


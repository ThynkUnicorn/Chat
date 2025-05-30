// backend/api/chat.js
const fetch = require("node-fetch"); // npm i node-fetch@^3

// Build the HF endpoint from your MODEL_ID env var
const HF_URL = `https://api-inference.huggingface.co/models/${process.env.HF_MODEL_ID}`;

/**
 * Send a payload to HF Inference and return parsed JSON/text
 */
async function callHF(payload) {
  const res = await fetch(HF_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HF API Error ${res.status}: ${txt}`);
  }
  return res.json();
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 1️⃣ Extract text and image from the request
    const { message = "", imageBase64 } = req.body;
    const text = message.trim();

    if (!imageBase64) {
      return res.status(400).json({ error: "No image provided. Please upload a profile photo or screenshot." });
    }

    // 2️⃣ Compose a single prompt instructing the model to output your JSON blueprint
    const prompt = `
You are a Social Media Audit Assistant.
Given the profile photo and optional accompanying text, produce **only** this JSON schema:

{
  "platformSelection": "twitter|linkedin|instagram|tiktok|facebook|website",
  "profileOptimizationAudit": "...",
  "contentAudit": "...",
  "audienceEngagementAudit": "...",
  "hashtagsSEO": "...",
  "competitorBenchmarking": "...",
  "toolsAutomation": "...",
  "reportGeneration": "..."
}

Photo: (binary image data)
Text: "${text}"

Respond **exactly** with valid JSON, no extra explanation.
    `.trim();

    // 3️⃣ Prepare HF payload for a vision+prompt call
    const hfPayload = {
      inputs: {
        image: imageBase64,
        parameters: { prompt },
      },
      options: { wait_for_model: true },
    };

    // 4️⃣ Ensure credentials are set
    if (!process.env.HF_TOKEN || !process.env.HF_MODEL_ID) {
      throw new Error("HF_TOKEN or HF_MODEL_ID is not set in environment");
    }

    // 5️⃣ Invoke Hugging Face
    const hfRaw = await callHF(hfPayload);

    // 6️⃣ Parse the response (string or array of strings)
    let audit;
    if (typeof hfRaw === "string") {
      audit = JSON.parse(hfRaw);
    } else if (Array.isArray(hfRaw) && typeof hfRaw[0] === "string") {
      audit = JSON.parse(hfRaw[0]);
    } else {
      audit = hfRaw;
    }

    // 7️⃣ Return the structured JSON audit object
    return res.status(200).json(audit);

  } catch (err) {
    console.error("❌ /api/chat error:", err);
    return res.status(500).json({ error: err.message || "Unknown server error" });
  }
};

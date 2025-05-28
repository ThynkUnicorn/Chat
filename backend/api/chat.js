// backend/api/chat.js

const fetch = require("node-fetch");  // npm i node-fetch@^3

// 1️⃣ Helpers

// Build the HF endpoint from your MODEL_ID env var
const HF_URL = `https://api-inference.huggingface.co/models/${process.env.HF_MODEL_ID}`;

/**
 * Call Hugging Face Inference API.
 * @param {object} payload – body to POST
 */
async function callHF(payload) {
  const r = await fetch(HF_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_TOKEN}`,    // set in Vercel
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`HF Error ${r.status}: ${txt}`);
  }
  return r.json();
}

/**
 * If user sends "@handle", fetch their Twitter avatar as base64.
 * Requires TW_BEARER in env.
 */
async function fetchProfilePicture(handle) {
  if (!handle.startsWith("@") || !process.env.TW_BEARER) return null;

  const user = await fetch(
    `https://api.twitter.com/2/users/by/username/${handle.slice(1)}`,
    { headers: { Authorization: `Bearer ${process.env.TW_BEARER}` } }
  ).then((r) => r.json());

  const url = user?.data?.profile_image_url?.replace("_normal", "");
  if (!url) return null;

  const buf = await fetch(url).then((r) => r.arrayBuffer());
  return `data:image/jpeg;base64,${Buffer.from(buf).toString("base64")}`;
}

// 2️⃣ Handler

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, imageBase64, platform } = req.body;

    // Decide on text prompt
    const text = (message || "").trim();

    // ①  If uploaded or @handle, get an image
    let image = imageBase64 || null;
    if (!image && text.startsWith("@")) {
      image = await fetchProfilePicture(text).catch(() => null);
    }

    // ②  Build HF payload
    const hfPayload = image
      ? {
          inputs: {
            image,
            parameters: { prompt: text },
          },
          options: { wait_for_model: true },
        }
      : {
          inputs: text || "Hello",
          options: { wait_for_model: true },
        };

    // ③  Actually call HF if you have creds, otherwise mock
    let hfResponse;
    if (process.env.HF_TOKEN && process.env.HF_MODEL_ID) {
      hfResponse = await callHF(hfPayload);
    } else {
      hfResponse = { message: "🔒 No HF_TOKEN set – returning mock data." };
    }

    // ④  Shape your audit however you like
    const audit = {
      platform: platform || null,
      audit_section: "Profile Optimization",
      modelAnswer: hfResponse,
      evaluation: {
        professionalism: "7/10",
        keywords_presence: "Needs Improvement",
      },
      feedback: ["Add niche keywords to your bio."],
    };

    return res.status(200).json(audit);
  } catch (err) {
    console.error("❌ /api/chat error:", err);
    return res.status(500).json({ error: err.message || "Unknown error" });
  }
};

// src/api/chat.js

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload  = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

export async function chat({ text, image }) {
  const imageBase64 = image ? await toBase64(image) : null;
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, imageBase64 }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

import { kv } from "@vercel/kv";

function randomCode(length = 7) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL kosong" });

  let code;
  do {
    code = randomCode();
  } while (await kv.get(code));

  await kv.set(code, url);

  res.json({
    short: `/${code}`
  });
}

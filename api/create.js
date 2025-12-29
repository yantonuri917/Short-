import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { longUrl } = req.body;
  if (!longUrl) {
    return res.status(400).json({ error: "URL kosong" });
  }

  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const randomCode = () =>
    Array.from({ length: 6 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");

  let code;
  do {
    code = randomCode();
  } while (await kv.get(code));

  await kv.set(code, longUrl);

  res.json({
    shortUrl: `${req.headers.origin}/${code}`
  });
}

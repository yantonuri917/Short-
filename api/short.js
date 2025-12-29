import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const code = pathname.replace("/", "");

  // redirect
  if (code && req.method === "GET") {
    const url = await kv.get(code);
    if (url) {
      return res.redirect(302, url);
    }
    return res.status(404).send("Link tidak ditemukan");
  }

  // create short link
  if (req.method === "POST") {
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

    return res.json({
      shortUrl: `${req.headers.origin}/${code}`
    });
  }

  res.status(405).end();
}

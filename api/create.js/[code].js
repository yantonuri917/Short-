import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  const { code } = req.query;

  const url = await kv.get(code);
  if (url) {
    return res.redirect(302, url);
  }

  res.status(404).send("Link tidak ditemukan");
}

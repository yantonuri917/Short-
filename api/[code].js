import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  const { code } = req.query;
  const target = await kv.get(code);

  if (!target) {
    return res.status(404).send("Link tidak ditemukan");
  }

  res.writeHead(302, { Location: target });
  res.end();
}

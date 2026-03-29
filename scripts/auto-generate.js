const fs = require('fs');
const path = require('path');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const AMAZON_ID = process.env.AMAZON_TRACKING_ID || '';
const RAKUTEN_ID = process.env.RAKUTEN_AFFILIATE_ID || '';

const KEYWORDS = [
  {kw:"\u6d17\u9854 \u6b63\u3057\u3044\u3084\u308a\u65b9 \u9806\u756a",genre:"skincare"},
  {kw:"\u5316\u7ca7\u6c34 \u6d78\u900f \u30b3\u30c4",genre:"skincare"},
  {kw:"\u30cb\u30ad\u30d3\u8de1 \u6d88\u3059 \u65b9\u6cd5",genre:"acne"},
  {kw:"\u6bdb\u7a74 \u9ed2\u305a\u307f \u539f\u56e0 \u5bfe\u7b56",genre:"skincare"},
  {kw:"\u65e5\u713c\u3051\u6b62\u3081 \u5857\u308a\u76f4\u3057 \u65b9\u6cd5",genre:"sunscreen"},
  {kw:"\u7f8e\u767d \u304a\u3059\u3059\u3081 \u5316\u7ca7\u54c1",genre:"serum"},
  {kw:"\u4e7e\u71e5\u808c \u30b9\u30ad\u30f3\u30b1\u30a2 \u51ac",genre:"moisturizer"},
  {kw:"\u30ec\u30c1\u30ce\u30fc\u30eb \u52b9\u679c \u4f7f\u3044\u65b9",genre:"serum"},
  {kw:"\u30d3\u30bf\u30df\u30f3C \u7f8e\u5bb9\u6db2 \u304a\u3059\u3059\u3081",genre:"serum"},
  {kw:"\u6bce\u65e5\u30b9\u30ad\u30f3\u30b1\u30a2 \u9806\u756a \u57fa\u672c",genre:"skincare"}
];

const SYS = `あなたは美容皮膚科専門ライターです。読者目線で分かりやすく、SEOに強い記事を書きます。見出しはH2/H3を使ってください。文字数2000字以上。Markdown形式で出力。記事内でおすすめ商品を紹介する箇所には[AMAZON:商品名]と[RAKUTEN:商品名]を合計5箇所挿入してください。`;

function insertLinks(text) {
  text = text.replace(/\[AMAZON:([^\]]+)\]/g, (_, p) => {
    return `[🛒 ${p}をAmazonでチェック](https://www.amazon.co.jp/s?k=${encodeURIComponent(p)}&tag=${AMAZON_ID})`;
  });
  text = text.replace(/\[RAKUTEN:([^\]]+)\]/g, (_, p) => {
    return `[🛍 ${p}を楽天でチェック](https://search.rakuten.co.jp/search/mall/${encodeURIComponent(p)}/?rafcid=${RAKUTEN_ID})`;
  });
  return text;
}

function toSlug(kw) {
  return kw.replace(/[\s\u3000]+/g, '-').replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF-]/g, '') + '-' + Date.now();
}

async function generateArticle(kw, genre) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      system: SYS,
      messages: [{ role: 'user', content: `ジャンル：${genre}\nキーワード：「${kw}」\n\nSEO記事をMarkdownで書いてください。` }],
    }),
  });
  const data = await res.json();
  return data.content?.map(c => c.text || '').join('') || '';
}

async function main() {
  const contentDir = path.join(process.cwd(), 'content/blog');
  if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true });

  const targets = KEYWORDS.sort(() => Math.random() - 0.5).slice(0, 5);

  for (const { kw, genre } of targets) {
    console.log(`生成中: ${kw}`);
    try {
      let text = await generateArticle(kw, genre);
      text = insertLinks(text);
      const slug = toSlug(kw);
      const content = `---\ntitle: "${kw}"\ndate: "${new Date().toISOString().split('T')[0]}"\ngenre: "${genre}"\ntags: [${genre}]\n---\n\n${text}\n`;
      fs.writeFileSync(path.join(contentDir, `${slug}.mdx`), content);
      console.log(`完了: ${slug}.mdx`);
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      console.error(`エラー: ${kw}`, e.message);
    }
  }
  console.log('全記事生成完了！');
}

main();

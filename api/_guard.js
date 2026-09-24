// Shared guard - tham khảo cách LuArmor / LuaGuard / loader vercel (.vercel.app/loader.lua, soluna-script.vercel.app)
// Nguyên tắc: browser gửi User-Agent chứa Mozilla + Accept: text/html + Sec-Fetch-Mode: navigate
// Executor / game:HttpGet gửi Accept: */* , UA dạng Roblox* / không có Mozilla, kèm header Roblox-Id
// Tool/bot (curl, python-requests, postman...) có UA đặc trưng -> chặn riêng

function getHeader(req, name) {
  const h = req.headers || {};
  // Vercel/Node lower-case hết header, nhưng check cả 2 kiểu cho chắc
  return h[name] || h[name.toLowerCase()] || h[name.toUpperCase()] || "";
}

function isBrowser(req) {
  const ua = String(getHeader(req, "user-agent") || "").toLowerCase();
  const accept = String(getHeader(req, "accept") || "").toLowerCase();
  const secFetchMode = String(getHeader(req, "sec-fetch-mode") || "").toLowerCase();
  const secFetchDest = String(getHeader(req, "sec-fetch-dest") || "").toLowerCase();
  const upgradeInsecure = String(getHeader(req, "upgrade-insecure-requests") || "");

  // 1. UA browser chuẩn
  if (
    ua.includes("mozilla") ||
    ua.includes("applewebkit") ||
    ua.includes("chrome") ||
    ua.includes("safari") ||
    ua.includes("firefox") ||
    ua.includes(" edg") ||
    ua.includes("edge") ||
    ua.includes("opr/") ||
    ua.includes("opera")
  ) {
    return true;
  }
  // 2. Accept xin HTML = browser navigate (executor luôn gửi */*)
  if (accept.includes("text/html")) return true;
  // 3. Sec-Fetch của browser khi mở link trực tiếp
  if (secFetchMode === "navigate" || secFetchDest === "document") return true;
  // 4. Header chỉ browser gửi khi gõ URL
  if (upgradeInsecure === "1" && accept.includes("*")) {
    // curl cũng có thể fake, nhưng kết hợp với UA check ở trên là đủ
    // giữ check này nhẹ để không false-positive executor
  }
  return false;
}

const BOT_PATTERNS = [
  "curl", "wget", "python", "requests", "urllib", "httpclient",
  "postman", "insomnia", "httpie", "axios", "node-fetch", "node.js",
  "go-http", "golang", "java/", "libcurl", "php", "powershell",
  "discordbot", "telegrambot", "bot", "crawler", "spider", "scrapy",
  "headless", "phantomjs", "selenium", "puppeteer",
];

function isBotTool(req) {
  const ua = String(getHeader(req, "user-agent") || "").toLowerCase();
  if (!ua) return false; // UA rỗng -> có thể là executor custom, cho qua để check key tiếp
  return BOT_PATTERNS.some((p) => ua.includes(p));
}

// HttpService của Roblox tự gửi header Roblox-Id (PlaceId). Browser bao giờ cũng không có.
// Nếu có header này thì chắc chắn là từ game/executor, ưu tiên cho qua (vẫn check key sau).
function hasRobloxHint(req) {
  const h = req.headers || {};
  return Boolean(
    h["roblox-id"] ||
    h["roblox-place-id"] ||
    h["roblox-game-id"] ||
    h["roblox-session-id"]
  );
}

function hasValidKey(req) {
  const secret = process.env.SECRET_KEY || "";
  if (!secret) return true; // chưa set key -> mode dễ test
  const url = new URL(req.url || "/", "http://localhost");
  const key = url.searchParams.get("key") || url.searchParams.get("k") || "";
  const headerKey =
    getHeader(req, "x-loader-key") || getHeader(req, "x-key") || "";
  return key === secret || headerKey === secret;
}

function getRealLua() {
  return process.env.REAL_LUA || 'print("sodiumhubloadertest")';
}

function getFakeLua() {
  // Fake cho bot/tool và người share link lậu: vẫn là lua hợp lệ để tool tưởng thành công
  return process.env.FAKE_LUA || 'print("nice try - protected by sodiumhub")';
}

function noStore(res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
}

module.exports = {
  getHeader,
  isBrowser,
  isBotTool,
  hasRobloxHint,
  hasValidKey,
  getRealLua,
  getFakeLua,
  noStore,
};

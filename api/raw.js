// MODE 1: BLACK SCREEN
// Mở web -> chỉ thấy màn hình đen, View-Source cũng không thấy lua
// Executor: loadstring(game:HttpGet("https://domain.vercel.app/api/raw?key=SECRET"))() -> nhận print("sodiumhubloadertest")
// Tool/bot (curl/python/postman): nhận FAKE_LUA

const {
  isBrowser,
  isBotTool,
  hasRobloxHint,
  hasValidKey,
  getRealLua,
  getFakeLua,
  noStore,
} = require("./_guard");

const BLACK_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive">
<title></title>
<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:#000;overflow:hidden}
*{background:#000!important;color:#000!important;border:0!important}
::-webkit-scrollbar{display:none}
</style>
</head>
<body>
<script>
// Chặn chuột phải / Ctrl+U / Ctrl+S / F12 nhưng vẫn giữ màn hình đen hoàn toàn
document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("keydown", e => {
  if (e.key === "F12") e.preventDefault();
  if ((e.ctrlKey || e.metaKey) && ["u","s","c","p"].includes(e.key.toLowerCase())) e.preventDefault();
});
</script>
</body>
</html>`;

module.exports = async function handler(req, res) {
  noStore(res);

  // 1. Browser (kể cả View-Source, DevTools, iframe) -> màn đen, KHÔNG bao giờ trả lua
  if (isBrowser(req)) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(BLACK_HTML);
  }

  // 2. Tool/bot lộ UA (curl, python-requests, postman...) mà không có hint Roblox -> fake lua
  if (isBotTool(req) && !hasRobloxHint(req)) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(200).send(getFakeLua());
  }

  // 3. Sai / thiếu key -> fake lua (chống share link, chống bot đoán URL)
  if (!hasValidKey(req)) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(200).send(getFakeLua());
  }

  // 4. Executor / Roblox hợp lệ -> lua thật
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  return res.status(200).send(getRealLua());
};

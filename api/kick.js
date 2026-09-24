// MODE 2: KICK (đá ra ngoài)
// Mở web -> bị đá văng ra (redirect khỏi trang), không xem được gì
// Executor: loadstring(game:HttpGet("https://domain.vercel.app/api/kick?key=SECRET"))() -> nhận print("sodiumhubloadertest")
// Tool/bot: nhận FAKE_LUA

const {
  isBrowser,
  isBotTool,
  hasRobloxHint,
  hasValidKey,
  getRealLua,
  getFakeLua,
  noStore,
} = require("./_guard");

const KICK_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive">
<title>Access Denied</title>
<style>
html,body{margin:0;padding:0;width:100%;height:100%;background:#000;color:#fff;font-family:Arial,sans-serif}
#m{display:flex;align-items:center;justify-content:center;height:100%;font-size:18px}
</style>
</head>
<body>
<div id="m">Access Denied - Redirecting...</div>
<script>
(function(){
  // Đá ra ngoài ngay: về trang trắng rồi văng ra Google. Đổi URL dưới nếu muốn đá đi chỗ khác.
  var OUT = "https://www.google.com/";
  try { history.replaceState(null, "", "/"); } catch(e) {}
  document.addEventListener("contextmenu", function(e){ e.preventDefault(); });
  document.addEventListener("keydown", function(e){
    if (e.key === "F12") e.preventDefault();
    if ((e.ctrlKey || e.metaKey) && ["u","s","c","p"].includes(e.key.toLowerCase())) e.preventDefault();
  });
  // Thử đóng tab (chỉ work với tab mở bằng script), sau đó redirect
  setTimeout(function(){
    try { window.close(); } catch(e) {}
    try { window.location.replace(OUT); } catch(e) { window.location.href = OUT; }
  }, 600);
  // Backup: nếu bị chặn redirect thì back về trang trước
  setTimeout(function(){ try { history.back(); } catch(e) {} }, 1200);
})();
</script>
</body>
</html>`;

module.exports = async function handler(req, res) {
  noStore(res);

  if (isBrowser(req)) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(KICK_HTML);
  }

  if (isBotTool(req) && !hasRobloxHint(req)) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(200).send(getFakeLua());
  }

  if (!hasValidKey(req)) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(200).send(getFakeLua());
  }

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  return res.status(200).send(getRealLua());
};

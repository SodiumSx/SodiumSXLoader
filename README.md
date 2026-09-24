# SodiumHub Anti-Raw (Vercel)

Repo chống xem trộm source loader Roblox, tham khảo cách các loader thật đang dùng (`*.vercel.app/loader.lua`, `soluna-script.vercel.app`, LuArmor, LuaGuard):

- Browser gửi `User-Agent: Mozilla/...` + `Accept: text/html` + `Sec-Fetch-Mode: navigate`
- Executor / `game:HttpGet` gửi `Accept: */*`, UA dạng `Roblox*` (không có Mozilla), kèm header `Roblox-Id`
- Tool/bot (`curl`, `python-requests`, `postman`...) có UA đặc trưng riêng

## Có gì trong repo

| Route | Mở bằng browser | Executor `game:HttpGet` + đúng `?key=` | Tool/bot hoặc sai key |
|---|---|---|---|
| `/` | Màn hình đen | - | - |
| `/api/raw` (mode 1) | Màn hình đen, view-source cũng đen | `print("sodiumhubloadertest")` | `FAKE_LUA` |
| `/api/kick` (mode 2) | Hiện "Access Denied" 0.6s rồi đá ra Google | `print("sodiumhubloadertest")` | `FAKE_LUA` |

Source thật nằm trong biến môi trường `REAL_LUA`, **không bao giờ nằm trong HTML trả cho browser**.

## Deploy lên Vercel (5 phút)

1. Push folder này lên GitHub (tạo repo mới, upload hết file).
2. Vào [vercel.com](https://vercel.com) > Add New > Project > Import repo vừa push > Deploy.
3. Vào Project > Settings > Environment Variables, thêm:
   - `SECRET_KEY` = `sodiumhub_123` (tự đổi thành key riêng, khó đoán)
   - `REAL_LUA` = `print("sodiumhubloadertest")`
   - `FAKE_LUA` = `print("nice try - protected")`
4. Redeploy (Deployments > Redeploy) để ăn env mới.

## Cách xài trong executor

```lua
-- Mode màn đen:
loadstring(game:HttpGet("https://ten-project-cua-ban.vercel.app/api/raw?key=sodiumhub_123"))()

-- Mode đá ra ngoài:
loadstring(game:HttpGet("https://ten-project-cua-ban.vercel.app/api/kick?key=sodiumhub_123"))()
```

## Test nhanh

- Mở `https://.../api/raw` bằng Chrome/Firefox -> phải thấy **màn đen hoàn toàn**, Ctrl+U cũng đen.
- Mở `https://.../api/kick` -> hiện "Access Denied" rồi **tự đá ra Google**.
- Giả lập executor (lua thật):
  ```powershell
  curl.exe -H "Accept: */*" "https://.../api/raw?key=sodiumhub_123"
  # -> print("sodiumhubloadertest")
  ```
- Giả lập browser:
  ```powershell
  curl.exe -H "User-Agent: Mozilla/5.0" -H "Accept: text/html" "https://.../api/raw?key=sodiumhub_123"
  # -> <html>...màn đen...</html>
  ```
- Giả lập bot:
  ```powershell
  curl.exe -H "User-Agent: python-requests/2.0" "https://.../api/raw?key=sodiumhub_123"
  # -> print("nice try - protected")
  ```

## Đổi nội dung lua thật

Không cần sửa code. Chỉ cần đổi env `REAL_LUA` trên Vercel thành script loader thật của bạn rồi Redeploy.
Muốn tắt check key (test nhanh) thì xóa `SECRET_KEY` đi — nhưng bản production **nên để key** mới chống được tool dò source.

## Lưu ý anti-leak

- User-Agent spoof được, nên `SECRET_KEY` mới là lớp chống bot chính. Đừng share link có `?key=` công khai.
- Muốn mạnh hơn nữa: thêm key theo HWID/whitelist, giới hạn rate-limit, hoặc mã hóa lua (obfuscate) trước khi bỏ vào `REAL_LUA`.

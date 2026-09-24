-- SodiumHub loader test
-- Thay DOMAIN bằng domain vercel của bạn, thay SECRET bằng SECRET_KEY trên Vercel
-- Mode 1 (màn đen):
-- loadstring(game:HttpGet("https://DOMAIN.vercel.app/api/raw?key=SECRET"))()
-- Mode 2 (đá ra ngoài):
-- loadstring(game:HttpGet("https://DOMAIN.vercel.app/api/kick?key=SECRET"))()

-- Ví dụ test local (SECRET_KEY=sodiumhub_123):
-- loadstring(game:HttpGet("http://localhost:3000/api/raw?key=sodiumhub_123"))()

repeat task.wait() until game:IsLoaded()
local ok, err = pcall(function()
    -- ĐỔI 2 DÒNG DƯỚI THÀNH LINK CỦA BẠN
    local URL_BLACK = "https://DOMAIN.vercel.app/api/raw?key=sodiumhub_123"
    -- local URL_KICK = "https://DOMAIN.vercel.app/api/kick?key=sodiumhub_123"

    loadstring(game:HttpGet(URL_BLACK))()
end)
if not ok then
    warn("[sodiumhub] load failed: " .. tostring(err))
end

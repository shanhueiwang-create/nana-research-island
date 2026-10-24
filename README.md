# 娜娜教授研究島 | Professor Nana's Research Island

第一版可離線運作的互動網站原型，無須安裝套件、無須 API key。

## 如何預覽

1. 解壓縮整個 ZIP，保留所有檔案與 `assets` 資料夾。
2. 雙擊 `index.html`，以 Chrome、Safari 或 Edge 開啟。
3. 點選五座島嶼、三位島主、研究圖書館；可搜尋與切換中英文。
4. 若要在手機預覽或公開分享，可將整個資料夾部署至 Netlify Drop、GitHub Pages 或 Vercel 的靜態網站服務。

## 如何更新研究內容

- `data.js`：編輯 `research` 陣列。`zh` / `en` 為中英文題名，`summaryZh` / `summaryEn` 為介紹，`island` 為所屬島嶼，`status` 可為 `draft`、`planned`、`teaching`。
- 確認正式出版資料後，可在研究項目新增 `link: 'https://doi.org/...'`，網站將顯示正式連結。
- `assets/research-island.webp`：研究島首頁美術圖。
- `assets/another-me.webp`：Another Me 原始封面。
- `styles.css`：色彩與手機版樣式。

## 注意

目前為互動原型，不是真正可旋轉的 3D 場景；島嶼使用背景圖片搭配可點擊區域。公開前應逐筆確認論文資訊、學生作品公開授權、肖像與著作權，以及正式對外介紹。現有資料是研究主題示範，**未宣稱所有項目已出版**。網站尚未部署，沒有公開網址。

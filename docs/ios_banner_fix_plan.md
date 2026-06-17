# 首頁 Banner 於 iOS 裝置之預覽圖與影片顯示修復計畫

本計畫針對首頁 Banner 在 iOS 裝置（iPhone、iPad）上無法正常顯示影片與預覽圖，導致畫面空白、黑屏或無法播放之問題進行修復。

## 1. 問題分析

在 iOS (Safari / Chrome for iOS) 平台上，背景影片播放與預覽圖顯示常因以下原因受阻：
1. **自動播放 (Autoplay) 限制與低耗電模式**：
   - iOS 預設禁止有聲音的影片自動播放。若要自動播放，影片必須包含 `muted`、`playsinline` 屬性。
   - 當使用者啟用「低耗電模式」時，iOS 會強制停用所有 `autoplay`。如果影片加載失敗，原生 `poster` 屬性也容易在 Safari 中顯示為空白。
2. **Vue 3 水合作用 (Hydration) 的屬性遺失**：
   - 在 Nuxt/Vue SSR 專案中，直接在模板寫 `muted` 屬性，在客戶端水合（Hydration）時，有時並未真正修改 DOM 節點的 `muted` 屬性值，這會導致 iOS 判定該影片非靜音而拒絕播放。
3. **`<source>` 標籤解析相容性問題**：
   - iOS Safari 對於在 `<video>` 內嵌套 `<source>` 的解析較為嚴苛。直接在 `<video>` 上設定 `src` 屬性是更穩健的做法。
4. **伺服器 HTTP 206 Range 請求支援問題**：
   - iOS 要求影片資源必須支援 HTTP Range 請求。當原生影片加載被阻斷時，原生的 `poster` 預覽圖可能也會一併失效。

---

## 2. 解決方案與優化步驟

我們將對 [MainVisual.vue](file:///Volumes/X9Pro/project/6yuwei_nuxt3/components/MainVisual.vue) 進行以下重構與優化：

### A. 實作自訂預覽圖覆蓋層 (Poster Fallback Overlay)
- 為了確保在低耗電模式、網路極慢或伺服器不支援 206 等極端狀況下，客戶**絕對不會看到空白畫面**，我們新增一個 `<img>` 覆蓋在 `<video>` 之上。
- 透過 Vue 的 `videoPlaying` 狀態控制此 `<img>` 的顯示。一旦影片成功觸發 `@play` 或 `@playing` 事件，便將 `videoPlaying` 設為 `true`，隱藏覆蓋圖，達成無縫的切換效果。
- **簡化互動體驗**：若影片因為系統政策限制（如低耗電模式）無法自動播放，頁面將會維持靜態預覽圖（精美 Banner 圖片）的呈現，不再展示容易因 iOS 政策而被阻擋的手動播放按鈕，使畫面維持乾淨整潔的現代設計感。

### B. 優化 `<video>` 標籤屬性與事件
- 將 `src` 屬性直接寫在 `<video>` 標籤上：`<video src="/videos/main.mp4" ...>`，移除內嵌套的 `<source>`。
- 將 `preload` 設為 `"metadata"` 減少 Range 請求阻礙。
- 明確綁定 `:muted="true"`。

### C. 生命週期與播放邏輯強化
- 在 `onMounted` 階段，透過 JavaScript 明確將 `video.muted = true` 並且呼叫 `video.setAttribute('muted', '')` 與 `video.setAttribute('playsinline', '')`，以確保 iOS 核心能百分之百識別為靜音且行內播放。
- 監聽影片的 `@play`、`@playing` 與 `@pause` 事件，即時更新播放狀態，控制自訂預覽圖的顯隱。

### D. CSS 樣式微調
- 新增 `.videoPosterFallback` 樣式，使其絕對定位填滿父容器，並設定 `pointer-events: none` 確保它不會干擾任何使用者對影片的點擊或操作。
- 確保其 `object-fit`（手機版為 `cover`，桌機版為 `contain`）與 video 的設置完全對齊，避免切換時產生畫面閃爍或抖動。

---

## 3. 預期效果
1. **高成功率的背景影片播放**：在一般 iOS 模式下，影片會以極高成功率自動順暢播放。
2. **完美的備用預覽圖**：在低耗電模式或影片無法自動播放時，系統會無縫展示首頁 Banner 預覽圖，沒有額外的播放按鈕干擾畫面，提升網頁整體質感，避免客戶流失。

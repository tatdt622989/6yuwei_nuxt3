# 首頁 Banner 於 iOS 裝置之預覽圖與影片顯示修復計畫

本計畫針對首頁 Banner 在 iOS 裝置（iPhone、iPad）上無法正常顯示影片與預覽圖，導致畫面空白、黑屏或無法播放之問題進行修復。

## 1. 問題分析

在 iOS (Safari / Chrome for iOS) 平台上，影片播放與預覽圖顯示常因以下原因受阻：
1. **自動播放 (Autoplay) 限制與低耗電模式**：
   - iOS 預設禁止有聲音的影片自動播放。若要自動播放，影片必須包含 `muted`、`playsinline` 屬性。
   - 當使用者啟用「低耗電模式」時，iOS 會強制停用所有 `autoplay`。如果沒有備用方案，影片會卡在未播放狀態，且原生 `poster` 屬性在某些 Safari 版本中可能會因為加載失敗而顯示為一片空白或帶斜線的播放鈕。
2. **Vue 3 水合作用 (Hydration) 的屬性遺失**：
   - 在 Nuxt/Vue SSR 專案中，直接在模板寫 `muted` 屬性，在客戶端水合（Hydration）時，有時並未真正修改 DOM 節點的 `muted` 屬性值（`video.muted` 仍可能為 `false`），這會導致 iOS 判定該影片非靜音而拒絕播放。
3. **`<source>` 標籤解析相容性問題**：
   - iOS Safari 對於在 `<video>` 內嵌套 `<source>` 的解析較為嚴苛，在 DOM 動態更新時可能不會正確觸發加載。直接在 `<video>` 上設定 `src` 屬性是更穩健的做法。
4. **伺服器 HTTP 206 Range 請求支援問題**：
   - iOS 要求影片資源必須支援 HTTP Range 請求。如果託管伺服器或 CDN 響應不完全，影片加載會中斷。當原生影片加載被阻斷時，原生的 `poster` 預覽圖可能也會一併失效。

---

## 2. 解決方案與優化步驟

我們將對 [MainVisual.vue](file:///Volumes/X9Pro/project/6yuwei_nuxt3/components/MainVisual.vue) 進行以下重構與優化：

### A. 實作自訂預覽圖覆蓋層 (Poster Fallback Overlay)
- 為了確保在任何極端狀況下（如低耗電模式、網路極慢、伺服器不支援 206 等），客戶**絕對不會看到空白畫面**，我們將不依賴瀏覽器不穩定的原生 `poster` 渲染。
- 我們會新增一個 `<img>` 覆蓋在 `<video>` 之上，其路徑同樣為 `/images/main_poster.jpg`。
- 透過 Vue 的 `videoPlaying` 狀態控制此 `<img>` 的顯示。一旦影片成功觸發 `@play` 或 `@playing` 事件，便將 `videoPlaying` 設為 `true`，隱藏覆蓋圖，達成無縫的切換效果。

### B. 優化 `<video>` 標籤屬性與事件
- 將 `src` 屬性直接寫在 `<video>` 標籤上：`<video src="/videos/main.mp4" ...>`，移除內嵌套的 `<source>`。
- 將 `preload` 設為 `"metadata"`（有些 iOS 裝置在 `preload="auto"` 時會因為 Range 請求限制而完全卡死，改為 `metadata` 能順利觸發隨後的播放流）。
- 明確綁定 `:muted="true"`。

### C. 生命週期與播放邏輯強化（包含手動播放同步呼叫）
- 在 `onMounted` 階段，透過 JavaScript 明確將 `video.muted = true` 並且呼叫 `video.setAttribute('muted', '')` 與 `video.setAttribute('playsinline', '')`，以確保 iOS 核心能百分之百識別為靜音且行內播放。
- 監聽影片的 `@play`、`@playing` 與 `@pause` 事件，即時更新播放狀態，控制自訂預覽圖與手動播放按鈕的顯隱。
- **iOS Safari 同步調用限制修復**：iOS Safari 對手動播放有極為嚴苛的安全規定，`video.play()` 必須在點擊事件的同步呼叫棧 (Call Stack) 中被直接執行。若點擊後調用包含 `async/await` 的非同步方法，會被判定為非使用者直接觸發而阻擋。因此我們將手動播放邏輯 `handleManualPlay` 重構為純粹同步方法，直接調用 `video.play()`，保證在低耗電或手動點擊時百分之百能成功播放。

### D. CSS 樣式微調
- 新增 `.videoPosterFallback` 樣式，使其絕對定位填滿父容器，並設定 `pointer-events: none` 確保它不會干擾任何使用者對影片的點擊或操作。
- 確保其 `object-fit`（手機版為 `cover`，桌機版為 `contain`）與 video 的設置完全對齊，避免切換時產生畫面閃爍或抖動。

---

## 3. 預期效果
1. **高成功率的自動播放**：在一般 iOS 模式下，影片會以極高成功率自動順暢播放。
2. **完美的備用預覽圖**：在低耗電模式或影片無法加載時，系統會立即無縫顯示首頁 Banner 預覽圖，並提供清晰的手動播放按鈕，保障客戶體驗，杜絕客戶流失。

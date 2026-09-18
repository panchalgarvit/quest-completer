# ⚡ RAINY Quest Completer

> Automatically complete Discord quests — made by **RAINY**

---

## 📋 What is this?

A collection of scripts that automatically complete Discord quests for you.  
Supports **video quests**, **desktop play quests**, and **mobile video quests**.

---

## 🚀 Scripts

### 1. Desktop App Script (Recommended)
Runs inside the **Discord desktop app** — supports ALL quest types including `PLAY_ON_DESKTOP`.

**How to use:**
1. Open Discord desktop app
2. Enable DevTools by adding this to `%appdata%/discord/settings.json`:
```json
"DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING": true
```
3. Press `Ctrl + Shift + I` to open DevTools
4. Go to **Console** tab
5. Type `allow pasting` → press Enter
6. Paste the script from [`desktop.js`](./desktop.js) and press Enter

---

### 2. Browser Script (Video Quests Only)
Runs in **Discord web** (Edge / Chrome) — only supports `WATCH_VIDEO` quests.

**How to use:**
1. Open [discord.com](https://discord.com) in your browser
2. Press `F12` → **Console** tab
3. Type `allow pasting` → press Enter
4. Paste the script from [`browser.js`](./browser.js) and press Enter

---

### 3. Android Script (Kiwi Browser)
Runs on **Android** using Kiwi Browser — only supports video quests.

**How to use:**
1. Install [Kiwi Browser](https://play.google.com/store/apps/details?id=com.kiwibrowser.browser) from Play Store
2. Open [discord.com](https://discord.com) → tap ⋮ → **Desktop site** ✅
3. Log in to Discord
4. Tap ⋮ → **Developer Tools** → **Console**
5. Paste the script from [`android.js`](./android.js) and press Enter

---

## ❓ How to get your Discord token

> Needed for completing quests on a friend's account

1. Open Discord in your browser
2. Press `F12` → **Network** tab
3. Click any request to `discord.com/api/...`
4. Look at **Request Headers** → copy the `Authorization` value

---

## ⚠️ Disclaimer

- This is for **educational purposes only**
- Using self-bots may violate [Discord's Terms of Service](https://discord.com/terms)
- Use at your own risk
- **RAINY** is not responsible for any account actions taken by Discord

---

## 📊 Quest Support Table

| Quest Type | Browser | Desktop App | Android |
|------------|---------|-------------|---------|
| `WATCH_VIDEO` | ✅ | ✅ | ✅ |
| `WATCH_VIDEO_ON_MOBILE` | ✅ | ✅ | ✅ |
| `PLAY_ON_DESKTOP` | ❌ | ✅ | ❌ |
| `STREAM_ON_DESKTOP` | ❌ | ✅ | ❌ |
| `PLAY_ON_XBOX/PS` | ❌ | ❌ | ❌ |

---

## 📜 Credits

Made by **RAINY** — all rights reserved  
Do not redistribute without credit.

---

<p align="center">
  <b>⚡ RAINY Quest Completer</b><br>
  <sub>made by RAINY · all rights reserved</sub>
</p>

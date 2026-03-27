# 🚀 DownloadEx – Chrome Extension (Vite + React + TSX)

A lightweight Chrome extension that lets you **download images and videos instantly** by simply hovering over them.


<iframe
  src="https://player.cloudinary.com/embed/?cloud_name=davykvetf&public_id=linkedin-video_mfov5n"
  width="640"
  height="360" 
  style="height: auto; width: 100%; aspect-ratio: 640 / 360;"
  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
  allowfullscreen
  frameborder="0"
></iframe>
---

## ✨ Features

- 🖱️ Hover on **images / videos / media links**
- ⬇️ Shows a **download button overlay**
- ⚡ One-click instant download
- 🎯 Smart media detection (IMG, VIDEO, direct links)
- 🧠 Auto filename extraction from URL
- ⚛️ Built with **React + TypeScript + Vite**

---

## 📁 Project Structure

```
hover-downloader/
├── public/
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── content.tsx
│   ├── background.ts
│   └── style.css
├── vite.config.ts
└── package.json
```

---

## ⚙️ Installation & Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Build the extension

```bash
npm run build
```

---

## 🧩 Load Extension in Chrome

1. Open Chrome
2. Go to:
   ```
   chrome://extensions/
   ```
3. Enable **Developer Mode** (top right)
4. Click **Load unpacked**
5. Select the `dist/` folder

---

## 🛠️ How It Works

- Content script injects a React component into every page
- Detects media elements on mouse hover
- Displays a floating download button
- On click:
  - Sends message to background script
  - Background uses Chrome Downloads API

---

## 📥 Download Flow

```
User Hover → Detect Media → Show Button → Click → Send Message → Download File
```

---

## 🔧 Permissions Used

| Permission   | Purpose                          |
|-------------|----------------------------------|
| downloads   | Save files to user system        |
| activeTab   | Access current tab               |
| scripting   | Inject scripts into pages        |

---

## ⚠️ Known Limitations

- ❌ Does not support `blob:` URLs (streaming videos)
- ❌ Some sites block direct downloads
- ❌ Dynamic players (like HLS / DASH) need advanced handling

---

## 🚀 Future Improvements

- 🎥 Support for streaming videos (m3u8 / blob)
- 📦 Bulk download option
- 🧠 Smart filename detection
- 🎨 Better UI (YouTube-style overlay)
- 📊 Download history panel

---

## 🧪 Troubleshooting

### ❌ Icon flickers
- Fixed using `mousemove` instead of `mouseover`

### ❌ Wrong file downloads
- Ensure filename is extracted properly

### ❌ "Cannot find name chrome"
- Install types:
  ```bash
  npm install --save-dev @types/chrome
  ```

### ❌ CSS not loading
- Place CSS in `public/` folder OR import in TSX

---

## 📌 Notes

- Always reload extension after changes
- Use `console.log` inside content script for debugging

---

## 🧑‍💻 Author

RISHI BOSE

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!

# Meet3D: Metaverse for Google Meet

Meet3D transforms traditional Google Meet sessions into immersive, 3D shared spaces with avatars.

This repository contains two parts:
1. **The Assistant App:** A React-based tool (powered by Gemini) to help you design and strategize your 3D classroom.
2. **The Extension Source:** The actual boilerplate code for a Google Meet Add-on (`manifest.json`, `sidepanel.html`, `mainstage.html`).

---

## 🚀 Google Meet Extension Installation Guide (Hebrew/English)

To turn these files into a live Google Meet add-on, follow these steps:

### 1. Host the Files (HTTPS is mandatory)
Google Meet only allows add-ons hosted over secure HTTPS.
- Upload `sidepanel.html` and `mainstage.html` to a service like **GitHub Pages**, **Vercel**, or **Firebase Hosting**.
- **Important:** Ensure the URLs are publicly accessible via HTTPS.

### 2. Configure Google Cloud Console
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project named "Meet3D Metaverse".
3. **Enable the Google Meet API:** Search for "Google Meet API" in the Library and click **Enable**.
4. **Configure OAuth Consent Screen:** Set it up as "Internal" (for your school/org) or "External" (for everyone).

### 3. Register the Add-on
1. In the Google Meet API section, go to the **Add-ons** tab.
2. Click **Create Add-on**.
3. **Manifest Configuration:**
   - Use the content from `manifest.json`.
   - Replace the placeholder URLs with your live HTTPS URLs (e.g., `https://your-domain.com/sidepanel.html`).
4. **Main Stage & Side Panel:**
   - Link the "Side Panel" to your `sidepanel.html` URL.
   - Link the "Main Stage" to your `mainstage.html` URL.

### 4. Test in Google Meet
1. Open a Google Meet session.
2. Click on the **Activities** icon (bottom right).
3. You should see "Meet3D" in the list of available add-ons.
4. Click **Join 3D Classroom** to launch the immersive stage for all participants.

---

## 🇮🇱 מדריך התקנה (עברית)

### 1. אירוח הקבצים (חובה HTTPS)
גוגל מיט מאפשרת תוספים רק דרך שרתים מאובטחים.
- העלו את `sidepanel.html` ו-`mainstage.html` לשירות כמו **GitHub Pages** או **Vercel**.
- וודאו שהכתובות מתחילות ב-`https://`.

### 2. הגדרת Google Cloud Console
1. היכנסו ל-[Google Cloud Console](https://console.cloud.google.com/).
2. צרו פרויקט חדש בשם "Meet3D Metaverse".
3. הפעילו את ה-**Google Meet API** בספריית ה-API.
4. הגדירו את מסך ה-OAuth (OAuth Consent Screen).

### 3. רישום התוסף
1. תחת ה-Google Meet API, עברו ללשונית **Add-ons**.
2. העתיקו את התוכן של `manifest.json` להגדרות התוסף.
3. עדכנו את הכתובות (URLs) לכתובות האמיתיות שבהן אירחתם את הקבצים.

### 4. הפעלה בשיחה
1. פתחו שיחת גוגל מיט.
2. לחצו על אייקון ה**פעילויות** (Activities) בצד ימין למטה.
3. בחרו ב-**Meet3D** והתחילו את החוויה!

---

## Technical Stack
- **AI:** Google Gemini 1.5 Flash (with Google Search Grounding).
- **3D Engine:** Three.js (via CDN).
- **SDK:** Google Meet Add-ons SDK v1.1.0.
- **Frontend:** React + Tailwind CSS.

# Interview Prep — 90 kun

Full-stack interview'ga 90 kunda tayyorlanish uchun sayt: ingliz tilida gapirish va texnik bilim.
Vue 3 + Pinia + Firebase: Google login, Firestore va Hosting. Hammasi bitta Firebase loyihasida.

## Imkoniyatlar

- **Bugun** — sayt qaysi kunda to'xtaganingizni eslab qoladi va bugungi 4 ta vazifani ko'rsatadi. Progress, ketma-ket kunlar (streak) va haftalik ko'rinish ham shu yerda.
- **Reja** — 13 hafta, 90 kun, har bir kunning holati, portfolio checklist va o'z-o'zini baholash (5 soha + ingliz tili).
- **Bilim bazasi** — frontend, backend, database, DevOps, Git/testing/clean code, system design, behavioral va grammatika bo'yicha mavzular. Har bir mavzuda o'zbekcha tushuntirish, lug'at, interview savollari, oddiy inglizchada namuna javoblar (o'zbekcha tarjimasi bilan) va resurslar bor. Kun sahifasida o'sha kunning mavzulari avtomatik chiqadi.
- **Algoritm masalalari** — rejadagi LeetCode masalalari va qo'shimcha Medium'lar. Har birida pattern, maslahat, inglizcha tushuntirish va yechim; "yordamsiz yechildi" hisobi yuritiladi.
- **Mock interview** — tanlangan sohalardan tasodifiy savollar, taymer, namuna javob va o'zini baholash.
- **Iboralar** — 80 ta ibora: ovozli o'qish, shadowing rejimi, flashcards, texnik so'zlar talaffuzi.
- **Gapirish** — ovoz yozish, taymer, jonli transkript, so'z/daqiqa va filler so'zlar ("um", "like") tahlili, audio jurnal.
- **Daftar** — xato daftari, Q&A bank (rejadagi savollar avtomatik taklif qilinadi), audio jurnal.
- **Ma'lumotnoma** — shablonlar (STAR, PSTR, system design), resurslar. Kursiv jumlani bossangiz, ovoz chiqarib o'qib beradi.

Har bir Google akkauntning progressi Firestore'da alohida saqlanadi (`users/{uid}`) va telefon bilan kompyuter o'rtasida real vaqtda sinxronlanadi.

Reja matni [src/content/plan.md](src/content/plan.md) faylida. Uni tahrirlasangiz, sayt o'zgarishni o'zi oladi. Faqat `<!-- day:N week:W -->` va `- [ ] **Sarlavha** (N daq) — matn` formatini saqlang.

## 1. Firebase loyihasi (bir marta, ~10 daqiqa, bepul)

1. <https://console.firebase.google.com> → **Add project** → nom bering (Analytics shart emas).
2. **Build → Authentication → Get started → Sign-in method → Google → Enable** → support email tanlang → Save.
3. **Build → Firestore Database → Create database** → joylashuv (masalan `eur3`) → **production mode**.
4. **Project settings (⚙️) → General → Your apps → Web (`</>`)** → istalgan nom bilan web ilova qo'shing.
   Bu qadam shart: Hosting shu ilova sozlamalarini saytga beradi.

## 2. Deploy (Firebase Hosting)

Birinchi marta (PowerShell yoki VS Code terminalida, loyiha papkasida):

```sh
npm install
npm install -g firebase-tools
firebase login
firebase use --add      # Firebase loyihangizni tanlang, alias: default
npm run deploy
```

`npm run deploy` saytni build qiladi va ikkita narsani yuklaydi:
- saytni Hosting'ga;
- [firestore.rules](firestore.rules) dagi qoidalarni (har kim faqat o'z ma'lumotini ko'radi).

Oxirida sayt manzili chiqadi: `https://<loyiha-id>.web.app`.

Keyingi safar o'zgarish qilsangiz, faqat `npm run deploy` yetarli.

- `.env` kerak emas: Hosting'dagi sayt Firebase sozlamalarini `/__/firebase/init.json` dan o'zi oladi.
- `*.web.app` va `*.firebaseapp.com` domenlari Google login uchun avtomatik ruxsat oladi.
- O'z domeningizni ulasangiz (Hosting → Add custom domain), uni **Authentication → Settings → Authorized domains** ga qo'shing.

Telefonda: saytni oching → brauzer menyusidan **"Add to Home screen"** ni bosing. Sayt ilova kabi ochiladi.

## 3. Lokal ishga tushirish

```sh
npm run dev
```

Bu holatda sayt **lokal rejimda** ishlaydi: login so'ramaydi, progress faqat shu brauzerda saqlanadi.

Lokalda ham Google login bilan ishlatmoqchi bo'lsangiz:
1. `.env.example` ni `.env.local` ga nusxalang.
2. **Project settings → Your apps** dagi SDK config qiymatlarini `.env.local` ga yozing.

`localhost` login uchun avtomatik ruxsat oladi.

## Eslatmalar

- Ovozli o'qish (TTS) va mikrofon Chrome, Edge va Safari'da ishlaydi. Jonli transkript Chrome va Android'da eng yaxshi ishlaydi.
- Audio fayllar serverga yuklanmaydi. Ular faqat shu qurilmada qoladi, "Audioni yuklab olish" orqali saqlab qo'ying. Jurnalga faqat ma'lumotlar yoziladi: vaqt, so'z/daqiqa, eslatma, transkript.
- Windows'da build va deploy'ni PowerShell yoki VS Code terminalidan qiling. Git Bash'da yo'l kichik harfli `d:` bilan boshlansa, Vite Pinia'ni ikki marta bundle qiladi va sayt oq ekran bilan ochiladi.

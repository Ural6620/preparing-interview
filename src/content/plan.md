---
title: "Full-stack interview'ga tayyorgarlik — haftalik aylana reja"
daily_minutes: 120
start_level: A2 (pre-intermediate)
target: "Full-stack (Vue + Java/Spring) dasturchi sifatida o'zbekcha va inglizcha texnik interview'dan o'tish"
version: 4.0
---

# Full-stack interview'ga tayyorgarlik — haftalik aylana reja

> Kunlik reja endi qo'lda yozilmaydi: sayt uni bilim bazasidagi mavzulardan avtomatik tuzadi (`src/lib/curriculum.js`).
> Har hafta 7 soha aylanadi — **1 Frontend · 2 Backend (Java, Spring) · 3 Database · 4 Algoritmlar · 5 DevOps · 6 Jamoa, Git, kod sifati · 7 Arxitektura**.
> Har bir sohada mavzular osondan qiyinga boradi, shuning uchun har yangi hafta oldingisidan bir pog'ona murakkabroq. Mavzulari tugagan soha keyingi aylanaga (takrorlash va chuqurlashtirish) o'tadi.

## Sayt uchun tuzilish

- Bu fayl faqat **kirish**, **iboralar jadvallari** (`## N-hafta — ...` ostida) va **Ma'lumotnoma**ni beradi
- Kunlar, haftalar va vazifalar `src/lib/curriculum.js` da bilim bazasidan (`src/content/knowledge/*.js`) quriladi
- Iboralar jadvallari haftalarga navbat bilan beriladi

## Kunlik 2 soat

| Vaqt | Vazifa |
|---|---|
| 0–40 daq | Mavzu — bugungi sohadan darsni o'qish va o'zbekcha tushunib olish |
| 40–80 daq | Interview savollari — inglizcha + o'zbekcha javoblar, ovoz chiqarib, takrorlash bilan |
| 80–105 daq | Amaliyot — kod / SQL / diagramma / masala |
| 105–120 daq | Inglizcha gapirish — 1 ta behavioral savol + bugungi mavzuni 2 daqiqa tushuntirish |

---

# Iboralar to'plamlari

> Har hafta shu jadvallardan biri navbat bilan beriladi ("🧠 Bugungi yodlash" va "Iboralar" sahifasida).

## 1-hafta — Tanishtirish + CV

#### Haftaning iboralari

| Chunk | O'zbekcha |
|---|---|
| I'm a full-stack developer with... years of experience | ... yillik tajribali full-stack dasturchiman |
| I mainly work with... | Asosan ... bilan ishlayman |
| I've been working on... | ... ustida ishlab kelyapman |
| I'm comfortable with... | ...da bemalol ishlayman |
| I'm currently learning... | Hozir ...ni o'rganyapman |
| I enjoy solving... problems | ... muammolarini hal qilish yoqadi |
| I'm looking for an opportunity to... | ... imkoniyatini qidiryapman |
| That's a quick overview of my background | Bu — tajribamning qisqacha ko'rinishi |

---

## 2-hafta — Loyihani tushuntirish

#### Haftaning iboralari

| Chunk | O'zbekcha |
|---|---|
| The goal of the project was to... | Loyiha maqsadi ... edi |
| It's a web app that allows users to... | Foydalanuvchilarga ...ga imkon beruvchi web ilova |
| I was responsible for... | ...ga javobgar edim |
| We chose... because... | ...ni tanladik, chunki ... |
| The biggest challenge was... | Eng katta qiyinchilik ... edi |
| We solved it by... | ... orqali hal qildik |
| It's used by... users | Uni ... foydalanuvchi ishlatadi |
| If I did it again, I would... | Qaytadan qilsam, ... qilardim |

---

## 3-hafta — Jamoa jarayoni

#### Haftaning iboralari

| Chunk | O'zbekcha |
|---|---|
| We work in two-week sprints | Ikki haftalik sprint'larda ishlaymiz |
| Every morning, we have a standup | Har ertalab standup bo'ladi |
| I open a pull request and ask for a review | PR ochib, review so'rayman |
| I resolved a merge conflict | Merge conflict'ni hal qildim |
| We write unit tests for... | ... uchun unit test yozamiz |
| We deploy to staging first | Avval staging'ga deploy qilamiz |
| I'm blocked by... | ... sababli to'xtab qoldim |
| I keep the team updated on... | Jamoani ... bo'yicha xabardor qilaman |

---

## 4-hafta — Kodni tushuntirish

#### Haftaning iboralari

| Chunk | O'zbekcha |
|---|---|
| This function takes... and returns... | Bu funksiya ... oladi va ... qaytaradi |
| Here, we loop through... | Bu yerda ... bo'ylab aylanamiz |
| If the value is null, we... | Qiymat null bo'lsa, ... |
| This is where the bug was | Bug shu yerda edi |
| I added a check for... | ... uchun tekshiruv qo'shdim |
| It throws an error when... | ... bo'lganda error tashlaydi |
| Let me walk you through the code | Kodni bosqichma-bosqich ko'rsatay |
| I refactored this part to... | Bu qismni ... uchun refactor qildim |

---

## 5-hafta — Frontend

#### Haftaning iboralari

| Chunk | O'zbekcha |
|---|---|
| A component is a reusable piece of UI | Component — qayta ishlatiladigan UI bo'lagi |
| When the state changes, the UI re-renders | State o'zgarsa, UI qayta render bo'ladi |
| We pass data down through props | Ma'lumotni props orqali uzatamiz |
| It's rendered on the server, which helps SEO | Serverda render qilinadi, bu SEO'ga yordam beradi |
| We load it only when it's needed | Faqat kerak bo'lganda yuklaymiz |
| The main difference between X and Y is... | X va Y ning asosiy farqi ... |
| A closure remembers its outer scope | Closure tashqi scope'ni eslab qoladi |
| It depends on the use case | Qaysi holatga bog'liq |

---

## 6-hafta — Backend va API

#### Haftaning iboralari

| Chunk | O'zbekcha |
|---|---|
| The client sends a request, and the server sends back a response | Client so'rov yuboradi, server javob qaytaradi |
| We use GET to read and POST to create | O'qishga GET, yaratishga POST |
| A 401 means unauthorized, a 403 means forbidden | 401 — autentifikatsiya yo'q, 403 — ruxsat yo'q |
| Authentication is who you are, authorization is what you can do | Authentication — kimligingiz, authorization — nima qila olishingiz |
| We hash passwords with BCrypt | Parollarni BCrypt bilan hash qilamiz |
| Spring injects the dependency through the constructor | Spring dependency'ni constructor orqali beradi |
| The filter runs before the request reaches the controller | Filter so'rov controller'ga yetguncha ishlaydi |
| It's stateless | U stateless |
| We validate the input on the server side | Input'ni server tomonda tekshiramiz |

---

## 7-hafta — Database

#### Haftaning iboralari

| Chunk | O'zbekcha |
|---|---|
| SQL databases have a fixed schema | SQL bazalarda qat'iy schema bor |
| An index makes reads faster but writes slower | Index o'qishni tezlashtiradi, yozishni sekinlashtiradi |
| A transaction is all or nothing | Transaction — yo hammasi, yo hech narsa |
| We join the two tables on... | Ikki jadvalni ... bo'yicha join qilamiz |
| The ORM was sending too many queries | ORM juda ko'p query yuborayotgan edi |
| I'd choose... for this case because... | Bu holatda ...ni tanlardim, chunki ... |
| We normalized the tables to avoid duplication | Takrorlanishni oldini olish uchun jadvallarni normallashtirdik |
| It doesn't scale well when... | ... bo'lganda yaxshi scale bo'lmaydi |

---

## 8-hafta — DevOps va xavfsizlik

#### Haftaning iboralari

| Chunk | O'zbekcha |
|---|---|
| A container packages the app with everything it needs | Container ilovani kerakli hamma narsasi bilan o'raydi |
| It works the same on every machine | Har qanday mashinada bir xil ishlaydi |
| Every push triggers the pipeline | Har bir push pipeline'ni ishga tushiradi |
| The tests run automatically | Testlar avtomatik ishlaydi |
| We use nginx as a reverse proxy | nginx'ni reverse proxy sifatida ishlatamiz |
| We roll back if something goes wrong | Nimadir buzilsa, rollback qilamiz |
| Secrets are stored in environment variables | Maxfiy ma'lumotlar environment variable'larda saqlanadi |
| We sanitize the input to prevent injection | Injection'ning oldini olish uchun input'ni tozalaymiz |

---

## 9-hafta — System design

#### Haftaning iboralari

| Chunk | O'zbekcha |
|---|---|
| Can I clarify the requirements first? | Avval talablarni aniqlashtirsam bo'ladimi? |
| How many users do we expect? | Qancha foydalanuvchi kutilmoqda? |
| At a high level, ... | Umumiy ko'rinishda, ... |
| The bottleneck here would be... | Bottleneck ... bo'lardi |
| To reduce latency, we could... | Latency'ni kamaytirish uchun ... mumkin |
| We could put a cache in front of the database | DB oldiga cache qo'yishimiz mumkin |
| We'd use a queue to process it asynchronously | Asinxron qayta ishlash uchun queue ishlatardik |
| The trade-off is... | Trade-off shundaki, ... |

---

## 10-hafta — Behavioral + algoritm

#### Tayyorlanadigan savollar

| Savol | Hikoya manbai |
|---|---|
| Tell me about a challenging project | Portfolio yoki ish loyihasi |
| Tell me about a mistake you made | Real xato va saboq |
| How do you handle tight deadlines? | Deadline hikoyasi |
| Tell me about a disagreement with a teammate | Kelishmovchilik va yechim |
| How do you learn new technologies? | Portfolio loyiha jarayoni |
| Tell me about a time you helped a teammate | Yordam hikoyasi |
| What's your biggest weakness? | Halol + ustida ishlayotganing |
| Why do you want to work here? | Kompaniyaga moslab |

---

## 11-hafta — Live coding

#### Haftaning iboralari

| Chunk | O'zbekcha |
|---|---|
| Let me make sure I understand the problem | Masalani to'g'ri tushunganimni tekshiray |
| What should happen if the input is empty? | Input bo'sh bo'lsa nima bo'ladi? |
| My first idea is a brute-force approach | Birinchi g'oyam — brute-force |
| This would be O(n²), so let me optimize it | Bu O(n²), optimallashtiray |
| I'll use a hash map to store... | ...ni saqlash uchun hash map ishlataman |
| Let me test it with an example | Misol bilan tekshiray |
| I think there's an edge case here | Bu yerda edge case bor |
| Can I think out loud? | Ovoz chiqarib o'ylasam bo'ladimi? |

---

# Ma'lumotnoma

## Maqsad va realistik baho

Interview'dan o'tish = **texnik bilim** + **uni inglizcha tushuntira olish**. Ikkalasi ham kerak.

| Bosqich | English | Texnik |
|---|---|---|
| Asoslar (1–5-haftalar) | Har bir sohaning asosiy tushunchalarini o'zbekcha va inglizcha tushuntirasan | HTTP, JS, Java asoslari, SQL, Docker, Git, Easy masalalar |
| O'rta daraja (6–14-haftalar) | Interview savollariga namunasiz javob berasan | Spring Boot, JPA, auth, index/transaction, CI/CD, Medium masalalar |
| Chuqurlashtirish va yakun (15-hafta →) | Mock interview'dan o'tasan | Security, testing, concurrency, system design, live coding |

**Halol baho:** A2 dan boshlab 180 soatda English taxminan B1 ga chiqadi, texnik mavzularda esa undan ham yaxshiroq bo'ladi, chunki iboralar tayyor. Mahalliy kompaniyalar va texnik qismi inglizcha bo'lgan interview'lar uchun bu yetarli. Reja taxminan 5–6 oy davom etadi; tez o'tsangiz ham, sekin o'tsangiz ham sayt qayerda to'xtaganingizni eslab qoladi.

---

## Texnik talaffuz

| So'z | Qanday o'qiladi | Odatiy xato |
|---|---|---|
| cache | /kæʃ/ — "kesh" | "kache" |
| queue | /kjuː/ — "kyu" | "kueue" |
| query | /ˈkwɪəri/ — "kviəri" | "kveri" |
| data | /ˈdeɪtə/ — "deyta" | "data" |
| schema | /ˈskiːmə/ — "skima" | "shema" |
| async | /ˈeɪsɪŋk/ — "eysink" | "asink" |
| null | /nʌl/ — "nal" | "nul" |
| enum | /ˈiːnʌm/ — "inam" | "enum" |
| JSON | "jeyson" | "json" |
| YAML | "yeməl" | "yaml" |
| SQL | "es-kyu-el" yoki "sikvəl" | — |
| PostgreSQL | "post-gres-kyu-el" | "postgre-sql" |
| nginx | "engine-ex" | "ngiks" |
| Linux | /ˈlɪnəks/ — "linəks" | "laynuks" |
| Vue | "vyu" | "vue" |
| Kubernetes | "kubər-neti:z" | harfma-harf |
| width / height | /wɪdθ/ /haɪt/ | "vidt", "heyt" |
| middleware | "mid-l-weər" | "middlevare" |
| deploy | /dɪˈplɔɪ/ — urg'u 2-bo'g'inda | "DEploy" |
| developer | /dɪˈveləpər/ — urg'u "VE" da | "DEveloper" |
| architecture | /ˈɑːkɪtektʃər/ | "arxitektura" |
| algorithm | /ˈælɡərɪðəm/ — "elgəridhəm" | "algoritm" |
| recursion | /rɪˈkɜːʃən/ | "rekursiya" |
| O(n²) | "O of n squared" | "O n ikki" |

---

## Universal shablonlar

#### "Tell me about yourself" (60–90 soniya)

1. *I'm a full-stack developer with [X] years of experience. Currently, I work at [company], where I build...*
2. *On the frontend, I mainly use... On the backend, I work with...*
3. *One project I'm proud of is... It helped [result].*
4. *Now I'm looking for a role where I can...*

#### Loyihani tushuntirish (PSTR)

**Problem** → *The problem was that...* · **Solution** → *So we built...* · **Tech** → *We used [X] because...* · **Result** → *As a result, ...*

#### Behavioral (STAR)

**Situation** → *At my previous job, ...* · **Task** → *My task was to...* · **Action** → *So I decided to...* · **Result** → *In the end, ... I learned that...*

#### System design (5 qadam)

1. *Can I clarify the requirements first? How many users...?*
2. *At a high level, we'll have a client, an API layer, and a database.*
3. *For the data model, I'd store...*
4. *To scale it, we could add caching / a load balancer / a queue.*
5. *The trade-off here is...*

#### Live coding (5 qadam)

1. *Let me make sure I understand the problem.* → misolni qayta ayt
2. *What should happen if the input is empty?* → edge case so'ra
3. *My first idea is brute force, which is O(n²).*
4. *I can optimize it with a hash map / two pointers...*
5. *Let me test it with an example.*

#### Bilmasang

- *I haven't worked with that directly, but I know that...*
- *I'm not 100% sure, but I think it works like this...*
- *That's a good question. Let me think for a second.*

---

## Portfolio loyiha (5–8 haftalarda quriladi)

Interview'da gapirish uchun **yangi, toza, deploy qilingan** loyiha. Tavsiya: **Task manager / mini Trello**.

| Qism | Talab |
|---|---|
| Frontend | Vue yoki React + TypeScript, routing, state management, form validation |
| Backend | Java 21 + Spring Boot 3: REST API (Controller → Service → Repository), Spring Security + JWT, Bean Validation, `@RestControllerAdvice` |
| Database | PostgreSQL + Spring Data JPA, 3+ jadval (users, boards, tasks), Flyway migration'lar, index |
| DevOps | Docker (multi-stage Maven build) + docker-compose, GitHub Actions (`mvnw verify` + frontend lint/test), deploy (VPS yoki bepul hosting) |
| Sifat | JUnit 5 + Mockito, `@WebMvcTest`/MockMvc, Testcontainers (ixtiyoriy), frontend'da Vitest; inglizcha README (arxitektura diagrammasi bilan) |

Bu loyiha 2-haftadagi PSTR hikoyangga, 9-haftadagi system design'ga va 10-haftadagi behavioral javoblarga material bo'ladi.

---

## Resurslar

**English input:** Fireship (0.75x), Web Dev Simplified, ByteByteGo, Hussein Nasser, Amigoscode, Java Brains, Spring I/O konferensiya talk'lari

**Algoritmlar:** LeetCode, NeetCode (Blind 75 / NeetCode 150 ro'yxatlari, video yechimlar bilan)

**Nazariya:** MDN (frontend, HTTP), javascript.info, dev.java (Java Core), Spring Guides (spring.io/guides), Spring Boot reference docs, Baeldung, PostgreSQL docs, Docker docs, OWASP Top 10

**System design:** ByteByteGo, "System Design Primer" (GitHub)

**Mock:** Claude ilovasidagi voice mode — *"Act as a senior full-stack interviewer. Ask one question at a time. After each answer, give feedback on my technical answer and correct my English."*

**Jonli:** ingliz tilidagi Discord dev community'lar, HelloTalk, tutor (italki / Preply — "tech interview prep")

---

## Q&A bank shabloni

```md
#### What is the event loop?
- **Short answer:** JavaScript is single-threaded. The event loop takes tasks from the queue and runs them when the call stack is empty.
- **Example:** setTimeout callback runs after synchronous code, even with 0 ms.
- **Follow-up:** microtasks (promises) run before macrotasks (setTimeout).
- **Status:** ✅ / 🔁 takrorlash kerak
```

---

## Xato daftari

| Sana | Men aytdim | To'g'risi | Turi |
|---|---|---|---|
| 05.12 | /kætʃ/ | /kæʃ/ — cache | talaffuz |
| 06.12 | I am work with Vue | I work with Vue | grammatika |
| 07.12 | Index makes everything faster | Index speeds up reads but slows down writes | texnik aniqlik |

**Turlari:** grammatika · talaffuz · texnik aniqlik · jim qolish · tarjima

---

## Progress tracker

Har kungi va har haftalik progress saytning **Reja** sahifasida avtomatik ko'rinadi: qaysi soha, qaysi mavzu, qancha vazifa bajarilgan.

#### Portfolio loyiha

Har kungi **Amaliyot** vazifalari shu loyihani bosqichma-bosqich quradi: Vue frontend + Spring Boot backend + PostgreSQL + Docker + CI/CD.

#### Algoritm hisobi

| Haftalar | Yechilgan | Yordamsiz yechilgan | Qiyin pattern |
|---|---|---|---|
| 1–6 | | | |
| 7–12 | | | |
| 13–18 | | | |
| 19 → | | | |

#### Audio jurnali

| Kun | Mavzu | Davomiyligi | Jim qolishlar | Eslatma |
|---|---|---|---|---|
| 1 | Tell me about yourself | 1.5 daq | | |
| 28 | Intro + loyiha + 1 ta texnik mavzu | 5 daq | | |
| 56 | 3 soha bo'yicha tushuntirish | 8 daq | | |
| 84 | Tell me about yourself + loyiha | 4 daq | | |

---

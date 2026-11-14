export default {
  id: 'backend',
  title: 'Backend va API',
  icon: '⚙️',
  intro: "HTTP, REST API dizayni, auth (JWT, session), middleware, xatolar bilan ishlash va Node.js asoslari. Full-stack intervyularda backend savollari deyarli har doim so'raladi: API'ni qanday loyihalashingiz va xavfsiz qilishingiz tekshiriladi.",
  topics: [
    // ─────────────────────────────────────────────
    {
      id: 'be-http-basics',
      title: "Client–server va HTTP so'rov/javob",
      days: [36],
      summary: "Web client–server modelida ishlaydi: client (brauzer, mobil ilova) request yuboradi, server uni qayta ishlab response qaytaradi. HTTP — shu almashinuv uchun protokol. Request'da method, URL, header'lar va ixtiyoriy body bo'ladi; response'da status code, header'lar va body bo'ladi. HTTP stateless — server oldingi request'larni o'zi eslab qolmaydi, shuning uchun har bir request kerakli ma'lumotni (masalan, token yoki cookie) o'zi olib keladi. HTTPS — bu TLS bilan shifrlangan HTTP.",
      keyPoints: [
        "Client request yuboradi, server response qaytaradi",
        "Request: method + URL + headers + (body)",
        "Response: status code + headers + (body)",
        "Header'lar — metadata: Content-Type, Authorization, Cache-Control, Set-Cookie",
        "HTTP stateless — holatni cookie, session yoki token orqali saqlaymiz",
        "HTTPS = HTTP + TLS: ma'lumot shifrlanadi, server sertifikat bilan tasdiqlanadi",
      ],
      vocab: [
        { en: 'request', uz: "so'rov" },
        { en: 'response', uz: 'javob' },
        { en: 'header', uz: "sarlavha (so'rov metadata'si)" },
        { en: 'body', uz: "so'rov/javob tanasi (asosiy ma'lumot)" },
        { en: 'stateless', uz: 'holatni saqlamaydigan' },
        { en: 'encrypted', uz: 'shifrlangan' },
        { en: 'handshake', uz: "ulanishdan oldingi 'salomlashish' bosqichi" },
      ],
      questions: [
        {
          q: 'What is the client–server model?',
          a: "In the client–server model, the client sends a request and the server sends back a response. The client is usually a browser or a mobile app. The server stores the data and runs the business logic. They talk to each other over HTTP.",
          uz: "Client–server modelida client request yuboradi, server esa response qaytaradi. Client odatda brauzer yoki mobil ilova bo'ladi. Server ma'lumotlarni saqlaydi va biznes logikani bajaradi. Ular bir-biri bilan HTTP orqali gaplashadi.",
          followUp: 'What is the difference between a web server and an application server?',
          level: 'junior',
        },
        {
          q: 'What does an HTTP request and an HTTP response contain?',
          a: "A request has a method, a URL, headers, and sometimes a body. For example, a POST request has a JSON body. A response has a status code, headers, and usually a body. The status code tells the client if the request was successful.",
          uz: "Request'da method, URL, header'lar va ba'zan body bo'ladi. Masalan, POST request'da JSON body bo'ladi. Response'da status code, header'lar va odatda body bo'ladi. Status code client'ga request muvaffaqiyatli bo'lgan-bo'lmaganini aytadi.",
          example: "POST /api/tasks HTTP/1.1\nHost: example.com\nContent-Type: application/json\nAuthorization: Bearer <token>\n\n{\"title\": \"Buy milk\"}\n\nHTTP/1.1 201 Created\nContent-Type: application/json\n\n{\"id\": 1, \"title\": \"Buy milk\"}",
          level: 'junior',
        },
        {
          q: 'What happens when you type a URL in the browser and press Enter?',
          a: "First, the browser finds the IP address of the domain with DNS. Then it opens a TCP connection, and for HTTPS it also does a TLS handshake. After that, it sends an HTTP request, and the server sends back a response. Finally, the browser parses the HTML, loads CSS and JavaScript, and renders the page.",
          uz: "Avval brauzer DNS orqali domenning IP manzilini topadi. Keyin TCP ulanish ochadi, HTTPS bo'lsa TLS handshake ham qiladi. Shundan keyin HTTP request yuboradi, server esa response qaytaradi. Oxirida brauzer HTML'ni parse qiladi, CSS va JavaScript'ni yuklaydi va sahifani render qiladi.",
          followUp: 'What is DNS caching?',
          level: 'junior',
        },
        {
          q: 'What are HTTP headers? Can you give some examples?',
          a: "Headers are extra information about the request or the response. Content-Type says the format of the body, for example JSON. Authorization carries the token of the user. Cache-Control tells the browser how long it can cache the response. Set-Cookie sends a cookie from the server to the browser.",
          uz: "Header'lar — request yoki response haqidagi qo'shimcha ma'lumot. Content-Type body formatini aytadi, masalan JSON. Authorization foydalanuvchi token'ini olib boradi. Cache-Control brauzerga response'ni qancha vaqt cache qilish mumkinligini aytadi. Set-Cookie serverdan brauzerga cookie yuboradi.",
          example: "Content-Type: application/json\nAuthorization: Bearer eyJhbGci...\nCache-Control: max-age=3600\nSet-Cookie: sid=abc123; HttpOnly; Secure",
          level: 'junior',
        },
        {
          q: 'What does it mean that HTTP is stateless?',
          a: "It means the server does not remember previous requests. Every request is independent and must carry all the needed information. To keep a user logged in, we send a cookie or a token with each request. Stateless servers are also easier to scale.",
          uz: "Bu server oldingi request'larni eslab qolmaydi degani. Har bir request mustaqil va kerakli barcha ma'lumotni o'zi olib kelishi kerak. Foydalanuvchini login holatida ushlab turish uchun har request bilan cookie yoki token yuboramiz. Stateless server'larni scale qilish ham osonroq.",
          followUp: 'Then how do sessions work?',
          level: 'junior',
        },
        {
          q: 'What is the difference between HTTP and HTTPS?',
          a: "HTTPS is HTTP over TLS. With HTTPS, the data between the client and the server is encrypted. Also, the server proves its identity with a certificate. So nobody in the middle can read or change the data, like passwords or tokens.",
          uz: "HTTPS — bu TLS ustidagi HTTP. HTTPS'da client va server orasidagi ma'lumot shifrlanadi. Bundan tashqari, server o'z kimligini sertifikat bilan isbotlaydi. Shuning uchun o'rtadagi hech kim parol yoki token kabi ma'lumotni o'qiy yoki o'zgartira olmaydi.",
          level: 'junior',
        },
        {
          q: 'What is CORS and why do we see CORS errors?',
          a: "CORS is a browser security rule for requests to another origin. An origin is the protocol, domain, and port together. By default, the browser blocks the frontend from reading a response from another origin. The server must allow it with headers like Access-Control-Allow-Origin.",
          uz: "CORS — boshqa origin'ga yuboriladigan request'lar uchun brauzer xavfsizlik qoidasi. Origin — protokol, domen va port birgalikda. Default holatda brauzer frontend'ga boshqa origin'dan kelgan response'ni o'qishga ruxsat bermaydi. Server buni Access-Control-Allow-Origin kabi header'lar bilan ruxsat berishi kerak.",
          example: "// Express\nconst cors = require('cors')\napp.use(cors({ origin: 'https://my-frontend.com' }))",
          followUp: 'What is a preflight request?',
          level: 'middle',
        },
      ],
      resources: [
        { title: 'MDN — An overview of HTTP', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview' },
        { title: 'MDN — HTTP headers', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers' },
        { title: 'MDN — CORS', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'be-http-methods-status',
      title: 'HTTP methods, status codes, idempotency',
      days: [36, 42],
      summary: "HTTP method server'ga nima qilishni aytadi: GET o'qiydi, POST yaratadi, PUT to'liq almashtiradi, PATCH qisman o'zgartiradi, DELETE o'chiradi. Status code natijani aytadi: 2xx — muvaffaqiyat, 3xx — redirect, 4xx — client xatosi, 5xx — server xatosi. Eng ko'p so'raladigani — 401 va 403 farqi: 401 — siz kimligingiz noma'lum (login qilinmagan), 403 — kimligingiz ma'lum, lekin ruxsat yo'q. Idempotent method'ni bir necha marta chaqirsangiz ham natija (server holati) bir xil bo'ladi: GET, PUT, DELETE idempotent, POST esa yo'q.",
      keyPoints: [
        "GET — o'qish, POST — yaratish, PUT — to'liq almashtirish, PATCH — qisman o'zgartirish, DELETE — o'chirish",
        "200 OK, 201 Created, 204 No Content",
        "400 Bad Request, 401 Unauthorized (login yo'q), 403 Forbidden (ruxsat yo'q), 404 Not Found",
        "409 Conflict — holat bilan to'qnashuv (masalan, email band), 422 — ma'lumot formati to'g'ri, lekin validation'dan o'tmadi",
        "500 Internal Server Error — server'dagi kutilmagan xato",
        "Idempotent: GET, PUT, DELETE (HEAD, OPTIONS ham). POST idempotent emas",
        "Safe method (GET, HEAD) — server holatini o'zgartirmaydi",
      ],
      vocab: [
        { en: 'idempotent', uz: "bir necha marta bajarilsa ham natija o'zgarmaydigan" },
        { en: 'status code', uz: 'holat kodi' },
        { en: 'unauthorized', uz: "autentifikatsiyadan o'tmagan" },
        { en: 'forbidden', uz: "taqiqlangan, ruxsat yo'q" },
        { en: 'conflict', uz: "to'qnashuv" },
        { en: 'retry', uz: 'qayta urinish' },
        { en: 'replace', uz: 'almashtirish' },
      ],
      questions: [
        {
          q: 'What is the difference between 401 and 403?',
          a: "A 401 means unauthorized: the server does not know who you are. For example, the token is missing or expired. A 403 means forbidden: the server knows who you are, but you do not have permission. For example, a normal user tries to open an admin page.",
          uz: "401 — unauthorized: server sizning kimligingizni bilmaydi. Masalan, token yo'q yoki muddati o'tgan. 403 — forbidden: server kimligingizni biladi, lekin sizda ruxsat yo'q. Masalan, oddiy foydalanuvchi admin sahifasini ochmoqchi bo'ladi.",
          followUp: "Which one would you return if a user tries to edit another user's task?",
          level: 'junior',
        },
        {
          q: 'Which HTTP methods do you know and when do you use them?',
          a: "We use GET to read data and POST to create new data. PUT replaces the whole resource, and PATCH updates only some fields. DELETE removes a resource. There are also HEAD and OPTIONS, for example OPTIONS is used in CORS preflight.",
          uz: "Ma'lumot o'qish uchun GET, yangi ma'lumot yaratish uchun POST ishlatamiz. PUT butun resursni almashtiradi, PATCH esa faqat ba'zi maydonlarni yangilaydi. DELETE resursni o'chiradi. HEAD va OPTIONS ham bor, masalan OPTIONS CORS preflight'da ishlatiladi.",
          level: 'junior',
        },
        {
          q: 'What is the difference between PUT and PATCH?',
          a: "The main difference is that PUT replaces the whole resource, and PATCH changes only the fields you send. With PUT, the client sends the full object. If a field is missing, it can be removed or set to default. PUT is idempotent, but PATCH is not always idempotent.",
          uz: "Asosiy farq: PUT butun resursni almashtiradi, PATCH esa faqat siz yuborgan maydonlarni o'zgartiradi. PUT'da client to'liq obyektni yuboradi. Agar biror maydon yo'q bo'lsa, u o'chirilishi yoki default qiymatga qaytishi mumkin. PUT idempotent, PATCH esa har doim ham idempotent emas.",
          example: "PUT   /tasks/7  { \"title\": \"New\", \"done\": true, \"priority\": \"high\" }\nPATCH /tasks/7  { \"done\": true }",
          level: 'junior',
        },
        {
          q: 'What does idempotent mean? Which methods are idempotent?',
          a: "Idempotent means that if you send the same request many times, the result on the server is the same as sending it once. GET, PUT, and DELETE are idempotent. POST is not idempotent, because each call can create a new record. This is important for safe retries when the network fails.",
          uz: "Idempotent — bir xil request'ni ko'p marta yuborsangiz ham server'dagi natija bir marta yuborgandek bo'ladi. GET, PUT va DELETE idempotent. POST idempotent emas, chunki har bir chaqiruv yangi yozuv yaratishi mumkin. Bu tarmoq xato berganda xavfsiz qayta urinish (retry) uchun muhim.",
          example: "DELETE /tasks/7  → 204 (task deleted)\nDELETE /tasks/7  → 404 (already gone, but the state is the same)",
          followUp: 'How can you make a POST request safe to retry?',
          level: 'junior',
        },
        {
          q: 'Which status codes do you use most often?',
          a: "For success I use 200 OK, 201 Created after POST, and 204 No Content after DELETE. For client errors I use 400 for bad input, 401 and 403 for auth, and 404 when the resource does not exist. I use 409 for a conflict, like a duplicate email. I use 500 when something unexpected breaks on the server.",
          uz: "Muvaffaqiyat uchun 200 OK, POST'dan keyin 201 Created va DELETE'dan keyin 204 No Content ishlataman. Client xatolari uchun noto'g'ri input'ga 400, auth uchun 401 va 403, resurs mavjud bo'lmasa 404 ishlataman. To'qnashuv uchun, masalan email takrorlanganda, 409 ishlataman. Server'da kutilmagan narsa buzilsa 500 ishlataman.",
          level: 'junior',
        },
        {
          q: 'When do you return 409 and when do you return 422?',
          a: "I return 409 Conflict when the request is valid, but it conflicts with the current state. For example, a user registers with an email that already exists. I return 422 when the JSON is correct, but the data fails validation. For example, the email has a wrong format. Many teams use 400 for validation errors too. It depends on the team convention.",
          uz: "409 Conflict'ni request to'g'ri, lekin hozirgi holat bilan to'qnashganda qaytaraman. Masalan, foydalanuvchi allaqachon mavjud email bilan ro'yxatdan o'tmoqchi. 422'ni JSON to'g'ri, lekin ma'lumot validation'dan o'tmaganda qaytaraman. Masalan, email formati noto'g'ri. Ko'p jamoalar validation xatolari uchun 400 ham ishlatadi. Bu jamoa kelishuviga bog'liq.",
          level: 'middle',
        },
        {
          q: 'How can you make a POST request safe to retry?',
          a: "We can use an idempotency key. The client sends a unique key in a header with the request. The server saves the key and the result. If the same key comes again, the server returns the saved result and does not create a second record. Payment APIs often use this.",
          uz: "Idempotency key ishlatsa bo'ladi. Client request bilan birga header'da unikal kalit yuboradi. Server kalitni va natijani saqlaydi. Agar xuddi shu kalit yana kelsa, server saqlangan natijani qaytaradi va ikkinchi yozuv yaratmaydi. To'lov API'lari buni ko'p ishlatadi.",
          example: "POST /payments\nIdempotency-Key: 8f14e45f-ceea-4e7a-9a1b-2c3d4e5f6a7b",
          level: 'middle',
        },
        {
          q: 'What is the difference between GET and POST?',
          a: "GET reads data and does not change anything on the server. Its parameters go in the URL, so it can be cached and bookmarked. POST sends data in the body and usually creates something. POST is not idempotent, so the browser asks before sending it again.",
          uz: "GET ma'lumot o'qiydi va server'da hech narsani o'zgartirmaydi. Uning parametrlari URL'da bo'ladi, shuning uchun uni cache qilish va bookmark qilish mumkin. POST ma'lumotni body'da yuboradi va odatda biror narsa yaratadi. POST idempotent emas, shuning uchun brauzer uni qayta yuborishdan oldin so'raydi.",
          level: 'junior',
        },
      ],
      resources: [
        { title: 'MDN — HTTP request methods', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods' },
        { title: 'MDN — HTTP response status codes', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status' },
        { title: 'MDN — Idempotent', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Idempotent' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'be-rest-design',
      title: 'REST API dizayni (va GraphQL)',
      days: [37, 38, 41, 42],
      summary: "REST — API'ni resurslar atrofida qurish uslubi. Har bir resursning URL'i bor (/tasks, /tasks/7), amalni esa HTTP method belgilaydi. URL'da otlar (noun) va ko'plik ishlatiladi, fe'l (verb) emas: POST /tasks, /createTask emas. Ko'p ma'lumot qaytadigan endpoint'larda pagination (limit/offset yoki cursor), filtering va sorting query parametrlar orqali qilinadi. API o'zgarganda eski client'lar buzilmasligi uchun versioning ishlatiladi (/api/v1). GraphQL — alternativa: bitta endpoint, client o'ziga kerakli maydonlarni o'zi so'raydi.",
      keyPoints: [
        "Resurs nomi — ko'plikdagi ot: /users, /boards, /tasks",
        "Ichma-ich resurs: GET /boards/3/tasks",
        "Pagination: ?page=2&limit=20 (offset) yoki ?cursor=abc (cursor-based)",
        "Filtering va sorting: ?status=done&sort=-createdAt",
        "Versioning: /api/v1/... yoki header orqali",
        "REST stateless — har request mustaqil",
        "GraphQL: bitta endpoint, client kerakli maydonlarni tanlaydi; over-fetching yo'q, lekin cache va murakkablik qiyinroq",
      ],
      vocab: [
        { en: 'resource', uz: 'resurs (API boshqaradigan obyekt)' },
        { en: 'endpoint', uz: 'API manzili (method + URL)' },
        { en: 'pagination', uz: "sahifalarga bo'lish" },
        { en: 'query parameter', uz: "URL'dagi ?key=value parametr" },
        { en: 'versioning', uz: 'versiyalash' },
        { en: 'over-fetching', uz: "keragidan ko'p ma'lumot olish" },
        { en: 'backward compatible', uz: 'eski versiya bilan mos' },
      ],
      questions: [
        {
          q: 'What is REST?',
          a: "REST is an architectural style for building APIs. Everything is a resource with its own URL, like /tasks or /tasks/7. We use HTTP methods to work with resources: GET to read, POST to create, and so on. REST is stateless, so each request has all the information it needs.",
          uz: "REST — API qurish uchun arxitektura uslubi. Hamma narsa o'z URL'iga ega resurs, masalan /tasks yoki /tasks/7. Resurslar bilan ishlash uchun HTTP method'lardan foydalanamiz: o'qish uchun GET, yaratish uchun POST va hokazo. REST stateless, shuning uchun har bir request kerakli barcha ma'lumotga ega.",
          followUp: 'What makes an API RESTful?',
          level: 'junior',
        },
        {
          q: 'How do you name REST endpoints?',
          a: "I use nouns, not verbs, and I use plural names. The HTTP method shows the action. For nested data I use paths like /boards/3/tasks. I keep URLs lowercase and use kebab-case for long names.",
          uz: "Fe'l emas, ot ishlataman va ko'plik shaklida yozaman. Amalni HTTP method ko'rsatadi. Ichma-ich ma'lumot uchun /boards/3/tasks kabi yo'l ishlataman. URL'larni kichik harfda yozaman va uzun nomlar uchun kebab-case ishlataman.",
          example: "GET    /boards/3/tasks   – list tasks of board 3\nPOST   /boards/3/tasks   – create a task\nGET    /tasks/7          – get one task\nPATCH  /tasks/7          – update a task\nDELETE /tasks/7          – delete a task\n\nBad: POST /createTask, GET /getAllTasks",
          level: 'junior',
        },
        {
          q: 'How do you implement pagination in an API?',
          a: "The simple way is offset pagination with page and limit, like ?page=2&limit=20. It is easy, but it gets slow on big tables and can skip rows when data changes. For large or live data I use cursor pagination. The client sends the last seen id, and the server returns the next items after it.",
          uz: "Oddiy usul — page va limit bilan offset pagination, masalan ?page=2&limit=20. Bu oson, lekin katta jadvallarda sekinlashadi va ma'lumot o'zgarganda qatorlarni o'tkazib yuborishi mumkin. Katta yoki tez o'zgaradigan ma'lumot uchun cursor pagination ishlataman. Client oxirgi ko'rgan id'ni yuboradi, server esa undan keyingi elementlarni qaytaradi.",
          example: "GET /tasks?page=2&limit=20\n→ SELECT * FROM tasks ORDER BY id LIMIT 20 OFFSET 20;\n\nGET /tasks?after=140&limit=20\n→ SELECT * FROM tasks WHERE id > 140 ORDER BY id LIMIT 20;",
          followUp: 'Why is OFFSET slow on large tables?',
          level: 'middle',
        },
        {
          q: 'How do you add filtering and sorting to an endpoint?',
          a: "I use query parameters. For example, ?status=done filters tasks by status. For sorting I use ?sort=createdAt, and a minus sign for descending order. On the server, I validate these values and allow only known fields, so users cannot inject SQL.",
          uz: "Query parametrlar ishlataman. Masalan, ?status=done task'larni status bo'yicha filtrlaydi. Sorting uchun ?sort=createdAt ishlataman, kamayish tartibi uchun esa minus belgisi. Server'da bu qiymatlarni tekshiraman va faqat ma'lum maydonlarga ruxsat beraman, shunda foydalanuvchi SQL inject qila olmaydi.",
          example: "GET /tasks?status=done&priority=high&sort=-createdAt&limit=20",
          level: 'junior',
        },
        {
          q: 'How do you version an API?',
          a: "The most common way is to put the version in the URL, like /api/v1/tasks. Another way is to use a header. I create a new version only for breaking changes, like removing a field. Adding a new optional field is backward compatible, so it does not need a new version.",
          uz: "Eng keng tarqalgan usul — versiyani URL'ga qo'yish, masalan /api/v1/tasks. Boshqa usul — header ishlatish. Yangi versiyani faqat buzuvchi o'zgarishlar uchun yarataman, masalan maydonni olib tashlaganda. Yangi ixtiyoriy maydon qo'shish backward compatible, shuning uchun yangi versiya kerak emas.",
          level: 'junior',
        },
        {
          q: 'What is the difference between REST and GraphQL?',
          a: "The main difference is that REST has many endpoints, and GraphQL usually has one endpoint. In GraphQL, the client asks for exactly the fields it needs, so there is no over-fetching. REST is simpler and HTTP caching works out of the box. The trade-off is that GraphQL is more flexible, but harder to cache and secure.",
          uz: "Asosiy farq: REST'da ko'p endpoint bo'ladi, GraphQL'da esa odatda bitta endpoint. GraphQL'da client aynan kerakli maydonlarni so'raydi, shuning uchun over-fetching bo'lmaydi. REST soddaroq va HTTP caching darhol ishlaydi. Trade-off shundaki, GraphQL moslashuvchanroq, lekin uni cache qilish va himoyalash qiyinroq.",
          example: "query {\n  task(id: 7) {\n    title\n    assignee { name }\n  }\n}",
          followUp: 'When would you choose GraphQL?',
          level: 'middle',
        },
        {
          q: 'Design a REST API for a task manager with boards and tasks.',
          a: "I start with the resources: users, boards, and tasks. A board has many tasks, so tasks are nested under boards for listing and creating. Each endpoint checks that the user is logged in and owns the board. Lists support pagination and filtering, and all routes are under /api/v1.",
          uz: "Resurslardan boshlayman: users, boards va tasks. Bitta board'da ko'p task bor, shuning uchun ro'yxat olish va yaratish uchun task'lar board ichiga joylashadi. Har bir endpoint foydalanuvchi login qilganini va board egasi ekanini tekshiradi. Ro'yxatlar pagination va filtering'ni qo'llaydi, barcha route'lar /api/v1 ostida.",
          example: "POST   /api/v1/auth/register\nPOST   /api/v1/auth/login\nGET    /api/v1/boards\nPOST   /api/v1/boards\nGET    /api/v1/boards/:boardId/tasks?status=todo&page=1\nPOST   /api/v1/boards/:boardId/tasks\nPATCH  /api/v1/tasks/:taskId\nDELETE /api/v1/tasks/:taskId",
          level: 'middle',
        },
      ],
      resources: [
        { title: 'roadmap.sh — Backend', url: 'https://roadmap.sh/backend' },
        { title: 'GraphQL — Learn', url: 'https://graphql.org/learn/' },
        { title: 'System Design Primer (REST vs RPC)', url: 'https://github.com/donnemartin/system-design-primer' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'be-auth',
      title: 'Authentication, authorization, JWT vs session',
      days: [39, 41, 42],
      summary: "Authentication — siz kimligingizni tekshirish (login), authorization — nima qila olishingizni tekshirish (ruxsatlar, rollar). Parollar hech qachon ochiq saqlanmaydi: bcrypt kabi sekin, salt'li algoritm bilan hash qilinadi. Login'dan keyin foydalanuvchini eslab qolishning ikki asosiy usuli bor: session (server holatni saqlaydi, client'da faqat session id cookie) va JWT (server imzolagan token, server hech narsa saqlamaydi). JWT odatda qisqa muddatli access token + uzoq muddatli refresh token juftligida ishlatiladi. OAuth — boshqa servis (Google, GitHub) orqali kirish uchun standart.",
      keyPoints: [
        "Authentication — kimligingiz, authorization — nima qila olishingiz",
        "Parollarni bcrypt (yoki argon2) bilan hash qilamiz — sekin va salt'li",
        "Session: server session'ni saqlaydi, client'da httpOnly cookie'da session id",
        "JWT: header.payload.signature — imzolangan, lekin shifrlanmagan; payload'ga maxfiy narsa qo'ymang",
        "Access token qisqa (masalan 15 daqiqa), refresh token uzoq va server'da bekor qilinishi mumkin",
        "Token'ni httpOnly cookie'da saqlash XSS'dan himoya qiladi; localStorage'ni JS o'qiy oladi",
        "OAuth 2.0 — uchinchi tomon orqali kirish va ruxsat berish (Login with Google)",
      ],
      vocab: [
        { en: 'authentication', uz: 'kimlikni tasdiqlash' },
        { en: 'authorization', uz: 'ruxsatni tekshirish' },
        { en: 'hash', uz: "bir tomonlama shifrlash (orqaga qaytarib bo'lmaydi)" },
        { en: 'salt', uz: "hash'dan oldin parolga qo'shiladigan tasodifiy qiymat" },
        { en: 'token', uz: "kirish huquqini ko'rsatuvchi kalit-satr" },
        { en: 'signature', uz: 'imzo' },
        { en: 'expire', uz: "muddati o'tmoq" },
        { en: 'revoke', uz: 'bekor qilmoq' },
      ],
      questions: [
        {
          q: 'What is the difference between authentication and authorization?',
          a: "Authentication is who you are, and authorization is what you can do. Authentication happens first, for example when you log in with email and password. Authorization checks your permissions, for example if you are an admin. If authentication fails, we return 401. If authorization fails, we return 403.",
          uz: "Authentication — siz kimligingiz, authorization — nima qila olishingiz. Avval authentication bo'ladi, masalan email va parol bilan login qilganingizda. Authorization ruxsatlaringizni tekshiradi, masalan siz admin'misiz. Authentication muvaffaqiyatsiz bo'lsa 401 qaytaramiz. Authorization muvaffaqiyatsiz bo'lsa 403 qaytaramiz.",
          level: 'junior',
        },
        {
          q: 'How do you store passwords?',
          a: "We never store passwords as plain text. We hash passwords with bcrypt. Bcrypt adds a random salt and is slow on purpose, so brute-force attacks take a long time. At login, we compare the password with the saved hash using bcrypt.compare.",
          uz: "Parollarni hech qachon ochiq matn sifatida saqlamaymiz. Parollarni bcrypt bilan hash qilamiz. Bcrypt tasodifiy salt qo'shadi va ataylab sekin ishlaydi, shuning uchun brute-force hujumlar uzoq vaqt oladi. Login paytida parolni saqlangan hash bilan bcrypt.compare orqali solishtiramiz.",
          example: "const bcrypt = require('bcrypt')\n\n// register\nconst hash = await bcrypt.hash(password, 12)\n\n// login\nconst ok = await bcrypt.compare(password, user.passwordHash)",
          followUp: 'Why not use SHA-256 or MD5 for passwords?',
          level: 'junior',
        },
        {
          q: 'What happens when a user logs in?',
          a: "The user sends email and password over HTTPS. The server finds the user by email and checks the password with bcrypt. If it is correct, the server creates a session or a JWT. The client then sends this cookie or token with every next request. If the password is wrong, the server returns 401 with a general error message.",
          uz: "Foydalanuvchi email va parolni HTTPS orqali yuboradi. Server foydalanuvchini email bo'yicha topadi va parolni bcrypt bilan tekshiradi. To'g'ri bo'lsa, server session yoki JWT yaratadi. Keyin client shu cookie yoki token'ni har bir keyingi request bilan yuboradi. Parol noto'g'ri bo'lsa, server umumiy xato xabari bilan 401 qaytaradi.",
          followUp: "Why should the error message not say 'wrong password'?",
          level: 'junior',
        },
        {
          q: 'What is a JWT?',
          a: "JWT means JSON Web Token. It has three parts: header, payload, and signature. The payload has data like the user id and the expiry time. The server signs the token with a secret, so nobody can change it. But the payload is only encoded, not encrypted, so we never put passwords in it.",
          uz: "JWT — JSON Web Token. U uch qismdan iborat: header, payload va signature. Payload'da user id va muddat tugash vaqti kabi ma'lumot bo'ladi. Server token'ni secret bilan imzolaydi, shuning uchun uni hech kim o'zgartira olmaydi. Lekin payload faqat encode qilingan, shifrlanmagan, shuning uchun unga hech qachon parol qo'ymaymiz.",
          example: "const jwt = require('jsonwebtoken')\n\nconst token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' })\nconst payload = jwt.verify(token, process.env.JWT_SECRET)",
          level: 'junior',
        },
        {
          q: 'What is the difference between sessions and JWT?',
          a: "With sessions, the server stores the session data, and the client keeps only a session id in a cookie. With JWT, the data is inside the token, so the server does not need to store anything. JWT is stateless and easier to scale across many servers. The trade-off is that a session is easy to revoke, but a JWT stays valid until it expires.",
          uz: "Session'da server session ma'lumotini saqlaydi, client esa cookie'da faqat session id'ni saqlaydi. JWT'da ma'lumot token ichida, shuning uchun server hech narsa saqlashi shart emas. JWT stateless va ko'p server'lar orasida scale qilish osonroq. Trade-off shundaki, session'ni bekor qilish oson, JWT esa muddati tugaguncha amal qilaveradi.",
          followUp: 'How do you log out a user when you use JWT?',
          level: 'junior',
        },
        {
          q: 'What is a refresh token and why do we need it?',
          a: "The access token has a short life, for example fifteen minutes. This limits the damage if it is stolen. The refresh token lives longer, for example seven days, and is used only to get a new access token. We store refresh tokens in the database, so we can revoke them on logout.",
          uz: "Access token qisqa umr ko'radi, masalan o'n besh daqiqa. Bu u o'g'irlansa zararni cheklaydi. Refresh token uzoqroq yashaydi, masalan yetti kun, va faqat yangi access token olish uchun ishlatiladi. Refresh token'larni database'da saqlaymiz, shunda logout paytida ularni bekor qila olamiz.",
          example: "POST /auth/refresh\nCookie: refreshToken=...\n→ 200 { \"accessToken\": \"new-token\" }",
          level: 'middle',
        },
        {
          q: 'Where do you store the token on the client: localStorage or a cookie?',
          a: "It depends on the use case, but I prefer an httpOnly cookie. JavaScript cannot read an httpOnly cookie, so an XSS attack cannot steal it. localStorage is easy to use, but any script on the page can read it. With cookies, we also need protection against CSRF, for example SameSite cookies.",
          uz: "Bu holatga bog'liq, lekin men httpOnly cookie'ni afzal ko'raman. JavaScript httpOnly cookie'ni o'qiy olmaydi, shuning uchun XSS hujum uni o'g'irlay olmaydi. localStorage'ni ishlatish oson, lekin sahifadagi har qanday script uni o'qiy oladi. Cookie bilan CSRF'dan ham himoya kerak, masalan SameSite cookie'lar.",
          example: "res.cookie('refreshToken', token, {\n  httpOnly: true,\n  secure: true,\n  sameSite: 'strict',\n  maxAge: 7 * 24 * 60 * 60 * 1000,\n})",
          level: 'middle',
        },
        {
          q: 'What is OAuth?',
          a: "OAuth 2.0 is a standard that lets an app get limited access to a user's account on another service. For example, 'Login with Google'. The user logs in on Google, not on our site, so we never see the Google password. Google gives our app a token with only the permissions the user allowed.",
          uz: "OAuth 2.0 — ilovaga foydalanuvchining boshqa servisdagi akkauntiga cheklangan kirish huquqini beruvchi standart. Masalan, 'Login with Google'. Foydalanuvchi bizning saytda emas, Google'da login qiladi, shuning uchun biz Google parolini hech qachon ko'rmaymiz. Google ilovamizga faqat foydalanuvchi ruxsat bergan huquqlar bilan token beradi.",
          followUp: 'What is the difference between OAuth and OpenID Connect?',
          level: 'middle',
        },
      ],
      resources: [
        { title: 'OWASP — Password Storage Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html' },
        { title: 'JWT.io — Introduction', url: 'https://jwt.io/introduction' },
        { title: 'OAuth 2.0', url: 'https://oauth.net/2/' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'be-middleware',
      title: 'Middleware (Express)',
      days: [40, 41],
      summary: "Middleware — request handler'ga yetguncha (yoki undan keyin) ishlaydigan funksiya. Express'da u (req, res, next) qabul qiladi: request'ni o'zgartirishi, response yuborib zanjirni to'xtatishi yoki next() bilan keyingisiga uzatishi mumkin. Middleware'lar ro'yxatdan o'tgan tartibda ishlaydi. Odatiy misollar: JSON parse qilish, logging, CORS, auth tekshiruvi, validation, rate limiting. Xatolar uchun maxsus error-handling middleware bor — u 4 ta argument (err, req, res, next) qabul qiladi va oxirida ro'yxatdan o'tadi.",
      keyPoints: [
        "Middleware signature: (req, res, next)",
        "next() — keyingi middleware'ga o'tkazadi; response yuborilsa zanjir to'xtaydi",
        "Tartib muhim: app.use(express.json()) route'lardan oldin bo'lishi kerak",
        "Global (app.use) yoki faqat bitta route uchun bo'lishi mumkin",
        "Misollar: auth, logging, CORS, validation, rate limit",
        "Error middleware: (err, req, res, next) — eng oxirida",
      ],
      vocab: [
        { en: 'middleware', uz: 'oraliq qatlam funksiyasi' },
        { en: 'handler', uz: "request'ni qayta ishlovchi funksiya" },
        { en: 'chain', uz: 'zanjir' },
        { en: 'pass to the next', uz: 'keyingisiga uzatmoq' },
        { en: 'protected route', uz: 'himoyalangan route' },
        { en: 'order', uz: 'tartib' },
      ],
      questions: [
        {
          q: 'What is middleware in Express?',
          a: "Middleware is a function that runs before the request reaches the handler. It gets req, res, and next. It can read or change the request, send a response, or call next to continue. We use middleware for things like auth, logging, and parsing JSON.",
          uz: "Middleware — request handler'ga yetguncha ishlaydigan funksiya. U req, res va next'ni oladi. U request'ni o'qishi yoki o'zgartirishi, response yuborishi yoki davom etish uchun next'ni chaqirishi mumkin. Middleware'ni auth, logging va JSON parse qilish kabi ishlar uchun ishlatamiz.",
          example: "function logger(req, res, next) {\n  console.log(req.method, req.url)\n  next()\n}\n\napp.use(logger)",
          level: 'junior',
        },
        {
          q: 'What does next() do? What happens if you forget to call it?',
          a: "next() passes control to the next middleware or route handler. If you forget to call next and also do not send a response, the request hangs. The client waits until it gets a timeout. If you call next with an error, Express skips to the error-handling middleware.",
          uz: "next() boshqaruvni keyingi middleware yoki route handler'ga uzatadi. Agar next'ni chaqirishni unutsangiz va response ham yubormasangiz, request osilib qoladi. Client timeout bo'lguncha kutadi. Agar next'ni xato bilan chaqirsangiz, Express to'g'ridan-to'g'ri error-handling middleware'ga o'tadi.",
          level: 'junior',
        },
        {
          q: 'Why is the order of middleware important?',
          a: "Express runs middleware in the order you register it. For example, express.json() must come before the routes, or req.body will be empty. Auth middleware must come before protected routes. The error handler must be the last one.",
          uz: "Express middleware'larni ro'yxatdan o'tkazgan tartibingizda ishga tushiradi. Masalan, express.json() route'lardan oldin bo'lishi kerak, aks holda req.body bo'sh bo'ladi. Auth middleware himoyalangan route'lardan oldin bo'lishi kerak. Error handler eng oxirgisi bo'lishi kerak.",
          example: "app.use(express.json())\napp.use(cors())\napp.use('/api/v1/auth', authRoutes)\napp.use('/api/v1/tasks', requireAuth, taskRoutes)\napp.use(errorHandler) // last",
          level: 'junior',
        },
        {
          q: 'How would you write an auth middleware for protected routes?',
          a: "The middleware reads the token from the Authorization header. It verifies the token with the secret. If the token is valid, it saves the user in req.user and calls next. If the token is missing or invalid, it returns 401.",
          uz: "Middleware token'ni Authorization header'dan o'qiydi. Token'ni secret bilan tekshiradi. Token to'g'ri bo'lsa, foydalanuvchini req.user'ga saqlaydi va next'ni chaqiradi. Token yo'q yoki noto'g'ri bo'lsa, 401 qaytaradi.",
          example: "const jwt = require('jsonwebtoken')\n\nfunction requireAuth(req, res, next) {\n  const header = req.headers.authorization || ''\n  const [type, token] = header.split(' ')\n  if (type !== 'Bearer' || !token) {\n    return res.status(401).json({ error: 'No token' })\n  }\n  try {\n    req.user = jwt.verify(token, process.env.JWT_SECRET)\n    next()\n  } catch {\n    res.status(401).json({ error: 'Invalid or expired token' })\n  }\n}\n\napp.get('/api/v1/me', requireAuth, (req, res) => res.json(req.user))",
          followUp: 'How would you add a role check that returns 403?',
          level: 'junior',
        },
        {
          q: 'What is error-handling middleware in Express?',
          a: "It is a middleware with four arguments: err, req, res, and next. Express calls it when a handler calls next with an error or throws. We register it after all routes. It logs the error and sends a clean JSON response with the right status code.",
          uz: "Bu to'rtta argumentli middleware: err, req, res va next. Handler next'ni xato bilan chaqirganda yoki xato throw qilganda Express uni chaqiradi. Uni barcha route'lardan keyin ro'yxatdan o'tkazamiz. U xatoni log qiladi va to'g'ri status code bilan toza JSON response yuboradi.",
          example: "function errorHandler(err, req, res, next) {\n  console.error(err)\n  const status = err.status || 500\n  res.status(status).json({ error: status === 500 ? 'Internal server error' : err.message })\n}\n\napp.use(errorHandler)",
          level: 'middle',
        },
      ],
      resources: [
        { title: 'Express — Using middleware', url: 'https://expressjs.com/en/guide/using-middleware.html' },
        { title: 'Express — Error handling', url: 'https://expressjs.com/en/guide/error-handling.html' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'be-error-handling',
      title: 'Error handling, validation, logging, rate limiting',
      days: [40],
      summary: "Yaxshi API xatolarni bir joyda — markaziy error middleware'da — qayta ishlaydi va client'ga aniq status code hamda tushunarli JSON qaytaradi, lekin stack trace yoki ichki ma'lumotni oshkor qilmaydi. Input har doim server tomonda tekshiriladi (validation), chunki frontend tekshiruvini aylanib o'tish oson; buning uchun Zod yoki Joi kabi schema kutubxonalari qulay. Logging muammoni topishga yordam beradi, lekin log'ga parol va token yozilmaydi. Rate limiting bitta client'dan keladigan request sonini cheklaydi va brute-force hamda suiiste'moldan himoya qiladi (429 Too Many Requests).",
      keyPoints: [
        "Markaziy error handler — barcha xatolar bir joyda, bir xil formatda",
        "Client'ga stack trace ko'rsatmang; 500'da umumiy xabar qaytaring",
        "Input'ni server tomonda tekshiramiz — frontend'ga ishonib bo'lmaydi",
        "Schema validation: Zod, Joi, express-validator",
        "Log'ga parol, token, karta raqamini yozmang; structured log (JSON) qulay",
        "Rate limiting → 429 Too Many Requests (ayniqsa /login uchun)",
        "Express 4'da async xatolarni try/catch yoki wrapper bilan ushlash kerak; Express 5 rejected promise'ni o'zi ushlaydi",
      ],
      vocab: [
        { en: 'validation', uz: "ma'lumotni tekshirish" },
        { en: 'sanitize', uz: 'tozalash (xavfli belgilarni olib tashlash)' },
        { en: 'stack trace', uz: "xato qayerda bo'lganini ko'rsatuvchi chaqiruvlar ro'yxati" },
        { en: 'rate limiting', uz: "so'rovlar sonini cheklash" },
        { en: 'brute-force', uz: "hamma variantni sinab ko'rish hujumi" },
        { en: 'log level', uz: 'log darajasi (info, warn, error)' },
        { en: 'leak', uz: "sizib chiqish (ma'lumot oshkor bo'lishi)" },
      ],
      questions: [
        {
          q: 'How do you handle errors in a Node.js / Express API?',
          a: "I handle errors in one central error middleware. In handlers, I throw custom errors with a status code, like NotFoundError with 404. The error middleware logs the error and sends a clean JSON response. For 500 errors, I return a general message and never show the stack trace to the client.",
          uz: "Xatolarni bitta markaziy error middleware'da qayta ishlayman. Handler'larda status code'li maxsus xatolarni throw qilaman, masalan 404 bilan NotFoundError. Error middleware xatoni log qiladi va toza JSON response yuboradi. 500 xatolar uchun umumiy xabar qaytaraman va client'ga stack trace'ni hech qachon ko'rsatmayman.",
          example: "class AppError extends Error {\n  constructor(status, message) {\n    super(message)\n    this.status = status\n  }\n}\n\n// in a handler\nif (!task) throw new AppError(404, 'Task not found')",
          level: 'junior',
        },
        {
          q: 'How do you catch errors in async route handlers?',
          a: "In Express 4, an error in an async handler is not caught automatically. So I use try/catch and call next(err), or I use a small wrapper function. Express 5 catches rejected promises by itself and sends them to the error middleware.",
          uz: "Express 4'da async handler'dagi xato avtomatik ushlanmaydi. Shuning uchun try/catch ishlatib next(err) chaqiraman yoki kichik wrapper funksiya ishlataman. Express 5 rejected promise'larni o'zi ushlaydi va error middleware'ga yuboradi.",
          example: "const asyncHandler = (fn) => (req, res, next) =>\n  Promise.resolve(fn(req, res, next)).catch(next)\n\napp.get('/tasks/:id', asyncHandler(async (req, res) => {\n  const task = await db.findTask(req.params.id)\n  if (!task) throw new AppError(404, 'Task not found')\n  res.json(task)\n}))",
          level: 'middle',
        },
        {
          q: 'Why do we validate input on the server if the frontend already validates it?',
          a: "We validate the input on the server side because the client can never be trusted. Anyone can send a request with curl or Postman and skip the frontend. Frontend validation is only for a better user experience. Server validation protects the data and the security of the system.",
          uz: "Input'ni server tomonda tekshiramiz, chunki client'ga hech qachon ishonib bo'lmaydi. Har kim curl yoki Postman bilan request yuborib, frontend'ni chetlab o'tishi mumkin. Frontend validation faqat yaxshiroq foydalanuvchi tajribasi uchun. Server validation esa ma'lumotlarni va tizim xavfsizligini himoya qiladi.",
          level: 'junior',
        },
        {
          q: 'How do you validate request data?',
          a: "I use a schema library like Zod or Joi. I describe the expected shape: types, required fields, lengths, and formats. If the data is wrong, I return 400 or 422 with a clear list of errors. I also use only the validated data, not the raw request body.",
          uz: "Zod yoki Joi kabi schema kutubxonasidan foydalanaman. Kutilgan shaklni tasvirlayman: turlar, majburiy maydonlar, uzunliklar va formatlar. Ma'lumot noto'g'ri bo'lsa, xatolarning aniq ro'yxati bilan 400 yoki 422 qaytaraman. Bundan tashqari, xom request body'ni emas, faqat tekshirilgan ma'lumotni ishlataman.",
          example: "const { z } = require('zod')\n\nconst createTaskSchema = z.object({\n  title: z.string().trim().min(1).max(100),\n  priority: z.enum(['low', 'medium', 'high']).default('medium'),\n})\n\nconst result = createTaskSchema.safeParse(req.body)\nif (!result.success) {\n  return res.status(400).json({ errors: result.error.issues })\n}\nconst data = result.data",
          level: 'junior',
        },
        {
          q: 'What is rate limiting and why do we need it?',
          a: "Rate limiting limits how many requests one client can send in a time window. For example, five login attempts per minute per IP address. It protects against brute-force attacks and stops one user from overloading the server. When the limit is reached, the server returns 429 Too Many Requests.",
          uz: "Rate limiting bitta client ma'lum vaqt oralig'ida qancha request yubora olishini cheklaydi. Masalan, bitta IP manzil uchun daqiqasiga besh marta login urinish. U brute-force hujumlardan himoya qiladi va bitta foydalanuvchi server'ni haddan tashqari yuklashini to'xtatadi. Limitga yetilganda server 429 Too Many Requests qaytaradi.",
          example: "const rateLimit = require('express-rate-limit')\n\napp.use('/api/v1/auth/login', rateLimit({ windowMs: 60 * 1000, limit: 5 }))",
          followUp: 'Where do you store the counters if you have many servers?',
          level: 'junior',
        },
        {
          q: 'What do you log in a backend, and what should you never log?',
          a: "I log requests with method, URL, status code, and response time. I log errors with the stack trace and a request id, so I can find the problem. I never log passwords, tokens, or card numbers. I use log levels like info, warn, and error, and structured JSON logs.",
          uz: "Request'larni method, URL, status code va javob vaqti bilan log qilaman. Xatolarni stack trace va request id bilan log qilaman, shunda muammoni topa olaman. Parol, token yoki karta raqamini hech qachon log qilmayman. info, warn va error kabi log darajalarini va structured JSON log'larni ishlataman.",
          level: 'junior',
        },
      ],
      resources: [
        { title: 'Express — Error handling', url: 'https://expressjs.com/en/guide/error-handling.html' },
        { title: 'OWASP — Input Validation Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html' },
        { title: 'OWASP — Logging Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'be-nodejs',
      title: 'Node.js asoslari: event loop, single thread, streams',
      days: [38, 41],
      summary: "Node.js — V8 dvigatelida JavaScript'ni server'da ishga tushiradigan runtime. JavaScript kodi bitta thread'da ishlaydi, lekin I/O (fayl, tarmoq, database) non-blocking: Node operatsiyani OS'ga yoki libuv thread pool'iga beradi va kutib turmasdan keyingi ishga o'tadi. Natija tayyor bo'lganda callback event loop orqali bajariladi. Shuning uchun Node ko'p bir vaqtdagi I/O request'larni yaxshi ko'taradi, lekin og'ir CPU ishi (katta hisob-kitob) event loop'ni bloklaydi. Streams katta ma'lumotni bo'laklab (chunk) qayta ishlashga imkon beradi, butun faylni xotiraga yuklamasdan.",
      keyPoints: [
        "JS kodi bitta thread'da ishlaydi, I/O esa non-blocking",
        "libuv: event loop + thread pool (fs, crypto, dns.lookup, zlib uchun)",
        "Event loop fazalari: timers → pending callbacks → poll → check (setImmediate) → close",
        "process.nextTick va Promise microtask'lari joriy callback'dan keyin, event loop davom etishidan oldin ishlaydi",
        "Og'ir CPU ishi event loop'ni bloklaydi → worker_threads yoki alohida servis",
        "Streams: Readable, Writable, Duplex, Transform; pipe() / pipeline()",
      ],
      vocab: [
        { en: 'runtime', uz: 'ishga tushirish muhiti' },
        { en: 'single-threaded', uz: "bitta thread'li" },
        { en: 'non-blocking', uz: "to'xtatib qo'ymaydigan" },
        { en: 'event loop', uz: 'hodisalar sikli' },
        { en: 'thread pool', uz: "thread'lar to'plami" },
        { en: 'stream', uz: "oqim (ma'lumotni bo'laklab uzatish)" },
        { en: 'chunk', uz: "bo'lak" },
        { en: 'CPU-bound', uz: "protsessorga og'ir (hisob-kitobli) ish" },
      ],
      questions: [
        {
          q: 'What is Node.js?',
          a: "Node.js is a runtime that runs JavaScript outside the browser, mostly on the server. It uses the V8 engine from Chrome. It has a non-blocking, event-driven model, so it is good for APIs and real-time apps with many connections.",
          uz: "Node.js — JavaScript'ni brauzerdan tashqarida, asosan server'da ishga tushiradigan runtime. U Chrome'dagi V8 dvigatelidan foydalanadi. Uning non-blocking, event-driven modeli bor, shuning uchun u ko'p ulanishli API va real-time ilovalar uchun yaxshi.",
          level: 'junior',
        },
        {
          q: 'Node.js is single-threaded. How can it handle many requests at the same time?',
          a: "Our JavaScript code runs on one thread, but I/O is non-blocking. When Node reads a file or queries a database, it does not wait. It gives the work to the operating system or the libuv thread pool and handles other requests. When the result is ready, the event loop runs the callback.",
          uz: "Bizning JavaScript kodimiz bitta thread'da ishlaydi, lekin I/O non-blocking. Node fayl o'qiganda yoki database'ga query yuborganda kutib turmaydi. Ishni operatsion tizimga yoki libuv thread pool'iga beradi va boshqa request'larni qayta ishlaydi. Natija tayyor bo'lganda event loop callback'ni ishga tushiradi.",
          followUp: 'So what kind of work is bad for Node.js?',
          level: 'junior',
        },
        {
          q: 'Can you explain the event loop in Node.js?',
          a: "The event loop is a loop that checks queues of callbacks and runs them one by one. It has phases: timers for setTimeout, poll for I/O callbacks, and check for setImmediate. After each callback, Node runs microtasks: process.nextTick first, then promise callbacks. The loop continues while there is work to do.",
          uz: "Event loop — callback navbatlarini tekshirib, ularni birma-bir ishga tushiradigan sikl. Uning fazalari bor: setTimeout uchun timers, I/O callback'lari uchun poll va setImmediate uchun check. Har bir callback'dan keyin Node microtask'larni bajaradi: avval process.nextTick, keyin promise callback'lari. Bajariladigan ish bor ekan, sikl davom etadi.",
          example: "setTimeout(() => console.log('timeout'), 0)\nsetImmediate(() => console.log('immediate'))\nPromise.resolve().then(() => console.log('promise'))\nprocess.nextTick(() => console.log('nextTick'))\nconsole.log('sync')\n\n// sync, nextTick, promise, then timeout/immediate\n// (the order of the last two can change in the main module)",
          level: 'middle',
        },
        {
          q: 'What blocks the event loop and how do you avoid it?',
          a: "CPU-heavy work blocks the event loop, for example a big loop, heavy JSON parsing, or sync functions like fs.readFileSync. While it runs, no other request is handled. To avoid it, I use async APIs, split big tasks, or move heavy work to worker_threads or a separate job queue.",
          uz: "CPU'ga og'ir ish event loop'ni bloklaydi, masalan katta sikl, og'ir JSON parse yoki fs.readFileSync kabi sinxron funksiyalar. U ishlayotganda boshqa hech qanday request qayta ishlanmaydi. Buning oldini olish uchun async API'lardan foydalanaman, katta vazifalarni bo'laman yoki og'ir ishni worker_threads'ga yoki alohida job queue'ga o'tkazaman.",
          level: 'middle',
        },
        {
          q: 'What are streams in Node.js?',
          a: "Streams let us process data in small chunks instead of loading all of it into memory. For example, we can send a large file to the client chunk by chunk. There are readable, writable, duplex, and transform streams. They save memory and the client starts getting data sooner.",
          uz: "Streams ma'lumotni hammasini xotiraga yuklash o'rniga kichik bo'laklarda qayta ishlash imkonini beradi. Masalan, katta faylni client'ga bo'lakma-bo'lak yuborishimiz mumkin. Readable, writable, duplex va transform stream'lar bor. Ular xotirani tejaydi va client ma'lumotni tezroq ola boshlaydi.",
          example: "const fs = require('fs')\n\napp.get('/report', (req, res) => {\n  res.setHeader('Content-Type', 'text/csv')\n  fs.createReadStream('./big-report.csv').pipe(res)\n})",
          level: 'middle',
        },
        {
          q: 'What is the difference between process.nextTick and setImmediate?',
          a: "process.nextTick runs the callback right after the current operation, before the event loop continues. setImmediate runs the callback in the check phase, after I/O callbacks. Too many nextTick calls can starve the event loop. So for most cases setImmediate is safer.",
          uz: "process.nextTick callback'ni joriy operatsiyadan darhol keyin, event loop davom etishidan oldin ishga tushiradi. setImmediate callback'ni check fazasida, I/O callback'laridan keyin ishga tushiradi. Juda ko'p nextTick chaqiruvi event loop'ni 'och qoldirishi' mumkin. Shuning uchun ko'p hollarda setImmediate xavfsizroq.",
          level: 'middle',
        },
      ],
      resources: [
        { title: 'Node.js — The Event Loop', url: 'https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick' },
        { title: 'Node.js docs — Stream', url: 'https://nodejs.org/api/stream.html' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'be-live-coding',
      title: 'Backend live coding: endpoint + validation + test',
      days: [38, 41, 76],
      summary: "Backend live coding'da odatda bitta kichik endpoint yozish so'raladi: masalan POST /tasks — input validation, to'g'ri status code'lar va test bilan. Intervyuer kod sifatidan tashqari fikrlashingizni eshitmoqchi, shuning uchun ovoz chiqarib gapiring: avval talablarni aniqlang (qaysi maydonlar majburiy? qaysi status code?), keyin oddiy ishlaydigan versiyani yozing, so'ng edge case'lar va testlarni qo'shing. Test uchun Jest yoki Vitest + supertest qulay: app'ni server ishga tushirmasdan to'g'ridan-to'g'ri chaqirish mumkin. App'ni (app.js) va server'ni (app.listen) alohida faylga ajratish testni osonlashtiradi.",
      keyPoints: [
        "Avval savol bering: maydonlar, cheklovlar, status code'lar, auth kerakmi?",
        "Ovoz chiqarib gapiring: 'First I'll validate the input, then...'",
        "Muvaffaqiyat: 201 + yaratilgan obyekt; noto'g'ri input: 400/422 + xatolar ro'yxati",
        "app.js'da app'ni export qiling, app.listen alohida faylda — test uchun",
        "supertest bilan: happy path + validation xatosi + 404 / 401 holatlari",
        "Oxirida yaxshilashlarni ayting: database, auth, pagination, rate limit",
      ],
      vocab: [
        { en: 'requirement', uz: 'talab' },
        { en: 'edge case', uz: 'chegaraviy holat' },
        { en: 'happy path', uz: "hammasi to'g'ri ketgan asosiy holat" },
        { en: 'assertion', uz: 'testdagi tekshiruv (expect)' },
        { en: 'test case', uz: 'test holati' },
        { en: 'integration test', uz: 'bir necha qism birga ishlashini tekshiruvchi test' },
        { en: 'in-memory', uz: "xotirada (database'siz)" },
      ],
      questions: [
        {
          q: 'Write a POST /tasks endpoint with validation.',
          a: "First, I check the requirements: title is required, max 100 characters, and priority is low, medium, or high. I validate the body and return 400 with a list of errors if it is wrong. If the data is valid, I create the task and return 201 with the new task. Here I use an in-memory array, but in a real app I would save it to the database.",
          uz: "Avval talablarni aniqlayman: title majburiy, ko'pi bilan 100 belgi, priority esa low, medium yoki high. Body'ni tekshiraman va noto'g'ri bo'lsa xatolar ro'yxati bilan 400 qaytaraman. Ma'lumot to'g'ri bo'lsa, task yarataman va yangi task bilan 201 qaytaraman. Bu yerda xotiradagi massiv ishlatyapman, lekin haqiqiy ilovada uni database'ga saqlagan bo'lardim.",
          example: `// app.js
const express = require('express')

const app = express()
app.use(express.json())

const tasks = []
let nextId = 1
const PRIORITIES = ['low', 'medium', 'high']

app.post('/tasks', (req, res) => {
  const { title, priority = 'medium' } = req.body || {}
  const errors = []

  if (typeof title !== 'string' || title.trim() === '') {
    errors.push('title is required')
  } else if (title.trim().length > 100) {
    errors.push('title must be at most 100 characters')
  }
  if (!PRIORITIES.includes(priority)) {
    errors.push('priority must be low, medium or high')
  }
  if (errors.length > 0) {
    return res.status(400).json({ errors })
  }

  const task = { id: nextId++, title: title.trim(), priority, done: false }
  tasks.push(task)
  res.status(201).json(task)
})

module.exports = app

// server.js
// const app = require('./app')
// app.listen(3000, () => console.log('Listening on 3000'))`,
          followUp: 'How would you test this endpoint?',
          level: 'junior',
        },
        {
          q: 'How would you test this endpoint?',
          a: "I write integration tests with Jest and supertest. Supertest calls the Express app directly, so I do not need to start the server. I test the happy path: status 201 and the correct body. Then I test the errors: missing title, too long title, and wrong priority must return 400.",
          uz: "Jest va supertest bilan integration test yozaman. Supertest Express app'ni to'g'ridan-to'g'ri chaqiradi, shuning uchun server'ni ishga tushirish shart emas. Happy path'ni tekshiraman: 201 status va to'g'ri body. Keyin xatolarni tekshiraman: title yo'qligi, juda uzun title va noto'g'ri priority 400 qaytarishi kerak.",
          example: `// app.test.js
const request = require('supertest')
const app = require('./app')

describe('POST /tasks', () => {
  it('creates a task and returns 201', async () => {
    const res = await request(app).post('/tasks').send({ title: 'Buy milk' })

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({ title: 'Buy milk', priority: 'medium', done: false })
    expect(res.body.id).toBeDefined()
  })

  it('returns 400 when title is missing', async () => {
    const res = await request(app).post('/tasks').send({})

    expect(res.status).toBe(400)
    expect(res.body.errors).toContain('title is required')
  })

  it('returns 400 when title is too long', async () => {
    const res = await request(app).post('/tasks').send({ title: 'a'.repeat(101) })

    expect(res.status).toBe(400)
  })

  it('returns 400 for an unknown priority', async () => {
    const res = await request(app).post('/tasks').send({ title: 'Test', priority: 'urgent' })

    expect(res.status).toBe(400)
    expect(res.body.errors).toContain('priority must be low, medium or high')
  })
})`,
          followUp: 'What is the difference between a unit test and an integration test?',
          level: 'junior',
        },
        {
          q: 'Write GET /tasks/:id and PATCH /tasks/:id. What status codes do they return?',
          a: "GET returns 200 with the task, or 404 if it does not exist. PATCH updates only the fields that are sent, so I copy only allowed fields. If the id is not a number, I return 400. After a successful update, I return 200 with the updated task.",
          uz: "GET task bilan 200 qaytaradi, task mavjud bo'lmasa 404. PATCH faqat yuborilgan maydonlarni yangilaydi, shuning uchun faqat ruxsat etilgan maydonlarni ko'chiraman. id raqam bo'lmasa, 400 qaytaraman. Muvaffaqiyatli yangilangandan keyin yangilangan task bilan 200 qaytaraman.",
          example: `function findTask(req, res) {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: 'id must be a number' })
    return null
  }
  const task = tasks.find((t) => t.id === id)
  if (!task) {
    res.status(404).json({ error: 'Task not found' })
    return null
  }
  return task
}

app.get('/tasks/:id', (req, res) => {
  const task = findTask(req, res)
  if (task) res.json(task)
})

app.patch('/tasks/:id', (req, res) => {
  const task = findTask(req, res)
  if (!task) return
  const { title, done } = req.body || {}
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ errors: ['title must be a non-empty string'] })
    }
    task.title = title.trim()
  }
  if (done !== undefined) {
    if (typeof done !== 'boolean') {
      return res.status(400).json({ errors: ['done must be a boolean'] })
    }
    task.done = done
  }
  res.json(task)
})`,
          level: 'junior',
        },
        {
          q: 'Add pagination and filtering to GET /tasks.',
          a: "I read page, limit, and status from the query string. I convert them to numbers and set safe defaults and a max limit, so nobody can ask for a million rows. Then I filter, slice the array, and return the items with the total count. With a database, I would use LIMIT and OFFSET in SQL.",
          uz: "Query string'dan page, limit va status'ni o'qiyman. Ularni raqamga aylantiraman va xavfsiz default qiymatlar hamda maksimal limit qo'yaman, shunda hech kim million qator so'ray olmaydi. Keyin filtrlayman, massivni kesaman va elementlarni umumiy son bilan qaytaraman. Database bilan SQL'da LIMIT va OFFSET ishlatgan bo'lardim.",
          example: `app.get('/tasks', (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20))
  const { status } = req.query

  let result = tasks
  if (status === 'done') result = result.filter((t) => t.done)
  if (status === 'todo') result = result.filter((t) => !t.done)

  const start = (page - 1) * limit
  res.json({
    items: result.slice(start, start + limit),
    page,
    limit,
    total: result.length,
  })
})`,
          level: 'middle',
        },
        {
          q: 'How would you protect these endpoints so that only the owner can change a task?',
          a: "First, I add an auth middleware that checks the JWT and sets req.user. Then, in the handler, I load the task and compare task.userId with the user id from the token. If there is no valid token, I return 401. If the user is not the owner, I return 403.",
          uz: "Avval JWT'ni tekshirib req.user'ni o'rnatadigan auth middleware qo'shaman. Keyin handler'da task'ni yuklab, task.userId'ni token'dagi user id bilan solishtiraman. To'g'ri token bo'lmasa, 401 qaytaraman. Foydalanuvchi egasi bo'lmasa, 403 qaytaraman.",
          example: `app.delete('/tasks/:id', requireAuth, (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id))
  if (!task) return res.status(404).json({ error: 'Task not found' })
  if (task.userId !== req.user.userId) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  tasks.splice(tasks.indexOf(task), 1)
  res.status(204).end()
})`,
          followUp: 'Some APIs return 404 instead of 403 here. Why?',
          level: 'middle',
        },
        {
          q: 'You have finished the endpoint. What would you improve if you had more time?',
          a: "I would move the data from memory to a real database, like PostgreSQL. I would use a schema library like Zod for validation and a central error handler. I would add auth, rate limiting, and logging. Finally, I would add more tests and a test database for them.",
          uz: "Ma'lumotlarni xotiradan PostgreSQL kabi haqiqiy database'ga o'tkazgan bo'lardim. Validation uchun Zod kabi schema kutubxonasi va markaziy error handler ishlatgan bo'lardim. Auth, rate limiting va logging qo'shgan bo'lardim. Va nihoyat, ko'proq test va ular uchun test database qo'shgan bo'lardim.",
          level: 'junior',
        },
      ],
      resources: [
        { title: 'supertest (GitHub)', url: 'https://github.com/ladjs/supertest' },
        { title: 'Jest — Getting Started', url: 'https://jestjs.io/docs/getting-started' },
        { title: 'Express — Routing', url: 'https://expressjs.com/en/guide/routing.html' },
      ],
    },
  ],
}

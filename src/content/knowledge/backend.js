export default {
  id: 'backend',
  title: 'Backend va API',
  icon: '⚙️',
  intro: "HTTP, REST API dizayni, auth (JWT, session), filter/interceptor, xatolar bilan ishlash va frontend ↔ backend o'rtasidagi so'rovning to'liq yo'li. Barcha backend misollari Java 21 + Spring Boot 3 da yozilgan (frontend — Vue/React + TypeScript, database — PostgreSQL). Full-stack intervyularda backend savollari deyarli har doim so'raladi: API'ni qanday loyihalashingiz va xavfsiz qilishingiz tekshiriladi.",
  topics: [
    // ─────────────────────────────────────────────
    {
      id: 'be-http-basics',
      title: "Client–server va HTTP so'rov/javob",
      days: [36],
      summary: "Web client–server modelida ishlaydi: client (brauzer, mobil ilova) request yuboradi, server uni qayta ishlab response qaytaradi. HTTP — shu almashinuv uchun protokol. Request'da method, URL, header'lar va ixtiyoriy body bo'ladi; response'da status code, header'lar va body bo'ladi. HTTP stateless — server oldingi request'larni o'zi eslab qolmaydi, shuning uchun har bir request kerakli ma'lumotni (masalan, token yoki cookie) o'zi olib keladi. HTTPS — bu TLS bilan shifrlangan HTTP. Spring Boot'da request'ning har bir qismini controller metodida annotatsiya bilan olamiz (@PathVariable, @RequestParam, @RequestHeader, @RequestBody), javobni esa ResponseEntity bilan to'liq boshqaramiz.",
      keyPoints: [
        "Client request yuboradi, server response qaytaradi",
        "Request: method + URL + headers + (body)",
        "Response: status code + headers + (body)",
        "Header'lar — metadata: Content-Type, Authorization, Cache-Control, Set-Cookie",
        "HTTP stateless — holatni cookie, session yoki token orqali saqlaymiz",
        "HTTPS = HTTP + TLS: ma'lumot shifrlanadi, server sertifikat bilan tasdiqlanadi",
        "Spring: @PathVariable, @RequestParam, @RequestHeader, @RequestBody → ResponseEntity",
        "CORS — brauzer qoidasi; Spring Security bilan http.cors(...) orqali sozlanadi",
      ],
      vocab: [
        { en: 'request', uz: "so'rov" },
        { en: 'response', uz: 'javob' },
        { en: 'header', uz: "sarlavha (so'rov metadata'si)" },
        { en: 'body', uz: "so'rov/javob tanasi (asosiy ma'lumot)" },
        { en: 'stateless', uz: 'holatni saqlamaydigan' },
        { en: 'encrypted', uz: 'shifrlangan' },
        { en: 'handshake', uz: "ulanishdan oldingi 'salomlashish' bosqichi" },
        { en: 'origin', uz: 'manba (protokol + domen + port)' },
      ],
      lesson: [
        {
          title: 'Request va response anatomiyasi',
          body: `Har bir HTTP almashinuv ikki qismdan iborat: client **request** yuboradi, server **response** qaytaradi. HTTP/1.1'da bu oddiy matn, HTTP/2'da binary freymlar, lekin tuzilishi bir xil.

- **Start line**: request'da \`POST /api/v1/tasks HTTP/1.1\`, response'da \`HTTP/1.1 201 Created\`
- **Header'lar**: \`Key: Value\` ko'rinishidagi metadata — \`Content-Type\`, \`Authorization\`, \`Cookie\`, \`Cache-Control\`
- **Bo'sh qator**: header'lar tugaganini bildiradi
- **Body**: ixtiyoriy; JSON API'larda odatda \`application/json\`

Intervyuda "What does a request contain?" deb so'rashsa, shu to'rt qismni sanab, bitta aniq misol ayting. Misol bilan javob har doim kuchliroq eshitiladi.`,
          code: `POST /api/v1/tasks HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

{"title": "Buy milk", "priority": "high"}

HTTP/1.1 201 Created
Location: /api/v1/tasks/42
Content-Type: application/json

{"id": 42, "title": "Buy milk", "priority": "high", "done": false}`,
          lang: 'http',
        },
        {
          title: "Spring Boot request'ni qanday o'qiydi",
          body: `Spring MVC'da request'ning har bir qismini controller metodi parametriga **annotatsiya** orqali olasiz. Spring o'zi parse qiladi va kerakli turga o'giradi (masalan \`"7"\` → \`Long 7\`). Body'dagi JSON'ni **Jackson** kutubxonasi Java obyektiga (odatda \`record\`) aylantiradi, javobda esa teskarisini qiladi.

- \`@PathVariable\` — URL ichidagi qism: \`/tasks/{id}\`
- \`@RequestParam\` — query parametr: \`?status=done\`
- \`@RequestHeader\` — header qiymati
- \`@RequestBody\` — JSON body → Java obyekt
- \`ResponseEntity<T>\` — status code, header'lar va body'ni to'liq boshqarish

\`@RestController\` = \`@Controller\` + \`@ResponseBody\`: metod qaytargan obyekt to'g'ridan-to'g'ri JSON bo'lib ketadi, HTML sahifa qidirilmaydi.`,
          code: `@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getOne(
            @PathVariable Long id,
            @RequestHeader(value = "Accept-Language", defaultValue = "en") String lang) {
        return ResponseEntity.ok(taskService.findById(id));
    }

    @GetMapping
    public List<TaskResponse> list(@RequestParam(required = false) String status) {
        return taskService.findAll(status); // 200 OK by default
    }

    @PostMapping
    public ResponseEntity<TaskResponse> create(@RequestBody CreateTaskRequest request) {
        TaskResponse created = taskService.create(request);
        return ResponseEntity
                .created(URI.create("/api/v1/tasks/" + created.id())) // 201 + Location
                .body(created);
    }
}`,
          lang: 'java',
        },
        {
          title: 'Stateless: holatni qayerda saqlaymiz?',
          body: `HTTP stateless — server bitta request'dan keyingisiga hech narsa "eslab" qolmaydi. Lekin foydalanuvchi login qilgan bo'lishi kerak. Shuning uchun har request o'zi bilan "men kimman" degan ma'lumotni olib keladi:

1. **Session + cookie**: server session'ni saqlaydi (Spring'da \`HttpSession\`), brauzer esa faqat \`JSESSIONID\` cookie'ni yuboradi. Bir nechta server bo'lsa, session'ni Redis'ga chiqarish kerak (Spring Session).
2. **Token (JWT)**: foydalanuvchi ma'lumoti imzolangan token ichida; client uni \`Authorization: Bearer ...\` header'da yuboradi. Server hech narsa saqlamaydi — Spring Security'da \`SessionCreationPolicy.STATELESS\`.

Stateless server'ni scale qilish oson: istalgan instansiya istalgan request'ni qabul qila oladi, load balancer'ga "sticky session" kerak emas.`,
        },
        {
          title: 'HTTPS va TLS: production\'da qayerda?',
          body: `HTTPS = HTTP + TLS. Ulanishdan oldin **TLS handshake** bo'ladi: server sertifikatini ko'rsatadi, brauzer uni tekshiradi (ishonchli CA imzolaganmi, domen mosmi), keyin ikki tomon shifrlash kalitini kelishadi. Shundan so'ng barcha header va body shifrlangan holda yuradi.

Production'da TLS odatda Spring ilovasining o'zida emas, oldidagi **Nginx / load balancer**'da tugatiladi (TLS termination). Spring Boot ichki tarmoqda oddiy HTTP'ni 8080 portda oladi. Bunda ilova asl protokol va IP'ni bilishi uchun \`X-Forwarded-*\` header'larini o'qishi kerak — \`server.forward-headers-strategy: framework\`.

Intervyuda: "TLS is usually terminated at the load balancer, and the app reads X-Forwarded headers" — bu jumla tajribali eshitiladi.`,
          code: `# application.yml
server:
  port: 8080
  forward-headers-strategy: framework   # trust X-Forwarded-Proto / X-Forwarded-For

# Rarely: TLS directly in Spring Boot (e.g. no proxy in front)
# server:
#   port: 8443
#   ssl:
#     key-store: classpath:keystore.p12
#     key-store-password: changeit
#     key-store-type: PKCS12`,
          lang: 'yaml',
        },
        {
          title: 'CORS va preflight: Spring Security bilan sozlash',
          body: `**Origin** = protokol + domen + port. \`http://localhost:5173\` (Vite) va \`http://localhost:8080\` (Spring) — **turli** origin. Brauzer boshqa origin'ga "oddiy bo'lmagan" request yuborishdan oldin (masalan \`Authorization\` header yoki \`application/json\` body bilan POST) avval **OPTIONS preflight** yuboradi. Server javobida mos \`Access-Control-Allow-*\` header'lar bo'lmasa, brauzer asl request'ni yubormaydi va console'da CORS xatosi chiqadi.

Muhim nuqtalar:
- CORS — **brauzer** qoidasi. curl va Postman'da CORS yo'q, shuning uchun u server himoyasini (auth) almashtirmaydi.
- Spring Security ishlatsangiz, CORS'ni Security ichida yoqing: \`http.cors(Customizer.withDefaults())\`. Aks holda preflight OPTIONS request'i auth tekshiruvida 401 bo'lib qoladi.
- \`allowCredentials(true)\` bo'lsa, origin'ga \`*\` qo'yib bo'lmaydi — aniq domenlarni yozing.`,
          code: `@Configuration
public class CorsConfig {

    @Bean
    CorsConfigurationSource corsConfigurationSource(
            @Value("\${app.cors.allowed-origins}") List<String> allowedOrigins) {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(allowedOrigins); // e.g. https://app.example.com
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);
        config.setMaxAge(1800L); // browser caches the preflight for 30 min

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}

// In SecurityFilterChain:
// http.cors(Customizer.withDefaults())  -> uses the bean above`,
          lang: 'java',
        },
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
          a: "CORS is a browser security rule for requests to another origin. An origin is the protocol, domain, and port together. By default, the browser blocks the frontend from reading a response from another origin. The server must allow it with headers like Access-Control-Allow-Origin. In Spring Boot, I configure a CorsConfigurationSource bean and enable it in the Spring Security config.",
          uz: "CORS — boshqa origin'ga yuboriladigan request'lar uchun brauzer xavfsizlik qoidasi. Origin — protokol, domen va port birgalikda. Default holatda brauzer frontend'ga boshqa origin'dan kelgan response'ni o'qishga ruxsat bermaydi. Server buni Access-Control-Allow-Origin kabi header'lar bilan ruxsat berishi kerak. Spring Boot'da men CorsConfigurationSource bean'ini sozlayman va uni Spring Security konfiguratsiyasida yoqaman.",
          example: `// Spring Boot 3 + Spring Security
@Bean
CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("https://my-frontend.com"));
    config.setAllowedMethods(List.of("GET", "POST", "PATCH", "DELETE"));
    config.setAllowedHeaders(List.of("Authorization", "Content-Type"));

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/api/**", config);
    return source;
}

// SecurityFilterChain: http.cors(Customizer.withDefaults())`,
          followUp: 'What is a preflight request?',
          level: 'middle',
        },
      ],
      resources: [
        { title: 'MDN — An overview of HTTP', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview' },
        { title: 'MDN — HTTP headers', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers' },
        { title: 'MDN — CORS', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS' },
        { title: 'Spring Security — CORS', url: 'https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html' },
        { title: 'Spring Guides — Building a RESTful Web Service', url: 'https://spring.io/guides/gs/rest-service' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'be-http-methods-status',
      title: 'HTTP methods, status codes, idempotency',
      days: [36, 42],
      summary: "HTTP method server'ga nima qilishni aytadi: GET o'qiydi, POST yaratadi, PUT to'liq almashtiradi, PATCH qisman o'zgartiradi, DELETE o'chiradi. Status code natijani aytadi: 2xx — muvaffaqiyat, 3xx — redirect, 4xx — client xatosi, 5xx — server xatosi. Eng ko'p so'raladigani — 401 va 403 farqi: 401 — siz kimligingiz noma'lum (login qilinmagan), 403 — kimligingiz ma'lum, lekin ruxsat yo'q. Idempotent method'ni bir necha marta chaqirsangiz ham natija (server holati) bir xil bo'ladi: GET, PUT, DELETE idempotent, POST esa yo'q. Spring Boot'da har bir method'ga o'z annotatsiyasi bor (@GetMapping, @PostMapping...), status code esa ResponseEntity, @ResponseStatus yoki exception handler orqali qaytariladi.",
      keyPoints: [
        "GET — o'qish, POST — yaratish, PUT — to'liq almashtirish, PATCH — qisman o'zgartirish, DELETE — o'chirish",
        "200 OK, 201 Created, 204 No Content",
        "400 Bad Request, 401 Unauthorized (login yo'q), 403 Forbidden (ruxsat yo'q), 404 Not Found",
        "409 Conflict — holat bilan to'qnashuv (masalan, email band), 422 — ma'lumot formati to'g'ri, lekin validation'dan o'tmadi",
        "500 Internal Server Error — server'dagi kutilmagan xato",
        "Idempotent: GET, PUT, DELETE (HEAD, OPTIONS ham). POST idempotent emas",
        "Safe method (GET, HEAD) — server holatini o'zgartirmaydi",
        "Spring: ResponseEntity.created(...) → 201, ResponseEntity.noContent() → 204, ResponseStatusException → istalgan xato kodi",
      ],
      vocab: [
        { en: 'idempotent', uz: "bir necha marta bajarilsa ham natija o'zgarmaydigan" },
        { en: 'status code', uz: 'holat kodi' },
        { en: 'unauthorized', uz: "autentifikatsiyadan o'tmagan" },
        { en: 'forbidden', uz: "taqiqlangan, ruxsat yo'q" },
        { en: 'conflict', uz: "to'qnashuv" },
        { en: 'retry', uz: 'qayta urinish' },
        { en: 'replace', uz: 'almashtirish' },
        { en: 'entry point', uz: "kirish nuqtasi (Spring Security'da 401 qaytaruvchi komponent)" },
      ],
      lesson: [
        {
          title: "HTTP method'lar → Spring annotatsiyalari",
          body: `Spring MVC'da har bir HTTP method uchun alohida annotatsiya bor. Ular \`@RequestMapping(method = ...)\` ning qisqa shakli:

- \`@GetMapping\` — o'qish, odatda **200 OK**
- \`@PostMapping\` — yaratish, **201 Created** + \`Location\` header
- \`@PutMapping\` — butun resursni almashtirish, **200** yoki **204**
- \`@PatchMapping\` — qisman yangilash, **200** (yangilangan obyekt bilan)
- \`@DeleteMapping\` — o'chirish, **204 No Content**

Default holatda Spring muvaffaqiyatli metod uchun 200 qaytaradi. Boshqa kod kerak bo'lsa — \`ResponseEntity\` yoki \`@ResponseStatus\` ishlating.`,
          code: `@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    @GetMapping("/{id}")                       // 200
    public TaskResponse get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping                               // 201 + Location
    public ResponseEntity<TaskResponse> create(@Valid @RequestBody CreateTaskRequest req) {
        TaskResponse created = service.create(req);
        return ResponseEntity.created(URI.create("/api/v1/tasks/" + created.id())).body(created);
    }

    @PutMapping("/{id}")                       // full replace
    public TaskResponse replace(@PathVariable Long id, @Valid @RequestBody ReplaceTaskRequest req) {
        return service.replace(id, req);
    }

    @PatchMapping("/{id}")                     // partial update
    public TaskResponse patch(@PathVariable Long id, @RequestBody PatchTaskRequest req) {
        return service.patch(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)     // 204
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}`,
          lang: 'java',
        },
        {
          title: 'Xato status kodlarini qaytarish',
          body: `Xato holatlari uchun controller'da \`if\` yozib \`ResponseEntity.status(404)\` qaytarish mumkin, lekin bu tez orada tartibsiz bo'lib ketadi. Yaxshiroq yo'l — **exception tashlash** va uni bir joyda status code'ga aylantirish:

1. \`ResponseStatusException\` — tez yechim: \`throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found")\`
2. O'z exception'ingiz + \`@RestControllerAdvice\` — katta loyihalar uchun eng toza yo'l (batafsil "Error handling" mavzusida)
3. Spring o'zi ham ba'zi kodlarni qaytaradi: noto'g'ri JSON → 400, qo'llab-quvvatlanmagan method → 405, noto'g'ri \`Content-Type\` → 415

Service qatlami HTTP haqida bilmasligi kerak: u \`NotFoundException\` tashlaydi, uni 404'ga aylantirish — web qatlamning ishi.`,
          code: `// 1) Quick: in the service or controller
Task task = repository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

// 2) Clean: domain exception + one global handler
public class EmailAlreadyUsedException extends RuntimeException {
    public EmailAlreadyUsedException(String email) {
        super("Email is already used: " + email);
    }
}

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(EmailAlreadyUsedException.class)
    public ProblemDetail conflict(EmailAlreadyUsedException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage()); // 409
    }
}`,
          lang: 'java',
        },
        {
          title: "401 va 403 Spring Security'da",
          body: `Spring Security bu ikki holatni ikki xil komponent bilan boshqaradi:

- **401** — \`AuthenticationEntryPoint\`: foydalanuvchi aniqlanmagan (token yo'q, noto'g'ri yoki muddati o'tgan), lekin himoyalangan resursga kirmoqchi.
- **403** — \`AccessDeniedHandler\`: foydalanuvchi aniqlangan, lekin roli yetmaydi (\`hasRole("ADMIN")\` yoki \`@PreAuthorize\` o'tmadi).

**Tuzoq:** JWT bilan ishlaganda \`formLogin\` va \`httpBasic\` o'chirilgan bo'ladi. Shunda default entry point **403** qaytaradi, 401 emas! Shuning uchun entry point'ni aniq sozlang: \`HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)\`. Bu intervyuda "real tajriba" ko'rsatadigan detal.`,
          code: `@Bean
SecurityFilterChain api(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/v1/auth/**").permitAll()
            .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")   // else 403
            .anyRequest().authenticated())                          // else 401
        .exceptionHandling(e -> e
            .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
            .accessDeniedHandler((req, res, ex) -> res.sendError(HttpServletResponse.SC_FORBIDDEN)));
    return http.build();
}`,
          lang: 'java',
        },
        {
          title: 'Idempotency va xavfsiz retry',
          body: `Tarmoq uzilsa, client javobni olmay qoladi va request'ni qayta yuboradi. GET, PUT, DELETE uchun bu xavfsiz — natija o'zgarmaydi. POST uchun esa xavfli: ikkita buyurtma yoki ikki marta to'lov bo'lishi mumkin.

Yechim — **Idempotency-Key**:
1. Client har bir "amal" uchun bitta UUID yaratadi va uni header'da yuboradi.
2. Server kalitni natija bilan birga saqlaydi (jadvalda kalit ustuni **unique**).
3. Shu kalit yana kelsa, server yangi yozuv yaratmaydi — saqlangan javobni qaytaradi.

Unique constraint muhim: ikkita bir xil request bir vaqtda kelsa ham, database faqat bittasini o'tkazadi.`,
          code: `@PostMapping("/api/v1/payments")
public ResponseEntity<PaymentResponse> pay(
        @RequestHeader("Idempotency-Key") UUID key,
        @Valid @RequestBody PaymentRequest request) {

    return idempotencyRepository.findById(key)
            .map(saved -> ResponseEntity.ok(saved.toResponse()))        // repeat: same result
            .orElseGet(() -> {
                PaymentResponse result = paymentService.pay(request, key); // saves key in the same transaction
                return ResponseEntity.status(HttpStatus.CREATED).body(result);
            });
}

// SQL: CREATE TABLE idempotency_keys (key UUID PRIMARY KEY, response JSONB, created_at TIMESTAMPTZ);`,
          lang: 'java',
        },
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
        {
          q: 'How do you return 201 Created or 204 No Content in Spring Boot?',
          a: "For 201, I return ResponseEntity.created with the URI of the new resource, and the new object in the body. The URI goes into the Location header. For 204, I can return ResponseEntity.noContent().build(), or put @ResponseStatus(HttpStatus.NO_CONTENT) on a void method. For errors, I throw an exception and a global handler turns it into the right status code.",
          uz: "201 uchun yangi resursning URI'si bilan ResponseEntity.created'ni qaytaraman, body'da esa yangi obyekt bo'ladi. URI Location header'iga tushadi. 204 uchun ResponseEntity.noContent().build() qaytarishim yoki void metodga @ResponseStatus(HttpStatus.NO_CONTENT) qo'yishim mumkin. Xatolar uchun exception tashlayman, global handler esa uni to'g'ri status code'ga aylantiradi.",
          example: `return ResponseEntity.created(URI.create("/api/v1/tasks/" + task.id())).body(task); // 201

return ResponseEntity.noContent().build(); // 204`,
          level: 'junior',
        },
      ],
      resources: [
        { title: 'MDN — HTTP request methods', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods' },
        { title: 'MDN — HTTP response status codes', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status' },
        { title: 'MDN — Idempotent', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Idempotent' },
        { title: 'Spring Framework — Annotated Controllers', url: 'https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller.html' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'be-rest-design',
      title: 'REST API dizayni (va GraphQL)',
      days: [37, 38, 41, 42],
      summary: "REST — API'ni resurslar atrofida qurish uslubi. Har bir resursning URL'i bor (/tasks, /tasks/7), amalni esa HTTP method belgilaydi. URL'da otlar (noun) va ko'plik ishlatiladi, fe'l (verb) emas: POST /tasks, /createTask emas. Ko'p ma'lumot qaytadigan endpoint'larda pagination (limit/offset yoki cursor), filtering va sorting query parametrlar orqali qilinadi. API o'zgarganda eski client'lar buzilmasligi uchun versioning ishlatiladi (/api/v1). Spring Boot'da API shartnomasi — DTO (Java record), entity emas; pagination uchun Spring Data'ning Pageable'i, xato formati uchun ProblemDetail (RFC 9457), hujjat uchun OpenAPI (springdoc) ishlatiladi. GraphQL — alternativa: bitta endpoint, client o'ziga kerakli maydonlarni o'zi so'raydi.",
      keyPoints: [
        "Resurs nomi — ko'plikdagi ot: /users, /boards, /tasks",
        "Ichma-ich resurs: GET /boards/3/tasks",
        "Pagination: ?page=2&limit=20 (offset) yoki ?cursor=abc (cursor-based)",
        "Filtering va sorting: ?status=done&sort=-createdAt",
        "Versioning: /api/v1/... yoki header orqali",
        "REST stateless — har request mustaqil",
        "Spring: entity'ni emas, DTO (record) qaytaring; Pageable + max-page-size",
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
        { en: 'DTO (data transfer object)', uz: "faqat ma'lumot tashish uchun obyekt" },
      ],
      lesson: [
        {
          title: 'Resurs, URL va controller tuzilishi',
          body: `REST dizaynini **resurslardan** boshlang: tizimda qanday "narsalar" bor? Task manager uchun: \`users\`, \`boards\`, \`tasks\`. Har biri — ko'plikdagi ot. Amalni URL emas, **HTTP method** aytadi.

Ichma-ich resurs faqat haqiqiy "egalik" bo'lsa ishlatiladi: board'ning task'larini olish \`GET /boards/3/tasks\`. Lekin bitta task bilan ishlash uchun qisqa yo'l yetarli: \`PATCH /tasks/42\` — chuqur ichma-ichlik (\`/users/1/boards/3/tasks/42\`) URL'ni uzun va mo'rt qiladi.

Spring'da bitta resurs = bitta controller. Umumiy prefiks \`@RequestMapping\` bilan klass darajasida yoziladi.`,
          code: `@RestController
@RequestMapping("/api/v1/boards/{boardId}/tasks")
public class BoardTaskController {

    private final TaskService taskService;

    public BoardTaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping      // GET  /api/v1/boards/3/tasks
    public PageResponse<TaskResponse> list(@PathVariable Long boardId, Pageable pageable) {
        return taskService.list(boardId, pageable);
    }

    @PostMapping     // POST /api/v1/boards/3/tasks
    public ResponseEntity<TaskResponse> create(@PathVariable Long boardId,
                                               @Valid @RequestBody CreateTaskRequest request) {
        TaskResponse created = taskService.create(boardId, request);
        return ResponseEntity.created(URI.create("/api/v1/tasks/" + created.id())).body(created);
    }
}

// Single task operations live in TaskController: /api/v1/tasks/{id}`,
          lang: 'java',
        },
        {
          title: 'Entity emas, DTO qaytaring',
          body: `Eng ko'p uchraydigan xato — JPA \`@Entity\`'ni to'g'ridan-to'g'ri controller'dan qaytarish. Muammolari:

- **Ma'lumot sizishi**: \`User\` entity'sidagi \`passwordHash\` JSON'ga chiqib ketadi
- **Lazy loading**: Jackson lazy bog'lanishni o'qimoqchi bo'ladi → \`LazyInitializationException\` yoki yashirin qo'shimcha SQL so'rovlar
- **Cheksiz rekursiya**: \`Board → tasks → board → tasks...\`
- **Mo'rt shartnoma**: database ustunini o'zgartirsangiz, API ham o'zgarib, frontend buziladi

Yechim — **DTO**. Java 21'da DTO uchun \`record\` ideal: qisqa, immutable, Jackson bilan to'g'ridan-to'g'ri ishlaydi. Kiruvchi (request) va chiquvchi (response) DTO'larni alohida qiling.`,
          code: `// Incoming: what the client may send
public record CreateTaskRequest(
        @NotBlank @Size(max = 100) String title,
        @Pattern(regexp = "low|medium|high") String priority) {
}

// Outgoing: what the client will see
public record TaskResponse(Long id, String title, String priority, boolean done, Instant createdAt) {

    public static TaskResponse from(Task task) {
        return new TaskResponse(task.getId(), task.getTitle(), task.getPriority(),
                task.isDone(), task.getCreatedAt());
    }
}`,
          lang: 'java',
        },
        {
          title: 'Pagination: Spring Data Pageable',
          body: `Spring Data controller'ga \`Pageable\` parametrini o'zi yasab beradi: \`?page=0&size=20&sort=createdAt,desc\`. E'tibor bering: Spring'da **page 0'dan** boshlanadi.

Muhim sozlamalar:
- \`spring.data.web.pageable.max-page-size\` — maksimal \`size\` (default 2000 — juda katta, 100 qiling)
- \`@PageableDefault\` — parametr kelmasa default qiymat

\`Page<T>\`'ni to'g'ridan-to'g'ri JSON qilib qaytarish tavsiya etilmaydi (ichki tuzilishi barqaror emas). O'zingizning kichik \`PageResponse\` record'ingizni qaytaring.

Katta va tez o'zgaradigan jadvallar uchun **cursor (keyset) pagination** yaxshiroq: \`WHERE id < :lastId ORDER BY id DESC LIMIT 20\` — OFFSET kabi minglab qatorni o'tkazib yubormaydi.`,
          code: `public record PageResponse<T>(List<T> items, int page, int size, long total) {
    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(page.getContent(), page.getNumber(), page.getSize(), page.getTotalElements());
    }
}

public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByBoardId(Long boardId, Pageable pageable);
}

// Service
public PageResponse<TaskResponse> list(Long boardId, Pageable pageable) {
    return PageResponse.from(taskRepository.findByBoardId(boardId, pageable).map(TaskResponse::from));
}

// Controller parameter:
// @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable

// application.yml
// spring.data.web.pageable.max-page-size: 100`,
          lang: 'java',
        },
        {
          title: 'Filtering va sorting — faqat ruxsat etilgan maydonlar',
          body: `Filter va sort query parametrlardan keladi, ya'ni foydalanuvchi ularni xohlagancha o'zgartira oladi. Qoidalar:

- Filter qiymatini kerakli turga o'giring: \`@RequestParam(required = false) TaskStatus status\` — noto'g'ri qiymat avtomatik 400 bo'ladi
- Sort maydonlarini **whitelist** qiling. Aks holda \`?sort=passwordHash\` yoki mavjud bo'lmagan maydon \`PropertyReferenceException\` → 500 beradi
- SQL'ni hech qachon string'larni qo'shib yasamang — Spring Data / JPA parametrlarni o'zi xavfsiz bog'laydi`,
          code: `private static final Set<String> SORTABLE = Set.of("createdAt", "title", "priority");

@GetMapping
public PageResponse<TaskResponse> list(@PathVariable Long boardId,
                                       @RequestParam(required = false) TaskStatus status,
                                       Pageable pageable) {
    for (Sort.Order order : pageable.getSort()) {
        if (!SORTABLE.contains(order.getProperty())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Cannot sort by " + order.getProperty());
        }
    }
    return taskService.list(boardId, status, pageable);
}`,
          lang: 'java',
        },
        {
          title: 'Versioning, xato formati va OpenAPI hujjati',
          body: `Uchta narsa API'ni "professional" qiladi:

1. **Versioning**: hamma route \`/api/v1\` ostida. Yangi versiya faqat buzuvchi o'zgarishda (maydonni o'chirish, turini o'zgartirish). Yangi ixtiyoriy maydon qo'shish — backward compatible.
2. **Bir xil xato formati**: Spring 6'dagi \`ProblemDetail\` (RFC 9457 standarti): \`type\`, \`title\`, \`status\`, \`detail\` + o'z maydonlaringiz. Frontend har doim bir xil shakldagi xatoni kutadi.
3. **Hujjat**: \`springdoc-openapi\` qo'shsangiz, controller'lardan avtomatik OpenAPI spec va Swagger UI (\`/swagger-ui.html\`) yaratiladi. Frontend dasturchi API'ni shu yerdan ko'radi, hatto TypeScript turlarini ham generatsiya qilish mumkin.`,
          code: `<!-- pom.xml -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.6.0</version>
</dependency>

# application.yml — enables ProblemDetail for Spring's built-in errors
spring:
  mvc:
    problemdetails:
      enabled: true

// Error body the frontend receives (application/problem+json):
{
  "type": "about:blank",
  "title": "Not Found",
  "status": 404,
  "detail": "Task 42 not found",
  "instance": "/api/v1/tasks/42"
}`,
          lang: 'xml / yaml / json',
        },
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
          example: "POST   /api/v1/auth/register\nPOST   /api/v1/auth/login\nGET    /api/v1/boards\nPOST   /api/v1/boards\nGET    /api/v1/boards/{boardId}/tasks?status=todo&page=0\nPOST   /api/v1/boards/{boardId}/tasks\nPATCH  /api/v1/tasks/{taskId}\nDELETE /api/v1/tasks/{taskId}",
          level: 'middle',
        },
        {
          q: 'Why should you not return JPA entities directly from a controller?',
          a: "Because the entity is the database model, not the API contract. If I return it, I can leak fields like the password hash, and Jackson can trigger lazy loading or infinite recursion. Also, every database change becomes an API change. So I map entities to DTOs, usually Java records, and return only the fields the client needs.",
          uz: "Chunki entity — bu database modeli, API shartnomasi emas. Agar uni qaytarsam, password hash kabi maydonlar sizib chiqishi mumkin, Jackson esa lazy loading yoki cheksiz rekursiyani keltirib chiqarishi mumkin. Bundan tashqari, database'dagi har bir o'zgarish API o'zgarishiga aylanadi. Shuning uchun entity'larni DTO'ga, odatda Java record'ga aylantiraman va faqat client'ga kerakli maydonlarni qaytaraman.",
          followUp: 'Where do you do the mapping — in the controller or in the service?',
          level: 'middle',
        },
      ],
      resources: [
        { title: 'roadmap.sh — Backend', url: 'https://roadmap.sh/backend' },
        { title: 'Spring Data JPA — Paging and Sorting', url: 'https://docs.spring.io/spring-data/jpa/reference/repositories/query-methods-details.html#repositories.special-parameters' },
        { title: 'springdoc-openapi', url: 'https://springdoc.org/' },
        { title: 'GraphQL — Learn', url: 'https://graphql.org/learn/' },
        { title: 'System Design Primer (REST vs RPC)', url: 'https://github.com/donnemartin/system-design-primer' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'be-auth',
      title: 'Authentication, authorization, JWT vs session',
      days: [39, 41, 42],
      summary: "Authentication — siz kimligingizni tekshirish (login), authorization — nima qila olishingizni tekshirish (ruxsatlar, rollar). Parollar hech qachon ochiq saqlanmaydi: bcrypt kabi sekin, salt'li algoritm bilan hash qilinadi (Spring'da BCryptPasswordEncoder). Login'dan keyin foydalanuvchini eslab qolishning ikki asosiy usuli bor: session (server holatni saqlaydi, client'da faqat session id cookie) va JWT (server imzolagan token, server hech narsa saqlamaydi). JWT odatda qisqa muddatli access token + uzoq muddatli refresh token juftligida ishlatiladi. Spring Boot'da bularning hammasini Spring Security boshqaradi: SecurityFilterChain bean'i qoidalarni belgilaydi, JWT filter esa har request'da token'ni tekshirib SecurityContext'ga foydalanuvchini qo'yadi. OAuth — boshqa servis (Google, GitHub) orqali kirish uchun standart.",
      keyPoints: [
        "Authentication — kimligingiz, authorization — nima qila olishingiz",
        "Parollarni bcrypt (yoki argon2) bilan hash qilamiz — Spring'da PasswordEncoder bean'i",
        "Session: server session'ni saqlaydi, client'da httpOnly cookie'da session id",
        "JWT: header.payload.signature — imzolangan, lekin shifrlanmagan; payload'ga maxfiy narsa qo'ymang",
        "Access token qisqa (masalan 15 daqiqa), refresh token uzoq va server'da bekor qilinishi mumkin",
        "Token'ni httpOnly cookie'da saqlash XSS'dan himoya qiladi; localStorage'ni JS o'qiy oladi",
        "Spring Security: SecurityFilterChain + OncePerRequestFilter (JWT) + SecurityContextHolder",
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
        { en: 'principal', uz: "hozirgi aniqlangan foydalanuvchi (Spring Security'da)" },
      ],
      lesson: [
        {
          title: 'Katta rasm: Spring Security request yo\'lida',
          body: `Spring Security — bu controller'dan **oldin** turadigan filter'lar zanjiri. Har bir request shu zanjirdan o'tadi:

1. JWT filter (siz yozasiz) \`Authorization\` header'ini o'qiydi va token to'g'ri bo'lsa foydalanuvchini \`SecurityContextHolder\`'ga qo'yadi.
2. \`AuthorizationFilter\` qoidalarni tekshiradi: bu URL uchun login kerakmi? qaysi rol kerak?
3. Foydalanuvchi aniqlanmagan bo'lsa → **401**, roli yetmasa → **403**. Hammasi joyida bo'lsa → \`DispatcherServlet\` → controller.

\`SecurityContextHolder\` default holatda \`ThreadLocal\`'da saqlanadi: har request o'z thread'ida ishlaydi, shuning uchun bir foydalanuvchining ma'lumoti boshqasiga aralashmaydi. Controller'da hozirgi foydalanuvchini \`@AuthenticationPrincipal\` bilan olasiz.`,
          code: `@GetMapping("/api/v1/me")
public UserResponse me(@AuthenticationPrincipal Long userId) {
    // principal was set by our JWT filter (see section 4)
    return userService.getProfile(userId);
}`,
          lang: 'java',
        },
        {
          title: 'Parollarni saqlash: PasswordEncoder',
          body: `Parol hech qachon ochiq saqlanmaydi va hech qachon log'ga yozilmaydi. **bcrypt** uchta sababga ko'ra yaxshi:

- har bir parolga tasodifiy **salt** qo'shadi — bir xil parollar har xil hash beradi, "rainbow table" ishlamaydi
- ataylab **sekin** (cost/strength parametri) — brute-force juda qimmatga tushadi
- salt hash ichida saqlanadi — alohida ustun kerak emas

SHA-256 yoki MD5 parol uchun yaramaydi: ular juda **tez**, GPU sekundiga milliardlab variantni sinay oladi.

Spring'da \`PasswordEncoder\` bean'ini bir marta e'lon qilasiz va hamma joyda inject qilasiz. Login'da hash'ni qayta hisoblamaysiz — \`matches()\` ishlatasiz.`,
          code: `@Bean
PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12); // strength 12 ≈ 250 ms per hash
}

@Service
public class UserService {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository users, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User register(RegisterRequest req) {
        if (users.existsByEmail(req.email())) {
            throw new EmailAlreadyUsedException(req.email()); // -> 409
        }
        String hash = passwordEncoder.encode(req.password()); // $2a$12$...salt+hash
        return users.save(new User(req.email(), hash, Role.USER));
    }
}`,
          lang: 'java',
        },
        {
          title: 'Login: parolni tekshirish va JWT yaratish',
          body: `Login oqimi:

1. Client \`POST /api/v1/auth/login\` ga email va parol yuboradi (faqat HTTPS orqali).
2. Server foydalanuvchini email bo'yicha topadi va \`passwordEncoder.matches()\` bilan tekshiradi.
3. Xato bo'lsa — **401** va umumiy xabar: "Invalid email or password". "Bunday email yo'q" demang — aks holda hujumchi qaysi email'lar ro'yxatdan o'tganini bilib oladi.
4. To'g'ri bo'lsa — qisqa muddatli **access token** (JSON body'da) va uzoq muddatli **refresh token** (httpOnly cookie'da) qaytaradi.

JWT yaratish uchun ko'pincha \`jjwt\` kutubxonasi ishlatiladi. Secret kod ichida emas, environment variable'da turadi va kamida 256 bit (32 bayt) bo'lishi kerak.`,
          code: `@Service
public class JwtService {
    private final SecretKey key;
    private final Duration accessTtl = Duration.ofMinutes(15);

    public JwtService(@Value("\${app.jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String createAccessToken(User user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("role", user.getRole().name())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(accessTtl)))
                .signWith(key)
                .compact();
    }

    public Claims parse(String token) { // throws JwtException if invalid or expired
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }
}

@Transactional(readOnly = true)
public LoginResult login(LoginRequest req) {
    User user = users.findByEmail(req.email())
            .filter(u -> passwordEncoder.matches(req.password(), u.getPasswordHash()))
            .orElseThrow(() -> new BadCredentialsException("Invalid email or password")); // -> 401
    return new LoginResult(jwtService.createAccessToken(user), refreshTokens.issue(user));
}`,
          lang: 'java',
        },
        {
          title: "Har bir request'da JWT'ni tekshirish",
          body: `Token'ni tekshiradigan kod — \`OncePerRequestFilter\`. U header'dan token'ni oladi, imzosi va muddatini tekshiradi, keyin \`SecurityContext\`'ga \`Authentication\` obyektini qo'yadi. Token yo'q yoki noto'g'ri bo'lsa, filter **xato qaytarmaydi** — shunchaki context'ni bo'sh qoldiradi. Keyin Spring Security o'zi qaror qiladi: ochiq route bo'lsa o'tkazadi, himoyalangan bo'lsa 401 qaytaradi.

\`SecurityFilterChain\` konfiguratsiyasida:
- \`csrf\` o'chiriladi — token header'da kelgani uchun CSRF xavfi yo'q (cookie'ga tayanilsa — CSRF kerak!)
- \`STATELESS\` — Spring session yaratmaydi
- filter \`UsernamePasswordAuthenticationFilter\`'dan **oldin** qo'shiladi
- entry point aniq 401 qaytaradi`,
          code: `public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwtService;

    public JwtAuthFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null && header.startsWith("Bearer ")) {
            try {
                Claims claims = jwtService.parse(header.substring(7));
                var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + claims.get("role", String.class)));
                var auth = new UsernamePasswordAuthenticationToken(
                        Long.valueOf(claims.getSubject()), null, authorities);
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (JwtException | IllegalArgumentException e) {
                SecurityContextHolder.clearContext(); // invalid or expired -> anonymous
            }
        }
        chain.doFilter(request, response);
    }
}

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain api(HttpSecurity http, JwtService jwtService) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .anyRequest().authenticated())
            .exceptionHandling(e -> e.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
            .addFilterBefore(new JwtAuthFilter(jwtService), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}`,
          lang: 'java',
        },
        {
          title: 'Refresh token, httpOnly cookie va logout',
          body: `Access token qisqa yashaydi (15 daqiqa) — o'g'irlansa ham zarari cheklangan. Uni frontend xotirada (Pinia store) saqlaydi. **Refresh token** esa uzoq yashaydi (7–30 kun) va faqat \`httpOnly; Secure; SameSite\` cookie'da turadi — JavaScript uni o'qiy olmaydi.

Oqim:
1. Access token muddati o'tdi → API **401** qaytardi.
2. Frontend \`POST /api/v1/auth/refresh\` chaqiradi; brauzer cookie'ni o'zi qo'shadi.
3. Server refresh token'ni database'dan tekshiradi, eskisini bekor qilib **yangisini** beradi (rotation) va yangi access token qaytaradi.
4. **Logout**: refresh token database'dan o'chiriladi va cookie \`maxAge(0)\` bilan tozalanadi.

JWT'ni "darhol" bekor qilib bo'lmaydi — shuning uchun access token qisqa bo'ladi. Zarur bo'lsa, \`jti\` bo'yicha Redis'da denylist yuritiladi.`,
          code: `@PostMapping("/api/v1/auth/refresh")
public ResponseEntity<TokenResponse> refresh(@CookieValue("refreshToken") String refreshToken) {
    RotatedTokens tokens = authService.rotate(refreshToken); // 401 if unknown/expired/revoked

    ResponseCookie cookie = ResponseCookie.from("refreshToken", tokens.refreshToken())
            .httpOnly(true)
            .secure(true)
            .sameSite("Strict")
            .path("/api/v1/auth")
            .maxAge(Duration.ofDays(7))
            .build();

    return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, cookie.toString())
            .body(new TokenResponse(tokens.accessToken()));
}

@PostMapping("/api/v1/auth/logout")
public ResponseEntity<Void> logout(@CookieValue(value = "refreshToken", required = false) String token) {
    if (token != null) authService.revoke(token);
    ResponseCookie expired = ResponseCookie.from("refreshToken", "").path("/api/v1/auth").maxAge(0).build();
    return ResponseEntity.noContent().header(HttpHeaders.SET_COOKIE, expired.toString()).build();
}`,
          lang: 'java',
        },
        {
          title: 'Rollar va egalik: 403 qachon?',
          body: `Authorization ikki darajada bo'ladi:

- **Rol bo'yicha** (coarse-grained): "faqat ADMIN". URL qoidasi (\`hasRole("ADMIN")\`) yoki metod ustida \`@PreAuthorize\`.
- **Egalik bo'yicha** (fine-grained): "faqat task egasi o'zgartira oladi". Bu biznes qoida — service ichida tekshiriladi, chunki task'ni database'dan o'qish kerak.

\`AccessDeniedException\` tashlansa, Spring Security 403 qaytaradi. Diqqat: agar sizning \`@RestControllerAdvice\`'ingizda \`@ExceptionHandler(Exception.class)\` bo'lsa, u \`AccessDeniedException\`'ni ham "yutib" 500 qaytaradi — unga alohida handler qo'shing.

Ba'zi API'lar begona resurs uchun 403 emas, **404** qaytaradi — shunda hujumchi bunday id mavjudligini ham bilmaydi.`,
          code: `@DeleteMapping("/api/v1/admin/users/{id}")
@PreAuthorize("hasRole('ADMIN')")             // not admin -> 403
public void deleteUser(@PathVariable Long id) { ... }

@Transactional
public void deleteTask(Long taskId, Long currentUserId) {
    Task task = tasks.findById(taskId)
            .orElseThrow(() -> new NotFoundException("Task " + taskId + " not found"));
    if (!task.getOwnerId().equals(currentUserId)) {
        throw new AccessDeniedException("Not your task"); // -> 403
    }
    tasks.delete(task);
}`,
          lang: 'java',
        },
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
          a: "We never store passwords as plain text. We hash passwords with bcrypt. Bcrypt adds a random salt and is slow on purpose, so brute-force attacks take a long time. In Spring Boot, I create a BCryptPasswordEncoder bean. At login, I compare the password with the saved hash using passwordEncoder.matches.",
          uz: "Parollarni hech qachon ochiq matn sifatida saqlamaymiz. Parollarni bcrypt bilan hash qilamiz. Bcrypt tasodifiy salt qo'shadi va ataylab sekin ishlaydi, shuning uchun brute-force hujumlar uzoq vaqt oladi. Spring Boot'da BCryptPasswordEncoder bean'ini yarataman. Login paytida parolni saqlangan hash bilan passwordEncoder.matches orqali solishtiraman.",
          example: `@Bean
PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12);
}

// register
String hash = passwordEncoder.encode(request.password());

// login
boolean ok = passwordEncoder.matches(request.password(), user.getPasswordHash());`,
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
          example: `// jjwt 0.12
String token = Jwts.builder()
        .subject(user.getId().toString())
        .claim("role", user.getRole().name())
        .expiration(Date.from(Instant.now().plus(Duration.ofMinutes(15))))
        .signWith(key)
        .compact();

Claims claims = Jwts.parser().verifyWith(key).build()
        .parseSignedClaims(token).getPayload();`,
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
          example: `ResponseCookie cookie = ResponseCookie.from("refreshToken", token)
        .httpOnly(true)
        .secure(true)
        .sameSite("Strict")
        .path("/api/v1/auth")
        .maxAge(Duration.ofDays(7))
        .build();

return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(new TokenResponse(accessToken));`,
          level: 'middle',
        },
        {
          q: 'What is OAuth?',
          a: "OAuth 2.0 is a standard that lets an app get limited access to a user's account on another service. For example, 'Login with Google'. The user logs in on Google, not on our site, so we never see the Google password. Google gives our app a token with only the permissions the user allowed.",
          uz: "OAuth 2.0 — ilovaga foydalanuvchining boshqa servisdagi akkauntiga cheklangan kirish huquqini beruvchi standart. Masalan, 'Login with Google'. Foydalanuvchi bizning saytda emas, Google'da login qiladi, shuning uchun biz Google parolini hech qachon ko'rmaymiz. Google ilovamizga faqat foydalanuvchi ruxsat bergan huquqlar bilan token beradi.",
          followUp: 'What is the difference between OAuth and OpenID Connect?',
          level: 'middle',
        },
        {
          q: 'How does Spring Security check a JWT on every request?',
          a: "I add a custom filter that extends OncePerRequestFilter. It reads the Bearer token from the Authorization header, checks the signature and the expiry, and puts an Authentication object into the SecurityContext. Then the authorization rules in the SecurityFilterChain decide if the request can go to the controller. If there is no valid user, Spring Security returns 401.",
          uz: "OncePerRequestFilter'dan meros olgan o'z filter'imni qo'shaman. U Authorization header'idan Bearer token'ni o'qiydi, imzo va muddatni tekshiradi va SecurityContext'ga Authentication obyektini qo'yadi. Keyin SecurityFilterChain'dagi authorization qoidalari request controller'ga o'tishi mumkinmi-yo'qmi hal qiladi. To'g'ri foydalanuvchi bo'lmasa, Spring Security 401 qaytaradi.",
          followUp: 'Why do you disable CSRF protection for a JWT API?',
          level: 'middle',
        },
      ],
      resources: [
        { title: 'OWASP — Password Storage Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html' },
        { title: 'JWT.io — Introduction', url: 'https://jwt.io/introduction' },
        { title: 'Spring Security — Servlet Architecture', url: 'https://docs.spring.io/spring-security/reference/servlet/architecture.html' },
        { title: 'Baeldung — Spring Security with JWT', url: 'https://www.baeldung.com/spring-security-oauth-jwt' },
        { title: 'OAuth 2.0', url: 'https://oauth.net/2/' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'be-filters-interceptors',
      title: "Middleware Spring'da: Filter, Interceptor, AOP",
      days: [40, 41],
      summary: "Express'dagi middleware g'oyasi — 'request handler'ga yetguncha (yoki undan keyin) ishlaydigan kod' — Spring'da uch xil qatlamda bor. Servlet Filter eng tashqi qatlam: Tomcat darajasida, DispatcherServlet'dan oldin ishlaydi va har qanday request'ni (hatto static fayl yoki 404'ni) ko'radi; logging, request id, CORS, rate limiting, auth shu yerda. Spring Security ham aslida bitta katta filter zanjiri. HandlerInterceptor — Spring MVC ichida, DispatcherServlet bilan controller orasida ishlaydi va qaysi controller metodi chaqirilayotganini biladi. AOP aspect esa HTTP bilan bog'liq emas: istalgan Spring bean metodini (service, repository) o'rab oladi — @Transactional ham shunday ishlaydi. Tartib: Filter → (Security filter'lar) → DispatcherServlet → Interceptor.preHandle → AOP proxy → controller.",
      keyPoints: [
        "Filter (jakarta.servlet) — eng tashqi qatlam, DispatcherServlet'dan oldin, har request uchun",
        "OncePerRequestFilter — bitta request uchun faqat bir marta ishlashni kafolatlaydi (forward/error dispatch'da qayta emas)",
        "Spring Security = DelegatingFilterProxy → FilterChainProxy → SecurityFilterChain(lar)",
        "Filter tartibi: @Order yoki FilterRegistrationBean.setOrder; Security zanjiri default -100",
        "HandlerInterceptor: preHandle (false → to'xtatadi), postHandle, afterCompletion; WebMvcConfigurer'da ro'yxatga olinadi",
        "AOP (@Aspect, @Around) — HTTP'dan mustaqil, istalgan bean metodi uchun (timing, audit, @Transactional)",
        "Filter ichidagi exception @RestControllerAdvice'ga yetib bormaydi",
      ],
      vocab: [
        { en: 'filter', uz: "filtr (request'ni o'tkazuvchi/to'xtatuvchi qatlam)" },
        { en: 'interceptor', uz: "ushlab qoluvchi (controller atrofidagi qatlam)" },
        { en: 'aspect', uz: "kesib o'tuvchi vazifa moduli (AOP)" },
        { en: 'cross-cutting concern', uz: "ko'p joyga tegishli umumiy vazifa (log, xavfsizlik)" },
        { en: 'chain', uz: 'zanjir' },
        { en: 'proxy', uz: "o'rinbosar obyekt (asl obyektni o'rab oladi)" },
        { en: 'order', uz: 'tartib' },
        { en: 'pointcut', uz: "aspect qayerda ishlashini belgilovchi ifoda" },
      ],
      lesson: [
        {
          title: "Express middleware → Spring'dagi uch qatlam",
          body: `Node/Express'da hamma narsa \`app.use((req, res, next) => ...)\` edi. Spring'da bu g'oya **uch qatlamga** bo'lingan, chunki ular har xil narsani "ko'radi":

1. **Servlet Filter** — Tomcat darajasi. Faqat \`HttpServletRequest\`/\`Response\`'ni biladi. Har qanday request uchun ishlaydi.
2. **HandlerInterceptor** — Spring MVC darajasi. Qaysi controller metodi (\`HandlerMethod\`) chaqirilishini biladi.
3. **AOP aspect** — bean metodi darajasi. HTTP'ni umuman bilmaydi; service va repository metodlarini ham o'rab oladi.

Request yo'li:

\`Tomcat → Filter'lar (Security zanjiri ham shu yerda) → DispatcherServlet → Interceptor.preHandle → Controller (AOP proxy orqali) → Interceptor.postHandle → afterCompletion → Filter'lar (qaytish yo'li)\`

Qoida: HTTP darajasidagi umumiy ish (log, request id, auth, CORS, rate limit) → **Filter**. Controller'ga bog'liq ish (handler annotatsiyasini o'qish, locale) → **Interceptor**. Biznes metodlar atrofidagi ish (vaqt o'lchash, audit, tranzaksiya) → **AOP**.`,
        },
        {
          title: 'Servlet Filter va OncePerRequestFilter',
          body: `Filter — \`jakarta.servlet.Filter\` interfeysi. Express'dagi \`next()\` o'rniga \`chain.doFilter(request, response)\` chaqiriladi. Uni chaqirmasangiz — zanjir to'xtaydi (masalan, 429 javob qaytarganda).

Amalda ko'pincha Spring'ning \`OncePerRequestFilter\`'idan meros olinadi. Nima uchun? Bitta request ichida forward yoki error dispatch bo'lsa, oddiy filter **ikki marta** ishlashi mumkin. \`OncePerRequestFilter\` buni oldini oladi va qulay \`shouldNotFilter()\` metodini beradi.

\`@Component\` qo'yilgan filter'ni Spring Boot **avtomatik** barcha URL'lar uchun ro'yxatga oladi. \`chain.doFilter\` atrofidagi \`try/finally\` — Express'dagi "response tugagandan keyin" logikasining o'rnini bosadi.`,
          code: `@Component
@Order(Ordered.HIGHEST_PRECEDENCE) // run first, so every log line has the request id
public class RequestIdFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RequestIdFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String requestId = Optional.ofNullable(request.getHeader("X-Request-Id"))
                .orElse(UUID.randomUUID().toString());
        MDC.put("requestId", requestId);              // every log line in this thread gets it
        response.setHeader("X-Request-Id", requestId);
        long start = System.currentTimeMillis();
        try {
            chain.doFilter(request, response);        // like next() in Express
        } finally {
            log.info("{} {} -> {} ({} ms)", request.getMethod(), request.getRequestURI(),
                    response.getStatus(), System.currentTimeMillis() - start);
            MDC.clear();                              // threads are reused by Tomcat!
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return request.getRequestURI().startsWith("/actuator");
    }
}`,
          lang: 'java',
        },
        {
          title: "Tartib va Spring Security filter zanjiri qayerda",
          body: `Filter'lar tartibini \`@Order\` (kichik raqam = oldinroq) yoki \`FilterRegistrationBean.setOrder()\` belgilaydi. \`FilterRegistrationBean\` filter'ni faqat ma'lum URL'larga bog'lash uchun ham kerak.

**Spring Security qayerda?** U Tomcat'ga bitta filter bo'lib ko'rinadi — \`DelegatingFilterProxy\` (default order **-100**). U ichkarida \`FilterChainProxy\`'ga, u esa mos \`SecurityFilterChain\`'ga ishni beradi. Zanjir ichida o'nlab filter bor: \`CorsFilter\`, \`CsrfFilter\`, \`LogoutFilter\`, \`UsernamePasswordAuthenticationFilter\`, \`ExceptionTranslationFilter\`, \`AuthorizationFilter\`...

Shundan ikkita amaliy xulosa:
- Request id / logging filter'ini Security'dan **oldin** qo'ying (\`HIGHEST_PRECEDENCE\`), shunda 401 javoblar ham log'ga tushadi.
- JWT filter'ni Security zanjiri **ichiga** qo'shing (\`http.addFilterBefore(...)\`). Agar uni \`@Component\` qilsangiz, Boot uni oddiy servlet filter sifatida **ham** ro'yxatga oladi — natijada u Security'dan tashqarida ham ishlaydi. Buning oldini olish uchun uni \`new\` bilan yarating yoki \`FilterRegistrationBean.setEnabled(false)\` qiling.`,
          code: `// Option A: register a plain filter only for some URLs, with an explicit order
@Bean
FilterRegistrationBean<LoginRateLimitFilter> loginRateLimit() {
    FilterRegistrationBean<LoginRateLimitFilter> reg = new FilterRegistrationBean<>(new LoginRateLimitFilter());
    reg.addUrlPatterns("/api/v1/auth/login");
    reg.setOrder(Ordered.HIGHEST_PRECEDENCE + 10); // before Spring Security (-100)
    return reg;
}

// Option B: a filter that belongs INSIDE the security chain
http.addFilterBefore(new JwtAuthFilter(jwtService), UsernamePasswordAuthenticationFilter.class);

// Debug tip: see the whole security chain at startup
// logging.level.org.springframework.security: DEBUG`,
          lang: 'java',
        },
        {
          title: 'HandlerInterceptor: controller atrofida',
          body: `Interceptor \`DispatcherServlet\` controller'ni topgandan **keyin** ishlaydi, shuning uchun u \`HandlerMethod\` orqali metod va uning annotatsiyalarini ko'ra oladi. Uchta "ilgak" bor:

- \`preHandle\` — controller'dan oldin. \`false\` qaytarsa, controller chaqirilmaydi.
- \`postHandle\` — controller muvaffaqiyatli tugagach (exception bo'lsa chaqirilmaydi). \`@RestController\` uchun javob allaqachon yozilgan bo'lishi mumkin, shuning uchun bu yerda body'ni o'zgartirmang.
- \`afterCompletion\` — har doim, xato bo'lsa ham (\`ex\` parametri bilan). Tozalash va o'lchash uchun.

Interceptor \`WebMvcConfigurer.addInterceptors\` orqali ro'yxatga olinadi va URL pattern'lar bilan cheklanadi.`,
          code: `@Component
public class AuditInterceptor implements HandlerInterceptor {
    private static final Logger log = LoggerFactory.getLogger(AuditInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) {
        if (handler instanceof HandlerMethod hm && hm.hasMethodAnnotation(Audited.class)) {
            log.info("AUDIT {} -> {}.{}", req.getRequestURI(),
                    hm.getBeanType().getSimpleName(), hm.getMethod().getName());
        }
        return true; // false = stop here, the controller is not called
    }

    @Override
    public void afterCompletion(HttpServletRequest req, HttpServletResponse res, Object handler, Exception ex) {
        if (ex != null) log.warn("Request failed: {}", ex.getMessage());
    }
}

@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final AuditInterceptor auditInterceptor;

    public WebConfig(AuditInterceptor auditInterceptor) {
        this.auditInterceptor = auditInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(auditInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/v1/auth/**");
    }
}`,
          lang: 'java',
        },
        {
          title: 'AOP aspect: HTTP\'dan tashqaridagi "middleware"',
          body: `AOP (Aspect-Oriented Programming) — **cross-cutting concern**'larni (ko'p joyda takrorlanadigan ish) bitta joyga yig'ish. Spring bean'ni **proxy** bilan o'rab oladi: siz \`taskService.create()\` ni chaqirasiz, aslida avval proxy ishlaydi, keyin asl metod.

Siz allaqachon AOP ishlatyapsiz: \`@Transactional\`, \`@PreAuthorize\`, \`@Cacheable\`, \`@Async\` — hammasi proxy orqali ishlaydi.

Muhim cheklov — **self-invocation**: klass ichida \`this.otherMethod()\` chaqirilsa, proxy chetlab o'tiladi va aspect (yoki \`@Transactional\`) **ishlamaydi**. Bu intervyuda ko'p so'raladigan tuzoq.

Qachon nima:
- Har bir HTTP request uchun → Filter
- Controller annotatsiyasiga qarab → Interceptor
- Service/repository metodlari uchun, HTTP'siz ham (scheduled job, Kafka listener) → AOP`,
          code: `// pom.xml: spring-boot-starter-aop

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface LogExecutionTime { }

@Aspect
@Component
public class ExecutionTimeAspect {
    private static final Logger log = LoggerFactory.getLogger(ExecutionTimeAspect.class);

    @Around("@annotation(com.example.tasks.common.LogExecutionTime)")
    public Object measure(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.nanoTime();
        try {
            return pjp.proceed(); // call the real method
        } finally {
            long ms = (System.nanoTime() - start) / 1_000_000;
            log.info("{} took {} ms", pjp.getSignature().toShortString(), ms);
        }
    }
}

@Service
public class ReportService {
    @LogExecutionTime
    public Report build(Long boardId) { ... }
}`,
          lang: 'java',
        },
      ],
      questions: [
        {
          q: 'What is the Spring equivalent of Express middleware?',
          a: "There are three options, on different levels. A servlet Filter runs first, before the DispatcherServlet, for every request. A HandlerInterceptor runs inside Spring MVC, around the controller method. An AOP aspect wraps any Spring bean method, not only HTTP. For things like logging, auth, and rate limiting I usually use a filter.",
          uz: "Uchta variant bor, ular har xil darajada. Servlet Filter birinchi bo'lib, DispatcherServlet'dan oldin, har bir request uchun ishlaydi. HandlerInterceptor Spring MVC ichida, controller metodi atrofida ishlaydi. AOP aspect esa faqat HTTP emas, istalgan Spring bean metodini o'rab oladi. Logging, auth va rate limiting kabi ishlar uchun odatda filter ishlataman.",
          level: 'junior',
        },
        {
          q: 'What is the difference between a Filter and a HandlerInterceptor?',
          a: "A Filter is part of the Servlet API and runs before Spring MVC, so it sees every request, even static files and errors. It only knows the raw request and response. An interceptor runs after the DispatcherServlet has found the controller, so it knows which handler method will run. It has three hooks: preHandle, postHandle, and afterCompletion.",
          uz: "Filter Servlet API'ning bir qismi va Spring MVC'dan oldin ishlaydi, shuning uchun u har bir request'ni, hatto static fayllar va xatolarni ham ko'radi. U faqat xom request va response'ni biladi. Interceptor esa DispatcherServlet controller'ni topgandan keyin ishlaydi, shuning uchun qaysi handler metodi ishlashini biladi. Uning uchta ilgagi bor: preHandle, postHandle va afterCompletion.",
          followUp: 'Where would you put a JWT check, and why?',
          level: 'middle',
        },
        {
          q: 'What is OncePerRequestFilter and why do we use it?',
          a: "It is a base class from Spring that guarantees the filter runs only once per request. A normal filter can run again on a forward or an error dispatch. With OncePerRequestFilter, I just implement doFilterInternal. It also has shouldNotFilter, so I can skip some URLs easily.",
          uz: "Bu Spring'dagi bazaviy klass bo'lib, filter bitta request uchun faqat bir marta ishlashini kafolatlaydi. Oddiy filter forward yoki error dispatch'da qayta ishlashi mumkin. OncePerRequestFilter bilan men faqat doFilterInternal'ni yozaman. Unda shouldNotFilter ham bor, shuning uchun ba'zi URL'larni osongina o'tkazib yubora olaman.",
          example: `public class JwtAuthFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res,
                                    FilterChain chain) throws ServletException, IOException {
        // read the token, set the SecurityContext ...
        chain.doFilter(req, res); // continue, like next()
    }
}`,
          level: 'junior',
        },
        {
          q: 'How do you control the order of filters?',
          a: "I use the @Order annotation or a FilterRegistrationBean with setOrder. A lower number runs earlier. The Spring Security filter chain has the order minus one hundred by default. So if I want a request id filter to run before security, I give it the highest precedence. For filters inside the security chain, I use addFilterBefore or addFilterAfter.",
          uz: "@Order annotatsiyasi yoki setOrder'li FilterRegistrationBean ishlataman. Kichikroq raqam oldinroq ishlaydi. Spring Security filter zanjirining tartibi default holatda minus yuz. Shuning uchun request id filter'i security'dan oldin ishlashini istasam, unga eng yuqori ustuvorlik beraman. Security zanjiri ichidagi filter'lar uchun addFilterBefore yoki addFilterAfter ishlataman.",
          level: 'middle',
        },
        {
          q: 'Where does the Spring Security filter chain sit in a request?',
          a: "It sits in the servlet filter chain, before the DispatcherServlet. Tomcat sees one filter, the DelegatingFilterProxy. It passes the request to the FilterChainProxy, which picks the right SecurityFilterChain. Inside, many filters run: CORS, CSRF, authentication, exception translation, and authorization. Only if they all pass, the request reaches the controller.",
          uz: "U servlet filter zanjirida, DispatcherServlet'dan oldin turadi. Tomcat bitta filter'ni ko'radi — DelegatingFilterProxy. U request'ni FilterChainProxy'ga uzatadi, u esa mos SecurityFilterChain'ni tanlaydi. Ichkarida ko'p filter ishlaydi: CORS, CSRF, authentication, exception translation va authorization. Faqat ularning hammasidan o'tsa, request controller'ga yetadi.",
          level: 'middle',
        },
        {
          q: 'When would you use an AOP aspect instead of a filter?',
          a: "I use an aspect when the logic is about Java methods, not about HTTP. For example, measuring the time of service methods, audit logs, or retry logic. Aspects also work for scheduled jobs and message listeners, where there is no HTTP request. Spring itself uses AOP for @Transactional and @PreAuthorize.",
          uz: "Logika HTTP haqida emas, Java metodlari haqida bo'lsa, aspect ishlataman. Masalan, service metodlarining vaqtini o'lchash, audit log'lar yoki retry logikasi. Aspect'lar HTTP request bo'lmagan scheduled job'lar va message listener'lar uchun ham ishlaydi. Spring o'zi ham @Transactional va @PreAuthorize uchun AOP ishlatadi.",
          followUp: 'Why does @Transactional not work when you call the method from the same class?',
          level: 'middle',
        },
        {
          q: 'What happens if an exception is thrown inside a filter?',
          a: "A filter runs before the DispatcherServlet, so @RestControllerAdvice does not catch its exceptions. The exception goes to the servlet container, and Spring Boot shows its default error response. So in a filter, I usually catch the error and write the response myself, for example status 401 or 429 with JSON. In Spring Security, the AuthenticationEntryPoint and AccessDeniedHandler do this job.",
          uz: "Filter DispatcherServlet'dan oldin ishlaydi, shuning uchun @RestControllerAdvice uning exception'larini ushlamaydi. Exception servlet konteyneriga ketadi va Spring Boot o'zining default xato javobini ko'rsatadi. Shuning uchun filter'da odatda xatoni o'zim ushlab, response'ni o'zim yozaman, masalan JSON bilan 401 yoki 429 status. Spring Security'da bu ishni AuthenticationEntryPoint va AccessDeniedHandler bajaradi.",
          level: 'middle',
        },
        {
          q: 'How would you write an auth check that returns 403 for non-admin users?',
          a: "For roles, I do not write my own filter. I use Spring Security rules. In the SecurityFilterChain, I can say requestMatchers for admin paths hasRole ADMIN. Or I put @PreAuthorize with hasRole ADMIN on the method and enable method security. If the user is logged in but not an admin, Spring Security returns 403.",
          uz: "Rollar uchun o'z filter'imni yozmayman. Spring Security qoidalaridan foydalanaman. SecurityFilterChain'da admin yo'llari uchun requestMatchers hasRole ADMIN deb yozishim mumkin. Yoki metodga hasRole ADMIN bilan @PreAuthorize qo'yib, method security'ni yoqaman. Foydalanuvchi login qilgan, lekin admin bo'lmasa, Spring Security 403 qaytaradi.",
          example: `.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
    .anyRequest().authenticated())

// or on a method (needs @EnableMethodSecurity)
@PreAuthorize("hasRole('ADMIN')")
public void deleteUser(Long id) { ... }`,
          level: 'junior',
        },
      ],
      resources: [
        { title: 'Spring Security — Servlet Architecture (filters)', url: 'https://docs.spring.io/spring-security/reference/servlet/architecture.html' },
        { title: 'Spring Framework — Interception (HandlerInterceptor)', url: 'https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-config/interceptors.html' },
        { title: 'Spring Framework — AOP with @AspectJ', url: 'https://docs.spring.io/spring-framework/reference/core/aop/ataspectj.html' },
        { title: 'Baeldung — HandlerInterceptors vs. Filters', url: 'https://www.baeldung.com/spring-mvc-handlerinterceptor-vs-filter' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'be-error-handling',
      title: 'Error handling, validation, logging, rate limiting',
      days: [40],
      summary: "Yaxshi API xatolarni bir joyda — Spring Boot'da @RestControllerAdvice klassida — qayta ishlaydi va client'ga aniq status code hamda tushunarli JSON (masalan, ProblemDetail) qaytaradi, lekin stack trace yoki ichki ma'lumotni oshkor qilmaydi. Input har doim server tomonda tekshiriladi (validation), chunki frontend tekshiruvini aylanib o'tish oson; Spring'da buning uchun Bean Validation (jakarta.validation: @NotBlank, @Size, @Email) va @Valid ishlatiladi. Logging muammoni topishga yordam beradi (SLF4J + Logback, MDC bilan request id), lekin log'ga parol va token yozilmaydi. Rate limiting bitta client'dan keladigan request sonini cheklaydi va brute-force hamda suiiste'moldan himoya qiladi (429 Too Many Requests) — masalan Bucket4j bilan filter.",
      keyPoints: [
        "Markaziy error handler — @RestControllerAdvice + @ExceptionHandler, barcha xatolar bir xil formatda",
        "Client'ga stack trace ko'rsatmang; 500'da umumiy xabar qaytaring",
        "Input'ni server tomonda tekshiramiz — frontend'ga ishonib bo'lmaydi",
        "Bean Validation: DTO'da @NotBlank, @Size, @Email, @Pattern + controller'da @Valid → MethodArgumentNotValidException",
        "Log'ga parol, token, karta raqamini yozmang; SLF4J placeholder'lar ({}), MDC'da requestId",
        "Rate limiting → 429 Too Many Requests (ayniqsa /login uchun); Bucket4j, ko'p server bo'lsa Redis",
        "Filter ichidagi xato @RestControllerAdvice'ga yetib bormaydi — u yerda javobni o'zingiz yozasiz",
      ],
      vocab: [
        { en: 'validation', uz: "ma'lumotni tekshirish" },
        { en: 'sanitize', uz: 'tozalash (xavfli belgilarni olib tashlash)' },
        { en: 'stack trace', uz: "xato qayerda bo'lganini ko'rsatuvchi chaqiruvlar ro'yxati" },
        { en: 'rate limiting', uz: "so'rovlar sonini cheklash" },
        { en: 'brute-force', uz: "hamma variantni sinab ko'rish hujumi" },
        { en: 'log level', uz: 'log darajasi (info, warn, error)' },
        { en: 'leak', uz: "sizib chiqish (ma'lumot oshkor bo'lishi)" },
        { en: 'constraint', uz: 'cheklov (validation qoidasi)' },
      ],
      lesson: [
        {
          title: "Exception Spring'da qanday yo'l bosadi",
          body: `Controller yoki service'da exception tashlansa, u yuqoriga ko'tariladi va \`DispatcherServlet\`'ga yetadi. U \`HandlerExceptionResolver\`'lardan so'raydi: "Bu xatoni kim qayta ishlaydi?" Birinchi navbatda sizning \`@RestControllerAdvice\` klassingizdagi \`@ExceptionHandler\` metodlari tekshiriladi — eng **aniq** mos keladigan tur tanlanadi.

Hech kim ushlamasa → Spring Boot'ning \`/error\` sahifasi → 500.

Qatlamlar bo'yicha qoida:
- **Service** HTTP'ni bilmaydi: \`NotFoundException\`, \`EmailAlreadyUsedException\` kabi **domen** xatolarini tashlaydi
- **Advice** ularni status code'ga aylantiradi: 404, 409...
- **Filter** ichidagi xato advice'ga yetmaydi — chunki filter \`DispatcherServlet\`'dan oldin ishlaydi

Controller'larda \`try/catch\` yozmaysiz — kod toza qoladi.`,
        },
        {
          title: '@RestControllerAdvice + ProblemDetail',
          body: `Global handler barcha xatolarni bir xil formatda qaytaradi. Spring 6'dagi \`ProblemDetail\` (RFC 9457) — tayyor standart format: \`type\`, \`title\`, \`status\`, \`detail\`, \`instance\` va qo'shimcha maydonlar (\`setProperty\`).

Ketma-ketlik muhim emas — Spring eng aniq exception turini tanlaydi. Lekin oxirida \`Exception.class\` uchun "catch-all" handler bo'lishi kerak: u to'liq xatoni **log'ga** yozadi, client'ga esa faqat umumiy xabar qaytaradi.

Diqqat: catch-all \`AccessDeniedException\`'ni ham ushlab, 403 o'rniga 500 qaytaradi. Shuning uchun unga alohida handler qo'shing.`,
          code: `public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) { super(message); }
}

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(NotFoundException.class)
    public ProblemDetail notFound(NotFoundException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(EmailAlreadyUsedException.class)
    public ProblemDetail conflict(EmailAlreadyUsedException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ProblemDetail forbidden(AccessDeniedException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, "Access denied");
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail unexpected(Exception ex) {
        log.error("Unexpected error", ex); // full stack trace goes to the logs only
        return ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }
}`,
          lang: 'java',
        },
        {
          title: 'Bean Validation: @Valid va field xatolari',
          body: `Validation qoidalari DTO maydonlariga **annotatsiya** sifatida yoziladi (\`jakarta.validation.constraints\`). Kerakli dependency: \`spring-boot-starter-validation\`.

- \`@NotNull\`, \`@NotBlank\` (null emas va bo'sh/bo'shliq emas), \`@NotEmpty\`
- \`@Size(min, max)\`, \`@Min\`, \`@Max\`, \`@Positive\`
- \`@Email\`, \`@Pattern(regexp = ...)\`, \`@Past\`, \`@Future\`
- \`@Valid\` — ichma-ich obyekt yoki ro'yxat elementlarini ham tekshirish uchun

Controller parametriga \`@Valid\` qo'yilsa, Spring body'ni tekshiradi va xato bo'lsa \`MethodArgumentNotValidException\` tashlaydi (controller **chaqirilmaydi**). Advice uni \`{ "errors": { "title": "must not be blank" } }\` ko'rinishiga keltiradi — frontend har bir xatoni mos input ostida ko'rsata oladi.

Bundan tashqari: noto'g'ri JSON → \`HttpMessageNotReadableException\`, \`/tasks/abc\` → \`MethodArgumentTypeMismatchException\`. Ikkalasini ham 400'ga aylantiring.`,
          code: `public record CreateTaskRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 100, message = "Title must be at most 100 characters")
        String title,

        @Pattern(regexp = "low|medium|high", message = "Priority must be low, medium or high")
        String priority,

        @FutureOrPresent LocalDate dueDate) {
}

@PostMapping
public ResponseEntity<TaskResponse> create(@Valid @RequestBody CreateTaskRequest request) { ... }

// in GlobalExceptionHandler
@ExceptionHandler(MethodArgumentNotValidException.class)
public ProblemDetail validation(MethodArgumentNotValidException ex) {
    Map<String, String> errors = new LinkedHashMap<>();
    ex.getBindingResult().getFieldErrors()
            .forEach(e -> errors.putIfAbsent(e.getField(), e.getDefaultMessage()));
    ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Validation failed");
    pd.setProperty("errors", errors);
    return pd;
}

@ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class})
public ProblemDetail badRequest(Exception ex) {
    return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Malformed request");
}`,
          lang: 'java',
        },
        {
          title: 'Logging: SLF4J, darajalar va MDC',
          body: `Spring Boot'da default logging — **SLF4J** (interfeys) + **Logback** (implementatsiya). \`System.out.println\` ishlatmang.

- Darajalar: \`ERROR\` (kimdir aralashishi kerak), \`WARN\` (g'alati, lekin ishlayapti), \`INFO\` (muhim biznes hodisalar), \`DEBUG\` (faqat development)
- Placeholder ishlating: \`log.info("Task {} created", id)\` — string faqat kerak bo'lganda yasaladi
- Exception'ni **oxirgi argument** qilib bering: \`log.error("Failed to save task {}", id, ex)\` — stack trace ham yoziladi
- **MDC** (Mapped Diagnostic Context): filter'da \`MDC.put("requestId", ...)\` — shu request'ning barcha log qatorlarida id chiqadi. Production'da bitta xatoni minglab qatordan topishning asosiy yo'li
- Hech qachon yozmang: parol, token, \`Authorization\` header, karta raqami, to'liq shaxsiy ma'lumot

Production'da log'lar JSON formatida (Spring Boot 3.4+: \`logging.structured.format.console: ecs\`) yig'iladi — ELK, Loki yoki CloudWatch'da qidirish oson.`,
          code: `# application.yml
logging:
  level:
    root: INFO
    com.example.tasks: DEBUG
    org.hibernate.SQL: DEBUG          # show SQL in dev only
  pattern:
    level: "%5p [%X{requestId}]"      # add requestId from MDC to every line

// Java
private static final Logger log = LoggerFactory.getLogger(TaskService.class);

log.info("Task {} created by user {}", task.getId(), userId);
log.warn("Login failed for email {}", maskEmail(email));   // never log the password
log.error("Could not send notification for task {}", taskId, ex);`,
          lang: 'yaml / java',
        },
        {
          title: 'Rate limiting: Bucket4j bilan filter',
          body: `Rate limiting "token bucket" algoritmi bilan qulay: chelakda masalan 5 ta token bor, har request bitta token oladi, tokenlar vaqt o'tishi bilan to'ladi. Token qolmasa → **429 Too Many Requests** + \`Retry-After\` header.

Qayerda qilish mumkin:
1. **Ilova ichida**: Bucket4j + filter (quyidagi misol). Bitta server uchun xotirada.
2. **Ko'p server**: hisoblagichlar umumiy joyda bo'lishi kerak — Bucket4j'ning Redis integratsiyasi yoki Redis'da \`INCR\` + \`EXPIRE\`.
3. **Infratuzilmada**: Nginx (\`limit_req\`), API gateway (Spring Cloud Gateway), Cloudflare. Ko'pincha eng yaxshi joy shu.

Login endpoint'i uchun limitni IP **va** email bo'yicha qo'yish brute-force'ni yaxshiroq to'xtatadi. Proxy ortida bo'lsangiz, haqiqiy IP \`X-Forwarded-For\`'da bo'ladi — \`server.forward-headers-strategy\`'ni sozlang.`,
          code: `// pom.xml: com.bucket4j:bucket4j_jdk17-core
public class LoginRateLimitFilter extends OncePerRequestFilter {
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    private Bucket newBucket() {
        return Bucket.builder()
                .addLimit(limit -> limit.capacity(5).refillGreedy(5, Duration.ofMinutes(1)))
                .build();
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getRequestURI().equals("/api/v1/auth/login");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        Bucket bucket = buckets.computeIfAbsent(request.getRemoteAddr(), ip -> newBucket());
        if (bucket.tryConsume(1)) {
            chain.doFilter(request, response);
            return;
        }
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value()); // 429
        response.setHeader(HttpHeaders.RETRY_AFTER, "60");
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("{\\"error\\":\\"Too many login attempts\\"}");
    }
}`,
          lang: 'java',
        },
      ],
      questions: [
        {
          q: 'How do you handle errors in a Spring Boot API?',
          a: "I handle errors in one central place, a class with @RestControllerAdvice. In services, I throw custom exceptions, like NotFoundException. The advice has @ExceptionHandler methods that turn each exception into the right status code and a clean JSON body, for example ProblemDetail. For unexpected errors, I log the full stack trace and return a general 500 message to the client.",
          uz: "Xatolarni bitta markaziy joyda — @RestControllerAdvice'li klassda qayta ishlayman. Service'larda NotFoundException kabi o'z exception'larimni tashlayman. Advice'da @ExceptionHandler metodlari bor, ular har bir exception'ni to'g'ri status code va toza JSON body'ga, masalan ProblemDetail'ga aylantiradi. Kutilmagan xatolar uchun to'liq stack trace'ni log'ga yozaman va client'ga umumiy 500 xabarini qaytaraman.",
          example: `@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ProblemDetail notFound(NotFoundException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    }
}

// in a service
Task task = repository.findById(id)
        .orElseThrow(() -> new NotFoundException("Task " + id + " not found"));`,
          level: 'junior',
        },
        {
          q: 'How does an exception get from a service to @RestControllerAdvice? What about exceptions in filters?',
          a: "The exception goes up from the service to the controller and then to the DispatcherServlet. The DispatcherServlet asks its exception resolvers, and they find the best matching @ExceptionHandler method in the advice. But filters run before the DispatcherServlet, so their exceptions never reach the advice. In a filter, I handle the error myself and write the response, or I use the Spring Security entry point.",
          uz: "Exception service'dan controller'ga, keyin DispatcherServlet'ga ko'tariladi. DispatcherServlet o'zining exception resolver'laridan so'raydi, ular esa advice'dagi eng mos @ExceptionHandler metodini topadi. Lekin filter'lar DispatcherServlet'dan oldin ishlaydi, shuning uchun ularning exception'lari advice'ga hech qachon yetib bormaydi. Filter'da xatoni o'zim qayta ishlab, response'ni o'zim yozaman yoki Spring Security entry point'idan foydalanaman.",
          level: 'middle',
        },
        {
          q: 'Why do we validate input on the server if the frontend already validates it?',
          a: "We validate the input on the server side because the client can never be trusted. Anyone can send a request with curl or Postman and skip the frontend. Frontend validation is only for a better user experience. Server validation protects the data and the security of the system.",
          uz: "Input'ni server tomonda tekshiramiz, chunki client'ga hech qachon ishonib bo'lmaydi. Har kim curl yoki Postman bilan request yuborib, frontend'ni chetlab o'tishi mumkin. Frontend validation faqat yaxshiroq foydalanuvchi tajribasi uchun. Server validation esa ma'lumotlarni va tizim xavfsizligini himoya qiladi.",
          level: 'junior',
        },
        {
          q: 'How do you validate request data in Spring Boot?',
          a: "I use Bean Validation. I put annotations like @NotBlank, @Size, and @Email on the fields of a request DTO, usually a record. In the controller, I add @Valid before @RequestBody. If the data is wrong, Spring throws MethodArgumentNotValidException, and my global handler returns 400 with a map of field errors. The controller code runs only with valid data.",
          uz: "Bean Validation ishlataman. Request DTO'ning, odatda record'ning maydonlariga @NotBlank, @Size va @Email kabi annotatsiyalarni qo'yaman. Controller'da @RequestBody'dan oldin @Valid qo'shaman. Ma'lumot noto'g'ri bo'lsa, Spring MethodArgumentNotValidException tashlaydi, global handler'im esa maydon xatolari xaritasi bilan 400 qaytaradi. Controller kodi faqat to'g'ri ma'lumot bilan ishlaydi.",
          example: `public record CreateTaskRequest(
        @NotBlank @Size(max = 100) String title,
        @Pattern(regexp = "low|medium|high") String priority) {
}

@PostMapping("/tasks")
public ResponseEntity<TaskResponse> create(@Valid @RequestBody CreateTaskRequest request) {
    ...
}

// 400 response:
// { "title": "Bad Request", "status": 400, "detail": "Validation failed",
//   "errors": { "title": "must not be blank" } }`,
          level: 'junior',
        },
        {
          q: 'What is rate limiting and why do we need it?',
          a: "Rate limiting limits how many requests one client can send in a time window. For example, five login attempts per minute per IP address. It protects against brute-force attacks and stops one user from overloading the server. When the limit is reached, the server returns 429 Too Many Requests. In Spring Boot, I can do it with Bucket4j in a filter, or at the gateway level.",
          uz: "Rate limiting bitta client ma'lum vaqt oralig'ida qancha request yubora olishini cheklaydi. Masalan, bitta IP manzil uchun daqiqasiga besh marta login urinish. U brute-force hujumlardan himoya qiladi va bitta foydalanuvchi server'ni haddan tashqari yuklashini to'xtatadi. Limitga yetilganda server 429 Too Many Requests qaytaradi. Spring Boot'da buni filter ichida Bucket4j bilan yoki gateway darajasida qilishim mumkin.",
          example: `Bucket bucket = buckets.computeIfAbsent(request.getRemoteAddr(), ip ->
        Bucket.builder()
                .addLimit(limit -> limit.capacity(5).refillGreedy(5, Duration.ofMinutes(1)))
                .build());

if (!bucket.tryConsume(1)) {
    response.setStatus(429); // Too Many Requests
    return;
}
chain.doFilter(request, response);`,
          followUp: 'Where do you store the counters if you have many servers?',
          level: 'junior',
        },
        {
          q: 'What do you log in a backend, and what should you never log?',
          a: "I log requests with method, URL, status code, and response time. I log errors with the stack trace and a request id, so I can find the problem. In Spring Boot, I put the request id into the MDC, so it appears in every log line. I never log passwords, tokens, or card numbers. I use log levels like info, warn, and error, and structured JSON logs.",
          uz: "Request'larni method, URL, status code va javob vaqti bilan log qilaman. Xatolarni stack trace va request id bilan log qilaman, shunda muammoni topa olaman. Spring Boot'da request id'ni MDC'ga qo'yaman, shunda u har bir log qatorida chiqadi. Parol, token yoki karta raqamini hech qachon log qilmayman. info, warn va error kabi log darajalarini va structured JSON log'larni ishlataman.",
          level: 'junior',
        },
      ],
      resources: [
        { title: 'Spring Framework — Error Responses (ProblemDetail)', url: 'https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html' },
        { title: 'Spring Guides — Validating Form Input', url: 'https://spring.io/guides/gs/validating-form-input' },
        { title: 'Baeldung — Error Handling for REST with Spring', url: 'https://www.baeldung.com/exception-handling-for-rest-with-spring' },
        { title: 'Bucket4j — Reference', url: 'https://bucket4j.com/' },
        { title: 'OWASP — Logging Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'be-fullstack-flow',
      title: "Frontend ↔ Backend: so'rovning to'liq yo'li",
      days: [32, 36, 38],
      summary: "Full-stack dasturchidan eng ko'p kutiladigan narsa — butun zanjirni tushunish: foydalanuvchi Vue'dagi 'Save' tugmasini bosgandan to PostgreSQL'ga yozilib, ekranda yangi task paydo bo'lguncha nima bo'ladi. Qisqa yo'l: Vue komponent → Pinia store → axios (JSON + Authorization: Bearer) → brauzer (DNS, TCP, TLS, CORS preflight) → Tomcat thread → Spring Security filter zanjiri (JWT) → DispatcherServlet → @RestController → DTO + @Valid → @Service + @Transactional → JpaRepository → Hibernate SQL → PostgreSQL → entity → DTO → Jackson JSON → 201 Created → Vue state yangilanadi va qayta render bo'ladi. Xatolar ham shu yo'ldan qaytadi: 400 — forma ostida maydon xatolari, 401 — token yangilanadi yoki login sahifasiga yo'naltiriladi. Shu mavzuni bitta misol bilan ravon gapirib bera olsangiz, intervyuda kuchli taassurot qoldirasiz.",
      keyPoints: [
        "Bitta misolni (task yaratish) qatlamma-qatlam gapirib bera olish — eng kuchli javob",
        "Frontend: komponent forma → Pinia action → axios instance (baseURL, Bearer header, interceptor)",
        "Brauzer: DNS → TCP → TLS → (boshqa origin bo'lsa) OPTIONS preflight → asl POST",
        "Spring: Tomcat thread → Security filter'lar (JWT) → DispatcherServlet → Controller → Service → Repository",
        "@Valid DTO'ni tekshiradi; @Transactional bitta tranzaksiya ochadi; Hibernate SQL yozadi",
        "Javob: entity → DTO → Jackson JSON → 201 Created + Location",
        "Xatolar: 400 → forma xatolari, 401 → refresh/login, 403/404/500 → umumiy xabar",
        "Dev: Vite proxy (CORS yo'q) yoki CORS sozlamasi; prod: bitta domen + reverse proxy yoki aniq CORS origin",
        "Spring MVC — thread-per-request (Java 21'da virtual thread'lar); Node — bitta thread'li event loop",
      ],
      vocab: [
        { en: 'end to end', uz: "boshidan oxirigacha (to'liq zanjir)" },
        { en: 'layer', uz: 'qatlam' },
        { en: 'round trip', uz: "so'rov ketib, javob qaytguncha bo'lgan yo'l" },
        { en: 'interceptor', uz: "har bir so'rov/javobni ushlab qoluvchi funksiya" },
        { en: 'preflight', uz: "asosiy so'rovdan oldingi tekshiruv so'rovi (OPTIONS)" },
        { en: 'serialize', uz: "obyektni matnga (JSON) aylantirish" },
        { en: 'deserialize', uz: "matndan (JSON) obyekt yasash" },
        { en: 'proxy', uz: "vositachi server (so'rovni boshqa joyga uzatadi)" },
        { en: 'thread pool', uz: "thread'lar to'plami" },
      ],
      lesson: [
        {
          title: "Xarita: bitta harakat — \"task yaratish\"",
          body: `Intervyuda "Walk me through what happens when a user clicks Save" degan savol juda ko'p beriladi. Unga eng yaxshi javob — **bitta aniq misolni** qatlamma-qatlam gapirish. Bizning misol: foydalanuvchi board'da yangi task yaratadi.

1. **Vue komponent**: forma, \`v-model\`, oddiy frontend validation, "Save" tugmasi
2. **Pinia store / composable**: \`createTask()\` action — API chaqiradi va state'ni yangilaydi
3. **axios instance**: \`baseURL\`, JSON body, \`Authorization: Bearer <token>\` header
4. **Brauzer va tarmoq**: DNS → TCP → TLS → CORS preflight (OPTIONS) → asl POST
5. **Spring kirish eshigi**: Tomcat thread → Spring Security filter'lari (JWT tekshiruvi) → \`DispatcherServlet\` → \`@RestController\`
6. **Biznes va ma'lumot**: DTO + \`@Valid\` → \`@Service\` + \`@Transactional\` → \`JpaRepository\` → Hibernate SQL → PostgreSQL
7. **Javob**: entity → DTO → Jackson JSON → **201 Created**
8. **Yana Vue**: state yangilanadi → qayta render; xato bo'lsa 400 → forma xatolari, 401 → token refresh yoki login

Keyingi bo'limlar shu 8 qadamni kod bilan ochib beradi. Har birini 1–2 jumlada ayta olsangiz — siz "full-stack"siz.`,
        },
        {
          title: 'Vue tomoni: komponent, forma va Pinia store',
          body: `Komponent faqat **UI** bilan shug'ullanadi: forma holati, tugma \`disabled\` holati, xatolarni ko'rsatish. API chaqiruvi va umumiy ma'lumot (task'lar ro'yxati) **store**'da yashaydi — shunda boshqa komponentlar ham yangi task'ni darhol ko'radi.

Frontend validation (bo'sh title) — faqat **UX** uchun: foydalanuvchi server'ga bormasdan tez javob oladi. Haqiqiy himoya baribir backend'da.

E'tibor bering:
- \`@submit.prevent\` — sahifa qayta yuklanmaydi
- \`saving\` flag — ikki marta bosishdan himoya (ikkita bir xil task yaratilmaydi)
- server qaytargan 400 xatolari \`errors\` obyektiga tushadi va har bir input ostida ko'rinadi`,
          code: `<!-- CreateTaskForm.vue -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import axios from 'axios'
import { useTaskStore } from '@/stores/tasks'

const props = defineProps<{ boardId: number }>()
const store = useTaskStore()

const form = reactive({ title: '', priority: 'medium' })
const errors = ref<Record<string, string>>({})
const saving = ref(false)

async function save() {
  errors.value = {}
  if (!form.title.trim()) {
    errors.value.title = 'Title is required' // quick UX check only
    return
  }
  saving.value = true
  try {
    await store.createTask(props.boardId, { ...form })
    form.title = ''
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 400) {
      errors.value = e.response.data.errors ?? {} // { title: "..." } from Spring
    } else {
      errors.value.form = 'Something went wrong. Please try again.'
    }
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form @submit.prevent="save">
    <input v-model="form.title" placeholder="Task title" />
    <p v-if="errors.title" class="error">{{ errors.title }}</p>
    <select v-model="form.priority">
      <option>low</option><option>medium</option><option>high</option>
    </select>
    <p v-if="errors.form" class="error">{{ errors.form }}</p>
    <button :disabled="saving">{{ saving ? 'Saving…' : 'Save' }}</button>
  </form>
</template>

// stores/tasks.ts
export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])

  async function createTask(boardId: number, input: CreateTaskInput) {
    const { data } = await api.post<Task>(\`/boards/\${boardId}/tasks\`, input)
    tasks.value.unshift(data) // reactive -> the list re-renders
    return data
  }

  return { tasks, createTask }
})`,
          lang: 'vue / ts',
        },
        {
          title: 'axios instance: baseURL, Bearer token va interceptor\'lar',
          body: `Har bir komponentda \`axios.post('http://localhost:8080/...')\` yozish — xato. Bitta **axios instance** yaratiladi va hamma joyda ishlatiladi:

- \`baseURL\` env'dan olinadi (\`import.meta.env.VITE_API_URL\`) — dev va prod'da har xil
- **request interceptor** har so'rovga \`Authorization: Bearer <accessToken>\` qo'shadi
- **response interceptor** 401'ni ushlaydi: bir marta \`/auth/refresh\` chaqiradi (refresh token httpOnly cookie'da, brauzer o'zi yuboradi), yangi token bilan asl so'rovni **qayta** yuboradi. Refresh ham muvaffaqiyatsiz bo'lsa → logout va login sahifasiga redirect (qaytish manzili bilan)
- bir vaqtda bir nechta so'rov 401 olsa, refresh **bir marta** chaqirilishi kerak — shuning uchun umumiy \`refreshing\` promise

axios obyektni avtomatik JSON'ga aylantiradi va \`Content-Type: application/json\` qo'yadi. \`fetch\` ishlatsangiz, buni o'zingiz qilasiz: \`JSON.stringify\` va header.`,
          code: `// api/http.ts
import axios, { type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
  withCredentials: true, // send the httpOnly refresh-token cookie
  timeout: 10_000,
})

api.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.accessToken) config.headers.Authorization = \`Bearer \${auth.accessToken}\`
  return config
})

let refreshing: Promise<string> | null = null

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const isAuthCall = original?.url?.includes('/auth/')

    if (error.response?.status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true
      const auth = useAuthStore()
      try {
        refreshing ??= auth.refresh().finally(() => (refreshing = null)) // one refresh for many 401s
        const newToken = await refreshing
        original.headers.Authorization = \`Bearer \${newToken}\`
        return api(original) // retry the original request
      } catch {
        auth.logout()
        await router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
      }
    }
    return Promise.reject(error)
  },
)`,
          lang: 'ts',
        },
        {
          title: 'Brauzer va tarmoq: DNS, TCP, TLS, CORS preflight',
          body: `\`api.post(...)\` chaqirilgach, brauzer quyidagilarni qiladi:

1. **DNS**: \`api.example.com\` → IP manzil (avval cache'dan qidiradi)
2. **TCP** ulanish (3-way handshake), keyin **TLS handshake** — sertifikat tekshiriladi, shifrlash kaliti kelishiladi. Ulanish keyingi so'rovlar uchun qayta ishlatiladi (keep-alive, HTTP/2)
3. **CORS preflight**: frontend \`https://app.example.com\`, API \`https://api.example.com\` — turli origin. So'rovda \`Authorization\` header va JSON body bor, shuning uchun brauzer avval **OPTIONS** yuboradi. Spring (Security'dagi \`cors()\`) ruxsat header'lari bilan javob beradi. \`Access-Control-Max-Age\` tufayli preflight har safar takrorlanmaydi
4. **Asl POST** yuboriladi va javob kutiladi

Frontend va API bitta domenda bo'lsa (masalan \`example.com/api\` reverse proxy orqali) — preflight umuman bo'lmaydi.`,
          code: `### 1) Preflight (sent by the browser automatically)
OPTIONS /api/v1/boards/3/tasks HTTP/1.1
Host: api.example.com
Origin: https://app.example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: authorization, content-type

HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS
Access-Control-Allow-Headers: authorization, content-type
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 1800

### 2) The real request
POST /api/v1/boards/3/tasks HTTP/1.1
Host: api.example.com
Origin: https://app.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI3Ii...
Content-Type: application/json

{"title":"Prepare for the interview","priority":"high"}

### 3) The response
HTTP/1.1 201 Created
Location: /api/v1/tasks/42
Content-Type: application/json
Access-Control-Allow-Origin: https://app.example.com

{"id":42,"title":"Prepare for the interview","priority":"high","done":false,"createdAt":"2026-11-14T09:30:00Z"}`,
          lang: 'http',
        },
        {
          title: "Spring kirish eshigi: Tomcat thread → Security → DispatcherServlet → Controller",
          body: `So'rov server'ga yetganda:

1. **Tomcat** (Spring Boot ichidagi embedded server) so'rovni o'z thread pool'idan bitta **thread**'ga beradi (default max 200). Shu thread javob tayyor bo'lguncha shu so'rov bilan band.
2. **Spring Security filter zanjiri**: CORS filter → JWT filter (token imzosi va muddati tekshiriladi, \`SecurityContext\`'ga user qo'yiladi) → \`AuthorizationFilter\` (\`/api/**\` uchun login kerak). Token yo'q/eskirgan → shu yerning o'zida **401**, controller'gacha bormaydi.
3. **DispatcherServlet** URL va method bo'yicha mos controller metodini topadi.
4. Jackson JSON body'ni \`CreateTaskRequest\` record'iga aylantiradi (deserialize), \`@Valid\` uni tekshiradi. Xato → **400**, controller chaqirilmaydi.
5. Controller faqat "yo'l ko'rsatuvchi": parametrlarni olib, service'ga uzatadi va \`ResponseEntity\` qaytaradi.

**Node'dan kelganlar uchun:** Node.js'da bitta thread'li **event loop** bor — kod hech qachon kutmaydi, I/O tugaganda callback/promise davom etadi. Spring MVC esa **thread-per-request**: kod oddiy, ketma-ket (\`repository.save()\` thread'ni bloklaydi va kutadi), parallellikni ko'p thread beradi. Kamchiligi — har thread xotira oladi. Java 21'dagi **virtual thread**'lar (\`spring.threads.virtual.enabled: true\`) buni hal qiladi: minglab yengil thread, kod esa o'sha oddiy blocking uslubda qoladi. Reaktiv alternativa — Spring WebFlux (Node'ga o'xshash non-blocking model).`,
          code: `@RestController
@RequestMapping("/api/v1/boards/{boardId}/tasks")
public class BoardTaskController {

    private final TaskService taskService;

    public BoardTaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<TaskResponse> create(@PathVariable Long boardId,
                                               @Valid @RequestBody CreateTaskRequest request,
                                               @AuthenticationPrincipal Long userId) { // set by the JWT filter
        TaskResponse created = taskService.create(boardId, request, userId);
        return ResponseEntity
                .created(URI.create("/api/v1/tasks/" + created.id()))
                .body(created);
    }
}

public record CreateTaskRequest(
        @NotBlank(message = "Title is required") @Size(max = 100) String title,
        @Pattern(regexp = "low|medium|high") String priority) {
}

# application.yml (Java 21): each request runs on a cheap virtual thread
# spring.threads.virtual.enabled: true`,
          lang: 'java',
        },
        {
          title: 'Service, tranzaksiya, JPA va PostgreSQL',
          body: `Biznes logika **service**'da:

- \`@Transactional\` — Spring AOP proxy metod boshida tranzaksiya ochadi (connection pool'dan — HikariCP — bitta connection oladi), metod muvaffaqiyatli tugasa **COMMIT**, \`RuntimeException\` bo'lsa **ROLLBACK** qiladi
- Board bormi? Foydalanuvchi uning egasimi? Yo'q bo'lsa — \`NotFoundException\` (404) yoki \`AccessDeniedException\` (403)
- \`taskRepository.save(task)\` — Spring Data JPA o'zi yaratgan implementatsiya \`EntityManager.persist()\`'ni chaqiradi
- **Hibernate** entity'ni SQL \`INSERT\`'ga aylantiradi va parametrlarni xavfsiz bog'laydi (SQL injection yo'q). \`IDENTITY\` id strategiyasida INSERT darhol bajariladi va PostgreSQL yangi \`id\`'ni qaytaradi
- Metod entity'ni emas, **DTO**'ni qaytaradi — tranzaksiya yopilgandan keyin lazy maydonlar bilan muammo bo'lmaydi

\`spring.jpa.open-in-view: false\` qilib qo'ying — aks holda Hibernate session butun request davomida ochiq qoladi va yashirin SQL so'rovlar view/JSON qatlamida ham ishlayveradi.`,
          code: `@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final BoardRepository boardRepository;

    public TaskService(TaskRepository taskRepository, BoardRepository boardRepository) {
        this.taskRepository = taskRepository;
        this.boardRepository = boardRepository;
    }

    @Transactional
    public TaskResponse create(Long boardId, CreateTaskRequest request, Long userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new NotFoundException("Board " + boardId + " not found"));
        if (!board.getOwnerId().equals(userId)) {
            throw new AccessDeniedException("Not your board");
        }
        Task task = new Task(board, request.title().trim(),
                request.priority() == null ? "medium" : request.priority());
        return TaskResponse.from(taskRepository.save(task)); // entity -> DTO inside the transaction
    }
}

public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByBoardId(Long boardId, Pageable pageable);
}

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "board_id")
    private Board board;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false)
    private String priority;

    private boolean done;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    protected Task() { } // for JPA

    public Task(Board board, String title, String priority) {
        this.board = board;
        this.title = title;
        this.priority = priority;
    }
    // getters ...
}

-- What Hibernate sends to PostgreSQL (logging.level.org.hibernate.SQL=DEBUG):
-- select b1_0.id, b1_0.owner_id, b1_0.name from boards b1_0 where b1_0.id=?
-- insert into tasks (board_id, created_at, done, priority, title) values (?, ?, ?, ?, ?)
-- COMMIT`,
          lang: 'java / sql',
        },
        {
          title: 'Javob qaytishi va Vue\'da natijani ko\'rsatish',
          body: `Qaytish yo'li:

1. Service \`TaskResponse\` (record) qaytaradi, tranzaksiya **commit** bo'ladi.
2. Controller \`ResponseEntity.created(...)\` — status **201** va \`Location\` header.
3. **Jackson** record'ni JSON'ga aylantiradi (serialize). \`Instant\` ISO-8601 satr bo'lib chiqadi: \`"2026-11-14T09:30:00Z"\`.
4. Javob Security filter'lar orqali qaytadi, CORS header'lari qo'shiladi, Tomcat thread bo'shaydi.
5. Vue'da \`await api.post(...)\` tugaydi → store \`tasks.value.unshift(data)\` → reaktivlik tufayli ro'yxat **qayta render** bo'ladi, forma tozalanadi.

Xato holatlari — frontend har birini **boshqacha** ko'rsatadi:
- **400** (validation) → \`errors\` obyekti, har xato o'z input'i ostida
- **401** → interceptor refresh qiladi va so'rovni takrorlaydi; bo'lmasa → login sahifasi
- **403 / 404** → "Sizda ruxsat yo'q" / "Board topilmadi" xabari
- **500** yoki tarmoq xatosi → umumiy xabar + "Qayta urinish"; texnik tafsilot faqat log'da

Optimistic update (task'ni server javobidan **oldin** ro'yxatga qo'shish) tezroq tuyuladi, lekin xato bo'lsa uni qaytarib olib tashlash kerak.`,
          code: `// 400 from Spring (ProblemDetail + our "errors" field)
// HTTP/1.1 400 Bad Request
// Content-Type: application/problem+json
// { "title": "Bad Request", "status": 400, "detail": "Validation failed",
//   "errors": { "title": "Title is required" } }

// A small helper used by components/stores
import axios from 'axios'

export function toUserMessage(e: unknown): string {
  if (!axios.isAxiosError(e)) return 'Unexpected error'
  if (!e.response) return 'Network error. Check your connection.'
  switch (e.response.status) {
    case 403: return 'You do not have permission to do this.'
    case 404: return 'Not found. It may have been deleted.'
    case 409: return e.response.data?.detail ?? 'Conflict'
    default:  return 'Something went wrong. Please try again.'
  }
}

export function fieldErrors(e: unknown): Record<string, string> {
  return axios.isAxiosError(e) && e.response?.status === 400 ? e.response.data?.errors ?? {} : {}
}`,
          lang: 'ts',
        },
        {
          title: 'Dev va prod sozlamalari: Vite proxy, CORS, env',
          body: `**Development**'da ikki yo'l bor:
1. **Vite proxy** (tavsiya): brauzer faqat \`localhost:5173\`'ga gapiradi, Vite \`/api\` so'rovlarini \`localhost:8080\`'ga uzatadi. Bitta origin → **CORS yo'q**, cookie'lar ham oddiy ishlaydi.
2. **CORS**: frontend to'g'ridan-to'g'ri \`http://localhost:8080\`'ga murojaat qiladi, Spring'da \`allowedOrigins: http://localhost:5173\`.

**Production**'da:
- Eng oddiy: Nginx bitta domenda static Vue fayllarini beradi va \`/api\`'ni Spring'ga proxy qiladi — CORS kerak emas
- Alohida domen (\`app.\` va \`api.\`) bo'lsa — CORS'da **aniq** origin, \`*\` emas

**Env sozlamalari:**
- Vue: \`.env.development\` / \`.env.production\`, faqat \`VITE_\` bilan boshlanganlar kodga tushadi. Ular **build** paytida bundle'ga yoziladi va hamma ko'radi — hech qachon secret qo'ymang
- Spring: \`application.yml\` + profillar (\`application-dev.yml\`, \`SPRING_PROFILES_ACTIVE=prod\`). Secret'lar (DB parol, JWT secret) — environment variable'lardan: \`\${DB_PASSWORD}\`. Repo'ga hech qachon commit qilinmaydi`,
          code: `// vite.config.ts — dev proxy: no CORS needed
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
})

# .env.development
VITE_API_URL=/api/v1
# .env.production
VITE_API_URL=https://api.example.com/api/v1

# src/main/resources/application.yml
spring:
  datasource:
    url: \${DB_URL:jdbc:postgresql://localhost:5432/tasks}
    username: \${DB_USER:tasks}
    password: \${DB_PASSWORD:tasks}
  jpa:
    open-in-view: false
    hibernate:
      ddl-auto: validate          # schema comes from Flyway migrations
app:
  jwt:
    secret: \${JWT_SECRET}         # no default: the app must not start without it
  cors:
    allowed-origins: \${CORS_ORIGINS:http://localhost:5173}`,
          lang: 'ts / yaml',
        },
      ],
      questions: [
        {
          q: 'Walk me through what happens when a user clicks Save to create a task.',
          a: "The Vue component validates the form and calls a Pinia action. The action uses our axios instance, which sends a POST with a JSON body and the Bearer token. The browser does DNS, TCP and TLS, and a CORS preflight if the API is on another origin. In Spring Boot, a Tomcat thread takes the request, the security filters check the JWT, and the DispatcherServlet calls the controller. Jackson turns the JSON into a DTO, @Valid checks it, and the service saves the entity in a transaction through a JPA repository. Then the entity is mapped to a DTO, returned as JSON with 201 Created, and the store adds the task, so Vue re-renders the list.",
          uz: "Vue komponent formani tekshiradi va Pinia action'ini chaqiradi. Action bizning axios instance'imizdan foydalanadi, u JSON body va Bearer token bilan POST yuboradi. Brauzer DNS, TCP va TLS'ni bajaradi, API boshqa origin'da bo'lsa CORS preflight ham qiladi. Spring Boot'da Tomcat thread'i request'ni oladi, security filter'lari JWT'ni tekshiradi va DispatcherServlet controller'ni chaqiradi. Jackson JSON'ni DTO'ga aylantiradi, @Valid uni tekshiradi, service esa entity'ni JPA repository orqali tranzaksiya ichida saqlaydi. Keyin entity DTO'ga aylantiriladi, 201 Created bilan JSON sifatida qaytariladi, store task'ni qo'shadi va Vue ro'yxatni qayta render qiladi.",
          followUp: 'Which part of this flow is usually the slowest?',
          level: 'middle',
        },
        {
          q: 'How does the frontend know the user is logged in?',
          a: "After login, the backend returns a short-lived access token, and the refresh token goes into an httpOnly cookie. The frontend keeps the access token in the Pinia store, so if there is a token, the user is logged in. When the page reloads, the store is empty, so the app calls the refresh endpoint first. If it works, the user stays logged in. If not, the router guard sends the user to the login page.",
          uz: "Login'dan keyin backend qisqa muddatli access token qaytaradi, refresh token esa httpOnly cookie'ga tushadi. Frontend access token'ni Pinia store'da saqlaydi, shuning uchun token bo'lsa, foydalanuvchi login qilgan hisoblanadi. Sahifa qayta yuklanganda store bo'sh bo'ladi, shuning uchun ilova avval refresh endpoint'ini chaqiradi. U ishlasa, foydalanuvchi login holatida qoladi. Ishlamasa, router guard foydalanuvchini login sahifasiga yuboradi.",
          example: `// router guard
router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.accessToken) {
    const ok = await auth.tryRefresh() // POST /auth/refresh, cookie is sent automatically
    if (!ok) return { name: 'login', query: { redirect: to.fullPath } }
  }
})`,
          followUp: 'Is it safe to trust the frontend to hide admin pages?',
          level: 'middle',
        },
        {
          q: 'Where do you validate data — on the frontend or on the backend?',
          a: "On both, but for different reasons. Frontend validation is for user experience: the user sees the error at once, without a request. Backend validation is for security and data integrity, because anyone can call the API with curl and skip the frontend. In Spring Boot, I use Bean Validation on the DTO with @Valid, and the database has constraints too, like NOT NULL and UNIQUE.",
          uz: "Ikkalasida ham, lekin har xil sababga ko'ra. Frontend validation foydalanuvchi tajribasi uchun: foydalanuvchi xatoni request'siz darhol ko'radi. Backend validation esa xavfsizlik va ma'lumot yaxlitligi uchun, chunki har kim API'ni curl bilan chaqirib, frontend'ni chetlab o'tishi mumkin. Spring Boot'da DTO'da @Valid bilan Bean Validation ishlataman, database'da esa NOT NULL va UNIQUE kabi cheklovlar ham bor.",
          level: 'junior',
        },
        {
          q: 'How do you handle CORS in development and in production?',
          a: "In development, I usually use the Vite proxy. The browser talks only to the Vite server, and Vite forwards /api requests to Spring Boot, so there is no CORS at all. In production, the best option is to serve the frontend and the API from one domain behind Nginx. If they are on different domains, I configure CORS in Spring Security with the exact frontend origin, not a star.",
          uz: "Development'da odatda Vite proxy ishlataman. Brauzer faqat Vite server bilan gaplashadi, Vite esa /api request'larini Spring Boot'ga uzatadi, shuning uchun CORS umuman bo'lmaydi. Production'da eng yaxshi variant — frontend va API'ni Nginx ortida bitta domendan berish. Agar ular turli domenlarda bo'lsa, Spring Security'da CORS'ni yulduzcha emas, aniq frontend origin bilan sozlayman.",
          level: 'middle',
        },
        {
          q: 'How does the frontend send the token, and what happens when it expires?',
          a: "An axios request interceptor adds the Authorization header with Bearer and the access token to every request. When the token expires, the API returns 401. A response interceptor catches it, calls the refresh endpoint once, saves the new token, and repeats the original request. If the refresh also fails, I log the user out and redirect to the login page with a redirect parameter.",
          uz: "axios request interceptor'i har bir request'ga Bearer va access token'li Authorization header'ini qo'shadi. Token muddati o'tganda API 401 qaytaradi. Response interceptor uni ushlaydi, refresh endpoint'ini bir marta chaqiradi, yangi token'ni saqlaydi va asl request'ni takrorlaydi. Refresh ham muvaffaqiyatsiz bo'lsa, foydalanuvchini logout qilaman va redirect parametri bilan login sahifasiga yo'naltiraman.",
          followUp: 'What if five requests get 401 at the same time?',
          level: 'middle',
        },
        {
          q: 'How do you show backend validation errors on the form?',
          a: "The backend returns 400 with a clear structure, for example a ProblemDetail with an errors map from field name to message. In the frontend, I catch the error, check that the status is 400, and put the map into a reactive errors object. Each input shows its own message under it. So the field names in the Java DTO and in the Vue form must match.",
          uz: "Backend aniq tuzilmali 400 qaytaradi, masalan maydon nomidan xabargacha bo'lgan errors xaritasi bilan ProblemDetail. Frontend'da xatoni ushlayman, status 400 ekanini tekshiraman va xaritani reaktiv errors obyektiga qo'yaman. Har bir input o'z xabarini o'z ostida ko'rsatadi. Shuning uchun Java DTO'dagi va Vue formasidagi maydon nomlari bir xil bo'lishi kerak.",
          level: 'junior',
        },
        {
          q: 'Where is JSON converted into Java objects and back?',
          a: "Spring MVC uses HTTP message converters, and for JSON it uses Jackson. When a request comes with @RequestBody, Jackson deserializes the JSON into my DTO, usually a record. When the controller returns an object, Jackson serializes it to JSON. If the JSON is broken, Spring throws HttpMessageNotReadableException, and I return 400.",
          uz: "Spring MVC HTTP message converter'lardan foydalanadi, JSON uchun esa Jackson'dan. Request @RequestBody bilan kelganda Jackson JSON'ni mening DTO'imga, odatda record'ga deserialize qiladi. Controller obyekt qaytarganda Jackson uni JSON'ga serialize qiladi. JSON buzilgan bo'lsa, Spring HttpMessageNotReadableException tashlaydi va men 400 qaytaraman.",
          level: 'junior',
        },
        {
          q: 'Spring MVC uses a thread per request. How is that different from Node.js?',
          a: "In Node.js, all JavaScript runs on one thread with an event loop, and I/O is non-blocking, so the code uses async and await. In Spring MVC, Tomcat gives each request its own thread from a pool, and the code is simple blocking code. Many threads use more memory, but with Java 21 virtual threads we can have thousands of cheap threads and keep the simple style. If we need a fully non-blocking model, there is Spring WebFlux.",
          uz: "Node.js'da butun JavaScript bitta thread'da event loop bilan ishlaydi, I/O esa non-blocking, shuning uchun kod async va await ishlatadi. Spring MVC'da Tomcat har bir request'ga pool'dan alohida thread beradi, kod esa oddiy blocking kod. Ko'p thread ko'proq xotira ishlatadi, lekin Java 21 virtual thread'lari bilan minglab arzon thread'ga ega bo'lishimiz va oddiy uslubni saqlashimiz mumkin. To'liq non-blocking model kerak bo'lsa, Spring WebFlux bor.",
          followUp: 'What happens when all 200 Tomcat threads are busy?',
          level: 'middle',
        },
        {
          q: 'How do you configure the API URL and secrets for different environments?',
          a: "On the frontend, I use Vite env files, like .env.development and .env.production, with VITE_API_URL. These values go into the bundle, so I never put secrets there. On the backend, I use application.yml with Spring profiles, and secrets like the database password and the JWT secret come from environment variables. In production, they come from the server or a secret manager, never from Git.",
          uz: "Frontend'da VITE_API_URL bilan .env.development va .env.production kabi Vite env fayllaridan foydalanaman. Bu qiymatlar bundle'ga tushadi, shuning uchun u yerga hech qachon secret qo'ymayman. Backend'da Spring profillari bilan application.yml ishlataman, database paroli va JWT secret kabi maxfiy qiymatlar esa environment variable'lardan keladi. Production'da ular server yoki secret manager'dan keladi, hech qachon Git'dan emas.",
          level: 'junior',
        },
        {
          q: 'What does @Transactional do in this flow?',
          a: "When the service method starts, a Spring proxy opens a database transaction and takes a connection from the pool. All repository calls inside use the same transaction. If the method finishes normally, Spring commits. If it throws a runtime exception, Spring rolls back, so we never save half of the data, for example a task without its history record.",
          uz: "Service metodi boshlanganda Spring proxy database tranzaksiyasini ochadi va pool'dan connection oladi. Ichkaridagi barcha repository chaqiruvlari bitta tranzaksiyadan foydalanadi. Metod normal tugasa, Spring commit qiladi. Agar u runtime exception tashlasa, Spring rollback qiladi, shuning uchun biz hech qachon ma'lumotning yarmini saqlamaymiz, masalan tarix yozuvisiz task'ni.",
          followUp: 'Why does @Transactional not work on a private method?',
          level: 'middle',
        },
      ],
      resources: [
        { title: 'Spring Guides — Building REST services with Spring', url: 'https://spring.io/guides/tutorials/rest' },
        { title: 'Vite — Server proxy', url: 'https://vite.dev/config/server-options#server-proxy' },
        { title: 'axios — Interceptors', url: 'https://axios-http.com/docs/interceptors' },
        { title: 'MDN — CORS (preflight requests)', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS' },
        { title: 'Spring Boot — Externalized Configuration', url: 'https://docs.spring.io/spring-boot/reference/features/external-config.html' },
        { title: 'Baeldung — Virtual Threads in Spring Boot', url: 'https://www.baeldung.com/spring-6-virtual-threads' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'be-live-coding',
      title: 'Backend live coding: endpoint + validation + test',
      days: [38, 41, 76],
      summary: "Backend live coding'da odatda bitta kichik endpoint yozish so'raladi: masalan POST /tasks — input validation, to'g'ri status code'lar va test bilan. Intervyuer kod sifatidan tashqari fikrlashingizni eshitmoqchi, shuning uchun ovoz chiqarib gapiring: avval talablarni aniqlang (qaysi maydonlar majburiy? qaysi status code?), keyin oddiy ishlaydigan versiyani yozing, so'ng edge case'lar va testlarni qo'shing. Spring Boot'da standart tuzilma: DTO record + Bean Validation, @RestController, @Service (in-memory yoki JPA repository), xatolar uchun @RestControllerAdvice. Test uchun @WebMvcTest + MockMvc (JUnit 5) qulay: butun ilovani va server'ni ishga tushirmasdan faqat web qatlamni tekshiradi.",
      keyPoints: [
        "Avval savol bering: maydonlar, cheklovlar, status code'lar, auth kerakmi, database bormi?",
        "Ovoz chiqarib gapiring: 'First I'll create the request DTO with validation, then...'",
        "Muvaffaqiyat: 201 + yaratilgan obyekt + Location; noto'g'ri input: 400 + maydon xatolari",
        "Tuzilma: record DTO (@NotBlank, @Size) → @RestController (@Valid) → @Service → repository",
        "@RestControllerAdvice: 400 (validation), 404 (NotFoundException)",
        "@WebMvcTest + MockMvc: happy path + validation xatosi + 404 holatlari",
        "Oxirida yaxshilashlarni ayting: JPA + PostgreSQL, Flyway, Spring Security, pagination, Testcontainers",
      ],
      vocab: [
        { en: 'requirement', uz: 'talab' },
        { en: 'edge case', uz: 'chegaraviy holat' },
        { en: 'happy path', uz: "hammasi to'g'ri ketgan asosiy holat" },
        { en: 'assertion', uz: 'testdagi tekshiruv (andExpect / assertThat)' },
        { en: 'test case', uz: 'test holati' },
        { en: 'slice test', uz: "ilovaning faqat bir qatlamini yuklovchi test (@WebMvcTest)" },
        { en: 'in-memory', uz: "xotirada (database'siz)" },
        { en: 'mock', uz: "soxta obyekt (haqiqiysining o'rnida)" },
      ],
      lesson: [
        {
          title: 'Boshlashdan oldin: talablar va ovoz chiqarib gapirish',
          body: `Live coding'da intervyuer **natijadan ko'ra jarayonni** baholaydi. Darhol kod yozishni boshlamang — 1–2 daqiqa savol bering:

- "Which fields does a task have? Is title required? Max length?"
- "What should we return on success — 201 with the created task?"
- "Do we need a real database, or is an in-memory store OK for now?"
- "Do we need authentication for this exercise?"

Keyin rejani ayting: **"First I'll create the request DTO with validation. Then the controller and a simple service with an in-memory map. Then a global error handler. At the end I'll write tests with MockMvc."**

Yozayotganda gapiring, jim qolmang: "Here I use a record because it's immutable and short", "I return 201 because a new resource was created". Xato qilsangiz — ovoz chiqarib tuzating, bu ham ijobiy signal.

Vaqt kam bo'lsa, avval **ishlaydigan** oddiy versiya, keyin yaxshilash. Tugatgach, nimani yaxshilashingizni o'zingiz ayting.`,
        },
        {
          title: 'Loyiha skeleti (start.spring.io)',
          body: `Odatda intervyuda tayyor loyiha beriladi yoki start.spring.io'dan yaratasiz. Kerakli dependency'lar:

- **Spring Web** — \`@RestController\`, Tomcat, Jackson
- **Validation** — \`jakarta.validation\` (Hibernate Validator)
- (keyin) **Spring Data JPA** + **PostgreSQL Driver**
- \`spring-boot-starter-test\` avtomatik qo'shiladi: JUnit 5, Mockito, AssertJ, MockMvc

Paketlarni **feature** bo'yicha tuzing (\`task/\` ichida controller, service, dto) — kichik vazifada ham tartib ko'rinadi. Java 21 bilan DTO uchun \`record\`, \`var\` va pattern matching'dan bemalol foydalaning.`,
          code: `src/main/java/com/example/tasks/
├── TasksApplication.java
├── common/
│   ├── NotFoundException.java
│   └── GlobalExceptionHandler.java      // @RestControllerAdvice
└── task/
    ├── TaskController.java              // @RestController
    ├── TaskService.java                 // @Service (in-memory for now)
    ├── Task.java                        // domain model
    └── dto/
        ├── CreateTaskRequest.java       // record + Bean Validation
        ├── UpdateTaskRequest.java
        └── TaskResponse.java
src/test/java/com/example/tasks/task/
└── TaskControllerTest.java              // @WebMvcTest + MockMvc

// run: ./mvnw spring-boot:run      test: ./mvnw test`,
          lang: 'text',
        },
        {
          title: 'DTO, service va controller',
          body: `Ketma-ketlik: **DTO → service → controller**.

- \`CreateTaskRequest\` — record + validation annotatsiyalari. \`priority\` ixtiyoriy, kelmasa \`medium\`.
- \`TaskService\` — \`ConcurrentHashMap\` + \`AtomicLong\` (thread-safe, chunki Tomcat so'rovlarni parallel thread'larda bajaradi — buni intervyuerga ayting!). Topilmasa \`NotFoundException\`.
- \`TaskController\` — faqat HTTP: \`@Valid\`, status code'lar, \`Location\` header.

Controller'da \`if (title == null)\` kabi qo'lda tekshiruv yo'q — buni Bean Validation qiladi.`,
          code: `public record CreateTaskRequest(
        @NotBlank(message = "title is required")
        @Size(max = 100, message = "title must be at most 100 characters")
        String title,
        @Pattern(regexp = "low|medium|high", message = "priority must be low, medium or high")
        String priority) {
}

public record TaskResponse(long id, String title, String priority, boolean done) { }

@Service
public class TaskService {
    private final Map<Long, TaskResponse> tasks = new ConcurrentHashMap<>();
    private final AtomicLong nextId = new AtomicLong(1);

    public TaskResponse create(CreateTaskRequest req) {
        long id = nextId.getAndIncrement();
        String priority = req.priority() == null ? "medium" : req.priority();
        TaskResponse task = new TaskResponse(id, req.title().trim(), priority, false);
        tasks.put(id, task);
        return task;
    }

    public TaskResponse get(long id) {
        TaskResponse task = tasks.get(id);
        if (task == null) throw new NotFoundException("Task " + id + " not found");
        return task;
    }
}

@RestController
@RequestMapping("/tasks")
public class TaskController {
    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<TaskResponse> create(@Valid @RequestBody CreateTaskRequest request) {
        TaskResponse task = service.create(request);
        return ResponseEntity.created(URI.create("/tasks/" + task.id())).body(task);
    }

    @GetMapping("/{id}")
    public TaskResponse get(@PathVariable long id) {
        return service.get(id);
    }
}`,
          lang: 'java',
        },
        {
          title: 'Xatolar: @RestControllerAdvice (400 va 404)',
          body: `Uchta xato turi live coding'da deyarli har doim kerak:

1. \`MethodArgumentNotValidException\` — \`@Valid\` o'tmadi → **400** + maydon xatolari
2. \`NotFoundException\` (o'zimizniki) → **404**
3. \`MethodArgumentTypeMismatchException\` — \`/tasks/abc\` (id raqam emas) → **400**

Javob formati sodda va bir xil bo'lsin. Intervyuda \`ProblemDetail\` ishlatsangiz — bonus, lekin oddiy \`Map\` ham yetarli. Muhimi — testlar shu formatga tayanadi.`,
          code: `public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) { super(message); }
}

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> validation(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .toList();
        return ResponseEntity.badRequest().body(Map.of("errors", errors));
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Map<String, Object>> notFound(NotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> badId(MethodArgumentTypeMismatchException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getName() + " has a wrong format"));
    }
}`,
          lang: 'java',
        },
        {
          title: 'Test: @WebMvcTest + MockMvc (JUnit 5)',
          body: `\`@WebMvcTest(TaskController.class)\` — **slice test**: faqat web qatlamni yuklaydi (controller, \`@RestControllerAdvice\`, Jackson, validation), database va boshqa bean'larni emas. Shuning uchun tez ishlaydi. Server ishga tushmaydi — \`MockMvc\` so'rovni to'g'ridan-to'g'ri \`DispatcherServlet\`'ga beradi.

Service bizda in-memory, shuning uchun uni \`@Import\` bilan haqiqiysini qo'shamiz. Agar service database'ga borsa, uni \`@MockitoBean\` (Spring Boot 3.4+; eski versiyalarda \`@MockBean\`) bilan almashtirasiz va \`when(...).thenReturn(...)\` yozasiz.

Minimal test to'plami:
- happy path: **201**, body maydonlari, \`Location\` header
- title yo'q → **400**
- title juda uzun → **400**
- noto'g'ri priority → **400**
- mavjud bo'lmagan id → **404**

To'liq integratsiya testi uchun: \`@SpringBootTest\` + Testcontainers (haqiqiy PostgreSQL Docker'da).`,
          code: `@WebMvcTest(TaskController.class)
@Import(TaskService.class) // real in-memory service; use @MockitoBean if it needs a DB
class TaskControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    void createsTaskAndReturns201() throws Exception {
        mockMvc.perform(post("/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title": "Buy milk"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.title").value("Buy milk"))
                .andExpect(jsonPath("$.priority").value("medium"))
                .andExpect(jsonPath("$.done").value(false));
    }

    @Test
    void returns400WhenTitleIsMissing() throws Exception {
        mockMvc.perform(post("/tasks").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors", hasItem("title is required")));
    }

    @Test
    void returns400WhenTitleIsTooLong() throws Exception {
        String body = "{\\"title\\": \\"" + "a".repeat(101) + "\\"}";
        mockMvc.perform(post("/tasks").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void returns404ForUnknownTask() throws Exception {
        mockMvc.perform(get("/tasks/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Task 999 not found"));
    }
}`,
          lang: 'java',
        },
        {
          title: "Keyingi qadam: in-memory'dan JPA + PostgreSQL'ga",
          body: `Intervyuer ko'pincha so'raydi: "How would you switch this to a real database?" Javob rejasi:

1. Dependency: \`spring-boot-starter-data-jpa\` + \`postgresql\`; \`application.yml\`'da datasource
2. \`Task\` — \`@Entity\` (id \`@GeneratedValue(strategy = IDENTITY)\`), jadval Flyway migratsiyasi bilan yaratiladi
3. \`TaskRepository extends JpaRepository<Task, Long>\` — CRUD metodlar tayyor
4. Service \`Map\` o'rniga repository'ni ishlatadi, yozuvchi metodlar \`@Transactional\`; entity → DTO mapping service'da
5. Controller va testlar **o'zgarmaydi** — chunki controller DTO bilan ishlaydi. Bu qatlamlarga bo'lishning foydasi!
6. Repository uchun \`@DataJpaTest\`, to'liq oqim uchun \`@SpringBootTest\` + Testcontainers`,
          code: `@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100)
    private String title;
    @Column(nullable = false)
    private String priority;
    private boolean done;

    protected Task() { }

    public Task(String title, String priority) {
        this.title = title;
        this.priority = priority;
    }
    // getters and setters ...
}

public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByDone(boolean done, Pageable pageable);
}

@Service
@Transactional(readOnly = true)
public class TaskService {
    private final TaskRepository repository;

    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public TaskResponse create(CreateTaskRequest req) {
        Task saved = repository.save(new Task(req.title().trim(),
                req.priority() == null ? "medium" : req.priority()));
        return toResponse(saved);
    }

    public TaskResponse get(long id) {
        return repository.findById(id).map(this::toResponse)
                .orElseThrow(() -> new NotFoundException("Task " + id + " not found"));
    }

    private TaskResponse toResponse(Task t) {
        return new TaskResponse(t.getId(), t.getTitle(), t.getPriority(), t.isDone());
    }
}`,
          lang: 'java',
        },
      ],
      questions: [
        {
          q: 'Write a POST /tasks endpoint with validation.',
          a: "First, I check the requirements: title is required, max 100 characters, and priority is low, medium, or high. I create a request DTO as a record with Bean Validation annotations, and I put @Valid on the request body in the controller. If the data is wrong, my @RestControllerAdvice returns 400 with a list of errors. If the data is valid, the service creates the task and I return 201 with the new task. Here I use an in-memory map, but in a real app I would save it to PostgreSQL with JPA.",
          uz: "Avval talablarni aniqlayman: title majburiy, ko'pi bilan 100 belgi, priority esa low, medium yoki high. Bean Validation annotatsiyalari bilan record ko'rinishida request DTO yarataman va controller'da request body'ga @Valid qo'yaman. Ma'lumot noto'g'ri bo'lsa, @RestControllerAdvice'im xatolar ro'yxati bilan 400 qaytaradi. Ma'lumot to'g'ri bo'lsa, service task yaratadi va men yangi task bilan 201 qaytaraman. Bu yerda xotiradagi map ishlatyapman, lekin haqiqiy ilovada uni JPA bilan PostgreSQL'ga saqlagan bo'lardim.",
          example: `public record CreateTaskRequest(
        @NotBlank(message = "title is required")
        @Size(max = 100, message = "title must be at most 100 characters")
        String title,
        @Pattern(regexp = "low|medium|high", message = "priority must be low, medium or high")
        String priority) {
}

public record TaskResponse(long id, String title, String priority, boolean done) { }

@RestController
@RequestMapping("/tasks")
public class TaskController {
    private final Map<Long, TaskResponse> tasks = new ConcurrentHashMap<>(); // in a service in real code
    private final AtomicLong nextId = new AtomicLong(1);

    @PostMapping
    public ResponseEntity<TaskResponse> create(@Valid @RequestBody CreateTaskRequest req) {
        long id = nextId.getAndIncrement();
        String priority = req.priority() == null ? "medium" : req.priority();
        TaskResponse task = new TaskResponse(id, req.title().trim(), priority, false);
        tasks.put(id, task);
        return ResponseEntity.created(URI.create("/tasks/" + id)).body(task);
    }
}

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> validation(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage).toList();
        return ResponseEntity.badRequest().body(Map.of("errors", errors));
    }
}`,
          followUp: 'How would you test this endpoint?',
          level: 'junior',
        },
        {
          q: 'How would you test this endpoint?',
          a: "I write a web slice test with @WebMvcTest and MockMvc, using JUnit 5. It loads only the controller, the advice, and validation, so it is fast, and I do not need to start the server. I test the happy path: status 201 and the correct JSON body. Then I test the errors: missing title, too long title, and wrong priority must return 400. If the service talks to a database, I replace it with @MockitoBean.",
          uz: "JUnit 5 yordamida @WebMvcTest va MockMvc bilan web slice test yozaman. U faqat controller, advice va validation'ni yuklaydi, shuning uchun tez ishlaydi va server'ni ishga tushirish shart emas. Happy path'ni tekshiraman: 201 status va to'g'ri JSON body. Keyin xatolarni tekshiraman: title yo'qligi, juda uzun title va noto'g'ri priority 400 qaytarishi kerak. Agar service database bilan ishlasa, uni @MockitoBean bilan almashtiraman.",
          example: `@WebMvcTest(TaskController.class)
class TaskControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    void createsTask() throws Exception {
        mockMvc.perform(post("/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title": "Buy milk"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Buy milk"))
                .andExpect(jsonPath("$.priority").value("medium"))
                .andExpect(jsonPath("$.done").value(false));
    }

    @Test
    void returns400WhenTitleIsMissing() throws Exception {
        mockMvc.perform(post("/tasks").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors", hasItem("title is required")));
    }

    @Test
    void returns400ForUnknownPriority() throws Exception {
        mockMvc.perform(post("/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title": "Test", "priority": "urgent"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors", hasItem("priority must be low, medium or high")));
    }
}`,
          followUp: 'What is the difference between @WebMvcTest and @SpringBootTest?',
          level: 'junior',
        },
        {
          q: 'Write GET /tasks/{id} and PATCH /tasks/{id}. What status codes do they return?',
          a: "GET returns 200 with the task, or 404 if it does not exist. For 404, the service throws NotFoundException and the advice turns it into 404. PATCH updates only the fields that are sent, so in the update DTO all fields are optional, and null means 'not sent'. If the id is not a number, Spring throws a type mismatch exception and I return 400. After a successful update, I return 200 with the updated task.",
          uz: "GET task bilan 200 qaytaradi, task mavjud bo'lmasa 404. 404 uchun service NotFoundException tashlaydi, advice esa uni 404'ga aylantiradi. PATCH faqat yuborilgan maydonlarni yangilaydi, shuning uchun update DTO'da barcha maydonlar ixtiyoriy va null 'yuborilmagan' degani. id raqam bo'lmasa, Spring type mismatch exception tashlaydi va men 400 qaytaraman. Muvaffaqiyatli yangilangandan keyin yangilangan task bilan 200 qaytaraman.",
          example: `public record UpdateTaskRequest(
        @Size(min = 1, max = 100, message = "title must be 1-100 characters") String title,
        Boolean done) { // null = field was not sent
}

@GetMapping("/{id}")
public TaskResponse get(@PathVariable long id) {
    return service.get(id); // NotFoundException -> 404 in the advice
}

@PatchMapping("/{id}")
public TaskResponse update(@PathVariable long id, @Valid @RequestBody UpdateTaskRequest req) {
    return service.update(id, req);
}

// TaskService
public TaskResponse update(long id, UpdateTaskRequest req) {
    TaskResponse old = get(id);
    String title = req.title() != null ? req.title().trim() : old.title();
    boolean done = req.done() != null ? req.done() : old.done();
    TaskResponse updated = new TaskResponse(id, title, old.priority(), done);
    tasks.put(id, updated);
    return updated;
}

// GlobalExceptionHandler: /tasks/abc -> 400
@ExceptionHandler(MethodArgumentTypeMismatchException.class)
public ResponseEntity<Map<String, Object>> badId(MethodArgumentTypeMismatchException ex) {
    return ResponseEntity.badRequest().body(Map.of("error", "id must be a number"));
}`,
          level: 'junior',
        },
        {
          q: 'Add pagination and filtering to GET /tasks.',
          a: "I read page, size, and status from the query string with @RequestParam and default values. I limit the size, so nobody can ask for a million rows. Then I filter, skip and limit the list, and return the items with the total count in a small page record. With Spring Data JPA, I would use a Pageable parameter and a repository method like findByDone, and set max-page-size.",
          uz: "Query string'dan page, size va status'ni @RequestParam va default qiymatlar bilan o'qiyman. Size'ni cheklayman, shunda hech kim million qator so'ray olmaydi. Keyin filtrlayman, ro'yxatni skip va limit qilaman va elementlarni umumiy son bilan kichik page record'ida qaytaraman. Spring Data JPA bilan Pageable parametri va findByDone kabi repository metodidan foydalanib, max-page-size'ni sozlagan bo'lardim.",
          example: `public record PageResponse<T>(List<T> items, int page, int size, long total) { }

@GetMapping
public PageResponse<TaskResponse> list(@RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "20") int size,
                                       @RequestParam(required = false) String status) {
    int safePage = Math.max(0, page);
    int safeSize = Math.min(100, Math.max(1, size));

    List<TaskResponse> filtered = service.findAll().stream()
            .filter(t -> status == null
                    || (status.equals("done") && t.done())
                    || (status.equals("todo") && !t.done()))
            .sorted(Comparator.comparingLong(TaskResponse::id))
            .toList();

    List<TaskResponse> items = filtered.stream()
            .skip((long) safePage * safeSize)
            .limit(safeSize)
            .toList();

    return new PageResponse<>(items, safePage, safeSize, filtered.size());
}

// With JPA: repository.findByDone(done, PageRequest.of(page, size, Sort.by("id")))`,
          level: 'middle',
        },
        {
          q: 'How would you protect these endpoints so that only the owner can change a task?',
          a: "First, I add Spring Security with a JWT filter, so every request has an authenticated user in the SecurityContext. In the controller, I get the user id with @AuthenticationPrincipal and pass it to the service. The service loads the task and compares the owner id with the user id. If there is no valid token, Spring Security returns 401. If the user is not the owner, I throw AccessDeniedException and the client gets 403.",
          uz: "Avval JWT filter bilan Spring Security qo'shaman, shunda har bir request'da SecurityContext'da autentifikatsiyadan o'tgan foydalanuvchi bo'ladi. Controller'da @AuthenticationPrincipal bilan user id'ni olib, service'ga uzataman. Service task'ni yuklab, egasining id'sini user id bilan solishtiradi. To'g'ri token bo'lmasa, Spring Security 401 qaytaradi. Foydalanuvchi egasi bo'lmasa, AccessDeniedException tashlayman va client 403 oladi.",
          example: `@DeleteMapping("/{id}")
@ResponseStatus(HttpStatus.NO_CONTENT)
public void delete(@PathVariable long id, @AuthenticationPrincipal Long userId) {
    service.delete(id, userId);
}

// TaskService
@Transactional
public void delete(long id, Long userId) {
    Task task = repository.findById(id)
            .orElseThrow(() -> new NotFoundException("Task " + id + " not found")); // 404
    if (!task.getOwnerId().equals(userId)) {
        throw new AccessDeniedException("Forbidden");                            // 403
    }
    repository.delete(task);                                                       // 204
}`,
          followUp: 'Some APIs return 404 instead of 403 here. Why?',
          level: 'middle',
        },
        {
          q: 'You have finished the endpoint. What would you improve if you had more time?',
          a: "I would move the data from memory to PostgreSQL with Spring Data JPA, and create the tables with Flyway migrations. I would return ProblemDetail for all errors, and add Spring Security with JWT, rate limiting, and logging with a request id. I would add an OpenAPI description with springdoc. Finally, I would add integration tests with @SpringBootTest and Testcontainers, so the tests run against a real PostgreSQL.",
          uz: "Ma'lumotlarni xotiradan Spring Data JPA bilan PostgreSQL'ga o'tkazib, jadvallarni Flyway migratsiyalari bilan yaratgan bo'lardim. Barcha xatolar uchun ProblemDetail qaytarib, JWT bilan Spring Security, rate limiting va request id bilan logging qo'shgan bo'lardim. springdoc bilan OpenAPI tavsifini qo'shgan bo'lardim. Va nihoyat, @SpringBootTest va Testcontainers bilan integration testlar qo'shgan bo'lardim, shunda testlar haqiqiy PostgreSQL'da ishlaydi.",
          level: 'junior',
        },
        {
          q: 'How would you switch the in-memory store to a real database?',
          a: "I add the Spring Data JPA starter and the PostgreSQL driver, and I configure the datasource in application.yml. I turn Task into an @Entity and create a TaskRepository that extends JpaRepository. The service uses the repository instead of the map, and the write methods get @Transactional. The controller and the web tests do not change, because they work with DTOs. That is the benefit of the layers.",
          uz: "Spring Data JPA starter'i va PostgreSQL driver'ini qo'shaman hamda application.yml'da datasource'ni sozlayman. Task'ni @Entity'ga aylantiraman va JpaRepository'dan meros oladigan TaskRepository yarataman. Service map o'rniga repository'dan foydalanadi, yozuvchi metodlarga esa @Transactional qo'yiladi. Controller va web testlar o'zgarmaydi, chunki ular DTO'lar bilan ishlaydi. Qatlamlarga bo'lishning foydasi shu.",
          example: `public interface TaskRepository extends JpaRepository<Task, Long> { }

@Transactional
public TaskResponse create(CreateTaskRequest req) {
    Task saved = repository.save(new Task(req.title().trim(),
            req.priority() == null ? "medium" : req.priority()));
    return new TaskResponse(saved.getId(), saved.getTitle(), saved.getPriority(), saved.isDone());
}`,
          level: 'middle',
        },
      ],
      resources: [
        { title: 'Spring Guides — Testing the Web Layer', url: 'https://spring.io/guides/gs/testing-web' },
        { title: 'Spring Guides — Validating Form Input', url: 'https://spring.io/guides/gs/validating-form-input' },
        { title: 'Baeldung — Testing in Spring Boot', url: 'https://www.baeldung.com/spring-boot-testing' },
        { title: 'Spring Boot — Testing reference', url: 'https://docs.spring.io/spring-boot/reference/testing/index.html' },
        { title: 'Spring Initializr', url: 'https://start.spring.io/' },
      ],
    },
  ],
}

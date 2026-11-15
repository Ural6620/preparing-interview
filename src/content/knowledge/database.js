export default {
  id: 'database',
  title: 'Database va SQL',
  icon: '🗄️',
  intro: "SQL va NoSQL tanlovi, JOIN va window function'lar, index, normalization, transaction (ACID), N+1 muammosi va schema dizayni. Deyarli har bir backend yoki full-stack intervyuda ma'lumotlarni qanday saqlash va tez o'qishni bilishingiz tekshiriladi.",
  topics: [
    // ─────────────────────────────────────────────
    {
      id: 'db-sql-vs-nosql',
      title: 'SQL vs NoSQL: qachon qaysi biri',
      days: [43, 48, 49],
      summary: "SQL (relational) database'lar — PostgreSQL, MySQL — ma'lumotni qat'iy schema'li jadvallarda saqlaydi, jadvallar orasida relation'lar (foreign key) bor, JOIN va kuchli transaction'lar (ACID) qo'llab-quvvatlanadi. NoSQL database'lar — MongoDB (document), Redis (key-value), Cassandra (wide-column), Neo4j (graph) — moslashuvchan schema'ga ega va ko'pincha horizontal scale qilish osonroq. Tanlov ma'lumot tuzilishi va talablarga bog'liq: bog'langan, izchilligi muhim ma'lumot (buyurtmalar, to'lovlar) uchun SQL; tuzilishi tez o'zgaradigan, juda katta hajmdagi yoki oddiy key-value ma'lumot (cache, session, log) uchun NoSQL. Ko'p loyihalarda ikkalasi birga ishlatiladi: masalan PostgreSQL + Redis.",
      keyPoints: [
        "SQL: jadvallar, qat'iy schema, JOIN, ACID transaction'lar",
        "NoSQL turlari: document (MongoDB), key-value (Redis), wide-column (Cassandra), graph (Neo4j)",
        "SQL odatda vertical scale qilinadi (kuchliroq server), NoSQL — horizontal (ko'proq server)",
        "Bog'liq va izchil ma'lumot (to'lov, buyurtma) → SQL",
        "Moslashuvchan tuzilish, juda katta yozish hajmi, cache → NoSQL",
        "Default tanlov ko'pincha PostgreSQL: JSONB ustunlari bilan moslashuvchanlik ham bor",
      ],
      vocab: [
        { en: 'relational database', uz: "relation'li (jadvalli) database" },
        { en: 'schema', uz: "ma'lumot tuzilishi (jadval va ustunlar ta'rifi)" },
        { en: 'document', uz: "hujjat (JSON ko'rinishidagi yozuv)" },
        { en: 'consistency', uz: "izchillik (ma'lumotning to'g'riligi)" },
        { en: 'horizontal scaling', uz: "ko'proq server qo'shib kengaytirish" },
        { en: 'vertical scaling', uz: 'serverni kuchaytirib kengaytirish' },
        { en: 'trade-off', uz: 'murosaga kelish (bir narsa evaziga boshqasi)' },
      ],
      questions: [
        {
          q: 'What is the difference between SQL and NoSQL databases?',
          a: "SQL databases store data in tables with a fixed schema. They support relations, JOINs, and strong ACID transactions. NoSQL databases have a flexible schema and store data as documents, key-value pairs, or graphs. They are usually easier to scale horizontally.",
          uz: "SQL database'lar ma'lumotni qat'iy schema'li jadvallarda saqlaydi. Ular relation'lar, JOIN'lar va kuchli ACID transaction'larni qo'llaydi. NoSQL database'larning schema'si moslashuvchan va ular ma'lumotni document, key-value juftliklari yoki graph ko'rinishida saqlaydi. Ularni odatda horizontal scale qilish osonroq.",
          level: 'junior',
        },
        {
          q: 'When would you choose SQL and when would you choose NoSQL?',
          a: "It depends on the use case. I'd choose SQL for data with many relations where consistency is important, like orders and payments. I'd choose NoSQL when the structure changes often, when we have a huge amount of simple data, or for a cache. For most web apps, I start with PostgreSQL.",
          uz: "Bu holatga bog'liq. Ko'p relation'li va izchillik muhim bo'lgan ma'lumot uchun SQL tanlardim, masalan buyurtmalar va to'lovlar. Tuzilish tez-tez o'zgarganda, juda ko'p oddiy ma'lumot bo'lganda yoki cache uchun NoSQL tanlardim. Ko'pchilik web ilovalar uchun PostgreSQL'dan boshlayman.",
          followUp: 'Can you use both in one project?',
          level: 'junior',
        },
        {
          q: 'What types of NoSQL databases do you know?',
          a: "There are four main types. Document databases like MongoDB store JSON-like documents. Key-value stores like Redis are very fast and good for cache and sessions. Wide-column databases like Cassandra handle a lot of writes. Graph databases like Neo4j are good for relations, like a social network.",
          uz: "To'rtta asosiy tur bor. MongoDB kabi document database'lar JSON'ga o'xshash hujjatlarni saqlaydi. Redis kabi key-value store'lar juda tez va cache hamda session uchun yaxshi. Cassandra kabi wide-column database'lar juda ko'p yozishni ko'taradi. Neo4j kabi graph database'lar ijtimoiy tarmoq kabi bog'lanishlar uchun yaxshi.",
          level: 'junior',
        },
        {
          q: 'What is the difference between vertical and horizontal scaling?',
          a: "Vertical scaling means we make one server stronger, with more CPU and RAM. It is simple, but it has a limit and is expensive. Horizontal scaling means we add more servers and split the data or the load between them. SQL databases usually scale vertically, and many NoSQL databases are built to scale horizontally.",
          uz: "Vertical scaling — bitta serverni ko'proq CPU va RAM bilan kuchliroq qilish. Bu oddiy, lekin chegarasi bor va qimmat. Horizontal scaling — ko'proq server qo'shib, ma'lumot yoki yukni ular orasida bo'lish. SQL database'lar odatda vertical scale qilinadi, ko'plab NoSQL database'lar esa horizontal scale uchun yaratilgan.",
          followUp: 'How can you scale reads in PostgreSQL?',
          level: 'middle',
        },
        {
          q: 'Why did you choose PostgreSQL for your project?',
          a: "My data has clear relations: users have boards, and boards have tasks. So a relational database is a good fit. PostgreSQL gives me foreign keys, transactions, and good indexes. It also has a JSONB type, so I can store flexible data when I need it.",
          uz: "Mening ma'lumotlarim aniq bog'langan: foydalanuvchilarning board'lari bor, board'larning esa task'lari bor. Shuning uchun relational database yaxshi mos keladi. PostgreSQL menga foreign key'lar, transaction'lar va yaxshi index'lar beradi. Unda JSONB turi ham bor, shuning uchun kerak bo'lganda moslashuvchan ma'lumotni saqlay olaman.",
          level: 'junior',
        },
        {
          q: 'What is the CAP theorem?',
          a: "The CAP theorem is about distributed databases. It says that when there is a network partition, a system must choose between consistency and availability. Consistency means every read gets the latest data. Availability means every request gets a response. So we cannot have all three at the same time.",
          uz: "CAP teoremasi taqsimlangan database'lar haqida. U tarmoq bo'linishi (partition) yuz berganda tizim consistency va availability orasida tanlashi kerakligini aytadi. Consistency — har bir o'qish eng oxirgi ma'lumotni oladi. Availability — har bir request javob oladi. Shuning uchun uchalasiga bir vaqtda ega bo'la olmaymiz.",
          level: 'middle',
        },
      ],
      resources: [
        { title: 'System Design Primer — SQL or NoSQL', url: 'https://github.com/donnemartin/system-design-primer' },
        { title: 'roadmap.sh — SQL', url: 'https://roadmap.sh/sql' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'db-sql-queries',
      title: 'JOIN, GROUP BY, HAVING, subquery',
      days: [43],
      summary: "JOIN ikki jadvalni umumiy ustun (odatda foreign key) bo'yicha birlashtiradi. INNER JOIN faqat ikkala jadvalda mos keladigan qatorlarni qaytaradi; LEFT JOIN chap jadvalning hamma qatorlarini qaytaradi, mos kelmaganlarida o'ng tomon NULL bo'ladi; RIGHT va FULL JOIN ham bor. GROUP BY qatorlarni guruhlab COUNT, SUM, AVG kabi aggregate funksiyalarni hisoblaydi. WHERE guruhlashdan oldin qatorlarni filtrlaydi, HAVING esa guruhlashdan keyin guruhlarni filtrlaydi. Subquery — boshqa query ichidagi query; uni WHERE, FROM yoki SELECT ichida ishlatish mumkin.",
      keyPoints: [
        "INNER JOIN — faqat mos keladigan qatorlar",
        "LEFT JOIN — chapdagi hammasi + mos kelsa o'ngdagi, aks holda NULL",
        "FULL JOIN — ikkala tomondagi hammasi; CROSS JOIN — har bir juftlik",
        "GROUP BY + COUNT/SUM/AVG/MIN/MAX",
        "WHERE — guruhlashdan oldin, HAVING — guruhlashdan keyin",
        "Bajarilish tartibi: FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT",
        "Subquery: WHERE ... IN (SELECT ...), EXISTS, yoki FROM (SELECT ...) AS t",
      ],
      vocab: [
        { en: 'join', uz: 'birlashtirish' },
        { en: 'aggregate function', uz: 'jamlovchi funksiya (COUNT, SUM)' },
        { en: 'subquery', uz: "ichki so'rov" },
        { en: 'match', uz: 'mos kelmoq' },
        { en: 'foreign key', uz: 'boshqa jadvalga ishora qiluvchi kalit' },
        { en: 'filter', uz: 'filtrlash' },
        { en: 'duplicate', uz: 'takrorlanuvchi' },
      ],
      questions: [
        {
          q: 'What types of JOIN do you know?',
          a: "INNER JOIN returns only rows that match in both tables. LEFT JOIN returns all rows from the left table, and NULL when there is no match on the right. RIGHT JOIN is the same but for the right table. FULL JOIN returns all rows from both tables. CROSS JOIN returns every combination of rows.",
          uz: "INNER JOIN faqat ikkala jadvalda mos keladigan qatorlarni qaytaradi. LEFT JOIN chap jadvalning hamma qatorlarini qaytaradi, o'ngda mos kelmasa NULL bo'ladi. RIGHT JOIN ham xuddi shunday, lekin o'ng jadval uchun. FULL JOIN ikkala jadvalning hamma qatorlarini qaytaradi. CROSS JOIN qatorlarning har bir kombinatsiyasini qaytaradi.",
          example: "-- users with their orders (only users who have orders)\nSELECT u.name, o.id AS order_id, o.total\nFROM users u\nINNER JOIN orders o ON o.user_id = u.id;\n\n-- all users, even without orders\nSELECT u.name, o.id AS order_id\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id;",
          level: 'junior',
        },
        {
          q: 'What is the difference between WHERE and HAVING?',
          a: "WHERE filters rows before grouping, and HAVING filters groups after grouping. So you cannot use an aggregate function like COUNT in WHERE. You use it in HAVING. For example, we use HAVING to find users with more than five orders.",
          uz: "WHERE qatorlarni guruhlashdan oldin filtrlaydi, HAVING esa guruhlarni guruhlashdan keyin filtrlaydi. Shuning uchun WHERE'da COUNT kabi aggregate funksiyani ishlatib bo'lmaydi. Uni HAVING'da ishlatamiz. Masalan, beshtadan ko'p buyurtmasi bor foydalanuvchilarni topish uchun HAVING ishlatamiz.",
          example: "SELECT user_id, COUNT(*) AS order_count\nFROM orders\nWHERE status = 'paid'          -- filters rows\nGROUP BY user_id\nHAVING COUNT(*) > 5;           -- filters groups",
          level: 'junior',
        },
        {
          q: 'What does GROUP BY do? Give an example.',
          a: "GROUP BY puts rows with the same value into one group. Then we use aggregate functions like COUNT, SUM, or AVG for each group. For example, we can count tasks for each user. Every column in SELECT must be in GROUP BY or inside an aggregate function.",
          uz: "GROUP BY bir xil qiymatli qatorlarni bitta guruhga joylaydi. Keyin har bir guruh uchun COUNT, SUM yoki AVG kabi aggregate funksiyalarni ishlatamiz. Masalan, har bir foydalanuvchi uchun task'larni sanashimiz mumkin. SELECT'dagi har bir ustun GROUP BY'da yoki aggregate funksiya ichida bo'lishi kerak.",
          example: "SELECT u.name, COUNT(t.id) AS task_count\nFROM users u\nLEFT JOIN tasks t ON t.user_id = u.id\nGROUP BY u.id, u.name\nORDER BY task_count DESC;",
          followUp: 'Why do we use COUNT(t.id) and not COUNT(*) here?',
          level: 'junior',
        },
        {
          q: 'What is a subquery? When do you use it?',
          a: "A subquery is a query inside another query. We can use it in WHERE, in FROM, or in SELECT. For example, we find products that cost more than the average price. Often a JOIN can do the same work, and sometimes it is faster.",
          uz: "Subquery — boshqa query ichidagi query. Uni WHERE'da, FROM'da yoki SELECT'da ishlatishimiz mumkin. Masalan, o'rtacha narxdan qimmat mahsulotlarni topamiz. Ko'pincha JOIN ham xuddi shu ishni qila oladi va ba'zan tezroq ishlaydi.",
          example: "SELECT name, price\nFROM products\nWHERE price > (SELECT AVG(price) FROM products);",
          level: 'junior',
        },
        {
          q: 'How do you find users who have no orders?',
          a: "I use a LEFT JOIN and keep only rows where the order id is NULL. Another way is NOT EXISTS with a subquery. Both are correct. I avoid NOT IN, because it gives wrong results if the subquery returns a NULL.",
          uz: "LEFT JOIN ishlataman va faqat order id NULL bo'lgan qatorlarni qoldiraman. Boshqa usul — subquery bilan NOT EXISTS. Ikkalasi ham to'g'ri. NOT IN'dan qochaman, chunki subquery NULL qaytarsa, u noto'g'ri natija beradi.",
          example: "SELECT u.id, u.name\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id\nWHERE o.id IS NULL;\n\n-- or\nSELECT u.id, u.name\nFROM users u\nWHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);",
          level: 'junior',
        },
        {
          q: 'How do you find the second highest salary?',
          a: "One way is to use a subquery: find the max salary that is less than the overall max. Another way is ORDER BY with DISTINCT, LIMIT, and OFFSET. With window functions, I can use DENSE_RANK and take rank two. I also think about the case when there is no second salary.",
          uz: "Bir usul — subquery ishlatish: umumiy maksimumdan kichik bo'lgan eng katta maoshni topish. Boshqa usul — DISTINCT, LIMIT va OFFSET bilan ORDER BY. Window function'lar bilan DENSE_RANK ishlatib, ikkinchi rank'ni olsam bo'ladi. Ikkinchi maosh yo'q bo'lgan holat haqida ham o'ylayman.",
          example: "SELECT MAX(salary) AS second_highest\nFROM employees\nWHERE salary < (SELECT MAX(salary) FROM employees);\n\n-- or\nSELECT DISTINCT salary\nFROM employees\nORDER BY salary DESC\nLIMIT 1 OFFSET 1;",
          level: 'junior',
        },
        {
          q: 'In what order does the database run the parts of a SELECT query?',
          a: "The logical order is different from the order we write. First FROM and JOIN, then WHERE, then GROUP BY, then HAVING. After that comes SELECT, then ORDER BY, and finally LIMIT. This is why you cannot use a SELECT alias in WHERE, but you can use it in ORDER BY.",
          uz: "Mantiqiy tartib biz yozgan tartibdan farq qiladi. Avval FROM va JOIN, keyin WHERE, keyin GROUP BY, keyin HAVING. Shundan keyin SELECT, keyin ORDER BY va oxirida LIMIT keladi. Shuning uchun SELECT'dagi alias'ni WHERE'da ishlatib bo'lmaydi, lekin ORDER BY'da ishlatsa bo'ladi.",
          level: 'middle',
        },
      ],
      resources: [
        { title: 'PostgreSQL — Joins Between Tables', url: 'https://www.postgresql.org/docs/current/tutorial-join.html' },
        { title: 'PostgreSQL — Aggregate Functions', url: 'https://www.postgresql.org/docs/current/tutorial-agg.html' },
        { title: 'LeetCode — Second Highest Salary', url: 'https://leetcode.com/problems/second-highest-salary/' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'db-window-functions',
      title: 'Window functions: ROW_NUMBER, RANK, DENSE_RANK',
      days: [44],
      summary: "Window function qatorlar to'plami (window) ustida hisob-kitob qiladi, lekin GROUP BY'dan farqli ravishda qatorlarni bitta qatorga yig'maydi — har bir qator o'z joyida qoladi va yoniga natija qo'shiladi. Sintaksis: FUNKSIYA() OVER (PARTITION BY ... ORDER BY ...). PARTITION BY qatorlarni guruhlarga bo'ladi, ORDER BY guruh ichidagi tartibni belgilaydi. ROW_NUMBER har bir qatorga 1, 2, 3... beradi; RANK bir xil qiymatlarga bir xil o'rin beradi va keyingi raqamlarni o'tkazib yuboradi (1, 1, 3); DENSE_RANK o'tkazib yubormaydi (1, 1, 2). LAG/LEAD oldingi/keyingi qatorga qarash, SUM() OVER esa running total uchun ishlatiladi.",
      keyPoints: [
        "Window function qatorlarni yig'maydi — har bir qator qoladi",
        "OVER (PARTITION BY x ORDER BY y)",
        "ROW_NUMBER: 1, 2, 3, 4 — har doim unikal",
        "RANK: 1, 1, 3 — tenglikdan keyin bo'shliq bor",
        "DENSE_RANK: 1, 1, 2 — bo'shliq yo'q",
        "Top-N per group: ROW_NUMBER + CTE/subquery'da WHERE rn <= N",
        "LAG/LEAD — oldingi/keyingi qator; SUM() OVER (ORDER BY ...) — running total",
      ],
      vocab: [
        { en: 'window', uz: "oyna (hisob-kitob qilinadigan qatorlar to'plami)" },
        { en: 'partition', uz: "bo'lim, guruh" },
        { en: 'rank', uz: "o'rin, daraja" },
        { en: 'tie', uz: 'tenglik (bir xil qiymat)' },
        { en: 'running total', uz: "yig'ilib boruvchi jami" },
        { en: 'CTE (WITH clause)', uz: "nomlangan vaqtinchalik so'rov" },
      ],
      questions: [
        {
          q: 'What is a window function? How is it different from GROUP BY?',
          a: "A window function calculates a value over a set of rows, but it does not collapse them. GROUP BY returns one row per group. A window function keeps every row and adds the result next to it. We write it with the OVER clause.",
          uz: "Window function qatorlar to'plami ustida qiymat hisoblaydi, lekin ularni bitta qatorga yig'maydi. GROUP BY har bir guruh uchun bitta qator qaytaradi. Window function esa har bir qatorni saqlab qoladi va natijani uning yoniga qo'shadi. Uni OVER qismi bilan yozamiz.",
          example: "-- each employee with the average salary of their department\nSELECT name, department, salary,\n       AVG(salary) OVER (PARTITION BY department) AS dept_avg\nFROM employees;",
          level: 'junior',
        },
        {
          q: 'What is the difference between ROW_NUMBER, RANK, and DENSE_RANK?',
          a: "All three give a number to each row by order. ROW_NUMBER always gives unique numbers: 1, 2, 3. RANK gives the same number to equal values and then skips: 1, 1, 3. DENSE_RANK also gives the same number to equal values, but does not skip: 1, 1, 2.",
          uz: "Uchalasi ham har bir qatorga tartib bo'yicha raqam beradi. ROW_NUMBER har doim unikal raqam beradi: 1, 2, 3. RANK teng qiymatlarga bir xil raqam beradi va keyin o'tkazib yuboradi: 1, 1, 3. DENSE_RANK ham teng qiymatlarga bir xil raqam beradi, lekin o'tkazib yubormaydi: 1, 1, 2.",
          example: "SELECT name, score,\n       ROW_NUMBER() OVER (ORDER BY score DESC) AS row_num,\n       RANK()       OVER (ORDER BY score DESC) AS rnk,\n       DENSE_RANK() OVER (ORDER BY score DESC) AS dense_rnk\nFROM players;\n\n-- score: 100, 100, 90\n-- row_num: 1, 2, 3 | rnk: 1, 1, 3 | dense_rnk: 1, 1, 2",
          level: 'junior',
        },
        {
          q: 'What does PARTITION BY do?',
          a: "PARTITION BY splits the rows into groups for the window function. The function starts again for each group. For example, with PARTITION BY department, the numbering starts from one in every department. Without PARTITION BY, the whole table is one window.",
          uz: "PARTITION BY window function uchun qatorlarni guruhlarga bo'ladi. Funksiya har bir guruh uchun qaytadan boshlanadi. Masalan, PARTITION BY department bilan raqamlash har bir bo'limda birdan boshlanadi. PARTITION BY bo'lmasa, butun jadval bitta window bo'ladi.",
          level: 'junior',
        },
        {
          q: 'How do you get the top 3 products by sales in each category?',
          a: "I use ROW_NUMBER with PARTITION BY category and ORDER BY sales descending. I cannot filter a window function in WHERE directly. So I put it in a CTE or a subquery and then filter where the row number is three or less. If ties should be included, I use DENSE_RANK instead.",
          uz: "PARTITION BY category va kamayish tartibidagi ORDER BY sales bilan ROW_NUMBER ishlataman. Window function'ni WHERE'da to'g'ridan-to'g'ri filtrlab bo'lmaydi. Shuning uchun uni CTE yoki subquery ichiga qo'yaman va keyin row number uchdan kichik yoki teng bo'lganlarini filtrlayman. Teng qiymatlar ham kirishi kerak bo'lsa, o'rniga DENSE_RANK ishlataman.",
          example: "WITH ranked AS (\n  SELECT category, name, sales,\n         ROW_NUMBER() OVER (PARTITION BY category ORDER BY sales DESC) AS rn\n  FROM products\n)\nSELECT category, name, sales\nFROM ranked\nWHERE rn <= 3;",
          level: 'middle',
        },
        {
          q: 'How do you calculate a running total?',
          a: "I use SUM as a window function with ORDER BY inside OVER. For each row, it adds all values from the first row to the current row. For example, I can show the total revenue day by day. I can add PARTITION BY to start the total again for each month or user.",
          uz: "OVER ichida ORDER BY bilan SUM'ni window function sifatida ishlataman. Har bir qator uchun u birinchi qatordan joriy qatorgacha bo'lgan barcha qiymatlarni qo'shadi. Masalan, umumiy daromadni kunma-kun ko'rsata olaman. Har oy yoki har foydalanuvchi uchun jamini qaytadan boshlash uchun PARTITION BY qo'shsam bo'ladi.",
          example: "SELECT order_date, amount,\n       SUM(amount) OVER (ORDER BY order_date) AS running_total\nFROM daily_sales;",
          level: 'middle',
        },
        {
          q: 'What are LAG and LEAD?',
          a: "LAG gets a value from the previous row, and LEAD gets a value from the next row. We use them to compare rows without a self-join. For example, we can compare today's sales with yesterday's sales.",
          uz: "LAG oldingi qatordan qiymat oladi, LEAD esa keyingi qatordan. Ularni self-join'siz qatorlarni solishtirish uchun ishlatamiz. Masalan, bugungi savdoni kechagi savdo bilan solishtirishimiz mumkin.",
          example: "SELECT day, sales,\n       sales - LAG(sales) OVER (ORDER BY day) AS change\nFROM daily_sales;",
          level: 'middle',
        },
      ],
      resources: [
        { title: 'PostgreSQL — Window Functions (tutorial)', url: 'https://www.postgresql.org/docs/current/tutorial-window.html' },
        { title: 'LeetCode — Department Top Three Salaries', url: 'https://leetcode.com/problems/department-top-three-salaries/' },
        { title: 'LeetCode — Rank Scores', url: 'https://leetcode.com/problems/rank-scores/' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'db-indexes',
      title: 'Index (B-tree) va EXPLAIN',
      days: [46, 48, 49],
      summary: "Index — kitob oxiridagi mundarijaga o'xshash alohida tuzilma: database butun jadvalni o'qimasdan kerakli qatorni tez topadi. PostgreSQL'da default index turi — B-tree: u tartiblangan, muvozanatlangan daraxt bo'lib, qidiruvni O(log n) da bajaradi va =, <, >, BETWEEN hamda ORDER BY uchun ishlaydi. Index o'qishni tezlashtiradi, lekin yozishni sekinlashtiradi, chunki har INSERT/UPDATE/DELETE'da index ham yangilanishi kerak, va qo'shimcha disk joy egallaydi. Query index ishlatayotganini EXPLAIN (yoki haqiqatda ishga tushiradigan EXPLAIN ANALYZE) bilan tekshiramiz: 'Seq Scan' — butun jadval o'qilmoqda, 'Index Scan' — index ishlatilmoqda.",
      keyPoints: [
        "Index o'qishni tezlashtiradi, yozishni sekinlashtiradi va joy egallaydi",
        "B-tree — default; =, <, >, BETWEEN, ORDER BY, LIKE 'abc%' uchun",
        "Primary key va UNIQUE avtomatik index oladi; foreign key esa yo'q (PostgreSQL'da)",
        "Index qo'yiladigan joylar: WHERE, JOIN, ORDER BY'dagi ustunlar, foreign key'lar",
        "Composite index (a, b): a bo'yicha va a+b bo'yicha ishlaydi, faqat b bo'yicha — odatda yo'q",
        "EXPLAIN — reja, EXPLAIN ANALYZE — haqiqiy vaqt; Seq Scan vs Index Scan",
        "Kichik jadval yoki kam tanlanadigan ustunda (masalan boolean) index foyda bermasligi mumkin",
      ],
      vocab: [
        { en: 'index', uz: "tez qidirish uchun ko'rsatkich (mundarija)" },
        { en: 'B-tree', uz: 'muvozanatlangan tartiblangan daraxt' },
        { en: 'full table scan', uz: "butun jadvalni o'qib chiqish" },
        { en: 'query plan', uz: 'query bajarilish rejasi' },
        { en: 'composite index', uz: 'bir necha ustunli index' },
        { en: 'selectivity', uz: 'tanlovchanlik (qancha qator tanlanishi)' },
        { en: 'overhead', uz: "qo'shimcha xarajat" },
      ],
      questions: [
        {
          q: 'What is an index and why does it make queries faster?',
          a: "An index is a separate data structure that helps the database find rows quickly. It works like the index at the end of a book. Without an index, the database reads every row, and this is a full table scan. With a B-tree index, it finds the row in a few steps.",
          uz: "Index — database'ga qatorlarni tez topishga yordam beradigan alohida ma'lumot tuzilmasi. U kitob oxiridagi mundarija kabi ishlaydi. Index bo'lmasa, database har bir qatorni o'qiydi, bu full table scan deyiladi. B-tree index bilan esa qatorni bir necha qadamda topadi.",
          example: "CREATE INDEX idx_tasks_board_id ON tasks (board_id);\n\nSELECT * FROM tasks WHERE board_id = 42;",
          level: 'junior',
        },
        {
          q: 'Why does an index make writes slower?',
          a: "An index makes reads faster but writes slower. When we insert, update, or delete a row, the database must also update every index on that table. More indexes mean more work for each write. Indexes also use extra disk space and memory. So we add only the indexes we really need.",
          uz: "Index o'qishni tezlashtiradi, lekin yozishni sekinlashtiradi. Qator qo'shganimizda, yangilaganimizda yoki o'chirganimizda database o'sha jadvaldagi har bir index'ni ham yangilashi kerak. Index qancha ko'p bo'lsa, har bir yozish uchun ish shuncha ko'p. Index'lar qo'shimcha disk joyi va xotira ham egallaydi. Shuning uchun faqat haqiqatan kerakli index'larni qo'shamiz.",
          level: 'junior',
        },
        {
          q: 'What is a B-tree index?',
          a: "A B-tree is a balanced tree where the keys are kept in sorted order. To find a value, the database goes from the root down to a leaf, so it needs only a few steps, even for millions of rows. Because the data is sorted, a B-tree works well for equal, greater than, less than, range queries, and ORDER BY. It is the default index type in PostgreSQL.",
          uz: "B-tree — kalitlar tartiblangan holda saqlanadigan muvozanatlangan daraxt. Qiymatni topish uchun database root'dan leaf'gacha tushadi, shuning uchun hatto millionlab qatorlar uchun ham bir necha qadam kifoya. Ma'lumot tartiblangani uchun B-tree tenglik, katta, kichik, oraliq (range) query'lar va ORDER BY uchun yaxshi ishlaydi. Bu PostgreSQL'dagi default index turi.",
          followUp: 'What other index types does PostgreSQL have?',
          level: 'middle',
        },
        {
          q: 'How do you check if a query uses an index?',
          a: "I use EXPLAIN before the query to see the query plan. EXPLAIN ANALYZE also runs the query and shows the real time. If I see Seq Scan on a big table, the database reads the whole table. If I see Index Scan, it uses the index.",
          uz: "Query plan'ni ko'rish uchun query oldidan EXPLAIN ishlataman. EXPLAIN ANALYZE query'ni haqiqatan ishga tushiradi va haqiqiy vaqtni ham ko'rsatadi. Katta jadvalda Seq Scan ko'rsam, database butun jadvalni o'qiyapti. Index Scan ko'rsam, u index'dan foydalanyapti.",
          example: "EXPLAIN ANALYZE\nSELECT * FROM tasks WHERE board_id = 42;\n\n-- before index: Seq Scan on tasks ... (actual time=0.02..35.1 ms)\n-- after index:  Index Scan using idx_tasks_board_id on tasks ... (actual time=0.03..0.1 ms)",
          followUp: 'Why can PostgreSQL choose Seq Scan even when an index exists?',
          level: 'junior',
        },
        {
          q: 'Which columns would you add an index to?',
          a: "I add indexes to columns that are often used in WHERE, JOIN, and ORDER BY. Foreign keys are a good example, like tasks.board_id. Primary keys and unique columns already get an index automatically. I check slow queries with EXPLAIN first, and I do not add indexes on every column.",
          uz: "WHERE, JOIN va ORDER BY'da tez-tez ishlatiladigan ustunlarga index qo'shaman. Foreign key'lar yaxshi misol, masalan tasks.board_id. Primary key va unique ustunlar allaqachon avtomatik index oladi. Avval sekin query'larni EXPLAIN bilan tekshiraman va har bir ustunga index qo'ymayman.",
          level: 'junior',
        },
        {
          q: 'What is a composite index and why does the column order matter?',
          a: "A composite index is an index on more than one column, like (user_id, created_at). The order matters because the index is sorted by the first column, then by the second. So it helps queries that filter by user_id, or by user_id and created_at. It usually does not help a query that filters only by created_at.",
          uz: "Composite index — bir nechta ustundagi index, masalan (user_id, created_at). Tartib muhim, chunki index avval birinchi ustun, keyin ikkinchi ustun bo'yicha tartiblangan. Shuning uchun u user_id bo'yicha yoki user_id va created_at bo'yicha filtrlaydigan query'larga yordam beradi. Faqat created_at bo'yicha filtrlaydigan query'ga odatda yordam bermaydi.",
          example: "CREATE INDEX idx_orders_user_created ON orders (user_id, created_at);\n\n-- uses the index\nSELECT * FROM orders WHERE user_id = 7 ORDER BY created_at DESC LIMIT 10;\n\n-- usually cannot use it well\nSELECT * FROM orders WHERE created_at > '2024-01-01';",
          level: 'middle',
        },
        {
          q: 'When is an index not useful?',
          a: "An index does not help much on a very small table, because a full scan is already fast. It is also not useful on a column with few different values, like a boolean, when most rows match. A function on the column, like LOWER(email), can stop the normal index from working. And on tables with a lot of writes, too many indexes slow things down.",
          uz: "Juda kichik jadvalda index unchalik yordam bermaydi, chunki full scan allaqachon tez. Ko'p qatorlar mos keladigan, kam turli qiymatli ustunda ham foydasiz, masalan boolean. Ustundagi funksiya, masalan LOWER(email), oddiy index ishlashini to'xtatib qo'yishi mumkin. Yozish ko'p bo'lgan jadvallarda esa juda ko'p index ishni sekinlashtiradi.",
          example: "-- normal index is not used for this:\nSELECT * FROM users WHERE LOWER(email) = 'a@b.com';\n\n-- solution: an expression index\nCREATE INDEX idx_users_email_lower ON users (LOWER(email));",
          level: 'middle',
        },
      ],
      resources: [
        { title: 'PostgreSQL — Indexes', url: 'https://www.postgresql.org/docs/current/indexes.html' },
        { title: 'PostgreSQL — Using EXPLAIN', url: 'https://www.postgresql.org/docs/current/using-explain.html' },
        { title: 'Use The Index, Luke', url: 'https://use-the-index-luke.com/' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'db-normalization',
      title: 'Normalization (1NF–3NF) va denormalization',
      days: [46, 49],
      summary: "Normalization — ma'lumot takrorlanmasligi va anomaliyalar (bir joyda yangilab, boshqa joyda unutish) bo'lmasligi uchun jadvallarni to'g'ri bo'lish jarayoni. 1NF: har bir katakda bitta atomar qiymat, takrorlanuvchi guruhlar yo'q. 2NF: 1NF + har bir ustun butun primary key'ga bog'liq (composite key'ning faqat bir qismiga emas). 3NF: 2NF + ustunlar faqat key'ga bog'liq, boshqa key bo'lmagan ustunga emas (transitive dependency yo'q). Denormalization — o'qish tezligi uchun ataylab ma'lumotni takrorlash yoki oldindan hisoblab qo'yish (masalan, order_count ustuni); bu o'qishni tezlashtiradi, lekin ma'lumotni sinxron saqlash qiyinlashadi.",
      keyPoints: [
        "Maqsad: takrorlanishni va update/insert/delete anomaliyalarini yo'qotish",
        "1NF — atomar qiymatlar, bitta katakda ro'yxat yo'q",
        "2NF — composite key'ning faqat bir qismiga bog'liq ustun yo'q",
        "3NF — key bo'lmagan ustun boshqa key bo'lmagan ustunga bog'liq emas",
        "Primary key — qatorni unikal aniqlaydi; foreign key — boshqa jadvalga bog'laydi",
        "Denormalization: o'qish ko'p, yozish kam bo'lganda, hisobotlar uchun; narxi — sinxronlash",
        "Buyurtmadagi narxni order_items'da saqlash — to'g'ri 'takrorlash' (o'sha paytdagi narx)",
      ],
      vocab: [
        { en: 'normalization', uz: "normallashtirish (jadvallarni to'g'ri bo'lish)" },
        { en: 'duplication', uz: 'takrorlanish' },
        { en: 'atomic value', uz: "bo'linmas (bitta) qiymat" },
        { en: 'dependency', uz: "bog'liqlik" },
        { en: 'anomaly', uz: 'anomaliya, nomuvofiqlik' },
        { en: 'primary key', uz: 'asosiy kalit' },
        { en: 'denormalize', uz: 'tezlik uchun ataylab takrorlash' },
      ],
      questions: [
        {
          q: 'What is normalization and why do we need it?',
          a: "Normalization is the process of splitting data into tables to avoid duplication. We normalized the tables to avoid duplication and update problems. For example, if the customer address is in every order, we must update it in many places. With normalization, we store it once and link it with a foreign key.",
          uz: "Normalization — takrorlanishning oldini olish uchun ma'lumotni jadvallarga bo'lish jarayoni. Takrorlanish va yangilash muammolarining oldini olish uchun jadvallarni normallashtirdik. Masalan, mijoz manzili har bir buyurtmada bo'lsa, uni ko'p joyda yangilashimiz kerak. Normalization bilan uni bir marta saqlaymiz va foreign key bilan bog'laymiz.",
          level: 'junior',
        },
        {
          q: 'Can you explain 1NF, 2NF, and 3NF?',
          a: "1NF means every cell has one atomic value, so no lists in one column. 2NF means the table is in 1NF and every column depends on the whole primary key, not only part of it. 3NF means the table is in 2NF and non-key columns depend only on the key, not on other non-key columns.",
          uz: "1NF — har bir katakda bitta atomar qiymat bor, ya'ni bitta ustunda ro'yxat yo'q. 2NF — jadval 1NF'da va har bir ustun primary key'ning faqat bir qismiga emas, butun key'ga bog'liq. 3NF — jadval 2NF'da va key bo'lmagan ustunlar boshqa key bo'lmagan ustunlarga emas, faqat key'ga bog'liq.",
          example: "-- Not 1NF: tags = 'red,blue'  → separate table product_tags(product_id, tag)\n\n-- Not 2NF: order_items(order_id, product_id, quantity, product_name)\n--   product_name depends only on product_id → move it to products\n\n-- Not 3NF: users(id, city_id, city_name)\n--   city_name depends on city_id, not on users.id → move it to cities",
          level: 'junior',
        },
        {
          q: 'When would you denormalize data?',
          a: "I denormalize when reads are much more frequent than writes and JOINs become too slow. For example, I can store a comment_count in the posts table instead of counting every time. The trade-off is that reads are faster, but I must keep the copies in sync. So I denormalize only after I measure a real performance problem.",
          uz: "O'qish yozishdan ancha ko'p bo'lganda va JOIN'lar juda sekin bo'lib qolganda denormalize qilaman. Masalan, har safar sanash o'rniga posts jadvalida comment_count saqlashim mumkin. Trade-off shundaki, o'qish tezlashadi, lekin nusxalarni sinxron ushlab turishim kerak. Shuning uchun faqat haqiqiy performance muammosini o'lchaganimdan keyin denormalize qilaman.",
          followUp: 'How would you keep comment_count correct?',
          level: 'middle',
        },
        {
          q: 'What is the difference between a primary key and a foreign key?',
          a: "A primary key uniquely identifies each row in a table, and it cannot be NULL. A foreign key is a column that points to the primary key of another table. It creates a relation, for example tasks.board_id points to boards.id. The database checks that the referenced row really exists.",
          uz: "Primary key jadvaldagi har bir qatorni unikal aniqlaydi va u NULL bo'la olmaydi. Foreign key — boshqa jadvalning primary key'iga ishora qiluvchi ustun. U relation yaratadi, masalan tasks.board_id boards.id'ga ishora qiladi. Database ishora qilingan qator haqiqatan mavjudligini tekshiradi.",
          example: "CREATE TABLE boards (\n  id   SERIAL PRIMARY KEY,\n  name TEXT NOT NULL\n);\n\nCREATE TABLE tasks (\n  id       SERIAL PRIMARY KEY,\n  board_id INT NOT NULL REFERENCES boards(id),\n  title    TEXT NOT NULL\n);",
          level: 'junior',
        },
        {
          q: 'In an online shop, why do we copy the product price into order_items? Is that not duplication?',
          a: "It looks like duplication, but it is correct. The product price can change later, but the order must keep the price at the moment of purchase. So order_items stores its own unit_price. This is history data, not a copy of the current value.",
          uz: "Bu takrorlanishga o'xshaydi, lekin bu to'g'ri. Mahsulot narxi keyinroq o'zgarishi mumkin, lekin buyurtma xarid paytidagi narxni saqlashi kerak. Shuning uchun order_items o'zining unit_price'ini saqlaydi. Bu joriy qiymatning nusxasi emas, tarixiy ma'lumot.",
          level: 'middle',
        },
      ],
      resources: [
        { title: 'PostgreSQL — Constraints (keys)', url: 'https://www.postgresql.org/docs/current/ddl-constraints.html' },
        { title: 'roadmap.sh — SQL', url: 'https://roadmap.sh/sql' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'db-transactions',
      title: 'Transaction, ACID, isolation levels, deadlock',
      days: [47, 49],
      summary: "Transaction — bir nechta query'ni bitta bo'linmas ish sifatida bajarish: yo hammasi muvaffaqiyatli bo'ladi (COMMIT), yo hech biri (ROLLBACK). Klassik misol — pul o'tkazish: bir hisobdan ayirish va boshqasiga qo'shish birga bo'lishi kerak. ACID: Atomicity (hammasi yoki hech narsa), Consistency (qoidalar buzilmaydi), Isolation (parallel transaction'lar bir-biriga xalaqit bermaydi), Durability (COMMIT'dan keyin ma'lumot yo'qolmaydi). Isolation level'lar izolyatsiya va tezlik orasidagi muvozanat: Read Uncommitted, Read Committed (PostgreSQL default), Repeatable Read, Serializable. Deadlock — ikki transaction bir-birining lock'ini kutib qolishi; database bittasini bekor qiladi.",
      keyPoints: [
        "BEGIN → query'lar → COMMIT yoki ROLLBACK",
        "Atomicity, Consistency, Isolation, Durability",
        "Muammolar: dirty read, non-repeatable read, phantom read",
        "Read Committed (PG default) → Repeatable Read → Serializable: izolyatsiya oshadi, parallellik kamayadi",
        "PostgreSQL'da dirty read hech qachon bo'lmaydi",
        "Deadlock: A B'ni kutadi, B A'ni kutadi → database bittasini bekor qiladi, ilova qayta urinadi (retry)",
        "Deadlock'ning oldini olish: lock'larni bir xil tartibda olish, transaction'ni qisqa tutish",
      ],
      vocab: [
        { en: 'transaction', uz: "tranzaksiya (bo'linmas ish birligi)" },
        { en: 'commit', uz: 'tasdiqlash, saqlash' },
        { en: 'rollback', uz: 'bekor qilib orqaga qaytarish' },
        { en: 'isolation level', uz: 'izolyatsiya darajasi' },
        { en: 'lock', uz: 'qulf' },
        { en: 'deadlock', uz: "o'zaro qulflanib qolish" },
        { en: 'concurrent', uz: 'parallel, bir vaqtda' },
        { en: 'durable', uz: "mustahkam, yo'qolmaydigan" },
      ],
      questions: [
        {
          q: 'What is a transaction?',
          a: "A transaction is a group of queries that run as one unit. A transaction is all or nothing. If every query succeeds, we commit. If one query fails, we roll back, and the database returns to the state before the transaction. A classic example is a money transfer between two accounts.",
          uz: "Transaction — bitta birlik sifatida bajariladigan query'lar guruhi. Transaction — yo hammasi, yo hech narsa. Har bir query muvaffaqiyatli bo'lsa, commit qilamiz. Bitta query xato bersa, rollback qilamiz va database transaction'dan oldingi holatga qaytadi. Klassik misol — ikki hisob orasida pul o'tkazish.",
          example: "BEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;\n-- if anything fails: ROLLBACK;",
          level: 'junior',
        },
        {
          q: 'What does ACID mean?',
          a: "ACID is four properties of a transaction. Atomicity means all or nothing. Consistency means the data always follows the rules, like constraints and foreign keys. Isolation means parallel transactions do not see each other's unfinished changes. Durability means that after a commit, the data is saved even if the server crashes.",
          uz: "ACID — transaction'ning to'rtta xususiyati. Atomicity — yo hammasi, yo hech narsa. Consistency — ma'lumot har doim constraint'lar va foreign key'lar kabi qoidalarga amal qiladi. Isolation — parallel transaction'lar bir-birining tugallanmagan o'zgarishlarini ko'rmaydi. Durability — commit'dan keyin server ishdan chiqsa ham ma'lumot saqlanib qoladi.",
          level: 'junior',
        },
        {
          q: 'What isolation levels do you know?',
          a: "There are four standard levels. Read Uncommitted is the weakest. Read Committed sees only committed data, and it is the default in PostgreSQL. Repeatable Read gives the same result if you read the same row again. Serializable is the strictest, and it works as if transactions run one by one. Higher isolation is safer, but slower.",
          uz: "To'rtta standart daraja bor. Read Uncommitted — eng zaifi. Read Committed faqat commit qilingan ma'lumotni ko'radi va u PostgreSQL'da default. Repeatable Read bir qatorni qayta o'qisangiz bir xil natija beradi. Serializable eng qat'iysi va u transaction'lar birin-ketin bajarilgandek ishlaydi. Yuqori izolyatsiya xavfsizroq, lekin sekinroq.",
          followUp: 'Which problems does each level prevent?',
          level: 'middle',
        },
        {
          q: 'What are dirty reads, non-repeatable reads, and phantom reads?',
          a: "A dirty read is when you read data from another transaction that is not committed yet. A non-repeatable read is when you read the same row twice and get different values, because another transaction changed it. A phantom read is when you run the same query twice and get new rows. Higher isolation levels prevent more of these problems.",
          uz: "Dirty read — boshqa transaction'ning hali commit qilinmagan ma'lumotini o'qish. Non-repeatable read — bir qatorni ikki marta o'qiysiz va turli qiymat olasiz, chunki boshqa transaction uni o'zgartirgan. Phantom read — bir query'ni ikki marta ishga tushirasiz va yangi qatorlar paydo bo'ladi. Yuqoriroq isolation level'lar bu muammolarning ko'prog'ini oldini oladi.",
          level: 'middle',
        },
        {
          q: 'What is a deadlock and how do you avoid it?',
          a: "A deadlock happens when two transactions wait for each other's locks, so neither can continue. The database finds it and cancels one transaction with an error. To avoid it, I lock rows in the same order everywhere and keep transactions short. In the app, I catch the deadlock error and retry the transaction.",
          uz: "Deadlock ikki transaction bir-birining lock'ini kutganda yuz beradi, shuning uchun hech biri davom eta olmaydi. Database buni topadi va bitta transaction'ni xato bilan bekor qiladi. Oldini olish uchun qatorlarni hamma joyda bir xil tartibda lock qilaman va transaction'larni qisqa tutaman. Ilovada deadlock xatosini ushlab, transaction'ni qayta urinaman (retry).",
          example: "-- T1: UPDATE accounts ... WHERE id = 1;  then  UPDATE ... WHERE id = 2;\n-- T2: UPDATE accounts ... WHERE id = 2;  then  UPDATE ... WHERE id = 1;\n-- T1 waits for T2, T2 waits for T1 → deadlock\n-- Fix: always update the smaller id first",
          level: 'middle',
        },
        {
          q: 'How do you use a transaction in Spring Boot with PostgreSQL?',
          a: "In Spring Boot, I usually put @Transactional on a service method. Spring opens a transaction before the method starts, and all queries inside use the same connection from the pool. If the method finishes normally, Spring commits. If it throws a runtime exception, Spring rolls back. I keep transactions short and I do not call slow external APIs inside them.",
          uz: "Spring Boot'da odatda service metodiga @Transactional qo'yaman. Spring metod boshlanishidan oldin transaction ochadi va ichidagi barcha query'lar pool'dagi bitta ulanishdan foydalanadi. Metod normal tugasa, Spring commit qiladi. Agar u runtime exception tashlasa, Spring rollback qiladi. Transaction'larni qisqa tutaman va ularning ichida sekin tashqi API'larni chaqirmayman.",
          example: `@Service
public class TransferService {
    private final AccountRepository accounts;

    public TransferService(AccountRepository accounts) {
        this.accounts = accounts;
    }

    @Transactional // BEGIN ... COMMIT, or ROLLBACK on a RuntimeException
    public void transfer(long fromId, long toId, BigDecimal amount) {
        Account from = accounts.findById(fromId).orElseThrow();
        Account to = accounts.findById(toId).orElseThrow();
        from.withdraw(amount); // throws if the balance is too low -> rollback
        to.deposit(amount);
        // no save() needed: JPA dirty checking sends the UPDATEs at commit
    }
}

// Without JPA: JdbcTemplate calls inside the same @Transactional method
jdbcTemplate.update("UPDATE accounts SET balance = balance - ? WHERE id = ?", amount, fromId);
jdbcTemplate.update("UPDATE accounts SET balance = balance + ? WHERE id = ?", amount, toId);`,
          followUp: 'Why does @Transactional not work when you call the method from the same class?',
          level: 'middle',
        },
        {
          q: 'What is the difference between optimistic and pessimistic locking?',
          a: "Pessimistic locking locks the row before changing it, for example with SELECT ... FOR UPDATE. Other transactions must wait. Optimistic locking does not lock. It checks a version column when it saves, and if someone changed the row, the update fails and we retry. Optimistic locking is good when conflicts are rare.",
          uz: "Pessimistic locking qatorni o'zgartirishdan oldin lock qiladi, masalan SELECT ... FOR UPDATE bilan. Boshqa transaction'lar kutishi kerak. Optimistic locking lock qilmaydi. U saqlash paytida version ustunini tekshiradi, agar kimdir qatorni o'zgartirgan bo'lsa, update muvaffaqiyatsiz bo'ladi va qayta urinamiz. Optimistic locking to'qnashuvlar kam bo'lganda yaxshi.",
          example: "-- optimistic\nUPDATE products\nSET stock = stock - 1, version = version + 1\nWHERE id = 5 AND version = 3;\n-- 0 rows updated → someone changed it, retry",
          level: 'middle',
        },
      ],
      resources: [
        { title: 'PostgreSQL — Transactions (tutorial)', url: 'https://www.postgresql.org/docs/current/tutorial-transactions.html' },
        { title: 'PostgreSQL — Transaction Isolation', url: 'https://www.postgresql.org/docs/current/transaction-iso.html' },
        { title: 'PostgreSQL — Explicit Locking (deadlocks)', url: 'https://www.postgresql.org/docs/current/explicit-locking.html' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'db-n-plus-one',
      title: 'N+1 query muammosi va yechimi',
      days: [47, 48, 49],
      summary: "N+1 muammosi — bitta query bilan N ta yozuvni olib, keyin har biri uchun alohida yana bitta query yuborish: jami 1 + N ta query. Masalan, 50 ta board'ni olib, har bir board'ning task'larini alohida so'rash — 51 ta query. Bu ko'pincha ORM'lardagi lazy loading tufayli sezilmasdan yuz beradi va ma'lumot ko'payganda sahifa sekinlashadi. Yechimlar: JOIN, ORM'da eager loading (JPA/Hibernate'da JOIN FETCH yoki @EntityGraph), barcha id'lar uchun bitta WHERE id IN (...) query, GraphQL'da DataLoader. Aniqlash uchun query log'larini yoqamiz yoki bitta request'da nechta query ketayotganini sanaymiz.",
      keyPoints: [
        "1 ta ro'yxat query + har bir element uchun 1 tadan = N+1 query",
        "Sababi ko'pincha JPA/Hibernate'dagi lazy loading (sikl ichida board.getTasks()) yoki sikl ichidagi query",
        "Yechim 1: JOIN bilan bitta query",
        "Yechim 2: JPA'da JOIN FETCH yoki @EntityGraph; yoki Hibernate batch fetching (default_batch_fetch_size)",
        "Yechim 3: batch — WHERE board_id IN (...) yoki = ANY($1), keyin kodda guruhlash",
        "GraphQL'da DataLoader bir xil turdagi so'rovlarni batch qiladi",
        "Aniqlash: query log, APM, request boshiga query soni",
      ],
      vocab: [
        { en: 'N+1 problem', uz: "N+1 muammosi (ortiqcha ko'p query)" },
        { en: 'ORM', uz: "obyekt va jadvallarni bog'lovchi kutubxona" },
        { en: 'lazy loading', uz: "kerak bo'lganda yuklash" },
        { en: 'eager loading', uz: 'oldindan birga yuklash' },
        { en: 'batch', uz: 'bir guruhga jamlab bajarish' },
        { en: 'round trip', uz: "database'ga borib-kelish" },
      ],
      questions: [
        {
          q: 'What is the N+1 query problem?',
          a: "The N+1 problem happens when we run one query to get a list, and then one more query for each item in the list. For example, we load 50 boards and then load tasks for each board separately. That is 51 queries instead of one or two. Each query is a round trip to the database, so the page becomes slow.",
          uz: "N+1 muammosi ro'yxatni olish uchun bitta query, keyin ro'yxatdagi har bir element uchun yana bittadan query yuborganimizda yuz beradi. Masalan, 50 ta board'ni yuklaymiz, keyin har bir board uchun task'larni alohida yuklaymiz. Bu bitta yoki ikkita o'rniga 51 ta query. Har bir query database'ga borib-kelish, shuning uchun sahifa sekinlashadi.",
          example: `// N+1 with JPA: 1 query for boards + 1 query per board (lazy @OneToMany)
List<Board> boards = boardRepository.findByOwnerId(userId); // 1 query
for (Board board : boards) {
    int count = board.getTasks().size();                    // +1 query for EACH board
}

// Hibernate SQL log:
// select ... from boards b where b.owner_id=?
// select ... from tasks t where t.board_id=?   <- repeated N times`,
          level: 'junior',
        },
        {
          q: 'How do you fix the N+1 problem?',
          a: "There are a few ways. I can use a JOIN and get everything in one query. With JPA, I use eager loading for this query: JOIN FETCH in JPQL or @EntityGraph on the repository method. Or I load all children in one query with WHERE board_id IN the list of ids, and then group them in code. In all cases, the number of queries does not grow with the data.",
          uz: "Bir necha usul bor. JOIN ishlatib, hammasini bitta query'da olishim mumkin. JPA'da shu query uchun eager loading ishlataman: JPQL'da JOIN FETCH yoki repository metodida @EntityGraph. Yoki barcha bola yozuvlarni WHERE board_id IN id'lar ro'yxati bilan bitta query'da yuklayman va keyin kodda guruhlayman. Har qanday holatda query'lar soni ma'lumot bilan birga o'smaydi.",
          example: `public interface BoardRepository extends JpaRepository<Board, Long> {

    // 1) JOIN FETCH: boards and their tasks in ONE query
    @Query("select distinct b from Board b left join fetch b.tasks where b.ownerId = :ownerId")
    List<Board> findWithTasksByOwnerId(@Param("ownerId") Long ownerId);

    // 2) @EntityGraph: the same idea without writing JPQL
    @EntityGraph(attributePaths = "tasks")
    List<Board> findAllByOwnerId(Long ownerId);
}

// 3) Batch fetching: Hibernate loads tasks for many boards at once
//    (select ... from tasks where board_id in (?, ?, ?, ...))
// application.yml:
// spring.jpa.properties.hibernate.default_batch_fetch_size: 50`,
          level: 'junior',
        },
        {
          q: 'How do you find N+1 problems in a project?',
          a: "I turn on SQL logging in Hibernate, for example the org.hibernate.SQL logger, or in the database, and look at one request. If I see the same query many times with different ids, it is N+1. APM tools can also show the number of queries per request. In tests, I can count queries and fail the test if there are too many.",
          uz: "Hibernate'da, masalan org.hibernate.SQL logger'i orqali, yoki database'da SQL logging'ni yoqaman va bitta request'ga qarayman. Bir xil query turli id'lar bilan ko'p marta takrorlansa, bu N+1. APM vositalari ham har bir request uchun query'lar sonini ko'rsata oladi. Testlarda query'larni sanab, juda ko'p bo'lsa testni yiqitishim mumkin.",
          level: 'middle',
        },
        {
          q: 'What is the difference between lazy loading and eager loading?',
          a: "Lazy loading loads related data only when you access it. It is simple, but it can cause the N+1 problem in a loop. Eager loading loads the related data together with the main query, with a JOIN or a second batch query. I use eager loading when I know I need the related data.",
          uz: "Lazy loading bog'liq ma'lumotni faqat unga murojaat qilganingizda yuklaydi. Bu oddiy, lekin sikl ichida N+1 muammosiga olib kelishi mumkin. Eager loading bog'liq ma'lumotni asosiy query bilan birga, JOIN yoki ikkinchi batch query orqali yuklaydi. Bog'liq ma'lumot kerakligini bilsam, eager loading ishlataman.",
          level: 'junior',
        },
        {
          q: 'Tell me about a time you fixed a slow database query.',
          a: "In [project], the dashboard page was slow, about [X] seconds. I turned on query logs and saw that the ORM was sending too many queries, one for each board. I changed it to eager loading and added an index on tasks.board_id. I checked the plan with EXPLAIN, and the page became [X] times faster.",
          uz: "[project]'da dashboard sahifasi sekin edi, taxminan [X] soniya. Query log'larni yoqdim va ORM juda ko'p query yuborayotganini ko'rdim — har bir board uchun bittadan. Uni eager loading'ga o'zgartirdim va tasks.board_id'ga index qo'shdim. Rejani EXPLAIN bilan tekshirdim va sahifa [X] marta tezlashdi.",
          followUp: 'How did you measure the result?',
          level: 'middle',
        },
      ],
      resources: [
        { title: 'PostgreSQL — Using EXPLAIN', url: 'https://www.postgresql.org/docs/current/using-explain.html' },
        { title: 'Spring Data JPA — Entity Graphs', url: 'https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html#jpa.entity-graph' },
        { title: 'Hibernate ORM — User Guide (Fetching)', url: 'https://docs.jboss.org/hibernate/orm/6.6/userguide/html_single/Hibernate_User_Guide.html#fetching' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'db-schema-design',
      title: "Schema dizayni, relation'lar, migration'lar",
      days: [45, 46],
      summary: "Schema dizayni entity'larni (users, products, orders) aniqlashdan, keyin ular orasidagi relation'larni belgilashdan boshlanadi. One-to-many (bitta foydalanuvchida ko'p buyurtma) — 'ko'p' tomonidagi jadvalda foreign key bilan. Many-to-many (buyurtmada ko'p mahsulot, mahsulot ko'p buyurtmada) — oraliq (junction) jadval bilan, masalan order_items. One-to-one — unique foreign key bilan. Migration'lar — schema o'zgarishlarini versiyalangan fayllar ko'rinishida saqlash: ular git'da turadi, har bir muhitda bir xil tartibda ishlaydi va orqaga qaytarilishi mumkin. Seed data — development va test uchun boshlang'ich ma'lumot. Pul uchun FLOAT emas, NUMERIC yoki butun son (tiyin/cent) ishlatiladi.",
      keyPoints: [
        "Avval entity'lar, keyin relation'lar, keyin ustunlar va constraint'lar",
        "One-to-many: foreign key 'ko'p' tomonida (orders.user_id)",
        "Many-to-many: junction jadval (order_items, board_members)",
        "Constraint'lar: NOT NULL, UNIQUE, CHECK, FOREIGN KEY, ON DELETE CASCADE",
        "Migration'lar — schema uchun git: versiyalangan, takrorlanadigan, up/down",
        "Seed data — dev/test uchun boshlang'ich ma'lumot",
        "Pul: NUMERIC(10,2) yoki integer (cent), hech qachon FLOAT emas",
      ],
      vocab: [
        { en: 'entity', uz: 'mohiyat (jadvalga aylanadigan obyekt)' },
        { en: 'relation(ship)', uz: "bog'lanish" },
        { en: 'one-to-many', uz: "birga-ko'p" },
        { en: 'many-to-many', uz: "ko'pga-ko'p" },
        { en: 'junction table', uz: "oraliq (bog'lovchi) jadval" },
        { en: 'migration', uz: "schema o'zgarishi fayli" },
        { en: 'seed data', uz: "boshlang'ich test ma'lumoti" },
        { en: 'constraint', uz: 'cheklov (qoida)' },
      ],
      questions: [
        {
          q: 'Design a database for an online shop.',
          a: "I start with the main entities: users, products, categories, orders, and order items. A user has many orders, so orders has a user_id. An order has many products, and a product can be in many orders. So I use an order_items table with order_id, product_id, quantity, and unit_price. I add indexes on the foreign keys and store money as NUMERIC, not FLOAT.",
          uz: "Asosiy entity'lardan boshlayman: users, products, categories, orders va order items. Bitta foydalanuvchida ko'p buyurtma bor, shuning uchun orders'da user_id bor. Bitta buyurtmada ko'p mahsulot bor va bitta mahsulot ko'p buyurtmada bo'lishi mumkin. Shuning uchun order_id, product_id, quantity va unit_price bilan order_items jadvalini ishlataman. Foreign key'larga index qo'shaman va pulni FLOAT emas, NUMERIC sifatida saqlayman.",
          example: `CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE categories (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE products (
  id          SERIAL PRIMARY KEY,
  category_id INT REFERENCES categories(id),
  name        TEXT NOT NULL,
  price       NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock       INT NOT NULL DEFAULT 0 CHECK (stock >= 0)
);

CREATE TABLE orders (
  id         SERIAL PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(id),
  status     TEXT NOT NULL DEFAULT 'pending',
  total      NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  order_id   INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id),
  quantity   INT NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL,
  PRIMARY KEY (order_id, product_id)
);

CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_order_items_product_id ON order_items (product_id);`,
          followUp: 'How would you make sure two users cannot buy the last item at the same time?',
          level: 'middle',
        },
        {
          q: 'Design a database for a task manager with users, boards, and tasks.',
          a: "A user can own many boards, and a board has many tasks, so these are one-to-many relations. If many users can work on one board, I add a board_members table for the many-to-many relation, with a role column. A task has a board_id, an optional assignee_id, a status, and a position for ordering. I add indexes on board_id and assignee_id.",
          uz: "Bitta foydalanuvchi ko'p board'ga ega bo'lishi mumkin, bitta board'da esa ko'p task bor, shuning uchun bular one-to-many relation'lar. Agar bitta board'da ko'p foydalanuvchi ishlasa, many-to-many relation uchun role ustuni bilan board_members jadvalini qo'shaman. Task'da board_id, ixtiyoriy assignee_id, status va tartiblash uchun position bor. board_id va assignee_id'ga index qo'shaman.",
          example: `CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL
);

CREATE TABLE boards (
  id       SERIAL PRIMARY KEY,
  owner_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name     TEXT NOT NULL
);

CREATE TABLE board_members (
  board_id INT NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  user_id  INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role     TEXT NOT NULL DEFAULT 'member',
  PRIMARY KEY (board_id, user_id)
);

CREATE TABLE tasks (
  id          SERIAL PRIMARY KEY,
  board_id    INT NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  assignee_id INT REFERENCES users(id) ON DELETE SET NULL,
  title       TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  position    INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tasks_board_id ON tasks (board_id);
CREATE INDEX idx_tasks_assignee_id ON tasks (assignee_id);`,
          level: 'middle',
        },
        {
          q: 'How do you model one-to-many and many-to-many relations?',
          a: "For one-to-many, I put a foreign key on the 'many' side. For example, orders.user_id points to users.id. For many-to-many, I create a junction table with two foreign keys. For example, order_items has order_id and product_id. The junction table can also have extra columns, like quantity.",
          uz: "One-to-many uchun foreign key'ni 'ko'p' tomonga qo'yaman. Masalan, orders.user_id users.id'ga ishora qiladi. Many-to-many uchun ikkita foreign key'li junction jadval yarataman. Masalan, order_items'da order_id va product_id bor. Junction jadvalda quantity kabi qo'shimcha ustunlar ham bo'lishi mumkin.",
          level: 'junior',
        },
        {
          q: 'What are database migrations and why do we use them?',
          a: "A migration is a file that describes one change to the schema, like creating a table or adding a column. Migrations are stored in git and run in order. So every developer and every server gets the same schema. Most tools can also roll a migration back.",
          uz: "Migration — schema'dagi bitta o'zgarishni tasvirlaydigan fayl, masalan jadval yaratish yoki ustun qo'shish. Migration'lar git'da saqlanadi va tartib bilan ishga tushadi. Shuning uchun har bir dasturchi va har bir server bir xil schema'ga ega bo'ladi. Ko'pchilik vositalar migration'ni orqaga qaytara (rollback) ham oladi.",
          example: "-- migrations/003_add_due_date_to_tasks.sql\nALTER TABLE tasks ADD COLUMN due_date DATE;\n\n-- down\nALTER TABLE tasks DROP COLUMN due_date;",
          followUp: 'How do you add a NOT NULL column to a big table without downtime?',
          level: 'junior',
        },
        {
          q: 'What is seed data?',
          a: "Seed data is starting data that we put into the database for development or tests. For example, a test user, a few boards, and some tasks. It helps every developer start with the same data. We never use real user data for seeds.",
          uz: "Seed data — development yoki testlar uchun database'ga qo'yadigan boshlang'ich ma'lumot. Masalan, test foydalanuvchi, bir nechta board va bir qancha task. Bu har bir dasturchiga bir xil ma'lumot bilan boshlashga yordam beradi. Seed uchun hech qachon haqiqiy foydalanuvchi ma'lumotlarini ishlatmaymiz.",
          level: 'junior',
        },
        {
          q: 'What does ON DELETE CASCADE do? When would you not use it?',
          a: "ON DELETE CASCADE deletes the child rows when the parent row is deleted. For example, if we delete a board, its tasks are deleted too. I would not use it for important data like orders, because one delete can remove a lot of history. In that case I use RESTRICT or a soft delete with a deleted_at column.",
          uz: "ON DELETE CASCADE ota qator o'chirilganda bola qatorlarni ham o'chiradi. Masalan, board'ni o'chirsak, uning task'lari ham o'chiriladi. Buyurtmalar kabi muhim ma'lumot uchun uni ishlatmagan bo'lardim, chunki bitta delete ko'p tarixni o'chirib yuborishi mumkin. Bunday holatda RESTRICT yoki deleted_at ustuni bilan soft delete ishlataman.",
          level: 'middle',
        },
        {
          q: 'How do you store money in a database?',
          a: "I never use FLOAT for money, because floating point numbers have rounding errors. I use NUMERIC with a fixed scale, like NUMERIC(10, 2). Another common way is to store an integer in the smallest unit, like cents. I also store the currency if the app supports more than one.",
          uz: "Pul uchun hech qachon FLOAT ishlatmayman, chunki floating point sonlarda yaxlitlash xatolari bor. NUMERIC(10, 2) kabi qat'iy aniqlikdagi NUMERIC ishlataman. Yana bir keng tarqalgan usul — eng kichik birlikda, masalan cent'da, butun son saqlash. Ilova bir nechta valyutani qo'llasa, valyutani ham saqlayman.",
          example: "-- Java (double) va JavaScript: 0.1 + 0.2 = 0.30000000000000004\n-- Java'da pul uchun BigDecimal, PostgreSQL'da NUMERIC\nprice NUMERIC(10, 2) NOT NULL\n-- or\nprice_cents INTEGER NOT NULL",
          level: 'junior',
        },
      ],
      resources: [
        { title: 'PostgreSQL — Constraints', url: 'https://www.postgresql.org/docs/current/ddl-constraints.html' },
        { title: 'PostgreSQL — Data Types', url: 'https://www.postgresql.org/docs/current/datatype.html' },
        { title: 'Spring Data JPA — Reference', url: 'https://docs.spring.io/spring-data/jpa/reference/' },
      ],
    },
  ],
}

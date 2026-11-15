export default {
  id: 'java',
  title: 'Java Core',
  icon: '☕',
  intro: "JVM qanday ishlashi, OOP, Collections, exception'lar, Stream API, concurrency va testing — Java backend dasturchisi bilishi shart bo'lgan asoslar. Spring'ga o'tishdan oldin intervyuer aynan shu poydevorni tekshiradi: HashMap ichini, equals/hashCode'ni, thread-safety'ni tushunmagan odam Spring'da ham xato qiladi.",
  topics: [
    // ─────────────────────────────────────────────
    {
      id: 'java-how-it-works',
      title: 'Java qanday ishlaydi: JVM, memory, GC',
      days: [13],
      summary: "Java kodi avval `javac` bilan bytecode'ga (.class fayl) compile qilinadi, keyin bu bytecode'ni JVM bajaradi — shuning uchun bitta .class fayl Windows'da ham, Linux'da ham ishlaydi. JDK = JRE + dasturchi tool'lari (javac, jar, jdb), JRE = JVM + standart kutubxonalar. JVM kodni avval interpret qiladi, ko'p chaqiriladigan (hot) joylarni esa JIT compiler native machine code'ga aylantiradi. Xotira ikki asosiy qismga bo'linadi: stack (har thread'ning method chaqiruvlari va local o'zgaruvchilari) va heap (barcha object'lar). Heap'dagi keraksiz object'larni Garbage Collector avtomatik tozalaydi. Java'da hamma narsa pass-by-value: object uzatilganda uning reference'i nusxalanadi. String immutable va literal'lar String pool'da saqlanadi.",
      keyPoints: [
        "JDK (dasturlash uchun) ⊃ JRE (ishga tushirish uchun) ⊃ JVM (bytecode'ni bajaradi)",
        "`.java` → `javac` → `.class` (bytecode) → JVM: class loader → interpreter + JIT",
        "Stack: method frame'lar, local o'zgaruvchilar, primitive'lar va reference'lar. Har thread'da alohida",
        "Heap: barcha object'lar va array'lar. Hamma thread'lar uchun umumiy, GC shu yerni tozalaydi",
        "GC: young generation (Eden + Survivor) va old generation. Java 9'dan beri default — G1",
        "StackOverflowError — juda chuqur rekursiya; OutOfMemoryError — heap'da joy qolmadi",
        "Java doim pass-by-value: object uchun reference'ning nusxasi uzatiladi",
        "String immutable; literal'lar String pool'da qayta ishlatiladi; `==` emas, `equals()` bilan solishtiring",
      ],
      lesson: [
        {
          title: "JDK, JRE, JVM va kod yo'li",
          body: "Java'ning asosiy g'oyasi — \"write once, run anywhere\". Buning uchun kod to'g'ridan-to'g'ri processor uchun emas, oraliq til — **bytecode** uchun compile qilinadi. Bytecode'ni esa har bir OS uchun alohida yozilgan **JVM** (Java Virtual Machine) bajaradi.\n\n- **JVM** — bytecode'ni bajaradigan virtual mashina. Xotira, GC, JIT — hammasi shu yerda.\n- **JRE** — JVM + standart kutubxonalar (`java.lang`, `java.util` va h.k.). Faqat ishga tushirish uchun yetarli.\n- **JDK** — JRE + dasturchi tool'lari: `javac`, `jar`, `javadoc`, `jshell`. Kod yozish uchun JDK kerak. Java 11'dan beri alohida JRE deyarli tarqatilmaydi — odatda JDK o'rnatiladi.\n\nKod yo'li qadam-baqadam:\n\n1. `javac Hello.java` — source kod tekshiriladi va `Hello.class` (bytecode) yaratiladi.\n2. `java Hello` — JVM ishga tushadi va **class loader** `Hello.class`'ni yuklaydi.\n3. Bytecode verifier kod xavfsiz ekanini tekshiradi.\n4. Interpreter bytecode'ni qatorma-qator bajaradi.\n5. Ko'p chaqiriladigan method'larni (hot code) **JIT compiler** native machine code'ga aylantiradi — shundan keyin ular C++ tezligiga yaqin ishlaydi.\n\nClass loading **lazy**: class birinchi marta kerak bo'lganda yuklanadi, oldindan emas. Class loader'lar ierarxiyasi bor: Bootstrap (java.lang.*), Platform, Application (sizning class'laringiz). Yuklashda **parent delegation** ishlaydi: loader avval otasidan so'raydi — shuning uchun hech kim o'zining soxta `java.lang.String`'ini yuklay olmaydi.\n\nShuning uchun Java ilovalari ishga tushganda biroz sekin (warm-up), keyin esa tezlashadi — JIT hot kodni optimallashtirib bo'lgan bo'ladi.",
          code: `// Hello.java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, JVM!");
    }
}

// Terminal:
// $ javac Hello.java      -> Hello.class (bytecode) yaratiladi
// $ java Hello            -> JVM class'ni yuklaydi va main() ni chaqiradi
// $ javap -c Hello        -> bytecode'ni ko'rish (getstatic, ldc, invokevirtual ...)
// Java 11+ : $ java Hello.java  -> compile + run bitta buyruqda`,
          lang: 'java',
        },
        {
          title: 'Stack va Heap: nima qayerda yashaydi',
          body: "JVM xotirasining ikki asosiy qismi bor.\n\n**Stack** — har bir thread'ning o'z stack'i bor. Method chaqirilganda stack'ga yangi **frame** qo'shiladi: unda method parametrlari va local o'zgaruvchilar turadi. Method tugashi bilan frame o'chadi — GC kerak emas, juda tez. Stack'da primitive qiymatlar (`int`, `double`, `boolean`) va object'larga **reference**'lar (manzil) saqlanadi.\n\n**Heap** — barcha thread'lar uchun umumiy xotira. `new` bilan yaratilgan har bir object va array shu yerda yashaydi. Object'ning field'lari ham (hatto primitive field'lar ham) object bilan birga heap'da bo'ladi. Heap'ni Garbage Collector tozalaydi.\n\nYana **Metaspace** bor (Java 8+): class'lar haqidagi metadata (method'lar, field'lar tavsifi) shu yerda, heap'dan tashqarida.\n\nNega bu muhim? Stack'dagi local o'zgaruvchilar boshqa thread'ga ko'rinmaydi — ular thread-safe. Heap'dagi object'ni esa bir nechta thread bir vaqtda o'zgartirishi mumkin — concurrency muammolari aynan shu yerdan boshlanadi.\n\nKo'p uchraydigan xato: \"primitive'lar doim stack'da\" deyish. To'g'risi: **local** primitive'lar stack'da, object ichidagi primitive field'lar esa heap'da.",
          code: `public class Memory {
    public static void main(String[] args) {
        int count = 5;                     // stack: qiymat 5 ning o'zi
        User user = new User("Ali", 30);   // stack: 'user' reference; heap: User object
        int[] scores = {90, 85};           // stack: reference; heap: array
        greet(user);                       // yangi frame stack'ga qo'shiladi
    }                                      // main tugadi -> frame o'chdi, object'lar GC uchun tayyor

    static void greet(User u) {            // 'u' — xuddi shu object'ga yana bir reference
        String msg = "Hi, " + u.name();    // msg reference stack'da, String object heap'da
        System.out.println(msg);
    }
}

record User(String name, int age) {}       // name va age field'lari heap'da, object ichida`,
          lang: 'java',
        },
        {
          title: 'Garbage Collection qanday ishlaydi',
          body: "Java'da `free()` yoki `delete` yo'q — xotirani **Garbage Collector** (GC) bo'shatadi. GC qaysi object keraksizligini **reachability** orqali aniqlaydi: **GC roots**'dan (stack'dagi local o'zgaruvchilar, static field'lar, aktiv thread'lar) reference zanjiri orqali yetib bo'lmaydigan object — \"axlat\". Shuning uchun bir-biriga ishora qiladigan ikki object (cycle) ham, agar root'dan yetib bo'lmasa, tozalanadi.\n\n**Generational hypothesis**: ko'p object'lar juda qisqa yashaydi (masalan, bitta request uchun yaratilgan DTO). Shuning uchun heap bo'linadi:\n\n- **Young generation** — Eden + ikkita Survivor space. Yangi object'lar Eden'da tug'iladi. Eden to'lsa **minor GC** bo'ladi: tirik object'lar Survivor'ga ko'chiriladi, qolgani bir zarbada tozalanadi. Bu tez.\n- **Old generation** — bir necha minor GC'dan omon qolgan object'lar shu yerga \"ko'chadi\" (promotion). Masalan, cache yoki Spring bean'lari. Bu yerni tozalash (major/full GC) qimmatroq.\n\nGC paytida ilova to'xtashi mumkin — bu **stop-the-world pause**. Zamonaviy collector'lar pauzani kamaytirishga harakat qiladi:\n\n- **G1** — Java 9'dan beri default. Heap'ni ko'plab kichik region'larga bo'ladi va avval eng ko'p axlati bor region'larni tozalaydi. Pauza vaqtini maqsad qilib qo'yish mumkin (`-XX:MaxGCPauseMillis`).\n- **ZGC** — juda katta heap'lar uchun, pauzalar millisekundlardan kam.\n\nKo'p uchraydigan xato: \"Java'da memory leak bo'lmaydi\". Bo'ladi! Agar object'ga keraksiz reference qolsa (masalan, hech qachon tozalanmaydigan `static Map` cache), GC uni tozalay olmaydi va heap asta-sekin to'ladi.",
          code: `public class LeakExample {
    // static field — GC root. Bu Map'dagi hamma narsa abadiy "tirik"
    private static final Map<String, byte[]> CACHE = new HashMap<>();

    void handleRequest(String requestId) {
        byte[] data = new byte[1024 * 1024];   // 1 MB
        CACHE.put(requestId, data);            // hech qachon o'chirilmaydi -> memory leak
    }
}

// Yechim: o'lchami cheklangan cache (masalan, Caffeine), yoki ishdan keyin remove().
// Heap hajmini berish:  java -Xms512m -Xmx2g -jar app.jar
// GC log'larini ko'rish: java -Xlog:gc -jar app.jar`,
          lang: 'java',
        },
        {
          title: 'StackOverflowError va OutOfMemoryError',
          body: "Ikkalasi ham `Error` — ya'ni JVM darajasidagi jiddiy muammo, odatda ularni catch qilmaymiz.\n\n**StackOverflowError** — thread'ning stack'i to'lib qoldi. Deyarli doim sababi — tugamaydigan yoki juda chuqur rekursiya. Har bir chaqiruv yangi frame qo'shadi va stack hajmi cheklangan (odatda ~512 KB – 1 MB, `-Xss` bilan o'zgartiriladi).\n\n**OutOfMemoryError** — heap'da yangi object uchun joy yo'q va GC ham joy bo'shata olmadi. Sabablari: memory leak, juda katta ma'lumotni birdaniga xotiraga yuklash (masalan, 1 million qatorni bitta `List`'ga), yoki `-Xmx` juda kichik. Boshqa turlari ham bor: `Metaspace` (juda ko'p class yuklangan), `unable to create native thread`.\n\nQanday tekshiramiz: OOM bo'lganda heap dump olamiz (`-XX:+HeapDumpOnOutOfMemoryError`) va uni Eclipse MAT yoki VisualVM'da ochib, qaysi object'lar ko'p joy egallaganini ko'ramiz.\n\nInterview'da qanday aytish kerak: \"StackOverflowError is about the stack of one thread, usually deep recursion. OutOfMemoryError is about the heap, usually a memory leak or too much data.\"",
          code: `// StackOverflowError: base case yo'q
static int factorial(int n) {
    return n * factorial(n - 1);   // hech qachon to'xtamaydi
}

// To'g'risi:
static long factorialFixed(int n) {
    if (n <= 1) return 1;          // base case
    return n * factorialFixed(n - 1);
}

// OutOfMemoryError: hamma narsani xotiraga yig'ish
List<byte[]> list = new ArrayList<>();
while (true) {
    list.add(new byte[10 * 1024 * 1024]);  // har safar 10 MB, hech biri bo'shamaydi
}`,
          lang: 'java',
        },
        {
          title: 'Pass-by-value: reference ham nusxalanadi',
          body: "Bu klassik intervyu savoli. Java'da **faqat pass-by-value** bor.\n\n- Primitive uzatilsa — qiymatning nusxasi uzatiladi. Method ichida o'zgartirish tashqariga ta'sir qilmaydi.\n- Object uzatilsa — **reference'ning nusxasi** uzatiladi. Ikkala reference ham bitta object'ga qaraydi. Shuning uchun object'ning **ichini** o'zgartirsangiz (`user.setName(...)`), tashqarida ham ko'rinadi. Lekin parametrga **yangi object** bersangiz (`user = new User()`), bu faqat local nusxani o'zgartiradi — chaqirgan joydagi o'zgaruvchi eski object'ga qarab turaveradi.\n\nAgar Java'da pass-by-reference bo'lganida edi, `swap(a, b)` method'ini yozish mumkin bo'lardi. Lekin Java'da bunday swap ishlamaydi — bu eng yaxshi isbot.\n\nKo'p uchraydigan xato: \"object'lar reference bo'yicha uzatiladi\" deyish. Intervyuer aynan shu jumlani kutib turadi. To'g'ri javob: \"references are passed by value\".",
          code: `class Box { int value; Box(int v) { value = v; } }

static void change(int x, Box box) {
    x = 100;               // local nusxa o'zgardi, tashqariga ta'sir yo'q
    box.value = 100;       // object ichi o'zgardi -> tashqarida ham ko'rinadi
    box = new Box(999);    // local reference endi boshqa object'ga qaraydi
    box.value = 555;       // yangi object o'zgardi, eski emas
}

public static void main(String[] args) {
    int a = 1;
    Box b = new Box(1);
    change(a, b);
    System.out.println(a);        // 1
    System.out.println(b.value);  // 100  (555 emas!)
}`,
          lang: 'java',
        },
        {
          title: 'String pool va immutability',
          body: "`String` — **immutable**: yaratilgandan keyin uni o'zgartirib bo'lmaydi. `concat()`, `toUpperCase()`, `replace()` kabi method'lar doim **yangi** String qaytaradi.\n\nNega immutable qilingan?\n\n- **String pool** ishlashi uchun: bir xil literal'lar (`\"hello\"`) heap ichidagi maxsus pool'da bitta object sifatida saqlanadi va qayta ishlatiladi. Agar String o'zgaruvchan bo'lganida, bitta joydagi o'zgarish hamma joyni buzardi.\n- **Xavfsizlik**: fayl yo'llari, URL, parol, class nomlari String — ularni tekshirgandan keyin hech kim o'zgartira olmaydi.\n- **Thread-safety**: immutable object'ni sinxronizatsiyasiz bemalol bo'lishish mumkin.\n- **hashCode cache**: String hashCode'ni bir marta hisoblab saqlaydi — HashMap key sifatida juda tez.\n\n`==` reference'larni (manzilni) solishtiradi, `equals()` esa matnni. Literal'lar pool'dan kelgani uchun `==` ba'zan tasodifan `true` beradi — bu xavfli illyuziya. Doim `equals()` ishlating.\n\nLoop ichida `+` bilan String yig'ish har safar yangi object yaratadi. Ko'p qo'shish kerak bo'lsa — `StringBuilder` (mutable, bitta buffer).",
          code: `String a = "hello";               // pool'dan
String b = "hello";               // xuddi shu pool object'i
String c = new String("hello");   // heap'da YANGI object (pool'dan tashqari)

System.out.println(a == b);       // true  — bitta object
System.out.println(a == c);       // false — har xil object
System.out.println(a.equals(c));  // true  — matn bir xil
System.out.println(a == c.intern()); // true — intern() pool'dagini qaytaradi

String s = "java";
s.toUpperCase();                  // natija tashlab yuborildi, s o'zgarmadi
s = s.toUpperCase();              // to'g'ri: yangi object'ni saqlaymiz

// Loop'da: StringBuilder
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i).append(',');
}
String result = sb.toString();`,
          lang: 'java',
        },
      ],
      vocab: [
        { en: 'bytecode', uz: "JVM tushunadigan oraliq kod (.class fayl)" },
        { en: 'heap', uz: "object'lar saqlanadigan umumiy xotira" },
        { en: 'stack frame', uz: "method chaqiruvi uchun stack'dagi joy" },
        { en: 'garbage collector', uz: "keraksiz object'larni tozalovchi" },
        { en: 'reachable', uz: "(root'dan) yetib boriladigan" },
        { en: 'immutable', uz: "o'zgarmas" },
        { en: 'warm-up', uz: "ishga tushgandan keyin qizish (JIT optimallashtirguncha)" },
        { en: 'memory leak', uz: "xotira oqishi — keraksiz object'lar tozalanmasligi" },
      ],
      questions: [
        {
          q: 'What is the difference between JDK, JRE, and JVM?',
          a: "The JVM is the virtual machine that runs Java bytecode. The JRE is the JVM plus the standard libraries, so it is enough to run a Java program. The JDK is the JRE plus developer tools like javac and jar. So, to write and compile code you need the JDK, and to only run code the JRE is enough.",
          uz: "JVM — Java bytecode'ni bajaradigan virtual mashina. JRE — JVM va standart kutubxonalar, ya'ni Java dasturni ishga tushirish uchun yetarli. JDK — JRE va javac, jar kabi dasturchi tool'lari. Demak, kod yozish va compile qilish uchun JDK kerak, faqat ishga tushirish uchun JRE yetarli.",
          followUp: 'Why is Java called platform independent?',
          level: 'junior',
        },
        {
          q: 'How does Java code run? What happens after you write a .java file?',
          a: "First, javac compiles the .java file into bytecode in a .class file. Then the JVM starts, and the class loader loads the class when it is needed. The interpreter runs the bytecode. For hot code that runs many times, the JIT compiler makes native machine code, so it becomes much faster.",
          uz: "Avval javac .java faylni .class fayldagi bytecode'ga compile qiladi. Keyin JVM ishga tushadi va class loader class'ni kerak bo'lganda yuklaydi. Interpreter bytecode'ni bajaradi. Ko'p marta ishlaydigan hot kod uchun JIT compiler native machine code yaratadi, shuning uchun u ancha tezlashadi.",
          followUp: 'What is JIT compilation?',
          level: 'junior',
        },
        {
          q: 'What is the difference between the stack and the heap in Java?',
          a: "Each thread has its own stack. It keeps method frames, local variables, and references, and it is cleaned automatically when a method returns. The heap is shared by all threads, and all objects live there. The garbage collector cleans the heap. Local variables on the stack are thread-safe, but objects on the heap can be shared.",
          uz: "Har bir thread'ning o'z stack'i bor. Unda method frame'lar, local o'zgaruvchilar va reference'lar saqlanadi, method tugaganda u avtomatik tozalanadi. Heap barcha thread'lar uchun umumiy va hamma object'lar shu yerda yashaydi. Heap'ni garbage collector tozalaydi. Stack'dagi local o'zgaruvchilar thread-safe, heap'dagi object'lar esa bo'lishilishi mumkin.",
          example: `void demo() {
    int n = 10;                 // stack
    List<String> list = new ArrayList<>(); // reference: stack, object: heap
}`,
          level: 'junior',
        },
        {
          q: 'How does garbage collection work in Java?',
          a: "The GC removes objects that are not reachable from GC roots, like local variables and static fields. The heap is split into young and old generations. New objects are created in the young generation, and most of them die quickly, so minor GC is fast. Objects that live long move to the old generation. The default collector since Java 9 is G1.",
          uz: "GC GC root'lardan, masalan local o'zgaruvchilar va static field'lardan, yetib bo'lmaydigan object'larni o'chiradi. Heap young va old generation'ga bo'lingan. Yangi object'lar young generation'da yaratiladi va ularning ko'pchiligi tez o'ladi, shuning uchun minor GC tez. Uzoq yashaydigan object'lar old generation'ga ko'chadi. Java 9'dan beri default collector — G1.",
          followUp: 'Can you have a memory leak in Java?',
          level: 'middle',
        },
        {
          q: 'Can you have a memory leak in Java?',
          a: "Yes, you can. The GC only removes objects with no references. If we keep references that we do not need, for example in a static map that never gets cleaned, these objects stay in memory forever. Over time the heap fills up and we get OutOfMemoryError. To find it, I take a heap dump and check it in a tool like Eclipse MAT.",
          uz: "Ha, bo'lishi mumkin. GC faqat reference'i yo'q object'larni o'chiradi. Agar bizga kerak bo'lmagan reference'larni saqlab qolsak, masalan hech qachon tozalanmaydigan static map'da, bu object'lar xotirada abadiy qoladi. Vaqt o'tib heap to'ladi va OutOfMemoryError olamiz. Uni topish uchun heap dump olaman va Eclipse MAT kabi tool'da tekshiraman.",
          level: 'middle',
        },
        {
          q: 'What is the difference between StackOverflowError and OutOfMemoryError?',
          a: "StackOverflowError happens when the stack of a thread is full. The usual reason is very deep or infinite recursion. OutOfMemoryError happens when the heap is full and the GC cannot free enough space. The usual reasons are a memory leak or loading too much data at once. Both are Errors, so we usually do not catch them.",
          uz: "StackOverflowError thread'ning stack'i to'lganda yuz beradi. Odatiy sababi — juda chuqur yoki cheksiz rekursiya. OutOfMemoryError heap to'lganda va GC yetarli joy bo'shata olmaganda yuz beradi. Odatiy sabablari — memory leak yoki birdaniga juda ko'p ma'lumot yuklash. Ikkalasi ham Error, shuning uchun odatda ularni catch qilmaymiz.",
          level: 'junior',
        },
        {
          q: 'Is Java pass-by-value or pass-by-reference?',
          a: "Java is always pass-by-value. For primitives, the method gets a copy of the value. For objects, the method gets a copy of the reference. So the method can change the fields of the object, and the caller will see it. But if the method assigns a new object to the parameter, the caller does not see it.",
          uz: "Java doim pass-by-value. Primitive'lar uchun method qiymatning nusxasini oladi. Object'lar uchun method reference'ning nusxasini oladi. Shuning uchun method object field'larini o'zgartira oladi va chaqirgan tomon buni ko'radi. Lekin method parametrga yangi object bersa, chaqirgan tomon buni ko'rmaydi.",
          example: `static void rename(User u) {
    u.setName("Bob");     // caller sees "Bob"
    u = new User("Tom");  // caller does NOT see "Tom"
}`,
          followUp: 'Can you write a swap method in Java?',
          level: 'junior',
        },
        {
          q: 'Why is String immutable in Java?',
          a: "There are a few reasons. First, it makes the String pool possible, because many variables can safely share one object. Second, it is good for security, because file paths or passwords cannot change after we check them. Third, immutable objects are thread-safe. Also, String can cache its hashCode, so it is a fast key in a HashMap.",
          uz: "Bir nechta sabab bor. Birinchidan, bu String pool'ni mumkin qiladi, chunki ko'p o'zgaruvchi bitta object'ni xavfsiz bo'lishishi mumkin. Ikkinchidan, xavfsizlik uchun yaxshi, chunki fayl yo'llari yoki parollar tekshirilgandan keyin o'zgara olmaydi. Uchinchidan, immutable object'lar thread-safe. Yana String o'z hashCode'ini cache qila oladi, shuning uchun HashMap'da tez key bo'ladi.",
          followUp: 'What is the difference between String, StringBuilder, and StringBuffer?',
          level: 'junior',
        },
        {
          q: 'What is the difference between == and equals() for strings?',
          a: "The == operator compares references, so it checks if two variables point to the same object. The equals() method compares the content, the actual characters. Sometimes == returns true for literals because of the String pool, but this is not reliable. So we should always use equals() to compare strings.",
          uz: "== operatori reference'larni solishtiradi, ya'ni ikki o'zgaruvchi bitta object'ga qarab turganini tekshiradi. equals() method'i esa mazmunni, ya'ni haqiqiy belgilarni solishtiradi. Ba'zan String pool tufayli literal'lar uchun == true qaytaradi, lekin bunga ishonib bo'lmaydi. Shuning uchun string'larni doim equals() bilan solishtirishimiz kerak.",
          example: `String a = "hi";
String b = new String("hi");
a == b;        // false
a.equals(b);   // true`,
          level: 'junior',
        },
      ],
      resources: [
        { title: 'Baeldung — JVM vs JRE vs JDK', url: 'https://www.baeldung.com/jvm-vs-jre-vs-jdk' },
        { title: 'Oracle — Garbage Collection Tuning Guide (Java 21)', url: 'https://docs.oracle.com/en/java/javase/21/gctuning/introduction-garbage-collection-tuning.html' },
        { title: 'Baeldung — Pass-by-value in Java', url: 'https://www.baeldung.com/java-pass-by-value-or-pass-by-reference' },
        { title: 'Baeldung — Guide to Java String Pool', url: 'https://www.baeldung.com/java-string-pool' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'java-oop',
      title: "OOP Java'da: 4 tamoyil, interface, equals/hashCode, SOLID",
      days: [22, 24],
      summary: "Java — object-oriented til: kod class'lar atrofida quriladi, class — shablon, object — uning heap'dagi nusxasi. OOP'ning 4 tamoyili: encapsulation (ma'lumotni yashirish va faqat method orqali o'zgartirish), inheritance (`extends` orqali kodni qayta ishlatish), polymorphism (bitta reference turi orqali har xil xatti-harakat) va abstraction (interface yoki abstract class orqali \"nima qiladi\"ni \"qanday qiladi\"dan ajratish). Intervyuda deyarli doim interface va abstract class farqi, overloading va overriding farqi hamda equals/hashCode kontrakti so'raladi. Zamonaviy Java'da immutable ma'lumot uchun `record` ishlatiladi. Inheritance o'rniga ko'pincha composition afzal ko'riladi. SOLID tamoyillari, ayniqsa interface'ga tayanib dependency injection qilish — Spring'ning butun poydevori.",
      keyPoints: [
        "Encapsulation: field'lar `private`, o'zgartirish faqat method orqali va validation bilan",
        "Inheritance: `extends` — bitta class'dan; `implements` — ko'p interface'dan",
        "Polymorphism: overriding — runtime'da (dynamic dispatch), overloading — compile time'da",
        "Interface — kontrakt (nima qiladi), abstract class — umumiy state va qisman implementatsiya",
        "equals() override qilinsa, hashCode() ham override qilinishi SHART",
        "`static` — class'ga tegishli, object'ga emas; `final` — o'zgarmaydi / override yo'q / meros yo'q",
        "`record` — immutable data class: constructor, getter, equals, hashCode, toString avtomatik",
        "Composition over inheritance: \"is-a\" emas, \"has-a\" ko'pincha moslashuvchanroq",
        "SOLID'ning D'si: konkret class'ga emas, interface'ga bog'laning — Spring DI shunga quriladi",
      ],
      lesson: [
        {
          title: 'Class, object va constructor',
          body: "**Class** — shablon (chizma): qanday field'lar (holat) va method'lar (xatti-harakat) bo'lishini aytadi. **Object** — shu shablondan `new` bilan yaratilgan aniq nusxa, u heap'da yashaydi.\n\n**Constructor** — object yaratilayotganda chaqiriladigan maxsus method: nomi class nomi bilan bir xil, return turi yo'q. Uning vazifasi — object'ni **to'g'ri holatda** tug'dirish. Agar hech qanday constructor yozmasangiz, Java bo'sh default constructor qo'shadi; bitta bo'lsa ham yozsangiz — default yo'qoladi.\n\n- `this.name = name` — field'ni parametrdan ajratish uchun `this`.\n- `this(...)` — bir constructor'dan boshqasini chaqirish (constructor chaining), takrorlanishning oldini oladi.\n- `super(...)` — ota class constructor'ini chaqirish; doim birinchi qatorda bo'lishi kerak.\n\nYaxshi amaliyot: validation'ni constructor'da qiling. Agar object noto'g'ri qiymat bilan yaratilishi mumkin bo'lsa, xato keyinroq, boshqa joyda chiqadi va uni topish qiyin bo'ladi (fail fast).",
          code: `public class Account {
    private final String owner;
    private long balance;          // tiyin/cent'da saqlaymiz, double emas

    public Account(String owner, long initialBalance) {
        if (owner == null || owner.isBlank()) {
            throw new IllegalArgumentException("owner is required");
        }
        if (initialBalance < 0) {
            throw new IllegalArgumentException("balance cannot be negative");
        }
        this.owner = owner;
        this.balance = initialBalance;
    }

    public Account(String owner) {
        this(owner, 0);            // constructor chaining
    }
}

Account acc = new Account("Ali", 10_000);   // object heap'da, 'acc' — reference`,
          lang: 'java',
        },
        {
          title: "Encapsulation, access modifier'lar, static va final",
          body: "**Encapsulation** — object o'z ma'lumotini yashiradi va uni faqat o'zining method'lari orqali o'zgartirishga ruxsat beradi. Maqsad — **invariant**'larni himoya qilish: masalan, balans hech qachon manfiy bo'lmasligi. Agar field `public` bo'lsa, istalgan kod `acc.balance = -500` deb yozib qo'yadi.\n\nKo'p uchraydigan xato: har bir field'ga avtomatik getter **va setter** yozish. Bu encapsulation emas — bu public field'ning uzunroq varianti. Setter o'rniga ma'noli method yozing: `deposit()`, `withdraw()`.\n\nAccess modifier'lar (ochiqdan yopiqqa):\n\n- `public` — hamma joydan.\n- `protected` — shu package + subclass'lar.\n- (modifier yo'q) package-private — faqat shu package ichida.\n- `private` — faqat shu class ichida.\n\n**static** — field yoki method object'ga emas, **class'ga** tegishli. Barcha object'lar uchun bitta nusxa. `static` method'da `this` yo'q, shuning uchun u instance field'larni ko'ra olmaydi. Utility method'lar (`Math.max`) va konstantalar uchun ishlatiladi.\n\n**final** uch xil ma'noda:\n\n- `final` o'zgaruvchi — qiymati bir marta beriladi. Diqqat: `final List` — reference o'zgarmaydi, lekin list ichiga element qo'shish mumkin!\n- `final` method — subclass uni override qila olmaydi.\n- `final` class — undan meros olib bo'lmaydi (`String` shunday).",
          code: `public class BankAccount {
    public static final int MAX_DAILY_WITHDRAWALS = 5;   // konstanta: class'ga tegishli
    private static int createdCount = 0;                 // barcha object'lar uchun bitta

    private long balance;                                // tashqaridan ko'rinmaydi
    private int withdrawalsToday;

    public BankAccount() { createdCount++; }

    public void deposit(long amount) {
        if (amount <= 0) throw new IllegalArgumentException("amount must be positive");
        balance += amount;
    }

    public void withdraw(long amount) {
        if (amount > balance) throw new IllegalStateException("not enough money");
        if (withdrawalsToday >= MAX_DAILY_WITHDRAWALS) throw new IllegalStateException("limit reached");
        balance -= amount;
        withdrawalsToday++;
    }

    public long getBalance() { return balance; }         // faqat o'qish, setter yo'q
    public static int getCreatedCount() { return createdCount; }
}`,
          lang: 'java',
        },
        {
          title: 'Inheritance va polymorphism: overriding vs overloading',
          body: "**Inheritance** — `class Dog extends Animal`: Dog Animal'ning barcha non-private a'zolarini oladi. Java'da class faqat **bitta** class'dan meros oladi (diamond muammosidan qochish uchun), lekin ko'p interface'ni implement qila oladi.\n\n**Polymorphism** — \"ko'p shakllilik\": `Animal a = new Dog();` — reference turi Animal, lekin object aslida Dog. `a.sound()` chaqirilganda JVM **runtime'da** object'ning haqiqiy turiga qaraydi va Dog'ning method'ini chaqiradi. Bu **dynamic dispatch** deyiladi. Shuning uchun biz `List<Animal>` ustida aylanib, har biriga `sound()` deymiz va har biri o'zicha javob beradi — `if (type == ...)` zanjirlari kerak emas.\n\n**Overriding** (runtime polymorphism):\n\n- subclass ota method'ini **bir xil signature** bilan qayta yozadi;\n- `@Override` annotatsiyasini doim qo'ying — signature'da xato bo'lsa, compiler aytadi;\n- access'ni toraytirib bo'lmaydi (public → private mumkin emas);\n- `static`, `private`, `final` method'lar override qilinmaydi.\n\n**Overloading** (compile-time polymorphism):\n\n- bitta class'da bir xil nomli, lekin **parametrlari har xil** method'lar;\n- qaysi biri chaqirilishini compiler argument turlariga qarab hal qiladi;\n- faqat return turi farq qilsa — bu overloading emas, compile xatosi.",
          code: `abstract class Animal {
    abstract String sound();
    String describe() { return getClass().getSimpleName() + " says " + sound(); }
}

class Dog extends Animal {
    @Override String sound() { return "Woof"; }
}

class Cat extends Animal {
    @Override String sound() { return "Meow"; }
}

List<Animal> animals = List.of(new Dog(), new Cat());
for (Animal a : animals) {
    System.out.println(a.describe());   // Dog says Woof, Cat says Meow — dynamic dispatch
}

// Overloading — bir xil nom, har xil parametrlar
class Printer {
    void print(int x)            { System.out.println("int: " + x); }
    void print(String s)         { System.out.println("String: " + s); }
    void print(String s, int n)  { System.out.println(s.repeat(n)); }
}`,
          lang: 'java',
        },
        {
          title: 'Abstraction: interface vs abstract class',
          body: "**Abstraction** — foydalanuvchiga faqat **nima** qilish mumkinligini ko'rsatish, **qanday** qilinishini yashirish. Java'da buning ikki vositasi bor.\n\n**Interface** — kontrakt. Unda odatda faqat method signature'lari bo'ladi. Java 8'dan beri `default` method'lar (tayyor implementatsiya bilan) va `static` method'lar, Java 9'dan beri `private` method'lar ham bo'lishi mumkin. Interface'da **instance field'lar yo'q** — faqat `public static final` konstantalar. Class bir nechta interface'ni implement qila oladi.\n\n**Abstract class** — qisman tayyor class. Unda field'lar (state), constructor'lar, tayyor method'lar va `abstract` method'lar bo'lishi mumkin. Undan `new` bilan object yaratib bo'lmaydi. Class faqat bitta abstract class'dan meros oladi.\n\nQachon qaysi biri?\n\n- **Interface** — har xil class'lar bir xil qobiliyatga ega bo'lishi kerak bo'lsa: `Comparable`, `Runnable`, `PaymentGateway`. Default tanlov shu.\n- **Abstract class** — yaqin qarindosh class'lar umumiy **state** va umumiy kodni bo'lishishi kerak bo'lsa (Template Method pattern).\n\n`default` method nega qo'shildi? Java 8'da `List`, `Collection` kabi interface'larga yangi method'lar (`forEach`, `stream`) qo'shish kerak edi. Agar ular abstract bo'lganida, dunyodagi barcha implementatsiyalar buzilardi. Default method — **backward compatibility** uchun.\n\nInterview'da qanday aytish kerak: \"An interface says what a class can do. An abstract class is a base with shared state and code. I prefer interfaces by default.\"",
          code: `interface Notifier {
    void send(String to, String message);

    default void sendAll(List<String> recipients, String message) {  // Java 8+
        recipients.forEach(r -> send(r, message));
    }
}

class EmailNotifier implements Notifier {
    @Override public void send(String to, String message) { /* SMTP */ }
}

class SmsNotifier implements Notifier {
    @Override public void send(String to, String message) { /* SMS API */ }
}

// Abstract class: umumiy state + template method
abstract class ReportGenerator {
    private final Clock clock;                       // umumiy state
    protected ReportGenerator(Clock clock) { this.clock = clock; }

    public final String generate() {                 // algoritm qadamlari qat'iy
        return header() + body() + "Generated at " + clock.instant();
    }
    protected String header() { return "=== Report ===\\n"; }
    protected abstract String body();                // subclass to'ldiradi
}`,
          lang: 'java',
        },
        {
          title: 'equals() va hashCode() kontrakti',
          body: "Default holatda `Object.equals()` `==` kabi ishlaydi — reference'larni solishtiradi. Ikkita bir xil ma'lumotli `User` object'i \"teng emas\" bo'ladi. Mazmun bo'yicha solishtirish uchun `equals()`'ni override qilamiz.\n\n**Kontrakt** (eng muhimi): agar `a.equals(b)` true bo'lsa, `a.hashCode() == b.hashCode()` ham **albatta** true bo'lishi kerak. Teskarisi shart emas: har xil object'lar bir xil hashCode'ga ega bo'lishi mumkin (collision).\n\nNega bu muhim? `HashMap` va `HashSet` avval `hashCode()` bilan bucket'ni topadi, keyin o'sha bucket ichida `equals()` bilan solishtiradi. Agar faqat `equals()`'ni override qilib, `hashCode()`'ni unutsangiz, ikkita \"teng\" object har xil bucket'ga tushadi — `set.contains()` false qaytaradi, `HashSet`'da dublikatlar paydo bo'ladi.\n\nequals() qoidalari: reflexive (`a.equals(a)`), symmetric, transitive, consistent, `a.equals(null)` doim false.\n\nKo'p uchraydigan xato: HashMap key'i sifatida **mutable** object ishlatish va uni map'ga qo'ygandan keyin hashCode'ga ta'sir qiladigan field'ni o'zgartirish. Object \"yo'qolib qoladi\" — u eski bucket'da turibdi, lekin endi uni topib bo'lmaydi.\n\nAmalda: `record` ishlating (hammasini o'zi yozadi) yoki IDE'ga generate qildiring. JPA entity'lar uchun ehtiyot bo'ling — odatda faqat `id` bo'yicha solishtiriladi.",
          code: `public final class Email {
    private final String value;

    public Email(String value) { this.value = value.toLowerCase(); }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Email other)) return false;   // pattern matching (Java 16+)
        return value.equals(other.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);     // equals'da ishlatilgan field'lar bilan bir xil
    }
}

Set<Email> set = new HashSet<>();
set.add(new Email("Ali@mail.com"));
System.out.println(set.contains(new Email("ali@mail.com")));  // true
// hashCode() override qilinmaganida — false bo'lardi`,
          lang: 'java',
        },
        {
          title: "Immutability, record'lar va composition over inheritance",
          body: "**Immutable** object — yaratilgandan keyin holati o'zgarmaydi. Qanday qilinadi:\n\n- class `final` (subclass buzolmasin);\n- barcha field'lar `private final`;\n- setter yo'q;\n- mutable field'lar (List, Date) uchun **defensive copy**: kirishda va chiqishda nusxa (`List.copyOf`).\n\nFoydasi: thread-safe, HashMap key sifatida xavfsiz, kod haqida o'ylash oson — \"bu object'ni kim o'zgartirdi?\" degan savol yo'qoladi.\n\n**record** (Java 16+) — immutable data uchun qisqa yozuv. Kompilyator avtomatik yaratadi: `private final` field'lar, canonical constructor, accessor'lar (`name()`, `getName()` emas!), `equals`, `hashCode`, `toString`. **Compact constructor**'da validation qilish mumkin. Record'lar DTO, value object, API request/response uchun ideal. Ular `extends` qila olmaydi (lekin interface implement qila oladi).\n\n**Composition over inheritance**. Inheritance kuchli bog'lanish yaratadi: ota class o'zgarsa, barcha subclass'lar buzilishi mumkin (fragile base class). Klassik misol: `Stack extends Vector` — Stack'da `add(index, x)` ham bor, bu stack mantiqini buzadi. Composition'da class boshqa object'ni **field** sifatida saqlaydi va unga ishni topshiradi (delegation). Qoida: faqat haqiqiy \"is-a\" munosabatda inheritance; \"has-a\" yoki \"uses-a\" bo'lsa — composition.",
          code: `// record: immutable DTO, compact constructor bilan validation
public record Money(long amount, String currency) {
    public Money {
        if (amount < 0) throw new IllegalArgumentException("negative amount");
        Objects.requireNonNull(currency);
    }
    public Money plus(Money other) {           // o'zgartirmaydi, YANGI object qaytaradi
        if (!currency.equals(other.currency)) throw new IllegalArgumentException("currency mismatch");
        return new Money(amount + other.amount, currency);
    }
}

// Defensive copy
public record Order(String id, List<String> items) {
    public Order {
        items = List.copyOf(items);            // tashqaridagi list o'zgarsa ham, bizniki o'zgarmaydi
    }
}

// Composition: OrderService Logger'dan meros OLMAYDI, uni ISHLATADI
class OrderService {
    private final AuditLog auditLog;           // has-a
    OrderService(AuditLog auditLog) { this.auditLog = auditLog; }

    void place(Order order) {
        // ... biznes logika
        auditLog.record("order placed: " + order.id());   // delegation
    }
}`,
          lang: 'java',
        },
        {
          title: "SOLID Java'da va interface orqali DI",
          body: "SOLID — 5 ta dizayn tamoyili. Qisqacha, Java misollari bilan:\n\n- **S — Single Responsibility**: class'ning o'zgarish uchun bitta sababi bo'lsin. `UserService` email yubormasin — buni `EmailSender` qilsin.\n- **O — Open/Closed**: yangi xatti-harakat qo'shish uchun mavjud kodni o'zgartirmang, kengaytiring. Yangi to'lov turi = yangi `PaymentMethod` implementatsiyasi, `switch`'ga yangi `case` emas.\n- **L — Liskov Substitution**: subclass ota class o'rnida muammosiz ishlashi kerak. Klassik buzilish: `Square extends Rectangle` — `setWidth` balandlikni ham o'zgartiradi va kutilmagan natija beradi.\n- **I — Interface Segregation**: katta \"hamma narsa\" interface o'rniga kichik, aniq interface'lar.\n- **D — Dependency Inversion**: yuqori darajadagi kod konkret class'ga emas, **abstraction**'ga (interface) bog'liq bo'lsin.\n\nD tamoyili amalda **Dependency Injection** orqali bajariladi: class o'ziga kerakli narsani o'zi `new` qilmaydi, uni **constructor orqali oladi**. Natija:\n\n1. Implementatsiyani almashtirish oson (Stripe → Payme) — `OrderService` o'zgarmaydi.\n2. Test qilish oson — haqiqiy to'lov o'rniga fake yoki mock berasiz.\n\nSpring aynan shuni avtomatlashtiradi: siz faqat constructor yozasiz, Spring kerakli bean'ni topib beradi. Hozir buni qo'lda qilishni tushunsangiz, Spring'dagi `@Autowired` va constructor injection sehrli bo'lib ko'rinmaydi.",
          code: `// Abstraction
public interface PaymentGateway {
    PaymentResult charge(String customerId, Money amount);
}

// Implementatsiyalar
public class StripeGateway implements PaymentGateway {
    @Override public PaymentResult charge(String customerId, Money amount) { /* Stripe API */ return PaymentResult.ok(); }
}
public class FakeGateway implements PaymentGateway {        // test uchun
    @Override public PaymentResult charge(String customerId, Money amount) { return PaymentResult.ok(); }
}

// Yuqori darajadagi kod faqat interface'ni biladi
public class CheckoutService {
    private final PaymentGateway gateway;

    public CheckoutService(PaymentGateway gateway) {        // constructor injection
        this.gateway = gateway;
    }

    public void checkout(String customerId, Money total) {
        PaymentResult result = gateway.charge(customerId, total);
        // ...
    }
}

// "Qo'lda DI" — Spring buni siz uchun qiladi
CheckoutService prod = new CheckoutService(new StripeGateway());
CheckoutService test = new CheckoutService(new FakeGateway());`,
          lang: 'java',
        },
      ],
      vocab: [
        { en: 'encapsulation', uz: "ma'lumotni yashirish va himoyalash" },
        { en: 'inheritance', uz: 'meros olish' },
        { en: 'polymorphism', uz: "ko'p shakllilik" },
        { en: 'abstraction', uz: 'mavhumlashtirish' },
        { en: 'override', uz: "(ota method'ini) qayta yozish" },
        { en: 'overload', uz: "bir xil nomli, har xil parametrli method'lar" },
        { en: 'contract', uz: 'kelishuv, kontrakt (qoidalar)' },
        { en: 'dependency', uz: "bog'liqlik (class'ga kerak bo'lgan boshqa object)" },
      ],
      questions: [
        {
          q: 'What are the four pillars of OOP?',
          a: "The four pillars are encapsulation, inheritance, polymorphism, and abstraction. Encapsulation means we hide the data and change it only through methods. Inheritance lets a class reuse code from a parent class. Polymorphism means one reference type can have different behavior at runtime. Abstraction means we show what an object does and hide how it does it.",
          uz: "To'rtta tamoyil — encapsulation, inheritance, polymorphism va abstraction. Encapsulation — ma'lumotni yashirib, uni faqat method'lar orqali o'zgartirish. Inheritance class'ga ota class kodini qayta ishlatish imkonini beradi. Polymorphism — bitta reference turi runtime'da har xil xatti-harakatga ega bo'lishi. Abstraction — object nima qilishini ko'rsatib, qanday qilishini yashirish.",
          followUp: 'Can you give a real example of polymorphism from your project?',
          level: 'junior',
        },
        {
          q: 'What is the difference between an interface and an abstract class?',
          a: "An interface is a contract. It has no instance fields, and a class can implement many interfaces. An abstract class can have fields, constructors, and normal methods, but a class can extend only one. Since Java 8, interfaces can have default methods too. I use an interface by default, and an abstract class when related classes share state and code.",
          uz: "Interface — kontrakt. Unda instance field'lar yo'q va class ko'p interface'ni implement qila oladi. Abstract class'da field'lar, constructor'lar va oddiy method'lar bo'lishi mumkin, lekin class faqat bittasini extend qila oladi. Java 8'dan beri interface'larda default method'lar ham bo'lishi mumkin. Men default holatda interface ishlataman, yaqin class'lar umumiy state va kodni bo'lishganda esa abstract class.",
          followUp: 'Why were default methods added to interfaces?',
          level: 'junior',
        },
        {
          q: 'What is the difference between overloading and overriding?',
          a: "Overloading means many methods in one class with the same name but different parameters. The compiler chooses which one to call, so it is compile-time polymorphism. Overriding means a subclass gives a new version of a parent method with the same signature. The JVM chooses the method at runtime based on the real object type. We should always use the @Override annotation.",
          uz: "Overloading — bitta class'da nomi bir xil, lekin parametrlari har xil bo'lgan ko'p method. Qaysi birini chaqirishni compiler tanlaydi, shuning uchun bu compile-time polymorphism. Overriding — subclass ota method'ining xuddi shu signature'li yangi versiyasini beradi. JVM method'ni runtime'da object'ning haqiqiy turiga qarab tanlaydi. Doim @Override annotatsiyasini ishlatishimiz kerak.",
          example: `class Calc {
    int add(int a, int b) { return a + b; }          // overload
    double add(double a, double b) { return a + b; } // overload
}
class Dog extends Animal {
    @Override String sound() { return "Woof"; }      // override
}`,
          level: 'junior',
        },
        {
          q: 'What is the contract between equals() and hashCode()?',
          a: "If two objects are equal by equals(), they must have the same hashCode(). The opposite is not required, because two different objects can have the same hash. If we override equals() but not hashCode(), HashMap and HashSet will not work correctly. For example, set.contains() can return false for an equal object. So we always override both together.",
          uz: "Agar ikki object equals() bo'yicha teng bo'lsa, ularning hashCode()'i bir xil bo'lishi shart. Teskarisi shart emas, chunki ikki har xil object bir xil hash'ga ega bo'lishi mumkin. Agar equals()'ni override qilib, hashCode()'ni qilmasak, HashMap va HashSet to'g'ri ishlamaydi. Masalan, set.contains() teng object uchun false qaytarishi mumkin. Shuning uchun ikkalasini doim birga override qilamiz.",
          followUp: 'What happens if you change a field of an object after you put it in a HashSet?',
          level: 'middle',
        },
        {
          q: 'What does the static keyword mean?',
          a: "Static means the field or method belongs to the class, not to an object. There is only one copy of a static field for all objects. We can call a static method without creating an object, like Math.max(). A static method cannot use this or instance fields directly. We use static for constants and utility methods.",
          uz: "Static — field yoki method object'ga emas, class'ga tegishli degani. Static field'ning barcha object'lar uchun faqat bitta nusxasi bor. Static method'ni object yaratmasdan chaqirish mumkin, masalan Math.max(). Static method this'ni yoki instance field'larni to'g'ridan-to'g'ri ishlata olmaydi. Static'ni konstantalar va utility method'lar uchun ishlatamiz.",
          level: 'junior',
        },
        {
          q: 'What does final mean for a variable, a method, and a class?',
          a: "A final variable can be assigned only once. A final method cannot be overridden by a subclass. A final class cannot be extended, for example String is final. Note that a final reference to a list does not make the list immutable. We can still add items to it, we just cannot point the variable to a new list.",
          uz: "Final o'zgaruvchiga qiymat faqat bir marta beriladi. Final method'ni subclass override qila olmaydi. Final class'dan meros olib bo'lmaydi, masalan String final. E'tibor bering, list'ga final reference list'ni immutable qilmaydi. Biz unga baribir element qo'sha olamiz, faqat o'zgaruvchini yangi list'ga yo'naltira olmaymiz.",
          example: `final List<String> names = new ArrayList<>();
names.add("Ali");          // OK
names = new ArrayList<>(); // compile error`,
          level: 'junior',
        },
        {
          q: 'How do you make a class immutable? What is a record?',
          a: "To make a class immutable, I make the class final, all fields private and final, and I do not add setters. For mutable fields like lists, I make defensive copies. Since Java 16, a record does most of this for me. A record creates the constructor, accessors, equals, hashCode, and toString automatically. I use records for DTOs and value objects.",
          uz: "Class'ni immutable qilish uchun class'ni final, barcha field'larni private va final qilaman va setter qo'shmayman. List kabi mutable field'lar uchun defensive copy qilaman. Java 16'dan beri buning ko'p qismini record men uchun qiladi. Record constructor, accessor'lar, equals, hashCode va toString'ni avtomatik yaratadi. Record'larni DTO va value object'lar uchun ishlataman.",
          example: `public record UserDto(Long id, String name, List<String> roles) {
    public UserDto {
        roles = List.copyOf(roles);
    }
}`,
          level: 'junior',
        },
        {
          q: 'What does "composition over inheritance" mean?',
          a: "It means we often prefer to build a class from other objects instead of extending a parent class. Inheritance creates a strong connection, so a change in the parent can break the children. With composition, the class keeps another object as a field and delegates work to it. It is more flexible, and it is easier to test. I use inheritance only for a real is-a relationship.",
          uz: "Bu ko'pincha ota class'ni extend qilish o'rniga class'ni boshqa object'lardan qurishni afzal ko'rishimiz degani. Inheritance kuchli bog'lanish yaratadi, shuning uchun ota class'dagi o'zgarish bola class'larni buzishi mumkin. Composition'da class boshqa object'ni field sifatida saqlaydi va ishni unga topshiradi. Bu moslashuvchanroq va test qilish osonroq. Inheritance'ni faqat haqiqiy is-a munosabati uchun ishlataman.",
          level: 'middle',
        },
        {
          q: 'Can you explain SOLID? Which principle do you use the most?',
          a: "SOLID is five design principles: single responsibility, open/closed, Liskov substitution, interface segregation, and dependency inversion. I use dependency inversion the most. My services depend on interfaces, not on concrete classes, and they get them through the constructor. This makes it easy to change an implementation and to use mocks in tests. Spring is built on this idea.",
          uz: "SOLID — beshta dizayn tamoyili: single responsibility, open/closed, Liskov substitution, interface segregation va dependency inversion. Men eng ko'p dependency inversion'ni ishlataman. Mening service'larim konkret class'larga emas, interface'larga bog'liq va ularni constructor orqali oladi. Bu implementatsiyani almashtirishni va testlarda mock ishlatishni osonlashtiradi. Spring shu g'oyaga qurilgan.",
          followUp: 'Can you give an example of breaking the Liskov substitution principle?',
          level: 'middle',
        },
      ],
      resources: [
        { title: 'Oracle Java Tutorials — OOP Concepts', url: 'https://docs.oracle.com/javase/tutorial/java/concepts/index.html' },
        { title: 'Oracle Java Tutorials — Interfaces and Inheritance', url: 'https://docs.oracle.com/javase/tutorial/java/IandI/index.html' },
        { title: 'Baeldung — equals() and hashCode() Contracts', url: 'https://www.baeldung.com/java-equals-hashcode-contracts' },
        { title: 'Baeldung — Java Record Keyword', url: 'https://www.baeldung.com/java-record-keyword' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'java-collections',
      title: 'Collections: List, Set, Map va HashMap ichi',
      days: [8, 25],
      summary: "Java Collections Framework — ma'lumotlarni saqlash uchun tayyor struktura'lar to'plami. Asosiy interface'lar: `List` (tartibli, dublikat mumkin), `Set` (dublikatsiz), `Queue`/`Deque` (navbat) va alohida `Map` (key → value). Har bir interface'ning bir nechta implementatsiyasi bor va ular ichki tuzilishi bilan farq qiladi: `ArrayList` — array, `LinkedList` — bog'langan ro'yxat, `HashMap` — bucket'lar array'i, `TreeMap` — red-black tree. Intervyuda eng ko'p so'raladigani — HashMap ichida qanday ishlashi: hashCode → bucket index, collision, equals, load factor va resize. Generics collection'larni type-safe qiladi, lekin runtime'da type erasure tufayli turlar o'chiriladi. Iteratsiya paytida collection'ni o'zgartirish ConcurrentModificationException beradi.",
      keyPoints: [
        "List — tartib + dublikat; Set — unikal; Map — key → value (Collection'dan meros olmaydi)",
        "ArrayList: get(i) O(1), oxiriga qo'shish amortized O(1), o'rtaga qo'shish O(n). Deyarli doim shu tanlanadi",
        "LinkedList: boshiga/oxiriga O(1), lekin get(i) O(n) va cache'ga yomon",
        "HashMap: hashCode → bucket, equals → aniq key; o'rtacha O(1)",
        "Load factor 0.75: to'lganlik 75%'dan oshsa, array 2 baravar kattalashadi (resize)",
        "Java 8+: bucket'da 8 dan ortiq element bo'lsa, list red-black tree'ga aylanadi (treeify) — eng yomoni O(log n)",
        "HashSet ichida HashMap; LinkedHashMap — qo'shilish tartibi; TreeMap — sort qilingan, O(log n)",
        "Comparable — tabiiy tartib (class ichida); Comparator — tashqi, bir nechta tartib",
        "for-each ichida remove() → ConcurrentModificationException; removeIf() yoki Iterator.remove() ishlating",
      ],
      lesson: [
        {
          title: "Collection ierarxiyasi va to'g'ri tanlash",
          body: "Framework ikki ildizdan iborat:\n\n- `Collection` → `List`, `Set`, `Queue` (→ `Deque`)\n- `Map` — alohida ierarxiya, chunki u element emas, **juftlik** (key, value) saqlaydi.\n\nAsosiy implementatsiyalar:\n\n- **List**: `ArrayList` (default), `LinkedList`.\n- **Set**: `HashSet` (tartibsiz, eng tez), `LinkedHashSet` (qo'shilish tartibi), `TreeSet` (sort qilingan).\n- **Map**: `HashMap` (default), `LinkedHashMap` (tartib), `TreeMap` (sort qilingan key'lar).\n- **Queue/Deque**: `ArrayDeque` (stack va queue uchun — eski `Stack` class'i o'rniga), `PriorityQueue` (heap, eng kichik element birinchi).\n\nTanlash bo'yicha savollar: tartib kerakmi? dublikat mumkinmi? key bo'yicha qidirish kerakmi? sort qilinganmi?\n\nYaxshi amaliyot — o'zgaruvchi turini **interface** sifatida e'lon qiling: `List<User> users = new ArrayList<>();`. Shunda keyin implementatsiyani bitta joyda almashtirasiz.\n\nImmutable collection'lar: `List.of()`, `Set.of()`, `Map.of()` (Java 9+). Ularga qo'shishga urinish `UnsupportedOperationException` beradi va ular `null`'ni qabul qilmaydi. `Collections.unmodifiableList(list)` esa faqat **view** — asl list o'zgarsa, view ham o'zgaradi.",
          code: `List<String> names = new ArrayList<>();       // tartib + dublikat
Set<String> tags = new HashSet<>();            // unikal
Map<Long, User> usersById = new HashMap<>();   // key -> value
Deque<Integer> stack = new ArrayDeque<>();     // stack.push(1); stack.pop();
Queue<Task> tasks = new PriorityQueue<>(Comparator.comparing(Task::priority));

List<String> fixed = List.of("a", "b");        // immutable
// fixed.add("c");  -> UnsupportedOperationException

Map<String, Integer> wordCount = new HashMap<>();
for (String w : List.of("a", "b", "a")) {
    wordCount.merge(w, 1, Integer::sum);       // {a=2, b=1}
}
usersById.computeIfAbsent(7L, id -> loadUser(id));   // yo'q bo'lsa yuklaydi va qo'yadi`,
          lang: 'java',
        },
        {
          title: 'ArrayList vs LinkedList: ichida nima bor',
          body: "**ArrayList** ichida oddiy `Object[]` array bor.\n\n- `get(i)` — O(1): array'da manzil to'g'ridan-to'g'ri hisoblanadi.\n- `add(x)` oxiriga — **amortized O(1)**. Array to'lsa, 1.5 baravar katta yangi array yaratiladi va eski elementlar ko'chiriladi (O(n)), lekin bu kam bo'ladi, o'rtacha hisobda O(1).\n- `add(0, x)` yoki `remove(0)` — O(n): qolgan elementlarni surish kerak.\n\n**LinkedList** — ikki tomonlama bog'langan ro'yxat: har element alohida `Node` object'i (value, next, prev).\n\n- Boshiga/oxiriga qo'shish va o'chirish — O(1).\n- `get(i)` — O(n): boshidan sanab borish kerak.\n- Har element uchun qo'shimcha object → ko'p xotira; node'lar xotirada tarqoq → CPU cache'ga yomon.\n\nAmalda **deyarli doim ArrayList** tanlanadi. Hatto o'rtaga qo'shishda ham ArrayList ko'pincha tezroq, chunki `System.arraycopy` juda tez, LinkedList esa avval o'sha joyni O(n) bilan topishi kerak. Queue/stack kerak bo'lsa — `ArrayDeque`.\n\nKo'p uchraydigan xato: \"LinkedList'da o'rtaga qo'shish O(1)\" deyish. Faqat qo'shishning o'zi O(1) — lekin o'sha joyga yetib borish O(n).\n\nMaslahat: element soni oldindan ma'lum bo'lsa, `new ArrayList<>(10_000)` — keraksiz resize'lardan qutulasiz.",
          code: `List<Integer> arrayList = new ArrayList<>();
List<Integer> linkedList = new LinkedList<>();

for (int i = 0; i < 100_000; i++) {
    arrayList.add(i);
    linkedList.add(i);
}

arrayList.get(50_000);    // O(1)  — bir zumda
linkedList.get(50_000);   // O(n)  — 50 000 qadam yuradi

// Klassik xato: LinkedList'ni index bilan aylanish -> O(n^2)
for (int i = 0; i < linkedList.size(); i++) {
    linkedList.get(i);    // har safar boshidan sanaydi!
}
// To'g'ri: for-each (Iterator ishlatadi) -> O(n)
for (int x : linkedList) { /* ... */ }`,
          lang: 'java',
        },
        {
          title: 'HashMap ichida qanday ishlaydi',
          body: "Bu Java intervyusidagi eng mashhur savol. HashMap ichida **bucket'lar array'i** (`Node[] table`) bor, default o'lchami 16.\n\n`put(key, value)` qadamlari:\n\n1. `key.hashCode()` chaqiriladi. HashMap yuqori bitlarni ham aralashtiradi: `h ^ (h >>> 16)`.\n2. Bucket index hisoblanadi: `(n - 1) & hash` — bu `hash % n` bilan bir xil, lekin tezroq (n doim 2 ning darajasi).\n3. Bucket bo'sh bo'lsa — yangi node qo'yiladi.\n4. Bucket'da allaqachon node'lar bo'lsa (**collision**) — har biri bilan avval hash, keyin `equals()` solishtiriladi. Teng key topilsa — value **almashtiriladi**; topilmasa — ro'yxat oxiriga qo'shiladi.\n\n`get(key)` xuddi shunday: hashCode → bucket → equals bilan aniq node'ni topish.\n\n**Load factor va resize**: default load factor 0.75. Element soni `capacity * 0.75`'dan oshsa (16 × 0.75 = 12), array 2 baravar kattalashadi va barcha element'lar yangi bucket'larga taqsimlanadi (rehash). Bu O(n) operatsiya — shuning uchun hajm ma'lum bo'lsa, boshlang'ich capacity bering.\n\n**Treeify** (Java 8+): agar bitta bucket'da 8 dan ortiq node yig'ilsa (va table kamida 64 bo'lsa), linked list **red-black tree**'ga aylanadi. Shunda eng yomon holat O(n) emas, O(log n). Bu yomon hashCode yoki ataylab qilingan hujumlardan himoya qiladi.\n\nBoshqa faktlar: HashMap bitta `null` key'ga ruxsat beradi (u 0-bucket'ga tushadi); tartibni kafolatlamaydi; **thread-safe emas**.\n\nInterview'da qanday aytish kerak: \"hashCode finds the bucket, equals finds the exact key inside the bucket\" — shu bitta jumla javobning yuragi.",
          code: `// Soddalashtirilgan put() mantiqi
int hash(Object key) {
    int h = key.hashCode();
    return h ^ (h >>> 16);            // yuqori bitlarni aralashtirish
}

int index = (table.length - 1) & hash(key);   // 16 bucket -> 0..15

// Yomon hashCode = hamma narsa bitta bucket'ga
class BadKey {
    final String id;
    BadKey(String id) { this.id = id; }
    @Override public int hashCode() { return 42; }     // har doim bir xil!
    @Override public boolean equals(Object o) {
        return o instanceof BadKey b && b.id.equals(id);
    }
}
// 10 000 ta BadKey -> bitta bucket -> tree bo'lmasa O(n) qidirish

// Hajm ma'lum bo'lsa — resize'siz:
Map<String, User> map = HashMap.newHashMap(10_000);   // Java 19+
// eski usul: new HashMap<>((int) (10_000 / 0.75f) + 1)`,
          lang: 'java',
        },
        {
          title: 'HashSet, LinkedHashMap, TreeMap va saralash',
          body: "**HashSet** — ichida `HashMap`. Siz qo'shgan element map'ning **key**'i bo'ladi, value esa doim bitta dummy object (`PRESENT`). Shuning uchun HashSet'ning unikalligi ham `hashCode()` + `equals()`'ga bog'liq.\n\n**LinkedHashMap** — HashMap + barcha node'larni bog'lovchi ikki tomonlama ro'yxat. Natija: iteratsiya **qo'shilish tartibida**. `accessOrder = true` bilan esa oxirgi ishlatilgan oxirida turadi — `removeEldestEntry()` bilan oddiy **LRU cache** yasash mumkin.\n\n**TreeMap** — red-black tree. Key'lar doim **sort qilingan**. `get`/`put` — O(log n). Qo'shimcha imkoniyatlar: `firstKey()`, `floorKey()`, `headMap()`, `subMap()` — diapazon so'rovlari uchun. Key'lar `Comparable` bo'lishi yoki `Comparator` berilishi kerak.\n\n**Comparable vs Comparator**:\n\n- `Comparable<T>` — class **ichida** `compareTo()`: object'ning \"tabiiy\" tartibi (String — alifbo, Integer — son). Faqat bitta bo'ladi.\n- `Comparator<T>` — **tashqi** solishtiruvchi. Istalgancha bo'lishi mumkin: nom bo'yicha, yosh bo'yicha, teskari. Java 8+ da qulay: `Comparator.comparing(User::age).thenComparing(User::name).reversed()`.\n\nKo'p uchraydigan xato: `compareTo`'da `return a.age - b.age;` yozish — katta sonlarda overflow bo'ladi. `Integer.compare(a, b)` ishlating.",
          code: `record User(String name, int age) implements Comparable<User> {
    @Override
    public int compareTo(User other) {
        return Integer.compare(age, other.age);      // tabiiy tartib: yosh bo'yicha
    }
}

List<User> users = new ArrayList<>(List.of(
        new User("Vali", 30), new User("Ali", 25), new User("Bek", 30)));

Collections.sort(users);                                   // Comparable bo'yicha
users.sort(Comparator.comparing(User::name));              // nom bo'yicha
users.sort(Comparator.comparingInt(User::age).reversed()
                     .thenComparing(User::name));          // yosh kamayib, keyin nom

// LRU cache LinkedHashMap bilan
class LruCache<K, V> extends LinkedHashMap<K, V> {
    private final int max;
    LruCache(int max) { super(16, 0.75f, true); this.max = max; }   // accessOrder = true
    @Override protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > max;
    }
}

TreeMap<Integer, String> grades = new TreeMap<>(Map.of(90, "A", 80, "B", 70, "C"));
grades.floorEntry(85);    // 80=B — 85 dan kichik yoki teng eng katta key`,
          lang: 'java',
        },
        {
          title: "Generics: type erasure va wildcard'lar",
          body: "**Generics** collection'larni type-safe qiladi: `List<String>`'ga `Integer` qo'shib bo'lmaydi — xato **compile vaqtida** chiqadi, runtime'da `ClassCastException` emas.\n\n**Type erasure**: generics faqat compiler uchun. Compile'dan keyin `List<String>` va `List<Integer>` bir xil oddiy `List` bo'lib qoladi, compiler kerakli joylarga cast qo'shib qo'yadi. Bu eski (Java 5'gacha) kod bilan moslik uchun qilingan. Natijalari:\n\n- `new T()` yoki `new T[10]` yozib bo'lmaydi;\n- `obj instanceof List<String>` mumkin emas;\n- `List<int>` yo'q — faqat `List<Integer>` (primitive'lar uchun boxing).\n\n**Wildcard'lar** — oddiy qoida **PECS**: Producer Extends, Consumer Super.\n\n- `List<? extends Number>` — undan **o'qiysiz** (producer). Ichida Integer ham, Double ham bo'lishi mumkin, shuning uchun unga qo'shib bo'lmaydi (null'dan tashqari).\n- `List<? super Integer>` — unga **yozasiz** (consumer). `List<Integer>`, `List<Number>`, `List<Object>` — hammasi mos keladi.\n\nNega `List<Integer>` `List<Number>` emas? Agar shunday bo'lsa, `List<Number> nums = intList; nums.add(3.14);` — Integer list'iga Double tushib qolardi. Generics **invariant**.",
          code: `// Producer: faqat o'qiymiz
static double sum(List<? extends Number> numbers) {
    double total = 0;
    for (Number n : numbers) total += n.doubleValue();
    return total;
}
sum(List.of(1, 2, 3));        // List<Integer> — OK
sum(List.of(1.5, 2.5));       // List<Double>  — OK

// Consumer: faqat yozamiz
static void fillWithOnes(List<? super Integer> target, int count) {
    for (int i = 0; i < count; i++) target.add(1);
}
List<Number> nums = new ArrayList<>();
fillWithOnes(nums, 3);        // OK

// Generic method
static <T extends Comparable<T>> T max(List<T> list) {
    T best = list.get(0);
    for (T item : list) if (item.compareTo(best) > 0) best = item;
    return best;
}

// Type erasure: runtime'da bir xil
System.out.println(new ArrayList<String>().getClass() == new ArrayList<Integer>().getClass()); // true`,
          lang: 'java',
        },
        {
          title: 'Fail-fast iterator, ConcurrentModificationException va Big-O',
          body: "`ArrayList`, `HashMap` kabi collection'larning iterator'lari **fail-fast**. Ichida `modCount` hisoblagichi bor — har qo'shish/o'chirishda oshadi. Iterator har qadamda uni tekshiradi; agar iteratsiya paytida collection iterator'dan **tashqarida** o'zgargan bo'lsa — darhol `ConcurrentModificationException`.\n\nDiqqat: nomida \"concurrent\" bo'lsa ham, bu xato ko'pincha **bitta thread**'da chiqadi — for-each ichida `list.remove()` qilganda.\n\nTo'g'ri yo'llar:\n\n- `list.removeIf(x -> ...)` — eng toza;\n- `Iterator.remove()` — iterator orqali o'chirish;\n- yangi list'ga filter qilish (Stream).\n\nKo'p thread'li muhitda: `HashMap` thread-safe emas — `ConcurrentHashMap` ishlating (batafsil concurrency mavzusida). Uning iterator'lari **weakly consistent**: CME bermaydi.\n\nAsosiy Big-O (o'rtacha):\n\n- ArrayList: get O(1), add oxiriga O(1)*, add/remove o'rtada O(n), contains O(n)\n- LinkedList: add/remove boshida/oxirida O(1), get O(n), contains O(n)\n- HashMap / HashSet: put, get, remove, contains O(1); eng yomoni O(log n) (treeify)\n- TreeMap / TreeSet: put, get, remove O(log n)\n- ArrayDeque: push/pop/offer/poll O(1)\n- PriorityQueue: offer/poll O(log n), peek O(1)\n\nInterview'da qanday aytish kerak: Big-O'ni aytganda \"amortized\" va \"average\" so'zlarini ishlating — bu sizning aniq tushunishingizni ko'rsatadi.",
          code: `List<String> names = new ArrayList<>(List.of("Ali", "Vali", "Bek"));

// XATO: ConcurrentModificationException
for (String n : names) {
    if (n.startsWith("V")) names.remove(n);
}

// To'g'ri 1: removeIf
names.removeIf(n -> n.startsWith("V"));

// To'g'ri 2: Iterator.remove()
Iterator<String> it = names.iterator();
while (it.hasNext()) {
    if (it.next().startsWith("V")) it.remove();
}

// To'g'ri 3: Map'dan o'chirish
Map<String, Integer> stock = new HashMap<>(Map.of("apple", 0, "pear", 5));
stock.entrySet().removeIf(e -> e.getValue() == 0);`,
          lang: 'java',
        },
      ],
      vocab: [
        { en: 'bucket', uz: "HashMap ichidagi 'savat' — array katagi" },
        { en: 'collision', uz: "to'qnashuv — har xil key'lar bitta bucket'ga tushishi" },
        { en: 'load factor', uz: "to'lganlik koeffitsienti (default 0.75)" },
        { en: 'resize / rehash', uz: "kattalashtirish va qayta taqsimlash" },
        { en: 'amortized', uz: "o'rtacha hisobda (ko'p operatsiyalar bo'yicha)" },
        { en: 'type erasure', uz: "generic turlarning runtime'da o'chirilishi" },
        { en: 'fail-fast', uz: "muammo sezilishi bilan darhol xato beradigan" },
        { en: 'natural ordering', uz: 'tabiiy tartib (Comparable)' },
      ],
      questions: [
        {
          q: 'How does HashMap work internally?',
          a: "HashMap has an array of buckets. When we call put, it takes the hashCode of the key and finds the bucket index. If the bucket already has entries, it compares the keys with equals. If it finds the same key, it replaces the value. If not, it adds a new node. When the map is 75% full, it doubles the array and moves the entries. Since Java 8, a bucket with many entries becomes a red-black tree.",
          uz: "HashMap'da bucket'lar array'i bor. put chaqirganimizda u key'ning hashCode'ini oladi va bucket index'ini topadi. Agar bucket'da allaqachon yozuvlar bo'lsa, key'larni equals bilan solishtiradi. Xuddi shu key'ni topsa, value'ni almashtiradi. Topmasa, yangi node qo'shadi. Map 75% to'lganda array'ni ikki baravar kattalashtiradi va yozuvlarni ko'chiradi. Java 8'dan beri ko'p yozuvli bucket red-black tree'ga aylanadi.",
          followUp: 'What happens if all keys have the same hashCode?',
          level: 'middle',
        },
        {
          q: 'What is the difference between ArrayList and LinkedList?',
          a: "ArrayList uses a dynamic array, so get by index is O(1). Adding at the end is fast, but adding in the middle needs to shift elements. LinkedList uses nodes with links, so adding at the start or end is O(1), but get by index is O(n). LinkedList also uses more memory. In practice, I almost always use ArrayList.",
          uz: "ArrayList dinamik array ishlatadi, shuning uchun index bo'yicha get O(1). Oxiriga qo'shish tez, lekin o'rtaga qo'shish elementlarni surishni talab qiladi. LinkedList bog'langan node'lar ishlatadi, shuning uchun boshiga yoki oxiriga qo'shish O(1), lekin index bo'yicha get O(n). LinkedList ko'proq xotira ham ishlatadi. Amalda men deyarli doim ArrayList ishlataman.",
          level: 'junior',
        },
        {
          q: 'What is the difference between List, Set, and Map?',
          a: "A List keeps the order of elements and allows duplicates. A Set does not allow duplicates. A Map stores key-value pairs, and every key is unique. For example, I use a List for search results, a Set for unique tags, and a Map to find a user by id quickly.",
          uz: "List elementlar tartibini saqlaydi va dublikatlarga ruxsat beradi. Set dublikatlarga ruxsat bermaydi. Map key-value juftliklarni saqlaydi va har bir key unikal. Masalan, qidiruv natijalari uchun List, unikal teglar uchun Set va foydalanuvchini id bo'yicha tez topish uchun Map ishlataman.",
          level: 'junior',
        },
        {
          q: 'How does HashSet make sure elements are unique?',
          a: "HashSet uses a HashMap inside. Each element is stored as a key in this map, and the value is a dummy object. Because map keys are unique, set elements are unique too. This means uniqueness depends on hashCode and equals. If a class does not override them correctly, the set can contain duplicates.",
          uz: "HashSet ichida HashMap ishlatadi. Har bir element shu map'da key sifatida saqlanadi, value esa dummy object. Map key'lari unikal bo'lgani uchun set elementlari ham unikal. Demak, unikallik hashCode va equals'ga bog'liq. Agar class ularni to'g'ri override qilmasa, set'da dublikatlar bo'lishi mumkin.",
          level: 'junior',
        },
        {
          q: 'What is the difference between HashMap, LinkedHashMap, and TreeMap?',
          a: "HashMap does not keep any order, and its operations are O(1) on average. LinkedHashMap keeps the insertion order, and it can also be used as an LRU cache. TreeMap keeps the keys sorted, and its operations are O(log n). I use HashMap by default, LinkedHashMap when the order matters, and TreeMap when I need sorted keys or range queries.",
          uz: "HashMap hech qanday tartibni saqlamaydi va uning operatsiyalari o'rtacha O(1). LinkedHashMap qo'shilish tartibini saqlaydi va LRU cache sifatida ham ishlatilishi mumkin. TreeMap key'larni sort qilingan holda saqlaydi va uning operatsiyalari O(log n). Default holatda HashMap, tartib muhim bo'lsa LinkedHashMap, sort qilingan key'lar yoki diapazon so'rovlari kerak bo'lsa TreeMap ishlataman.",
          level: 'middle',
        },
        {
          q: 'What is the difference between Comparable and Comparator?',
          a: "Comparable is implemented inside the class with the compareTo method. It defines the natural order, and a class can have only one. Comparator is a separate object with the compare method. We can create many comparators, for example by name or by date. Since Java 8, Comparator.comparing makes this very short.",
          uz: "Comparable class ichida compareTo method'i bilan implement qilinadi. U tabiiy tartibni belgilaydi va class'da faqat bitta bo'ladi. Comparator — compare method'i bor alohida object. Ko'p comparator yaratishimiz mumkin, masalan nom yoki sana bo'yicha. Java 8'dan beri Comparator.comparing buni juda qisqa qiladi.",
          example: `users.sort(Comparator.comparing(User::lastName)
                     .thenComparing(User::firstName));`,
          level: 'junior',
        },
        {
          q: 'What is ConcurrentModificationException and how do you avoid it?',
          a: "This exception happens when we change a collection while we iterate over it, for example we call list.remove inside a for-each loop. The iterator is fail-fast, so it checks a modification counter and throws the exception. To avoid it, I use removeIf, or I remove through the Iterator. In multi-threaded code, I use concurrent collections like ConcurrentHashMap.",
          uz: "Bu exception collection ustida aylanayotganda uni o'zgartirsak yuz beradi, masalan for-each ichida list.remove chaqirsak. Iterator fail-fast, shuning uchun u o'zgarishlar hisoblagichini tekshiradi va exception tashlaydi. Bunga yo'l qo'ymaslik uchun removeIf ishlataman yoki Iterator orqali o'chiraman. Ko'p thread'li kodda ConcurrentHashMap kabi concurrent collection'lardan foydalanaman.",
          example: `list.removeIf(item -> item.isExpired());`,
          level: 'junior',
        },
        {
          q: 'What is type erasure in Java generics?',
          a: "Type erasure means generic types exist only at compile time. After compilation, List<String> and List<Integer> become the same raw List, and the compiler adds casts where needed. This was done for backward compatibility with old Java code. Because of this, we cannot write new T() or check instanceof List<String>.",
          uz: "Type erasure — generic turlar faqat compile vaqtida mavjud degani. Compile'dan keyin List<String> va List<Integer> bir xil oddiy List bo'lib qoladi va compiler kerakli joylarga cast qo'shadi. Bu eski Java kodi bilan moslik uchun qilingan. Shu sababli new T() yoza olmaymiz yoki instanceof List<String> tekshira olmaymiz.",
          followUp: 'What do ? extends and ? super mean?',
          level: 'middle',
        },
        {
          q: 'Why should a HashMap key be immutable?',
          a: "HashMap puts a key into a bucket based on its hashCode. If we change a field of the key after we put it, its hashCode changes too. Then get will look in a different bucket, and we cannot find the entry anymore. The old entry stays in the map like a memory leak. That is why String, Integer, and records are good keys.",
          uz: "HashMap key'ni uning hashCode'iga qarab bucket'ga joylaydi. Agar key'ni qo'ygandan keyin uning field'ini o'zgartirsak, hashCode ham o'zgaradi. Shunda get boshqa bucket'dan qidiradi va biz yozuvni boshqa topa olmaymiz. Eski yozuv map'da memory leak kabi qolib ketadi. Shuning uchun String, Integer va record'lar yaxshi key bo'ladi.",
          level: 'middle',
        },
      ],
      resources: [
        { title: 'Oracle Java Tutorials — Collections', url: 'https://docs.oracle.com/javase/tutorial/collections/index.html' },
        { title: 'Baeldung — A Guide to Java HashMap', url: 'https://www.baeldung.com/java-hashmap' },
        { title: 'Baeldung — The Basics of Java Generics', url: 'https://www.baeldung.com/java-generics' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'java-exceptions',
      title: "Exception'lar: checked vs unchecked, try-with-resources",
      days: [27],
      summary: "Exception — dastur ishlashi paytida yuz beradigan va oddiy oqimni to'xtatadigan hodisa. Barcha xatolar `Throwable`'dan meros oladi va ikki shoxga bo'linadi: `Error` (JVM darajasidagi jiddiy muammolar, masalan OutOfMemoryError — ularni ushlamaymiz) va `Exception`. Exception'lar o'z navbatida checked (compiler ularni ushlash yoki `throws` bilan e'lon qilishni majburlaydi, masalan IOException) va unchecked (`RuntimeException` avlodlari, masalan NullPointerException) bo'ladi. Resurslarni (fayl, DB connection) yopish uchun try-with-resources ishlatiladi. Yaxshi kodda exception yutib yuborilmaydi, past darajadagi xato o'z biznes exception'iga cause bilan o'raladi va xato imkon qadar erta aniqlanadi (fail fast).",
      keyPoints: [
        "Throwable → Error (ushlamaymiz) va Exception → RuntimeException (unchecked)",
        "Checked: compiler majburlaydi (IOException, SQLException). Unchecked: RuntimeException avlodlari",
        "finally har doim ishlaydi (return bo'lsa ham) — faqat JVM o'chsa ishlamaydi",
        "try-with-resources: AutoCloseable resurslarni avtomatik va teskari tartibda yopadi",
        "catch tartibi: avval aniqroq (subclass), keyin umumiyroq exception",
        "Custom exception: odatda RuntimeException'dan, ma'noli nom va xabar bilan",
        "O'raganda cause'ni yo'qotmang: new OrderException(\"...\", e)",
        "Exception'ni yutib yubormang (bo'sh catch); oqimni boshqarish uchun exception ishlatmang",
      ],
      lesson: [
        {
          title: 'Exception ierarxiyasi',
          body: "Java'da tashlab bo'ladigan hamma narsa `Throwable`'dan meros oladi. Ierarxiyani bilish — qaysi xatoni ushlash kerakligini tushunishning kaliti.\n\n- **Error** — JVM yoki muhit darajasidagi jiddiy muammo: `OutOfMemoryError`, `StackOverflowError`. Ilova odatda ulardan tiklana olmaydi, shuning uchun ularni catch qilmaymiz.\n- **Exception** — ilova ushlashi va qayta ishlashi mumkin bo'lgan xatolar.\n- **RuntimeException** — Exception'ning maxsus avlodi: dasturchi xatolari yoki biznes qoidasi buzilishi. `NullPointerException`, `IllegalArgumentException`, `IllegalStateException`, `IndexOutOfBoundsException`, `ArithmeticException`.\n\nException tashlanganda JVM uni chaqiruvlar stack'i bo'ylab **yuqoriga** olib chiqadi: mos `catch` topilmaguncha har bir method to'xtatiladi. Hech kim ushlamasa — thread to'xtaydi va stack trace chop etiladi. Stack trace'ni pastdan yuqoriga emas, **yuqoridan** o'qing: birinchi qator — xato qayerda tashlangani, `Caused by:` — asl sabab.\n\nKo'p uchraydigan xato: `catch (Throwable t)` yoki `catch (Exception e)` bilan hamma narsani ushlash. Bu Error'larni ham, dasturchi xatolarini ham yashiradi.",
          code: `// Throwable
// ├── Error                         (ushlamaymiz)
// │   ├── OutOfMemoryError
// │   └── StackOverflowError
// └── Exception                     (checked)
//     ├── IOException
//     │   └── FileNotFoundException
//     ├── SQLException
//     └── RuntimeException          (unchecked)
//         ├── NullPointerException
//         ├── IllegalArgumentException
//         │   └── NumberFormatException
//         ├── IllegalStateException
//         └── IndexOutOfBoundsException

int parsePort(String value) {
    return Integer.parseInt(value);   // "abc" -> NumberFormatException (unchecked)
}`,
          lang: 'java',
        },
        {
          title: 'Checked vs unchecked',
          body: "**Checked exception** — `Exception`'dan meros oladi, lekin `RuntimeException`'dan emas. Compiler sizni majburlaydi: yo `try/catch` bilan ushlang, yo method signature'da `throws` bilan e'lon qiling. G'oya: bu **tashqi** muammolar — fayl yo'q, tarmoq uzildi, DB javob bermadi. Dastur to'g'ri yozilgan bo'lsa ham ular yuz berishi mumkin, shuning uchun chaqiruvchi ularga tayyor bo'lishi kerak.\n\n**Unchecked exception** — `RuntimeException` avlodlari. Compiler hech narsani majburlamaydi. Odatda bu **dasturchi xatosi** (null'ga murojaat, noto'g'ri argument) yoki biznes qoidasi buzilishi. Ularni har joyda ushlash o'rniga — kodni to'g'rilash kerak.\n\nZamonaviy Java dunyosida, ayniqsa Spring'da, **unchecked** exception'lar afzal ko'riladi. Sabab: checked exception'lar har bir qatlamda `throws` yozishni talab qiladi va lambda'lar bilan yomon ishlaydi (`Function` interface'i checked exception tashlay olmaydi). Spring o'zi ham `SQLException`'ni unchecked `DataAccessException`'ga o'rab beradi.\n\nInterview'da qanday aytish kerak: \"Checked exceptions are for problems the caller can expect and maybe recover from. Unchecked exceptions are usually bugs or broken business rules.\"",
          code: `// Checked: compiler majburlaydi
String readConfig(Path path) throws IOException {      // e'lon qilish SHART
    return Files.readString(path);
}

// Chaqiruvchi tanlaydi: ushlash yoki yuqoriga uzatish
void start() {
    try {
        String config = readConfig(Path.of("app.conf"));
    } catch (IOException e) {
        throw new IllegalStateException("Cannot read config", e);   // unchecked'ga o'rash
    }
}

// Unchecked: compiler hech narsa demaydi
void setAge(int age) {
    if (age < 0) {
        throw new IllegalArgumentException("age must be >= 0, but was " + age);
    }
}

// Lambda'da checked exception muammosi:
// paths.stream().map(p -> Files.readString(p))   -> compile error!`,
          lang: 'java',
        },
        {
          title: 'try/catch/finally va try-with-resources',
          body: "**try/catch/finally** qanday ishlaydi:\n\n- `try` ichida xato bo'lsa — qolgan qatorlar o'tkazib yuboriladi va mos `catch` ishlaydi.\n- `catch` bloklari **yuqoridan pastga** tekshiriladi. Shuning uchun aniqroq exception (subclass) yuqorida bo'lishi kerak; aks holda compiler \"already caught\" xatosini beradi.\n- Multi-catch: `catch (IOException | SQLException e)` — bir xil ishlov uchun.\n- `finally` **har doim** ishlaydi: xato bo'lsa ham, bo'lmasa ham, hatto `try` ichida `return` bo'lsa ham. Faqat `System.exit()` yoki JVM o'chishi uni to'xtatadi.\n\nKo'p uchraydigan xato: `finally` ichida `return` yozish — u asl exception'ni **yutib yuboradi** va natijani almashtiradi.\n\n**try-with-resources** (Java 7+) — resurslarni yopishning to'g'ri usuli. `AutoCloseable` interface'ini implement qilgan har qanday object (`InputStream`, `Connection`, `Scanner`...) `try (...)` ichida e'lon qilinsa, blok tugashi bilan avtomatik `close()` chaqiriladi — xato bo'lsa ham.\n\n- Bir nechta resurs bo'lsa, ular **teskari tartibda** yopiladi.\n- Agar try ichida ham, `close()`'da ham xato bo'lsa — asosiy xato tashlanadi, close xatosi esa unga **suppressed** sifatida biriktiriladi (`e.getSuppressed()`). Eski `finally { close(); }` usulida close xatosi asl xatoni yo'qotib yuborardi.",
          code: `// Eski usul — uzun va xavfli
BufferedReader reader = null;
try {
    reader = new BufferedReader(new FileReader("data.txt"));
    return reader.readLine();
} finally {
    if (reader != null) reader.close();   // close() ham xato berishi mumkin
}

// To'g'ri usul — try-with-resources
String firstLine(Path path) throws IOException {
    try (BufferedReader reader = Files.newBufferedReader(path)) {
        return reader.readLine();
    }                                     // reader.close() avtomatik
}

// Bir nechta resurs: teskari tartibda yopiladi (avval ps, keyin conn)
try (Connection conn = dataSource.getConnection();
     PreparedStatement ps = conn.prepareStatement("SELECT name FROM users WHERE id = ?")) {
    ps.setLong(1, id);
    try (ResultSet rs = ps.executeQuery()) {
        return rs.next() ? rs.getString("name") : null;
    }
} catch (SQLException e) {
    throw new DataLoadException("Cannot load user " + id, e);
}

// O'zingizning resursingiz
class Timer implements AutoCloseable {
    private final long start = System.nanoTime();
    @Override public void close() {
        System.out.println("took " + (System.nanoTime() - start) / 1_000_000 + " ms");
    }
}
try (var t = new Timer()) { doWork(); }`,
          lang: 'java',
        },
        {
          title: "Custom exception'lar va cause bilan o'rash",
          body: "Standart exception'lar ko'pincha yetarli: noto'g'ri argument — `IllegalArgumentException`, noto'g'ri holat — `IllegalStateException`. Lekin biznes xatolari uchun **o'z exception'ingiz** kodni o'qishli qiladi: `OrderNotFoundException` `RuntimeException(\"not found\")`'dan ko'ra ko'proq narsa aytadi va uni alohida ushlash mumkin.\n\nQoidalar:\n\n- Nomi `...Exception` bilan tugasin va **nima bo'lganini** aytsin.\n- Odatda `RuntimeException`'dan meros oling.\n- Foydali ma'lumot qo'shing (masalan `orderId` field'i) — log va xabar uchun.\n- `(String message, Throwable cause)` constructor'ini qo'shing.\n\n**Exception chaining (wrapping)**: past darajadagi xatoni (SQLException, IOException) ushlab, uni o'z darajangizdagi exception'ga o'raysiz — lekin **asl xatoni cause sifatida** berasiz. Shunda stack trace'da `Caused by: java.sql.SQLException: ...` ko'rinadi va asl sabab yo'qolmaydi.\n\nKo'p uchraydigan xato: `throw new ServiceException(e.getMessage());` — cause berilmagan, asl stack trace yo'qoldi. Production'da xatoni topish juda qiyinlashadi.\n\nBir nechta biznes xatolari uchun umumiy ota class qilish qulay (`DomainException`) — keyin hammasini bir joyda ushlash mumkin.",
          code: `// Umumiy ota class
public abstract class DomainException extends RuntimeException {
    protected DomainException(String message) { super(message); }
    protected DomainException(String message, Throwable cause) { super(message, cause); }
}

public class OrderNotFoundException extends DomainException {
    private final long orderId;

    public OrderNotFoundException(long orderId) {
        super("Order not found: " + orderId);
        this.orderId = orderId;
    }
    public long getOrderId() { return orderId; }
}

public class PaymentFailedException extends DomainException {
    public PaymentFailedException(String message, Throwable cause) {
        super(message, cause);                       // cause saqlanadi
    }
}

// Ishlatish
Order findOrder(long id) {
    return repository.findById(id)
            .orElseThrow(() -> new OrderNotFoundException(id));
}

void pay(Order order) {
    try {
        paymentClient.charge(order.total());
    } catch (IOException e) {
        throw new PaymentFailedException("Payment failed for order " + order.id(), e);
    }
}`,
          lang: 'java',
        },
        {
          title: "Best practice'lar va Spring bilan bog'liqlik",
          body: "Yaxshi exception handling qoidalari:\n\n1. **Yutib yubormang.** Bo'sh `catch {}` yoki faqat `e.printStackTrace()` — eng yomon odat. Xato yo'qoladi, dastur noto'g'ri holatda davom etadi. Agar haqiqatan ham e'tiborsiz qoldirish kerak bo'lsa — sababini izohda yozing va log qiling.\n2. **Fail fast.** Noto'g'ri ma'lumotni imkon qadar erta tekshiring: method boshida `Objects.requireNonNull()`, argument validation. Xato manbaga yaqin joyda chiqsa, uni topish oson.\n3. **Cause bilan o'rang.** Qatlam chegarasida (DB → service) past darajadagi xatoni o'z exception'ingizga o'rang, cause'ni bering.\n4. **Log yoki throw — ikkalasi emas.** Xatoni ham log qilib, ham qayta tashlasangiz — log'da bitta xato 3–4 marta chiqadi. Odatda eng yuqori qatlamda bir marta log qilinadi.\n5. **Aniq exception'ni ushlang.** `catch (Exception e)` faqat eng yuqori darajada (global handler'da) bo'lsin.\n6. **Oqimni boshqarish uchun ishlatmang.** Exception qimmat (stack trace yig'iladi). \"Topilmasa\" holati normal bo'lsa — `Optional` qaytaring.\n7. **Xabar foydali bo'lsin**: \"Error\" emas, \"Order 42 not found\" — qiymatlarni qo'shing (lekin parol yoki token'ni emas!).\n\nSpring'da bu qanday davom etadi: service qatlami biznes exception tashlaydi, `@RestControllerAdvice` ichidagi `@ExceptionHandler` ularni bir joyda ushlab, mos HTTP status'ga aylantiradi — masalan `OrderNotFoundException` → 404, validation xatosi → 400.",
          code: `// YOMON
try {
    sendEmail(user);
} catch (Exception e) {
    // hech narsa — xato yo'qoldi
}

// YOMON: log + throw = takroriy log
catch (SQLException e) {
    log.error("DB error", e);
    throw new DataLoadException("DB error", e);
}

// YAXSHI: fail fast
public Order createOrder(String customerId, List<Item> items) {
    Objects.requireNonNull(customerId, "customerId");
    if (items.isEmpty()) {
        throw new IllegalArgumentException("Order must have at least one item");
    }
    // ...
}

// YAXSHI: kutiladigan "yo'qlik" uchun exception emas, Optional
Optional<User> findByEmail(String email) { /* ... */ }`,
          lang: 'java',
        },
      ],
      vocab: [
        { en: 'throw', uz: '(exception) tashlash' },
        { en: 'catch', uz: 'ushlash' },
        { en: 'checked exception', uz: "compiler tekshiradigan exception" },
        { en: 'unchecked exception', uz: "compiler tekshirmaydigan (RuntimeException)" },
        { en: 'stack trace', uz: "xato yuz bergan chaqiruvlar zanjiri" },
        { en: 'swallow an exception', uz: "exception'ni yutib yuborish (e'tiborsiz qoldirish)" },
        { en: 'root cause', uz: 'asl sabab' },
        { en: 'resource leak', uz: "resurs (fayl, connection) yopilmay qolishi" },
      ],
      questions: [
        {
          q: 'What is the difference between checked and unchecked exceptions?',
          a: "Checked exceptions extend Exception but not RuntimeException. The compiler forces us to catch them or declare them with throws, for example IOException. Unchecked exceptions extend RuntimeException, and the compiler does not check them, for example NullPointerException. Checked exceptions are for expected outside problems, and unchecked ones are usually bugs or broken business rules.",
          uz: "Checked exception'lar Exception'dan meros oladi, lekin RuntimeException'dan emas. Compiler bizni ularni ushlashga yoki throws bilan e'lon qilishga majburlaydi, masalan IOException. Unchecked exception'lar RuntimeException'dan meros oladi va compiler ularni tekshirmaydi, masalan NullPointerException. Checked exception'lar kutiladigan tashqi muammolar uchun, unchecked'lar esa odatda bug'lar yoki buzilgan biznes qoidalari.",
          followUp: 'Which one do you prefer for your own exceptions and why?',
          level: 'junior',
        },
        {
          q: 'What is the difference between Error and Exception?',
          a: "Both extend Throwable. An Error is a serious problem in the JVM, like OutOfMemoryError or StackOverflowError. The application usually cannot recover from it, so we do not catch it. An Exception is a problem that the application can handle, like a missing file or invalid input.",
          uz: "Ikkalasi ham Throwable'dan meros oladi. Error — JVM'dagi jiddiy muammo, masalan OutOfMemoryError yoki StackOverflowError. Ilova odatda undan tiklana olmaydi, shuning uchun uni ushlamaymiz. Exception — ilova hal qila oladigan muammo, masalan yo'q fayl yoki noto'g'ri input.",
          level: 'junior',
        },
        {
          q: 'What is try-with-resources?',
          a: "It is a try statement that closes resources automatically. Any object that implements AutoCloseable can be used, like a stream or a database connection. The resource is closed at the end of the block, even if there is an exception. If close also throws an exception, it is added as a suppressed exception, so we do not lose the main error.",
          uz: "Bu resurslarni avtomatik yopadigan try ko'rinishi. AutoCloseable'ni implement qilgan istalgan object ishlatilishi mumkin, masalan stream yoki database connection. Resurs blok oxirida yopiladi, hatto exception bo'lsa ham. Agar close ham exception tashlasa, u suppressed exception sifatida qo'shiladi, shuning uchun asosiy xatoni yo'qotmaymiz.",
          example: `try (var reader = Files.newBufferedReader(path)) {
    return reader.readLine();
}`,
          level: 'junior',
        },
        {
          q: 'Does finally always run?',
          a: "Almost always. It runs if the try block finishes normally, if there is an exception, and even if there is a return in try. It does not run only if the JVM stops, for example after System.exit() or a crash. Also, we should never put a return in finally, because it hides the original exception.",
          uz: "Deyarli har doim. U try bloki normal tugasa ham, exception bo'lsa ham, hatto try ichida return bo'lsa ham ishlaydi. Faqat JVM to'xtasa ishlamaydi, masalan System.exit() yoki crash'dan keyin. Yana, finally ichiga hech qachon return qo'ymasligimiz kerak, chunki u asl exception'ni yashiradi.",
          level: 'junior',
        },
        {
          q: 'How do you create a custom exception? When do you need one?',
          a: "I create a class that usually extends RuntimeException and add constructors with a message and a cause. I need one when a business error has a clear meaning, like OrderNotFoundException. It makes the code easier to read, and we can handle this error in a special way. For example, we can map it to a 404 response.",
          uz: "Odatda RuntimeException'dan meros oladigan class yarataman va message hamda cause bilan constructor'lar qo'shaman. Biznes xatosining aniq ma'nosi bo'lsa, masalan OrderNotFoundException, menga custom exception kerak bo'ladi. Bu kodni o'qishni osonlashtiradi va bu xatoni alohida usulda hal qilishimiz mumkin. Masalan, uni 404 response'ga map qilishimiz mumkin.",
          example: `public class OrderNotFoundException extends RuntimeException {
    public OrderNotFoundException(long id) {
        super("Order not found: " + id);
    }
}`,
          level: 'junior',
        },
        {
          q: 'What are the best practices for exception handling?',
          a: "First, never swallow an exception with an empty catch block. Second, fail fast: validate input early and throw a clear exception. Third, when you wrap an exception, always pass the original one as the cause. Also, log the error only once, usually at the top level, and catch specific exceptions, not just Exception. Finally, do not use exceptions for normal control flow.",
          uz: "Birinchidan, exception'ni bo'sh catch bloki bilan hech qachon yutib yubormang. Ikkinchidan, fail fast: input'ni erta tekshiring va aniq exception tashlang. Uchinchidan, exception'ni o'raganda asl exception'ni doim cause sifatida bering. Yana, xatoni faqat bir marta, odatda eng yuqori darajada log qiling va faqat Exception'ni emas, aniq exception'larni ushlang. Nihoyat, oddiy oqimni boshqarish uchun exception ishlatmang.",
          followUp: 'Why is it bad to log an exception and then throw it again?',
          level: 'middle',
        },
        {
          q: 'What is exception chaining and why is it important?',
          a: "Exception chaining means we catch a low-level exception and throw a new one with the original as the cause. For example, we catch SQLException and throw our own DataLoadException. The stack trace then shows both, with a 'Caused by' line. If we forget the cause, we lose the real reason of the error, and debugging in production becomes very hard.",
          uz: "Exception chaining — past darajadagi exception'ni ushlab, asl exception'ni cause qilib yangisini tashlash. Masalan, SQLException'ni ushlaymiz va o'zimizning DataLoadException'ni tashlaymiz. Shunda stack trace ikkalasini ham 'Caused by' qatori bilan ko'rsatadi. Agar cause'ni unutsak, xatoning haqiqiy sababini yo'qotamiz va production'da debug qilish juda qiyinlashadi.",
          level: 'middle',
        },
      ],
      resources: [
        { title: 'Oracle Java Tutorials — Exceptions', url: 'https://docs.oracle.com/javase/tutorial/essential/exceptions/index.html' },
        { title: 'Baeldung — Checked and Unchecked Exceptions', url: 'https://www.baeldung.com/java-checked-unchecked-exceptions' },
        { title: 'Baeldung — Java try-with-resources', url: 'https://www.baeldung.com/java-try-with-resources' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'java-modern-functional',
      title: 'Zamonaviy Java: lambda, Stream API, Optional, record, switch',
      days: [27],
      summary: "Java 8 tilga funksional uslubni olib kirdi: lambda (anonim funksiya), functional interface'lar (`Function`, `Predicate`, `Supplier`, `Consumer`) va method reference'lar. Stream API collection'larni deklarativ usulda qayta ishlash imkonini beradi: filter, map, reduce, collect. Stream'lar lazy — intermediate operatsiyalar terminal operatsiya chaqirilmaguncha ishlamaydi. `Optional` — \"qiymat bo'lmasligi mumkin\" degan ma'noni aniq ko'rsatadigan qaytariladigan tur, null o'rniga. Keyingi versiyalar sintaksisni yanada qisqartirdi: `var` (10), switch expression (14), text block (15), record (16), sealed class (17), switch'da pattern matching (21). Intervyuda Stream bilan kichik masala yechish va Optional'ni to'g'ri ishlatish ko'p so'raladi.",
      keyPoints: [
        "Lambda — functional interface'ning (bitta abstract method) qisqa implementatsiyasi",
        "Function<T,R> — o'zgartiradi, Predicate<T> — tekshiradi, Supplier<T> — beradi, Consumer<T> — qabul qiladi",
        "Method reference: User::getName, String::valueOf, System.out::println",
        "Stream = source → intermediate (filter, map, sorted) → terminal (collect, count, forEach)",
        "Stream lazy: terminal operatsiyasiz hech narsa ishlamaydi; stream'ni qayta ishlatib bo'lmaydi",
        "Collectors.groupingBy, toMap, joining, counting — eng ko'p ishlatiladigan collector'lar",
        "Optional — faqat return turi uchun; get() o'rniga orElse/orElseThrow/map",
        "record, var, switch expression, text block, sealed + pattern matching — zamonaviy kod belgilari",
      ],
      lesson: [
        {
          title: "Lambda va functional interface'lar",
          body: "**Functional interface** — faqat **bitta abstract method**'i bor interface (`@FunctionalInterface` bilan belgilash mumkin). **Lambda** — shu method'ning qisqa, anonim implementatsiyasi. Java 8'gacha buning uchun anonymous class yozilardi — 5–6 qator. Lambda bilan — bitta qator.\n\nLambda sintaksisi: `(parametrlar) -> ifoda` yoki `(parametrlar) -> { bloklar; return ...; }`. Parametr turlarini compiler o'zi chiqaradi.\n\n`java.util.function` paketidagi asosiy interface'lar:\n\n- `Function<T, R>` — T oladi, R qaytaradi: `apply()`. Masalan, User → UserDto.\n- `Predicate<T>` — T oladi, boolean qaytaradi: `test()`. Filter uchun. `and()`, `or()`, `negate()` bilan birlashadi.\n- `Supplier<T>` — hech narsa olmaydi, T qaytaradi: `get()`. Lazy yaratish uchun.\n- `Consumer<T>` — T oladi, hech narsa qaytarmaydi: `accept()`. forEach uchun.\n- `BiFunction<T, U, R>`, `UnaryOperator<T>`, `BinaryOperator<T>` — variantlar.\n\n**Effectively final** qoidasi: lambda tashqaridagi local o'zgaruvchini ishlata oladi, lekin faqat u o'zgarmasa. Sabab: lambda o'zgaruvchining **nusxasini** oladi va boshqa thread'da keyinroq ishlashi mumkin — o'zgaruvchan qiymat chalkashlik keltirardi.\n\nKo'p uchraydigan xato: lambda ichida tashqi `int count`'ni oshirishga urinish (`count++`) — compile xatosi. Buning o'rniga stream'ning `count()` yoki `sum()`'ini ishlating.",
          code: `// Java 8'gacha
Comparator<String> byLength = new Comparator<>() {
    @Override public int compare(String a, String b) {
        return Integer.compare(a.length(), b.length());
    }
};
// Lambda bilan
Comparator<String> byLength2 = (a, b) -> Integer.compare(a.length(), b.length());

Function<String, Integer> length = s -> s.length();
Predicate<String> isEmpty = s -> s.isEmpty();
Predicate<String> notEmpty = isEmpty.negate();
Supplier<List<String>> newList = () -> new ArrayList<>();
Consumer<String> printer = s -> System.out.println(s);

length.apply("java");          // 4
notEmpty.test("");             // false

// O'z functional interface'ingiz
@FunctionalInterface
interface Discount {
    long apply(long price);
}
Discount tenPercent = price -> price * 90 / 100;

// Effectively final
String prefix = "Hi, ";
Consumer<String> greet = name -> System.out.println(prefix + name);  // OK
// prefix = "Hello";   -> shunda yuqoridagi lambda compile bo'lmaydi`,
          lang: 'java',
        },
        {
          title: "Method reference'lar",
          body: "Agar lambda faqat bitta mavjud method'ni chaqirsa, uni **method reference** bilan yanada qisqa yozish mumkin. To'rt turi bor:\n\n1. **Static method**: `Integer::parseInt` ≡ `s -> Integer.parseInt(s)`\n2. **Aniq object'ning method'i**: `System.out::println` ≡ `x -> System.out.println(x)`\n3. **Tur bo'yicha instance method** (birinchi parametr — object): `String::toUpperCase` ≡ `s -> s.toUpperCase()`; `User::getName` ≡ `u -> u.getName()`\n4. **Constructor**: `ArrayList::new` ≡ `() -> new ArrayList<>()`; `UserDto::new` ≡ `u -> new UserDto(u)`\n\nQachon ishlatish kerak? Method reference o'qishni osonlashtirsa. Agar lambda ichida qo'shimcha logika bo'lsa (`u -> u.getName().trim()`) — lambda qoldiring, majburlamang.",
          code: `List<String> raw = List.of("3", "1", "2");

List<Integer> numbers = raw.stream()
        .map(Integer::parseInt)          // static method
        .sorted()
        .toList();

numbers.forEach(System.out::println);    // aniq object'ning method'i

List<String> upper = List.of("a", "b").stream()
        .map(String::toUpperCase)        // tur bo'yicha instance method
        .toList();

record UserDto(String name) {}
List<UserDto> dtos = List.of("Ali", "Vali").stream()
        .map(UserDto::new)               // constructor reference
        .toList();`,
          lang: 'java',
        },
        {
          title: 'Stream API: pipeline va lazy evaluation',
          body: "**Stream** — ma'lumotlar ustida operatsiyalar zanjiri (pipeline). U ma'lumotni **saqlamaydi** va manbani **o'zgartirmaydi** — yangi natija yaratadi.\n\nPipeline uch qismdan iborat:\n\n1. **Source** — `list.stream()`, `Stream.of(...)`, `IntStream.range(0, 10)`, `Files.lines(path)`.\n2. **Intermediate** operatsiyalar — yangi Stream qaytaradi: `filter`, `map`, `flatMap`, `sorted`, `distinct`, `limit`, `skip`, `peek`.\n3. **Terminal** operatsiya — natija beradi va stream'ni yopadi: `collect`, `toList()` (Java 16+), `forEach`, `count`, `reduce`, `findFirst`, `anyMatch`, `min/max`.\n\n**Lazy evaluation**: intermediate operatsiyalar terminal operatsiya chaqirilmaguncha **umuman ishlamaydi**. Bundan tashqari, elementlar pipeline'dan **bittadan** o'tadi (hamma filter, keyin hamma map emas). Shuning uchun `findFirst()` yoki `limit()` bilan kerakli natija topilishi bilan qolgan elementlar umuman qayta ishlanmaydi (short-circuit).\n\nMuhim qoidalar:\n\n- Stream'ni **bir marta** ishlatish mumkin. Ikkinchi terminal operatsiya — `IllegalStateException`.\n- Lambda'lar ichida **side effect** qilmang (tashqi list'ga qo'shish) — `collect` ishlating.\n- `parallelStream()` — avtomatik tezlik emas: kichik ma'lumotda sekinroq, umumiy ForkJoinPool'ni band qiladi. Faqat o'lchab ko'rgandan keyin.\n- Primitive'lar uchun `IntStream`, `mapToInt()` — boxing'siz, tezroq, `sum()`, `average()` bor.",
          code: `record Order(String customer, String status, long amount) {}

List<Order> orders = List.of(
        new Order("Ali", "PAID", 120),
        new Order("Vali", "NEW", 50),
        new Order("Ali", "PAID", 80),
        new Order("Bek", "CANCELLED", 200));

// Imperativ uslub
long total = 0;
for (Order o : orders) {
    if (o.status().equals("PAID")) total += o.amount();
}

// Stream uslubi — "nima" kerakligini aytamiz, "qanday" emas
long paidTotal = orders.stream()
        .filter(o -> o.status().equals("PAID"))
        .mapToLong(Order::amount)
        .sum();                                   // 200

// Lazy: terminal operatsiya yo'q -> hech narsa chop etilmaydi
Stream<Order> s = orders.stream().peek(o -> System.out.println("visit " + o));

// Short-circuit: faqat 1-element tekshiriladi
Optional<Order> firstBig = orders.stream()
        .peek(o -> System.out.println("check " + o.customer()))
        .filter(o -> o.amount() > 100)
        .findFirst();                             // "check Ali" — va tamom

// flatMap: list'lar list'ini bitta stream'ga
List<List<String>> tagsPerPost = List.of(List.of("java", "spring"), List.of("java", "sql"));
List<String> uniqueTags = tagsPerPost.stream()
        .flatMap(List::stream)
        .distinct()
        .sorted()
        .toList();                                // [java, spring, sql]`,
          lang: 'java',
        },
        {
          title: "Collector'lar: groupingBy, toMap, reduce",
          body: "`collect()` — stream natijasini kerakli struktura'ga yig'ish. `Collectors` class'ida tayyor collector'lar bor:\n\n- `toList()`, `toSet()` — collection'ga.\n- `joining(\", \")` — String'larni birlashtirish.\n- `toMap(keyFn, valueFn)` — Map'ga. **Diqqat**: ikki element bir xil key bersa — `IllegalStateException: Duplicate key`. Uchinchi argument — merge funksiyasi: `(a, b) -> a + b`.\n- `groupingBy(classifier)` — SQL'dagi GROUP BY: `Map<K, List<T>>`. Ikkinchi argument — har guruh uchun downstream collector: `counting()`, `summingLong()`, `mapping()`, `averagingDouble()`.\n- `partitioningBy(predicate)` — ikki guruh: `true` va `false`.\n\n**reduce** — barcha elementlarni bitta qiymatga \"yig'ish\": `reduce(0, Integer::sum)`. Birinchi argument — boshlang'ich qiymat (identity). Amalda tayyor `sum()`, `max()`, `count()` ko'proq ishlatiladi.\n\n`Stream.toList()` (Java 16+) **unmodifiable** list qaytaradi, `Collectors.toList()` esa (hozircha) ArrayList — natijani keyin o'zgartirmoqchi bo'lsangiz, buni yodda tuting.\n\nInterview'da qanday aytish kerak: Stream masalasini yechayotganda qadamlarni ovoz chiqarib ayting — \"First I filter paid orders, then I group them by customer, and then I sum the amounts.\"",
          code: `// Har bir mijoz bo'yicha to'langan summa
Map<String, Long> totalByCustomer = orders.stream()
        .filter(o -> o.status().equals("PAID"))
        .collect(Collectors.groupingBy(Order::customer,
                                       Collectors.summingLong(Order::amount)));
// {Ali=200}

// Status bo'yicha nechta buyurtma
Map<String, Long> countByStatus = orders.stream()
        .collect(Collectors.groupingBy(Order::status, Collectors.counting()));
// {PAID=2, NEW=1, CANCELLED=1}

// Mijoz -> buyurtmalar summalari ro'yxati
Map<String, List<Long>> amounts = orders.stream()
        .collect(Collectors.groupingBy(Order::customer,
                 Collectors.mapping(Order::amount, Collectors.toList())));

// toMap: dublikat key'da merge funksiyasi kerak!
Map<String, Long> sumMap = orders.stream()
        .collect(Collectors.toMap(Order::customer, Order::amount, Long::sum));

// Katta va kichik buyurtmalar
Map<Boolean, List<Order>> bigOrSmall = orders.stream()
        .collect(Collectors.partitioningBy(o -> o.amount() >= 100));

// joining va reduce
String names = orders.stream().map(Order::customer).distinct()
        .collect(Collectors.joining(", "));          // "Ali, Vali, Bek"
int sum = Stream.of(1, 2, 3, 4).reduce(0, Integer::sum);   // 10`,
          lang: 'java',
        },
        {
          title: "Optional'ni to'g'ri ishlatish",
          body: "`Optional<T>` — qiymat bo'lishi yoki bo'lmasligi mumkin bo'lgan \"quti\". Asosiy maqsadi — method **signature**'ida \"natija bo'lmasligi mumkin\" deb aniq aytish va `NullPointerException`'dan himoya qilish. Spring Data'da `findById()` aynan `Optional` qaytaradi.\n\nTo'g'ri ishlatish:\n\n- `map()`, `filter()`, `flatMap()` — qutini ochmasdan o'zgartirish.\n- `orElse(default)` — bo'lmasa default qiymat.\n- `orElseGet(() -> ...)` — default qimmat bo'lsa (lazy).\n- `orElseThrow(() -> new NotFoundException(...))` — bo'lmasa exception. Service qatlamida eng ko'p ishlatiladigani.\n- `ifPresent(...)` / `ifPresentOrElse(...)`.\n\nNoto'g'ri ishlatish (anti-pattern'lar):\n\n- `opt.get()` tekshiruvsiz — bu yana NPE'ning boshqa nomi (`NoSuchElementException`).\n- `if (opt.isPresent()) { opt.get() }` — null tekshiruvining uzunroq varianti; `map`/`orElse` ishlating.\n- Optional'ni **field**, **method parametri** yoki **collection elementi** sifatida ishlatish. U faqat **return turi** uchun mo'ljallangan. Bo'sh collection uchun Optional emas, bo'sh list qaytaring.\n- Optional qaytaradigan method'dan `null` qaytarish — eng yomoni.\n\nKo'p uchraydigan xato: `orElse(createDefault())` — `createDefault()` qiymat **bor bo'lsa ham** chaqiriladi, chunki argument oldin hisoblanadi. Qimmat operatsiya bo'lsa (DB so'rovi) — `orElseGet`.",
          code: `Optional<User> findByEmail(String email) {
    return Optional.ofNullable(usersByEmail.get(email));
}

// YOMON
User u = findByEmail(email).get();                  // bo'lmasa -> NoSuchElementException
if (findByEmail(email).isPresent()) { /* ... */ }   // uzun va ma'nosiz

// YAXSHI
User user = findByEmail(email)
        .orElseThrow(() -> new UserNotFoundException(email));

String city = findByEmail(email)
        .map(User::address)
        .map(Address::city)
        .orElse("Unknown");

findByEmail(email).ifPresentOrElse(
        found -> mailer.send(found),
        () -> log.warn("No user for {}", email));

// orElse vs orElseGet
User a = findByEmail(email).orElse(loadGuestFromDb());        // DB har doim chaqiriladi!
User b = findByEmail(email).orElseGet(() -> loadGuestFromDb()); // faqat kerak bo'lsa`,
          lang: 'java',
        },
        {
          title: "Zamonaviy sintaksis: var, switch, text block, record, sealed",
          body: "Java 17 va 21 — hozirgi LTS versiyalar va Spring Boot 3 kamida Java 17 talab qiladi. Shu sababli intervyuer zamonaviy sintaksisni bilishingizni kutadi.\n\n- **var** (10) — local o'zgaruvchi turini compiler chiqaradi: `var users = new ArrayList<User>();`. Bu dinamik tiplash emas — tur compile vaqtida qat'iy belgilanadi. Faqat local o'zgaruvchilar uchun; tur o'ng tomondan aniq ko'rinmasa, ishlatmang.\n- **Switch expression** (14) — `->` sintaksisi, qiymat qaytaradi, `break` kerak emas, fall-through yo'q. Enum'da barcha holatlar qamralmasa — compile xatosi. Ko'p qatorli holatda `yield`.\n- **Text block** (15) — `\"\"\"` ichida ko'p qatorli String: JSON, SQL uchun qulay.\n- **record** (16) — immutable data class (OOP mavzusida batafsil).\n- **Pattern matching for instanceof** (16) — `if (obj instanceof String s)` — cast avtomatik.\n- **Sealed class/interface** (17) — `permits` bilan qaysi class'lar meros olishi mumkinligini cheklaydi. Domen modelini yopiq qiladi: \"Payment faqat Card, Cash yoki Transfer bo'lishi mumkin\".\n- **Pattern matching for switch + record patterns** (21) — sealed tur ustida switch: compiler barcha variant qamralganini tekshiradi, `default` kerak emas. Yangi tur qo'shsangiz — switch'lar compile bo'lmay qoladi va siz hech birini unutmaysiz.",
          code: `// var
var orders = new ArrayList<Order>();         // tur: ArrayList<Order>
for (var entry : totalByCustomer.entrySet()) { /* ... */ }

// Switch expression
enum Status { NEW, PAID, SHIPPED, CANCELLED }
String label = switch (status) {
    case NEW -> "Waiting for payment";
    case PAID, SHIPPED -> "In progress";
    case CANCELLED -> {
        log.info("cancelled order");
        yield "Cancelled";
    }
};

// Text block
String json = """
        {
          "name": "Ali",
          "role": "ADMIN"
        }
        """;

// Sealed + record + pattern matching (Java 21)
sealed interface Payment permits Card, Cash, Transfer {}
record Card(String number, long amount) implements Payment {}
record Cash(long amount) implements Payment {}
record Transfer(String iban, long amount) implements Payment {}

long fee(Payment p) {
    return switch (p) {
        case Card c when c.amount() > 1_000_000 -> 0;   // guard
        case Card c -> c.amount() / 100;                  // 1%
        case Cash cash -> 0;
        case Transfer(String iban, long amount) -> 500;  // record pattern
    };                                                    // default shart emas
}`,
          lang: 'java',
        },
      ],
      vocab: [
        { en: 'lambda expression', uz: 'lambda ifoda — anonim funksiya' },
        { en: 'functional interface', uz: "bitta abstract method'li interface" },
        { en: 'method reference', uz: "method'ga havola (User::getName)" },
        { en: 'pipeline', uz: 'operatsiyalar zanjiri' },
        { en: 'lazy evaluation', uz: "kerak bo'lgandagina hisoblash" },
        { en: 'intermediate / terminal operation', uz: "oraliq / yakuniy operatsiya" },
        { en: 'side effect', uz: "qo'shimcha ta'sir (tashqi holatni o'zgartirish)" },
        { en: 'exhaustive', uz: "barcha holatlarni qamrab olgan" },
      ],
      questions: [
        {
          q: 'What is a functional interface? Can you name some?',
          a: "A functional interface is an interface with only one abstract method. We can implement it with a lambda or a method reference. Common examples are Function, which takes a value and returns a result, Predicate, which returns a boolean, Supplier, which gives a value, and Consumer, which takes a value and returns nothing. Runnable and Comparator are functional interfaces too.",
          uz: "Functional interface — faqat bitta abstract method'i bor interface. Uni lambda yoki method reference bilan implement qilishimiz mumkin. Keng tarqalgan misollar: qiymat olib natija qaytaradigan Function, boolean qaytaradigan Predicate, qiymat beradigan Supplier va qiymat olib hech narsa qaytarmaydigan Consumer. Runnable va Comparator ham functional interface'lar.",
          level: 'junior',
        },
        {
          q: 'What is the difference between intermediate and terminal operations in streams?',
          a: "Intermediate operations, like filter, map, and sorted, return a new stream. They are lazy, so they do nothing until a terminal operation is called. Terminal operations, like collect, count, and forEach, start the processing and produce a result. After a terminal operation, the stream is closed and we cannot use it again.",
          uz: "filter, map va sorted kabi intermediate operatsiyalar yangi stream qaytaradi. Ular lazy, ya'ni terminal operatsiya chaqirilmaguncha hech narsa qilmaydi. collect, count va forEach kabi terminal operatsiyalar qayta ishlashni boshlaydi va natija beradi. Terminal operatsiyadan keyin stream yopiladi va uni qayta ishlata olmaymiz.",
          followUp: 'What does lazy evaluation give us?',
          level: 'junior',
        },
        {
          q: 'How do you group a list of orders by customer and sum the amounts?',
          a: "I use the Stream API with Collectors.groupingBy. The first argument is the key, the customer. The second argument is a downstream collector, summingLong, which sums the amounts in each group. The result is a Map from customer to total amount.",
          uz: "Stream API'ni Collectors.groupingBy bilan ishlataman. Birinchi argument — key, ya'ni mijoz. Ikkinchi argument — downstream collector summingLong, u har bir guruhdagi summalarni qo'shadi. Natija — mijozdan umumiy summaga Map.",
          example: `Map<String, Long> totals = orders.stream()
        .collect(Collectors.groupingBy(Order::customer,
                 Collectors.summingLong(Order::amount)));`,
          level: 'middle',
        },
        {
          q: 'What is the difference between map and flatMap?',
          a: "map changes each element into exactly one new element. flatMap changes each element into a stream, and then joins all these streams into one flat stream. For example, if each post has a list of tags, map gives a stream of lists, but flatMap gives a stream of all tags.",
          uz: "map har bir elementni aynan bitta yangi elementga aylantiradi. flatMap har bir elementni stream'ga aylantiradi va keyin bu stream'larning hammasini bitta tekis stream'ga birlashtiradi. Masalan, har bir post'da teglar ro'yxati bo'lsa, map list'lar stream'ini beradi, flatMap esa barcha teglar stream'ini beradi.",
          example: `posts.stream()
     .flatMap(post -> post.tags().stream())
     .distinct()
     .toList();`,
          level: 'junior',
        },
        {
          q: 'How should you use Optional correctly?',
          a: "I use Optional only as a return type, when a method may have no result, like findById. I do not use it for fields or method parameters. Instead of calling get(), I use orElseThrow, orElse, or map. Also, I use orElseGet when the default value is expensive, because orElse always runs its argument.",
          uz: "Optional'ni faqat return turi sifatida, method'ning natijasi bo'lmasligi mumkin bo'lganda ishlataman, masalan findById. Uni field'lar yoki method parametrlari uchun ishlatmayman. get() chaqirish o'rniga orElseThrow, orElse yoki map ishlataman. Yana default qiymat qimmat bo'lsa orElseGet ishlataman, chunki orElse o'z argumentini har doim bajaradi.",
          example: `User user = repo.findById(id)
        .orElseThrow(() -> new UserNotFoundException(id));`,
          followUp: 'What is the difference between orElse and orElseGet?',
          level: 'middle',
        },
        {
          q: 'What is a method reference?',
          a: "A method reference is a short way to write a lambda that only calls one existing method. For example, User::getName is the same as u -> u.getName(). There are four kinds: static methods, instance methods of a specific object, instance methods of a type, and constructors like ArrayList::new. It makes the code shorter and easier to read.",
          uz: "Method reference — faqat bitta mavjud method'ni chaqiradigan lambda'ni qisqa yozish usuli. Masalan, User::getName — bu u -> u.getName() bilan bir xil. To'rt turi bor: static method'lar, aniq object'ning instance method'lari, tur bo'yicha instance method'lar va ArrayList::new kabi constructor'lar. U kodni qisqaroq va o'qishga osonroq qiladi.",
          level: 'junior',
        },
        {
          q: 'What new Java features from versions 9 to 21 do you use?',
          a: "I use var for local variables when the type is clear. I use records for DTOs, and switch expressions instead of long if-else chains. Text blocks are very useful for SQL and JSON in tests. In Java 21, I like pattern matching for switch with sealed interfaces, because the compiler checks that I handle all cases. And of course, virtual threads in Java 21.",
          uz: "Tur aniq bo'lganda local o'zgaruvchilar uchun var ishlataman. DTO'lar uchun record'lar, uzun if-else zanjirlari o'rniga switch expression'lar ishlataman. Text block'lar testlarda SQL va JSON uchun juda foydali. Java 21'da sealed interface'lar bilan switch'dagi pattern matching menga yoqadi, chunki compiler barcha holatlarni qamraganimni tekshiradi. Va albatta, Java 21'dagi virtual thread'lar.",
          followUp: 'What is a sealed class and why would you use it?',
          level: 'middle',
        },
        {
          q: 'Why must variables used in a lambda be effectively final?',
          a: "A lambda captures a copy of the local variable, not the variable itself. The lambda can run later, maybe in another thread, when the method is already finished. If the variable could change, the copy and the original could be different, and this would be confusing and unsafe. So Java allows only variables that never change after they are assigned.",
          uz: "Lambda local o'zgaruvchining o'zini emas, nusxasini oladi. Lambda keyinroq, balki boshqa thread'da, method allaqachon tugaganda ishlashi mumkin. Agar o'zgaruvchi o'zgarishi mumkin bo'lsa, nusxa va asl qiymat har xil bo'lib qolishi mumkin edi, bu esa chalkash va xavfli bo'lardi. Shuning uchun Java faqat qiymat berilgandan keyin hech qachon o'zgarmaydigan o'zgaruvchilarga ruxsat beradi.",
          level: 'middle',
        },
      ],
      resources: [
        { title: 'Oracle Java Tutorials — Lambda Expressions', url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html' },
        { title: 'Baeldung — The Java Stream API Tutorial', url: 'https://www.baeldung.com/java-8-streams' },
        { title: 'Baeldung — Guide to Java Optional', url: 'https://www.baeldung.com/java-optional' },
        { title: 'dev.java — Learn Java', url: 'https://dev.java/learn/' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'java-concurrency',
      title: "Concurrency: thread'lar, synchronized, virtual threads",
      days: [75],
      summary: "Java'da bir nechta ishni bir vaqtda bajarish uchun thread'lar ishlatiladi. Bitta process ichidagi thread'lar heap'ni bo'lishadi — bu tez, lekin xavfli: ikki thread bitta o'zgaruvchini bir vaqtda o'zgartirsa, race condition yuz beradi. Himoya vositalari: `synchronized` (bir vaqtda faqat bitta thread), `volatile` (o'zgarish boshqa thread'larga ko'rinishi), `Atomic*` class'lar (lock'siz atomar operatsiyalar) va `ConcurrentHashMap` kabi thread-safe collection'lar. Amalda thread'lar qo'lda yaratilmaydi — `ExecutorService` thread pool'i ishlatiladi, asinxron zanjirlar uchun esa `CompletableFuture`. Java 21'dagi virtual thread'lar — juda yengil thread'lar: Spring MVC kabi \"har request'ga bitta thread\" server'lar oddiy blocking kod bilan minglab parallel request'ni ko'tara oladi.",
      keyPoints: [
        "Process — alohida xotira; thread — process ichida, heap umumiy, stack alohida",
        "Runnable — natija qaytarmaydi; Callable — natija qaytaradi va checked exception tashlay oladi",
        "Thread'ni qo'lda yaratmang — ExecutorService (thread pool) ishlating va shutdown() qiling",
        "count++ atomar emas (read → add → write) — race condition'ning klassik misoli",
        "synchronized: atomarlik + ko'rinish; volatile: faqat ko'rinish; AtomicInteger: lock'siz atomarlik",
        "Deadlock: ikki thread bir-birining lock'ini kutadi. Yechim — lock'larni doim bir xil tartibda olish",
        "ConcurrentHashMap: thread-safe, null'ga ruxsat yo'q; murakkab amal uchun merge/compute",
        "CompletableFuture: supplyAsync → thenApply → thenCombine → exceptionally → join",
        "Virtual threads (Java 21): blocking I/O'da carrier thread'ni bo'shatadi — millionlab thread mumkin",
      ],
      lesson: [
        {
          title: "Process, thread va thread yaratish",
          body: "**Process** — OS'dagi ishlab turgan dastur: o'z alohida xotirasi bor. Bitta `java -jar app.jar` — bitta process. **Thread** — process ichidagi bajarilish oqimi. Bitta process'dagi barcha thread'lar **heap'ni bo'lishadi**, lekin har birining **o'z stack'i** bor.\n\nThread'lar arzonroq (yaratish, almashtirish) va ma'lumot almashish oson — chunki xotira umumiy. Lekin aynan shu umumiy xotira barcha concurrency muammolarining manbai.\n\nThread yaratish usullari:\n\n- `Thread` class'idan meros olish — eskirgan uslub, ishlatmang (inheritance'ni band qiladi).\n- `Runnable` — `void run()`: natija qaytarmaydi, checked exception tashlay olmaydi.\n- `Callable<V>` — `V call() throws Exception`: natija qaytaradi. ExecutorService'ga beriladi va `Future<V>` olinadi.\n\nMuhim: `thread.start()` yangi thread'da ishga tushiradi. `thread.run()` — oddiy method chaqiruvi, **joriy** thread'da! Bu ko'p uchraydigan xato.\n\n`join()` — boshqa thread tugashini kutish. Thread holatlari: NEW → RUNNABLE → (BLOCKED / WAITING / TIMED_WAITING) → TERMINATED.",
          code: `Runnable task = () -> System.out.println("Running in " + Thread.currentThread().getName());

Thread t = new Thread(task, "worker-1");
t.start();          // yangi thread'da: "Running in worker-1"
t.join();           // tugashini kutamiz

task.run();         // XATO tushuncha: bu main thread'da ishlaydi, yangi thread yo'q

// Callable — natija qaytaradi
Callable<Integer> compute = () -> {
    Thread.sleep(100);
    return 42;
};`,
          lang: 'java',
        },
        {
          title: "ExecutorService va thread pool'lar",
          body: "Har bir vazifa uchun yangi platform thread yaratish qimmat: har biri OS thread'i va ~1 MB stack. 10 000 ta vazifa uchun 10 000 ta thread — xotira tugaydi. Yechim — **thread pool**: oldindan yaratilgan cheklangan sondagi thread'lar navbatdagi (queue) vazifalarni birin-ketin oladi.\n\n`ExecutorService` turlari (`Executors` factory orqali):\n\n- `newFixedThreadPool(n)` — n ta thread. CPU-heavy ish uchun n ≈ CPU yadrolari soni.\n- `newCachedThreadPool()` — kerakicha yaratadi, bo'shlarini qayta ishlatadi. Ehtiyot bo'ling — chegarasi yo'q.\n- `newSingleThreadExecutor()` — bitta thread, vazifalar ketma-ket.\n- `newScheduledThreadPool(n)` — kechiktirilgan yoki davriy vazifalar.\n- `newVirtualThreadPerTaskExecutor()` (Java 21) — har vazifaga yangi virtual thread.\n\n`submit(callable)` darhol `Future` qaytaradi. `future.get()` natija tayyor bo'lguncha **bloklaydi** (timeout bilan chaqirish yaxshiroq). Vazifa ichidagi exception `get()` chaqirilganda `ExecutionException` ichida keladi.\n\nKo'p uchraydigan xato: `shutdown()` chaqirmaslik. Pool thread'lari tirik qoladi va ilova to'xtamaydi. Java 19+ da `ExecutorService` `AutoCloseable` — try-with-resources bilan ishlatsa bo'ladi.\n\nSpring'da odatda pool'ni o'zingiz yaratmaysiz — Tomcat'ning request pool'i, `@Async` va `ThreadPoolTaskExecutor` bor. Lekin ichida aynan shu mexanizm ishlaydi.",
          code: `ExecutorService pool = Executors.newFixedThreadPool(4);
try {
    List<Callable<String>> tasks = List.of(
            () -> fetch("users"),
            () -> fetch("orders"),
            () -> fetch("products"));

    List<Future<String>> futures = pool.invokeAll(tasks);   // hammasi parallel
    for (Future<String> f : futures) {
        System.out.println(f.get(2, TimeUnit.SECONDS));      // timeout bilan kutish
    }
} catch (ExecutionException | TimeoutException e) {        // method: throws InterruptedException
    log.error("Task failed", e);                             // ExecutionException: asl xato getCause()'da
} finally {
    pool.shutdown();                                         // yangi vazifa qabul qilmaydi
    if (!pool.awaitTermination(10, TimeUnit.SECONDS)) {
        pool.shutdownNow();                                  // ishlayotganlarni interrupt qiladi
    }
}

// Java 19+: try-with-resources — close() barcha vazifalarni kutadi
try (ExecutorService executor = Executors.newFixedThreadPool(4)) {
    executor.submit(() -> sendEmail(user));
}`,
          lang: 'java',
        },
        {
          title: 'Race condition, synchronized va Atomic',
          body: "**Race condition** — natija thread'lar qaysi tartibda ishlashiga bog'liq bo'lib qolishi. Klassik misol — hisoblagich.\n\n`count++` bitta amal bo'lib ko'rinadi, lekin aslida uchta:\n\n1. `count`'ni xotiradan o'qish (masalan, 5);\n2. 1 qo'shish (6);\n3. qaytadan yozish (6).\n\nAgar ikki thread bir vaqtda 1-qadamda 5'ni o'qisa, ikkalasi ham 6 yozadi — bitta oshirish **yo'qoldi**. 2 thread × 10 000 marta = 20 000 kutamiz, lekin 13 000 yoki 17 000 kabi tasodifiy son chiqadi.\n\nYechimlar:\n\n- **synchronized** — method yoki blok. Har bir object'da ichki **monitor lock** bor; bir vaqtda faqat bitta thread uni ushlab tura oladi, qolganlari BLOCKED holatda kutadi. Bu **atomarlik** va **ko'rinish** (visibility) ni kafolatlaydi. Kamchiligi — kutish (contention) sekinlashtiradi.\n- **AtomicInteger / AtomicLong** — lock'siz. Ichida CPU'ning **CAS** (compare-and-swap) instruksiyasi: \"agar qiymat hali ham 5 bo'lsa, 6 yoz, aks holda qayta urin\". Oddiy hisoblagich uchun eng yaxshi tanlov. Juda yuqori contention'da — `LongAdder`.\n- **ReentrantLock** — synchronized'ning moslashuvchan varianti: `tryLock()` timeout bilan, adolatli navbat. `unlock()`'ni doim `finally`'da chaqiring.\n\nEng yaxshi yechim esa — umumiy o'zgaruvchan holatdan **qochish**: immutable object'lar, local o'zgaruvchilar, har thread o'z ma'lumoti bilan ishlashi. Spring bean'lari (singleton) uchun bu ayniqsa muhim: service class'da request ma'lumotini field'da saqlash — klassik bug.",
          code: `class Counter {
    private int count = 0;
    void increment() { count++; }                  // thread-safe EMAS
    int get() { return count; }
}

class SyncCounter {
    private int count = 0;
    synchronized void increment() { count++; }     // bir vaqtda bitta thread
    synchronized int get() { return count; }
}

class AtomicCounter {
    private final AtomicInteger count = new AtomicInteger();
    void increment() { count.incrementAndGet(); }  // CAS, lock'siz
    int get() { return count.get(); }
}

// Tekshirish
var counter = new Counter();
try (var pool = Executors.newFixedThreadPool(2)) {
    for (int t = 0; t < 2; t++) {
        pool.submit(() -> { for (int i = 0; i < 10_000; i++) counter.increment(); });
    }
}
System.out.println(counter.get());   // 20000 emas! (masalan 14873)

// Spring'dagi klassik bug: singleton bean'da holat
@Service
class ReportService {
    private String currentUser;      // BARCHA request'lar bitta field'ni bo'lishadi!
}`,
          lang: 'java',
        },
        {
          title: 'volatile, visibility va deadlock',
          body: "**Visibility muammosi**: har bir CPU yadrosining o'z cache'i bor va JIT o'zgaruvchini register'da saqlab qo'yishi mumkin. Natijada bir thread o'zgaruvchini o'zgartirsa, boshqa thread buni **hech qachon ko'rmasligi** mumkin. Java Memory Model buni **happens-before** qoidalari bilan tartibga soladi.\n\n**volatile** — o'zgaruvchiga har yozish to'g'ridan-to'g'ri asosiy xotiraga boradi va har o'qish undan o'qiladi: o'zgarish boshqa thread'larga darhol ko'rinadi. Lekin volatile **atomarlik bermaydi**: `volatile int count; count++` baribir race condition. volatile'ning odatiy ishlatilishi — **flag**'lar: `volatile boolean running`.\n\nQisqa jadval:\n\n- `volatile` — faqat visibility.\n- `Atomic*` — visibility + bitta o'zgaruvchi ustida atomarlik.\n- `synchronized` / `Lock` — visibility + kod blokining atomarligi (bir nechta o'zgaruvchi).\n\n**Deadlock** — ikki (yoki ko'p) thread bir-birini abadiy kutadi: A thread lock1'ni ushlab lock2'ni kutadi, B thread lock2'ni ushlab lock1'ni kutadi. Hech biri bo'shatmaydi. Klassik misol — ikki hisob o'rtasida pul o'tkazish.\n\nOldini olish:\n\n- lock'larni **doim bir xil tartibda** olish (masalan, id bo'yicha kichigidan);\n- `tryLock(timeout)` — kutib, bo'lmasa voz kechish;\n- lock ichida tashqi kod (boshqa service, I/O) chaqirmaslik va lock'larni qisqa tutish.\n\nAniqlash: `jstack <pid>` thread dump oladi va \"Found one Java-level deadlock\" deb ko'rsatadi.",
          code: `class Worker implements Runnable {
    private volatile boolean running = true;     // volatile'siz loop to'xtamasligi mumkin

    public void stop() { running = false; }

    @Override public void run() {
        while (running) {
            doWork();
        }
    }
}

// DEADLOCK xavfi
void transfer(Account from, Account to, long amount) {
    synchronized (from) {
        synchronized (to) {                      // T1: A->B, T2: B->A  => deadlock
            from.withdraw(amount);
            to.deposit(amount);
        }
    }
}

// YECHIM: lock'larni doim bir xil tartibda olish
void safeTransfer(Account from, Account to, long amount) {
    Account first  = from.id() < to.id() ? from : to;
    Account second = from.id() < to.id() ? to : from;
    synchronized (first) {
        synchronized (second) {
            from.withdraw(amount);
            to.deposit(amount);
        }
    }
}`,
          lang: 'java',
        },
        {
          title: 'ConcurrentHashMap va CompletableFuture',
          body: "**ConcurrentHashMap** — thread-safe HashMap. `Collections.synchronizedMap()` butun map'ni bitta lock bilan yopadi (sekin). ConcurrentHashMap (Java 8+) esa bo'sh bucket'ga **CAS** bilan yozadi va faqat **bitta bucket**'ni lock qiladi — turli bucket'larga yozayotgan thread'lar bir-biriga xalaqit bermaydi. O'qish umuman lock'siz.\n\nMuhim tafsilotlar:\n\n- `null` key va value'ga ruxsat yo'q (`get()` null qaytarsa — \"key yo'q\" degani, noaniqlik bo'lmasin).\n- Har bir alohida operatsiya atomar, lekin **ularning kombinatsiyasi emas**: `if (!map.containsKey(k)) map.put(k, v)` — race condition. Buning o'rniga `putIfAbsent`, `computeIfAbsent`, `merge` ishlating.\n- Iterator'lari CME bermaydi (weakly consistent).\n\n**CompletableFuture** — asinxron natija ustida zanjir qurish (JavaScript'dagi Promise'ga o'xshash):\n\n- `supplyAsync(() -> ...)` — boshqa thread'da ishga tushirish (`.then()` kabi).\n- `thenApply` — natijani o'zgartirish (map).\n- `thenCompose` — natijadan keyingi asinxron chaqiruv (flatMap).\n- `thenCombine` — ikki mustaqil natijani birlashtirish.\n- `allOf(...)` — hammasini kutish (`Promise.all` kabi).\n- `exceptionally` / `handle` — xatoni qayta ishlash (`.catch()` kabi).\n- `join()` — natijani kutish.\n\nKo'p uchraydigan xato: executor bermaslik. Default holatda `ForkJoinPool.commonPool()` ishlatiladi — u kichik va CPU ishi uchun mo'ljallangan. Blocking I/O (HTTP, DB) uchun o'z executor'ingizni bering.",
          code: `// ConcurrentHashMap: atomar "o'qi-o'zgartir-yoz"
Map<String, Integer> visits = new ConcurrentHashMap<>();
visits.merge(page, 1, Integer::sum);                      // atomar oshirish

Map<Long, User> cache = new ConcurrentHashMap<>();
User user = cache.computeIfAbsent(id, key -> loadUser(key));   // faqat bir marta yuklaydi

// CompletableFuture: ikki servisni parallel chaqirish
ExecutorService io = Executors.newFixedThreadPool(10);

CompletableFuture<User> userF =
        CompletableFuture.supplyAsync(() -> userClient.get(userId), io);
CompletableFuture<List<Order>> ordersF =
        CompletableFuture.supplyAsync(() -> orderClient.findByUser(userId), io);

CompletableFuture<ProfileDto> profileF = userF
        .thenCombine(ordersF, (user, orders) -> new ProfileDto(user, orders))
        .orTimeout(2, TimeUnit.SECONDS)
        .exceptionally(ex -> {
            log.warn("Profile failed", ex);
            return ProfileDto.empty();
        });

ProfileDto profile = profileF.join();     // ~max(user, orders) vaqt, yig'indi emas`,
          lang: 'java',
        },
        {
          title: "Virtual threads (Java 21) va Node'ning event loop'i bilan solishtirish",
          body: "**Muammo**. Spring MVC (Tomcat) **thread-per-request** modelida ishlaydi: har bir HTTP request uchun pool'dan bitta thread olinadi va javob tayyor bo'lguncha band turadi. Request vaqtining ko'p qismi **kutish**: DB javobi, boshqa API. Bu paytda thread hech narsa qilmaydi, lekin OS thread'i va ~1 MB xotirani ushlab turadi. Tomcat'da default 200 thread — 201-chi bir vaqtdagi sekin request navbatda turadi.\n\n**Node.js qanday hal qiladi** (siz buni bilasiz): bitta thread + **event loop**. I/O non-blocking: so'rov yuboriladi, callback/Promise ro'yxatga olinadi va thread darhol keyingi request'ga o'tadi. Bitta thread minglab ulanishni ko'taradi. Kamchiligi — kod `async/await` bilan yoziladi va **CPU-heavy** ish (katta JSON parse, hisob-kitob) butun server'ni to'xtatib qo'yadi.\n\n**Virtual thread** (Java 21, JEP 444) — JVM boshqaradigan juda yengil thread. Ular kam sonli **carrier** platform thread'lar ustida ishlaydi. Virtual thread blocking I/O'ga duch kelganda (socket'dan o'qish, `Thread.sleep`), JVM uni carrier'dan **yechib oladi** (unmount), stack'ini heap'ga saqlaydi va carrier'ga boshqa virtual thread'ni qo'yadi. Javob kelganda — yana biror carrier'ga qo'yadi.\n\nNatija: oddiy, ketma-ket, **blocking** kod yozasiz (async/await yo'q, callback yo'q), lekin scalability Node'nikiga yaqin — millionlab virtual thread mumkin. Shu bilan birga CPU ishi uchun ko'p yadro ham ishlatiladi.\n\nSpring Boot 3.2+ da yoqish: `spring.threads.virtual.enabled=true` — Tomcat har request'ni virtual thread'da bajaradi.\n\nE'tibor berish kerak bo'lgan joylar:\n\n- Virtual thread'larni **pool qilmang** — ular arzon, har vazifaga yangisi.\n- Ular **CPU-heavy** ishni tezlashtirmaydi — faqat kutish ko'p bo'lgan (I/O-bound) ishda foyda beradi.\n- Cheklangan resursni (DB connection pool, masalan 10 ta) baribir himoya qilish kerak — 10 000 virtual thread birdan DB'ga yopirilmasin (`Semaphore`).\n- Java 21'da `synchronized` blok ichida blocking qilish virtual thread'ni carrier'ga **pin** qiladi (Java 24'da tuzatilgan) — uzoq I/O atrofida `ReentrantLock` afzal.\n\nInterview'da qanday aytish kerak: \"Virtual threads give us the scalability of non-blocking code, like Node's event loop, but we keep the simple blocking style.\"",
          code: `// 10 000 ta vazifa, har biri 1 soniya "kutadi" (I/O simulyatsiyasi)
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 10_000).forEach(i ->
            executor.submit(() -> {
                Thread.sleep(Duration.ofSeconds(1));   // carrier bo'shaydi
                return i;
            }));
}   // ~1 soniyada tugaydi. 200 ta platform thread bilan ~50 soniya ketardi

// Bitta virtual thread
Thread vt = Thread.ofVirtual().name("vt-1").start(() -> System.out.println("hello"));

// Cheklangan resursni himoya qilish
Semaphore dbPermits = new Semaphore(10);
void query() throws InterruptedException {
    dbPermits.acquire();
    try {
        jdbcCall();
    } finally {
        dbPermits.release();
    }
}

// application.properties (Spring Boot 3.2+)
// spring.threads.virtual.enabled=true`,
          lang: 'java',
        },
      ],
      vocab: [
        { en: 'thread pool', uz: "thread'lar hovuzi — qayta ishlatiladigan thread'lar" },
        { en: 'race condition', uz: "poyga holati — natija thread'lar tartibiga bog'liq" },
        { en: 'thread-safe', uz: "bir nechta thread uchun xavfsiz" },
        { en: 'lock / monitor', uz: "qulf — bir vaqtda bitta thread'ga ruxsat" },
        { en: 'visibility', uz: "o'zgarishning boshqa thread'larga ko'rinishi" },
        { en: 'deadlock', uz: "o'zaro bloklanish — thread'lar bir-birini abadiy kutadi" },
        { en: 'contention', uz: "bitta lock uchun raqobat" },
        { en: 'I/O-bound / CPU-bound', uz: "kutishga bog'liq / hisob-kitobga bog'liq ish" },
      ],
      questions: [
        {
          q: 'What is the difference between a process and a thread?',
          a: "A process is a running program with its own memory. A thread is a path of execution inside a process. All threads in one process share the heap, but each thread has its own stack. Threads are cheaper to create, and they can share data easily, but shared data can cause race conditions.",
          uz: "Process — o'z xotirasiga ega ishlab turgan dastur. Thread — process ichidagi bajarilish yo'li. Bitta process'dagi barcha thread'lar heap'ni bo'lishadi, lekin har bir thread'ning o'z stack'i bor. Thread'larni yaratish arzonroq va ular ma'lumotni oson bo'lisha oladi, lekin umumiy ma'lumot race condition'ga sabab bo'lishi mumkin.",
          level: 'junior',
        },
        {
          q: 'What is a race condition? Can you give an example?',
          a: "A race condition happens when the result depends on the order in which threads run. The classic example is count++ on a shared counter. It is three steps: read, add one, and write. If two threads read the same value at the same time, one update is lost. We can fix it with synchronized or with AtomicInteger.",
          uz: "Race condition natija thread'lar qaysi tartibda ishlashiga bog'liq bo'lganda yuz beradi. Klassik misol — umumiy hisoblagichda count++. Bu uchta qadam: o'qish, bir qo'shish va yozish. Agar ikki thread bir vaqtda bir xil qiymatni o'qisa, bitta yangilanish yo'qoladi. Buni synchronized yoki AtomicInteger bilan tuzatishimiz mumkin.",
          example: `private final AtomicInteger count = new AtomicInteger();
void increment() { count.incrementAndGet(); }`,
          level: 'junior',
        },
        {
          q: 'What is the difference between synchronized and volatile?',
          a: "volatile only gives visibility. When one thread writes a volatile variable, other threads see the new value right away. But it does not make operations like count++ atomic. synchronized gives both visibility and atomicity, because only one thread can run the block at a time. I use volatile for simple flags, and synchronized or atomics when I need to change a value safely.",
          uz: "volatile faqat visibility beradi. Bir thread volatile o'zgaruvchiga yozganda, boshqa thread'lar yangi qiymatni darhol ko'radi. Lekin u count++ kabi operatsiyalarni atomar qilmaydi. synchronized ham visibility, ham atomarlik beradi, chunki blokni bir vaqtda faqat bitta thread bajara oladi. Oddiy flag'lar uchun volatile, qiymatni xavfsiz o'zgartirish kerak bo'lganda esa synchronized yoki atomic'lar ishlataman.",
          level: 'middle',
        },
        {
          q: 'Why should you use ExecutorService instead of creating threads manually?',
          a: "Creating a platform thread is expensive, and too many threads can use all the memory. ExecutorService keeps a pool of threads and reuses them for many tasks. It also gives us Futures to get results and handle errors, and a clean way to shut down. In Spring, I usually use the executors that Spring manages.",
          uz: "Platform thread yaratish qimmat va juda ko'p thread butun xotirani ishlatib yuborishi mumkin. ExecutorService thread'lar pool'ini saqlaydi va ularni ko'p vazifalar uchun qayta ishlatadi. U natijalarni olish va xatolarni qayta ishlash uchun Future'lar hamda to'g'ri to'xtatish usulini ham beradi. Spring'da odatda Spring boshqaradigan executor'larni ishlataman.",
          followUp: 'What is the difference between Runnable and Callable?',
          level: 'junior',
        },
        {
          q: 'What is a deadlock and how can you prevent it?',
          a: "A deadlock is when two threads wait for each other forever. For example, thread A holds lock 1 and waits for lock 2, and thread B holds lock 2 and waits for lock 1. To prevent it, I always take locks in the same order, for example by id. I can also use tryLock with a timeout, and keep locked sections small. To find a deadlock, I take a thread dump with jstack.",
          uz: "Deadlock — ikki thread bir-birini abadiy kutib qolishi. Masalan, A thread 1-lock'ni ushlab 2-lock'ni kutadi, B thread esa 2-lock'ni ushlab 1-lock'ni kutadi. Buning oldini olish uchun lock'larni doim bir xil tartibda, masalan id bo'yicha olaman. Yana timeout bilan tryLock ishlatishim va lock qilingan qismlarni kichik tutishim mumkin. Deadlock'ni topish uchun jstack bilan thread dump olaman.",
          level: 'middle',
        },
        {
          q: 'How is ConcurrentHashMap different from HashMap and synchronizedMap?',
          a: "HashMap is not thread-safe. synchronizedMap is thread-safe, but it uses one lock for the whole map, so it is slow under load. ConcurrentHashMap locks only one bucket when it writes, and reads have no lock, so many threads can work at the same time. It does not allow null keys or values. For check-then-act logic, I use atomic methods like merge or computeIfAbsent.",
          uz: "HashMap thread-safe emas. synchronizedMap thread-safe, lekin butun map uchun bitta lock ishlatadi, shuning uchun yuklama ostida sekin. ConcurrentHashMap yozayotganda faqat bitta bucket'ni lock qiladi, o'qishda esa lock yo'q, shuning uchun ko'p thread bir vaqtda ishlay oladi. U null key yoki value'ga ruxsat bermaydi. Tekshir-keyin-bajar logikasi uchun merge yoki computeIfAbsent kabi atomar method'larni ishlataman.",
          example: `map.merge(word, 1, Integer::sum);`,
          level: 'middle',
        },
        {
          q: 'What is CompletableFuture and when do you use it?',
          a: "CompletableFuture is a result that will be ready in the future, and we can build a chain of steps on it. It is similar to a Promise in JavaScript. I use it when I need to call several services in parallel and combine the results, for example with thenCombine or allOf. For blocking calls, I pass my own executor, not the common pool.",
          uz: "CompletableFuture — kelajakda tayyor bo'ladigan natija va uning ustida qadamlar zanjirini qurishimiz mumkin. U JavaScript'dagi Promise'ga o'xshaydi. Bir nechta servisni parallel chaqirib, natijalarni birlashtirish kerak bo'lganda ishlataman, masalan thenCombine yoki allOf bilan. Blocking chaqiruvlar uchun common pool emas, o'z executor'imni beraman.",
          level: 'middle',
        },
        {
          q: 'What are virtual threads in Java 21 and why do they matter?',
          a: "Virtual threads are very light threads managed by the JVM, not by the OS. When a virtual thread waits for I/O, the JVM unmounts it, and the real carrier thread can run other work. So we can have millions of them. This matters for Spring MVC, because it uses one thread per request. With virtual threads, we keep simple blocking code, but the server can handle many more requests at the same time.",
          uz: "Virtual thread'lar — OS emas, JVM boshqaradigan juda yengil thread'lar. Virtual thread I/O kutganda JVM uni yechib oladi va haqiqiy carrier thread boshqa ishni bajara oladi. Shuning uchun ulardan millionlab bo'lishi mumkin. Bu Spring MVC uchun muhim, chunki u har request'ga bitta thread ishlatadi. Virtual thread'lar bilan oddiy blocking kodni saqlab qolamiz, lekin server bir vaqtda ancha ko'p request'ni ko'tara oladi.",
          followUp: 'Do virtual threads make CPU-heavy code faster?',
          level: 'middle',
        },
        {
          q: 'How does the Java thread-per-request model compare with the Node.js event loop?',
          a: "Node.js uses one thread with an event loop and non-blocking I/O, so we write async code with callbacks or async/await. One slow CPU task can block all requests. Classic Java servers use one thread per request with blocking code, which is simple, but each platform thread is expensive. With virtual threads in Java 21, we get similar scalability to Node, keep the simple blocking style, and still use all CPU cores.",
          uz: "Node.js event loop'li bitta thread va non-blocking I/O ishlatadi, shuning uchun async kodni callback'lar yoki async/await bilan yozamiz. Bitta sekin CPU vazifasi barcha request'larni bloklashi mumkin. Klassik Java server'lari har request'ga bitta thread va blocking kod ishlatadi — bu oddiy, lekin har bir platform thread qimmat. Java 21'dagi virtual thread'lar bilan Node'ga o'xshash scalability olamiz, oddiy blocking uslubni saqlaymiz va baribir barcha CPU yadrolaridan foydalanamiz.",
          level: 'middle',
        },
      ],
      resources: [
        { title: 'Oracle Java Tutorials — Concurrency', url: 'https://docs.oracle.com/javase/tutorial/essential/concurrency/index.html' },
        { title: 'Oracle — Virtual Threads (Java 21)', url: 'https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html' },
        { title: 'Baeldung — Guide to CompletableFuture', url: 'https://www.baeldung.com/java-completablefuture' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'java-testing',
      title: 'Testing: JUnit 5, AssertJ, Mockito',
      days: [18, 20],
      summary: "Test — kod kutilgandek ishlashini avtomatik tekshiradigan kod. Test pyramid bo'yicha eng ko'p tez unit test'lar, kamroq integration test'lar va juda oz end-to-end test'lar yoziladi. Java'da standart vosita — JUnit 5: `@Test`, `@BeforeEach`, `@ParameterizedTest`, `assertThrows`. AssertJ o'qishli, zanjirli assertion'lar beradi: `assertThat(list).hasSize(2).contains(\"a\")`. Mockito bog'liqliklarni (repository, tashqi API) soxta object — mock bilan almashtirib, class'ni izolyatsiyada test qilish imkonini beradi. Har bir test Arrange–Act–Assert tuzilishida va nima tekshirayotganini aytadigan nom bilan yoziladi. Maven'da test'lar `src/test/java`'da turadi va `mvn test` buyrug'i bilan Surefire plugin orqali ishga tushadi.",
      keyPoints: [
        "Test pyramid: ko'p unit (tez, izolyatsiyada), kamroq integration (DB, HTTP bilan), oz E2E",
        "Arrange–Act–Assert: tayyorlash → bitta amal → tekshirish",
        "Test nomi xatti-harakatni aytsin: shouldThrowWhenBalanceIsTooLow",
        "JUnit 5: @Test, @BeforeEach, @DisplayName, @ParameterizedTest + @CsvSource",
        "assertThrows / assertThatThrownBy — exception'ni tekshirish",
        "Mockito: @Mock + @InjectMocks, when(...).thenReturn(...), verify(...)",
        "Mock faqat tashqi bog'liqliklar uchun; value object'lar va test qilinayotgan class'ni mock qilmang",
        "mvn test → Surefire (*Test.java); mvn verify → Failsafe (*IT.java integration test'lar)",
      ],
      lesson: [
        {
          title: 'Test pyramid: nimani qanday test qilamiz',
          body: "**Test pyramid** — test turlarining sog'lom nisbati:\n\n- **Unit test** (pastki, eng keng qavat) — bitta class yoki method'ni **izolyatsiyada** tekshiradi. DB yo'q, tarmoq yo'q, Spring context yo'q. Millisekundlarda ishlaydi, shuning uchun ularni yuzlab yozib, har o'zgarishda ishga tushirish mumkin. Biznes logika, hisob-kitob, validation, edge case'lar shu yerda.\n- **Integration test** (o'rta) — bir nechta qism birgalikda: haqiqiy DB bilan repository (Testcontainers), HTTP qatlami bilan controller, Spring context. Sekinroq, lekin \"qismlar bir-biriga to'g'ri ulanganmi\" savoliga javob beradi: SQL so'rov to'g'rimi, JSON mapping to'g'rimi, transaction ishlayaptimi.\n- **E2E test** (tepa, eng tor) — butun tizim foydalanuvchi ko'zi bilan. Eng sekin va eng mo'rt, shuning uchun faqat eng muhim oqimlar (login, to'lov).\n\nNimani unit test qilish kerak: shartlar va tarmoqlanishlar bor joy, chegaraviy qiymatlar (0, manfiy, bo'sh list, null), xato holatlari. Nimani unit test qilish **shart emas**: oddiy getter/setter, framework'ning o'zi (Spring yoki Hibernate'ni test qilmaymiz), faqat boshqa method'ni chaqiradigan \"bo'sh\" kod.\n\nYaxshi test xususiyatlari (**FIRST**): Fast, Independent (boshqa testga bog'liq emas, tartib muhim emas), Repeatable (har safar bir xil natija — `LocalDate.now()` yoki random'ga bog'liq emas), Self-validating (o'zi pass/fail aytadi), Timely (kod bilan birga yoziladi).\n\nInterview'da qanday aytish kerak: \"I write many fast unit tests for business logic, and fewer integration tests for the database and the API layer.\"",
          code: `// Loyiha tuzilishi (Maven)
// src/main/java/com/shop/order/OrderService.java
// src/test/java/com/shop/order/OrderServiceTest.java      <- unit test (Surefire)
// src/test/java/com/shop/order/OrderRepositoryIT.java     <- integration test (Failsafe)

// Test qilinadigan class — bog'liqliklar constructor orqali (test'da almashtirish oson)
public class PriceCalculator {
    public long finalPrice(long price, int discountPercent) {
        if (discountPercent < 0 || discountPercent > 100) {
            throw new IllegalArgumentException("discount must be 0..100");
        }
        return price - price * discountPercent / 100;
    }
}`,
          lang: 'java',
        },
        {
          title: 'JUnit 5 asoslari: AAA va nomlash',
          body: "JUnit 5 (Jupiter) — Java'dagi standart test framework. Spring Boot'ning `spring-boot-starter-test` dependency'si uni (va AssertJ, Mockito'ni) avtomatik qo'shadi.\n\nAsosiy annotatsiyalar:\n\n- `@Test` — method test ekanini bildiradi. Test class va method'lar `public` bo'lishi shart emas.\n- `@BeforeEach` / `@AfterEach` — **har bir** testdan oldin/keyin. Har test yangi, toza object bilan boshlansin.\n- `@BeforeAll` / `@AfterAll` — butun class uchun bir marta (`static` method).\n- `@DisplayName(\"...\")` — hisobotda chiroyli nom.\n- `@Disabled` — vaqtincha o'chirish (sababini yozing).\n- `@Nested` — bog'liq testlarni guruhlash.\n\n**Arrange–Act–Assert** (Given–When–Then):\n\n1. **Arrange** — kerakli object'lar va ma'lumotlarni tayyorlash.\n2. **Act** — test qilinayotgan **bitta** amalni bajarish.\n3. **Assert** — natijani tekshirish.\n\nBlok'larni bo'sh qator bilan ajrating — test o'qishli bo'ladi.\n\n**Nomlash**: test nomi nima tekshirilayotganini va qaysi sharoitda ekanini aytsin. Test yiqilganda, nomning o'zi muammoni tushuntirishi kerak. Mashhur shakllar: `shouldDoXWhenY`, `methodName_condition_expectedResult`. `test1()`, `testOrder()` — yomon.\n\nKo'p uchraydigan xato: bitta testda ko'p narsani tekshirish (bir nechta Act). Test yiqilsa, qaysi qism buzilganini bilmaysiz. Bitta test — bitta xatti-harakat.",
          code: `import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class PriceCalculatorTest {

    private PriceCalculator calculator;

    @BeforeEach
    void setUp() {
        calculator = new PriceCalculator();      // har test uchun yangi object
    }

    @Test
    @DisplayName("applies 10% discount")
    void shouldApplyDiscount() {
        // Arrange
        long price = 1_000;

        // Act
        long result = calculator.finalPrice(price, 10);

        // Assert
        assertEquals(900, result);
    }

    @Test
    void shouldThrowWhenDiscountIsNegative() {
        var ex = assertThrows(IllegalArgumentException.class,
                () -> calculator.finalPrice(1_000, -5));

        assertEquals("discount must be 0..100", ex.getMessage());
    }
}`,
          lang: 'java',
        },
        {
          title: "Parameterized test'lar va AssertJ",
          body: "**@ParameterizedTest** — bitta test mantiqini ko'p kirish ma'lumotlari bilan ishlatish. Copy-paste qilingan 5 ta test o'rniga — bitta test va ma'lumotlar jadvali. Ma'lumot manbalari:\n\n- `@ValueSource(ints = {1, 2, 3})` — bitta parametr;\n- `@CsvSource({\"100, 10, 90\", \"100, 0, 100\"})` — bir nechta parametr, jadval kabi;\n- `@NullAndEmptySource` — null va bo'sh qiymat;\n- `@EnumSource`, `@MethodSource` — enum yoki o'z method'ingizdan.\n\nChegaraviy qiymatlar (0, 100, -1, 101) aynan parameterized test uchun ideal.\n\n**AssertJ** — JUnit'ning `assertEquals`'idan ko'ra o'qishli va kuchli assertion kutubxonasi. `assertThat(actual)` dan boshlanadi va zanjir bilan davom etadi — gap kabi o'qiladi. IDE avtocomplete'i tur bo'yicha mos method'larni taklif qiladi. Yiqilganda xabar ancha tushunarli.\n\nJUnit'ning `assertEquals(expected, actual)`'ida argumentlar tartibini adashtirish oson — AssertJ'da bu muammo yo'q.\n\nBir nechta tekshiruvni bittada ko'rish uchun: JUnit'da `assertAll(...)`, AssertJ'da `SoftAssertions`.",
          code: `import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import static org.assertj.core.api.Assertions.*;

class PriceCalculatorParamTest {

    private final PriceCalculator calculator = new PriceCalculator();

    @ParameterizedTest(name = "{0} with {1}% -> {2}")
    @CsvSource({
            "1000, 10, 900",
            "1000, 0, 1000",
            "1000, 100, 0",
            "999, 50, 500"
    })
    void shouldCalculateFinalPrice(long price, int discount, long expected) {
        assertThat(calculator.finalPrice(price, discount)).isEqualTo(expected);
    }

    @ParameterizedTest
    @ValueSource(ints = {-1, 101, 500})
    void shouldRejectInvalidDiscount(int discount) {
        assertThatThrownBy(() -> calculator.finalPrice(1000, discount))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("0..100");
    }
}

// AssertJ: collection va object'lar
List<User> users = service.findActive();
assertThat(users)
        .hasSize(2)
        .extracting(User::name)
        .containsExactlyInAnyOrder("Ali", "Vali");

assertThat(order.total()).isPositive().isLessThan(10_000L);
assertThat(result).isPresent().get().extracting(User::email).isEqualTo("ali@mail.com");`,
          lang: 'java',
        },
        {
          title: "Mockito: bog'liqliklarni soxtalashtirish",
          body: "Service class odatda boshqa narsalarga bog'liq: repository (DB), email sender, tashqi API client. Unit testda ularning haqiqiysini ishlatsak — test sekin, mo'rt va DB'siz ishlamaydi. **Mock** — interface'ning soxta implementatsiyasi: biz unga \"shu chaqirilsa, shuni qaytar\" deymiz va keyin \"shu method chaqirildimi?\" deb tekshiramiz.\n\nAsosiy API:\n\n- `@ExtendWith(MockitoExtension.class)` — Mockito'ni JUnit 5'ga ulash.\n- `@Mock` — mock yaratish. Default holatda barcha method'lar `null`, `0`, `false` yoki bo'sh collection qaytaradi.\n- `@InjectMocks` — test qilinayotgan class'ni yaratib, mock'larni uning constructor'iga beradi.\n- **Stubbing**: `when(repo.findById(1L)).thenReturn(Optional.of(user))`; xato uchun `thenThrow(...)`.\n- **Verification**: `verify(mailer).send(\"ali@mail.com\")`, `verify(mailer, never()).send(any())`, `times(2)`.\n- **Argument matcher'lar**: `any()`, `eq()`, `anyLong()`. Qoida: bitta matcher ishlatsangiz — hamma argument matcher bo'lishi kerak.\n- **ArgumentCaptor** — method'ga qanday object uzatilganini ushlab olib, ichini tekshirish.\n\nNimani mock qilish kerak, nimani yo'q:\n\n- Mock qiling: tashqi bog'liqliklar — repository, HTTP client, email, `Clock`.\n- Mock qilmang: test qilinayotgan class'ning o'zini, record/DTO/value object'larni (ularni oddiy `new` bilan yarating), `List`, `String` kabi standart class'larni.\n\nKo'p uchraydigan xato: hamma narsani `verify` qilish. Bunday test implementatsiyaga qattiq bog'lanib qoladi va har refactoring'da sinadi. Asosan **natijani** tekshiring; `verify`'ni faqat side effect muhim bo'lganda ishlating (email yuborildimi, save chaqirildimi).\n\nMana nima uchun constructor injection muhim (OOP mavzusidagi SOLID): bog'liqlik interface orqali constructor'dan kelsa, uni test'da mock bilan almashtirish oson.",
          code: `@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock OrderRepository orderRepository;
    @Mock PaymentGateway paymentGateway;
    @Mock Notifier notifier;

    @InjectMocks OrderService orderService;     // mock'lar constructor orqali beriladi

    @Test
    void shouldPayAndNotifyWhenOrderExists() {
        // Arrange
        var order = new Order(7L, "ali@mail.com", 500);
        when(orderRepository.findById(7L)).thenReturn(Optional.of(order));
        when(paymentGateway.charge("ali@mail.com", 500)).thenReturn(PaymentResult.ok());

        // Act
        orderService.pay(7L);

        // Assert
        verify(notifier).send(eq("ali@mail.com"), contains("paid"));
        ArgumentCaptor<Order> captor = ArgumentCaptor.forClass(Order.class);
        verify(orderRepository).save(captor.capture());
        assertThat(captor.getValue().status()).isEqualTo(OrderStatus.PAID);
    }

    @Test
    void shouldThrowWhenOrderNotFound() {
        when(orderRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.pay(99L))
                .isInstanceOf(OrderNotFoundException.class);

        verifyNoInteractions(paymentGateway, notifier);   // pul yechilmadi, xabar ketmadi
    }
}`,
          lang: 'java',
        },
        {
          title: "Maven, Surefire va test'larni ishga tushirish",
          body: "Maven loyihasida test'lar uchun standart joy — `src/test/java` (paket tuzilishi `src/main/java` bilan bir xil). Test resurslari — `src/test/resources`.\n\nAsosiy buyruqlar:\n\n- `mvn test` — kodni compile qiladi va **Surefire** plugin orqali unit test'larni ishga tushiradi. Surefire default holatda `*Test.java`, `Test*.java`, `*Tests.java`, `*TestCase.java` fayllarni oladi.\n- `mvn test -Dtest=OrderServiceTest` — bitta class; `-Dtest=OrderServiceTest#shouldPay*` — bitta method.\n- `mvn verify` — unit test'lar + **Failsafe** plugin orqali integration test'lar (`*IT.java`). Failsafe test yiqilsa ham `post-integration-test` bosqichini (masalan, container'ni to'xtatish) bajaradi.\n- `mvn package` — test'lar o'tmasa, JAR yaratilmaydi. `-DskipTests` bilan o'tkazib yuborish mumkin, lekin CI'da hech qachon qilmang.\n\nHisobotlar `target/surefire-reports/` papkasida. CI (GitHub Actions, GitLab CI) aynan `mvn verify` ni ishga tushiradi va test yiqilsa pipeline to'xtaydi.\n\nDependency'lar `test` scope bilan qo'shiladi — ular production JAR'ga tushmaydi. Spring Boot'da bitta `spring-boot-starter-test` yetarli: JUnit 5, AssertJ, Mockito, Spring Test hammasi ichida.\n\nCoverage uchun **JaCoCo** plugin ishlatiladi. Lekin 100% coverage maqsad emas — muhim biznes logika va xato holatlari qamralganligi muhimroq.",
          code: `<!-- pom.xml: Spring Boot loyihasida -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>   <!-- JUnit 5 + AssertJ + Mockito -->
</dependency>

<!-- Spring Boot'siz oddiy loyihada -->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.11.3</version>
    <scope>test</scope>
</dependency>

<!--
$ mvn test                                  # unit testlar (Surefire)
$ mvn test -Dtest=OrderServiceTest          # bitta class
$ mvn verify                                # + integration testlar (Failsafe, *IT.java)
$ ./mvnw test                               # Maven Wrapper — loyihadagi aniq versiya
-->`,
          lang: 'xml',
        },
      ],
      vocab: [
        { en: 'unit test', uz: "bitta qismni izolyatsiyada tekshiradigan test" },
        { en: 'integration test', uz: "qismlarning birgalikda ishlashini tekshiradigan test" },
        { en: 'assertion', uz: "tasdiqlash — kutilgan natijani tekshirish" },
        { en: 'mock', uz: "soxta object (xatti-harakati oldindan belgilangan)" },
        { en: 'stub', uz: "javobi oldindan berilgan soxta chaqiruv" },
        { en: 'edge case', uz: 'chegaraviy holat' },
        { en: 'flaky test', uz: "goh o'tadigan, goh yiqiladigan beqaror test" },
        { en: 'coverage', uz: "test bilan qamrab olinganlik darajasi" },
      ],
      questions: [
        {
          q: 'What is the test pyramid?',
          a: "The test pyramid shows a healthy balance of tests. At the bottom, we have many unit tests, which are fast and test one class in isolation. In the middle, we have fewer integration tests, which check that parts work together, for example with a real database. At the top, we have only a few end-to-end tests, because they are slow and fragile.",
          uz: "Test pyramid testlarning sog'lom nisbatini ko'rsatadi. Pastda ko'p unit test'lar bor, ular tez va bitta class'ni izolyatsiyada tekshiradi. O'rtada kamroq integration test'lar bor, ular qismlar birgalikda ishlashini tekshiradi, masalan haqiqiy database bilan. Tepada esa faqat bir nechta end-to-end test bor, chunki ular sekin va mo'rt.",
          level: 'junior',
        },
        {
          q: 'What is the difference between a unit test and an integration test?',
          a: "A unit test checks one class or method in isolation. All dependencies, like the repository, are mocked, so it runs in milliseconds. An integration test checks that several parts work together, for example the repository with a real database, or the controller with the HTTP layer. Integration tests are slower, but they catch problems like a wrong SQL query or wrong JSON mapping.",
          uz: "Unit test bitta class yoki method'ni izolyatsiyada tekshiradi. Repository kabi barcha bog'liqliklar mock qilinadi, shuning uchun u millisekundlarda ishlaydi. Integration test bir nechta qism birgalikda ishlashini tekshiradi, masalan haqiqiy database bilan repository yoki HTTP qatlami bilan controller. Integration test'lar sekinroq, lekin noto'g'ri SQL so'rov yoki noto'g'ri JSON mapping kabi muammolarni ushlaydi.",
          followUp: 'Have you used Testcontainers?',
          level: 'junior',
        },
        {
          q: 'What is the Arrange-Act-Assert pattern?',
          a: "It is a simple structure for a test. In Arrange, we prepare the objects and the data. In Act, we call the one method that we test. In Assert, we check the result. I separate the three parts with empty lines, so the test is easy to read. Each test should check only one behavior.",
          uz: "Bu test uchun oddiy tuzilma. Arrange'da object'lar va ma'lumotlarni tayyorlaymiz. Act'da test qilayotgan bitta method'ni chaqiramiz. Assert'da natijani tekshiramiz. Uch qismni bo'sh qatorlar bilan ajrataman, shunda testni o'qish oson bo'ladi. Har bir test faqat bitta xatti-harakatni tekshirishi kerak.",
          level: 'junior',
        },
        {
          q: 'How do you test that a method throws an exception in JUnit 5?',
          a: "I use assertThrows. I pass the expected exception class and a lambda that calls the method. assertThrows returns the exception, so I can also check its message. With AssertJ, I use assertThatThrownBy, which reads more naturally.",
          uz: "assertThrows ishlataman. Unga kutilgan exception class'ini va method'ni chaqiradigan lambda'ni beraman. assertThrows exception'ni qaytaradi, shuning uchun uning message'ini ham tekshira olaman. AssertJ bilan assertThatThrownBy ishlataman, u tabiiyroq o'qiladi.",
          example: `var ex = assertThrows(IllegalArgumentException.class,
        () -> calculator.finalPrice(100, -1));
assertEquals("discount must be 0..100", ex.getMessage());`,
          level: 'junior',
        },
        {
          q: 'What is Mockito and how do you use it?',
          a: "Mockito is a library to create mock objects. A mock is a fake version of a dependency, like a repository or an API client. With when and thenReturn, I tell the mock what to return. With verify, I check that a method was called. In JUnit 5, I use @Mock for dependencies and @InjectMocks for the class under test.",
          uz: "Mockito — mock object'lar yaratish uchun kutubxona. Mock — bog'liqlikning soxta versiyasi, masalan repository yoki API client. when va thenReturn bilan mock'ga nima qaytarishni aytaman. verify bilan method chaqirilganini tekshiraman. JUnit 5'da bog'liqliklar uchun @Mock, test qilinayotgan class uchun @InjectMocks ishlataman.",
          example: `when(repo.findById(1L)).thenReturn(Optional.of(user));
service.deactivate(1L);
verify(repo).save(any(User.class));`,
          followUp: 'What is the difference between a mock and a stub?',
          level: 'junior',
        },
        {
          q: 'What should you mock and what should you not mock?',
          a: "I mock external dependencies, like repositories, HTTP clients, email services, or the clock. I do not mock the class under test, and I do not mock simple value objects, records, or DTOs. I just create them with new. Also, I try not to verify every call, because then the test breaks on every refactoring. I mostly check the result.",
          uz: "Repository, HTTP client, email servislari yoki soat kabi tashqi bog'liqliklarni mock qilaman. Test qilinayotgan class'ni mock qilmayman va oddiy value object, record yoki DTO'larni ham mock qilmayman. Ularni shunchaki new bilan yarataman. Yana har bir chaqiruvni verify qilmaslikka harakat qilaman, chunki unda test har refactoring'da sinadi. Asosan natijani tekshiraman.",
          level: 'middle',
        },
        {
          q: 'What is a parameterized test and when do you use it?',
          a: "A parameterized test runs the same test logic with different input data. In JUnit 5, I use @ParameterizedTest with a source like @ValueSource or @CsvSource. It is very useful for edge cases, for example zero, negative numbers, and maximum values. It removes copy-paste tests and makes the cases easy to read as a table.",
          uz: "Parameterized test bir xil test logikasini har xil kirish ma'lumotlari bilan ishga tushiradi. JUnit 5'da @ParameterizedTest'ni @ValueSource yoki @CsvSource kabi manba bilan ishlataman. Bu chegaraviy holatlar uchun juda foydali, masalan nol, manfiy sonlar va maksimal qiymatlar. U copy-paste qilingan testlarni yo'q qiladi va holatlarni jadval kabi o'qishni osonlashtiradi.",
          example: `@ParameterizedTest
@CsvSource({"1000, 10, 900", "1000, 0, 1000"})
void calculates(long price, int discount, long expected) {
    assertThat(calc.finalPrice(price, discount)).isEqualTo(expected);
}`,
          level: 'junior',
        },
        {
          q: 'How do you name your tests?',
          a: "A test name should say what behavior we test and in which situation. For example, shouldThrowWhenBalanceIsTooLow or withdraw_insufficientFunds_throwsException. When a test fails, the name alone should explain the problem. I never use names like test1 or testOrder.",
          uz: "Test nomi qaysi xatti-harakatni va qaysi vaziyatda tekshirayotganimizni aytishi kerak. Masalan, shouldThrowWhenBalanceIsTooLow yoki withdraw_insufficientFunds_throwsException. Test yiqilganda nomning o'zi muammoni tushuntirishi kerak. Men hech qachon test1 yoki testOrder kabi nomlarni ishlatmayman.",
          level: 'junior',
        },
        {
          q: 'How do you run tests with Maven?',
          a: "I run mvn test. Maven compiles the code and the Surefire plugin runs the unit tests, usually classes that end with Test. For integration tests, I use mvn verify, and the Failsafe plugin runs classes that end with IT. If a test fails, the build fails, so in CI the pipeline stops and we cannot deploy broken code.",
          uz: "mvn test ishga tushiraman. Maven kodni compile qiladi va Surefire plugin unit test'larni, odatda Test bilan tugaydigan class'larni ishga tushiradi. Integration test'lar uchun mvn verify ishlataman va Failsafe plugin IT bilan tugaydigan class'larni ishga tushiradi. Agar test yiqilsa, build ham yiqiladi, shuning uchun CI'da pipeline to'xtaydi va buzilgan kodni deploy qila olmaymiz.",
          level: 'junior',
        },
      ],
      resources: [
        { title: 'JUnit 5 User Guide', url: 'https://junit.org/junit5/docs/current/user-guide/' },
        { title: 'Mockito — official site', url: 'https://site.mockito.org/' },
        { title: 'Baeldung — A Guide to JUnit 5', url: 'https://www.baeldung.com/junit-5' },
        { title: 'Baeldung — Mockito Series', url: 'https://www.baeldung.com/mockito-series' },
      ],
    },
  ],
}

// Spring va Spring Boot — Java backend'ning asosiy framework'i.
// Running example: task-manager API (User, Board, Task; /api/boards/{boardId}/tasks) + Vue frontend + PostgreSQL.
export default {
  id: 'spring',
  title: 'Spring va Spring Boot',
  icon: '🌱',
  intro: "Spring Boot — Java'da backend yozish uchun eng ko'p ishlatiladigan framework. Bu bo'limda Spring ichida nima bo'lishini o'rganamiz: IoC container va bean'lar, REST controller'lar, validation, JPA, transaction'lar, Security + JWT va testlar. Hamma misollar bitta loyiha atrofida: Vue frontend va PostgreSQL bilan ishlaydigan task-manager API.",
  topics: [
    // ─────────────────────────────────────────────
    {
      id: 'spring-core-di',
      title: 'Spring Core: IoC container, Dependency Injection, bean\'lar',
      days: [36, 42],
      summary: "Spring'ning yuragi — IoC (Inversion of Control) container, ya'ni ApplicationContext. Biz obyektlarni o'zimiz `new` bilan yaratmaymiz: Spring ularni yaratadi, bir-biriga ulaydi va hayot siklini boshqaradi. Spring boshqaradigan obyekt bean deyiladi. Dependency Injection (DI) — class o'ziga kerakli dependency'larni o'zi yaratmasdan, tashqaridan (constructor orqali) olishi. Bu kodni loose coupled qiladi: implementatsiyani almashtirish va testda mock berish oson bo'ladi. Intervyuda deyarli har doim constructor injection, bean scope'lar va @Component bilan @Bean farqi so'raladi.",
      keyPoints: [
        "IoC — obyektlarni yaratish va ulash nazorati bizdan Spring'ga o'tadi",
        "ApplicationContext — bean'larni yaratadigan va saqlaydigan container",
        "DI turlari: constructor (tavsiya), setter, field (@Autowired maydonda — tavsiya qilinmaydi)",
        "@Component, @Service, @Repository, @Controller — component scan topadigan stereotype annotation'lar",
        "@Configuration + @Bean — o'zimiz yozmagan class'lar (kutubxona obyektlari) uchun bean yaratish",
        "Default scope — singleton: bitta obyekt butun ilova uchun, shuning uchun state saqlamasligi kerak",
        "Bir interface'ning bir nechta implementatsiyasi bo'lsa — @Primary yoki @Qualifier",
        "Circular dependency — dizayn muammosi belgisi; Spring Boot 2.6+ default holatda xato beradi",
      ],
      lesson: [
        {
          title: "Nega Spring kerak? Muammo va IoC g'oyasi",
          body: "Oddiy Java'da har bir class o'ziga kerakli obyektni o'zi yaratadi: `TaskService` ichida `new TaskRepository()`, uning ichida `new DataSource(...)` va hokazo. Natijada class'lar bir-biriga qattiq bog'lanadi (tight coupling): implementatsiyani almashtirish qiyin, testda haqiqiy database o'rniga mock berib bo'lmaydi, konfiguratsiya (URL, parol) kodga tarqalib ketadi.\n\nIoC (Inversion of Control) bu nazoratni teskari qiladi. Class endi 'menga TaskRepository kerak' deb e'lon qiladi xolos, uni kim va qanday yaratishini bilmaydi. Obyektlarni yaratish, ulash va yo'q qilish ishini container — Spring'ning `ApplicationContext`'i bajaradi.\n\nDependency Injection — IoC'ni amalga oshirish usuli: dependency class'ga tashqaridan beriladi (inject qilinadi), odatda constructor orqali.\n\n- Loose coupling: class interface'ga bog'lanadi, aniq implementatsiyaga emas\n- Test qilish oson: unit test'da constructor'ga mock berasiz\n- Konfiguratsiya bir joyda: ulanishlarni Spring boshqaradi\n- Spring bean ustiga qo'shimcha imkoniyat qo'sha oladi: @Transactional, @Cacheable, security — bularning hammasi proxy orqali ishlaydi",
          code: `// Spring'siz: class o'z dependency'sini o'zi yaratadi (tight coupling)
public class TaskService {
    private final TaskRepository repo = new JdbcTaskRepository("jdbc:postgresql://...", "user", "pass");
}

// Spring bilan: dependency tashqaridan keladi (DI)
@Service
public class TaskService {
    private final TaskRepository repo;

    public TaskService(TaskRepository repo) { // Spring o'zi topib beradi
        this.repo = repo;
    }
}`,
          lang: 'java',
        },
        {
          title: "ApplicationContext, bean'lar va component scan",
          body: "Ilova ishga tushganda Spring quyidagilarni qiladi:\n\n1. `@SpringBootApplication` turgan package'dan boshlab barcha sub-package'larni skanerlaydi (component scan).\n2. `@Component` (yoki uning 'farzandlari') bilan belgilangan class'larni topadi va ular uchun bean definition yaratadi.\n3. Dependency grafini tuzadi: kim kimga kerak.\n4. Bean'larni to'g'ri tartibda yaratadi va constructor orqali ulaydi.\n5. Kerak bo'lsa bean'ni proxy bilan o'raydi (masalan, @Transactional bo'lsa).\n\nStereotype annotation'lar texnik jihatdan deyarli bir xil (hammasi @Component), lekin vazifani ko'rsatadi:\n\n- `@Service` — biznes logika\n- `@Repository` — database bilan ishlash; qo'shimcha ravishda SQL exception'larni Spring'ning `DataAccessException`'iga o'giradi\n- `@Controller` / `@RestController` — HTTP request'larni qabul qiladi\n- `@Component` — boshqa umumiy bean'lar (masalan, JwtService)\n\nKo'p uchraydigan xato: class `@SpringBootApplication` turgan package'dan tashqarida joylashgan, shuning uchun component scan uni topmaydi va 'No qualifying bean of type ...' xatosi chiqadi.",
          code: `package uz.dev.taskmanager;          // root package

@SpringBootApplication                // shu package va pastidagilar skanerlanadi
public class TaskManagerApplication {
    public static void main(String[] args) {
        SpringApplication.run(TaskManagerApplication.class, args);
    }
}

package uz.dev.taskmanager.task;     // sub-package -> topiladi

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final BoardRepository boardRepository;

    // Bitta constructor bo'lsa @Autowired shart emas (Spring 4.3+)
    public TaskService(TaskRepository taskRepository, BoardRepository boardRepository) {
        this.taskRepository = taskRepository;
        this.boardRepository = boardRepository;
    }
}`,
          lang: 'java',
        },
        {
          title: "Constructor injection va nega field injection yomon",
          body: "Spring'da inject qilishning uch usuli bor: constructor, setter va field (`@Autowired` to'g'ridan-to'g'ri maydon ustida). Spring jamoasi va deyarli hamma style guide constructor injection'ni tavsiya qiladi.\n\nConstructor injection afzalliklari:\n\n- Maydonlar `final` bo'ladi — obyekt yaratilgandan keyin o'zgarmaydi (immutable)\n- Obyekt hech qachon 'yarim tayyor' holatda bo'lmaydi: dependency'siz uni yaratib bo'lmaydi\n- Unit test'da Spring'siz oddiy `new TaskService(mockRepo, mockBoardRepo)` qilasiz\n- Constructor'da 7-8 ta parametr bo'lsa — bu class juda ko'p ish qilyapti degan signal (Single Responsibility buzilgan)\n- Circular dependency darhol, startup'da ko'rinadi\n\nField injection kamchiliklari: maydon `final` bo'lolmaydi, testda reflection yoki Spring context kerak, dependency'lar yashirin bo'lib qoladi. Setter injection faqat ixtiyoriy (optional) dependency uchun ishlatiladi.\n\nLombok ishlatilsa, `@RequiredArgsConstructor` barcha `final` maydonlar uchun constructor yaratib beradi — ko'p loyihalarda shunday yoziladi.\n\nIntervyu maslahati: 'I always use constructor injection because the fields can be final and the class is easy to test without Spring' — shu bitta gap ko'p narsani ko'rsatadi.",
          code: `// YOMON: field injection
@Service
public class BoardService {
    @Autowired
    private BoardRepository boardRepository; // final emas, testda new qilib bo'lmaydi
}

// YAXSHI: constructor injection
@Service
public class BoardService {
    private final BoardRepository boardRepository;

    public BoardService(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
    }
}

// Lombok bilan bir xil natija
@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;
}`,
          lang: 'java',
        },
        {
          title: "@Configuration + @Bean: o'zimiz yozmagan class'lar uchun",
          body: "`@Component`'ni faqat o'zingiz yozgan class'ga qo'ya olasiz. Kutubxona class'lari (masalan, `BCryptPasswordEncoder`, `Clock`, `RestClient`) uchun `@Configuration` class ichida `@Bean` method yozasiz. Method qaytargan obyekt bean bo'ladi, bean nomi — method nomi.\n\nFarqi qisqacha:\n\n- `@Component` — class darajasida, component scan avtomatik topadi\n- `@Bean` — method darajasida, obyektni qanday yaratishni o'zingiz yozasiz (konfiguratsiya, parametrlar bilan)\n\n`@Configuration` class'lar ham proxy (CGLIB) qilinadi: bir `@Bean` method ichidan boshqa `@Bean` method'ni chaqirsangiz, yangi obyekt emas, o'sha singleton bean qaytadi.\n\nFoydali odat: `Clock`'ni bean qilib inject qiling. Shunda testda vaqtni 'muzlatib' qo'yish mumkin (`Clock.fixed(...)`), `LocalDateTime.now()` esa test qilib bo'lmaydigan kod beradi.",
          code: `@Configuration
public class AppConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public Clock clock() {
        return Clock.systemUTC();
    }
}

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final Clock clock;

    public TaskService(TaskRepository taskRepository, Clock clock) {
        this.taskRepository = taskRepository;
        this.clock = clock;
    }

    public boolean isOverdue(Task task) {
        return task.getDueDate() != null && task.getDueDate().isBefore(LocalDate.now(clock));
    }
}`,
          lang: 'java',
        },
        {
          title: "Bir nechta implementatsiya: @Primary va @Qualifier",
          body: "Agar bitta interface'ning ikkita bean'i bo'lsa, Spring qaysi birini berishni bilmaydi va startup'da xato beradi: 'expected single matching bean but found 2'.\n\nYechimlar:\n\n- `@Primary` — default tanlov; boshqa ko'rsatma bo'lmasa shu bean beriladi\n- `@Qualifier(\"name\")` — injection joyida aniq qaysi bean kerakligini aytasiz\n- `List<NotificationSender>` — barcha implementatsiyalarni birdaniga olasiz (masalan, hammasiga xabar yuborish uchun)\n\nMisol: task tayinlanganda foydalanuvchiga xabar yuboramiz. Odatda email, lekin ba'zi joyda Telegram kerak.",
          code: `public interface NotificationSender {
    void send(User user, String message);
}

@Component
@Primary
public class EmailNotificationSender implements NotificationSender { /* ... */ }

@Component("telegramSender")
public class TelegramNotificationSender implements NotificationSender { /* ... */ }

@Service
public class AssignmentService {
    private final NotificationSender defaultSender;   // -> Email (@Primary)
    private final NotificationSender telegramSender;  // -> Telegram
    private final List<NotificationSender> allSenders; // -> ikkalasi

    public AssignmentService(NotificationSender defaultSender,
                             @Qualifier("telegramSender") NotificationSender telegramSender,
                             List<NotificationSender> allSenders) {
        this.defaultSender = defaultSender;
        this.telegramSender = telegramSender;
        this.allSenders = allSenders;
    }
}`,
          lang: 'java',
        },
        {
          title: "Bean scope va lifecycle",
          body: "Scope — Spring bean'dan nechta nusxa yaratishini belgilaydi:\n\n- `singleton` (default) — butun ApplicationContext uchun bitta obyekt\n- `prototype` — har safar so'ralganda yangi obyekt\n- `request` — har HTTP request uchun bitta (faqat web ilovada)\n- `session` — har HTTP session uchun bitta\n\nSingleton bean'ni bir vaqtda ko'p thread ishlatadi: Tomcat har bir request'ni alohida thread'da bajaradi. Shuning uchun service'da o'zgaruvchan state (masalan, `private User currentUser;`) saqlash xavfli — bir foydalanuvchining ma'lumoti boshqasiga o'tib ketadi. Service'lar stateless bo'lishi kerak: faqat `final` dependency'lar.\n\nKo'p uchraydigan xato: prototype bean'ni singleton'ga inject qilish. Singleton faqat bir marta yaratiladi, demak prototype ham bir marta inject bo'ladi va 'har safar yangi' bo'lmaydi. Kerak bo'lsa `ObjectProvider<T>` orqali har safar yangisini oling.\n\nLifecycle: Spring bean'ni yaratadi → dependency'larni inject qiladi → `@PostConstruct` method'ni chaqiradi → (proxy bilan o'raydi) → bean ishlaydi → ilova to'xtaganda `@PreDestroy`. `@PostConstruct` — dependency'lar tayyor bo'lgandan keyin bir martalik tayyorgarlik uchun (masalan, cache'ni to'ldirish). Constructor ichida esa hali proxy tayyor emas.",
          code: `@Component
public class TaskStatusCache {
    private final TaskStatusRepository repo;
    private Map<String, TaskStatus> byCode = Map.of();

    public TaskStatusCache(TaskStatusRepository repo) {
        this.repo = repo;
    }

    @PostConstruct            // jakarta.annotation.PostConstruct
    void load() {
        byCode = repo.findAll().stream()
                .collect(Collectors.toMap(TaskStatus::getCode, s -> s));
    }

    @PreDestroy
    void cleanup() { /* resurslarni yopish */ }
}

@Component
@Scope("prototype")
public class CsvExportJob { /* har export uchun yangi obyekt */ }

@Service
public class ExportService {
    private final ObjectProvider<CsvExportJob> jobs;

    public ExportService(ObjectProvider<CsvExportJob> jobs) { this.jobs = jobs; }

    public void export() {
        CsvExportJob job = jobs.getObject(); // har chaqiruvda yangi prototype
    }
}`,
          lang: 'java',
        },
        {
          title: "Circular dependency va intervyu uchun xulosa",
          body: "Circular dependency — A bean'ga B kerak, B'ga esa A kerak. Constructor injection'da Spring ikkalasini ham yarata olmaydi, chunki biri ikkinchisisiz tug'ilmaydi. Spring Boot 2.6'dan boshlab circular reference'lar default holatda taqiqlangan va ilova startup'da 'The dependencies of some of the beans form a cycle' xatosi bilan to'xtaydi.\n\nTo'g'ri yechim — dizaynni tuzatish:\n\n- Umumiy logikani uchinchi class'ga chiqarish (A → C, B → C)\n- Event ishlatish: A event publish qiladi, B uni `@EventListener` bilan tinglaydi\n- Mas'uliyatni qayta taqsimlash: ehtimol bitta service ortiqcha ish qilyapti\n\nVaqtinchalik 'yamoq'lar: `@Lazy` yoki `spring.main.allow-circular-references=true` — lekin bu muammoni yashiradi, xolos.\n\nIntervyu maslahati: 'What is a bean?' savoliga 'an object that Spring creates and manages' deb javob bering, keyin darhol misol keltiring: 'For example, my TaskService is a singleton bean, and Spring injects TaskRepository into its constructor.' Aniq misol abstrakt ta'rifdan kuchliroq.",
          code: `// Muammo: TaskService <-> BoardService
@Service
class TaskService { TaskService(BoardService boards) { /* ... */ } }
@Service
class BoardService { BoardService(TaskService tasks) { /* ... */ } } // cycle!

// Yechim: event bilan bog'liqlikni uzish
public record BoardDeletedEvent(Long boardId) {}

@Service
class BoardService {
    private final BoardRepository boards;
    private final ApplicationEventPublisher events;

    BoardService(BoardRepository boards, ApplicationEventPublisher events) {
        this.boards = boards;
        this.events = events;
    }

    @Transactional
    public void delete(Long boardId) {
        boards.deleteById(boardId);
        events.publishEvent(new BoardDeletedEvent(boardId));
    }
}

@Component
class TaskCleanupListener {
    private final TaskRepository tasks;
    TaskCleanupListener(TaskRepository tasks) { this.tasks = tasks; }

    @EventListener
    public void on(BoardDeletedEvent e) { tasks.deleteByBoardId(e.boardId()); }
}`,
          lang: 'java',
        },
      ],
      vocab: [
        { en: 'Inversion of Control (IoC)', uz: "boshqaruvni teskari qilish (obyektlarni framework yaratadi)" },
        { en: 'dependency injection', uz: "bog'liqlikni tashqaridan berish" },
        { en: 'bean', uz: "Spring yaratadigan va boshqaradigan obyekt" },
        { en: 'container', uz: "bean'larni saqlovchi va boshqaruvchi muhit" },
        { en: 'loose coupling', uz: "class'lar orasidagi bo'sh bog'liqlik" },
        { en: 'scope', uz: "bean'ning 'yashash' doirasi (nechta nusxa)" },
        { en: 'lifecycle', uz: 'hayot sikli' },
        { en: 'circular dependency', uz: "aylanma bog'liqlik (A→B→A)" },
      ],
      questions: [
        {
          q: "What is Inversion of Control and Dependency Injection?",
          a: "Inversion of Control means that the framework creates and connects objects, not my code. Dependency Injection is the way Spring does it. A class does not create its dependencies with new. It gets them from outside, usually through the constructor. This makes the code loosely coupled and easy to test.",
          uz: "Inversion of Control — obyektlarni mening kodim emas, framework yaratadi va ulaydi degani. Dependency Injection — Spring buni qilish usuli. Class o'z dependency'larini new bilan yaratmaydi. Ularni tashqaridan, odatda constructor orqali oladi. Bu kodni loose coupled va test qilishga oson qiladi.",
          followUp: 'Why is that useful in tests?',
          level: 'junior',
        },
        {
          q: "What is a Spring bean?",
          a: "A bean is an object that Spring creates and manages. Spring keeps beans in the ApplicationContext. For example, my TaskService is a bean, and Spring injects TaskRepository into its constructor. By default every bean is a singleton.",
          uz: "Bean — Spring yaratadigan va boshqaradigan obyekt. Spring bean'larni ApplicationContext'da saqlaydi. Masalan, mening TaskService'im bean, va Spring uning constructor'iga TaskRepository'ni inject qiladi. Default holatda har bir bean singleton.",
          level: 'junior',
        },
        {
          q: "Why do you prefer constructor injection over field injection?",
          a: "With constructor injection, the fields can be final, so the object is immutable. The object cannot be created without its dependencies. In unit tests I can just call new and pass mocks, without Spring. Also, a long constructor shows me that the class does too much.",
          uz: "Constructor injection'da maydonlar final bo'lishi mumkin, shuning uchun obyekt immutable bo'ladi. Obyektni dependency'larisiz yaratib bo'lmaydi. Unit test'larda Spring'siz oddiy new chaqirib, mock'larni berishim mumkin. Bundan tashqari, uzun constructor class juda ko'p ish qilayotganini ko'rsatadi.",
          example: `@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final Clock clock;
}`,
          level: 'junior',
        },
        {
          q: "What is the difference between @Component, @Service, @Repository and @Controller?",
          a: "Technically they are all components, so component scan finds all of them. The names show the role of the class: @Service for business logic, @Repository for data access, @Controller for web requests. @Repository also translates database exceptions into Spring's DataAccessException. Using the right name makes the code easier to read.",
          uz: "Texnik jihatdan ularning hammasi component, shuning uchun component scan hammasini topadi. Nomlari class'ning rolini ko'rsatadi: biznes logika uchun @Service, ma'lumotlar bilan ishlash uchun @Repository, web request'lar uchun @Controller. @Repository qo'shimcha ravishda database exception'larini Spring'ning DataAccessException'iga o'giradi. To'g'ri nom ishlatish kodni o'qishni osonlashtiradi.",
          level: 'junior',
        },
        {
          q: "What is the difference between @Component and @Bean?",
          a: "@Component goes on a class that I wrote, and component scan finds it automatically. @Bean goes on a method inside a @Configuration class, and the method returns the object. I use @Bean for library classes that I cannot annotate, like PasswordEncoder or Clock. @Bean also lets me configure the object in code.",
          uz: "@Component men yozgan class ustiga qo'yiladi va component scan uni avtomatik topadi. @Bean esa @Configuration class ichidagi method ustiga qo'yiladi va method obyektni qaytaradi. @Bean'ni annotation qo'ya olmaydigan kutubxona class'lari uchun ishlataman, masalan PasswordEncoder yoki Clock. @Bean obyektni kod ichida sozlash imkonini ham beradi.",
          level: 'junior',
        },
        {
          q: "What bean scopes do you know? Is a singleton bean thread-safe?",
          a: "The main scopes are singleton, prototype, request and session. Singleton is the default: one object for the whole application. A singleton is not thread-safe by itself, because many request threads use it at the same time. So I keep my services stateless and do not store user data in fields.",
          uz: "Asosiy scope'lar: singleton, prototype, request va session. Singleton — default: butun ilova uchun bitta obyekt. Singleton o'z-o'zidan thread-safe emas, chunki uni bir vaqtda ko'p request thread'lari ishlatadi. Shuning uchun service'larimni stateless saqlayman va foydalanuvchi ma'lumotini maydonlarda saqlamayman.",
          followUp: 'What happens if you inject a prototype bean into a singleton?',
          level: 'middle',
        },
        {
          q: "You have two implementations of one interface. How does Spring choose which one to inject?",
          a: "If there are two beans of the same type, Spring fails at startup with an error. I can mark one implementation with @Primary, so it becomes the default. Or I use @Qualifier with the bean name at the injection point. If I need all of them, I inject a List of the interface.",
          uz: "Agar bir xil turdagi ikkita bean bo'lsa, Spring startup'da xato beradi. Bitta implementatsiyani @Primary bilan belgilashim mumkin, shunda u default bo'ladi. Yoki injection joyida bean nomi bilan @Qualifier ishlataman. Agar hammasi kerak bo'lsa, interface'ning List'ini inject qilaman.",
          level: 'middle',
        },
        {
          q: "What is a circular dependency and how do you fix it?",
          a: "It is when bean A needs bean B, and bean B needs bean A. With constructor injection Spring cannot create them, and since Spring Boot 2.6 the app fails at startup. I fix it by changing the design. For example, I move the shared logic to a third class or I use an application event. @Lazy works, but it only hides the problem.",
          uz: "Bu A bean'ga B kerak bo'lganda, B'ga esa A kerak bo'lgandagi holat. Constructor injection'da Spring ularni yarata olmaydi va Spring Boot 2.6'dan beri ilova startup'da to'xtaydi. Men buni dizaynni o'zgartirib tuzataman. Masalan, umumiy logikani uchinchi class'ga chiqaraman yoki application event ishlataman. @Lazy ishlaydi, lekin u faqat muammoni yashiradi.",
          level: 'middle',
        },
        {
          q: "What is @PostConstruct used for?",
          a: "Spring calls a @PostConstruct method once, after it creates the bean and injects all dependencies. I use it for one-time setup, for example to load some data into a cache. In the constructor the dependencies are ready too, but proxies and other post-processing are not done yet. There is also @PreDestroy, which runs when the application stops.",
          uz: "Spring @PostConstruct method'ni bean'ni yaratib, barcha dependency'larni inject qilgandan keyin bir marta chaqiradi. Men uni bir martalik tayyorgarlik uchun ishlataman, masalan ba'zi ma'lumotlarni cache'ga yuklash uchun. Constructor'da ham dependency'lar tayyor, lekin proxy'lar va boshqa post-processing hali bajarilmagan. @PreDestroy ham bor, u ilova to'xtaganda ishlaydi.",
          level: 'middle',
        },
      ],
      resources: [
        { title: 'Spring Framework — The IoC Container', url: 'https://docs.spring.io/spring-framework/reference/core/beans.html' },
        { title: 'Baeldung — Inversion of Control and Dependency Injection', url: 'https://www.baeldung.com/inversion-control-and-dependency-injection-in-spring' },
        { title: 'Baeldung — Quick Guide to Spring Bean Scopes', url: 'https://www.baeldung.com/spring-bean-scopes' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'spring-boot-basics',
      title: 'Spring Boot: starter, auto-configuration, konfiguratsiya',
      days: [36],
      summary: "Spring Boot — Spring Framework ustidagi qatlam: u Spring'ni sozlash ishini deyarli yo'q qiladi. Starter dependency'lar kerakli kutubxonalarni to'plam qilib beradi, auto-configuration esa classpath'ga qarab kerakli bean'larni o'zi yaratadi (DataSource, Jackson, Tomcat va hokazo). Ilova ichida embedded Tomcat bor, shuning uchun u oddiy `java -jar app.jar` bilan ishga tushadi. Sozlamalar application.yml'da, muhitga qarab profile'lar (dev, prod) va environment variable'lar orqali o'zgaradi. Intervyuda ko'pincha 'Spring va Spring Boot farqi nima?' va 'Auto-configuration qanday ishlaydi?' so'raladi.",
      keyPoints: [
        "Spring Boot = Spring + auto-configuration + starter'lar + embedded server + production tayyor imkoniyatlar",
        "@SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan",
        "Auto-configuration @Conditional annotation'lar bilan ishlaydi: classpath'da class bor bo'lsa va siz o'zingiz bean yozmagan bo'lsangiz",
        "Starter — bir maqsad uchun dependency to'plami: spring-boot-starter-web, -data-jpa, -security, -validation, -test",
        "Embedded Tomcat: ilova bitta executable jar, alohida server o'rnatish shart emas",
        "application.yml + profile'lar (application-dev.yml, application-prod.yml) + env variable'lar",
        "@ConfigurationProperties — sozlamalarni type-safe Java obyektga bog'lash",
        "Actuator — /actuator/health kabi monitoring endpoint'lari",
      ],
      lesson: [
        {
          title: "Spring va Spring Boot farqi, loyihani yaratish",
          body: "Spring Framework — katta kutubxonalar to'plami: IoC container, MVC, data access, transaction'lar. Lekin oddiy Spring'da ko'p narsani qo'lda sozlash kerak edi: XML yoki Java config, DispatcherServlet, DataSource, Jackson, alohida Tomcat server'ga deploy qilish.\n\nSpring Boot bu ishni 'convention over configuration' tamoyili bilan avtomatlashtiradi. Siz faqat nimani xohlashingizni aytasiz (starter qo'shasiz), Boot esa aqlli default'lar bilan qolganini sozlaydi.\n\nYangi loyiha start.spring.io (Spring Initializr) orqali yaratiladi. Task-manager uchun tanlaymiz: Maven, Java 21, Spring Boot 3.x va dependency'lar — Spring Web, Spring Data JPA, PostgreSQL Driver, Validation, Spring Security, Flyway, Actuator, Lombok (ixtiyoriy).\n\nStarter — bitta dependency, lekin ichida kerakli hamma narsa bor. Masalan, `spring-boot-starter-web` ichida Spring MVC, Jackson va embedded Tomcat bor. Versiyalarni yozish shart emas: parent `spring-boot-starter-parent` bir-biriga mos versiyalarni boshqaradi (dependency management).",
          code: `<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.3.5</version>
</parent>

<properties>
    <java.version>21</java.version>
</properties>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>`,
          lang: 'xml',
        },
        {
          title: "@SpringBootApplication va auto-configuration ichida nima bo'ladi",
          body: "`@SpringBootApplication` — uchta annotation'ning qisqartmasi:\n\n- `@Configuration` — bu class ham bean'lar manbai bo'lishi mumkin\n- `@ComponentScan` — shu package va sub-package'lardagi @Component'larni topadi\n- `@EnableAutoConfiguration` — Boot'ning auto-configuration'larini yoqadi\n\nAuto-configuration qanday ishlaydi: Spring Boot jar'larida yuzlab tayyor `@AutoConfiguration` class'lar bor (ro'yxati `META-INF/spring/...AutoConfiguration.imports` faylida). Har biri `@Conditional...` shartlar bilan himoyalangan va faqat shart bajarilsa ishlaydi:\n\n- `@ConditionalOnClass` — classpath'da ma'lum class bor bo'lsa (masalan, PostgreSQL driver va JPA bor → DataSource va EntityManagerFactory yaratiladi)\n- `@ConditionalOnMissingBean` — siz o'zingiz shu turdagi bean yaratmagan bo'lsangiz. Shuning uchun o'z bean'ingizni yozsangiz, Boot'niki 'orqaga chekinadi' (back off)\n- `@ConditionalOnProperty` — ma'lum property qiymatiga qarab\n\nYa'ni auto-configuration 'sehr' emas: bu oddiy `@Configuration` class'lar, faqat shartli. Qaysilari ishlaganini ko'rish uchun ilovani `--debug` bilan ishga tushiring — Boot 'CONDITIONS EVALUATION REPORT' chiqaradi.\n\nIntervyu maslahati: 'Auto-configuration looks at the classpath and at the beans I already defined. If I define my own bean, Boot backs off' — bu javob chuqur tushunishni ko'rsatadi.",
          code: `// Boot ichidagi auto-configuration taxminan shunday ko'rinadi (soddalashtirilgan)
@AutoConfiguration
@ConditionalOnClass(ObjectMapper.class)
public class JacksonAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean          // siz o'zingiz ObjectMapper yozmagan bo'lsangiz
    public ObjectMapper jacksonObjectMapper(Jackson2ObjectMapperBuilder builder) {
        return builder.build();
    }
}

// O'z feature'ingizni property bilan yoqib-o'chirish
@Configuration
@ConditionalOnProperty(name = "app.notifications.enabled", havingValue = "true")
public class NotificationConfig {
    @Bean
    NotificationSender emailSender() { return new EmailNotificationSender(); }
}`,
          lang: 'java',
        },
        {
          title: "Embedded Tomcat, ishga tushirish va package tuzilmasi",
          body: "Spring Boot ilovasi ichida server bor (default — Tomcat). `main` method `SpringApplication.run(...)` ni chaqiradi: u ApplicationContext'ni yaratadi, bean'larni tayyorlaydi va Tomcat'ni 8080 port'da ishga tushiradi. Natijada butun ilova — bitta 'fat jar', uni Docker'ga qo'yish va serverda ishga tushirish juda oson.\n\nMaven Wrapper (`mvnw`) loyihaning ichida keladi: kompyuterda Maven o'rnatilmagan bo'lsa ham to'g'ri versiya bilan ishlaydi.\n\nPackage tuzilmasi uchun ikki yondashuv bor:\n\n- Layer bo'yicha: `controller`, `service`, `repository`, `dto`, `entity` — kichik loyihalarda oddiy\n- Feature bo'yicha: `task`, `board`, `user`, `auth`, `common` — har bir papka ichida o'z controller, service, repository'si. Loyiha kattalashganda bu yaxshiroq, chunki bog'liq kod bir joyda turadi\n\nPortfolio loyiha uchun feature bo'yicha tuzilma tavsiya qilinadi — intervyuda 'nega shunday tuzdingiz?' deb so'rashsa, yaxshi javob bo'ladi.",
          code: `# Dev rejimda ishga tushirish
./mvnw spring-boot:run

# Profile bilan
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Test + jar yig'ish, keyin ishga tushirish
./mvnw clean package
java -jar target/task-manager-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod

# Feature bo'yicha package tuzilmasi
# src/main/java/uz/dev/taskmanager/
#   TaskManagerApplication.java
#   auth/    AuthController, JwtService, JwtAuthFilter, SecurityConfig
#   board/   Board, BoardController, BoardService, BoardRepository
#   task/    Task, TaskController, TaskService, TaskRepository, dto/
#   user/    User, UserRepository
#   common/  GlobalExceptionHandler, NotFoundException
# src/main/resources/
#   application.yml, application-dev.yml, db/migration/V1__init.sql`,
          lang: 'bash',
        },
        {
          title: "application.yml, profile'lar va environment variable'lar",
          body: "Sozlamalar `src/main/resources/application.yml` (yoki `.properties`) faylida turadi. Profile — muhitga xos sozlamalar to'plami. `application-dev.yml` faqat `dev` profile faol bo'lganda yuklanadi va umumiy fayldagi qiymatlarni ustidan yozadi.\n\nProfile'ni yoqish: `spring.profiles.active=dev` (property, env variable `SPRING_PROFILES_ACTIVE=prod` yoki command line argument orqali).\n\nMuhim qoida: parol, JWT secret, database URL — hech qachon git'ga commit qilinmaydi. Ular environment variable'dan olinadi: `${DB_PASSWORD}`. Spring Boot env variable'larni avtomatik ham bog'laydi (relaxed binding): `SPRING_DATASOURCE_URL` → `spring.datasource.url`.\n\nQiymatlar ustuvorligi (yuqoridagisi kuchliroq): command line argument → environment variable → `application-{profile}.yml` → `application.yml`. Shuning uchun bitta jar'ni har xil muhitda faqat env variable'larni o'zgartirib ishlatsa bo'ladi.\n\nKo'p uchraydigan xato: prod'da `spring.jpa.hibernate.ddl-auto=update` qoldirish. Prod'da sxemani Flyway boshqaradi, Hibernate esa faqat `validate` qiladi.",
          code: `# application.yml — umumiy sozlamalar
spring:
  application:
    name: task-manager
  datasource:
    url: \${DB_URL:jdbc:postgresql://localhost:5432/taskmanager}
    username: \${DB_USER:postgres}
    password: \${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
    open-in-view: false

app:
  jwt:
    secret: \${JWT_SECRET}
    access-token-ttl: 15m
  cors:
    allowed-origins: http://localhost:5173

---
# application-dev.yml — faqat dev profile'da
spring:
  jpa:
    show-sql: true
logging:
  level:
    uz.dev.taskmanager: DEBUG`,
          lang: 'yaml',
        },
        {
          title: "@ConfigurationProperties: type-safe sozlamalar",
          body: "Bitta-ikkita qiymat uchun `@Value(\"${app.jwt.secret}\")` yetarli. Lekin sozlamalar ko'payganda `@ConfigurationProperties` yaxshiroq: bir prefix ostidagi barcha qiymatlar bitta Java obyektga bog'lanadi, type'lar avtomatik o'giriladi (`15m` → `Duration`), validation ham qo'shsa bo'ladi.\n\nJava 21'da buni `record` bilan yozish qulay — immutable va qisqa. Class'ni ro'yxatdan o'tkazish uchun `@EnableConfigurationProperties` yoki `@ConfigurationPropertiesScan` kerak.\n\nAfzalliklari: hamma sozlama bir joyda, IDE autocomplete, startup'da xato (qiymat yo'q yoki noto'g'ri bo'lsa ilova umuman ishga tushmaydi — bu prod'da yarim ishlab turgandan yaxshiroq).",
          code: `@Validated
@ConfigurationProperties(prefix = "app.jwt")
public record JwtProperties(
        @NotBlank String secret,
        @NotNull Duration accessTokenTtl
) {}

@SpringBootApplication
@ConfigurationPropertiesScan          // @ConfigurationProperties record'larni topadi
public class TaskManagerApplication { /* main */ }

@Service
public class JwtService {
    private final JwtProperties props;

    public JwtService(JwtProperties props) {
        this.props = props;
    }
    // props.secret(), props.accessTokenTtl()
}`,
          lang: 'java',
        },
        {
          title: "Actuator: ilova sog'lig'ini kuzatish",
          body: "`spring-boot-starter-actuator` production uchun tayyor endpoint'lar qo'shadi. Eng muhimi — `/actuator/health`: ilova va uning dependency'lari (database, disk) ishlayaptimi. Docker, Kubernetes va load balancer'lar aynan shu endpoint orqali instance sog'lommi-yo'qmi tekshiradi.\n\nBoshqa foydali endpoint'lar: `info`, `metrics` (Micrometer orqali — Prometheus'ga ham chiqarsa bo'ladi), `loggers` (log darajasini ishga tushgan holda o'zgartirish).\n\nXavfsizlik: default holatda web orqali faqat `health` ochiq. `env`, `beans`, `heapdump` kabi endpoint'lar maxfiy ma'lumot ko'rsatishi mumkin — ularni internetga ochmang yoki security bilan yoping.",
          code: `# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: when-authorized

# Tekshirish:
# GET http://localhost:8080/actuator/health
# -> {"status":"UP"}`,
          lang: 'yaml',
        },
      ],
      vocab: [
        { en: 'auto-configuration', uz: "avtomatik sozlash (classpath'ga qarab)" },
        { en: 'starter', uz: "bir maqsad uchun tayyor dependency to'plami" },
        { en: 'embedded server', uz: "ilova ichiga o'rnatilgan server (Tomcat)" },
        { en: 'profile', uz: "muhitga xos sozlamalar to'plami (dev, prod)" },
        { en: 'environment variable', uz: "muhit o'zgaruvchisi" },
        { en: 'classpath', uz: "Java class va jar'larni qidiradigan yo'llar ro'yxati" },
        { en: 'back off', uz: "orqaga chekinmoq (o'z bean'ingiz bo'lsa Boot'niki yaratilmaydi)" },
        { en: 'health check', uz: "ilova sog'lomligini tekshirish" },
      ],
      questions: [
        {
          q: "What is the difference between Spring and Spring Boot?",
          a: "Spring is the core framework with dependency injection, MVC, data access and more. Spring Boot is built on top of Spring and makes setup much faster. It gives starters, auto-configuration and an embedded server like Tomcat. So with Boot I can start a production-ready app in minutes, without a lot of configuration.",
          uz: "Spring — dependency injection, MVC, data access va boshqalarga ega asosiy framework. Spring Boot Spring ustiga qurilgan va sozlashni ancha tezlashtiradi. U starter'lar, auto-configuration va Tomcat kabi embedded server beradi. Shuning uchun Boot bilan ko'p konfiguratsiyasiz bir necha daqiqada production'ga tayyor ilovani boshlay olaman.",
          level: 'junior',
        },
        {
          q: "How does auto-configuration work in Spring Boot?",
          a: "Spring Boot has many auto-configuration classes, and each one has conditions. For example, @ConditionalOnClass checks if a library is on the classpath. @ConditionalOnMissingBean checks if I already defined my own bean. If the conditions are true, Boot creates the beans for me. If I define my own bean, Boot backs off and uses mine.",
          uz: "Spring Boot'da ko'p auto-configuration class'lari bor va har birida shartlar bor. Masalan, @ConditionalOnClass kutubxona classpath'da bor-yo'qligini tekshiradi. @ConditionalOnMissingBean men o'zim bean yozganmanmi-yo'qmi tekshiradi. Shartlar to'g'ri bo'lsa, Boot men uchun bean'larni yaratadi. Agar o'z bean'imni yozsam, Boot orqaga chekinadi va menikini ishlatadi.",
          followUp: 'How can you see which auto-configurations were applied?',
          level: 'middle',
        },
        {
          q: "What does @SpringBootApplication do?",
          a: "It is a shortcut for three annotations. @Configuration means the class can define beans. @ComponentScan scans this package and all sub-packages for components. @EnableAutoConfiguration turns on Spring Boot auto-configuration. That is why the main class should be in the root package.",
          uz: "Bu uchta annotation'ning qisqartmasi. @Configuration class bean'lar e'lon qila olishini bildiradi. @ComponentScan shu package va barcha sub-package'lardan component'larni qidiradi. @EnableAutoConfiguration Spring Boot auto-configuration'ni yoqadi. Shuning uchun main class root package'da turishi kerak.",
          level: 'junior',
        },
        {
          q: "What is a Spring Boot starter?",
          a: "A starter is one dependency that brings a group of libraries for one purpose. For example, spring-boot-starter-web brings Spring MVC, Jackson and embedded Tomcat. The versions are managed by Spring Boot, so they work well together. I do not need to search for compatible versions myself.",
          uz: "Starter — bitta maqsad uchun kutubxonalar guruhini olib keladigan bitta dependency. Masalan, spring-boot-starter-web Spring MVC, Jackson va embedded Tomcat'ni olib keladi. Versiyalarni Spring Boot boshqaradi, shuning uchun ular bir-biri bilan yaxshi ishlaydi. Mos versiyalarni o'zim qidirishim shart emas.",
          level: 'junior',
        },
        {
          q: "How do you manage configuration for different environments?",
          a: "I put common settings in application.yml and environment-specific settings in profile files, like application-dev.yml. I activate a profile with SPRING_PROFILES_ACTIVE. Secrets like the database password and the JWT secret come from environment variables, not from git. So the same jar runs in dev and in prod with different variables.",
          uz: "Umumiy sozlamalarni application.yml'ga, muhitga xos sozlamalarni esa application-dev.yml kabi profile fayllarga qo'yaman. Profile'ni SPRING_PROFILES_ACTIVE bilan yoqaman. Database paroli va JWT secret kabi maxfiy ma'lumotlar git'dan emas, environment variable'lardan keladi. Shuning uchun bitta jar dev'da ham, prod'da ham turli o'zgaruvchilar bilan ishlaydi.",
          example: `spring:
  datasource:
    url: \${DB_URL}
    password: \${DB_PASSWORD}`,
          level: 'junior',
        },
        {
          q: "What is the difference between @Value and @ConfigurationProperties?",
          a: "@Value injects one property into one field. @ConfigurationProperties binds a whole group of properties with the same prefix to a Java object. It is type-safe, it supports validation, and it converts types like Duration. For more than two or three related settings, I use @ConfigurationProperties with a record.",
          uz: "@Value bitta property'ni bitta maydonga inject qiladi. @ConfigurationProperties esa bir xil prefix'li butun property guruhini Java obyektga bog'laydi. U type-safe, validation'ni qo'llab-quvvatlaydi va Duration kabi type'larni o'giradi. Ikki-uchtadan ortiq bog'liq sozlama bo'lsa, record bilan @ConfigurationProperties ishlataman.",
          level: 'middle',
        },
        {
          q: "Why does a Spring Boot app have an embedded server?",
          a: "Before Spring Boot, we built a WAR file and deployed it to an external Tomcat. Now the server is inside the application, so the result is one executable jar. I run it with java -jar. This is simple to run locally and very easy to put into a Docker container.",
          uz: "Spring Boot'dan oldin WAR fayl yig'ib, uni tashqi Tomcat'ga deploy qilardik. Endi server ilovaning ichida, shuning uchun natija — bitta executable jar. Uni java -jar bilan ishga tushiraman. Bu lokal ishga tushirish uchun oddiy va Docker container'ga qo'yish uchun juda oson.",
          level: 'junior',
        },
        {
          q: "What is Spring Boot Actuator used for?",
          a: "Actuator adds production endpoints for monitoring. The most important one is /actuator/health, which shows if the app and the database are up. Docker or Kubernetes can use it as a health check. There is also metrics and info. I expose only the needed endpoints, because some of them show sensitive data.",
          uz: "Actuator monitoring uchun production endpoint'larini qo'shadi. Eng muhimi — /actuator/health, u ilova va database ishlayotganini ko'rsatadi. Docker yoki Kubernetes uni health check sifatida ishlatishi mumkin. Metrics va info ham bor. Men faqat kerakli endpoint'larni ochaman, chunki ba'zilari maxfiy ma'lumotlarni ko'rsatadi.",
          level: 'junior',
        },
      ],
      resources: [
        { title: 'Spring Boot Reference — Auto-configuration', url: 'https://docs.spring.io/spring-boot/reference/using/auto-configuration.html' },
        { title: 'Spring Boot Reference — Externalized Configuration', url: 'https://docs.spring.io/spring-boot/reference/features/external-config.html' },
        { title: 'Spring Guides — Building an Application with Spring Boot', url: 'https://spring.io/guides/gs/spring-boot' },
        { title: 'Spring Initializr', url: 'https://start.spring.io' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'spring-mvc-rest',
      title: 'Spring MVC: REST controller, DTO, qatlamli arxitektura',
      days: [37, 38],
      summary: "Spring MVC'da har bir HTTP request avval Tomcat thread'iga tushadi, filter'lardan o'tadi va DispatcherServlet'ga keladi. DispatcherServlet — 'bosh dispetcher': u HandlerMapping orqali to'g'ri controller method'ini topadi, parametrlarni bog'laydi, method'ni chaqiradi va natijani HttpMessageConverter (Jackson) orqali JSON'ga aylantiradi. Controller'lar @RestController bilan yoziladi, mapping'lar @GetMapping, @PostMapping va hokazo bilan. Toza kod uchun Controller → Service → Repository qatlamlari ishlatiladi, client'ga esa entity emas, DTO qaytariladi. Ro'yxatlar Pageable va Page orqali sahifalanadi.",
      keyPoints: [
        "Request yo'li: Tomcat thread → Filter'lar → DispatcherServlet → HandlerMapping → Controller → HttpMessageConverter → response",
        "@RestController = @Controller + @ResponseBody: qaytgan obyekt to'g'ridan-to'g'ri JSON bo'ladi",
        "@PathVariable — URL qismi, @RequestParam — query parametr, @RequestBody — JSON body",
        "ResponseEntity — status, header va body'ni to'liq boshqarish; POST → 201 Created + Location header",
        "Entity'ni hech qachon to'g'ridan-to'g'ri qaytarmang — DTO (Java record) ishlating",
        "Controller yupqa: faqat HTTP; biznes logika — Service'da; database — Repository'da",
        "Pagination: Pageable parametr (?page=0&size=20&sort=createdAt,desc) → Page<T>",
        "Mapping: qo'lda (static method) yoki MapStruct",
      ],
      lesson: [
        {
          title: "Request Spring ichida qanday yo'l bosib o'tadi",
          body: "Vue frontend `GET /api/boards/3/tasks` yuborganda Spring Boot ichida quyidagilar sodir bo'ladi:\n\n1. Embedded Tomcat ulanishni qabul qiladi va request'ni o'z thread pool'idan bitta thread'ga beradi (thread-per-request modeli; default 200 ta thread).\n2. Request Servlet Filter'lar zanjiridan o'tadi: CORS, Spring Security filter chain, logging va boshqalar. Filter request'ni to'xtatib qo'yishi ham mumkin (masalan, token yo'q → 401).\n3. Request `DispatcherServlet`'ga keladi — Spring MVC'ning yagona kirish nuqtasi (front controller pattern).\n4. `HandlerMapping` URL va method bo'yicha mos controller method'ini topadi: `TaskController.list(...)`.\n5. `HandlerAdapter` argument'larni tayyorlaydi: `@PathVariable`'ni `Long`'ga o'giradi, `@RequestBody` JSON'ini Jackson orqali Java obyektga aylantiradi, `@Valid` bo'lsa validation qiladi.\n6. Controller method'i ishlaydi (u service'ni chaqiradi).\n7. Qaytgan qiymatni `HttpMessageConverter` (Jackson'ning `MappingJackson2HttpMessageConverter`) JSON'ga aylantiradi va response'ga yozadi.\n8. Exception bo'lsa — `HandlerExceptionResolver`'lar, ya'ni sizning `@RestControllerAdvice`'ingiz ishga tushadi.\n\nNega bu muhim: xato qayerda paydo bo'lganini tushunasiz. Masalan, 401 controller'gacha yetib bormaydi — uni security filter qaytaradi. JSON parse xatosi esa controller method'i chaqirilishidan oldin, 5-qadamda bo'ladi.",
          code: `HTTP request
  -> Tomcat (thread from pool)
  -> Filter chain (CorsFilter, Spring Security filters, ...)
  -> DispatcherServlet
       -> HandlerMapping      : finds TaskController#list
       -> HandlerAdapter      : binds @PathVariable, @RequestParam, @RequestBody (Jackson)
       -> TaskController#list -> TaskService -> TaskRepository -> PostgreSQL
       -> HttpMessageConverter: Java object -> JSON
       -> (on exception) @RestControllerAdvice
  <- HTTP response`,
          lang: 'http',
        },
        {
          title: "@RestController va parametrlarni bog'lash",
          body: "`@RestController` — `@Controller` + `@ResponseBody`. Ya'ni method qaytargan obyekt view (HTML sahifa) nomi emas, balki response body sifatida JSON'ga aylantiriladi.\n\nClass ustidagi `@RequestMapping(\"/api/boards/{boardId}/tasks\")` — umumiy prefix. Method'lar ustida: `@GetMapping`, `@PostMapping`, `@PutMapping`, `@PatchMapping`, `@DeleteMapping`.\n\nParametr annotation'lari:\n\n- `@PathVariable Long boardId` — URL'dagi `{boardId}` qismi\n- `@RequestParam(required = false) TaskStatus status` — `?status=DONE`; enum'ga avtomatik o'giriladi\n- `@RequestBody CreateTaskRequest body` — JSON body → Java record (Jackson)\n- `@RequestHeader`, `@AuthenticationPrincipal` — header va joriy foydalanuvchi\n\nKo'p uchraydigan xato: `@RequestBody`'ni unutish. Unda Spring JSON'ni o'qimaydi va barcha maydonlar `null` bo'lib keladi. Yana bir xato: Java kompilyatori parametr nomlarini saqlamasa `@PathVariable` nomini topa olmaydi — Spring Boot parent'i `-parameters` flag'ini yoqadi, lekin shubha bo'lsa nomni aniq yozing: `@PathVariable(\"boardId\")`.",
          code: `@RestController
@RequestMapping("/api/boards/{boardId}/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // GET /api/boards/3/tasks?status=TODO
    @GetMapping
    public List<TaskResponse> list(@PathVariable Long boardId,
                                   @RequestParam(required = false) TaskStatus status) {
        return taskService.list(boardId, status);
    }

    // GET /api/boards/3/tasks/7
    @GetMapping("/{taskId}")
    public TaskResponse get(@PathVariable Long boardId, @PathVariable Long taskId) {
        return taskService.get(boardId, taskId);
    }
}`,
          lang: 'java',
        },
        {
          title: "DTO va entity: nega entity'ni qaytarmaymiz",
          body: "Entity — database jadvalining Java ko'rinishi (`@Entity Task`). DTO (Data Transfer Object) — API orqali kiradigan yoki chiqadigan ma'lumot shakli. Ularni ajratish juda muhim:\n\n- Xavfsizlik: `User` entity'sida `passwordHash` bor — entity qaytarsangiz, u JSON'ga chiqib ketadi\n- Mass assignment: entity'ni `@RequestBody` qilib olsangiz, client `id`, `ownerId` yoki `role` kabi maydonlarni ham o'zgartira oladi\n- Lazy loading: Jackson lazy relationship'ni o'qimoqchi bo'ladi → `LazyInitializationException` yoki keraksiz N+1 query'lar\n- Cheksiz rekursiya: `Board.tasks` → `Task.board` → `Board.tasks`... (StackOverflowError)\n- API barqarorligi: database sxemasini o'zgartirsangiz, API (va Vue frontend) buzilmaydi\n\nJava 21'da DTO'lar uchun `record` ideal: immutable, qisqa, Jackson ularni to'g'ridan-to'g'ri qo'llab-quvvatlaydi. Odatda request va response uchun alohida DTO bo'ladi: `CreateTaskRequest`, `UpdateTaskRequest`, `TaskResponse`.\n\nMapping: kichik loyihada qo'lda (`TaskResponse.from(task)`) — oddiy va tushunarli. Katta loyihada MapStruct — compile vaqtida mapper kodini generatsiya qiladi, reflection'siz va tez.",
          code: `// Request DTO — client yuboradi
public record CreateTaskRequest(
        @NotBlank @Size(max = 200) String title,
        @Size(max = 2000) String description,
        LocalDate dueDate
) {}

// Response DTO — client oladi
public record TaskResponse(
        Long id,
        String title,
        String description,
        TaskStatus status,
        LocalDate dueDate,
        Long boardId,
        Instant createdAt
) {
    public static TaskResponse from(Task t) {
        return new TaskResponse(t.getId(), t.getTitle(), t.getDescription(),
                t.getStatus(), t.getDueDate(), t.getBoard().getId(), t.getCreatedAt());
    }
}

// MapStruct varianti (kod compile vaqtida generatsiya qilinadi)
@Mapper(componentModel = "spring")
public interface TaskMapper {
    @Mapping(target = "boardId", source = "board.id")
    TaskResponse toResponse(Task task);
}`,
          lang: 'java',
        },
        {
          title: "Qatlamli arxitektura: Controller → Service → Repository",
          body: "Har bir qatlamning bitta vazifasi bor:\n\n- Controller — HTTP bilan ishlaydi: URL, status code, DTO, validation (`@Valid`). Biznes qaror qabul qilmaydi\n- Service — biznes logika va qoidalar: 'faqat board egasi task qo'sha oladi', transaction chegarasi (`@Transactional`), bir nechta repository'ni birlashtirish\n- Repository — database bilan ishlash (Spring Data JPA)\n\nBog'liqlik faqat pastga qarab yo'naladi: controller service'ni biladi, service repository'ni biladi, lekin teskarisi emas. Service HTTP haqida hech narsa bilmasligi kerak (`HttpServletRequest`, `ResponseEntity` service'da bo'lmaydi) — shunda uni boshqa joydan ham chaqirsa bo'ladi (masalan, scheduler'dan).\n\nKo'p uchraydigan xato: 'fat controller' — controller ichida repository'ni to'g'ridan-to'g'ri chaqirish va biznes logikani yozish. Bunday kodni test qilish va qayta ishlatish qiyin.\n\nIntervyu maslahati: o'z loyihangizni tushuntirganda 'My controllers are thin. They only map HTTP to service calls' deng — bu toza arxitektura haqida o'ylashingizni ko'rsatadi.",
          code: `@Service
@Transactional(readOnly = true)
public class TaskService {
    private final TaskRepository taskRepository;
    private final BoardRepository boardRepository;

    public TaskService(TaskRepository taskRepository, BoardRepository boardRepository) {
        this.taskRepository = taskRepository;
        this.boardRepository = boardRepository;
    }

    @Transactional
    public TaskResponse create(Long boardId, CreateTaskRequest req) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new NotFoundException("Board " + boardId + " not found"));
        Task task = new Task(req.title(), req.description(), req.dueDate(), board);
        return TaskResponse.from(taskRepository.save(task));
    }

    public TaskResponse get(Long boardId, Long taskId) {
        return taskRepository.findByIdAndBoardId(taskId, boardId)
                .map(TaskResponse::from)
                .orElseThrow(() -> new NotFoundException("Task " + taskId + " not found"));
    }
}`,
          lang: 'java',
        },
        {
          title: "ResponseEntity va to'liq CRUD controller",
          body: "Agar method oddiy obyekt qaytarsa, status — 200 OK. Boshqa status yoki header kerak bo'lsa, `ResponseEntity` yoki `@ResponseStatus` ishlatiladi.\n\nTo'g'ri status'lar:\n\n- `POST` → `201 Created` + `Location` header (yangi resurs manzili) + yaratilgan obyekt\n- `GET` → `200 OK`\n- `PUT`/`PATCH` → `200 OK` (yangilangan obyekt bilan) yoki `204`\n- `DELETE` → `204 No Content`\n- Topilmasa → `404` (exception orqali, keyingi mavzuda)\n\n`ServletUriComponentsBuilder.fromCurrentRequest()` joriy URL'ni oladi va unga `/{id}` qo'shadi — Location'ni qo'lda string bilan yig'ish shart emas.",
          code: `@RestController
@RequestMapping("/api/boards/{boardId}/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public Page<TaskResponse> list(@PathVariable Long boardId,
                                   @RequestParam(required = false) TaskStatus status,
                                   @PageableDefault(size = 20, sort = "createdAt",
                                           direction = Sort.Direction.DESC) Pageable pageable) {
        return taskService.list(boardId, status, pageable);
    }

    @GetMapping("/{taskId}")
    public TaskResponse get(@PathVariable Long boardId, @PathVariable Long taskId) {
        return taskService.get(boardId, taskId);
    }

    @PostMapping
    public ResponseEntity<TaskResponse> create(@PathVariable Long boardId,
                                               @Valid @RequestBody CreateTaskRequest req) {
        TaskResponse created = taskService.create(boardId, req);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(created);   // 201 + Location
    }

    @PatchMapping("/{taskId}")
    public TaskResponse update(@PathVariable Long boardId, @PathVariable Long taskId,
                               @Valid @RequestBody UpdateTaskRequest req) {
        return taskService.update(boardId, taskId, req);
    }

    @DeleteMapping("/{taskId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)                       // 204
    public void delete(@PathVariable Long boardId, @PathVariable Long taskId) {
        taskService.delete(boardId, taskId);
    }
}`,
          lang: 'java',
        },
        {
          title: "Pagination: Pageable va Page",
          body: "Spring Data `Pageable` parametrini URL'dan avtomatik yig'adi: `?page=0&size=20&sort=createdAt,desc`. E'tibor bering: `page` 0'dan boshlanadi. `@PageableDefault` — parametr kelmasa ishlatiladigan qiymatlar.\n\nRepository method'iga `Pageable` berilsa, Spring Data ikkita query yuboradi: `LIMIT/OFFSET` bilan ma'lumot va umumiy son uchun `count(*)`. Natija — `Page<T>`: `content`, `totalElements`, `totalPages`, `number`.\n\nXavfsizlik va unumdorlik:\n\n- `size`'ni cheklang: `spring.data.web.pageable.max-page-size=100`, aks holda kimdir `size=1000000` yuboradi\n- Sort qilinadigan maydonlarni cheklash haqida o'ylang — indeks yo'q ustun bo'yicha sort katta jadvalda sekin\n- `count` query qimmat bo'lsa va umumiy son kerak bo'lmasa, `Slice<T>` qaytaring (faqat 'keyingi sahifa bormi')\n\nKo'p uchraydigan xato: `Page<Task>` (entity)'ni to'g'ridan-to'g'ri qaytarish. `page.map(TaskResponse::from)` bilan DTO'ga o'giring. Yangi Spring Data versiyalarida `PageImpl`'ni to'g'ridan-to'g'ri JSON qilish haqida ogohlantirish chiqadi — o'z `PageResponse` record'ingizni qaytarish yoki `@EnableSpringDataWebSupport(pageSerializationMode = VIA_DTO)` barqaror JSON beradi.",
          code: `public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByBoardId(Long boardId, Pageable pageable);
    Page<Task> findByBoardIdAndStatus(Long boardId, TaskStatus status, Pageable pageable);
}

// Service
public Page<TaskResponse> list(Long boardId, TaskStatus status, Pageable pageable) {
    Page<Task> page = (status == null)
            ? taskRepository.findByBoardId(boardId, pageable)
            : taskRepository.findByBoardIdAndStatus(boardId, status, pageable);
    return page.map(TaskResponse::from);
}

// GET /api/boards/3/tasks?page=1&size=10&sort=dueDate,asc
// SQL: select ... from tasks where board_id=? order by due_date asc offset 10 rows fetch first 10 rows only
//      select count(*) from tasks where board_id=?`,
          lang: 'java',
        },
      ],
      vocab: [
        { en: 'front controller', uz: "barcha request'larni qabul qiluvchi yagona kirish nuqtasi" },
        { en: 'handler', uz: "request'ni qayta ishlovchi (controller method)" },
        { en: 'message converter', uz: "Java obyekt ↔ JSON o'giruvchi" },
        { en: 'DTO (Data Transfer Object)', uz: "ma'lumot tashish uchun obyekt" },
        { en: 'layered architecture', uz: 'qatlamli arxitektura' },
        { en: 'thin controller', uz: "yupqa controller (faqat HTTP ishi)" },
        { en: 'mass assignment', uz: "client yubormasligi kerak bo'lgan maydonlarni ham o'zgartirib yuborishi" },
        { en: 'pagination', uz: "sahifalarga bo'lish" },
      ],
      questions: [
        {
          q: "What happens inside Spring when an HTTP request comes in?",
          a: "Tomcat takes a thread from its pool and passes the request through the servlet filters, like the security filters. Then the DispatcherServlet gets it. It uses HandlerMapping to find the right controller method and binds the parameters. After the method returns, Jackson converts the result to JSON. If there is an exception, the controller advice handles it.",
          uz: "Tomcat o'z pool'idan bitta thread oladi va request'ni servlet filter'lardan, masalan security filter'lardan o'tkazadi. Keyin uni DispatcherServlet oladi. U HandlerMapping orqali to'g'ri controller method'ini topadi va parametrlarni bog'laydi. Method natija qaytargandan keyin Jackson uni JSON'ga aylantiradi. Exception bo'lsa, controller advice uni qayta ishlaydi.",
          followUp: 'Where does a 401 error come from — the controller or a filter?',
          level: 'middle',
        },
        {
          q: "What is the difference between @Controller and @RestController?",
          a: "@Controller is for classic web apps where a method returns a view name, like an HTML template. @RestController is @Controller plus @ResponseBody. This means the return value is written directly to the response body, usually as JSON. For REST APIs I always use @RestController.",
          uz: "@Controller method view nomini, masalan HTML shablonni qaytaradigan klassik web ilovalar uchun. @RestController — bu @Controller plus @ResponseBody. Bu qaytgan qiymat to'g'ridan-to'g'ri response body'ga, odatda JSON sifatida yoziladi degani. REST API'lar uchun men doim @RestController ishlataman.",
          level: 'junior',
        },
        {
          q: "What is the difference between @PathVariable, @RequestParam and @RequestBody?",
          a: "@PathVariable reads a part of the URL path, like the board id in /boards/3/tasks. @RequestParam reads a query parameter, like ?status=DONE, and it is often optional. @RequestBody reads the JSON body and converts it to a Java object with Jackson. I use path variables to identify a resource and query parameters for filters and paging.",
          uz: "@PathVariable URL yo'lining bir qismini o'qiydi, masalan /boards/3/tasks'dagi board id'sini. @RequestParam query parametrni o'qiydi, masalan ?status=DONE, va u ko'pincha ixtiyoriy bo'ladi. @RequestBody JSON body'ni o'qiydi va uni Jackson bilan Java obyektga aylantiradi. Resursni aniqlash uchun path variable, filter va sahifalash uchun esa query parametr ishlataman.",
          example: `@GetMapping("/api/boards/{boardId}/tasks")
public Page<TaskResponse> list(@PathVariable Long boardId,
                               @RequestParam(required = false) TaskStatus status,
                               Pageable pageable) { ... }`,
          level: 'junior',
        },
        {
          q: "Why should you not return JPA entities from a controller?",
          a: "First, entities can contain sensitive fields, like a password hash. Second, lazy relationships can cause LazyInitializationException or extra queries during JSON serialization. Third, two-way relationships can cause infinite recursion. Also, the API becomes tied to the database schema. So I map entities to DTOs, usually Java records.",
          uz: "Birinchidan, entity'larda parol hash'i kabi maxfiy maydonlar bo'lishi mumkin. Ikkinchidan, lazy relationship'lar JSON serialization paytida LazyInitializationException yoki qo'shimcha query'larga sabab bo'lishi mumkin. Uchinchidan, ikki tomonlama relationship'lar cheksiz rekursiyaga olib kelishi mumkin. Bundan tashqari, API database sxemasiga bog'lanib qoladi. Shuning uchun entity'larni DTO'ga, odatda Java record'larga o'giraman.",
          followUp: 'How do you map entities to DTOs?',
          level: 'junior',
        },
        {
          q: "What status code and headers do you return when you create a resource?",
          a: "I return 201 Created. I also add a Location header with the URL of the new resource, and I return the created object in the body. In Spring I use ResponseEntity.created(uri).body(dto). The client can use the id or the Location to open the new task.",
          uz: "201 Created qaytaraman. Yangi resurs URL'i bilan Location header ham qo'shaman va body'da yaratilgan obyektni qaytaraman. Spring'da ResponseEntity.created(uri).body(dto) ishlataman. Client yangi task'ni ochish uchun id yoki Location'dan foydalanishi mumkin.",
          example: `URI location = ServletUriComponentsBuilder.fromCurrentRequest()
        .path("/{id}").buildAndExpand(created.id()).toUri();
return ResponseEntity.created(location).body(created);`,
          level: 'junior',
        },
        {
          q: "How do you structure a Spring Boot application?",
          a: "I use three layers: controller, service and repository. The controller handles HTTP and DTOs, the service has the business rules and transactions, and the repository talks to the database. Dependencies go only down. For packages, I prefer grouping by feature, like task, board and user, because related code stays together.",
          uz: "Uchta qatlam ishlataman: controller, service va repository. Controller HTTP va DTO'lar bilan ishlaydi, service'da biznes qoidalar va transaction'lar, repository esa database bilan gaplashadi. Bog'liqliklar faqat pastga yo'naladi. Package'lar uchun feature bo'yicha guruhlashni afzal ko'raman, masalan task, board va user, chunki bog'liq kod bir joyda turadi.",
          level: 'junior',
        },
        {
          q: "How do you implement pagination in Spring?",
          a: "I add a Pageable parameter to the controller method. Spring builds it from query parameters like page, size and sort. I pass it to a Spring Data repository method, which returns a Page with the content and the total count. I also set a maximum page size, so nobody can ask for a million rows.",
          uz: "Controller method'iga Pageable parametr qo'shaman. Spring uni page, size va sort kabi query parametrlardan yig'adi. Uni Spring Data repository method'iga beraman, u esa content va umumiy son bilan Page qaytaradi. Maksimal sahifa hajmini ham belgilayman, shunda hech kim million qator so'ray olmaydi.",
          followUp: 'What is the difference between Page and Slice?',
          level: 'middle',
        },
        {
          q: "How does Spring convert Java objects to JSON?",
          a: "Spring uses HttpMessageConverters. For JSON, Spring Boot configures Jackson by default. When a controller returns an object, the converter writes it as JSON, and for @RequestBody it reads JSON into an object. I can customize Jackson with properties or my own ObjectMapper bean, for example the date format.",
          uz: "Spring HttpMessageConverter'lardan foydalanadi. JSON uchun Spring Boot default holatda Jackson'ni sozlaydi. Controller obyekt qaytarganda converter uni JSON qilib yozadi, @RequestBody uchun esa JSON'ni obyektga o'qiydi. Jackson'ni property'lar yoki o'z ObjectMapper bean'im bilan sozlashim mumkin, masalan sana formatini.",
          level: 'middle',
        },
      ],
      resources: [
        { title: 'Spring Framework — Web MVC: DispatcherServlet', url: 'https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet.html' },
        { title: 'Spring Guides — Building REST services with Spring', url: 'https://spring.io/guides/tutorials/rest' },
        { title: 'Baeldung — Entity To DTO Conversion', url: 'https://www.baeldung.com/entity-to-and-from-dto-for-a-java-spring-application' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'spring-validation-errors',
      title: 'Validation, xatolar bilan ishlash va logging',
      days: [40],
      summary: "Client'dan kelgan ma'lumotga hech qachon ishonmaymiz: Bean Validation annotation'lari (@NotBlank, @Size, @Email) DTO ustiga qo'yiladi, controller'da esa @Valid validation'ni ishga tushiradi. Validation o'tmasa Spring MethodArgumentNotValidException tashlaydi va 400 qaytaradi. Barcha xatolarni bitta joyda — @RestControllerAdvice ichida — @ExceptionHandler'lar bilan ushlaymiz, shunda API har doim bir xil formatdagi xato JSON'ini qaytaradi. Spring 6'da buning standart formati bor: ProblemDetail (RFC 7807/9457). Logging SLF4J orqali qilinadi: to'g'ri daraja, parametrli xabarlar va hech qachon parol yoki token log'ga yozilmaydi.",
      keyPoints: [
        "spring-boot-starter-validation qo'shilmasa, annotation'lar jim turadi — hech narsa tekshirilmaydi",
        "@NotNull — null emas; @NotEmpty — bo'sh emas; @NotBlank — faqat bo'shliqlardan iborat emas (String uchun)",
        "@Valid @RequestBody — validation ishga tushadi; xato bo'lsa MethodArgumentNotValidException → 400",
        "@RestControllerAdvice + @ExceptionHandler — xatolarni markazlashgan holda qayta ishlash",
        "ProblemDetail (application/problem+json): type, title, status, detail, instance + qo'shimcha maydonlar",
        "Biznes xatolar uchun o'z exception'laringiz: NotFoundException → 404, ConflictException → 409",
        "500 xatoda client'ga stack trace, SQL yoki class nomlarini ko'rsatmang — faqat log'ga yozing",
        "SLF4J: log.info(\"Task {} created\", id) — string concatenation emas, placeholder",
      ],
      lesson: [
        {
          title: "Bean Validation: DTO ustidagi annotation'lar",
          body: "Bean Validation (Jakarta Validation) — Java standarti, Spring Boot'da uning implementatsiyasi Hibernate Validator. Uni yoqish uchun `spring-boot-starter-validation` dependency kerak.\n\nKo'p ishlatiladigan annotation'lar:\n\n- `@NotNull` — qiymat `null` bo'lmasin (har qanday type)\n- `@NotEmpty` — `null` ham, bo'sh ham emas (String, List)\n- `@NotBlank` — String'da kamida bitta bo'shliq bo'lmagan belgi bo'lsin (`\"   \"` o'tmaydi)\n- `@Size(min, max)` — uzunlik; `@Min`, `@Max`, `@Positive` — sonlar\n- `@Email`, `@Pattern(regexp = ...)` — format\n- `@Past`, `@Future`, `@FutureOrPresent` — sanalar\n\nValidation ishga tushishi uchun controller parametrida `@Valid` bo'lishi shart. Ichma-ich obyekt bo'lsa (masalan, `List<SubtaskRequest>`), uning maydoni ustiga ham `@Valid` qo'yiladi.\n\nValidation — birinchi himoya chizig'i, lekin yagona emas: 'email allaqachon band' kabi tekshiruvlar service'da (database bilan) qilinadi, database'da esa `NOT NULL` va `UNIQUE` constraint'lar bo'ladi.\n\nKo'p uchraydigan xato: `@Valid`'ni unutish yoki starter'ni qo'shmaslik — kod kompilyatsiya bo'ladi, lekin hech narsa tekshirilmaydi.",
          code: `public record CreateTaskRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 200, message = "Title must be at most 200 characters")
        String title,

        @Size(max = 2000)
        String description,

        @FutureOrPresent(message = "Due date cannot be in the past")
        LocalDate dueDate
) {}

// Ichma-ich obyekt bo'lsa: @Valid List<SubtaskRequest> subtasks — elementlar ham tekshiriladi

public record RegisterRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, max = 72) String password,
        @NotBlank @Size(max = 100) String name
) {}

@PostMapping
public ResponseEntity<TaskResponse> create(@PathVariable Long boardId,
                                           @Valid @RequestBody CreateTaskRequest req) { ... }`,
          lang: 'java',
        },
        {
          title: "Validation xato bo'lsa nima bo'ladi",
          body: "`@Valid @RequestBody` bilan kelgan obyekt validation'dan o'tmasa, controller method'i umuman chaqirilmaydi. Spring `MethodArgumentNotValidException` tashlaydi, unda `BindingResult` bor — har bir xato maydon va uning xabari.\n\nBoshqa holatlar:\n\n- JSON buzuq yoki type noto'g'ri (`\"dueDate\": \"abc\"`) → `HttpMessageNotReadableException` → 400\n- `@PathVariable Long id`'ga `abc` kelsa → `MethodArgumentTypeMismatchException` → 400\n- `@RequestParam @Min(1) int size` kabi to'g'ridan-to'g'ri parametr ustidagi constraint'lar → Spring 6.1+'da `HandlerMethodValidationException` (class ustida `@Validated` bo'lsa — `ConstraintViolationException`)\n\nDefault holatda Spring Boot bularga umumiy 400 javob beradi, lekin unda qaysi maydon xato ekanini Vue frontend'ga tushunarli qilib bermaydi. Shuning uchun bizga o'z handler'imiz kerak — frontend har bir input ostida xatoni ko'rsatishi uchun maydon → xabar ko'rinishidagi xarita.",
          code: `POST /api/boards/3/tasks
Content-Type: application/json

{ "title": "  ", "dueDate": "2020-01-01" }

HTTP/1.1 400 Bad Request
Content-Type: application/problem+json

{
  "type": "about:blank",
  "title": "Validation failed",
  "status": 400,
  "detail": "Invalid request content.",
  "instance": "/api/boards/3/tasks",
  "errors": {
    "title": "Title is required",
    "dueDate": "Due date cannot be in the past"
  }
}`,
          lang: 'http',
        },
        {
          title: "@RestControllerAdvice va ProblemDetail",
          body: "`@RestControllerAdvice` — barcha controller'lar uchun umumiy 'xato ushlagich'. Ichidagi `@ExceptionHandler(X.class)` method'lar X turdagi exception tashlanganda chaqiriladi. Spring eng yaqin (eng aniq) exception turiga mos handler'ni tanlaydi.\n\n`ProblemDetail` — Spring 6'dagi standart xato formati (RFC 7807, yangi versiyasi RFC 9457). Maydonlari: `type`, `title`, `status`, `detail`, `instance`; `setProperty(...)` bilan o'z maydonlaringizni qo'shasiz. Uni qaytarsangiz, Spring `Content-Type: application/problem+json` qo'yadi.\n\n`ResponseEntityExceptionHandler`'dan meros olish foydali: u Spring MVC'ning barcha ichki exception'larini (buzuq JSON, 405 method not allowed, 404 no resource va hokazo) to'g'ri status bilan ProblemDetail'ga aylantiradi. Biz faqat kerakli method'ni override qilamiz.\n\nKo'p uchraydigan xato: `@ExceptionHandler(Exception.class)` catch-all qo'shib, Spring Security'ning `AccessDeniedException`'ini ham ushlab olish. Natijada 403 o'rniga 500 qaytadi. Uni alohida handle qiling.\n\nYana bir xato: har controller'da try-catch yozish. Exception'ni service'dan tashlang, uni advice ushlasin — controller'lar toza qoladi.",
          code: `public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) { super(message); }
}

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // 400 — @Valid @RequestBody xatolari
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, HttpHeaders headers,
            HttpStatusCode status, WebRequest request) {
        Map<String, String> errors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(fe -> errors.putIfAbsent(fe.getField(), fe.getDefaultMessage()));
        ProblemDetail pd = ex.getBody();
        pd.setTitle("Validation failed");
        pd.setProperty("errors", errors);
        return handleExceptionInternal(ex, pd, headers, status, request);
    }

    // 404 — biznes xato
    @ExceptionHandler(NotFoundException.class)
    public ProblemDetail handleNotFound(NotFoundException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        pd.setTitle("Resource not found");
        return pd;
    }

    // 409 — masalan, UNIQUE constraint (email band)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ProblemDetail handleConflict(DataIntegrityViolationException ex) {
        log.warn("Data integrity violation: {}", ex.getMostSpecificCause().getMessage());
        return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, "The data conflicts with existing data");
    }

    // 403 — @PreAuthorize rad etganda (catch-all 500 qilib yubormasin)
    @ExceptionHandler(AccessDeniedException.class)
    public ProblemDetail handleAccessDenied(AccessDeniedException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, "Access denied");
    }

    // 500 — kutilmagan xato: to'liq log, client'ga umumiy xabar
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleUnexpected(Exception ex, HttpServletRequest req) {
        log.error("Unexpected error on {} {}", req.getMethod(), req.getRequestURI(), ex);
        return ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR,
                "Something went wrong. Please try again later.");
    }
}`,
          lang: 'java',
        },
        {
          title: "Custom validator (qisqacha)",
          body: "Standart annotation'lar yetmasa, o'z constraint'ingizni yozasiz: annotation + `ConstraintValidator` implementatsiyasi. Misol: ro'yxatdan o'tishda parol kamida bitta harf va bitta raqamga ega bo'lsin.\n\nValidator ham Spring bean kabi ishlaydi — kerak bo'lsa unga dependency inject qilish mumkin. Lekin validator ichida og'ir database so'rovlari qilmang; 'email band' kabi tekshiruvlarni service'da qiling va database'dagi `UNIQUE` constraint'ga ham tayaning (ikki parallel request holatida faqat database to'g'ri himoya qiladi).\n\nIkki maydonni solishtirish (masalan, `startDate <= dueDate`) uchun class darajasidagi constraint yoziladi — annotation record ustiga qo'yiladi.",
          code: `@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = StrongPasswordValidator.class)
public @interface StrongPassword {
    String message() default "Password must contain a letter and a digit";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

public class StrongPasswordValidator implements ConstraintValidator<StrongPassword, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext ctx) {
        if (value == null) return true;        // null'ni @NotBlank tekshiradi
        return value.chars().anyMatch(Character::isLetter)
            && value.chars().anyMatch(Character::isDigit);
    }
}

public record RegisterRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, max = 72) @StrongPassword String password
) {}`,
          lang: 'java',
        },
        {
          title: "Logging: SLF4J, darajalar va nima yozmaslik kerak",
          body: "Spring Boot'da logging uchun SLF4J (interface) va Logback (implementatsiya) default. Logger'ni `LoggerFactory.getLogger(...)` yoki Lombok'ning `@Slf4j`'i bilan olasiz.\n\nDarajalar (yuqoridan pastga):\n\n- `ERROR` — nimadir buzildi, odam aralashuvi kerak (500 xato, tashqi servis ishlamayapti)\n- `WARN` — g'alati, lekin ilova ishlayapti (retry, conflict)\n- `INFO` — muhim biznes hodisalar (ilova ishga tushdi, foydalanuvchi ro'yxatdan o'tdi)\n- `DEBUG` — dasturchi uchun tafsilotlar (faqat dev'da yoqiladi)\n- `TRACE` — juda batafsil\n\nQoidalar:\n\n- Placeholder ishlating: `log.info(\"Task {} created on board {}\", taskId, boardId)` — daraja o'chiq bo'lsa string umuman yig'ilmaydi\n- Exception'ni oxirgi argument qilib bering: `log.error(\"Failed to save task {}\", id, ex)` — stack trace ham yoziladi\n- Hech qachon log'ga yozmang: parol, JWT token, refresh token, karta raqami, to'liq request body (unda parol bo'lishi mumkin)\n- Har request'ga correlation/request id qo'shish (MDC orqali) — prod'da bitta request'ning barcha log'larini topish oson bo'ladi\n\n500 xatoda client'ga nima ketmasligi kerak: stack trace, SQL so'rovi, jadval va class nomlari, server ichki yo'llari. Bu ma'lumotlar hujumchiga tizim haqida ko'p narsa aytadi. Client'ga umumiy xabar, log'ga — to'liq tafsilot. Spring Boot'ning default sozlamalari ham shunday: `server.error.include-stacktrace=never`.\n\nIntervyu maslahati: 'I log the full error on the server, but the client only gets a generic message and maybe a request id' — bu xavfsizlik va qo'llab-quvvatlash haqida o'ylashingizni ko'rsatadi.",
          code: `@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    public TokenResponse login(LoginRequest req) {
        log.info("Login attempt for {}", req.email());           // OK
        // log.info("Login request: {}", req);                   // YOMON: ichida parol bor!
        try {
            return authenticateAndIssueTokens(req);
        } catch (BadCredentialsException ex) {
            log.warn("Failed login for {}", req.email());        // stack trace shart emas
            throw ex;
        }
    }
}

// application.yml:
logging:
  level:
    root: INFO
    uz.dev.taskmanager: DEBUG
    org.hibernate.SQL: DEBUG     # faqat dev'da: SQL so'rovlarini ko'rish`,
          lang: 'java',
        },
      ],
      vocab: [
        { en: 'validation', uz: "ma'lumotni tekshirish" },
        { en: 'constraint', uz: 'cheklov, qoida' },
        { en: 'exception handler', uz: "exception'ni ushlab, javobga aylantiruvchi method" },
        { en: 'consistent', uz: "bir xil, izchil" },
        { en: 'leak', uz: "(ma'lumot) sizib chiqmoq" },
        { en: 'stack trace', uz: "xato paytidagi method chaqiruvlar ro'yxati" },
        { en: 'log level', uz: 'log darajasi (ERROR, WARN, INFO, DEBUG)' },
        { en: 'sensitive data', uz: "maxfiy ma'lumot" },
      ],
      questions: [
        {
          q: "How do you validate request data in Spring Boot?",
          a: "I add the validation starter and put annotations like @NotBlank, @Size and @Email on the DTO fields. In the controller I add @Valid before @RequestBody. If the data is invalid, Spring does not call the method and throws MethodArgumentNotValidException. My global exception handler turns it into a 400 response with the field errors.",
          uz: "Validation starter'ni qo'shaman va DTO maydonlariga @NotBlank, @Size va @Email kabi annotation'larni qo'yaman. Controller'da @RequestBody oldiga @Valid qo'shaman. Ma'lumot noto'g'ri bo'lsa, Spring method'ni chaqirmaydi va MethodArgumentNotValidException tashlaydi. Mening global exception handler'im uni maydon xatolari bilan 400 javobga aylantiradi.",
          example: `public record CreateTaskRequest(@NotBlank @Size(max = 200) String title) {}

@PostMapping
public ResponseEntity<TaskResponse> create(@Valid @RequestBody CreateTaskRequest req) { ... }`,
          level: 'junior',
        },
        {
          q: "What is the difference between @NotNull, @NotEmpty and @NotBlank?",
          a: "@NotNull only checks that the value is not null. @NotEmpty also checks that a string or a list is not empty. @NotBlank is for strings, and it also fails if the string has only spaces. For a required text field like a task title, I use @NotBlank.",
          uz: "@NotNull faqat qiymat null emasligini tekshiradi. @NotEmpty qo'shimcha ravishda string yoki list bo'sh emasligini tekshiradi. @NotBlank string'lar uchun va agar string faqat bo'shliqlardan iborat bo'lsa ham xato beradi. Task sarlavhasi kabi majburiy matn maydoni uchun @NotBlank ishlataman.",
          level: 'junior',
        },
        {
          q: "How do you handle exceptions globally in Spring?",
          a: "I create one class with @RestControllerAdvice. Inside it I write @ExceptionHandler methods for different exceptions. For example, NotFoundException becomes 404 and validation errors become 400. This way controllers stay clean, without try-catch, and every error has the same JSON format.",
          uz: "@RestControllerAdvice bilan bitta class yarataman. Uning ichida turli exception'lar uchun @ExceptionHandler method'larini yozaman. Masalan, NotFoundException 404'ga, validation xatolari esa 400'ga aylanadi. Shu tarzda controller'lar try-catch'siz toza qoladi va har bir xato bir xil JSON formatiga ega bo'ladi.",
          followUp: 'What is ProblemDetail?',
          level: 'junior',
        },
        {
          q: "What is ProblemDetail in Spring 6?",
          a: "ProblemDetail is the standard error format from RFC 7807, which is now RFC 9457. It has fields like type, title, status, detail and instance. I can add my own fields, like a map of validation errors. When I return it, Spring uses the content type application/problem+json. It is good because the frontend always gets the same error shape.",
          uz: "ProblemDetail — RFC 7807 (hozir RFC 9457) dagi standart xato formati. Unda type, title, status, detail va instance kabi maydonlar bor. O'z maydonlarimni, masalan validation xatolari xaritasini qo'shishim mumkin. Uni qaytarganimda Spring application/problem+json content type'ini ishlatadi. Bu yaxshi, chunki frontend har doim bir xil shakldagi xatoni oladi.",
          level: 'middle',
        },
        {
          q: "How do you return 404 when a task does not exist?",
          a: "In the service I use findById and orElseThrow with my own NotFoundException. The exception goes up through the controller. My @RestControllerAdvice catches it and returns a ProblemDetail with status 404. So the controller does not need any if-else for this case.",
          uz: "Service'da findById va orElseThrow'ni o'zimning NotFoundException'im bilan ishlataman. Exception controller orqali yuqoriga chiqadi. Mening @RestControllerAdvice'im uni ushlaydi va 404 status bilan ProblemDetail qaytaradi. Shuning uchun controller'ga bu holat uchun hech qanday if-else kerak emas.",
          example: `Task task = taskRepository.findByIdAndBoardId(taskId, boardId)
        .orElseThrow(() -> new NotFoundException("Task " + taskId + " not found"));`,
          level: 'junior',
        },
        {
          q: "What information should you not return in a 500 error?",
          a: "I never return the stack trace, SQL queries, table names or internal class names. This information helps an attacker understand the system. The client gets only a general message, and maybe a request id. The full error with the stack trace goes to the server logs.",
          uz: "Men hech qachon stack trace, SQL so'rovlari, jadval nomlari yoki ichki class nomlarini qaytarmayman. Bu ma'lumotlar hujumchiga tizimni tushunishga yordam beradi. Client faqat umumiy xabar va ehtimol request id oladi. Stack trace bilan to'liq xato server log'lariga yoziladi.",
          level: 'junior',
        },
        {
          q: "What are your rules for logging in a Spring application?",
          a: "I use SLF4J with placeholders, not string concatenation. I choose the right level: ERROR for real failures, WARN for strange situations, INFO for important events, and DEBUG only for development. I pass the exception as the last argument to keep the stack trace. And I never log passwords, tokens or full request bodies.",
          uz: "SLF4J'ni string concatenation emas, placeholder'lar bilan ishlataman. To'g'ri darajani tanlayman: haqiqiy nosozliklar uchun ERROR, g'alati holatlar uchun WARN, muhim hodisalar uchun INFO, DEBUG esa faqat development uchun. Stack trace saqlanishi uchun exception'ni oxirgi argument qilib beraman. Va hech qachon parol, token yoki to'liq request body'ni log'ga yozmayman.",
          example: `log.info("Task {} created on board {}", task.getId(), boardId);
log.error("Failed to send notification for task {}", taskId, ex);`,
          level: 'junior',
        },
        {
          q: "How do you write a custom validation annotation?",
          a: "I create an annotation with @Constraint and point it to a validator class. The validator implements ConstraintValidator and has an isValid method. For example, I wrote @StrongPassword to check that a password has a letter and a digit. For checks that need the database, like a unique email, I prefer the service layer and a unique constraint.",
          uz: "@Constraint bilan annotation yarataman va uni validator class'ga yo'naltiraman. Validator ConstraintValidator'ni implement qiladi va isValid method'iga ega. Masalan, parolda harf va raqam borligini tekshirish uchun @StrongPassword yozganman. Unikal email kabi database kerak bo'lgan tekshiruvlar uchun service qatlami va unique constraint'ni afzal ko'raman.",
          level: 'middle',
        },
      ],
      resources: [
        { title: 'Spring Guides — Validating Form Input', url: 'https://spring.io/guides/gs/validating-form-input' },
        { title: 'Spring Framework — Error Responses (ProblemDetail)', url: 'https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html' },
        { title: 'Baeldung — Error Handling for REST with Spring', url: 'https://www.baeldung.com/exception-handling-for-rest-with-spring' },
        { title: 'Spring Boot Reference — Logging', url: 'https://docs.spring.io/spring-boot/reference/features/logging.html' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'spring-data-jpa',
      title: 'Spring Data JPA, Hibernate va Flyway',
      days: [45, 48],
      summary: "JPA — Java obyektlarini relational database jadvallariga bog'lash (ORM) uchun standart (specification), Hibernate — uning eng mashhur implementatsiyasi, Spring Data JPA esa ustidagi qatlam: interface yozasiz, Spring uning implementatsiyasini o'zi yaratadi. Entity class'lar @Entity, @Id, @ManyToOne, @OneToMany bilan belgilanadi. Hibernate ichida persistence context bor: transaction ichida yuklangan entity'larni kuzatadi va o'zgarishlarni commit paytida o'zi UPDATE qiladi (dirty checking). Eng ko'p so'raladigan muammo — N+1 query: lazy relationship'larni sikl ichida o'qish yuzlab qo'shimcha query beradi; yechimi JOIN FETCH, @EntityGraph yoki batch size. Database sxemasini Flyway migration'lari boshqaradi, Hibernate esa faqat validate qiladi.",
      keyPoints: [
        "JPA — standart (interface'lar), Hibernate — implementatsiya, Spring Data JPA — repository abstraksiyasi",
        "Entity: @Entity, @Id, @GeneratedValue, no-arg constructor; enum uchun @Enumerated(EnumType.STRING)",
        "@ManyToOne — 'ko'p tomon', foreign key shu jadvalda; @OneToMany(mappedBy) — teskari tomon",
        "JpaRepository: save, findById, findAll(Pageable), delete + derived query'lar (findByBoardIdAndStatus)",
        "@Query — JPQL (entity'lar ustida) yoki nativeQuery = true (to'g'ridan-to'g'ri SQL)",
        "Persistence context + dirty checking: managed entity'ni o'zgartirsangiz, save() siz ham UPDATE bo'ladi",
        "Default fetch: @ManyToOne EAGER, @OneToMany LAZY — hammasini LAZY qilish tavsiya etiladi",
        "N+1 yechimlari: JOIN FETCH, @EntityGraph, hibernate.default_batch_fetch_size, DTO projection",
        "Flyway: db/migration/V1__init.sql; ddl-auto=validate; qo'llangan migration'ni hech qachon o'zgartirmang",
      ],
      lesson: [
        {
          title: "JPA, Hibernate va Spring Data — kim nima qiladi",
          body: "Uchta tushuncha ko'pincha aralashtiriladi, intervyuda esa farqini so'rashadi:\n\n- JPA (Jakarta Persistence API) — faqat specification: annotation'lar (`@Entity`, `@Id`) va interface'lar (`EntityManager`). O'zi hech narsa qilmaydi\n- Hibernate — JPA'ning implementatsiyasi (ORM). SQL generatsiya qiladi, natijani obyektlarga aylantiradi, persistence context'ni boshqaradi. Spring Boot default holatda Hibernate ishlatadi\n- Spring Data JPA — Hibernate ustidagi qulaylik qatlami. Siz `interface TaskRepository extends JpaRepository<Task, Long>` yozasiz, Spring ishga tushganda uning implementatsiyasini (proxy) yaratadi\n- JDBC — eng pastki qatlam: hammasi oxirida JDBC orqali PostgreSQL'ga SQL yuboradi\n\nZanjir: `TaskRepository` (Spring Data) → `EntityManager` (JPA) → Hibernate → JDBC → PostgreSQL.\n\nORM qulay, lekin 'sehr' emas: u qanday SQL yuborayotganini bilish kerak. Dev'da `logging.level.org.hibernate.SQL=DEBUG` yoqib, har bir endpoint qancha query yuborayotganini kuzating.",
          code: `# application-dev.yml — Hibernate yuborayotgan SQL'ni ko'rish
logging:
  level:
    org.hibernate.SQL: DEBUG
    org.hibernate.orm.jdbc.bind: TRACE   # parametr qiymatlari (Hibernate 6)

spring:
  jpa:
    properties:
      hibernate:
        format_sql: true`,
          lang: 'yaml',
        },
        {
          title: "Entity va relationship'lar",
          body: "Entity — database jadvaliga bog'langan class. Talablar: `@Entity`, `@Id`, parametrsiz constructor (`protected` bo'lishi mumkin), `final` bo'lmagan class (Hibernate proxy uchun). Shuning uchun entity'lar Java `record` bo'lolmaydi.\n\nTask-manager'da: bitta User'ning ko'p Board'i, bitta Board'ning ko'p Task'i bor.\n\n- `@ManyToOne` — Task tomonida. Foreign key (`board_id`) aynan `tasks` jadvalida turadi, shuning uchun bu relationship'ning 'egasi' (owning side) — Task\n- `@OneToMany(mappedBy = \"board\")` — Board tomonida, teskari (inverse) tomon. `mappedBy` 'foreign key Task.board maydonida, alohida jadval yaratma' degani\n- `cascade = CascadeType.ALL, orphanRemoval = true` — Board saqlansa/o'chirilsa, uning task'lari ham. Faqat haqiqiy 'ota-bola' munosabatida ishlating\n\nKo'p uchraydigan xatolar:\n\n- `mappedBy`'ni unutish — Hibernate keraksiz `boards_tasks` join jadvalini kutadi\n- Enum'ni `ORDINAL` (default) bilan saqlash — enum tartibi o'zgarsa, eski ma'lumotlar buziladi. Har doim `EnumType.STRING`\n- Lombok `@Data` entity'da — `equals/hashCode/toString` lazy relationship'larni yuklaydi yoki cheksiz rekursiyaga tushadi. `@Getter`/`@Setter` yetarli\n- Ikki tomonlama relationship'da faqat bir tomonni o'rnatish — helper method (`addTask`) bilan ikkalasini sinxron qiling",
          code: `@Entity
@Table(name = "boards")
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id")
    private User owner;

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> tasks = new ArrayList<>();

    protected Board() {}                          // JPA uchun

    public Board(String name, User owner) {
        this.name = name;
        this.owner = owner;
    }

    public void addTask(Task task) {             // ikkala tomonni sinxron qilish
        tasks.add(task);
        task.setBoard(this);
    }
    // getters...
}

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)                  // ORDINAL emas!
    @Column(nullable = false, length = 20)
    private TaskStatus status = TaskStatus.TODO;

    private LocalDate dueDate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)   // default EAGER — LAZY qilamiz
    @JoinColumn(name = "board_id")
    private Board board;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() { createdAt = Instant.now(); }

    protected Task() {}
    // constructor, getters, setters...
}`,
          lang: 'java',
        },
        {
          title: "Repository: derived query, @Query va projection",
          body: "`JpaRepository<Task, Long>` tayyor method'lar beradi: `save`, `saveAll`, `findById`, `findAll(Pageable)`, `existsById`, `deleteById`, `count`.\n\nDerived query — Spring method nomidan query yasaydi: `findByBoardIdAndStatus` → `where board.id = ? and status = ?`. Kalit so'zlar: `And`, `Or`, `OrderBy...Desc`, `Containing`, `IgnoreCase`, `LessThan`, `In`, `existsBy`, `countBy`, `deleteBy`. Nom noto'g'ri bo'lsa, ilova startup'da xato beradi — bu yaxshi.\n\nMethod nomi juda uzun bo'lib ketsa — `@Query` yozing:\n\n- JPQL — entity va maydon nomlari bilan (`Task t`, `t.board.id`), database'ga bog'liq emas\n- Native SQL — `nativeQuery = true`, jadval va ustun nomlari bilan; PostgreSQL'ga xos imkoniyatlar kerak bo'lganda\n- O'zgartiruvchi query'lar (`update`, `delete`) uchun `@Modifying` va transaction kerak\n\nProjection — butun entity emas, faqat kerakli ustunlarni olish. Interface projection (getter'lar) yoki record'ga to'g'ridan-to'g'ri (`select new ...`). Ro'yxat sahifalari va statistikalar uchun tezroq va N+1 xavfisiz.\n\nKo'p uchraydigan xato: SQL'ni string concatenation bilan yig'ish (`\"... where title = '\" + title + \"'\"`) — SQL injection. Har doim parametr (`:title`) ishlating.",
          code: `public interface TaskRepository extends JpaRepository<Task, Long> {

    // Derived queries
    Optional<Task> findByIdAndBoardId(Long id, Long boardId);
    Page<Task> findByBoardIdAndStatus(Long boardId, TaskStatus status, Pageable pageable);
    List<Task> findByBoardIdAndTitleContainingIgnoreCase(Long boardId, String text);
    boolean existsByBoardIdAndTitle(Long boardId, String title);

    // JPQL
    @Query("""
            select t from Task t
            where t.board.owner.id = :userId
              and t.dueDate < :today
              and t.status <> :done
            order by t.dueDate
            """)
    List<Task> findOverdue(@Param("userId") Long userId,
                           @Param("today") LocalDate today,
                           @Param("done") TaskStatus done);

    // Native SQL + interface projection
    @Query(value = """
            select status as status, count(*) as total
            from tasks where board_id = :boardId
            group by status
            """, nativeQuery = true)
    List<StatusCount> countByStatus(@Param("boardId") Long boardId);

    interface StatusCount {
        String getStatus();
        long getTotal();
    }

    // Bulk update
    @Modifying
    @Query("update Task t set t.status = :status where t.board.id = :boardId")
    int updateStatusForBoard(@Param("boardId") Long boardId, @Param("status") TaskStatus status);
}`,
          lang: 'java',
        },
        {
          title: "Persistence context va dirty checking",
          body: "Persistence context — Hibernate'ning transaction ichidagi 'ish xotirasi' (first-level cache). Transaction ichida yuklangan har bir entity shu yerda saqlanadi va kuzatiladi.\n\nEntity holatlari:\n\n- Transient — `new Task(...)`, Hibernate hali bilmaydi\n- Managed — persistence context'da, Hibernate kuzatyapti (findById yoki save'dan keyin)\n- Detached — transaction tugadi, kuzatuv to'xtadi\n- Removed — o'chirishga belgilangan\n\nDirty checking: entity yuklanganda Hibernate uning 'snapshot'ini saqlaydi. Transaction commit bo'lishidan oldin (flush paytida) hozirgi qiymatlarni snapshot bilan solishtiradi va o'zgargan entity'lar uchun avtomatik `UPDATE` yuboradi. Shuning uchun `@Transactional` method ichida managed entity'ga `setTitle(...)` qilsangiz, `save()` chaqirish shart emas.\n\nFirst-level cache: bitta transaction ichida `findById(7)`'ni ikki marta chaqirsangiz, ikkinchisi database'ga bormaydi va o'sha obyektni qaytaradi.\n\nKo'p uchraydigan xato: transaction'siz entity'ni o'zgartirib, 'nega saqlanmadi?' deb hayron bo'lish. Yoki aksincha — faqat o'qish kerak bo'lgan joyda entity setter'ini chaqirib, bilmasdan database'ni o'zgartirib qo'yish. O'qish method'larida `@Transactional(readOnly = true)` ishlating.",
          code: `@Transactional
public TaskResponse update(Long boardId, Long taskId, UpdateTaskRequest req) {
    Task task = taskRepository.findByIdAndBoardId(taskId, boardId)   // managed entity
            .orElseThrow(() -> new NotFoundException("Task " + taskId + " not found"));

    if (req.title() != null)  task.setTitle(req.title());
    if (req.status() != null) task.setStatus(req.status());

    return TaskResponse.from(task);
    // save() yo'q! Commit'dan oldin Hibernate o'zgarishni ko'radi:
    // update tasks set title=?, status=?, ... where id=?
}`,
          lang: 'java',
        },
        {
          title: "Lazy vs eager va N+1 muammosi",
          body: "Fetch type relationship qachon yuklanishini belgilaydi:\n\n- `LAZY` — kerak bo'lganda (getter chaqirilganda). Hibernate o'rniga proxy yoki 'bo'sh' kolleksiya qo'yadi\n- `EAGER` — entity bilan birga darhol\n\nJPA default'lari: `@ManyToOne` va `@OneToOne` — EAGER, `@OneToMany` va `@ManyToMany` — LAZY. Amaliy qoida: hammasini LAZY qiling va kerakli joyda aniq fetch qiling. EAGER'ni keyin 'o'chirib' bo'lmaydi — u har bir query'da qo'shimcha JOIN yoki SELECT beradi.\n\nN+1 muammosi: 1 ta query ro'yxatni oladi, keyin ro'yxatdagi har bir element uchun lazy relationship'ni yuklash uchun yana N ta query. Masalan, foydalanuvchining 20 ta board'i va har birining task soni: 1 + 20 = 21 query. Kichik ma'lumotda sezilmaydi, prod'da esa sahifa sekinlashadi.\n\nYechimlar:\n\n1. `JOIN FETCH` — JPQL'da relationship'ni bitta query'da olish.\n2. `@EntityGraph(attributePaths = \"tasks\")` — derived query'ga ham fetch rejasini qo'shadi.\n3. `spring.jpa.properties.hibernate.default_batch_fetch_size=50` — lazy yuklashni `where board_id in (?, ?, ...)` bilan guruhlab qiladi: N ta emas, N/50 ta query.\n4. DTO projection — faqat kerakli ma'lumotni bitta query bilan olish (masalan, `count` bilan).\n\nKo'p uchraydigan xato: kolleksiyani `JOIN FETCH` qilib, ustiga pagination qo'shish. Hibernate LIMIT'ni SQL'da emas, xotirada qo'llaydi (ogohlantirish beradi) — katta jadvalda xavfli. Bunday holatda batch size yoki ikki bosqichli query ishlating.\n\nIntervyu maslahati: N+1'ni qanday aniqlashni ham ayting: 'I turn on SQL logging in dev and count the queries for each endpoint.'",
          code: `// N+1: 1 query board'lar uchun + har board uchun 1 query task'lar uchun
List<Board> boards = boardRepository.findByOwnerId(userId);
for (Board b : boards) {
    int count = b.getTasks().size();   // lazy load -> select * from tasks where board_id=?
}

public interface BoardRepository extends JpaRepository<Board, Long> {

    // 1-yechim: JOIN FETCH — bitta query
    @Query("select b from Board b left join fetch b.tasks where b.owner.id = :ownerId")
    List<Board> findWithTasksByOwnerId(@Param("ownerId") Long ownerId);

    // 2-yechim: EntityGraph
    @EntityGraph(attributePaths = "tasks")
    List<Board> findByOwnerId(Long ownerId);

    // 4-yechim: faqat kerakli ma'lumot (DTO projection) — eng tejamkor
    @Query("""
            select new uz.dev.taskmanager.board.BoardSummary(b.id, b.name, count(t))
            from Board b left join b.tasks t
            where b.owner.id = :ownerId
            group by b.id, b.name
            """)
    List<BoardSummary> findSummaries(@Param("ownerId") Long ownerId);
}

public record BoardSummary(Long id, String name, long taskCount) {}`,
          lang: 'java',
        },
        {
          title: "Flyway migration'lar va ddl-auto=validate",
          body: "`spring.jpa.hibernate.ddl-auto` Hibernate sxema bilan nima qilishini belgilaydi: `create`, `create-drop`, `update`, `validate`, `none`. `update` qulay ko'rinadi, lekin xavfli: ustunni o'chirmaydi, nomini o'zgartirishni bilmaydi, nima qilganini hech kim ko'rmaydi va prod'da ma'lumotni buzishi mumkin.\n\nTo'g'ri yondashuv — migration'lar. Flyway har bir SQL faylni versiya bilan bir marta, tartib bilan qo'llaydi va natijani `flyway_schema_history` jadvalida saqlaydi. Spring Boot classpath'da Flyway bo'lsa, ilova ishga tushganda migration'larni avtomatik qo'llaydi.\n\n- Fayllar: `src/main/resources/db/migration/V1__init.sql`, `V2__add_task_priority.sql` (ikkita pastki chiziq!)\n- Hibernate faqat tekshiradi: `ddl-auto: validate` — entity va jadval mos kelmasa, ilova ishga tushmaydi\n- Qo'llangan migration faylini hech qachon o'zgartirmang — Flyway checksum'ni tekshiradi va xato beradi. O'zgarish kerak bo'lsa — yangi `V3__...` fayl\n- Sxema o'zgarishlari kod bilan birga git'da saqlanadi va code review'dan o'tadi\n- Flyway 10+ da PostgreSQL uchun qo'shimcha `flyway-database-postgresql` dependency kerak\n\nIntervyu maslahati: 'How do you change the database schema in production?' — 'With versioned Flyway migrations, and Hibernate only validates.'",
          code: `-- src/main/resources/db/migration/V1__init.sql
create table users (
    id            bigserial primary key,
    email         varchar(255) not null unique,
    password_hash varchar(100) not null,
    name          varchar(100) not null,
    role          varchar(20)  not null default 'USER',
    created_at    timestamptz  not null default now()
);

create table boards (
    id       bigserial primary key,
    name     varchar(100) not null,
    owner_id bigint not null references users(id) on delete cascade
);

create table tasks (
    id          bigserial primary key,
    title       varchar(200) not null,
    description text,
    status      varchar(20)  not null default 'TODO',
    due_date    date,
    board_id    bigint not null references boards(id) on delete cascade,
    created_at  timestamptz  not null default now()
);

create index idx_tasks_board_status on tasks(board_id, status);
create index idx_boards_owner on boards(owner_id);

-- V2__add_task_priority.sql (keyingi o'zgarish — yangi fayl)
-- alter table tasks add column priority varchar(10) not null default 'MEDIUM';`,
          lang: 'sql',
        },
      ],
      vocab: [
        { en: 'ORM (Object-Relational Mapping)', uz: "obyektlarni jadvallarga bog'lash" },
        { en: 'entity', uz: "database jadvaliga bog'langan class" },
        { en: 'owning side', uz: "relationship'ning foreign key'ni boshqaruvchi tomoni" },
        { en: 'persistence context', uz: "Hibernate kuzatadigan entity'lar 'xotirasi'" },
        { en: 'dirty checking', uz: "o'zgargan entity'larni avtomatik aniqlab UPDATE qilish" },
        { en: 'lazy loading', uz: "kerak bo'lganda yuklash" },
        { en: 'N+1 problem', uz: "bitta ro'yxat uchun N ta qo'shimcha query muammosi" },
        { en: 'migration', uz: "database sxemasini versiyalab o'zgartirish skripti" },
      ],
      questions: [
        {
          q: "What is the difference between JPA, Hibernate and Spring Data JPA?",
          a: "JPA is a specification: it defines annotations like @Entity and interfaces like EntityManager. Hibernate is an implementation of JPA, so it actually generates SQL and maps rows to objects. Spring Data JPA is a layer on top. I write a repository interface, and Spring creates the implementation for me.",
          uz: "JPA — specification: u @Entity kabi annotation'larni va EntityManager kabi interface'larni belgilaydi. Hibernate — JPA'ning implementatsiyasi, ya'ni u haqiqatda SQL generatsiya qiladi va qatorlarni obyektlarga aylantiradi. Spring Data JPA — ustidagi qatlam. Men repository interface yozaman, Spring esa men uchun implementatsiyani yaratadi.",
          level: 'junior',
        },
        {
          q: "How do you map a one-to-many relationship, for example a board with tasks?",
          a: "On the Task side I use @ManyToOne with @JoinColumn, because the foreign key board_id is in the tasks table. This is the owning side. On the Board side I use @OneToMany with mappedBy equal to board. I make both sides LAZY, and I use a helper method like addTask to keep both sides in sync.",
          uz: "Task tomonida @JoinColumn bilan @ManyToOne ishlataman, chunki board_id foreign key'i tasks jadvalida. Bu owning side. Board tomonida mappedBy = board bilan @OneToMany ishlataman. Ikkala tomonni ham LAZY qilaman va ikkala tomonni sinxron saqlash uchun addTask kabi helper method ishlataman.",
          example: `@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "board_id")
private Board board;          // Task

@OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
private List<Task> tasks = new ArrayList<>();   // Board`,
          level: 'middle',
        },
        {
          q: "What is the N+1 problem and how do you fix it?",
          a: "The N+1 problem happens when one query loads a list, and then each item runs one more query for a lazy relation. So for 20 boards we get 21 queries. I fix it with JOIN FETCH or @EntityGraph to load the data in one query. Another option is batch fetching, or a DTO projection that selects only the needed columns. I find it by turning on SQL logging in dev.",
          uz: "N+1 muammosi bitta query ro'yxatni yuklaganda, keyin har bir element lazy relation uchun yana bitta query bajarganda sodir bo'ladi. Shunda 20 ta board uchun 21 ta query bo'ladi. Men buni ma'lumotni bitta query'da yuklash uchun JOIN FETCH yoki @EntityGraph bilan tuzataman. Boshqa variant — batch fetching yoki faqat kerakli ustunlarni tanlaydigan DTO projection. Uni dev'da SQL logging'ni yoqib topaman.",
          example: `@Query("select b from Board b left join fetch b.tasks where b.owner.id = :ownerId")
List<Board> findWithTasksByOwnerId(@Param("ownerId") Long ownerId);`,
          followUp: 'Why is JOIN FETCH with pagination dangerous?',
          level: 'middle',
        },
        {
          q: "What is the difference between lazy and eager loading?",
          a: "With lazy loading, Hibernate loads a relation only when I access it, for example when I call getTasks. With eager loading, it loads the relation together with the entity. By default @ManyToOne is eager and @OneToMany is lazy. I make everything lazy and load the data I need explicitly, because eager loading often loads too much.",
          uz: "Lazy loading'da Hibernate relation'ni faqat men unga murojaat qilganimda yuklaydi, masalan getTasks'ni chaqirganimda. Eager loading'da u relation'ni entity bilan birga yuklaydi. Default holatda @ManyToOne eager, @OneToMany esa lazy. Men hammasini lazy qilaman va kerakli ma'lumotni aniq yuklayman, chunki eager loading ko'pincha keragidan ko'p yuklaydi.",
          level: 'junior',
        },
        {
          q: "What is dirty checking in Hibernate?",
          a: "When an entity is loaded inside a transaction, it is managed by the persistence context. Hibernate keeps a snapshot of it. Before the commit, it compares the entity with the snapshot and sends an UPDATE for the changed fields. So inside a @Transactional method I can just call a setter, and I do not need to call save.",
          uz: "Entity transaction ichida yuklanganda, uni persistence context boshqaradi. Hibernate uning snapshot'ini saqlaydi. Commit'dan oldin u entity'ni snapshot bilan solishtiradi va o'zgargan maydonlar uchun UPDATE yuboradi. Shuning uchun @Transactional method ichida shunchaki setter chaqirishim mumkin va save'ni chaqirishim shart emas.",
          level: 'middle',
        },
        {
          q: "How do Spring Data derived queries work?",
          a: "Spring reads the method name and builds the query from it. For example, findByBoardIdAndStatus becomes a query with a where clause on board id and status. If the name is wrong, the app fails at startup, which is good. When the name becomes too long or the query is complex, I write @Query with JPQL instead.",
          uz: "Spring method nomini o'qiydi va undan query yasaydi. Masalan, findByBoardIdAndStatus board id va status bo'yicha where shartli query'ga aylanadi. Nom noto'g'ri bo'lsa, ilova startup'da to'xtaydi, bu yaxshi. Nom juda uzun bo'lib ketsa yoki query murakkab bo'lsa, o'rniga JPQL bilan @Query yozaman.",
          level: 'junior',
        },
        {
          q: "When would you use a native query instead of JPQL?",
          a: "JPQL works with entities and is independent of the database, so it is my first choice. I use a native query when I need a database feature that JPQL does not support, like PostgreSQL full-text search or a window function. Native queries are also useful for complex reports. The downside is that they are tied to one database.",
          uz: "JPQL entity'lar bilan ishlaydi va database'ga bog'liq emas, shuning uchun bu mening birinchi tanlovim. JPQL qo'llab-quvvatlamaydigan database imkoniyati kerak bo'lganda native query ishlataman, masalan PostgreSQL full-text search yoki window function. Native query'lar murakkab hisobotlar uchun ham foydali. Kamchiligi — ular bitta database'ga bog'lanib qoladi.",
          level: 'middle',
        },
        {
          q: "How do you manage database schema changes?",
          a: "I use Flyway migrations. Each change is a versioned SQL file, like V1__init.sql and V2__add_priority.sql. Flyway runs new files at startup and stores the history in a table. Hibernate only validates the schema with ddl-auto set to validate. I never edit a migration that was already applied; I add a new one.",
          uz: "Flyway migration'larini ishlataman. Har bir o'zgarish — V1__init.sql va V2__add_priority.sql kabi versiyalangan SQL fayl. Flyway yangi fayllarni startup'da bajaradi va tarixni jadvalda saqlaydi. Hibernate ddl-auto = validate bilan sxemani faqat tekshiradi. Allaqachon qo'llangan migration'ni hech qachon o'zgartirmayman, yangisini qo'shaman.",
          followUp: 'Why is ddl-auto=update dangerous in production?',
          level: 'middle',
        },
        {
          q: "Why should you use EnumType.STRING for enums?",
          a: "The default is ORDINAL, which saves the position of the enum value as a number. If someone adds a new value in the middle or changes the order, the old data gets the wrong meaning. With STRING, the database saves the name, like TODO or DONE. It is safer and easier to read in SQL.",
          uz: "Default — ORDINAL, u enum qiymatining o'rnini son sifatida saqlaydi. Agar kimdir o'rtaga yangi qiymat qo'shsa yoki tartibni o'zgartirsa, eski ma'lumotlar noto'g'ri ma'noga ega bo'lib qoladi. STRING bilan database TODO yoki DONE kabi nomni saqlaydi. Bu xavfsizroq va SQL'da o'qish osonroq.",
          level: 'junior',
        },
      ],
      resources: [
        { title: 'Spring Data JPA — Reference', url: 'https://docs.spring.io/spring-data/jpa/reference/' },
        { title: 'Spring Guides — Accessing Data with JPA', url: 'https://spring.io/guides/gs/accessing-data-jpa' },
        { title: 'Baeldung — Hibernate N+1 Problem', url: 'https://www.baeldung.com/spring-hibernate-n1-problem' },
        { title: 'Spring Boot — Database Initialization (Flyway)', url: 'https://docs.spring.io/spring-boot/how-to/data-initialization.html' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'spring-transactions',
      title: "@Transactional: proxy, rollback, propagation",
      days: [47],
      summary: "@Transactional method ichidagi barcha database amallarini bitta transaction'ga birlashtiradi: yoki hammasi saqlanadi (commit), yoki hech biri (rollback). Spring buni AOP proxy orqali qiladi: bean'ingiz o'rniga proxy inject qilinadi, u method'dan oldin transaction ochadi, keyin commit yoki rollback qiladi. Default holatda faqat RuntimeException va Error rollback qiladi, checked exception esa yo'q. Propagation bir transaction'li method boshqasini chaqirganda nima bo'lishini belgilaydi (REQUIRED, REQUIRES_NEW). Eng mashhur tuzoq — self-invocation: class o'z method'ini this orqali chaqirsa, proxy chetlab o'tiladi va @Transactional ishlamaydi. @Transactional service qatlamiga qo'yiladi.",
      keyPoints: [
        "@Transactional = method boshida begin, oxirida commit, exception bo'lsa rollback",
        "Spring AOP proxy orqali ishlaydi — chaqiruv proxy'dan o'tishi shart",
        "Default rollback: RuntimeException va Error. Checked exception → commit! (rollbackFor bilan o'zgartiriladi)",
        "Propagation REQUIRED (default) — mavjud transaction'ga qo'shiladi; REQUIRES_NEW — alohida yangi transaction",
        "readOnly = true — o'qish method'lari uchun: dirty checking va flush yo'q, tezroq",
        "Self-invocation (this.method()) va private method'larda @Transactional ishlamaydi",
        "LazyInitializationException — transaction (session) yopilgandan keyin lazy relation'ni o'qish",
        "spring.jpa.open-in-view=false tavsiya; @Transactional service'da, controller va repository'da emas",
      ],
      lesson: [
        {
          title: "Transaction nima uchun kerak va @Transactional asoslari",
          body: "Transaction — bir nechta database amalini bitta bo'linmas birlikka aylantiradi (ACID'dagi Atomicity). Misol: yangi board yaratilganda unga uchta default task ham qo'shiladi. Agar ikkinchi task saqlanayotganda xato bo'lsa, yarim yaratilgan board qolmasligi kerak — hammasi bekor qilinadi.\n\nSpring'da buning uchun `@Transactional` yetarli. Method boshlanganda transaction ochiladi, method normal tugasa — commit, exception bilan tugasa — rollback.\n\nAmaliy qoidalar:\n\n- `@Transactional` service qatlamida turadi: bitta biznes operatsiya = bitta transaction\n- Class ustiga `@Transactional(readOnly = true)`, o'zgartiruvchi method'lar ustiga esa `@Transactional` — keng tarqalgan pattern\n- Controller'da emas (HTTP qatlamida transaction ochish connection'ni uzoq band qiladi), repository'da shart emas (Spring Data method'lari o'zi transactional)\n- Transaction ichida sekin ishlarni qilmang: tashqi HTTP API chaqirish, email yuborish. Transaction ochiq turgan butun vaqt davomida database connection band — connection pool tez tugaydi",
          code: `@Service
@Transactional(readOnly = true)            // default: barcha method'lar o'qish uchun
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    @Transactional                          // yozish: readOnly = false
    public BoardResponse create(Long ownerId, CreateBoardRequest req) {
        User owner = userRepository.getReferenceById(ownerId);
        Board board = new Board(req.name(), owner);
        board.addTask(new Task("Read the docs", board));
        board.addTask(new Task("Plan the week", board));
        boardRepository.save(board);        // board + 2 task: yoki hammasi, yoki hech biri
        return BoardResponse.from(board);
    }

    public List<BoardSummary> list(Long ownerId) {   // readOnly transaction
        return boardRepository.findSummaries(ownerId);
    }
}`,
          lang: 'java',
        },
        {
          title: "Ichkarida nima bo'ladi: AOP proxy",
          body: "Spring `@Transactional` bean'ni yaratganda, uning o'rniga proxy obyekt yaratadi (CGLIB orqali — class'ingizdan meros olgan class). Boshqa bean'larga (masalan, controller'ga) aynan shu proxy inject qilinadi.\n\nController `boardService.create(...)` chaqirganda:\n\n1. Chaqiruv avval proxy'ga keladi.\n2. Proxy `TransactionInterceptor` orqali `PlatformTransactionManager`'dan (JPA'da — `JpaTransactionManager`) transaction ochadi: connection oladi, `autocommit=false`, EntityManager'ni joriy thread'ga bog'laydi (ThreadLocal).\n3. Haqiqiy `create(...)` method'ingiz ishlaydi. Ichidagi barcha repository chaqiruvlari o'sha thread'dagi o'sha transaction'ni ishlatadi.\n4. Method normal tugasa — flush (dirty checking) va commit. Exception chiqsa — rollback qoidalariga qarab rollback.\n5. Connection pool'ga qaytariladi.\n\nBu tushuncha uchun muhim: transaction thread'ga bog'langan. Shuning uchun `@Async` yoki yangi thread'da ishlayotgan kod tashqi transaction'ni ko'rmaydi.\n\nXuddi shu proxy mexanizmi `@Cacheable`, `@Async`, `@PreAuthorize` uchun ham ishlaydi — ularning tuzoqlari ham bir xil.",
          code: `// Proxy taxminan shunday ishlaydi (soddalashtirilgan)
public class BoardService$$SpringCGLIB extends BoardService {
    private final BoardService target;
    private final PlatformTransactionManager txManager;

    @Override
    public BoardResponse create(Long ownerId, CreateBoardRequest req) {
        TransactionStatus tx = txManager.getTransaction(new DefaultTransactionDefinition());
        try {
            BoardResponse result = target.create(ownerId, req);   // sizning kodingiz
            txManager.commit(tx);
            return result;
        } catch (RuntimeException | Error e) {
            txManager.rollback(tx);
            throw e;
        }
        // checked exception -> default holatda COMMIT qilinadi!
    }
}`,
          lang: 'java',
        },
        {
          title: "Rollback qoidalari",
          body: "Default qoida: `RuntimeException` (unchecked) va `Error` → rollback. Checked exception (`Exception`'dan meros, lekin `RuntimeException` emas, masalan `IOException`) → commit! Bu EJB davridan qolgan qoida va ko'pchilikni hayron qoldiradi.\n\nO'zgartirish:\n\n- `@Transactional(rollbackFor = Exception.class)` — har qanday exception'da rollback\n- `@Transactional(noRollbackFor = SomeBusinessException.class)` — ma'lum exception'da rollback qilmaslik\n\nKo'p uchraydigan xatolar:\n\n- Exception'ni method ichida `catch` qilib 'yutib' yuborish. Proxy exception'ni ko'rmaydi → commit bo'ladi, yarim ma'lumot saqlanadi\n- Ichki `REQUIRED` method exception tashlasa, transaction 'rollback-only' deb belgilanadi. Tashqi method uni catch qilib, davom etsa ham, oxirida commit o'rniga `UnexpectedRollbackException` chiqadi: 'Transaction silently rolled back because it has been marked as rollback-only'\n\nTavsiya: biznes exception'larni `RuntimeException`'dan meros qiling (`NotFoundException`, `ConflictException`) — ham rollback avtomatik, ham `@RestControllerAdvice` ularni ushlaydi.",
          code: `@Transactional
public void importTasks(Long boardId, MultipartFile file) throws IOException {
    taskRepository.saveAll(parse(file));     // parse() IOException tashlasa -> COMMIT (!)
}

@Transactional(rollbackFor = Exception.class)   // endi IOException'da ham rollback
public void importTasksSafe(Long boardId, MultipartFile file) throws IOException {
    taskRepository.saveAll(parse(file));
}

// YOMON: exception yutilgan -> proxy bilmaydi -> commit
@Transactional
public void moveTask(Long taskId, Long targetBoardId) {
    try {
        Task task = taskRepository.findById(taskId).orElseThrow();
        task.setBoard(boardRepository.findById(targetBoardId).orElseThrow());
        auditService.record(task);           // shu yerda xato bo'lsa...
    } catch (Exception e) {
        log.error("Move failed", e);         // ...task baribir ko'chirilgan holda commit bo'ladi
    }
}`,
          lang: 'java',
        },
        {
          title: "Propagation, readOnly va isolation",
          body: "Propagation — transaction'li method boshqa transaction'li method'ni chaqirganda nima bo'lishi:\n\n- `REQUIRED` (default) — transaction bor bo'lsa, unga qo'shiladi; yo'q bo'lsa, yangisini ochadi. Natijada hammasi bitta transaction: biri yiqilsa, hammasi rollback\n- `REQUIRES_NEW` — tashqi transaction'ni to'xtatib turib, mustaqil yangi transaction ochadi. U o'zi commit bo'ladi, tashqi rollback bo'lsa ham. Misol: audit log yoki 'muvaffaqiyatsiz login urinishi' yozuvi — asosiy operatsiya bekor bo'lsa ham saqlanishi kerak\n- `MANDATORY` — transaction bo'lishi shart, aks holda exception\n- `SUPPORTS`, `NOT_SUPPORTED`, `NEVER`, `NESTED` (savepoint) — kamroq ishlatiladi\n\nE'tibor: `REQUIRES_NEW` ikkinchi database connection oladi. Ko'p ishlatilsa, yuk ostida connection pool tugashi mumkin.\n\n`readOnly = true`: Hibernate dirty checking qilmaydi va flush qilmaydi (snapshot saqlamaydi) — xotira va CPU tejaladi. Ba'zi sozlamalarda o'qish so'rovlarini replica database'ga yo'naltirish uchun ham ishlatiladi.\n\nIsolation — parallel transaction'lar bir-birining o'zgarishlarini qanchalik ko'rishi: `READ_COMMITTED` (PostgreSQL default), `REPEATABLE_READ`, `SERIALIZABLE`. Odatda default'ni o'zgartirmaymiz. 'Ikki foydalanuvchi bir task'ni bir vaqtda tahrirlaydi' muammosi uchun ko'pincha optimistic locking — entity'da `@Version` maydoni — yetarli: ikkinchi saqlash `OptimisticLockException` oladi (API'da 409 qaytaramiz).",
          code: `@Service
@RequiredArgsConstructor
public class AuditService {
    private final AuditLogRepository auditLogRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(String action, Long userId) {
        auditLogRepository.save(new AuditLog(action, userId));  // alohida commit
    }
}

@Entity
public class Task {
    // ...
    @Version
    private Long version;   // optimistic locking: update ... where id=? and version=?
}`,
          lang: 'java',
        },
        {
          title: "Self-invocation tuzog'i",
          body: "Bu intervyuda eng ko'p so'raladigan tuzoq. Class o'z ichidagi `@Transactional` method'ni `this` orqali chaqirsa, chaqiruv proxy'dan o'tmaydi — to'g'ridan-to'g'ri haqiqiy obyektga boradi. Natijada annotation'dagi sozlamalar (yangi transaction, readOnly, rollbackFor) e'tiborsiz qoladi va hech qanday xato yoki ogohlantirish chiqmaydi.\n\nXuddi shu sabab bilan ishlamaydigan holatlar:\n\n- `private` method ustidagi `@Transactional` (proxy uni override qila olmaydi)\n- `final` method yoki `final` class (CGLIB meros ola olmaydi)\n- Obyektni o'zingiz `new` bilan yaratgansiz — u Spring bean emas, proxy yo'q\n\nYechimlar:\n\n1. Eng to'g'risi — method'ni boshqa bean'ga ko'chirish (masalan, `AuditService`), shunda chaqiruv proxy orqali o'tadi.\n2. `@Transactional`'ni tashqi (chaqiruvchi) public method'ga qo'yish, agar bitta transaction yetarli bo'lsa.\n3. `TransactionTemplate` bilan transaction'ni dasturiy boshqarish.\n\nIntervyu maslahati: savolga 'Because @Transactional works through a proxy, and a call through this does not go through the proxy' deb javob bersangiz — bu Spring'ni ichidan tushunishingizni ko'rsatadi.",
          code: `@Service
public class TaskService {

    public void completeAll(List<Long> ids) {
        for (Long id : ids) {
            this.complete(id);       // proxy'dan o'tmaydi -> REQUIRES_NEW ishlamaydi!
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void complete(Long id) { /* ... */ }
}

// Yechim: alohida bean
@Service
@RequiredArgsConstructor
public class TaskBulkService {
    private final TaskService taskService;   // bu proxy

    public void completeAll(List<Long> ids) {
        ids.forEach(taskService::complete);  // proxy orqali -> har biri o'z transaction'ida
    }
}

// Yoki dasturiy: TransactionTemplate
public void completeAll(List<Long> ids) {
    ids.forEach(id -> transactionTemplate.executeWithoutResult(status -> doComplete(id)));
}`,
          lang: 'java',
        },
        {
          title: "Transaction va lazy loading: LazyInitializationException va open-in-view",
          body: "Lazy relationship faqat persistence context (Hibernate session) ochiq bo'lganda yuklana oladi. Session odatda transaction bilan birga yopiladi. Agar transaction tugagandan keyin `task.getBoard().getName()` yoki `board.getTasks()`'ni o'qisangiz — `LazyInitializationException: could not initialize proxy - no Session`.\n\nTipik holat: service entity qaytaradi, controller yoki Jackson uni JSON'ga aylantirayotganda lazy maydonga murojaat qiladi.\n\nSpring Boot'da default holatda `spring.jpa.open-in-view=true` (OSIV) — session butun HTTP request davomida, view/JSON yozilguncha ochiq turadi. Shuning uchun bu xato ko'rinmaydi, lekin muammo yashirinadi:\n\n- Controller va Jackson ichida bilinmagan lazy query'lar — N+1\n- Database connection butun request davomida band\n- Boot buning uchun startup'da WARN chiqaradi\n\nTavsiya: `spring.jpa.open-in-view: false`. Kerakli ma'lumotni service ichida, transaction ichida yuklang (JOIN FETCH, @EntityGraph yoki DTO projection) va controller'ga tayyor DTO qaytaring.\n\nYana bir foydali vosita — commit'dan keyin ishlaydigan event: email yoki push xabarni faqat transaction muvaffaqiyatli commit bo'lgandan keyin yuborish uchun `@TransactionalEventListener(phase = AFTER_COMMIT)`.",
          code: `// Muammo (open-in-view=false bo'lganda)
@Transactional(readOnly = true)
public Task findTask(Long id) {
    return taskRepository.findById(id).orElseThrow();
}
// controller'da: task.getBoard().getName() -> LazyInitializationException

// Yechim: transaction ichida DTO yasash
@Transactional(readOnly = true)
public TaskDetailsResponse findTask(Long id) {
    Task task = taskRepository.findWithBoardById(id)        // @EntityGraph("board")
            .orElseThrow(() -> new NotFoundException("Task " + id + " not found"));
    return TaskDetailsResponse.from(task);                  // board shu yerda o'qiladi
}

// Commit'dan keyin xabar yuborish
@Component
@RequiredArgsConstructor
class TaskAssignedNotifier {
    private final NotificationSender sender;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void on(TaskAssignedEvent e) {
        sender.send(e.assignee(), "New task: " + e.title());
    }
}`,
          lang: 'java',
        },
      ],
      vocab: [
        { en: 'transaction', uz: "bo'linmas amallar to'plami (hammasi yoki hech biri)" },
        { en: 'commit', uz: "o'zgarishlarni tasdiqlab saqlash" },
        { en: 'rollback', uz: "o'zgarishlarni bekor qilish" },
        { en: 'proxy', uz: "asl obyekt o'rnida turib, chaqiruvlarni ushlovchi obyekt" },
        { en: 'propagation', uz: "transaction'ning method'lar orasida tarqalish qoidasi" },
        { en: 'self-invocation', uz: "class o'z method'ini this orqali chaqirishi" },
        { en: 'isolation level', uz: "parallel transaction'lar ajratilish darajasi" },
        { en: 'optimistic locking', uz: "versiya orqali parallel o'zgarishni aniqlash" },
      ],
      questions: [
        {
          q: "How does @Transactional work internally?",
          a: "Spring creates a proxy around the bean, and other beans get this proxy. When a method is called, the proxy starts a transaction using the transaction manager. Then it calls the real method. If the method finishes normally, the proxy commits. If it throws a runtime exception, the proxy rolls back.",
          uz: "Spring bean atrofida proxy yaratadi va boshqa bean'lar shu proxy'ni oladi. Method chaqirilganda proxy transaction manager yordamida transaction boshlaydi. Keyin haqiqiy method'ni chaqiradi. Method normal tugasa, proxy commit qiladi. Agar u runtime exception tashlasa, proxy rollback qiladi.",
          followUp: 'What happens if a method calls another @Transactional method in the same class?',
          level: 'middle',
        },
        {
          q: "Why does @Transactional not work when a method calls another method of the same class?",
          a: "Because @Transactional works through a proxy. When I call this.otherMethod(), the call goes directly to the real object, not through the proxy. So the transaction settings of the second method are ignored, without any error. I fix it by moving the method to another bean, or by using TransactionTemplate.",
          uz: "Chunki @Transactional proxy orqali ishlaydi. this.otherMethod()'ni chaqirganimda, chaqiruv proxy orqali emas, to'g'ridan-to'g'ri haqiqiy obyektga boradi. Shuning uchun ikkinchi method'ning transaction sozlamalari hech qanday xatosiz e'tiborsiz qoladi. Men buni method'ni boshqa bean'ga ko'chirib yoki TransactionTemplate ishlatib tuzataman.",
          level: 'middle',
        },
        {
          q: "Which exceptions cause a rollback by default?",
          a: "By default, Spring rolls back only for unchecked exceptions, which means RuntimeException and Error. For checked exceptions, like IOException, it commits. If I want a rollback for all exceptions, I use rollbackFor = Exception.class. Also, if I catch an exception inside the method and do not rethrow it, there is no rollback.",
          uz: "Default holatda Spring faqat unchecked exception'larda, ya'ni RuntimeException va Error'da rollback qiladi. IOException kabi checked exception'larda commit qiladi. Agar barcha exception'larda rollback kerak bo'lsa, rollbackFor = Exception.class ishlataman. Bundan tashqari, method ichida exception'ni catch qilib, qayta tashlamasam, rollback bo'lmaydi.",
          level: 'middle',
        },
        {
          q: "What is the difference between REQUIRED and REQUIRES_NEW?",
          a: "REQUIRED is the default. If a transaction already exists, the method joins it, so everything commits or rolls back together. REQUIRES_NEW suspends the current transaction and starts a new, independent one. I use it for things like an audit log that must be saved even if the main operation fails. It uses a second database connection, so I do not overuse it.",
          uz: "REQUIRED — default. Agar transaction allaqachon mavjud bo'lsa, method unga qo'shiladi, shuning uchun hammasi birga commit yoki rollback bo'ladi. REQUIRES_NEW joriy transaction'ni to'xtatib turadi va yangi, mustaqil transaction boshlaydi. Men uni asosiy operatsiya muvaffaqiyatsiz bo'lsa ham saqlanishi kerak bo'lgan audit log kabi narsalar uchun ishlataman. U ikkinchi database connection ishlatadi, shuning uchun uni ortiqcha ishlatmayman.",
          level: 'middle',
        },
        {
          q: "Where do you put @Transactional and why?",
          a: "I put it on the service layer, because one business operation should be one transaction. Often I put readOnly = true on the class and plain @Transactional on the methods that write. I do not put it on controllers, because then the database connection stays open for the whole HTTP request. Spring Data repository methods are already transactional.",
          uz: "Men uni service qatlamiga qo'yaman, chunki bitta biznes operatsiya bitta transaction bo'lishi kerak. Ko'pincha class'ga readOnly = true, yozadigan method'larga esa oddiy @Transactional qo'yaman. Uni controller'larga qo'ymayman, chunki unda database connection butun HTTP request davomida ochiq qoladi. Spring Data repository method'lari allaqachon transactional.",
          level: 'junior',
        },
        {
          q: "What is LazyInitializationException and how do you avoid it?",
          a: "It happens when I access a lazy relation after the Hibernate session is closed, for example in the controller after the transaction ended. I avoid it by loading everything I need inside the service transaction, with JOIN FETCH, an entity graph or a DTO projection. Then I return a DTO. I also turn off open-in-view, so these problems do not stay hidden.",
          uz: "U Hibernate session yopilgandan keyin lazy relation'ga murojaat qilganimda sodir bo'ladi, masalan transaction tugagandan keyin controller'da. Men undan kerakli hamma narsani service transaction ichida JOIN FETCH, entity graph yoki DTO projection bilan yuklab qochaman. Keyin DTO qaytaraman. Bu muammolar yashirin qolmasligi uchun open-in-view'ni ham o'chiraman.",
          followUp: 'What is open-in-view and why is it on by default?',
          level: 'middle',
        },
        {
          q: "What does readOnly = true do?",
          a: "It tells Spring and Hibernate that the method only reads data. Hibernate does not keep snapshots for dirty checking and does not flush, so it uses less memory and CPU. It also documents the intent of the method. In some setups it can route the query to a read replica.",
          uz: "U Spring va Hibernate'ga method faqat ma'lumot o'qishini aytadi. Hibernate dirty checking uchun snapshot saqlamaydi va flush qilmaydi, shuning uchun kamroq xotira va CPU ishlatadi. U method maqsadini ham hujjatlashtiradi. Ba'zi sozlamalarda u query'ni read replica'ga yo'naltirishi mumkin.",
          level: 'middle',
        },
        {
          q: "Two users update the same task at the same time. How do you handle it?",
          a: "I use optimistic locking with a @Version field on the entity. Hibernate adds the version to the where clause of the update. If another user already changed the row, the update affects zero rows and Hibernate throws an OptimisticLockException. I return 409 Conflict, and the frontend asks the user to reload the task.",
          uz: "Entity'da @Version maydoni bilan optimistic locking ishlataman. Hibernate update'ning where shartiga versiyani qo'shadi. Agar boshqa foydalanuvchi qatorni allaqachon o'zgartirgan bo'lsa, update nol qatorga ta'sir qiladi va Hibernate OptimisticLockException tashlaydi. Men 409 Conflict qaytaraman, frontend esa foydalanuvchidan task'ni qayta yuklashni so'raydi.",
          level: 'middle',
        },
      ],
      resources: [
        { title: 'Spring Framework — Declarative Transaction Management', url: 'https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative.html' },
        { title: 'Baeldung — Transactions with Spring and JPA', url: 'https://www.baeldung.com/transaction-configuration-with-jpa-and-spring' },
        { title: 'Baeldung — Transaction Propagation and Isolation in Spring', url: 'https://www.baeldung.com/spring-transactional-propagation-isolation' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'spring-security-jwt',
      title: 'Spring Security: filter chain, JWT, CORS, CSRF',
      days: [39, 41],
      summary: "Spring Security — servlet filter'lar zanjiri: har bir request controller'ga yetib borishidan oldin security filter'lardan o'tadi. Authentication 'sen kimsan?' savoliga javob beradi (natija SecurityContextHolder'dagi Authentication obyekti), authorization esa 'senga bu mumkinmi?' (URL qoidalari va @PreAuthorize). Spring Boot 3'da konfiguratsiya SecurityFilterChain bean orqali yoziladi (WebSecurityConfigurerAdapter olib tashlangan). Vue frontend uchun stateless JWT API qilamiz: login endpoint token beradi, OncePerRequestFilter har request'da token'ni tekshiradi. Parollar BCrypt bilan hash qilinadi. CORS frontend'ning boshqa origin'dan murojaat qilishiga ruxsat beradi, CSRF esa token header'da yuborilgani uchun o'chiriladi — lekin cookie ishlatilsa yoqiq qolishi kerak.",
      keyPoints: [
        "Request → DelegatingFilterProxy → FilterChainProxy → SecurityFilterChain → filter'lar → DispatcherServlet",
        "Authentication — kimligini aniqlash (401), authorization — ruxsatni tekshirish (403)",
        "SecurityContextHolder — joriy foydalanuvchining Authentication obyekti (ThreadLocal, har request uchun)",
        "Konfiguratsiya: @Bean SecurityFilterChain + HttpSecurity lambda DSL",
        "UserDetailsService foydalanuvchini yuklaydi, PasswordEncoder (BCrypt) parolni solishtiradi",
        "JWT: login → token; OncePerRequestFilter → Bearer token'ni tekshirib SecurityContext'ga qo'yadi; sessiya STATELESS",
        "AuthenticationEntryPoint → 401, AccessDeniedHandler → 403 (entry point sozlanmasa 401 o'rniga 403 qaytishi mumkin)",
        "CORS: CorsConfigurationSource bean + http.cors(); CSRF: header'dagi JWT uchun o'chiriladi, cookie bo'lsa yoqiq",
        "@EnableMethodSecurity + @PreAuthorize — method darajasidagi ruxsatlar",
      ],
      lesson: [
        {
          title: "Spring Security arxitekturasi: filter chain",
          body: "`spring-boot-starter-security` qo'shilishi bilan hamma endpoint yopiladi va konsolda generatsiya qilingan parol chiqadi — bu auto-configuration. Uni tushunish uchun ichki tuzilishni bilish kerak.\n\nSpring Security — oddiy servlet filter'lar asosida qurilgan:\n\n1. `DelegatingFilterProxy` — Tomcat'ning filter'lari va Spring bean'lari orasidagi ko'prik.\n2. `FilterChainProxy` — request URL'iga mos `SecurityFilterChain`'ni tanlaydi.\n3. `SecurityFilterChain` — tartiblangan filter'lar ro'yxati: `CorsFilter`, `CsrfFilter`, `LogoutFilter`, login filter'lari, bizning `JwtAuthFilter`'imiz, `ExceptionTranslationFilter`, oxirida `AuthorizationFilter`.\n\nAsosiy tushunchalar:\n\n- `Authentication` — 'kim': principal (foydalanuvchi), credentials, authorities (rollar)\n- `SecurityContextHolder` — joriy request'ning `Authentication`'i saqlanadigan joy (ThreadLocal). Request tugaganda tozalanadi\n- `AuthenticationManager` → `DaoAuthenticationProvider` → `UserDetailsService` + `PasswordEncoder` — login/parolni tekshirish zanjiri\n- `AuthorizationFilter` — `authorizeHttpRequests` qoidalarini tekshiradi\n- `ExceptionTranslationFilter` — security exception'larni 401 yoki 403 javobga aylantiradi\n\nMuhim: security filter'lar DispatcherServlet'dan oldin ishlaydi. Token yo'q bo'lsa, request controller'ga umuman yetib bormaydi.",
          code: `HTTP request
  -> DelegatingFilterProxy ("springSecurityFilterChain")
  -> FilterChainProxy
       -> SecurityFilterChain (/api/**)
            CorsFilter                  : CORS va preflight
            CsrfFilter                  : (stateless API'da o'chirilgan)
            JwtAuthFilter               : Bearer token -> SecurityContextHolder
            ExceptionTranslationFilter  : AuthenticationException -> 401, AccessDenied -> 403
            AuthorizationFilter         : permitAll / authenticated / hasRole
  -> DispatcherServlet -> TaskController`,
          lang: 'http',
        },
        {
          title: "SecurityFilterChain konfiguratsiyasi (Spring Boot 3)",
          body: "Spring Security 6 (Boot 3)'da `WebSecurityConfigurerAdapter` yo'q. Konfiguratsiya `SecurityFilterChain` qaytaradigan `@Bean` method'da, lambda DSL bilan yoziladi.\n\nBizning stateless JWT API uchun:\n\n- `csrf` o'chiriladi (sababi pastda)\n- `cors` yoqiladi — `CorsConfigurationSource` bean'ini ishlatadi\n- `SessionCreationPolicy.STATELESS` — server `HttpSession` yaratmaydi, har request token bilan keladi\n- `authorizeHttpRequests` — qoidalar yuqoridan pastga tekshiriladi, birinchi mos kelgani ishlaydi. Shuning uchun aniq qoidalar tepada, `anyRequest()` eng oxirida\n- `addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)` — filter'imizni zanjirga qo'shish\n- `authenticationEntryPoint` — token yo'q yoki noto'g'ri bo'lsa 401\n\nKo'p uchraydigan xato: `hasRole(\"ADMIN\")` va `hasAuthority(\"ADMIN\")` farqini bilmaslik. `hasRole` avtomatik `ROLE_` prefiksini qo'shadi, ya'ni authority `ROLE_ADMIN` bo'lishi kerak.",
          code: `@Configuration
@EnableWebSecurity
@EnableMethodSecurity                 // @PreAuthorize uchun
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/actuator/health").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}`,
          lang: 'java',
        },
        {
          title: "UserDetailsService va BCrypt",
          body: "`UserDetailsService` — Spring Security'ga foydalanuvchini qayerdan topishni aytadi. Bitta method: `loadUserByUsername`. Biz email bo'yicha `UserRepository`'dan qidiramiz va natijani Spring'ning `UserDetails` obyektiga aylantiramiz.\n\nParollar hech qachon ochiq saqlanmaydi. `BCryptPasswordEncoder`:\n\n- Har bir parol uchun tasodifiy salt qo'shadi — bir xil parollar har xil hash beradi\n- Ataylab sekin (cost factor, default 10) — brute-force hujumni qimmatlashtiradi\n- `encode(raw)` — ro'yxatdan o'tishda; `matches(raw, hash)` — login'da (buni `DaoAuthenticationProvider` o'zi qiladi)\n- BCrypt faqat birinchi 72 byte'ni hisobga oladi — shuning uchun `@Size(max = 72)`\n\nKo'p uchraydigan xato: login'da 'bunday email yo'q' va 'parol noto'g'ri' uchun har xil xabar qaytarish. Bu hujumchiga qaysi email'lar ro'yxatdan o'tganini bildiradi. Ikkala holatda ham bitta xabar: 'Invalid email or password'.",
          code: `@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPasswordHash())
                .roles(user.getRole().name())          // -> ROLE_USER / ROLE_ADMIN
                .build();
    }
}

@Service
@RequiredArgsConstructor
public class RegistrationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new ConflictException("Email is already registered");   // -> 409
        }
        String hash = passwordEncoder.encode(req.password());           // $2a$10$...
        userRepository.save(new User(req.email(), hash, req.name(), Role.USER));
    }
}`,
          lang: 'java',
        },
        {
          title: "JWT oqimi: login endpoint token beradi",
          body: "Oqim:\n\n1. Vue `POST /api/auth/login` ga `{ email, password }` yuboradi.\n2. `AuthController` `AuthenticationManager.authenticate(...)` ni chaqiradi — u `UserDetailsService` va `PasswordEncoder` orqali tekshiradi. Xato bo'lsa `BadCredentialsException`.\n3. To'g'ri bo'lsa, `JwtService` imzolangan token yaratadi: `sub` = email, `roles`, `iat`, `exp` (15 daqiqa).\n4. Vue token'ni saqlaydi va har request'ga `Authorization: Bearer <token>` header qo'shadi (axios interceptor).\n5. Server token'ni har safar imzo va muddat bo'yicha tekshiradi — database'ga bormasdan.\n\nJWT imzolangan, lekin shifrlanmagan: payload'ni har kim base64 bilan o'qiy oladi. Unga parol yoki maxfiy ma'lumot qo'ymang. Secret kamida 256 bit (32 byte) bo'lsin va env variable'dan kelsin.\n\nKutubxona: misolda jjwt 0.12 ishlatilgan. Alternativa — `spring-boot-starter-oauth2-resource-server` (Nimbus JWT): u tayyor `BearerTokenAuthenticationFilter` beradi, o'z filter'ingizni yozish shart emas. Intervyuda ikkala variantni bilishingizni aytish foydali.\n\nKo'p uchraydigan xato: `GlobalExceptionHandler`'dagi `@ExceptionHandler(Exception.class)` `BadCredentialsException`'ni ham ushlab, 401 o'rniga 500 qaytaradi. `AuthenticationException` uchun alohida 401 handler qo'shing.",
          code: `@Service
public class JwtService {
    private final SecretKey key;
    private final Duration ttl;

    public JwtService(JwtProperties props) {
        this.key = Keys.hmacShaKeyFor(props.secret().getBytes(StandardCharsets.UTF_8)); // >= 32 byte
        this.ttl = props.accessTokenTtl();
    }

    public String generate(UserDetails user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(user.getUsername())
                .claim("roles", user.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority).toList())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(ttl)))
                .signWith(key)
                .compact();
    }

    /** Imzo yoki muddat noto'g'ri bo'lsa JwtException tashlaydi. */
    public Claims parse(String token) {
        return Jwts.parser().verifyWith(key).build()
                .parseSignedClaims(token).getPayload();
    }
}

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @PostMapping("/login")
    public TokenResponse login(@Valid @RequestBody LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password()));
        String token = jwtService.generate((UserDetails) auth.getPrincipal());
        return new TokenResponse(token, "Bearer");
    }
}

public record TokenResponse(String accessToken, String tokenType) {}`,
          lang: 'java',
        },
        {
          title: "OncePerRequestFilter: token'ni tekshirish",
          body: "`JwtAuthFilter` har bir request'da ishlaydi:\n\n1. `Authorization` header'ni o'qiydi. `Bearer ` bilan boshlanmasa — hech narsa qilmay, zanjirni davom ettiradi (public endpoint bo'lishi mumkin; yopiq bo'lsa, keyinroq `AuthorizationFilter` rad etadi → 401).\n2. Token'ni parse qiladi: imzo va `exp` tekshiriladi.\n3. To'g'ri bo'lsa, `Authentication` obyektini yaratib `SecurityContextHolder`'ga qo'yadi. Endi shu request uchun foydalanuvchi 'authenticated'.\n4. Noto'g'ri yoki muddati o'tgan bo'lsa — context bo'sh qoladi, foydalanuvchi anonim → 401.\n\nNega `OncePerRequestFilter`: bitta request ichida filter bir necha marta chaqirilishi mumkin (forward, error dispatch). Bu class filter bir martagina ishlashini kafolatlaydi. Shuningdek, `@Component` filter'ni Spring Boot servlet zanjiriga ham avtomatik qo'shadi — `OncePerRequestFilter` ikki marta bajarilishdan himoya qiladi.\n\nController'da joriy foydalanuvchini `@AuthenticationPrincipal` bilan olasiz. Biz principal sifatida email qo'ydik.\n\nKo'p uchraydigan xato: filter ichida noto'g'ri token uchun exception tashlab yuborish. Filter'dagi exception `@RestControllerAdvice`'ga yetib bormaydi (u DispatcherServlet'dan oldin) — natijada tushunarsiz 500. Context'ni bo'sh qoldiring, entry point 401 qaytaradi.",
          code: `@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }
        try {
            Claims claims = jwtService.parse(header.substring(7));
            List<?> roles = claims.get("roles", List.class);
            List<SimpleGrantedAuthority> authorities = roles.stream()
                    .map(r -> new SimpleGrantedAuthority(r.toString()))
                    .toList();
            var auth = new UsernamePasswordAuthenticationToken(claims.getSubject(), null, authorities);
            SecurityContextHolder.getContext().setAuthentication(auth);
        } catch (JwtException | IllegalArgumentException e) {
            SecurityContextHolder.clearContext();     // anonim qoladi -> 401
        }
        chain.doFilter(request, response);
    }
}

// Controller'da joriy foydalanuvchi
@GetMapping("/api/boards")
public List<BoardSummary> myBoards(@AuthenticationPrincipal String email) {
    return boardService.listFor(email);
}`,
          lang: 'java',
        },
        {
          title: "401 va 403, method security",
          body: "`ExceptionTranslationFilter` security exception'larni javobga aylantiradi:\n\n- Foydalanuvchi aniqlanmagan (token yo'q, noto'g'ri, muddati o'tgan) → `AuthenticationEntryPoint` → 401 Unauthorized\n- Foydalanuvchi aniqlangan, lekin ruxsat yo'q (USER `/api/admin`'ga kirmoqchi) → `AccessDeniedHandler` → 403 Forbidden\n\nKo'p uchraydigan xato: `formLogin` va `httpBasic` o'chirilgan stateless API'da entry point sozlanmasa, Spring default holatda `Http403ForbiddenEntryPoint` ishlatadi — ya'ni token yo'q bo'lsa ham 403 qaytadi. Vue frontend esa 401'ni kutib, foydalanuvchini login sahifasiga yuboradi. Shuning uchun `HttpStatusEntryPoint(UNAUTHORIZED)` yoki o'z JSON entry point'ingizni yozing.\n\nMethod security: URL qoidalari bilan ifodalash qiyin bo'lgan ruxsatlar uchun. `@EnableMethodSecurity` yoqilgandan keyin:\n\n- `@PreAuthorize(\"hasRole('ADMIN')\")` — rol bo'yicha\n- `@PreAuthorize(\"@boardAccess.isOwner(#boardId, authentication)\")` — o'z bean'ingiz orqali biznes qoida: 'faqat board egasi uning task'larini ko'ra oladi'\n\nBu ham AOP proxy orqali ishlaydi — self-invocation tuzog'i bu yerda ham bor.\n\nMaslahat: boshqa foydalanuvchining resursiga murojaat qilinganda ba'zi jamoalar 403 o'rniga 404 qaytaradi — resurs mavjudligini ham oshkor qilmaslik uchun. Eng oddiy usul — query'ning o'zida egalikni tekshirish: `findByIdAndOwnerId(boardId, userId)`.",
          code: `@Component("boardAccess")
@RequiredArgsConstructor
public class BoardAccess {
    private final BoardRepository boardRepository;

    public boolean isOwner(Long boardId, Authentication auth) {
        return boardRepository.existsByIdAndOwnerEmail(boardId, auth.getName());
    }
}

@RestController
@RequestMapping("/api/boards/{boardId}/tasks")
@RequiredArgsConstructor
public class TaskController {

    @GetMapping
    @PreAuthorize("@boardAccess.isOwner(#boardId, authentication)")   // aks holda 403
    public Page<TaskResponse> list(@PathVariable Long boardId, Pageable pageable) { ... }
}

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { ... }
}`,
          lang: 'java',
        },
        {
          title: "CORS, CSRF va refresh token",
          body: "CORS: Vue dev server `http://localhost:5173`'da, API esa `http://localhost:8080`'da — bu turli origin'lar, brauzer javobni bloklaydi. Spring Security'da CORS `CorsConfigurationSource` bean va `http.cors(...)` bilan sozlanadi. Nega security ichida: brauzer avval Authorization header'siz `OPTIONS` preflight yuboradi. Agar CORS security'dan keyin ishlasa, preflight 401 oladi va haqiqiy request umuman yuborilmaydi. `http.cors()` `CorsFilter`'ni zanjirning boshiga qo'yadi.\n\nCORS qoidalari: `allowedOrigins`'ga aniq domenlarni yozing (`*` emas, ayniqsa `allowCredentials=true` bilan — Spring bunga ruxsat ham bermaydi). Dev'da Vite proxy ishlatib, CORS'dan umuman qochish ham mumkin.\n\nCSRF: hujum brauzer cookie'ni avtomatik yuborishiga asoslanadi — boshqa sayt foydalanuvchi nomidan so'rov yuboradi va brauzer session cookie'ni o'zi qo'shib yuboradi. Bizning JWT `Authorization` header'da, uni brauzer avtomatik qo'shmaydi va boshqa sayt uni o'qiy olmaydi. Shuning uchun stateless JWT API'da CSRF o'chiriladi.\n\nCSRF yoqiq qolishi kerak, agar: session cookie ishlatilsa (form login), yoki token/refresh token cookie'da saqlansa. Bu holatda `CookieCsrfTokenRepository` + `SameSite` cookie ishlatiladi.\n\nRefresh token (qisqacha): access token qisqa (5–15 daqiqa), refresh token uzoq (7–30 kun). Refresh token odatda `HttpOnly; Secure; SameSite=Strict` cookie'da turadi (JavaScript o'qiy olmaydi — XSS'dan himoya), database'da hash ko'rinishida saqlanadi, har ishlatilganda yangisiga almashtiriladi (rotation) va logout'da bekor qilinadi. `POST /api/auth/refresh` yangi access token beradi. Bu endpoint cookie bilan ishlagani uchun uni CSRF'dan himoya qilish kerak (SameSite=Strict yoki CSRF token).\n\nIntervyu maslahati: 'Why did you disable CSRF?' — 'Because the API is stateless and the token is sent in a header, not in a cookie. If I used cookies, I would keep CSRF protection on.'",
          code: `@Bean
CorsConfigurationSource corsConfigurationSource(
        @Value("\${app.cors.allowed-origins}") List<String> allowedOrigins) {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(allowedOrigins);              // http://localhost:5173, https://tasks.example.uz
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    config.setAllowCredentials(true);                      // faqat refresh cookie kerak bo'lsa
    config.setMaxAge(3600L);                               // preflight natijasi 1 soat cache

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/api/**", config);
    return source;
}

// Refresh token cookie'si
ResponseCookie cookie = ResponseCookie.from("refresh_token", refreshToken)
        .httpOnly(true).secure(true).sameSite("Strict")
        .path("/api/auth/refresh").maxAge(Duration.ofDays(14))
        .build();
return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(new TokenResponse(accessToken, "Bearer"));`,
          lang: 'java',
        },
      ],
      vocab: [
        { en: 'authentication', uz: 'kimligini tasdiqlash' },
        { en: 'authorization', uz: 'ruxsatni tekshirish' },
        { en: 'filter chain', uz: "request o'tadigan filter'lar zanjiri" },
        { en: 'principal', uz: 'joriy foydalanuvchi (kim)' },
        { en: 'authority / role', uz: 'huquq / rol' },
        { en: 'stateless', uz: 'server sessiya saqlamaydigan' },
        { en: 'hash', uz: "bir tomonlama o'girilgan qiymat (parol uchun)" },
        { en: 'preflight request', uz: "CORS uchun oldindan yuboriladigan OPTIONS so'rov" },
      ],
      questions: [
        {
          q: "How does Spring Security work?",
          a: "Spring Security is a chain of servlet filters that runs before the DispatcherServlet. Each filter has one job, like CORS, reading the token, or checking access rules. When a user is authenticated, Spring puts an Authentication object into the SecurityContextHolder. At the end, the authorization filter checks the rules. If something fails, the ExceptionTranslationFilter returns 401 or 403.",
          uz: "Spring Security — DispatcherServlet'dan oldin ishlaydigan servlet filter'lar zanjiri. Har bir filter'ning bitta vazifasi bor: CORS, token'ni o'qish yoki ruxsat qoidalarini tekshirish. Foydalanuvchi authenticated bo'lganda Spring SecurityContextHolder'ga Authentication obyektini qo'yadi. Oxirida authorization filter qoidalarni tekshiradi. Biror narsa o'tmasa, ExceptionTranslationFilter 401 yoki 403 qaytaradi.",
          followUp: 'Where do you add your JWT filter in the chain?',
          level: 'middle',
        },
        {
          q: "How do you configure Spring Security in Spring Boot 3?",
          a: "I create a @Bean method that returns a SecurityFilterChain. WebSecurityConfigurerAdapter was removed, so I use the HttpSecurity lambda DSL. In it, I set the URL rules, the session policy, CORS and CSRF, and I add my JWT filter. I also define a PasswordEncoder bean with BCrypt.",
          uz: "SecurityFilterChain qaytaradigan @Bean method yarataman. WebSecurityConfigurerAdapter olib tashlangan, shuning uchun HttpSecurity lambda DSL ishlataman. Unda URL qoidalari, session siyosati, CORS va CSRF'ni sozlayman va JWT filter'imni qo'shaman. BCrypt bilan PasswordEncoder bean'ini ham e'lon qilaman.",
          example: `@Bean
SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
        .csrf(csrf -> csrf.disable())
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(a -> a
            .requestMatchers("/api/auth/**").permitAll()
            .anyRequest().authenticated())
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
        .build();
}`,
          level: 'middle',
        },
        {
          q: "Explain the JWT authentication flow in your Spring Boot app.",
          a: "The user sends the email and password to the login endpoint. The AuthenticationManager checks them with my UserDetailsService and BCrypt. If they are correct, I create a signed JWT with the email, the roles and a short expiry time. The Vue app sends it in the Authorization header. A OncePerRequestFilter validates the token on every request and puts the user into the SecurityContextHolder.",
          uz: "Foydalanuvchi email va parolni login endpoint'iga yuboradi. AuthenticationManager ularni mening UserDetailsService'im va BCrypt bilan tekshiradi. To'g'ri bo'lsa, email, rollar va qisqa amal qilish muddati bilan imzolangan JWT yarataman. Vue ilovasi uni Authorization header'da yuboradi. OncePerRequestFilter har request'da token'ni tekshiradi va foydalanuvchini SecurityContextHolder'ga qo'yadi.",
          level: 'middle',
        },
        {
          q: "How do you store passwords?",
          a: "I never store plain passwords. I hash them with BCrypt through Spring's PasswordEncoder. BCrypt adds a random salt to each password and is slow on purpose, so brute-force attacks are expensive. At login, Spring uses the matches method to compare the password with the hash.",
          uz: "Men hech qachon ochiq parollarni saqlamayman. Ularni Spring'ning PasswordEncoder'i orqali BCrypt bilan hash qilaman. BCrypt har bir parolga tasodifiy salt qo'shadi va ataylab sekin ishlaydi, shuning uchun brute-force hujumlari qimmatga tushadi. Login paytida Spring parolni hash bilan solishtirish uchun matches method'ini ishlatadi.",
          level: 'junior',
        },
        {
          q: "When does Spring Security return 401 and when 403?",
          a: "It returns 401 when the user is not authenticated, for example the token is missing or expired. This comes from the AuthenticationEntryPoint. It returns 403 when the user is authenticated but has no permission, for example a normal user calls an admin endpoint. This comes from the AccessDeniedHandler. In a stateless API I set the entry point myself, because otherwise Spring can return 403 for a missing token.",
          uz: "Foydalanuvchi authenticated bo'lmaganda, masalan token yo'q yoki muddati o'tgan bo'lsa, 401 qaytaradi. Bu AuthenticationEntryPoint'dan keladi. Foydalanuvchi authenticated, lekin ruxsati yo'q bo'lsa, masalan oddiy foydalanuvchi admin endpoint'ini chaqirsa, 403 qaytaradi. Bu AccessDeniedHandler'dan keladi. Stateless API'da entry point'ni o'zim sozlayman, aks holda Spring token yo'qligi uchun 403 qaytarishi mumkin.",
          level: 'middle',
        },
        {
          q: "Why do you disable CSRF in a JWT API? Is it always safe?",
          a: "A CSRF attack works because the browser sends cookies automatically to the server. In my API the JWT is in the Authorization header, and the browser does not add it automatically. So another website cannot make an authenticated request, and CSRF protection is not needed. But if I keep the token or a session in a cookie, I must keep CSRF protection on.",
          uz: "CSRF hujumi brauzer cookie'larni server'ga avtomatik yuborgani uchun ishlaydi. Mening API'imda JWT Authorization header'da, brauzer esa uni avtomatik qo'shmaydi. Shuning uchun boshqa sayt authenticated request yubora olmaydi va CSRF himoyasi kerak emas. Lekin agar token yoki session'ni cookie'da saqlasam, CSRF himoyasini yoqiq qoldirishim shart.",
          level: 'middle',
        },
        {
          q: "How do you configure CORS for a Vue frontend in Spring Security?",
          a: "I create a CorsConfigurationSource bean with the exact frontend origins, the allowed methods and headers like Authorization. Then I call http.cors in the security config. This is important, because the browser sends an OPTIONS preflight request without a token. If CORS is not handled inside Spring Security, the preflight gets 401 and the real request fails.",
          uz: "Aniq frontend origin'lari, ruxsat etilgan method'lar va Authorization kabi header'lar bilan CorsConfigurationSource bean yarataman. Keyin security config'da http.cors'ni chaqiraman. Bu muhim, chunki brauzer token'siz OPTIONS preflight request yuboradi. Agar CORS Spring Security ichida qayta ishlanmasa, preflight 401 oladi va haqiqiy request muvaffaqiyatsiz bo'ladi.",
          level: 'middle',
        },
        {
          q: "How do you check that a user can access only their own boards?",
          a: "I check ownership in the service or in the query itself. For example, I use findByIdAndOwnerId, so another user's board is simply not found and returns 404. Another way is @PreAuthorize with a custom bean, like boardAccess.isOwner. I do not trust the user id from the request body; I always take it from the SecurityContext.",
          uz: "Egalikni service'da yoki query'ning o'zida tekshiraman. Masalan, findByIdAndOwnerId ishlataman, shunda boshqa foydalanuvchining board'i shunchaki topilmaydi va 404 qaytadi. Boshqa usul — boardAccess.isOwner kabi o'z bean'im bilan @PreAuthorize. Request body'dan kelgan user id'ga ishonmayman; uni har doim SecurityContext'dan olaman.",
          level: 'middle',
        },
        {
          q: "What is a refresh token and how do you use it?",
          a: "The access token lives a short time, for example 15 minutes, so a stolen token is not useful for long. The refresh token lives longer and is used only to get a new access token. I keep it in an HttpOnly, Secure cookie, so JavaScript cannot read it. On the server I store its hash, rotate it on every use, and delete it on logout.",
          uz: "Access token qisqa vaqt yashaydi, masalan 15 daqiqa, shuning uchun o'g'irlangan token uzoq vaqt foydali bo'lmaydi. Refresh token uzoqroq yashaydi va faqat yangi access token olish uchun ishlatiladi. Men uni HttpOnly, Secure cookie'da saqlayman, shunda JavaScript uni o'qiy olmaydi. Server'da uning hash'ini saqlayman, har ishlatilganda almashtiraman va logout'da o'chiraman.",
          level: 'middle',
        },
      ],
      resources: [
        { title: 'Spring Security — Servlet Architecture', url: 'https://docs.spring.io/spring-security/reference/servlet/architecture.html' },
        { title: 'Spring Security — CORS', url: 'https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html' },
        { title: 'Spring Security — Method Security', url: 'https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html' },
        { title: 'Spring Guides — Securing a Web Application', url: 'https://spring.io/guides/gs/securing-web' },
      ],
    },

    // ─────────────────────────────────────────────
    {
      id: 'spring-testing',
      title: 'Spring Boot ilovasini test qilish',
      days: [41, 76],
      summary: "Spring ilovasida testlar piramida shaklida bo'ladi: ko'p tez unit test (Spring'siz, Mockito bilan), o'rtacha miqdorda slice test (@WebMvcTest — faqat web qatlami, @DataJpaTest — faqat JPA qatlami) va oz sonli to'liq integration test (@SpringBootTest). MockMvc HTTP request'ni haqiqiy server'siz simulyatsiya qiladi: status, header va JSON'ni tekshirasiz. Security'ni @WithMockUser bilan test qilasiz. Repository testlari H2 emas, haqiqiy PostgreSQL'da — Testcontainers Docker'da vaqtinchalik database ko'taradi. Intervyuda 'Qanday test yozasiz?' savoliga aniq misol bilan javob berish juda kuchli taassurot qoldiradi.",
      keyPoints: [
        "Unit test: JUnit 5 + Mockito + AssertJ, Spring context yo'q — millisekundlarda ishlaydi",
        "@WebMvcTest(TaskController.class) — faqat controller, advice, filter'lar; service'lar mock qilinadi",
        "MockMvc: perform(post(...)) → andExpect(status().isCreated()), jsonPath(\"$.id\")",
        "@MockitoBean (Boot 3.4+) / @MockBean (eski, 3.4'dan deprecated) — context ichidagi bean'ni mock bilan almashtirish",
        "@DataJpaTest — faqat JPA qatlami, har test oxirida rollback",
        "Testcontainers + @ServiceConnection — testda haqiqiy PostgreSQL (Docker)",
        "@SpringBootTest — butun ilova; eng sekin, faqat asosiy oqimlar uchun",
        "Security: @WithMockUser(roles = \"ADMIN\"); token'siz request → 401 ekanini ham tekshiring",
      ],
      lesson: [
        {
          title: "Test piramidasi Spring ilovada",
          body: "Har xil test har xil narsani tekshiradi va har xil narxga ega:\n\n- Unit test (ko'p) — bitta class, masalan `TaskService`, dependency'lari mock. Spring ishga tushmaydi, juda tez. Biznes qoidalarni tekshiradi: 'board topilmasa NotFoundException'\n- Slice test (o'rtacha) — Spring'ning faqat bitta qatlami. `@WebMvcTest`: URL mapping, JSON, validation, status code'lar, security qoidalari. `@DataJpaTest`: query'lar, mapping, constraint'lar\n- Integration test (oz) — `@SpringBootTest`: butun ilova + haqiqiy database. 'Register → login → board yaratish → task qo'shish' kabi asosiy oqimlar\n- E2E (juda oz) — Vue + API birga (Playwright/Cypress)\n\nNega hammasini `@SpringBootTest` bilan yozmaymiz: har biri butun context'ni ko'taradi — sekin, xato qayerda ekanini topish qiyin.\n\nSpring context caching: bir xil konfiguratsiyali testlar bitta context'ni qayta ishlatadi. Har xil `@MockitoBean` to'plami yoki `@DirtiesContext` yangi context yaratadi — test suite sekinlashadi. Integration testlar uchun umumiy base class foydali.\n\nTest nomi va tuzilishi: `create_returns400_whenTitleIsBlank` — nima va qachon. Ichida Arrange–Act–Assert (Given–When–Then).",
          code: `# pom.xml'dagi test dependency'lari
# spring-boot-starter-test     -> JUnit 5, Mockito, AssertJ, MockMvc, JsonPath
# spring-security-test         -> @WithMockUser, csrf(), jwt()
# spring-boot-testcontainers   -> @ServiceConnection
# org.testcontainers:postgresql, org.testcontainers:junit-jupiter

# Ishga tushirish
./mvnw test                                  # barcha testlar
./mvnw test -Dtest=TaskControllerTest        # bitta class
./mvnw verify                                # test + integration (CI'da)`,
          lang: 'bash',
        },
        {
          title: "Unit test: service'ni Mockito bilan",
          body: "Constructor injection'ning foydasi aynan shu yerda ko'rinadi: `TaskService`'ni Spring'siz yaratamiz va mock'larni beramiz.\n\n- `@ExtendWith(MockitoExtension.class)` — Mockito'ni JUnit 5'ga ulaydi\n- `@Mock` — soxta obyekt; `when(...).thenReturn(...)` bilan xulqini belgilaymiz\n- `@InjectMocks` — mock'larni constructor orqali beradi\n- `verify(...)` — method chaqirilgan/chaqirilmaganini tekshirish\n- `ArgumentCaptor` — mock'ga nima berilganini ushlab olish\n- AssertJ (`assertThat`, `assertThatThrownBy`) — o'qilishi oson assertion'lar\n\nKo'p uchraydigan xato: hamma narsani mock qilish va faqat `verify` qilish — bunday test kodni emas, implementatsiya detallarini tekshiradi va har refactoring'da sinadi. Natijani (qaytgan qiymat, exception) tekshirishga harakat qiling.",
          code: `@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock TaskRepository taskRepository;
    @Mock BoardRepository boardRepository;
    @InjectMocks TaskService taskService;

    @Test
    void create_throwsNotFound_whenBoardDoesNotExist() {
        when(boardRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.create(99L, new CreateTaskRequest("Title", null, null)))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("99");

        verify(taskRepository, never()).save(any());
    }

    @Test
    void create_savesTaskOnTheBoard() {
        Board board = new Board("Work", new User("ali@test.uz", "hash", "Ali", Role.USER));
        when(boardRepository.findById(3L)).thenReturn(Optional.of(board));
        when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

        TaskResponse result = taskService.create(3L, new CreateTaskRequest("Write tests", null, null));

        ArgumentCaptor<Task> saved = ArgumentCaptor.forClass(Task.class);
        verify(taskRepository).save(saved.capture());
        assertThat(saved.getValue().getBoard()).isSameAs(board);
        assertThat(result.title()).isEqualTo("Write tests");
        assertThat(result.status()).isEqualTo(TaskStatus.TODO);
    }
}`,
          lang: 'java',
        },
        {
          title: "@WebMvcTest + MockMvc: POST 201 va 400",
          body: "`@WebMvcTest(TaskController.class)` faqat web qatlamini ko'taradi: ko'rsatilgan controller, `@RestControllerAdvice`, Jackson, validation, `Filter` bean'lari va Spring Security. `@Service` va `@Repository`'lar yuklanmaydi — ularni mock bilan almashtirasiz.\n\nMock bean'lar: Spring Boot 3.4+ da `@MockitoBean` (`org.springframework.test.context.bean.override.mockito`), undan oldingi versiyalarda `@MockBean` (3.4'dan deprecated). Loyihangizdagi versiyaga qarang.\n\nMockMvc haqiqiy HTTP server ochmaydi: request DispatcherServlet'ga to'g'ridan-to'g'ri beriladi, lekin butun zanjir (filter'lar, binding, validation, advice, JSON) ishlaydi. Shuning uchun tez va ishonchli.\n\nSecurity: `@WebMvcTest` sizning `SecurityConfig`'ingizni avtomatik yuklamaydi — `@Import(SecurityConfig.class)` qo'shing, aks holda Spring Boot'ning default qoidalari (CSRF yoqiq, form login) ishlaydi va POST testlari kutilmagan 403 beradi. Config'ga kerak bo'lgan bean'larni (`JwtService`) ham mock qiling.\n\nNimalarni tekshiramiz:\n\n- To'g'ri request → 201, `Location` header, JSON body\n- Noto'g'ri body → 400, `errors.title` bor va service umuman chaqirilmagan\n- Token'siz → 401",
          code: `@WebMvcTest(TaskController.class)
@Import(SecurityConfig.class)
class TaskControllerTest {

    @Autowired MockMvc mockMvc;

    @MockitoBean TaskService taskService;   // Boot < 3.4: @MockBean
    @MockitoBean JwtService jwtService;     // JwtAuthFilter'ga kerak

    @Test
    @WithMockUser
    void create_returns201WithLocation() throws Exception {
        var created = new TaskResponse(42L, "Write tests", null, TaskStatus.TODO,
                null, 3L, Instant.parse("2026-01-10T10:00:00Z"));
        when(taskService.create(eq(3L), any(CreateTaskRequest.class))).thenReturn(created);

        mockMvc.perform(post("/api/boards/3/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title": "Write tests"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", endsWith("/api/boards/3/tasks/42")))
                .andExpect(jsonPath("$.id").value(42))
                .andExpect(jsonPath("$.status").value("TODO"));
    }

    @Test
    @WithMockUser
    void create_returns400_whenTitleIsBlank() throws Exception {
        mockMvc.perform(post("/api/boards/3/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title": "   "}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.title").exists());

        verifyNoInteractions(taskService);    // controller'gacha yetib bormadi
    }

    @Test
    void create_returns401_withoutToken() throws Exception {
        mockMvc.perform(post("/api/boards/3/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\\"title\\": \\"Write tests\\"}"))
                .andExpect(status().isUnauthorized());
    }
}`,
          lang: 'java',
        },
        {
          title: "Security'ni test qilish",
          body: "`spring-security-test` testlarda foydalanuvchini 'soxtalashtirish' imkonini beradi:\n\n- `@WithMockUser` — SecurityContext'ga username `user`, rol `USER` bo'lgan foydalanuvchi qo'yiladi\n- `@WithMockUser(username = \"ali@test.uz\", roles = \"ADMIN\")` — aniq foydalanuvchi va rol\n- `.with(user(\"ali@test.uz\").roles(\"USER\"))` — bitta request uchun (MockMvc request post-processor)\n- `.with(jwt())` — agar OAuth2 resource server ishlatilsa\n- `.with(csrf())` — CSRF yoqiq bo'lgan ilovalarda POST/PUT/DELETE uchun\n\nSecurity uchun minimal test to'plami:\n\n- Public endpoint (`/api/auth/login`) token'siz ishlaydi\n- Yopiq endpoint token'siz → 401\n- Oddiy USER admin endpoint'iga → 403\n- ADMIN → 2xx\n\nBu testlar kimdir `SecurityConfig`'dagi qoidani tasodifan o'zgartirib yuborsa, darhol ushlaydi.\n\nHaqiqiy JWT oqimini (login → token → so'rov) esa `@SpringBootTest` integration testida bir marta tekshirish yetarli.",
          code: `@WebMvcTest(AdminUserController.class)
@Import(SecurityConfig.class)
class AdminUserControllerTest {

    @Autowired MockMvc mockMvc;
    @MockitoBean AdminUserService adminUserService;
    @MockitoBean JwtService jwtService;

    @Test
    void delete_returns401_whenNotLoggedIn() throws Exception {
        mockMvc.perform(delete("/api/admin/users/5"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "USER")
    void delete_returns403_forNormalUser() throws Exception {
        mockMvc.perform(delete("/api/admin/users/5"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void delete_returns204_forAdmin() throws Exception {
        mockMvc.perform(delete("/api/admin/users/5"))
                .andExpect(status().isNoContent());
        verify(adminUserService).delete(5L);
    }
}`,
          lang: 'java',
        },
        {
          title: "@DataJpaTest va Testcontainers: haqiqiy PostgreSQL",
          body: "`@DataJpaTest` faqat JPA qatlamini ko'taradi: entity'lar, repository'lar, Flyway, `TestEntityManager`. Har bir test transaction ichida ishlaydi va oxirida rollback bo'ladi — testlar bir-biriga ta'sir qilmaydi.\n\nDefault holatda `@DataJpaTest` haqiqiy DataSource'ni in-memory database (H2) bilan almashtirishga harakat qiladi. Lekin H2 — PostgreSQL emas: boshqa SQL dialekti, boshqa tiplar (`timestamptz`, `jsonb`), native query'lar va Flyway migration'lari H2'da boshqacha ishlashi yoki umuman ishlamasligi mumkin. 'Testda o'tdi, prod'da yiqildi' holatining klassik sababi.\n\nTestcontainers yechimi: test boshlanganda Docker'da haqiqiy `postgres:16` container ko'tariladi, testlar tugagach o'chiriladi. Spring Boot 3.1+ dagi `@ServiceConnection` container'ning URL, username va parolini avtomatik `spring.datasource.*` ga ulaydi. `@AutoConfigureTestDatabase(replace = NONE)` — 'DataSource'ni H2 bilan almashtirma' degani.\n\nTalab: kompyuterda (va CI'da) Docker ishlab turishi kerak. Container'ni `static` qilsangiz, class'dagi barcha testlar uchun bitta container ishlatiladi.\n\nNimalarni repository testida tekshirish kerak: o'zingiz yozgan `@Query`'lar, murakkab derived query'lar, projection'lar, constraint'lar (unique email). `save` va `findById` kabi Spring Data'ning tayyor method'larini test qilish shart emas.",
          code: `@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class TaskRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired TaskRepository taskRepository;
    @Autowired TestEntityManager em;

    @Test
    void findByBoardIdAndStatus_returnsOnlyMatchingTasks() {
        User owner = em.persist(new User("ali@test.uz", "hash", "Ali", Role.USER));
        Board board = em.persist(new Board("Work", owner));
        Task todo = em.persist(new Task("Write tests", board));
        Task done = new Task("Deploy", board);
        done.setStatus(TaskStatus.DONE);
        em.persist(done);
        em.flush();

        Page<Task> page = taskRepository.findByBoardIdAndStatus(
                board.getId(), TaskStatus.TODO, PageRequest.of(0, 10));

        assertThat(page.getContent()).extracting(Task::getId).containsExactly(todo.getId());
    }
}`,
          lang: 'java',
        },
        {
          title: "@SpringBootTest: to'liq integration test",
          body: "`@SpringBootTest` butun ApplicationContext'ni ko'taradi — barcha bean'lar, haqiqiy security, haqiqiy service va repository'lar. `@AutoConfigureMockMvc` bilan MockMvc orqali so'rov yuborasiz; yoki `webEnvironment = RANDOM_PORT` bilan haqiqiy port'da server ochib, `TestRestTemplate`/`RestClient` ishlatasiz.\n\nBu test eng qimmat, shuning uchun faqat eng muhim oqimlar uchun yoziladi: masalan 'ro'yxatdan o'tish → login → board yaratish → task qo'shish → ro'yxatda ko'rinadi'. Bu bitta test butun zanjir (Security + JWT + validation + JPA + Flyway + PostgreSQL) birga ishlashini isbotlaydi.\n\nE'tibor bering: `@SpringBootTest` testlari default holatda transaction ichida ishlamaydi va rollback qilinmaydi — yozilgan ma'lumot database'da qoladi. Test class'iga `@Transactional` qo'shish MockMvc bilan ishlaydi, lekin `RANDOM_PORT`'da so'rov boshqa thread'da bajarilgani uchun rollback bo'lmaydi. Testlar bir-biriga xalaqit bermasligi uchun har test o'z ma'lumotini yaratsin (unikal email) yoki `@BeforeEach`'da tozalang.\n\nIntervyu maslahati: 'How do you test your Spring Boot app?' — 'Unit tests for services with Mockito, @WebMvcTest for controllers and security rules, @DataJpaTest with Testcontainers for custom queries, and a few @SpringBootTest tests for the main user flows.' Bu bitta gap butun piramidani ko'rsatadi.",
          code: `@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class TaskFlowIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired MockMvc mockMvc;

    @Test
    void userCanRegisterLoginAndCreateTask() throws Exception {
        String email = "user-" + UUID.randomUUID() + "@test.uz";

        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email": "%s", "password": "secret123", "name": "Ali"}
                                """.formatted(email)))
                .andExpect(status().isCreated());

        String loginJson = mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email": "%s", "password": "secret123"}
                                """.formatted(email)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        String token = JsonPath.read(loginJson, "$.accessToken");

        String boardJson = mockMvc.perform(post("/api/boards")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\\"name\\": \\"Work\\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        Integer boardId = JsonPath.read(boardJson, "$.id");

        mockMvc.perform(post("/api/boards/{id}/tasks", boardId)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\\"title\\": \\"First task\\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.boardId").value(boardId));
    }
}`,
          lang: 'java',
        },
      ],
      vocab: [
        { en: 'unit test', uz: "bitta class'ni alohida tekshiruvchi test" },
        { en: 'integration test', uz: "bir nechta qism birga ishlashini tekshiruvchi test" },
        { en: 'test slice', uz: "Spring'ning faqat bitta qatlamini yuklaydigan test" },
        { en: 'mock', uz: "soxta obyekt (haqiqiy dependency o'rniga)" },
        { en: 'assertion', uz: 'tasdiqlash (kutilgan natijani tekshirish)' },
        { en: 'test pyramid', uz: 'test piramidasi (ko\'p unit, oz E2E)' },
        { en: 'container', uz: "Docker'dagi izolyatsiyalangan dastur (masalan, PostgreSQL)" },
        { en: 'flaky test', uz: "goh o'tadigan, goh yiqiladigan ishonchsiz test" },
      ],
      questions: [
        {
          q: "How do you test a Spring Boot application?",
          a: "I follow the test pyramid. I write many fast unit tests for services with JUnit and Mockito, without Spring. For controllers I use @WebMvcTest with MockMvc, and for custom queries I use @DataJpaTest with Testcontainers. Then I have a few @SpringBootTest tests for the main user flows, like login and creating a task.",
          uz: "Test piramidasiga amal qilaman. Service'lar uchun Spring'siz, JUnit va Mockito bilan ko'p tez unit testlar yozaman. Controller'lar uchun MockMvc bilan @WebMvcTest, o'zim yozgan query'lar uchun esa Testcontainers bilan @DataJpaTest ishlataman. Keyin login va task yaratish kabi asosiy foydalanuvchi oqimlari uchun bir nechta @SpringBootTest testim bor.",
          level: 'junior',
        },
        {
          q: "What is the difference between @WebMvcTest and @SpringBootTest?",
          a: "@WebMvcTest loads only the web layer: the controller, the controller advice, filters, Jackson and security. Services and repositories are not loaded, so I mock them. It is fast and good for testing status codes, validation and JSON. @SpringBootTest loads the whole application, so it is slower, and I use it for full integration tests.",
          uz: "@WebMvcTest faqat web qatlamini yuklaydi: controller, controller advice, filter'lar, Jackson va security. Service va repository'lar yuklanmaydi, shuning uchun ularni mock qilaman. U tez va status code'lar, validation va JSON'ni tekshirish uchun yaxshi. @SpringBootTest butun ilovani yuklaydi, shuning uchun sekinroq va men uni to'liq integration testlar uchun ishlataman.",
          level: 'middle',
        },
        {
          q: "How would you test that POST /api/boards/{id}/tasks returns 201 and 400?",
          a: "I write a @WebMvcTest for the TaskController and mock the TaskService. In the first test I send valid JSON and check the status 201, the Location header and the id in the response. In the second test I send a blank title and check the status 400 and the error for the title field. I also verify that the service was not called.",
          uz: "TaskController uchun @WebMvcTest yozaman va TaskService'ni mock qilaman. Birinchi testda to'g'ri JSON yuboraman va 201 status'ini, Location header'ini va javobdagi id'ni tekshiraman. Ikkinchi testda bo'sh title yuboraman va 400 status'ini hamda title maydoni uchun xatoni tekshiraman. Service chaqirilmaganini ham verify qilaman.",
          example: `mockMvc.perform(post("/api/boards/3/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\\"title\\": \\"\\"}"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.errors.title").exists());
verifyNoInteractions(taskService);`,
          level: 'middle',
        },
        {
          q: "What is @MockBean or @MockitoBean?",
          a: "It replaces a real bean in the Spring test context with a Mockito mock. For example, in a @WebMvcTest I replace TaskService with a mock and define its behavior with when and thenReturn. Since Spring Boot 3.4, @MockitoBean is the new annotation and @MockBean is deprecated. In plain unit tests I do not need it, I just use @Mock.",
          uz: "U Spring test context'idagi haqiqiy bean'ni Mockito mock bilan almashtiradi. Masalan, @WebMvcTest'da TaskService'ni mock bilan almashtiraman va uning xulqini when va thenReturn bilan belgilayman. Spring Boot 3.4'dan beri yangi annotation — @MockitoBean, @MockBean esa deprecated. Oddiy unit testlarda bu kerak emas, shunchaki @Mock ishlataman.",
          level: 'middle',
        },
        {
          q: "Why use Testcontainers instead of H2 for repository tests?",
          a: "H2 is not PostgreSQL. It has a different SQL dialect and different types, so native queries and migrations can work in H2 but fail in production. Testcontainers starts a real PostgreSQL in Docker for the tests. With @ServiceConnection, Spring Boot connects to it automatically. The tests are a bit slower, but I trust them much more.",
          uz: "H2 — PostgreSQL emas. Uning SQL dialekti va tiplari boshqacha, shuning uchun native query'lar va migration'lar H2'da ishlab, production'da yiqilishi mumkin. Testcontainers testlar uchun Docker'da haqiqiy PostgreSQL ishga tushiradi. @ServiceConnection bilan Spring Boot unga avtomatik ulanadi. Testlar biroz sekinroq, lekin ularga ancha ko'proq ishonaman.",
          level: 'middle',
        },
        {
          q: "How do you test secured endpoints?",
          a: "I use spring-security-test. With @WithMockUser I can run a test as a logged-in user with a given role. I test three cases: without a user I expect 401, with the wrong role I expect 403, and with the right role I expect success. In @WebMvcTest I import my SecurityConfig, so the real rules are tested.",
          uz: "spring-security-test ishlataman. @WithMockUser bilan testni ma'lum rolga ega login qilgan foydalanuvchi sifatida ishga tushira olaman. Uchta holatni tekshiraman: foydalanuvchisiz 401 kutaman, noto'g'ri rol bilan 403 kutaman, to'g'ri rol bilan esa muvaffaqiyat kutaman. @WebMvcTest'da o'zimning SecurityConfig'imni import qilaman, shunda haqiqiy qoidalar test qilinadi.",
          level: 'middle',
        },
        {
          q: "What does @DataJpaTest do?",
          a: "It starts only the JPA part of the application: entities, repositories, the database connection and Flyway. Every test runs in a transaction and is rolled back at the end, so tests do not affect each other. I use it to test my custom queries and projections. By default it uses an in-memory database, but I switch it to Testcontainers.",
          uz: "U ilovaning faqat JPA qismini ishga tushiradi: entity'lar, repository'lar, database ulanishi va Flyway. Har bir test transaction ichida ishlaydi va oxirida rollback qilinadi, shuning uchun testlar bir-biriga ta'sir qilmaydi. Men uni o'zim yozgan query va projection'larni test qilish uchun ishlataman. Default holatda u in-memory database ishlatadi, lekin men uni Testcontainers'ga almashtiraman.",
          level: 'junior',
        },
        {
          q: "Why can constructor injection make testing easier?",
          a: "With constructor injection, I can create the service in a unit test with new and pass mocks to the constructor. I do not need Spring or reflection. The test is very fast and clear, because all dependencies are visible. With field injection, I would need Spring or special tools to set the private fields.",
          uz: "Constructor injection bilan service'ni unit testda new orqali yaratib, constructor'ga mock'larni bera olaman. Menga Spring yoki reflection kerak emas. Test juda tez va tushunarli, chunki barcha dependency'lar ko'rinib turadi. Field injection bilan private maydonlarni o'rnatish uchun Spring yoki maxsus vositalar kerak bo'lardi.",
          level: 'junior',
        },
      ],
      resources: [
        { title: 'Spring Boot Reference — Testing', url: 'https://docs.spring.io/spring-boot/reference/testing/index.html' },
        { title: 'Spring Guides — Testing the Web Layer', url: 'https://spring.io/guides/gs/testing-web' },
        { title: 'Testcontainers — Getting started with Spring Boot', url: 'https://testcontainers.com/guides/testing-spring-boot-rest-api-using-testcontainers/' },
        { title: 'Spring Security — Testing', url: 'https://docs.spring.io/spring-security/reference/servlet/test/index.html' },
      ],
    },
  ],
}

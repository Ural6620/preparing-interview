export default {
  id: 'devops',
  title: 'DevOps va xavfsizlik',
  icon: '🐳',
  intro: "Docker, CI/CD, environment'lar, nginx, monitoring va web xavfsizlik asoslari. Full-stack dasturchidan kodni faqat yozish emas, balki uni qanday build, deploy va himoya qilishni ham bilish kutiladi — shuning uchun bu savollar deyarli har bir interview'da chiqadi.",
  topics: [
    {
      id: 'ops-docker-basics',
      title: 'Docker: image, container, Dockerfile',
      days: [50, 51],
      summary: "Docker ilovani kerakli hamma narsasi (runtime, kutubxonalar, config) bilan bitta paketga o'raydi, shuning uchun u har qanday mashinada bir xil ishlaydi. Image — o'zgarmas shablon (read-only), container esa shu image'dan ishga tushirilgan jarayon. Image layer'lardan iborat: Dockerfile'dagi har bir instruksiya (FROM, COPY, RUN) yangi layer yaratadi va Docker ularni cache qiladi. Shuning uchun Spring Boot loyihasida avval faqat pom.xml ko'chirilib, mvn dependency:go-offline bilan dependency'lar yuklanadi, keyin qolgan kod (src) — kod o'zgarsa ham dependency layer cache'dan olinadi. Multi-stage build'da birinchi bosqichda Maven + JDK bilan jar build qilinadi, oxirgi image'ga esa faqat JRE va tayyor jar ko'chiriladi — image kichik va xavfsizroq bo'ladi (Vue frontend uchun ham xuddi shunday: package.json + npm ci, keyin nginx'ga faqat dist). Container virtual machine emas: u host'ning kernel'idan foydalanadi, shuning uchun yengil va tez ishga tushadi.",
      keyPoints: [
        "Image — shablon (class kabi), container — uning ishlayotgan nusxasi (object kabi)",
        "Har bir Dockerfile instruksiyasi — yangi layer; layer'lar cache qilinadi va image'lar orasida bo'lishiladi",
        "Kam o'zgaradigan narsalarni (pom.xml + mvn dependency:go-offline; frontend'da package.json + npm ci) tepaga, ko'p o'zgaradigan kodni pastga yoz — cache yaxshi ishlaydi",
        "Multi-stage build: build tool'lar final image'ga tushmaydi → image kichikroq va xavfsizroq",
        ".dockerignore — target/, .git, .env'ni (frontend'da node_modules'ni ham) image'ga qo'shmaslik uchun",
        "Container — VM emas: o'z OS'i yo'q, host kernel'ini ishlatadi, shuning uchun tez va yengil",
        "Container'ni root emas, oddiy user (masalan USER spring) bilan ishga tushirish yaxshi amaliyot",
        "Spring Boot runtime image: eclipse-temurin:21-jre (JDK va Maven faqat build bosqichida)",
      ],
      vocab: [
        { en: 'image', uz: "container uchun o'zgarmas shablon" },
        { en: 'container', uz: "image'dan ishga tushirilgan izolyatsiyalangan jarayon" },
        { en: 'layer', uz: "image qatlami" },
        { en: 'build cache', uz: "build keshi (qayta ishlatiladigan layer'lar)" },
        { en: 'multi-stage build', uz: "ko'p bosqichli build" },
        { en: 'base image', uz: "asosiy image (FROM ...)" },
        { en: 'registry', uz: "image'lar ombori (Docker Hub, GHCR)" },
        { en: 'isolated', uz: "ajratilgan, izolyatsiyalangan" },
      ],
      questions: [
        {
          q: 'What is Docker and why do we use it?',
          a: "Docker is a tool that packages an application with everything it needs. This package is called a container. It works the same on every machine, so we avoid the problem of 'it works on my machine'. It also makes deployment and onboarding faster.",
          uz: "Docker — ilovani kerakli hamma narsasi bilan o'raydigan tool. Bu paket container deb ataladi. U har qanday mashinada bir xil ishlaydi, shuning uchun 'mening kompyuterimda ishlaydi' muammosidan qochamiz. U deploy va yangi dasturchini loyihaga qo'shishni ham tezlashtiradi.",
          followUp: 'What is the difference between a container and a virtual machine?',
          level: 'junior',
        },
        {
          q: 'What is the difference between an image and a container?',
          a: "The main difference is simple. An image is a read-only template, and a container is a running instance of it. We build an image once from a Dockerfile. Then we can start many containers from the same image. It is similar to a class and an object.",
          uz: "Asosiy farq shundaki, image — faqat o'qiladigan shablon, container esa shu image'ning ishlayotgan nusxasi. Image'ni Dockerfile'dan bir marta build qilamiz. Keyin bitta image'dan ko'p container ishga tushirishimiz mumkin. Bu class va object'ga o'xshaydi.",
          example: "docker build -t my-api .        # image yaratish\ndocker run -d -p 8080:8080 my-api  # container ishga tushirish\ndocker ps                         # ishlayotgan container'lar",
          level: 'junior',
        },
        {
          q: 'What is the difference between a container and a virtual machine?',
          a: "A virtual machine has its own full operating system, so it is heavy and slow to start. A container shares the kernel of the host system. It only has the app and its libraries. So containers are lighter, smaller and start in seconds. The trade-off is that VMs give stronger isolation.",
          uz: "Virtual machine'ning o'zining to'liq operatsion tizimi bor, shuning uchun u og'ir va sekin ishga tushadi. Container esa host tizimining kernel'ini bo'lishadi. Unda faqat ilova va uning kutubxonalari bor. Shuning uchun container'lar yengilroq, kichikroq va soniyalarda ishga tushadi. Trade-off shundaki, VM kuchliroq izolyatsiya beradi.",
          level: 'junior',
        },
        {
          q: 'What are Docker layers and how does caching work?',
          a: "Each instruction in a Dockerfile, like COPY or RUN, creates a new layer. Docker caches these layers. If a layer does not change, Docker reuses it from the cache. When one layer changes, all layers after it are rebuilt. So in a Spring Boot project, I copy pom.xml and download the dependencies first, and copy the source code later.",
          uz: "Dockerfile'dagi har bir instruksiya, masalan COPY yoki RUN, yangi layer yaratadi. Docker bu layer'larni cache qiladi. Agar layer o'zgarmasa, Docker uni cache'dan qayta ishlatadi. Bitta layer o'zgarganda, undan keyingi barcha layer'lar qayta build qilinadi. Shuning uchun Spring Boot loyihasida avval pom.xml'ni ko'chirib dependency'larni yuklab olaman, source kodni esa keyin ko'chiraman.",
          example: "COPY pom.xml ./\n# pom.xml o'zgarmasa — bu layer cache'dan olinadi\nRUN mvn -B dependency:go-offline\n# kod o'zgarsa — faqat shu yerdan qayta build\nCOPY src ./src\nRUN mvn -B package -DskipTests",
          level: 'junior',
        },
        {
          q: 'What is a multi-stage build and why is it useful?',
          a: "A multi-stage build uses more than one FROM in one Dockerfile. In the first stage, we install all tools and build the app. In the final stage, we copy only the build result. So the final image is much smaller and does not have build tools or source code. This is also better for security.",
          uz: "Multi-stage build bitta Dockerfile'da bir nechta FROM ishlatadi. Birinchi bosqichda barcha tool'larni o'rnatamiz va ilovani build qilamiz. Oxirgi bosqichda faqat build natijasini ko'chiramiz. Shuning uchun final image ancha kichik bo'ladi va unda build tool'lar yoki source kod bo'lmaydi. Bu xavfsizlik uchun ham yaxshiroq.",
          example: `# --- Backend (Spring Boot, Java 21) ---
# 1-bosqich: build (Maven + JDK)
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml ./
RUN mvn -B dependency:go-offline        # dependency layer: pom.xml o'zgarmasa cache'dan
COPY src ./src
RUN mvn -B package -DskipTests          # testlar CI'da ishlaydi -> target/*.jar

# 2-bosqich: production image (faqat JRE, Maven va source kod yo'q)
FROM eclipse-temurin:21-jre
WORKDIR /app
RUN groupadd --system spring && useradd --system --gid spring spring
COPY --from=build /app/target/*.jar app.jar
# root emas, oddiy user
USER spring
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

# --- Frontend (Vue/React) ---
# FROM node:20-alpine AS build ... RUN npm ci && npm run build
# FROM nginx:alpine
# COPY --from=build /app/dist /usr/share/nginx/html`,
          followUp: 'How do you make a Docker image smaller?',
          level: 'middle',
        },
        {
          q: 'How do you make a Docker image smaller?',
          a: "First, I use a small base image. For Spring Boot, I use a JRE image like eclipse-temurin 21 jre, not a full JDK. Second, I use a multi-stage build, so Maven, the JDK and the source code stay out of the final image. Third, I copy only the final jar. I also add a .dockerignore file for target, .git and .env files.",
          uz: "Birinchidan, kichik base image ishlataman. Spring Boot uchun to'liq JDK emas, eclipse-temurin 21 jre kabi JRE image ishlataman. Ikkinchidan, multi-stage build ishlataman, shunda Maven, JDK va source kod final image'ga tushmaydi. Uchinchidan, faqat tayyor jar'ni ko'chiraman. Shuningdek, target, .git va .env fayllar uchun .dockerignore fayl qo'shaman.",
          example: "# .dockerignore (Spring Boot backend)\ntarget/\n.git\n.env\n.idea/\n*.log\n\n# frontend'da: node_modules, dist, .git, .env",
          level: 'middle',
        },
        {
          q: 'What is the difference between CMD and ENTRYPOINT? And between COPY and ADD?',
          a: "CMD sets the default command, and we can easily replace it when we run the container. ENTRYPOINT sets the main program, and CMD arguments are passed to it. COPY simply copies files into the image. ADD can also download URLs and unpack archives, so I use COPY in most cases.",
          uz: "CMD default buyruqni belgilaydi va container'ni ishga tushirganda uni oson almashtirish mumkin. ENTRYPOINT asosiy dasturni belgilaydi, CMD argumentlari esa unga uzatiladi. COPY shunchaki fayllarni image'ga ko'chiradi. ADD URL'dan yuklab olishi va arxivlarni ochishi ham mumkin, shuning uchun ko'p hollarda COPY ishlataman.",
          level: 'middle',
        },
      ],
      resources: [
        { title: 'Docker Docs — Get started', url: 'https://docs.docker.com/get-started/' },
        { title: 'Docker Docs — Multi-stage builds', url: 'https://docs.docker.com/build/building/multi-stage/' },
      ],
    },
    {
      id: 'ops-docker-compose',
      title: 'Volumes, networks, docker-compose',
      days: [50, 51],
      summary: "Container o'chirilganda uning ichidagi ma'lumot yo'qoladi, shuning uchun doimiy ma'lumot (masalan PostgreSQL bazasi) volume'da saqlanadi. Named volume'ni Docker o'zi boshqaradi, bind mount esa host'dagi papkani container'ga ulaydi (development'da hot reload uchun qulay). Network container'larni bir-biri bilan bog'laydi: bitta compose network ichida container'lar bir-birini service nomi bilan topadi (masalan api → db:5432). docker-compose bir nechta container'ni (frontend, backend, PostgreSQL) bitta YAML faylda tasvirlab, bitta buyruq bilan ko'tarish imkonini beradi.",
      keyPoints: [
        "Volume — container o'chganda ham ma'lumot saqlanadi (DB uchun majburiy)",
        "Named volume — Docker boshqaradi; bind mount — host papkasi container'ga ulanadi",
        "Compose network ichida service nomi = hostname (SPRING_DATASOURCE_URL'da localhost emas, db yoziladi)",
        "ports: \"8080:8080\" — host:container; port ochilmasa, servis faqat ichki network'da ko'rinadi",
        "depends_on + healthcheck — API faqat DB tayyor bo'lgandan keyin ishga tushadi",
        "docker compose up -d / down / logs -f / exec — eng ko'p ishlatiladigan buyruqlar",
      ],
      vocab: [
        { en: 'volume', uz: "doimiy ma'lumot saqlanadigan joy" },
        { en: 'bind mount', uz: "host papkasini container'ga ulash" },
        { en: 'network', uz: "container'lar orasidagi tarmoq" },
        { en: 'service', uz: "compose'dagi bitta container ta'rifi" },
        { en: 'persistent data', uz: "doimiy (o'chmaydigan) ma'lumot" },
        { en: 'port mapping', uz: "host portini container portiga ulash" },
        { en: 'health check', uz: "servis sog'ligini tekshirish" },
      ],
      questions: [
        {
          q: 'What is docker-compose and when do you use it?',
          a: "Docker Compose is a tool to run many containers together. We describe all services in one YAML file, for example frontend, backend and PostgreSQL. Then one command starts everything with the right networks and volumes. I use it mostly for local development and simple deployments.",
          uz: "Docker Compose — ko'p container'larni birga ishga tushirish uchun tool. Barcha servislarni bitta YAML faylda tasvirlaymiz, masalan frontend, backend va PostgreSQL. Keyin bitta buyruq hammasini kerakli network va volume'lar bilan ishga tushiradi. Men uni asosan local development va oddiy deploy'lar uchun ishlataman.",
          example: `# docker-compose.yml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: \${DB_PASSWORD}   # .env fayldan olinadi
      POSTGRES_DB: appdb
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d appdb"]
      interval: 5s
      retries: 5

  api:
    build: ./backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/appdb   # Spring Boot env -> spring.datasource.url
      SPRING_DATASOURCE_USERNAME: app
      SPRING_DATASOURCE_PASSWORD: \${DB_PASSWORD}
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "8080:8080"

  web:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - api

volumes:
  pgdata:

# Ishga tushirish: docker compose up -d --build`,
          level: 'junior',
        },
        {
          q: 'What is a Docker volume and why do we need it?',
          a: "A container's file system is temporary. When we remove the container, the data is lost. A volume stores data outside the container, so the data stays safe. For example, we always put the PostgreSQL data folder in a volume.",
          uz: "Container'ning fayl tizimi vaqtinchalik. Container'ni o'chirsak, ma'lumot yo'qoladi. Volume ma'lumotni container'dan tashqarida saqlaydi, shuning uchun ma'lumot xavfsiz qoladi. Masalan, PostgreSQL ma'lumotlar papkasini doim volume'ga qo'yamiz.",
          followUp: 'What is the difference between a named volume and a bind mount?',
          level: 'junior',
        },
        {
          q: 'What is the difference between a named volume and a bind mount?',
          a: "Docker creates and manages a named volume, and we refer to it by name. A bind mount connects a folder from the host machine into the container. I use bind mounts in development, so code changes appear in the container right away. For database data, I prefer named volumes.",
          uz: "Named volume'ni Docker o'zi yaratadi va boshqaradi, biz unga nomi bilan murojaat qilamiz. Bind mount esa host mashinadagi papkani container'ga ulaydi. Development'da bind mount ishlataman, shunda kod o'zgarishlari container'da darhol ko'rinadi. Database ma'lumotlari uchun named volume'ni afzal ko'raman.",
          example: "volumes:\n  - pgdata:/var/lib/postgresql/data   # named volume\n  - ./src:/app/src                    # bind mount",
          level: 'middle',
        },
        {
          q: 'How do containers talk to each other?',
          a: "Containers communicate through a Docker network. Docker Compose creates one network for all services by default. Inside this network, a container finds another one by its service name. So the backend connects to the database with the host name db, not localhost.",
          uz: "Container'lar Docker network orqali muloqot qiladi. Docker Compose default holatda barcha servislar uchun bitta network yaratadi. Bu network ichida container boshqasini service nomi bilan topadi. Shuning uchun backend database'ga localhost bilan emas, db host nomi bilan ulanadi.",
          example: "SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/appdb\n#                                       ^^ service nomi, localhost emas",
          level: 'junior',
        },
        {
          q: 'Why does my API fail to connect to PostgreSQL when I start docker-compose?',
          a: "Usually the API starts before the database is ready. depends_on alone only waits for the container to start, not for PostgreSQL to accept connections. So I add a health check with pg_isready and use the condition service_healthy. I also add retry logic in the app.",
          uz: "Odatda API database tayyor bo'lishidan oldin ishga tushadi. depends_on yolg'iz o'zi faqat container ishga tushishini kutadi, PostgreSQL ulanishlarni qabul qilishini emas. Shuning uchun pg_isready bilan health check qo'shaman va service_healthy shartini ishlataman. Ilovada ham qayta urinish (retry) mantiqini qo'shaman.",
          level: 'middle',
        },
        {
          q: 'What does the port mapping 8080:80 mean?',
          a: "The first number is the port on the host machine. The second number is the port inside the container. So a request to localhost:8080 goes to port 80 in the container. If we do not publish a port, the service is visible only inside the Docker network.",
          uz: "Birinchi raqam — host mashinadagi port. Ikkinchi raqam — container ichidagi port. Demak, localhost:8080'ga kelgan request container'dagi 80-portga boradi. Agar portni ochmasak, servis faqat Docker network ichida ko'rinadi.",
          level: 'junior',
        },
      ],
      resources: [
        { title: 'Docker Docs — Docker Compose', url: 'https://docs.docker.com/compose/' },
      ],
    },
    {
      id: 'ops-ci-cd',
      title: 'CI/CD va GitHub Actions',
      days: [52, 53],
      summary: "CI (Continuous Integration) — har bir push yoki pull request'da kod avtomatik tekshiriladi: lint, test, build. Shunday qilib xato main branch'ga tushishidan oldin topiladi. CD (Continuous Delivery/Deployment) — tekshiruvdan o'tgan kod avtomatik ravishda staging yoki production'ga deploy qilinadi. GitHub Actions'da pipeline .github/workflows/ papkasidagi YAML faylda yoziladi: workflow → job'lar → step'lar. Maxfiy ma'lumotlar (token, SSH kalit) kodga yozilmaydi — GitHub Secrets'da saqlanadi va workflow'da secrets.NAME orqali olinadi.",
      keyPoints: [
        "CI — har push'da avtomatik lint + test + build; CD — avtomatik deploy",
        "Continuous Delivery — deploy'ga tayyor, lekin tugmani odam bosadi; Continuous Deployment — to'liq avtomatik",
        "GitHub Actions: workflow (YAML) → job (runner'da ishlaydi) → step (buyruq yoki action)",
        "on: push / pull_request — pipeline'ni nima ishga tushiradi (trigger)",
        "needs: — job'lar ketma-ketligi (deploy faqat test o'tsa)",
        "Secrets — GitHub Settings'da saqlanadi, log'da ko'rinmaydi",
        "Cache (Maven ~/.m2, npm) va parallel job'lar pipeline'ni tezlashtiradi",
        "Backend: ./mvnw verify (compile + test + package); frontend: npm ci, lint, test, build",
      ],
      vocab: [
        { en: 'pipeline', uz: "avtomatik bosqichlar zanjiri" },
        { en: 'workflow', uz: "GitHub Actions'dagi YAML jarayon" },
        { en: 'job', uz: "pipeline'dagi alohida ish (runner'da)" },
        { en: 'step', uz: "job ichidagi bitta qadam" },
        { en: 'runner', uz: "job'ni bajaradigan server" },
        { en: 'trigger', uz: "ishga tushiruvchi hodisa" },
        { en: 'artifact', uz: "build natijasi (fayl)" },
        { en: 'to fail the build', uz: "build'ni muvaffaqiyatsiz qilish" },
      ],
      questions: [
        {
          q: 'What is CI/CD?',
          a: "CI means Continuous Integration. Every push triggers the pipeline, and it runs lint, tests and build automatically. CD means Continuous Delivery or Deployment. After the checks pass, the code is deployed to staging or production automatically. This way, we find bugs early and release more often.",
          uz: "CI — Continuous Integration degani. Har bir push pipeline'ni ishga tushiradi va u lint, test va build'ni avtomatik bajaradi. CD — Continuous Delivery yoki Deployment degani. Tekshiruvlar o'tgandan keyin kod avtomatik ravishda staging yoki production'ga deploy qilinadi. Shu yo'l bilan bug'larni erta topamiz va tez-tez release qilamiz.",
          followUp: 'What is the difference between continuous delivery and continuous deployment?',
          level: 'junior',
        },
        {
          q: 'What is the difference between continuous delivery and continuous deployment?',
          a: "In continuous delivery, every change is ready to deploy, but a person clicks the button for production. In continuous deployment, every change that passes the tests goes to production automatically. Continuous deployment needs very good tests and monitoring.",
          uz: "Continuous delivery'da har bir o'zgarish deploy'ga tayyor bo'ladi, lekin production uchun tugmani odam bosadi. Continuous deployment'da testlardan o'tgan har bir o'zgarish production'ga avtomatik chiqadi. Continuous deployment juda yaxshi testlar va monitoring talab qiladi.",
          level: 'middle',
        },
        {
          q: 'Can you describe your CI/CD pipeline?',
          a: "We use GitHub Actions. On every pull request, the pipeline installs dependencies, runs lint, runs the tests and builds the app. If any step fails, we cannot merge. After merge to main, it builds a Docker image and pushes it to a registry. Then it deploys to staging, and after a check, to production.",
          uz: "Biz GitHub Actions ishlatamiz. Har bir pull request'da pipeline dependency'larni o'rnatadi, lint'ni ishga tushiradi, testlarni bajaradi va ilovani build qiladi. Biror step muvaffaqiyatsiz bo'lsa, merge qila olmaymiz. main'ga merge qilingandan keyin u Docker image build qilib, registry'ga push qiladi. Keyin staging'ga, tekshiruvdan keyin esa production'ga deploy qiladi.",
          example: `# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  backend:                                # Spring Boot (Java 21)
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 21
          cache: maven
      - run: ./mvnw -B verify             # compile + unit/integration testlar + jar

  frontend:                               # Vue + TypeScript
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build

  deploy:
    needs: [backend, frontend]            # faqat ikkalasi o'tsa
    if: github.ref == 'refs/heads/main'   # faqat main'da
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build and push image
        run: |
          echo "\${{ secrets.GITHUB_TOKEN }}" | docker login ghcr.io -u \${{ github.actor }} --password-stdin
          docker build -t ghcr.io/\${{ github.repository }}:\${{ github.sha }} ./backend
          docker push ghcr.io/\${{ github.repository }}:\${{ github.sha }}
      # keyin: serverga SSH orqali ulanib, docker compose pull && docker compose up -d`,
          level: 'junior',
        },
        {
          q: 'What is the difference between a workflow, a job and a step in GitHub Actions?',
          a: "A workflow is the whole YAML file, and an event like push triggers it. A workflow has one or more jobs. Each job runs on its own runner, and jobs run in parallel by default. A job has steps, and each step is a shell command or a ready action.",
          uz: "Workflow — bu butun YAML fayl, uni push kabi hodisa ishga tushiradi. Workflow'da bir yoki bir nechta job bo'ladi. Har bir job o'z runner'ida ishlaydi va job'lar default holatda parallel ishlaydi. Job'da step'lar bor, har bir step — shell buyruq yoki tayyor action.",
          level: 'junior',
        },
        {
          q: 'How do you handle secrets in a CI pipeline?',
          a: "We never write secrets in the code or in the YAML file. We store them in GitHub Secrets, and the workflow reads them with secrets dot name. GitHub hides these values in the logs. We also give each token only the permissions it needs.",
          uz: "Secret'larni hech qachon kodga yoki YAML faylga yozmaymiz. Ularni GitHub Secrets'da saqlaymiz, workflow esa ularni secrets.NAME orqali o'qiydi. GitHub bu qiymatlarni log'larda yashiradi. Shuningdek, har bir token'ga faqat kerakli ruxsatlarni beramiz.",
          example: "env:\n  DATABASE_URL: ${{ secrets.DATABASE_URL }}",
          level: 'middle',
        },
        {
          q: 'How can you make a slow pipeline faster?',
          a: "First, I cache dependencies, for example the Maven cache for the backend and the npm cache for the frontend. Second, I run independent jobs in parallel, like lint and tests. Third, I use Docker layer caching. I can also run only the tests for the changed parts in big projects.",
          uz: "Birinchidan, dependency'larni cache qilaman, masalan backend uchun Maven cache va frontend uchun npm cache. Ikkinchidan, mustaqil job'larni parallel ishga tushiraman, masalan lint va testlarni. Uchinchidan, Docker layer cache'dan foydalanaman. Katta loyihalarda faqat o'zgargan qismlarning testlarini ishga tushirishim ham mumkin.",
          level: 'middle',
        },
      ],
      resources: [
        { title: 'GitHub Docs — Actions', url: 'https://docs.github.com/en/actions' },
        { title: 'roadmap.sh — DevOps', url: 'https://roadmap.sh/devops' },
      ],
    },
    {
      id: 'ops-environments',
      title: "Environment'lar, env variables va secrets",
      days: [51, 53, 55],
      summary: "Odatda kamida uchta environment bo'ladi: dev (dasturchining kompyuteri), staging (production'ning nusxasi, test uchun) va prod (haqiqiy foydalanuvchilar). Kod barcha environment'larda bir xil bo'ladi, farq faqat config'da — u environment variable'lar orqali beriladi (12-factor app prinsipi). Parol, API kalit, DATABASE_URL kabi secret'lar hech qachon git'ga commit qilinmaydi: lokal'da .env faylda (u .gitignore'da), serverda esa CI secrets yoki secret manager'da saqlanadi. Repo'da faqat .env.example (qiymatlarsiz) turadi. Frontend'dagi env variable'lar (VITE_*) build vaqtida bundle'ga yoziladi va brauzerda ko'rinadi — shuning uchun u yerga secret qo'yib bo'lmaydi.",
      keyPoints: [
        "dev → staging → prod: avval staging'ga deploy qilib tekshiramiz",
        "Staging iloji boricha prod'ga o'xshash bo'lishi kerak (bir xil Docker image, o'xshash config)",
        "Config kodda emas, environment variable'larda (12-factor)",
        ".env — .gitignore'da; repo'da faqat .env.example",
        "Frontend env (VITE_*, NEXT_PUBLIC_*) — hammaga ochiq, secret qo'yma",
        "Secret sizib chiqsa — darhol rotate (almashtirish) qilish kerak, faqat o'chirish yetarli emas",
      ],
      vocab: [
        { en: 'environment', uz: "muhit (dev, staging, prod)" },
        { en: 'environment variable', uz: "muhit o'zgaruvchisi" },
        { en: 'secret', uz: "maxfiy ma'lumot (parol, token, kalit)" },
        { en: 'staging', uz: "production'ning test nusxasi" },
        { en: 'to rotate a key', uz: "kalitni yangisiga almashtirish" },
        { en: 'to leak', uz: "sizib chiqmoq" },
        { en: 'configuration', uz: "sozlamalar" },
      ],
      questions: [
        {
          q: 'What environments do you usually have?',
          a: "We usually have three environments: development, staging and production. Development is the local machine of each developer. Staging is a copy of production, and we test new features there first. Production is the real system for real users. We deploy to staging first, and then to production.",
          uz: "Odatda uchta environment'imiz bor: development, staging va production. Development — har bir dasturchining lokal mashinasi. Staging — production'ning nusxasi, yangi feature'larni avval u yerda tekshiramiz. Production — haqiqiy foydalanuvchilar uchun haqiqiy tizim. Avval staging'ga, keyin production'ga deploy qilamiz.",
          level: 'junior',
        },
        {
          q: 'How do you store secrets like database passwords and API keys?',
          a: "Secrets are stored in environment variables, not in the code. Locally, I keep them in a .env file, and this file is in .gitignore. In the repository, we keep only a .env.example file without real values. On the server or in CI, we use GitHub Secrets or a secret manager.",
          uz: "Secret'lar kodda emas, environment variable'larda saqlanadi. Lokal'da ularni .env faylda saqlayman va bu fayl .gitignore'da. Repository'da faqat haqiqiy qiymatlarsiz .env.example fayl turadi. Serverda yoki CI'da GitHub Secrets yoki secret manager ishlatamiz.",
          example: "# .env (git'da YO'Q; docker compose yoki IDE uni environment'ga yuklaydi)\nDB_PASSWORD=secret\nJWT_SECRET=...\n\n# application.yml (Spring Boot environment'dan o'qiydi)\nspring:\n  datasource:\n    url: jdbc:postgresql://localhost:5432/appdb\n    password: ${DB_PASSWORD}\napp:\n  jwt:\n    secret: ${JWT_SECRET}",
          followUp: 'What do you do if a secret is pushed to GitHub by mistake?',
          level: 'junior',
        },
        {
          q: 'What do you do if a secret is pushed to GitHub by mistake?',
          a: "First, I rotate the secret immediately. This means I create a new key and disable the old one. Deleting the commit is not enough, because the old value stays in the history and maybe in forks. Then I clean the history if needed, and I add a secret scanning tool to CI.",
          uz: "Birinchi navbatda secret'ni darhol rotate qilaman. Ya'ni yangi kalit yaratib, eskisini o'chirib qo'yaman. Commit'ni o'chirish yetarli emas, chunki eski qiymat tarixda va ehtimol fork'larda qoladi. Keyin kerak bo'lsa tarixni tozalayman va CI'ga secret scanning tool qo'shaman.",
          level: 'middle',
        },
        {
          q: 'Can you put an API secret in a frontend environment variable?',
          a: "No. Frontend variables, like VITE variables, are written into the JavaScript bundle at build time. Anyone can open DevTools and read them. So we put only public values there, like the API URL. Secret calls must go through our backend.",
          uz: "Yo'q. Frontend o'zgaruvchilari, masalan VITE o'zgaruvchilari, build vaqtida JavaScript bundle'ga yoziladi. Har kim DevTools'ni ochib ularni o'qiy oladi. Shuning uchun u yerga faqat ochiq qiymatlarni qo'yamiz, masalan API URL. Secret talab qiladigan chaqiruvlar backend'imiz orqali o'tishi kerak.",
          level: 'middle',
        },
        {
          q: 'How do you deploy your application, step by step?',
          a: "First, I open a pull request, and CI runs lint and tests. After review, I merge to main. Then the pipeline builds a Docker image and pushes it to the registry. Next, it deploys the new image to staging, and we check it. Finally, we deploy to production and watch the logs and metrics.",
          uz: "Avval pull request ochaman va CI lint hamda testlarni ishga tushiradi. Review'dan keyin main'ga merge qilaman. Keyin pipeline Docker image build qilib, registry'ga push qiladi. So'ng yangi image'ni staging'ga deploy qiladi va biz uni tekshiramiz. Oxirida production'ga deploy qilamiz va log'lar hamda metrikalarni kuzatamiz.",
          level: 'junior',
        },
      ],
      resources: [
        { title: 'The Twelve-Factor App — Config', url: 'https://12factor.net/config' },
      ],
    },
    {
      id: 'ops-nginx-https',
      title: 'nginx, reverse proxy va HTTPS',
      days: [53, 54],
      summary: "nginx — tez web server va reverse proxy. Reverse proxy foydalanuvchi bilan backend o'rtasida turadi: barcha request'lar avval nginx'ga keladi, u ularni kerakli servisga (masalan /api → Spring Boot:8080) yo'naltiradi. U static fayllarni (Vue/React build) beradi, HTTPS'ni (SSL termination) hal qiladi, gzip, cache va load balancing qiladi. HTTPS — bu HTTP + TLS: ma'lumot shifrlanadi, sertifikat esa server haqiqatan o'sha domen ekanini isbotlaydi. TLS handshake'da asymmetric shifrlash bilan session kaliti kelishiladi, keyingi trafik esa tezroq symmetric shifrlash bilan boradi. Bepul sertifikatni Let's Encrypt (certbot) beradi.",
      keyPoints: [
        "Forward proxy — client tomonida; reverse proxy — server tomonida turadi",
        "nginx: static fayllar, /api → backend'ga proxy_pass, SSL termination, gzip, load balancing",
        "Backend'ni tashqi dunyoga ochmaymiz — faqat nginx 80/443 portda ko'rinadi",
        "HTTPS = HTTP + TLS: shifrlash, ma'lumot butunligi va server autentifikatsiyasi",
        "TLS handshake: sertifikat tekshiriladi → asymmetric bilan kalit kelishiladi → symmetric bilan shifrlanadi",
        "HTTP → HTTPS 301 redirect + HSTS header",
        "SPA uchun try_files $uri /index.html — sahifani yangilaganda 404 bo'lmasligi uchun",
      ],
      vocab: [
        { en: 'reverse proxy', uz: "teskari proxy (server oldidagi vositachi)" },
        { en: 'load balancer', uz: "yukni serverlar orasida taqsimlovchi" },
        { en: 'SSL/TLS termination', uz: "HTTPS'ni proxy'da ochish" },
        { en: 'certificate', uz: "sertifikat" },
        { en: 'encryption', uz: "shifrlash" },
        { en: 'handshake', uz: "ulanish oldidan kelishuv" },
        { en: 'upstream', uz: "proxy orqasidagi backend servis" },
      ],
      questions: [
        {
          q: 'What is a reverse proxy and why do we use nginx?',
          a: "A reverse proxy is a server that sits in front of our backend. All requests come to it first, and it sends them to the right service. We use nginx as a reverse proxy. It serves static files, handles HTTPS, compresses responses and can balance the load. Also, our backend is not open to the internet directly.",
          uz: "Reverse proxy — backend'imiz oldida turadigan server. Barcha request'lar avval unga keladi va u ularni kerakli servisga yuboradi. Biz nginx'ni reverse proxy sifatida ishlatamiz. U static fayllarni beradi, HTTPS'ni boshqaradi, response'larni siqadi va yukni taqsimlay oladi. Bundan tashqari, backend'imiz internetga to'g'ridan-to'g'ri ochiq bo'lmaydi.",
          example: `server {
  listen 80;
  server_name example.com;
  return 301 https://$host$request_uri;   # HTTP -> HTTPS
}

server {
  listen 443 ssl;
  server_name example.com;
  ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

  # Frontend (Vue/React build)
  location / {
    root /usr/share/nginx/html;
    try_files $uri /index.html;
  }

  # Backend API
  location /api/ {
    proxy_pass http://localhost:8080;   # Spring Boot
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}`,
          level: 'junior',
        },
        {
          q: 'What is the difference between a forward proxy and a reverse proxy?',
          a: "A forward proxy works for the client. It hides the client and sends requests to the internet for it, like a company proxy. A reverse proxy works for the server. It hides the backend servers and receives requests from clients. nginx in front of our API is a reverse proxy.",
          uz: "Forward proxy client uchun ishlaydi. U client'ni yashiradi va uning nomidan internetga request yuboradi, masalan kompaniya proxy'si. Reverse proxy server uchun ishlaydi. U backend serverlarni yashiradi va client'lardan request qabul qiladi. API'miz oldidagi nginx — reverse proxy.",
          level: 'middle',
        },
        {
          q: 'How does HTTPS work?',
          a: "HTTPS is HTTP over TLS. First, the browser and the server do a TLS handshake. The server sends its certificate, and the browser checks that it is valid for this domain. Then they agree on a session key with asymmetric encryption. After that, all data is encrypted with this key using faster symmetric encryption.",
          uz: "HTTPS — bu TLS ustidagi HTTP. Avval brauzer va server TLS handshake qiladi. Server o'z sertifikatini yuboradi, brauzer esa u shu domen uchun haqiqiy ekanini tekshiradi. Keyin ular asymmetric shifrlash yordamida session kalitini kelishib oladi. Shundan keyin barcha ma'lumot shu kalit bilan, tezroq symmetric shifrlash orqali shifrlanadi.",
          followUp: 'What does a TLS certificate prove?',
          level: 'middle',
        },
        {
          q: 'Why is HTTPS important?',
          a: "HTTPS gives three things. First, encryption, so nobody can read passwords or tokens on the network. Second, integrity, so nobody can change the data on the way. Third, authentication, so the user knows they talk to the real server. Today, browsers also mark HTTP sites as not secure.",
          uz: "HTTPS uchta narsa beradi. Birinchisi — shifrlash, shunda tarmoqda hech kim parol yoki token'larni o'qiy olmaydi. Ikkinchisi — butunlik, shunda hech kim ma'lumotni yo'lda o'zgartira olmaydi. Uchinchisi — autentifikatsiya, shunda foydalanuvchi haqiqiy server bilan gaplashayotganini biladi. Bugun brauzerlar HTTP saytlarni xavfsiz emas deb belgilaydi ham.",
          level: 'junior',
        },
        {
          q: 'Why do you get a 404 error when you refresh a page in a Vue or React app on nginx?',
          a: "A single-page app has only one real file, index.html. Routes like /profile exist only in JavaScript. When we refresh, nginx looks for a file called profile and cannot find it. The fix is try_files $uri /index.html, so nginx returns index.html and the router handles the path.",
          uz: "Single-page app'da faqat bitta haqiqiy fayl bor — index.html. /profile kabi route'lar faqat JavaScript'da mavjud. Sahifani yangilaganimizda nginx profile degan faylni qidiradi va topa olmaydi. Yechim — try_files $uri /index.html, shunda nginx index.html'ni qaytaradi va yo'lni router hal qiladi.",
          level: 'middle',
        },
      ],
      resources: [
        { title: 'nginx documentation', url: 'https://nginx.org/en/docs/' },
        { title: 'MDN — HTTPS', url: 'https://developer.mozilla.org/en-US/docs/Glossary/HTTPS' },
      ],
    },
    {
      id: 'ops-monitoring',
      title: 'Monitoring, logging va rollback',
      days: [53, 56],
      summary: "Deploy qilingandan keyin ish tugamaydi — tizim to'g'ri ishlayotganini kuzatish kerak. Logging — nima bo'lganini yozib borish (structured JSON log'lar, level'lar: error, warn, info, debug). Monitoring — metrikalarni kuzatish: error rate, response time (latency), CPU/RAM, request soni; muammo bo'lsa alert keladi. Error tracking tool'lari (masalan Sentry) frontend va backend xatolarini stack trace bilan yig'adi. Agar yangi versiya muammo keltirsa, rollback qilinadi — oldingi ishlayotgan versiyaga qaytiladi. Docker image'larga versiya (git SHA) tegi qo'yilgani uchun rollback — oddiygina eski tegni qayta deploy qilish.",
      keyPoints: [
        "Logs — nima bo'ldi; metrics — qanchalik yaxshi ishlayapti; alerts — qachon odamni uyg'otish kerak",
        "Structured (JSON) log + request id — muammoni bir nechta servis bo'ylab kuzatish oson",
        "Log'larga parol, token, karta raqami yozilmaydi",
        "Asosiy metrikalar: error rate, latency (p95), traffic, CPU/memory",
        "Health check endpoint (/health) — load balancer va monitoring uchun",
        "Rollback — oldingi image tegini qayta deploy qilish; DB migration'lar orqaga mos (backward compatible) bo'lishi kerak",
        "Xavfsizroq release: blue-green, canary, feature flag",
      ],
      vocab: [
        { en: 'monitoring', uz: "kuzatish" },
        { en: 'metric', uz: "o'lchov ko'rsatkichi" },
        { en: 'alert', uz: "ogohlantirish" },
        { en: 'log level', uz: "log darajasi (error, warn, info)" },
        { en: 'rollback', uz: "oldingi versiyaga qaytish" },
        { en: 'downtime', uz: "tizim ishlamay qolgan vaqt" },
        { en: 'latency', uz: "javob kechikishi" },
        { en: 'incident', uz: "nosozlik hodisasi" },
      ],
      questions: [
        {
          q: 'How do you monitor your application in production?',
          a: "We collect logs, metrics and errors. Logs show what happened. Metrics show error rate, response time and memory usage. We use an error tracking tool to catch exceptions with the stack trace. When a metric is too high, we get an alert in Slack or email.",
          uz: "Biz log'lar, metrikalar va xatolarni yig'amiz. Log'lar nima bo'lganini ko'rsatadi. Metrikalar error rate, javob vaqti va xotira ishlatilishini ko'rsatadi. Exception'larni stack trace bilan ushlash uchun error tracking tool ishlatamiz. Metrika juda yuqori bo'lsa, Slack yoki email'da alert olamiz.",
          level: 'junior',
        },
        {
          q: 'What is a rollback and how do you do it?',
          a: "A rollback means we go back to the previous working version. We roll back if something goes wrong after a deploy. We tag every Docker image with the commit hash. So a rollback is just deploying the previous image tag again. It takes a few minutes, and then we fix the bug calmly.",
          uz: "Rollback — oldingi ishlayotgan versiyaga qaytish degani. Deploy'dan keyin nimadir buzilsa, rollback qilamiz. Har bir Docker image'ga commit hash bilan teg qo'yamiz. Shuning uchun rollback — shunchaki oldingi image tegini qayta deploy qilish. Bu bir necha daqiqa oladi, keyin bug'ni xotirjam tuzatamiz.",
          followUp: 'What about database migrations during a rollback?',
          level: 'junior',
        },
        {
          q: 'What about database migrations during a rollback?',
          a: "This is the hard part. The old code must still work with the new database schema. So we make migrations backward compatible. For example, we add a new column first and remove the old column in a later release. This pattern is called expand and contract.",
          uz: "Bu eng qiyin qismi. Eski kod yangi database sxemasi bilan ham ishlashi kerak. Shuning uchun migration'larni backward compatible qilamiz. Masalan, avval yangi ustun qo'shamiz, eski ustunni esa keyingi release'da o'chiramiz. Bu pattern expand and contract deb ataladi.",
          level: 'middle',
        },
        {
          q: 'What makes good logging?',
          a: "Good logs are structured, for example in JSON format. Each log has a level, a timestamp and a request id. The request id helps us follow one request across services. We never log passwords, tokens or personal data. We also do not log too much, because it costs money and creates noise.",
          uz: "Yaxshi log'lar structured bo'ladi, masalan JSON formatda. Har bir log'da level, vaqt belgisi va request id bor. Request id bitta request'ni servislar bo'ylab kuzatishga yordam beradi. Parol, token yoki shaxsiy ma'lumotlarni hech qachon log qilmaymiz. Juda ko'p log ham yozmaymiz, chunki bu pul talab qiladi va shovqin yaratadi.",
          example: "logger.info({ requestId, userId, durationMs: 120 }, 'Order created')\nlogger.error({ requestId, err }, 'Payment failed')",
          level: 'middle',
        },
        {
          q: 'What are blue-green and canary deployments?',
          a: "In blue-green deployment, we have two same environments. The new version goes to green, and then we switch all traffic from blue to green. If there is a problem, we switch back fast. In a canary deployment, we send only a small part of traffic, like five percent, to the new version first.",
          uz: "Blue-green deployment'da ikkita bir xil environment bo'ladi. Yangi versiya green'ga chiqadi, keyin barcha trafikni blue'dan green'ga o'tkazamiz. Muammo bo'lsa, tezda ortga o'tkazamiz. Canary deployment'da esa avval trafikning faqat kichik qismini, masalan besh foizini, yangi versiyaga yuboramiz.",
          level: 'middle',
        },
      ],
      resources: [
        { title: 'roadmap.sh — DevOps', url: 'https://roadmap.sh/devops' },
      ],
    },
    {
      id: 'ops-security',
      title: 'Xavfsizlik: OWASP Top 10 asoslari',
      days: [54],
      summary: "OWASP Top 10 — web ilovalardagi eng xavfli zaifliklar ro'yxati; interview'da eng ko'p SQL injection, XSS, CSRF, HTTPS va parol saqlash so'raladi. SQL injection — foydalanuvchi input'i SQL so'roviga to'g'ridan-to'g'ri qo'shilganda yuz beradi; yechim — parameterized query yoki ORM. XSS — sahifaga zararli JavaScript tushishi; yechim — output'ni escape qilish (Vue/React buni o'zi qiladi, v-html/dangerouslySetInnerHTML xavfli), CSP header, token'ni httpOnly cookie'da saqlash. CSRF — boshqa sayt foydalanuvchi cookie'si bilan uning nomidan request yuborishi; yechim — SameSite cookie va CSRF token. Parollar hech qachon ochiq yoki oddiy hash (MD5, SHA) bilan saqlanmaydi — bcrypt/argon2 kabi sekin, salt'li algoritm ishlatiladi. Asosiy qoida: foydalanuvchidan kelgan har qanday ma'lumotga ishonma, server tomonda validate qil.",
      keyPoints: [
        "SQL injection → parameterized query ($1, ?) yoki ORM; string'ni hech qachon SQL'ga qo'shma",
        "XSS → output'ni escape qil, innerHTML/v-html'dan qoch, CSP, httpOnly cookie",
        "CSRF → SameSite=Lax/Strict cookie, CSRF token, GET bilan ma'lumot o'zgartirma",
        "Parol → bcrypt/argon2 (salt + sekin hash); hech qachon plain text yoki MD5",
        "Hamma joyda HTTPS + Secure cookie + HSTS",
        "Validation server'da bo'lishi shart — frontend validation faqat UX uchun",
        "Least privilege, rate limiting, dependency'larni yangilash (backend: Dependabot / OWASP dependency-check, frontend: npm audit)",
      ],
      vocab: [
        { en: 'vulnerability', uz: "zaiflik" },
        { en: 'injection', uz: "kod/so'rov ichiga zararli ma'lumot kiritish" },
        { en: 'to sanitize', uz: "tozalamoq (input'ni)" },
        { en: 'to escape', uz: "maxsus belgilarni xavfsiz holatga keltirish" },
        { en: 'parameterized query', uz: "parametrli so'rov" },
        { en: 'hash', uz: "bir tomonlama shifrlangan qiymat" },
        { en: 'salt', uz: "hash'ga qo'shiladigan tasodifiy qiymat" },
        { en: 'attacker', uz: "hujumchi" },
      ],
      questions: [
        {
          q: 'What is SQL injection and how do you prevent it?',
          a: "SQL injection happens when user input goes directly into an SQL query. An attacker can change the query and read or delete data. To prevent it, I use parameterized queries or an ORM. The database then treats the input only as data, never as SQL code. I also validate the input.",
          uz: "SQL injection foydalanuvchi input'i to'g'ridan-to'g'ri SQL so'roviga tushganda yuz beradi. Hujumchi so'rovni o'zgartirib, ma'lumotlarni o'qishi yoki o'chirishi mumkin. Oldini olish uchun parameterized query yoki ORM ishlataman. Shunda database input'ni faqat ma'lumot sifatida ko'radi, hech qachon SQL kod sifatida emas. Input'ni validate ham qilaman.",
          example: "// YOMON — injection mumkin\ndb.query(\"SELECT * FROM users WHERE email = '\" + email + \"'\")\n// email = \"' OR '1'='1\" -> barcha user'lar qaytadi\n\n// YAXSHI — parameterized query\ndb.query('SELECT * FROM users WHERE email = $1', [email])",
          level: 'junior',
        },
        {
          q: 'What is XSS and how do you prevent it?',
          a: "XSS means Cross-Site Scripting. An attacker puts malicious JavaScript into our page, for example in a comment. When other users open the page, the script runs and can steal their data. To prevent it, we escape all output. Vue and React do this by default, so I avoid v-html and innerHTML. We also use a Content Security Policy header.",
          uz: "XSS — Cross-Site Scripting degani. Hujumchi sahifamizga zararli JavaScript qo'yadi, masalan izoh ichida. Boshqa foydalanuvchilar sahifani ochganda script ishlaydi va ularning ma'lumotlarini o'g'irlashi mumkin. Oldini olish uchun barcha output'ni escape qilamiz. Vue va React buni default holatda qiladi, shuning uchun v-html va innerHTML'dan qochaman. Content Security Policy header'ini ham ishlatamiz.",
          example: "// XAVFLI\nel.innerHTML = comment.text\n// <div v-html=\"comment.text\"></div>\n\n// XAVFSIZ\nel.textContent = comment.text\n// <div>{{ comment.text }}</div>  (Vue o'zi escape qiladi)",
          followUp: 'Where should you store a JWT token: localStorage or a cookie?',
          level: 'junior',
        },
        {
          q: 'What is CSRF and how do you prevent it?',
          a: "CSRF means Cross-Site Request Forgery. The user is logged in to our site. Then a bad site sends a request to our site in the background. The browser adds the user's cookie automatically, so the request looks real. To prevent it, we use SameSite cookies and a CSRF token. We also never change data with GET requests.",
          uz: "CSRF — Cross-Site Request Forgery degani. Foydalanuvchi saytimizga login qilgan, yomon sayt esa fonda saytimizga request yuboradi. Brauzer foydalanuvchi cookie'sini avtomatik qo'shadi, shuning uchun request haqiqiydek ko'rinadi. Oldini olish uchun SameSite cookie va CSRF token ishlatamiz. Shuningdek, GET request'lar bilan hech qachon ma'lumotni o'zgartirmaymiz.",
          example: "res.cookie('session', id, {\n  httpOnly: true,   // JS o'qiy olmaydi (XSS'dan)\n  secure: true,     // faqat HTTPS\n  sameSite: 'lax',  // boshqa saytdan POST'da yuborilmaydi (CSRF'dan)\n})",
          level: 'middle',
        },
        {
          q: 'What is the difference between XSS and CSRF?',
          a: "The main difference is where the attack runs. In XSS, the attacker's script runs inside our own site and can do anything the user can do. In CSRF, the attacker uses another site to send a request with the user's cookies. Escaping output protects from XSS. SameSite cookies and CSRF tokens protect from CSRF.",
          uz: "Asosiy farq — hujum qayerda ishlashida. XSS'da hujumchining script'i bizning saytimiz ichida ishlaydi va foydalanuvchi qila oladigan hamma narsani qila oladi. CSRF'da hujumchi foydalanuvchi cookie'lari bilan request yuborish uchun boshqa saytdan foydalanadi. Output'ni escape qilish XSS'dan himoya qiladi. SameSite cookie va CSRF token'lar CSRF'dan himoya qiladi.",
          level: 'middle',
        },
        {
          q: 'How do you store user passwords?',
          a: "We never store passwords in plain text. We store only a hash, made with a slow algorithm like bcrypt or argon2. These algorithms add a random salt, so the same passwords get different hashes. Fast hashes like MD5 or SHA-256 are not safe for passwords, because attackers can try billions of guesses quickly.",
          uz: "Parollarni hech qachon ochiq matn holatida saqlamaymiz. Faqat bcrypt yoki argon2 kabi sekin algoritm bilan yaratilgan hash'ni saqlaymiz. Bu algoritmlar tasodifiy salt qo'shadi, shuning uchun bir xil parollar har xil hash oladi. MD5 yoki SHA-256 kabi tez hash'lar parollar uchun xavfsiz emas, chunki hujumchilar milliardlab taxminni tez sinab ko'ra oladi.",
          example: "import bcrypt from 'bcrypt'\n\nconst hash = await bcrypt.hash(password, 12)      // ro'yxatdan o'tishda\nconst ok = await bcrypt.compare(password, hash)  // login'da",
          followUp: 'What is a salt and why do we need it?',
          level: 'junior',
        },
        {
          q: 'Where should you store a JWT token: localStorage or a cookie?',
          a: "It depends on the use case, but I prefer an httpOnly cookie. JavaScript cannot read an httpOnly cookie, so an XSS attack cannot steal the token. localStorage is easy to use, but any script on the page can read it. With cookies, we must also protect from CSRF with SameSite and a CSRF token.",
          uz: "Bu use case'ga bog'liq, lekin men httpOnly cookie'ni afzal ko'raman. JavaScript httpOnly cookie'ni o'qiy olmaydi, shuning uchun XSS hujumi token'ni o'g'irlay olmaydi. localStorage'dan foydalanish oson, lekin sahifadagi har qanday script uni o'qiy oladi. Cookie bilan esa SameSite va CSRF token orqali CSRF'dan ham himoyalanishimiz kerak.",
          level: 'middle',
        },
        {
          q: 'What is the OWASP Top 10?',
          a: "OWASP Top 10 is a list of the most critical security risks for web applications. It includes broken access control, injection, cryptographic failures and security misconfiguration. Teams use it as a checklist. In my work, I always validate input on the server, use parameterized queries, hash passwords and use HTTPS.",
          uz: "OWASP Top 10 — web ilovalar uchun eng jiddiy xavfsizlik xavflari ro'yxati. Unga broken access control, injection, cryptographic failures va security misconfiguration kiradi. Jamoalar uni checklist sifatida ishlatadi. O'z ishimda doim input'ni server'da validate qilaman, parameterized query ishlataman, parollarni hash qilaman va HTTPS ishlataman.",
          level: 'junior',
        },
      ],
      resources: [
        { title: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/' },
        { title: 'OWASP Cheat Sheet — Password Storage', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html' },
        { title: 'OWASP Cheat Sheet — CSRF Prevention', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html' },
      ],
    },
  ],
}

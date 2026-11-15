export default {
  id: 'frontend',
  title: 'Frontend va JavaScript',
  icon: '🎨',
  intro: "JavaScript asoslari, event loop, Vue/React component'lar, brauzer, TypeScript va frontend live coding. Interviewer'lar bu savollar orqali tilni chuqur tushunasizmi va real UI yoza olasizmi — shuni tekshiradi.",
  topics: [
    // 1 ─────────────────────────────────────────────────────────────
    {
      id: 'fe-js-basics',
      title: 'JS asoslari: closure, this, prototype, hoisting',
      days: [29, 35, 80, 85],
      summary: "Closure — funksiya o'zi yaratilgan joydagi o'zgaruvchilarni eslab qolishi; tashqi funksiya tugagandan keyin ham ichki funksiya ularni ishlata oladi. Hoisting — e'lonlar (declaration) kod bajarilishidan oldin scope tepasiga ko'tarilgandek ishlashi: var undefined bo'lib turadi, let/const esa TDZ (temporal dead zone) ichida bo'ladi. `this` funksiya qayerda yozilganiga emas, qanday chaqirilganiga bog'liq; arrow function esa o'z `this`'iga ega emas, tashqi `this`'ni oladi. JavaScript'da meros prototype chain orqali ishlaydi: object'da property topilmasa, uning prototype'idan qidiriladi. == solishtirishdan oldin type'ni o'zgartiradi (type coercion), === esa type'ni ham tekshiradi.",
      keyPoints: [
        "Closure — funksiya o'zi yaratilgan scope'dagi o'zgaruvchilarni eslab qoladi (private data, counter, callback)",
        "var — function scope, qayta e'lon qilsa bo'ladi; let/const — block scope; const qayta assign qilinmaydi, lekin object ichi o'zgarishi mumkin",
        "Hoisting: var → undefined, let/const → TDZ (ReferenceError), function declaration → to'liq ko'tariladi",
        "`this` chaqirilish usuliga bog'liq: obj.method() → obj, oddiy chaqiruv → undefined (strict mode), new → yangi object, call/apply/bind → berilgan qiymat",
        "Arrow function'da o'z `this`, `arguments` yo'q va uni `new` bilan chaqirib bo'lmaydi",
        "Prototype chain: property topilmasa __proto__ orqali yuqoriga qidiriladi; class — prototype ustidagi qulay sintaksis",
        "Har doim === ishlating; == faqat x == null kabi maxsus holatlarda",
      ],
      vocab: [
        { en: 'scope', uz: "ko'rinish doirasi" },
        { en: 'closure', uz: "yopilish — tashqi o'zgaruvchilarni eslab qolgan funksiya" },
        { en: 'hoisting', uz: "e'lonlarning tepaga ko'tarilishi" },
        { en: 'inheritance', uz: 'meros olish' },
        { en: 'type coercion', uz: "type'ni avtomatik o'zgartirish" },
        { en: 'strict equality', uz: "qat'iy tenglik (===)" },
        { en: 'declaration', uz: "e'lon qilish" },
        { en: 'reassign', uz: 'qayta qiymat berish' },
      ],
      questions: [
        {
          q: 'What is a closure in JavaScript?',
          a: "A closure is a function that remembers the variables from the place where it was created. Even after the outer function finishes, the inner function can still use those variables. We use closures for private data, counters and callbacks.",
          uz: "Closure — o'zi yaratilgan joydagi o'zgaruvchilarni eslab qoladigan funksiya. Tashqi funksiya tugagandan keyin ham ichki funksiya o'sha o'zgaruvchilarni ishlata oladi. Closure'larni private ma'lumot, counter va callback'lar uchun ishlatamiz.",
          example: `function createCounter() {
  let count = 0            // private variable
  return () => ++count
}
const next = createCounter()
next() // 1
next() // 2`,
          followUp: 'Can closures cause memory leaks?',
          level: 'junior',
        },
        {
          q: 'What is the difference between var, let and const?',
          a: "The main difference is scope. var is function-scoped, and let and const are block-scoped. You cannot reassign a const variable, but if it holds an object, you can still change the object inside. Today I use const by default and let when the value changes. I don't use var.",
          uz: "Asosiy farq — scope'da. var function scope'ga ega, let va const esa block scope'ga. const o'zgaruvchiga qayta qiymat berib bo'lmaydi, lekin u object saqlasa, object ichini o'zgartirish mumkin. Hozir men default sifatida const, qiymat o'zgarsa let ishlataman. var ishlatmayman.",
          example: `if (true) {
  var a = 1
  let b = 2
}
console.log(a) // 1
console.log(b) // ReferenceError

const user = { name: 'Ali' }
user.name = 'Vali' // OK
user = {}          // TypeError`,
          followUp: 'What is the temporal dead zone?',
          level: 'junior',
        },
        {
          q: 'What is hoisting?',
          a: "Hoisting means that JavaScript moves declarations to the top of their scope before the code runs. A var variable is hoisted with the value undefined. let and const are also hoisted, but you cannot use them before the declaration. This zone is called the temporal dead zone. Function declarations are hoisted fully, so you can call them before they are defined.",
          uz: "Hoisting — JavaScript kod ishlashidan oldin e'lonlarni o'z scope'ining tepasiga ko'chirishi. var o'zgaruvchi undefined qiymati bilan ko'tariladi. let va const ham ko'tariladi, lekin ularni e'londan oldin ishlatib bo'lmaydi. Bu zona temporal dead zone deyiladi. Function declaration to'liq ko'tariladi, shuning uchun uni yozilishidan oldin chaqirish mumkin.",
          example: `console.log(x) // undefined
var x = 5

console.log(y) // ReferenceError (TDZ)
let y = 5

sayHi() // works
function sayHi() { console.log('Hi') }`,
          followUp: 'Are function expressions hoisted?',
          level: 'junior',
        },
        {
          q: 'How does "this" work in JavaScript?',
          a: "The value of this depends on how a function is called, not where it is written. If you call obj.method(), this is obj. In a normal function call in strict mode, this is undefined. With new, this is the new object. With call, apply or bind, we set this ourselves. Arrow functions don't have their own this. They take this from the outer scope.",
          uz: "this'ning qiymati funksiya qayerda yozilganiga emas, qanday chaqirilganiga bog'liq. obj.method() deb chaqirsangiz, this — obj. Strict mode'da oddiy funksiya chaqiruvida this — undefined. new bilan this — yangi object. call, apply yoki bind bilan this'ni o'zimiz belgilaymiz. Arrow function'larning o'z this'i yo'q. Ular this'ni tashqi scope'dan oladi.",
          example: `const user = {
  name: 'Ali',
  hi() { return this.name },
  hiArrow: () => this.name,
}
user.hi()       // 'Ali'
user.hiArrow()  // undefined (outer this)
const f = user.hi
f()             // error or undefined — lost this
const g = user.hi.bind(user)
g()             // 'Ali'`,
          followUp: 'What is the difference between call, apply and bind?',
          level: 'middle',
        },
        {
          q: 'What is the difference between == and ===?',
          a: "=== checks the value and the type, and it does not convert anything. == converts the types first and then compares. This can give strange results, for example 0 == '' is true. So I always use ===. The only common exception is x == null, which checks for null and undefined together.",
          uz: "=== qiymatni ham, type'ni ham tekshiradi va hech narsani o'zgartirmaydi. == avval type'larni o'zgartiradi, keyin solishtiradi. Bu g'alati natijalar berishi mumkin, masalan 0 == '' — true. Shuning uchun men doim === ishlataman. Yagona keng tarqalgan istisno — x == null, u null va undefined'ni birga tekshiradi.",
          example: `0 == ''          // true
0 === ''         // false
null == undefined  // true
null === undefined // false
'5' == 5         // true
'5' === 5        // false`,
          level: 'junior',
        },
        {
          q: 'What is prototypal inheritance?',
          a: "In JavaScript, every object has a hidden link to another object, called its prototype. When you read a property and the object does not have it, JavaScript looks in the prototype, then in the prototype of the prototype. This is called the prototype chain. Classes in JavaScript are just nicer syntax on top of prototypes.",
          uz: "JavaScript'da har bir object'ning boshqa object'ga yashirin bog'lanishi bor, u prototype deyiladi. Property o'qiyotganda object'da u bo'lmasa, JavaScript prototype'dan, keyin prototype'ning prototype'idan qidiradi. Bu prototype chain deyiladi. JavaScript'dagi class'lar — prototype'lar ustidagi qulayroq sintaksis, xolos.",
          example: `const animal = { eats: true }
const dog = Object.create(animal)
dog.barks = true
dog.eats // true (from prototype)

class User { hi() {} }
new User().hi === User.prototype.hi // true`,
          followUp: 'What is the difference between __proto__ and prototype?',
          level: 'middle',
        },
        {
          q: 'What is the difference between an arrow function and a regular function?',
          a: "An arrow function is shorter to write. It does not have its own this or arguments, it takes them from the outer scope. You cannot use an arrow function as a constructor with new. I use arrow functions for callbacks, and regular functions for object methods.",
          uz: "Arrow function yozishga qisqaroq. Uning o'z this'i va arguments'i yo'q, ularni tashqi scope'dan oladi. Arrow function'ni new bilan constructor sifatida ishlatib bo'lmaydi. Men arrow function'larni callback'lar uchun, oddiy funksiyalarni object method'lari uchun ishlataman.",
          example: `const timer = {
  seconds: 0,
  start() {
    setInterval(() => {
      this.seconds++ // arrow keeps this = timer
    }, 1000)
  },
}`,
          level: 'junior',
        },
        {
          q: 'What is the difference between null and undefined?',
          a: "undefined means a value was not given. For example, a variable without a value or a missing object property is undefined. null means empty on purpose. A developer sets null to say there is no value here. typeof null is 'object', which is an old bug in the language.",
          uz: "undefined — qiymat berilmagan degani. Masalan, qiymatsiz o'zgaruvchi yoki object'da yo'q property undefined bo'ladi. null — ataylab bo'sh degani. Dasturchi bu yerda qiymat yo'q deb ko'rsatish uchun null qo'yadi. typeof null — 'object', bu tildagi eski xato.",
          example: `let a
a              // undefined
const user = { name: null }
user.name      // null (set on purpose)
user.age       // undefined (missing)
typeof null    // 'object'`,
          level: 'junior',
        },
      ],
      resources: [
        { title: 'MDN — Closures', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures' },
        { title: 'MDN — this', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this' },
        { title: 'javascript.info — Prototypal inheritance', url: 'https://javascript.info/prototype-inheritance' },
      ],
    },

    // 2 ─────────────────────────────────────────────────────────────
    {
      id: 'fe-event-loop',
      title: 'Event loop, Promise, async/await',
      days: [30, 35, 80, 85],
      summary: "JavaScript single-threaded: bir vaqtda faqat bitta kod bajariladi (call stack). Uzoq ishlar (timer, network request) brauzer yoki Node.js API'lariga beriladi, natija tayyor bo'lganda callback navbatga (queue) qo'yiladi. Event loop call stack bo'shaganini kuzatadi va navbatdagi callback'ni stack'ka oladi. Ikki xil navbat bor: microtask (Promise.then, await, queueMicrotask) va macrotask (setTimeout, setInterval, I/O, event'lar). Har bir macrotask'dan keyin barcha microtask'lar bajariladi, shuning uchun Promise callback setTimeout(0)'dan oldin ishlaydi. Promise — kelajakdagi natija uchun object; async/await esa Promise bilan ishlashni oddiy, ketma-ket kod kabi yozish usuli.",
      keyPoints: [
        "JavaScript single-threaded — bitta call stack; async ishlar Web API / Node API'da bajariladi",
        "Event loop: stack bo'sh bo'lsa → avval BARCHA microtask'lar → keyin BITTA macrotask → render → takror",
        "Microtask: Promise.then/catch/finally, await'dan keyingi kod, queueMicrotask",
        "Macrotask: setTimeout, setInterval, I/O, UI event'lar",
        "Promise holatlari: pending → fulfilled yoki rejected (bir marta o'zgaradi)",
        "async funksiya doim Promise qaytaradi; xatolarni try/catch bilan ushlaymiz",
        "Parallel ishlar uchun Promise.all; biri xato bo'lsa ham hammasi kerak bo'lsa — Promise.allSettled",
      ],
      vocab: [
        { en: 'single-threaded', uz: 'bitta oqimli' },
        { en: 'call stack', uz: "chaqiruvlar stack'i" },
        { en: 'queue', uz: 'navbat' },
        { en: 'pending / fulfilled / rejected', uz: 'kutilmoqda / bajarildi / rad etildi' },
        { en: 'to block the main thread', uz: "asosiy oqimni to'sib qo'ymoq" },
        { en: 'in parallel', uz: 'parallel, bir vaqtda' },
        { en: 'to resolve / to reject', uz: 'muvaffaqiyatli tugatmoq / xato bilan tugatmoq' },
      ],
      questions: [
        {
          q: 'What is the event loop?',
          a: "JavaScript is single-threaded, so it runs one piece of code at a time on the call stack. Slow work, like timers or network requests, is done by the browser or Node.js. When this work is done, its callback goes into a queue. The event loop checks if the call stack is empty. If it is empty, it takes the next callback from the queue and runs it.",
          uz: "JavaScript single-threaded, shuning uchun call stack'da bir vaqtda bitta kod bo'lagini bajaradi. Sekin ishlarni, masalan timer yoki network request'larni brauzer yoki Node.js bajaradi. Bu ish tugaganda, uning callback'i navbatga tushadi. Event loop call stack bo'shmi yoki yo'qligini tekshiradi. Bo'sh bo'lsa, navbatdagi keyingi callback'ni olib bajaradi.",
          example: "Call stack → Web APIs (setTimeout, fetch) → queue → event loop → back to call stack",
          followUp: 'What happens if you run a very long loop on the main thread?',
          level: 'junior',
        },
        {
          q: 'What is the difference between a microtask and a macrotask?',
          a: "Both are queues for callbacks, but they have different priority. Microtasks are Promise callbacks, code after await, and queueMicrotask. Macrotasks are setTimeout, setInterval, I/O and UI events. After each macrotask, the event loop runs all microtasks first. That is why a Promise callback runs before setTimeout with zero delay.",
          uz: "Ikkalasi ham callback'lar navbati, lekin ustuvorligi har xil. Microtask'lar — Promise callback'lari, await'dan keyingi kod va queueMicrotask. Macrotask'lar — setTimeout, setInterval, I/O va UI event'lar. Har bir macrotask'dan keyin event loop avval barcha microtask'larni bajaradi. Shuning uchun Promise callback'i 0 kechikishli setTimeout'dan oldin ishlaydi.",
          example: `console.log('1')
setTimeout(() => console.log('2'), 0)
Promise.resolve().then(() => console.log('3'))
console.log('4')
// Output: 1, 4, 3, 2`,
          followUp: 'Can too many microtasks block rendering?',
          level: 'middle',
        },
        {
          q: 'What is a Promise?',
          a: "A Promise is an object for a result that will come in the future. It has three states: pending, fulfilled and rejected. When the work succeeds, we get the value in then. When it fails, we get the error in catch. A Promise changes its state only once.",
          uz: "Promise — kelajakda keladigan natija uchun object. Uning uchta holati bor: pending, fulfilled va rejected. Ish muvaffaqiyatli bo'lsa, qiymatni then'da olamiz. Xato bo'lsa, xatoni catch'da olamiz. Promise o'z holatini faqat bir marta o'zgartiradi.",
          example: `const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

fetch('/api/users')
  .then((res) => res.json())
  .then((users) => console.log(users))
  .catch((err) => console.error(err))
  .finally(() => console.log('done'))`,
          followUp: 'What is callback hell and how do Promises help?',
          level: 'junior',
        },
        {
          q: 'How does async/await work?',
          a: "async/await is a nicer way to write Promise code. An async function always returns a Promise. The await keyword pauses the function until the Promise is done, but it does not block the main thread. The code looks like normal step-by-step code, and we handle errors with try and catch.",
          uz: "async/await — Promise kodini yozishning qulayroq usuli. async funksiya doim Promise qaytaradi. await kalit so'zi Promise tugaguncha funksiyani to'xtatib turadi, lekin asosiy oqimni to'sib qo'ymaydi. Kod oddiy ketma-ket kodga o'xshaydi, xatolarni esa try va catch bilan ushlaymiz.",
          example: `async function loadUser(id) {
  try {
    const res = await fetch('/api/users/' + id)
    if (!res.ok) throw new Error('HTTP ' + res.status)
    return await res.json()
  } catch (err) {
    console.error('Failed to load user', err)
    throw err
  }
}`,
          followUp: 'Does fetch reject on a 404 response?',
          level: 'junior',
        },
        {
          q: 'How do you run several async requests in parallel?',
          a: "I use Promise.all. It starts all Promises together and waits for all of them. If one Promise fails, Promise.all fails right away. If I need all results even when some fail, I use Promise.allSettled. A common mistake is to await requests one by one in a loop when they don't depend on each other.",
          uz: "Men Promise.all ishlataman. U barcha Promise'larni birga boshlaydi va hammasini kutadi. Bitta Promise xato bo'lsa, Promise.all darhol xato bilan tugaydi. Ba'zilari xato bo'lsa ham barcha natijalar kerak bo'lsa, Promise.allSettled ishlataman. Keng tarqalgan xato — bir-biriga bog'liq bo'lmagan request'larni loop ichida birma-bir await qilish.",
          example: `// slow: one after another
const a = await getUser()
const b = await getOrders()

// fast: in parallel
const [user, orders] = await Promise.all([getUser(), getOrders()])

// all results, even failed ones
const results = await Promise.allSettled([p1, p2])`,
          followUp: 'What is the difference between Promise.race and Promise.any?',
          level: 'middle',
        },
        {
          q: 'Is JavaScript single-threaded? Then how can it do many things at once?',
          a: "Yes, JavaScript runs on one main thread. But the browser and Node.js have extra threads for timers, network and file I/O. JavaScript only starts this work and gives a callback. When the work is done, the event loop runs the callback. So JavaScript is single-threaded, but it is non-blocking. For heavy calculations, we can use Web Workers.",
          uz: "Ha, JavaScript bitta asosiy oqimda ishlaydi. Lekin brauzer va Node.js'da timer, network va fayl I/O uchun qo'shimcha oqimlar bor. JavaScript faqat bu ishni boshlaydi va callback beradi. Ish tugaganda event loop callback'ni bajaradi. Demak, JavaScript single-threaded, lekin non-blocking. Og'ir hisob-kitoblar uchun Web Worker'lardan foydalanish mumkin.",
          level: 'middle',
        },
      ],
      resources: [
        { title: 'javascript.info — Event loop', url: 'https://javascript.info/event-loop' },
        { title: 'javascript.info — Async/await', url: 'https://javascript.info/async-await' },
        { title: 'MDN — Using promises', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises' },
      ],
    },

    // 3 ─────────────────────────────────────────────────────────────
    {
      id: 'fe-components',
      title: 'Component, state, props, reactivity',
      days: [29, 33, 34, 35, 80, 85],
      summary: "Component — qayta ishlatiladigan UI bo'lagi: o'z template'i (HTML), logikasi va style'iga ega. Props — parent'dan child'ga beriladigan ma'lumot (child uni o'zgartirmaydi), state esa component'ning o'z ichki ma'lumoti. State o'zgarsa, UI avtomatik qayta render bo'ladi — bu reactivity. Vue Proxy orqali qaysi ma'lumot qayerda ishlatilganini kuzatadi va faqat kerakli joyni yangilaydi; React esa setState chaqirilganda component'ni qayta chaqiradi va virtual DOM'ni solishtiradi (diffing). Ikkalasida ham ma'lumot pastga props orqali, xabar yuqoriga event (Vue emit) yoki callback (React) orqali uzatiladi.",
      keyPoints: [
        "Component — qayta ishlatiladigan, mustaqil UI bo'lagi (template + logic + style)",
        "Props — parent'dan keladi, read-only; state — component'ning o'zi boshqaradi",
        "One-way data flow: ma'lumot pastga (props), xabar yuqoriga (emit / callback)",
        "Vue reactivity: ref/reactive → Proxy → o'zgarishni kuzatadi va faqat bog'liq joylarni yangilaydi",
        "React: useState → setState → component qayta render → virtual DOM diff → real DOM'ga minimal o'zgarish",
        "Ro'yxatlarda unique va barqaror key ishlating (index emas)",
        "Form: Vue'da v-model, React'da controlled input; validation — submit'da va input paytida",
      ],
      vocab: [
        { en: 'reusable', uz: 'qayta ishlatiladigan' },
        { en: 'to re-render', uz: 'qayta chizmoq (render qilmoq)' },
        { en: 'to pass data down', uz: "ma'lumotni pastga uzatmoq" },
        { en: 'parent / child component', uz: 'ota / bola component' },
        { en: 'read-only', uz: "faqat o'qish uchun" },
        { en: 'one-way data flow', uz: "bir tomonlama ma'lumot oqimi" },
        { en: 'to emit an event', uz: "event yubormoq (chiqarmoq)" },
        { en: 'validation', uz: "tekshirish (to'g'riligini)" },
      ],
      questions: [
        {
          q: 'What is a component?',
          a: "A component is a reusable piece of UI. It has its own template, logic and styles. We build a big page from many small components, like a button, a card or a form. This makes the code easier to read, test and reuse.",
          uz: "Component — qayta ishlatiladigan UI bo'lagi. Uning o'z template'i, logikasi va style'lari bor. Katta sahifani button, card yoki form kabi ko'plab kichik component'lardan quramiz. Bu kodni o'qish, test qilish va qayta ishlatishni osonlashtiradi.",
          example: `<!-- UserCard.vue -->
<script setup>
defineProps({ name: String, age: Number })
</script>

<template>
  <div class="card">{{ name }}, {{ age }}</div>
</template>`,
          level: 'junior',
        },
        {
          q: 'What is the difference between state and props?',
          a: "The main difference is who owns the data. Props come from the parent component, and the child should not change them. State is the component's own data, and the component can change it. When state or props change, the UI re-renders. We pass data down through props.",
          uz: "Asosiy farq — ma'lumot kimga tegishli ekanida. Props parent component'dan keladi va child ularni o'zgartirmasligi kerak. State — component'ning o'z ma'lumoti va component uni o'zgartira oladi. State yoki props o'zgarsa, UI qayta render bo'ladi. Ma'lumotni props orqali pastga uzatamiz.",
          example: `// React
function Counter({ step }) {         // step = prop
  const [count, setCount] = useState(0) // count = state
  return <button onClick={() => setCount(count + step)}>{count}</button>
}`,
          followUp: 'How does a child component send data back to the parent?',
          level: 'junior',
        },
        {
          q: 'How does a child component talk to its parent?',
          a: "Data goes down with props, and messages go up with events. In Vue, the child calls emit with an event name, and the parent listens with @event. In React, the parent passes a callback function as a prop, and the child calls it. For data that many components share, we use a store.",
          uz: "Ma'lumot props bilan pastga, xabarlar esa event'lar bilan yuqoriga boradi. Vue'da child event nomi bilan emit chaqiradi, parent esa @event bilan tinglaydi. React'da parent callback funksiyani prop sifatida beradi, child esa uni chaqiradi. Ko'p component'lar bo'lishadigan ma'lumot uchun store ishlatamiz.",
          example: `<!-- Child.vue -->
<script setup>
const emit = defineEmits(['save'])
</script>
<template>
  <button @click="emit('save', 42)">Save</button>
</template>

<!-- Parent.vue -->
<Child @save="(id) => console.log(id)" />`,
          level: 'junior',
        },
        {
          q: 'How does reactivity work in Vue?',
          a: "In Vue 3, ref and reactive wrap data in a JavaScript Proxy. When a component reads the data during render, Vue remembers this dependency. When the data changes, Vue knows exactly which components and computed values use it. It updates only those parts. So we just change the data, and the UI updates by itself.",
          uz: "Vue 3'da ref va reactive ma'lumotni JavaScript Proxy ichiga o'raydi. Component render paytida ma'lumotni o'qiganda, Vue bu bog'liqlikni eslab qoladi. Ma'lumot o'zgarganda, Vue uni aynan qaysi component'lar va computed qiymatlar ishlatishini biladi. U faqat o'sha qismlarni yangilaydi. Demak, biz faqat ma'lumotni o'zgartiramiz, UI esa o'zi yangilanadi.",
          example: `import { ref, computed } from 'vue'
const price = ref(100)
const qty = ref(2)
const total = computed(() => price.value * qty.value)
qty.value = 3 // total becomes 300 automatically`,
          followUp: 'What is the difference between ref and reactive?',
          level: 'middle',
        },
        {
          q: 'What is the virtual DOM?',
          a: "The virtual DOM is a light copy of the real DOM in JavaScript objects. When state changes, the framework creates a new virtual DOM tree and compares it with the old one. This is called diffing. Then it changes only the real DOM nodes that are different. Working with the real DOM is slow, so this saves time.",
          uz: "Virtual DOM — real DOM'ning JavaScript object'laridagi yengil nusxasi. State o'zgarganda framework yangi virtual DOM daraxtini yaratadi va uni eskisi bilan solishtiradi. Bu diffing deyiladi. Keyin faqat farq qiladigan real DOM node'larini o'zgartiradi. Real DOM bilan ishlash sekin, shuning uchun bu vaqtni tejaydi.",
          followUp: 'Is the virtual DOM always faster than direct DOM updates?',
          level: 'junior',
        },
        {
          q: 'What is the main difference between Vue and React?',
          a: "Both are component-based and use a virtual DOM. The main difference is reactivity. Vue tracks dependencies automatically, so it knows what to update. React re-runs the component function when state changes, and we sometimes optimize it with memo. Vue uses HTML-like templates, and React uses JSX. Vue gives official tools like Vue Router and Pinia, and React is more flexible. It depends on the team and the project.",
          uz: "Ikkalasi ham component'larga asoslangan va virtual DOM ishlatadi. Asosiy farq — reactivity'da. Vue bog'liqliklarni avtomatik kuzatadi, shuning uchun nimani yangilashni biladi. React state o'zgarganda component funksiyasini qayta ishga tushiradi va ba'zan uni memo bilan optimizatsiya qilamiz. Vue HTML'ga o'xshash template'lar, React esa JSX ishlatadi. Vue Vue Router va Pinia kabi rasmiy vositalarni beradi, React esa erkinroq. Bu jamoa va loyihaga bog'liq.",
          level: 'middle',
        },
        {
          q: 'Why do we need a key when we render a list?',
          a: "The key helps the framework understand which item is which between renders. With a stable key, it can move, add or remove only the changed items. If we use the array index as a key and the list order changes, the framework can mix up items and their state. So I use a unique id from the data.",
          uz: "Key framework'ga render'lar orasida qaysi element qaysi ekanini tushunishga yordam beradi. Barqaror key bilan u faqat o'zgargan element'larni ko'chiradi, qo'shadi yoki o'chiradi. Agar array index'ini key qilsak va ro'yxat tartibi o'zgarsa, framework element'lar va ularning state'ini aralashtirib yuborishi mumkin. Shuning uchun men ma'lumotdagi unique id'ni ishlataman.",
          example: `<li v-for="task in tasks" :key="task.id">{{ task.title }}</li>

// React
{tasks.map((task) => <li key={task.id}>{task.title}</li>)}`,
          level: 'junior',
        },
        {
          q: 'How do you handle forms and form validation?',
          a: "In Vue, I connect inputs to state with v-model. In React, I use controlled inputs with value and onChange. I validate on submit, and sometimes when the user leaves the field. I show a clear error message next to the field and disable the submit button while the request is running. I always validate on the backend too, because frontend checks are easy to skip.",
          uz: "Vue'da input'larni state'ga v-model bilan bog'layman. React'da value va onChange bilan controlled input ishlataman. Submit paytida, ba'zan esa foydalanuvchi maydondan chiqqanda tekshiraman. Maydon yonida aniq xato xabarini ko'rsataman va request ketayotganda submit tugmasini o'chirib qo'yaman. Backend'da ham doim tekshiraman, chunki frontend tekshiruvini aylanib o'tish oson.",
          example: `<script setup>
import { ref } from 'vue'
const email = ref('')
const error = ref('')
function submit() {
  error.value = /^\\S+@\\S+\\.\\S+$/.test(email.value) ? '' : 'Invalid email'
  if (error.value) return
  // send request
}
</script>
<template>
  <form @submit.prevent="submit">
    <input v-model="email" type="email" />
    <p v-if="error" class="error">{{ error }}</p>
    <button>Send</button>
  </form>
</template>`,
          level: 'junior',
        },
      ],
      resources: [
        { title: 'Vue — Components Basics', url: 'https://vuejs.org/guide/essentials/component-basics.html' },
        { title: 'Vue — Reactivity in Depth', url: 'https://vuejs.org/guide/extras/reactivity-in-depth.html' },
        { title: 'React — Learn', url: 'https://react.dev/learn' },
      ],
    },

    // 4 ─────────────────────────────────────────────────────────────
    {
      id: 'fe-lifecycle-state',
      title: 'Lifecycle, state management, routing',
      days: [31, 33, 35, 80, 85],
      summary: "Lifecycle — component'ning hayot bosqichlari: yaratilish, DOM'ga qo'shilish (mount), yangilanish (update) va o'chirilish (unmount). Vue'da onMounted, onUpdated, onUnmounted hook'lari bor; React'da bularning hammasi useEffect bilan qilinadi. State management — ko'p component'lar bo'lishadigan ma'lumotni (user, cart, token) bitta markaziy joyda (store) saqlash: Vue'da Pinia (avval Vuex), React'da Redux, Zustand yoki Context. Store g'oyasi: state bitta joyda, uni faqat action'lar orqali o'zgartiramiz, component'lar esa o'qiydi. Routing — SPA'da sahifani qayta yuklamasdan URL'ga qarab component almashtirish (Vue Router, React Router).",
      keyPoints: [
        "Vue: setup → onMounted (DOM tayyor, fetch shu yerda) → onUpdated → onUnmounted (tozalash)",
        "React: useEffect(fn, []) — mount'da; [dep] — dep o'zgarganda; return () => {} — cleanup",
        "Unmount'da timer, event listener, subscription'larni tozalang — aks holda memory leak",
        "Global state: Pinia (state, getters, actions) / Redux (store, action, reducer, dispatch)",
        "Prop drilling'dan qochish: store, Vue provide/inject, React Context",
        "computed — keshlangan, hosila qiymat; watch — o'zgarishga javoban side effect",
        "Client-side routing: History API, lazy-loaded route'lar, route guard'lar (auth)",
      ],
      vocab: [
        { en: 'lifecycle hook', uz: "hayot bosqichi hook'i" },
        { en: 'to mount / unmount', uz: "DOM'ga qo'shmoq / olib tashlamoq" },
        { en: 'side effect', uz: "qo'shimcha ta'sir (fetch, timer, DOM)" },
        { en: 'cleanup', uz: 'tozalash' },
        { en: 'store', uz: "markaziy state ombori" },
        { en: 'single source of truth', uz: "yagona haqiqat manbai" },
        { en: 'prop drilling', uz: "props'ni ko'p qavat orqali uzatish" },
        { en: 'route guard', uz: "route'ga kirishni tekshiruvchi" },
      ],
      questions: [
        {
          q: 'Can you explain the component lifecycle?',
          a: "A component is created, mounted, updated and finally unmounted. Mounted means it is now in the DOM. In Vue, I use onMounted to fetch data or work with the DOM, and onUnmounted to clean up. In React, I do the same with useEffect. The cleanup is important, because timers and event listeners can cause memory leaks.",
          uz: "Component yaratiladi, mount qilinadi, yangilanadi va oxirida unmount qilinadi. Mounted — u endi DOM'da degani. Vue'da ma'lumot olish yoki DOM bilan ishlash uchun onMounted, tozalash uchun onUnmounted ishlataman. React'da xuddi shuni useEffect bilan qilaman. Tozalash muhim, chunki timer va event listener'lar memory leak'ga olib kelishi mumkin.",
          example: `// Vue
onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))

// React
useEffect(() => {
  window.addEventListener('resize', onResize)
  return () => window.removeEventListener('resize', onResize)
}, [])`,
          level: 'junior',
        },
        {
          q: 'How does useEffect work, and what is the dependency array?',
          a: "useEffect runs a side effect after React renders the component. The dependency array tells React when to run it again. An empty array means run once after the first render. With values inside, it runs again when those values change. If the effect returns a function, React calls it for cleanup before the next run and on unmount.",
          uz: "useEffect React component'ni render qilgandan keyin side effect'ni bajaradi. Dependency array React'ga uni qachon qayta ishga tushirishni aytadi. Bo'sh array — birinchi render'dan keyin bir marta. Ichida qiymatlar bo'lsa, o'sha qiymatlar o'zgarganda qayta ishlaydi. Agar effect funksiya qaytarsa, React uni keyingi ishga tushishdan oldin va unmount'da tozalash uchun chaqiradi.",
          example: `useEffect(() => {
  const controller = new AbortController()
  fetch('/api/users?q=' + query, { signal: controller.signal })
    .then((r) => r.json())
    .then(setUsers)
  return () => controller.abort() // cleanup
}, [query])`,
          followUp: 'What happens if you forget a dependency?',
          level: 'middle',
        },
        {
          q: 'Why do we need state management like Pinia or Redux?',
          a: "When many components need the same data, like the current user or a cart, passing props through many levels becomes hard. A store keeps this shared state in one place. Components read from the store, and they change it only through actions. This makes the data flow clear and easy to debug. For small apps, local state is often enough.",
          uz: "Ko'p component'larga bir xil ma'lumot kerak bo'lsa, masalan joriy user yoki savat, props'ni ko'p qavat orqali uzatish qiyinlashadi. Store bu umumiy state'ni bitta joyda saqlaydi. Component'lar store'dan o'qiydi va uni faqat action'lar orqali o'zgartiradi. Bu ma'lumot oqimini tushunarli va debug qilishni oson qiladi. Kichik ilovalar uchun ko'pincha local state yetarli.",
          example: `// Pinia store
export const useCartStore = defineStore('cart', {
  state: () => ({ items: [] }),
  getters: {
    total: (s) => s.items.reduce((sum, i) => sum + i.price, 0),
  },
  actions: {
    add(item) { this.items.push(item) },
  },
})`,
          followUp: 'What do you put in the store, and what do you keep local?',
          level: 'middle',
        },
        {
          q: 'What is the main idea of Redux?',
          a: "Redux keeps all shared state in one store. The state is read-only. To change it, we dispatch an action, which is a plain object that describes what happened. A reducer is a pure function. It takes the old state and the action, and returns a new state. This one-way flow makes changes easy to predict. Today, Redux Toolkit makes this code much shorter.",
          uz: "Redux barcha umumiy state'ni bitta store'da saqlaydi. State read-only. Uni o'zgartirish uchun action dispatch qilamiz — bu nima bo'lganini tasvirlaydigan oddiy object. Reducer — pure funksiya. U eski state va action'ni olib, yangi state qaytaradi. Bu bir tomonlama oqim o'zgarishlarni oldindan bilishni oson qiladi. Hozir Redux Toolkit bu kodni ancha qisqartiradi.",
          example: `function cartReducer(state = [], action) {
  switch (action.type) {
    case 'cart/add':
      return [...state, action.payload] // new array, no mutation
    default:
      return state
  }
}
store.dispatch({ type: 'cart/add', payload: { id: 1 } })`,
          level: 'middle',
        },
        {
          q: 'What is prop drilling and how do you avoid it?',
          a: "Prop drilling is when we pass props through many components that don't use them, only to reach a deep child. It makes the code hard to change. To avoid it, I use provide and inject in Vue, or Context in React. For global app state, I use a store like Pinia or Redux.",
          uz: "Prop drilling — chuqurdagi child'ga yetkazish uchun props'ni ularni ishlatmaydigan ko'plab component'lar orqali uzatish. Bu kodni o'zgartirishni qiyinlashtiradi. Undan qochish uchun Vue'da provide va inject, React'da Context ishlataman. Global ilova state'i uchun Pinia yoki Redux kabi store ishlataman.",
          example: `// Vue
provide('theme', theme)          // in a parent
const theme = inject('theme')    // in any deep child`,
          level: 'junior',
        },
        {
          q: 'What is the difference between computed and watch in Vue?',
          a: "computed is for a value that we calculate from other reactive data. It is cached, so it runs again only when its dependencies change. watch is for side effects. It runs a function when some data changes, for example to call an API or save to localStorage. If I need a value, I use computed. If I need to do something, I use watch.",
          uz: "computed — boshqa reactive ma'lumotdan hisoblanadigan qiymat uchun. U keshlanadi, shuning uchun faqat bog'liqliklari o'zgarganda qayta ishlaydi. watch — side effect'lar uchun. U qandaydir ma'lumot o'zgarganda funksiyani ishga tushiradi, masalan API chaqirish yoki localStorage'ga saqlash uchun. Qiymat kerak bo'lsa — computed. Biror ish qilish kerak bo'lsa — watch.",
          example: `const fullName = computed(() => first.value + ' ' + last.value)

watch(search, async (q) => {
  results.value = await api.search(q)
})`,
          level: 'junior',
        },
        {
          q: 'How does client-side routing work in a single-page application?',
          a: "In an SPA, the server sends one HTML page. The router listens to URL changes with the History API and shows the right component without a full page reload. This makes navigation fast. We can lazy load each route, and use route guards to protect private pages. The server must return index.html for every route, or a page refresh gives a 404.",
          uz: "SPA'da server bitta HTML sahifa yuboradi. Router History API orqali URL o'zgarishlarini tinglaydi va sahifani to'liq qayta yuklamasdan kerakli component'ni ko'rsatadi. Bu navigatsiyani tez qiladi. Har bir route'ni lazy load qilish va private sahifalarni himoya qilish uchun route guard ishlatish mumkin. Server har bir route uchun index.html qaytarishi kerak, aks holda sahifani yangilash 404 beradi.",
          example: `const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/board/:id', component: () => import('./Board.vue'), meta: { auth: true } },
  ],
})
router.beforeEach((to) => {
  if (to.meta.auth && !isLoggedIn()) return '/login'
})`,
          level: 'middle',
        },
      ],
      resources: [
        { title: 'Vue — Lifecycle Hooks', url: 'https://vuejs.org/guide/essentials/lifecycle.html' },
        { title: 'React — useEffect', url: 'https://react.dev/reference/react/useEffect' },
        { title: 'Pinia', url: 'https://pinia.vuejs.org/' },
      ],
    },

    // 5 ─────────────────────────────────────────────────────────────
    {
      id: 'fe-performance',
      title: 'Frontend performance: memo, lazy loading, code splitting',
      days: [33, 35, 80, 85],
      summary: "Frontend performance ikki qismdan iborat: sahifa qanchalik tez yuklanadi va qanchalik tez javob beradi. Yuklanishni tezlashtirish uchun bundle'ni kichraytiramiz: code splitting, lazy loading (route, component, rasm), tree shaking, rasmlarni siqish va CDN. Render'ni tezlashtirish uchun ortiqcha qayta render'larni kamaytiramiz: React'da React.memo, useMemo, useCallback; Vue'da computed va v-memo. Uzun ro'yxatlar uchun virtualization (faqat ko'rinadigan qatorlarni render qilish), tez-tez bo'ladigan event'lar uchun debounce/throttle ishlatiladi. Avval o'lchang (Lighthouse, DevTools, Core Web Vitals), keyin optimizatsiya qiling.",
      keyPoints: [
        "Avval o'lchash: Lighthouse, DevTools Performance, Core Web Vitals (LCP, INP, CLS)",
        "Code splitting — bundle'ni bo'laklarga bo'lish; dynamic import() orqali",
        "Lazy loading — faqat kerak bo'lganda yuklash: route, og'ir component, rasm (loading=\"lazy\")",
        "React.memo — props o'zgarmasa qayta render qilmaydi; useMemo — qiymatni, useCallback — funksiyani keshlaydi",
        "Uzun ro'yxat → virtualization / pagination; input → debounce",
        "Tree shaking — ishlatilmagan kodni bundle'dan olib tashlash (ES modules kerak)",
        "Rasmlar: WebP/AVIF, to'g'ri o'lcham, CDN, caching header'lar",
      ],
      vocab: [
        { en: 'bundle', uz: "yig'ilgan JS fayl" },
        { en: 'to lazy load', uz: "kerak bo'lganda yuklamoq" },
        { en: 'code splitting', uz: "kodni bo'laklarga bo'lish" },
        { en: 'to cache / memoize', uz: 'keshlamoq, natijani eslab qolmoq' },
        { en: 'unnecessary re-render', uz: 'keraksiz qayta render' },
        { en: 'bottleneck', uz: "tor joy (sekinlik sababi)" },
        { en: 'to measure', uz: "o'lchamoq" },
      ],
      questions: [
        {
          q: 'How do you improve the performance of a frontend application?',
          a: "First, I measure with Lighthouse and the DevTools Performance tab, so I know the real bottleneck. To load faster, I make the bundle smaller with code splitting and lazy loading, and I optimize images. To render faster, I avoid unnecessary re-renders and use virtualization for long lists. I also cache API data and use debounce for search inputs.",
          uz: "Avval Lighthouse va DevTools Performance tab'i bilan o'lchayman, shunda haqiqiy tor joyni bilaman. Tezroq yuklash uchun code splitting va lazy loading bilan bundle'ni kichraytiraman va rasmlarni optimizatsiya qilaman. Tezroq render uchun keraksiz qayta render'lardan qochaman va uzun ro'yxatlar uchun virtualization ishlataman. Shuningdek, API ma'lumotlarini keshlayman va search input'lar uchun debounce ishlataman.",
          followUp: 'What are Core Web Vitals?',
          level: 'middle',
        },
        {
          q: 'What is lazy loading?',
          a: "Lazy loading means we load something only when it is needed. For example, we load a page's code only when the user opens that route. We can also lazy load heavy components and images below the screen. This makes the first load faster, because the browser downloads less code at the start.",
          uz: "Lazy loading — biror narsani faqat kerak bo'lganda yuklash. Masalan, sahifa kodini faqat foydalanuvchi o'sha route'ni ochganda yuklaymiz. Og'ir component'lar va ekrandan pastdagi rasmlarni ham lazy load qilish mumkin. Bu birinchi yuklanishni tezlashtiradi, chunki brauzer boshida kamroq kod yuklaydi.",
          example: `// Vue route
{ path: '/reports', component: () => import('./Reports.vue') }

// React
const Reports = React.lazy(() => import('./Reports'))
<Suspense fallback={<Spinner />}><Reports /></Suspense>

// Image
<img src="photo.jpg" loading="lazy" alt="Photo" />`,
          level: 'junior',
        },
        {
          q: 'What is code splitting?',
          a: "Code splitting means we split one big JavaScript bundle into smaller chunks. The bundler, like Vite or webpack, does this when we use dynamic import. The user downloads only the chunks for the current page. Code splitting and lazy loading usually work together.",
          uz: "Code splitting — bitta katta JavaScript bundle'ni kichikroq bo'laklarga (chunk) bo'lish. Dynamic import ishlatsak, Vite yoki webpack kabi bundler buni qiladi. Foydalanuvchi faqat joriy sahifa uchun kerakli bo'laklarni yuklaydi. Code splitting va lazy loading odatda birga ishlaydi.",
          example: `button.addEventListener('click', async () => {
  const { exportToPdf } = await import('./pdf.js') // separate chunk
  exportToPdf(data)
})`,
          level: 'junior',
        },
        {
          q: 'What is the difference between React.memo, useMemo and useCallback?',
          a: "React.memo wraps a component. It skips the re-render if the props are the same. useMemo caches the result of a heavy calculation between renders. useCallback caches a function, so a memoized child gets the same function reference. I don't use them everywhere, only when I see a real performance problem, because they also have a cost.",
          uz: "React.memo component'ni o'raydi. Props bir xil bo'lsa, qayta render'ni o'tkazib yuboradi. useMemo og'ir hisob-kitob natijasini render'lar orasida keshlaydi. useCallback funksiyani keshlaydi, shunda memo qilingan child bir xil funksiya reference'ini oladi. Men ularni hamma joyda ishlatmayman, faqat haqiqiy performance muammosini ko'rganda, chunki ularning ham narxi bor.",
          example: `const Row = React.memo(function Row({ item, onSelect }) {
  return <li onClick={() => onSelect(item.id)}>{item.name}</li>
})

function List({ items, query }) {
  const filtered = useMemo(
    () => items.filter((i) => i.name.includes(query)),
    [items, query]
  )
  const onSelect = useCallback((id) => console.log(id), [])
  return filtered.map((i) => <Row key={i.id} item={i} onSelect={onSelect} />)
}`,
          followUp: 'Why does Vue need these optimizations less often?',
          level: 'middle',
        },
        {
          q: 'How do you render a list with 10,000 items?',
          a: "I don't render all 10,000 DOM nodes at once, because it is slow. The first option is pagination or infinite scroll from the backend. The second option is virtualization. It renders only the rows that are visible on the screen, plus a few extra. Libraries like vue-virtual-scroller or react-window do this.",
          uz: "10 000 ta DOM node'ni birdaniga render qilmayman, chunki bu sekin. Birinchi variant — backend'dan pagination yoki infinite scroll. Ikkinchi variant — virtualization. U faqat ekranda ko'rinadigan qatorlarni va bir nechta qo'shimchasini render qiladi. vue-virtual-scroller yoki react-window kabi kutubxonalar buni qiladi.",
          level: 'middle',
        },
        {
          q: 'What are Core Web Vitals?',
          a: "Core Web Vitals are three metrics from Google that measure user experience. LCP, Largest Contentful Paint, shows how fast the main content loads. INP, Interaction to Next Paint, shows how fast the page responds to clicks. CLS, Cumulative Layout Shift, shows how much the layout jumps. They also affect SEO.",
          uz: "Core Web Vitals — Google'ning foydalanuvchi tajribasini o'lchaydigan uchta metrikasi. LCP (Largest Contentful Paint) asosiy kontent qanchalik tez yuklanishini ko'rsatadi. INP (Interaction to Next Paint) sahifa bosishlarga qanchalik tez javob berishini ko'rsatadi. CLS (Cumulative Layout Shift) layout qanchalik sakrashini ko'rsatadi. Ular SEO'ga ham ta'sir qiladi.",
          level: 'middle',
        },
        {
          q: 'What is tree shaking?',
          a: "Tree shaking is when the bundler removes code that we never use. It works with ES modules, because import and export are static, so the bundler can see what is used. For example, if I import one function from a library, only that function goes into the bundle. This makes the bundle smaller.",
          uz: "Tree shaking — bundler hech qachon ishlatilmaydigan kodni olib tashlashi. U ES modules bilan ishlaydi, chunki import va export statik, shuning uchun bundler nima ishlatilganini ko'ra oladi. Masalan, kutubxonadan bitta funksiyani import qilsam, bundle'ga faqat o'sha funksiya tushadi. Bu bundle'ni kichraytiradi.",
          example: `import { debounce } from 'lodash-es' // only debounce is bundled
// vs
import _ from 'lodash'                // whole library`,
          level: 'junior',
        },
      ],
      resources: [
        { title: 'Vue — Performance', url: 'https://vuejs.org/guide/best-practices/performance.html' },
        { title: 'React — memo', url: 'https://react.dev/reference/react/memo' },
        { title: 'React — lazy', url: 'https://react.dev/reference/react/lazy' },
      ],
    },

    // 6 ─────────────────────────────────────────────────────────────
    {
      id: 'fe-ssr-csr',
      title: 'SSR, CSR, SSG va SEO',
      days: [32, 35, 80, 85],
      summary: "CSR (client-side rendering) — server bo'sh HTML va JS yuboradi, sahifani brauzer JavaScript bilan quradi (oddiy Vue/React SPA). SSR (server-side rendering) — HTML har bir request'da serverda tayyorlanadi, foydalanuvchi kontentni tezroq ko'radi va qidiruv tizimlari uni oson o'qiydi (Nuxt, Next.js). SSG (static site generation) — HTML build vaqtida bir marta yaratiladi va CDN'dan beriladi; blog, dokumentatsiya uchun juda tez. Hydration — serverdan kelgan tayyor HTML'ga brauzerda JavaScript ulanib, sahifani interaktiv qilish. Tanlov loyihaga bog'liq: SEO muhim public sahifalar uchun SSR/SSG, login orqasidagi dashboard uchun CSR yetarli.",
      keyPoints: [
        "CSR: bo'sh HTML + JS → brauzer render qiladi; server oddiy, lekin birinchi ko'rinish sekinroq, SEO zaifroq",
        "SSR: har request'da serverda HTML; tez birinchi kontent, yaxshi SEO; server yuklamasi ko'proq",
        "SSG: build'da HTML yaratiladi → CDN; eng tez, lekin ma'lumot tez o'zgarsa qayta build kerak",
        "Hydration: server HTML'iga JS ulanib, event'lar ishlay boshlaydi",
        "Framework'lar: Nuxt (Vue), Next.js (React) — SSR, SSG, hybrid",
        "SEO: semantic HTML, title/meta description, sitemap, tez yuklanish, server render qilingan kontent",
        "Dashboard/admin panel → CSR; landing, blog, e-commerce katalog → SSR/SSG",
      ],
      vocab: [
        { en: 'server-side rendering', uz: "serverda render qilish" },
        { en: 'client-side rendering', uz: 'brauzerda render qilish' },
        { en: 'static site generation', uz: 'statik sayt generatsiyasi' },
        { en: 'hydration', uz: "HTML'ga JS ulanib interaktiv bo'lishi" },
        { en: 'search engine', uz: 'qidiruv tizimi' },
        { en: 'crawler', uz: "sahifalarni o'qiydigan bot" },
        { en: 'first load', uz: 'birinchi yuklanish' },
      ],
      questions: [
        {
          q: 'What is the difference between SSR and CSR?',
          a: "The main difference is where the HTML is built. With CSR, the server sends an almost empty HTML and JavaScript, and the browser builds the page. With SSR, the server builds the full HTML for each request. SSR shows content faster and helps SEO. CSR is simpler to host and feels fast after the first load. It depends on the use case.",
          uz: "Asosiy farq — HTML qayerda quriladi. CSR'da server deyarli bo'sh HTML va JavaScript yuboradi, sahifani esa brauzer quradi. SSR'da server har bir request uchun to'liq HTML quradi. SSR kontentni tezroq ko'rsatadi va SEO'ga yordam beradi. CSR'ni host qilish oddiyroq va birinchi yuklanishdan keyin tez ishlaydi. Bu qaysi holatga bog'liq.",
          followUp: 'Which one would you choose for an admin dashboard?',
          level: 'junior',
        },
        {
          q: 'What is SSG, static site generation?',
          a: "With SSG, we build all the HTML pages once, at build time. Then we put them on a CDN. It is very fast and cheap, because the server does no work on each request. It is good for blogs, docs and landing pages. The problem is that if the data changes often, we need to rebuild the site.",
          uz: "SSG'da barcha HTML sahifalarni bir marta, build vaqtida quramiz. Keyin ularni CDN'ga joylaymiz. Bu juda tez va arzon, chunki server har bir request'da ish qilmaydi. Blog, dokumentatsiya va landing sahifalar uchun yaxshi. Muammo shundaki, ma'lumot tez-tez o'zgarsa, saytni qayta build qilish kerak.",
          level: 'junior',
        },
        {
          q: 'What is hydration?',
          a: "Hydration happens after SSR. The browser first shows the HTML from the server, but buttons don't work yet. Then the JavaScript loads, and the framework attaches event listeners and state to this HTML. After that, the page is interactive. If the server HTML and the client render are different, we get a hydration mismatch error.",
          uz: "Hydration SSR'dan keyin sodir bo'ladi. Brauzer avval serverdan kelgan HTML'ni ko'rsatadi, lekin tugmalar hali ishlamaydi. Keyin JavaScript yuklanadi va framework bu HTML'ga event listener'lar va state'ni ulaydi. Shundan keyin sahifa interaktiv bo'ladi. Agar server HTML'i va client render farq qilsa, hydration mismatch xatosi chiqadi.",
          followUp: 'What can cause a hydration mismatch?',
          level: 'middle',
        },
        {
          q: 'Why is SSR better for SEO?',
          a: "With SSR, the HTML already contains the full content when it comes from the server. Search engine crawlers can read the text, title and links right away. With CSR, the crawler gets an almost empty page and must run JavaScript to see the content. Google can do this, but it is slower and less reliable, and many other bots cannot.",
          uz: "SSR'da HTML serverdan kelganda to'liq kontentga ega bo'ladi. Qidiruv tizimi crawler'lari matn, title va link'larni darhol o'qiy oladi. CSR'da crawler deyarli bo'sh sahifa oladi va kontentni ko'rish uchun JavaScript'ni ishga tushirishi kerak. Google buni qila oladi, lekin bu sekinroq va kamroq ishonchli, ko'plab boshqa bot'lar esa qila olmaydi.",
          level: 'junior',
        },
        {
          q: 'How can you improve SEO in a single-page application?',
          a: "The best way is to use SSR or SSG with Nuxt or Next.js, or pre-render the important pages. I also set a unique title and meta description for each page. I use semantic HTML, like h1, nav and article, and real links. I add a sitemap and make the page load fast, because speed also affects ranking.",
          uz: "Eng yaxshi yo'l — Nuxt yoki Next.js bilan SSR yoki SSG ishlatish, yoki muhim sahifalarni oldindan render qilish (pre-render). Shuningdek, har bir sahifa uchun unique title va meta description qo'yaman. h1, nav, article kabi semantic HTML va haqiqiy link'lar ishlataman. Sitemap qo'shaman va sahifani tez yuklanadigan qilaman, chunki tezlik ham reytingga ta'sir qiladi.",
          level: 'middle',
        },
        {
          q: 'What are the downsides of SSR?',
          a: "The trade-off is complexity and cost. The server must render HTML for every request, so it needs more CPU and a Node.js server. The code must work on both the server and the browser, so we cannot use window or localStorage everywhere. Also, the page is visible before it is interactive, until hydration finishes.",
          uz: "Trade-off — murakkablik va xarajat. Server har bir request uchun HTML render qilishi kerak, shuning uchun ko'proq CPU va Node.js server kerak. Kod ham serverda, ham brauzerda ishlashi kerak, shuning uchun window yoki localStorage'ni hamma joyda ishlata olmaymiz. Bundan tashqari, hydration tugaguncha sahifa ko'rinadi, lekin hali interaktiv emas.",
          level: 'middle',
        },
      ],
      resources: [
        { title: 'Vue — Server-Side Rendering', url: 'https://vuejs.org/guide/scaling-up/ssr.html' },
        { title: 'Nuxt — Docs', url: 'https://nuxt.com/docs' },
      ],
    },

    // 7 ─────────────────────────────────────────────────────────────
    {
      id: 'fe-browser',
      title: 'Brauzer: rendering, CORS, storage, XSS',
      days: [32, 35, 80, 85],
      summary: "Brauzer sahifani shunday chizadi: HTML'dan DOM, CSS'dan CSSOM quriladi, ular birlashib render tree bo'ladi, keyin layout (o'lcham va joylashuv), paint (piksellar) va composite (qatlamlarni birlashtirish). Layout'ni o'zgartirish (width, top) reflow chaqiradi va qimmat; faqat rangni o'zgartirish — repaint; transform va opacity esa faqat composite'ni ishlatadi. CORS — brauzerning xavfsizlik qoidasi: boshqa origin'ga request faqat server Access-Control-Allow-Origin header'i bilan ruxsat bersa ishlaydi. Ma'lumot saqlash: cookie har request bilan serverga ketadi (httpOnly bo'lsa JS o'qiy olmaydi), localStorage doimiy, sessionStorage esa tab yopilguncha. XSS — saytga begona script kiritish hujumi; himoya — output'ni escape qilish, innerHTML/v-html'dan qochish va CSP.",
      keyPoints: [
        "Critical rendering path: HTML → DOM, CSS → CSSOM → render tree → layout → paint → composite",
        "Reflow (layout) qimmat; animatsiya uchun transform va opacity ishlating",
        "<script defer> / async — HTML parse'ni to'smaydi",
        "Origin = protocol + domain + port; CORS'ni server header'lar bilan sozlaydi, frontend emas",
        "Preflight — PUT/DELETE, custom header yoki JSON uchun avval OPTIONS request",
        "Cookie (~4KB, har request'da ketadi, httpOnly/Secure/SameSite) vs localStorage (~5MB, doimiy) vs sessionStorage (tab'gacha)",
        "XSS himoyasi: escape, v-html/dangerouslySetInnerHTML'dan qochish, sanitize, CSP, token'ni httpOnly cookie'da",
      ],
      vocab: [
        { en: 'origin', uz: 'manba (protocol + domain + port)' },
        { en: 'cross-origin request', uz: "boshqa origin'ga request" },
        { en: 'preflight request', uz: "oldindan tekshiruv request'i (OPTIONS)" },
        { en: 'reflow / repaint', uz: "qayta joylashtirish / qayta bo'yash" },
        { en: 'to inject a script', uz: "script kiritib yubormoq" },
        { en: 'to escape / sanitize', uz: 'xavfsiz qilmoq / tozalamoq' },
        { en: 'storage', uz: 'saqlash joyi' },
        { en: 'expire', uz: "muddati tugamoq" },
      ],
      questions: [
        {
          q: 'How does the browser render a page?',
          a: "First, the browser parses HTML into the DOM and CSS into the CSSOM. Then it combines them into the render tree. In the layout step, it calculates the size and position of each element. In the paint step, it draws the pixels. Finally, it composites the layers on the screen. JavaScript can block parsing, so we use defer for scripts.",
          uz: "Avval brauzer HTML'ni DOM'ga, CSS'ni CSSOM'ga parse qiladi. Keyin ularni render tree'ga birlashtiradi. Layout bosqichida har bir element'ning o'lchami va joylashuvini hisoblaydi. Paint bosqichida piksellarni chizadi. Oxirida qatlamlarni ekranda birlashtiradi (composite). JavaScript parse'ni to'sishi mumkin, shuning uchun script'lar uchun defer ishlatamiz.",
          example: "HTML → DOM\nCSS → CSSOM\nDOM + CSSOM → Render tree → Layout → Paint → Composite",
          followUp: 'What is the difference between reflow and repaint?',
          level: 'middle',
        },
        {
          q: 'What is the difference between reflow and repaint?',
          a: "A reflow happens when the size or position of elements changes, for example width, margin or adding a node. The browser must calculate the layout again, and this is expensive. A repaint happens when only the look changes, like color or background. It is cheaper. For animations, I use transform and opacity, because they usually skip both.",
          uz: "Reflow element'larning o'lchami yoki joylashuvi o'zgarganda sodir bo'ladi, masalan width, margin yoki node qo'shish. Brauzer layout'ni qayta hisoblashi kerak va bu qimmat. Repaint faqat ko'rinish o'zgarganda bo'ladi, masalan rang yoki fon. U arzonroq. Animatsiyalar uchun transform va opacity ishlataman, chunki ular odatda ikkalasini ham chetlab o'tadi.",
          level: 'middle',
        },
        {
          q: 'What is CORS?',
          a: "CORS means Cross-Origin Resource Sharing. By default, the browser blocks JavaScript from reading responses from another origin. An origin is the protocol, domain and port. The server can allow it with headers like Access-Control-Allow-Origin. So we fix CORS errors on the server, not in the frontend. Tools like Postman don't have CORS, because it is a browser rule.",
          uz: "CORS — Cross-Origin Resource Sharing. Default holatda brauzer JavaScript'ga boshqa origin'dan kelgan javoblarni o'qishga ruxsat bermaydi. Origin — protocol, domain va port. Server buni Access-Control-Allow-Origin kabi header'lar bilan ruxsat berishi mumkin. Shuning uchun CORS xatolarini frontend'da emas, serverda tuzatamiz. Postman kabi vositalarda CORS yo'q, chunki bu brauzer qoidasi.",
          example: `// Spring Boot server (with Spring Security: http.cors(Customizer.withDefaults()))
@Bean
CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("https://app.example.com"));
    config.setAllowedMethods(List.of("GET", "POST", "PATCH", "DELETE"));
    config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    config.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/api/**", config);
    return source;
}

// Response headers
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Credentials: true`,
          followUp: 'What is a preflight request?',
          level: 'junior',
        },
        {
          q: 'What is a preflight request?',
          a: "Before some cross-origin requests, the browser first sends an OPTIONS request. This is the preflight. It asks the server if the real method and headers are allowed. It happens for methods like PUT or DELETE, for custom headers like Authorization, or for JSON content type. If the server answers with the right headers, the browser sends the real request.",
          uz: "Ba'zi cross-origin request'lardan oldin brauzer avval OPTIONS request yuboradi. Bu preflight. U serverdan haqiqiy method va header'larga ruxsat bormi deb so'raydi. Bu PUT yoki DELETE kabi method'lar, Authorization kabi custom header'lar yoki JSON content type uchun sodir bo'ladi. Server to'g'ri header'lar bilan javob bersa, brauzer haqiqiy request'ni yuboradi.",
          level: 'middle',
        },
        {
          q: 'What is the difference between cookies, localStorage and sessionStorage?',
          a: "Cookies are small, about 4 KB, and the browser sends them with every request to the server. The server can set them as httpOnly, so JavaScript cannot read them. localStorage holds about 5 MB, stays after the browser closes, and is not sent to the server. sessionStorage is like localStorage, but it is cleared when the tab is closed. I use cookies for auth and localStorage for things like the theme.",
          uz: "Cookie'lar kichik, taxminan 4 KB, va brauzer ularni serverga har bir request bilan yuboradi. Server ularni httpOnly qilib qo'yishi mumkin, shunda JavaScript ularni o'qiy olmaydi. localStorage taxminan 5 MB saqlaydi, brauzer yopilgandan keyin ham qoladi va serverga yuborilmaydi. sessionStorage localStorage'ga o'xshaydi, lekin tab yopilganda tozalanadi. Men auth uchun cookie, theme kabi narsalar uchun localStorage ishlataman.",
          example: `localStorage.setItem('theme', 'dark')
localStorage.getItem('theme')     // 'dark'
sessionStorage.setItem('step', '2')

// Set by server
Set-Cookie: session=abc; HttpOnly; Secure; SameSite=Lax`,
          level: 'junior',
        },
        {
          q: 'What is XSS and how do you prevent it?',
          a: "XSS means Cross-Site Scripting. An attacker puts their own script into our page, for example through a comment field. The script runs in other users' browsers and can steal data or tokens. To prevent it, we escape user input before we show it. Vue and React do this by default. I avoid v-html and dangerouslySetInnerHTML, or I sanitize the HTML first. A Content Security Policy and httpOnly cookies also help.",
          uz: "XSS — Cross-Site Scripting. Hujumchi o'z script'ini sahifamizga kiritadi, masalan comment maydoni orqali. Script boshqa foydalanuvchilarning brauzerida ishlaydi va ma'lumot yoki token'larni o'g'irlashi mumkin. Oldini olish uchun foydalanuvchi kiritgan ma'lumotni ko'rsatishdan oldin escape qilamiz. Vue va React buni default qiladi. v-html va dangerouslySetInnerHTML'dan qochaman yoki HTML'ni avval sanitize qilaman. Content Security Policy va httpOnly cookie'lar ham yordam beradi.",
          example: `<!-- safe: text is escaped -->
<p>{{ comment }}</p>

<!-- dangerous: raw HTML -->
<p v-html="comment"></p>

<!-- if you must, sanitize first -->
<p v-html="DOMPurify.sanitize(comment)"></p>`,
          followUp: 'What is CSRF and how is it different from XSS?',
          level: 'junior',
        },
        {
          q: 'Where do you store a JWT token on the frontend?',
          a: "It depends on the use case. The safest option is an httpOnly, Secure cookie, because JavaScript cannot read it, so XSS cannot steal it. Then I must protect against CSRF with SameSite cookies or a CSRF token. localStorage is simple, but any script on the page can read it. A common pattern is a short access token in memory and a refresh token in an httpOnly cookie.",
          uz: "Bu holatga bog'liq. Eng xavfsiz variant — httpOnly, Secure cookie, chunki JavaScript uni o'qiy olmaydi, demak XSS uni o'g'irlay olmaydi. Bunda CSRF'dan SameSite cookie yoki CSRF token bilan himoyalanishim kerak. localStorage oddiy, lekin sahifadagi har qanday script uni o'qiy oladi. Keng tarqalgan pattern — qisqa muddatli access token xotirada (memory), refresh token esa httpOnly cookie'da.",
          level: 'middle',
        },
      ],
      resources: [
        { title: 'MDN — CORS', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS' },
        { title: 'MDN — Window.localStorage', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage' },
        { title: 'OWASP — Cross Site Scripting (XSS)', url: 'https://owasp.org/www-community/attacks/xss/' },
      ],
    },

    // 8 ─────────────────────────────────────────────────────────────
    {
      id: 'fe-typescript',
      title: 'TypeScript asoslari',
      days: [31, 80, 85],
      summary: "TypeScript — JavaScript'ga statik type'lar qo'shilgan versiyasi; u kompilyatsiya vaqtida JavaScript'ga aylanadi va brauzerda oddiy JS bo'lib ishlaydi. Asosiy foydasi: xatolarni kod ishlashidan oldin, yozish paytida topish, editor'da yaxshi autocomplete va katta loyihada xavfsiz refactoring. interface va type ikkalasi ham object shaklini tasvirlaydi; interface kengaytirish (extends) va declaration merging uchun qulay, type esa union, tuple va murakkab type'lar uchun. any type tekshiruvini o'chiradi, unknown esa ishlatishdan oldin tekshirishni majbur qiladi. Generics — bir xil kodni har xil type'lar bilan xavfsiz ishlatish imkonini beradi.",
      keyPoints: [
        "TS faqat compile time'da tekshiradi; runtime'da type yo'q (API ma'lumotini baribir validate qiling)",
        "interface — object shakli, extends, declaration merging; type — union, intersection, tuple, alias",
        "any — tekshiruvni o'chiradi (qoching); unknown — avval narrowing qilish kerak",
        "Union type: 'todo' | 'done'; narrowing: typeof, in, if tekshiruvlari",
        "Generics: function first<T>(arr: T[]): T",
        "Utility type'lar: Partial, Required, Pick, Omit, Record, Readonly",
        "Vue: defineProps<{ title: string }>(); React: function Card(props: CardProps)",
      ],
      vocab: [
        { en: 'static typing', uz: 'statik tiplash' },
        { en: 'type safety', uz: 'type xavfsizligi' },
        { en: 'compile time / runtime', uz: 'kompilyatsiya vaqti / ishlash vaqti' },
        { en: 'union type', uz: "birlashma type (yoki-yoki)" },
        { en: 'generic', uz: "umumlashtirilgan (type parametrli)" },
        { en: 'type narrowing', uz: "type'ni toraytirish" },
        { en: 'optional property', uz: "ixtiyoriy property (?)" },
      ],
      questions: [
        {
          q: 'Why do you use TypeScript?',
          a: "TypeScript adds static types to JavaScript. It finds many bugs while I write code, before the code runs. The editor gives better autocomplete, and refactoring a big project is safer. Types also work like documentation for other developers. The trade-off is a build step and some extra code.",
          uz: "TypeScript JavaScript'ga statik type'lar qo'shadi. U ko'plab xatolarni kod ishlashidan oldin, yozish paytidayoq topadi. Editor yaxshiroq autocomplete beradi va katta loyihani refactor qilish xavfsizroq bo'ladi. Type'lar boshqa dasturchilar uchun dokumentatsiya vazifasini ham bajaradi. Trade-off — build qadami va biroz qo'shimcha kod.",
          followUp: 'Does TypeScript check types at runtime?',
          level: 'junior',
        },
        {
          q: 'What is the difference between type and interface?',
          a: "Both can describe the shape of an object. An interface can extend other interfaces, and two interfaces with the same name merge together. A type alias can do more things, like union types, tuples and mapped types. In practice, I use interface for objects and props, and type for unions and more complex types. The important thing is to be consistent in the project.",
          uz: "Ikkalasi ham object shaklini tasvirlay oladi. interface boshqa interface'larni kengaytira oladi va bir xil nomli ikkita interface birlashib ketadi. type alias ko'proq narsa qila oladi, masalan union type, tuple va mapped type. Amalda men object va props uchun interface, union va murakkabroq type'lar uchun type ishlataman. Muhimi — loyihada bir xil uslubda bo'lish.",
          example: `interface User {
  id: number
  name: string
  email?: string        // optional
}
interface Admin extends User {
  role: 'admin'
}

type Status = 'todo' | 'in-progress' | 'done'
type Point = [number, number]`,
          level: 'junior',
        },
        {
          q: 'What is the difference between any and unknown?',
          a: "any turns off type checking, so you can do anything with the value, and TypeScript will not help you. unknown also accepts any value, but you must check the type before you use it. So unknown is the safe version of any. I use unknown for data from outside, like API responses or JSON.parse.",
          uz: "any type tekshiruvini o'chiradi, shuning uchun qiymat bilan istalgan narsani qila olasiz va TypeScript sizga yordam bermaydi. unknown ham istalgan qiymatni qabul qiladi, lekin ishlatishdan oldin type'ni tekshirishingiz kerak. Demak, unknown — any'ning xavfsiz versiyasi. Men tashqaridan keladigan ma'lumot uchun unknown ishlataman, masalan API javoblari yoki JSON.parse.",
          example: `let a: any = 'hi'
a.foo.bar()          // no error at compile time, crash at runtime

let u: unknown = 'hi'
u.toUpperCase()      // error
if (typeof u === 'string') {
  u.toUpperCase()    // OK after narrowing
}`,
          level: 'middle',
        },
        {
          q: 'What are generics?',
          a: "Generics let us write one function or type that works with many types and still keeps type safety. We use a type parameter, usually called T. TypeScript fills it from the real value. For example, an API helper can return Promise of T, so each call knows its exact result type.",
          uz: "Generics bitta funksiya yoki type yozib, uni ko'p type'lar bilan ishlatish va type xavfsizligini saqlash imkonini beradi. Type parametr ishlatamiz, odatda T deb nomlanadi. TypeScript uni haqiqiy qiymatdan to'ldiradi. Masalan, API helper Promise<T> qaytarishi mumkin, shunda har bir chaqiruv o'z natija type'ini aniq biladi.",
          example: `function first<T>(items: T[]): T | undefined {
  return items[0]
}
first([1, 2, 3])      // number | undefined
first(['a', 'b'])     // string | undefined

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url)
  return res.json()
}
const users = await get<User[]>('/api/users')`,
          level: 'middle',
        },
        {
          q: 'What are union types and type narrowing?',
          a: "A union type means a value can be one of several types, for example string or number. Before we use it, we narrow the type with a check like typeof, in, or a comparison. After the check, TypeScript knows the exact type inside that block. Unions of string literals are great for things like task status.",
          uz: "Union type — qiymat bir nechta type'dan biri bo'lishi mumkin degani, masalan string yoki number. Uni ishlatishdan oldin typeof, in yoki solishtirish kabi tekshiruv bilan type'ni toraytiramiz (narrowing). Tekshiruvdan keyin TypeScript o'sha blok ichida aniq type'ni biladi. String literal union'lar task status kabi narsalar uchun juda qulay.",
          example: `function format(value: string | number) {
  if (typeof value === 'number') {
    return value.toFixed(2)   // number here
  }
  return value.trim()         // string here
}

type Status = 'todo' | 'done'`,
          level: 'junior',
        },
        {
          q: 'Which utility types do you use?',
          a: "I often use Partial, Pick and Omit. Partial makes all fields optional, which is good for update forms. Pick takes only some fields from a type, and Omit removes some fields. Record is useful for a map of keys to values. They help me reuse one main type instead of writing many similar types.",
          uz: "Men ko'pincha Partial, Pick va Omit ishlataman. Partial barcha maydonlarni ixtiyoriy qiladi, bu update form'lari uchun qulay. Pick type'dan faqat ba'zi maydonlarni oladi, Omit esa ba'zi maydonlarni olib tashlaydi. Record kalit-qiymat map'i uchun foydali. Ular ko'p o'xshash type yozish o'rniga bitta asosiy type'ni qayta ishlatishga yordam beradi.",
          example: `interface Task { id: number; title: string; done: boolean }

type TaskUpdate = Partial<Task>
type TaskPreview = Pick<Task, 'id' | 'title'>
type NewTask = Omit<Task, 'id'>
type TasksById = Record<number, Task>`,
          level: 'middle',
        },
      ],
      resources: [
        { title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html' },
        { title: 'TypeScript — Everyday Types', url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html' },
        { title: 'Vue — Using Vue with TypeScript', url: 'https://vuejs.org/guide/typescript/overview.html' },
      ],
    },

    // 9 ─────────────────────────────────────────────────────────────
    {
      id: 'fe-live-coding',
      title: 'Frontend live coding masalalari',
      days: [72, 74, 80, 85],
      summary: "Frontend live coding'da odatda kichik, amaliy vazifalar beriladi: debounce/throttle funksiyasi, todo component, ro'yxatda search + filter, API'dan ma'lumot olib loading/error holatlarini ko'rsatish. Bu yerda faqat to'g'ri kod emas, balki fikrlash jarayonini ovoz chiqarib inglizcha tushuntirish ham baholanadi. Yaxshi tartib: talabni aniqlashtirish, rejani aytish, oddiy versiyani yozish, tekshirish, keyin yaxshilash. Har bir savolda `a` — yondashuvni og'zaki qanday tushuntirish, `example` — kod yechimi. Bu masalalarni taymer bilan (25–50 daqiqa) bir necha marta qayta yozing.",
      keyPoints: [
        "Boshlashdan oldin savol bering: input nima, edge case'lar, qaysi framework?",
        "Avval rejani 2–3 gapda ayting, keyin kod yozing",
        "Avval ishlaydigan oddiy versiya, keyin yaxshilash (debounce, empty state, accessibility)",
        "Har doim ko'rsating: loading, error, empty holatlar",
        "Edge case'lar: bo'sh input, katta-kichik harf, probellar, takroriy bosish",
        "Oxirida qisqa test qiling va nimani yaxshilash mumkinligini ayting",
      ],
      vocab: [
        { en: 'to clarify requirements', uz: 'talablarni aniqlashtirmoq' },
        { en: 'edge case', uz: 'chegaraviy holat' },
        { en: 'to think out loud', uz: 'ovoz chiqarib fikrlamoq' },
        { en: 'empty state', uz: "bo'sh holat (natija yo'q)" },
        { en: 'case-insensitive', uz: 'katta-kichik harfga qaramaydigan' },
        { en: 'to trigger', uz: 'ishga tushirmoq' },
        { en: 'trade-off', uz: "murosaga kelish (yutuq va yo'qotish)" },
      ],
      questions: [
        {
          q: 'How do you approach a frontend live-coding task?',
          a: "First, I repeat the task in my own words and ask questions about inputs and edge cases. Then I explain my plan in two or three sentences. I write a simple working version first, and I talk while I code. After that, I test it with a few cases, like empty input. At the end, I say what I would improve with more time.",
          uz: "Avval vazifani o'z so'zlarim bilan takrorlayman va input hamda edge case'lar haqida savol beraman. Keyin rejamni ikki-uch gapda tushuntiraman. Avval oddiy ishlaydigan versiyani yozaman va kod yozayotib gapiraman. Shundan keyin uni bir nechta holat bilan tekshiraman, masalan bo'sh input. Oxirida ko'proq vaqt bo'lsa nimani yaxshilashimni aytaman.",
          example: "Useful phrases: \"Let me make sure I understand the task...\" / \"My plan is to...\" / \"First, I'll write a simple version.\" / \"Let me test it with an empty input.\" / \"With more time, I would add...\"",
          level: 'junior',
        },
        {
          q: 'Write a debounce function.',
          a: "Debounce waits until the user stops calling the function for some time. My plan is to return a new function that keeps a timer in a closure. Each call clears the old timer and starts a new one. So the real function runs only once, after the last call and the delay. I use it for search inputs, so we don't send a request on every key press.",
          uz: "Debounce foydalanuvchi funksiyani ma'lum vaqt chaqirmay qo'yguncha kutadi. Rejam — timer'ni closure ichida saqlaydigan yangi funksiya qaytarish. Har bir chaqiruv eski timer'ni tozalaydi va yangisini boshlaydi. Shunday qilib, haqiqiy funksiya faqat bir marta, oxirgi chaqiruv va kechikishdan keyin ishlaydi. Men uni search input'lar uchun ishlataman, shunda har bir tugma bosilishida request yubormaymiz.",
          example: `function debounce(fn, delay) {
  let timer
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// Usage
const onSearch = debounce((text) => {
  console.log('Search for', text)
}, 300)

input.addEventListener('input', (e) => onSearch(e.target.value))`,
          followUp: 'How would you add a cancel method?',
          level: 'junior',
        },
        {
          q: 'What is the difference between throttle and debounce? Write a throttle function.',
          a: "Both limit how often a function runs. Debounce runs the function once, after the events stop. Throttle runs it at most once in each time interval, even if events keep coming. I use debounce for search input and throttle for scroll or resize. For throttle, I save the time of the last call and skip calls that come too early.",
          uz: "Ikkalasi ham funksiya qanchalik tez-tez ishlashini cheklaydi. Debounce funksiyani event'lar to'xtagandan keyin bir marta ishga tushiradi. Throttle esa event'lar kelishda davom etsa ham, har bir vaqt oralig'ida ko'pi bilan bir marta ishga tushiradi. Men search input uchun debounce, scroll yoki resize uchun throttle ishlataman. Throttle uchun oxirgi chaqiruv vaqtini saqlayman va juda erta kelgan chaqiruvlarni o'tkazib yuboraman.",
          example: `function throttle(fn, interval) {
  let last = 0
  return function (...args) {
    const now = Date.now()
    if (now - last >= interval) {
      last = now
      fn.apply(this, args)
    }
  }
}

window.addEventListener('scroll', throttle(() => {
  console.log(window.scrollY)
}, 200))

// typing "hello" fast:
// debounce(300) → 1 call, 300ms after the last key
// throttle(300) → about 1 call every 300ms while typing`,
          level: 'junior',
        },
        {
          q: 'Build a todo list component.',
          a: "I keep the list of todos and the input text in state. Each todo has an id, a text and a done flag. When the form is submitted, I trim the text, ignore empty input, add a new todo and clear the input. I render the list with v-for and a stable key. Each item has a checkbox to toggle done and a button to delete it.",
          uz: "Todo'lar ro'yxatini va input matnini state'da saqlayman. Har bir todo'da id, matn va done belgisi bor. Form submit bo'lganda matnni trim qilaman, bo'sh input'ni e'tiborsiz qoldiraman, yangi todo qo'shaman va input'ni tozalayman. Ro'yxatni v-for va barqaror key bilan render qilaman. Har bir element'da done'ni almashtirish uchun checkbox va o'chirish uchun tugma bor.",
          example: `<script setup>
import { ref, computed } from 'vue'

const todos = ref([])
const text = ref('')
let nextId = 1

const left = computed(() => todos.value.filter((t) => !t.done).length)

function addTodo() {
  const value = text.value.trim()
  if (!value) return
  todos.value.push({ id: nextId++, text: value, done: false })
  text.value = ''
}

function removeTodo(id) {
  todos.value = todos.value.filter((t) => t.id !== id)
}
</script>

<template>
  <form @submit.prevent="addTodo">
    <input v-model="text" placeholder="New task" />
    <button :disabled="!text.trim()">Add</button>
  </form>

  <p v-if="todos.length === 0">No tasks yet</p>
  <ul v-else>
    <li v-for="todo in todos" :key="todo.id">
      <input type="checkbox" v-model="todo.done" />
      <span :class="{ done: todo.done }">{{ todo.text }}</span>
      <button @click="removeTodo(todo.id)">Delete</button>
    </li>
  </ul>
  <p>{{ left }} left</p>
</template>`,
          followUp: 'How would you save the todos after a page refresh?',
          level: 'junior',
        },
        {
          q: 'Implement search and filter on a list of products.',
          a: "I keep the search text and the selected category in state. Then I use a computed value for the filtered list, so I don't change the original data. I compare text in lower case and trim spaces, so the search is case-insensitive. If nothing matches, I show an empty state. For a big list or a server search, I would add debounce.",
          uz: "Search matni va tanlangan kategoriyani state'da saqlayman. Keyin filtrlangan ro'yxat uchun computed qiymat ishlataman, shunda asl ma'lumotni o'zgartirmayman. Matnni kichik harflarda solishtiraman va probellarni trim qilaman, shunda qidiruv katta-kichik harfga qaramaydi. Hech narsa mos kelmasa, bo'sh holat (empty state) ko'rsataman. Katta ro'yxat yoki server qidiruvi uchun debounce qo'shardim.",
          example: `<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ products: { type: Array, required: true } })
const search = ref('')
const category = ref('all')

const categories = computed(() => [
  'all',
  ...new Set(props.products.map((p) => p.category)),
])

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return props.products.filter((p) => {
    const matchText = p.name.toLowerCase().includes(q)
    const matchCategory = category.value === 'all' || p.category === category.value
    return matchText && matchCategory
  })
})
</script>

<template>
  <input v-model="search" placeholder="Search..." />
  <select v-model="category">
    <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
  </select>

  <p v-if="filtered.length === 0">No results</p>
  <ul v-else>
    <li v-for="p in filtered" :key="p.id">{{ p.name }} — {{ p.price }}</li>
  </ul>
</template>`,
          followUp: 'How would you keep the filters in the URL?',
          level: 'middle',
        },
        {
          q: 'Fetch a list of users from an API and show loading and error states.',
          a: "I have three pieces of state: the data, a loading flag and an error. When the component mounts, I set loading to true and call the API with async and await. I check response.ok, because fetch does not throw on 404 or 500. In finally, I set loading to false. In the template, I show a spinner, an error message, an empty state, or the list.",
          uz: "Uchta state bor: ma'lumot, loading belgisi va error. Component mount bo'lganda loading'ni true qilaman va API'ni async va await bilan chaqiraman. response.ok'ni tekshiraman, chunki fetch 404 yoki 500'da xato tashlamaydi. finally'da loading'ni false qilaman. Template'da spinner, xato xabari, bo'sh holat yoki ro'yxatni ko'rsataman.",
          example: `<script setup>
import { ref, onMounted } from 'vue'

const users = ref([])
const loading = ref(false)
const error = ref('')

async function loadUsers() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/api/users')
    if (!res.ok) throw new Error('HTTP ' + res.status)
    users.value = await res.json()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(loadUsers)
</script>

<template>
  <p v-if="loading">Loading...</p>
  <p v-else-if="error">Error: {{ error }} <button @click="loadUsers">Retry</button></p>
  <p v-else-if="users.length === 0">No users</p>
  <ul v-else>
    <li v-for="u in users" :key="u.id">{{ u.name }}</li>
  </ul>
</template>`,
          level: 'junior',
        },
        {
          q: 'Write a memoize function.',
          a: "Memoize saves the result of a function for each input, so we don't calculate it again. My plan is to keep a Map in a closure. The key is made from the arguments. If the key is in the cache, I return the saved value. If not, I call the function, save the result and return it. This works well only for pure functions.",
          uz: "Memoize funksiya natijasini har bir input uchun saqlab qo'yadi, shunda uni qayta hisoblamaymiz. Rejam — closure ichida Map saqlash. Kalit argumentlardan yasaladi. Agar kalit keshda bo'lsa, saqlangan qiymatni qaytaraman. Bo'lmasa, funksiyani chaqiraman, natijani saqlayman va qaytaraman. Bu faqat pure funksiyalar uchun yaxshi ishlaydi.",
          example: `function memoize(fn) {
  const cache = new Map()
  return function (...args) {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = fn.apply(this, args)
    cache.set(key, result)
    return result
  }
}

const slowSquare = (n) => n * n
const fastSquare = memoize(slowSquare)
fastSquare(4) // calculated
fastSquare(4) // from cache`,
          followUp: 'What is the problem with an unlimited cache?',
          level: 'middle',
        },
      ],
      resources: [
        { title: 'javascript.info — Decorators and forwarding (debounce, throttle tasks)', url: 'https://javascript.info/call-apply-decorators' },
        { title: 'Vue — Examples', url: 'https://vuejs.org/examples/' },
      ],
    },
  ],
}

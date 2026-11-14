// Algorithm patterns + LeetCode problems used in the 90-day plan.
// `days` = plan days that list the problem (Timed Medium days: 71, 73, 75, 79, 82).
export default {
  patterns: [
    {
      id: 'hash-map',
      title: 'Hash map va Set',
      summary:
        "Hash map (JS'da Map yoki oddiy object) kalit bo'yicha qiymatni o'rtacha O(1) vaqtda topadi. Set esa faqat \"bu element oldin uchraganmi?\" degan savolga tez javob beradi. Ko'p masalalarda brute-force ikki ichma-ich sikl (O(n²)) bo'ladi, hash map esa uni bitta o'tishga (O(n)) tushiradi. Narxi — qo'shimcha xotira, ya'ni O(n) space. Bu interview'dagi eng ko'p ishlatiladigan pattern.",
      whenToUse:
        "\"Oldin ko'rganmidik?\", \"necha marta uchraydi?\", \"juftini top\", \"guruhlab chiq\" degan so'zlar bo'lsa. Brute-force ikki ichma-ich sikl bo'lsa va massiv sorted bo'lmasa — birinchi navbatda hash map haqida o'yla.",
      sayIt:
        "I'll use a hash map to store what I have already seen, so each lookup is O(1). This turns the O(n²) brute force into one pass with O(n) time and O(n) space.",
      template: `// 1) count how many times each value appears
const count = new Map()
for (const x of arr) {
  count.set(x, (count.get(x) || 0) + 1)
}

// 2) one pass: check before you store
const seen = new Map() // value -> index
for (let i = 0; i < arr.length; i++) {
  const need = target - arr[i]
  if (seen.has(need)) return [seen.get(need), i]
  seen.set(arr[i], i)
}`,
    },
    {
      id: 'two-pointers',
      title: 'Two pointers',
      summary:
        "Ikki ko'rsatkich (pointer) massivning ikki chetidan bir-biriga qarab yoki bir tomondan turli tezlikda harakatlanadi. Odatda massiv sorted bo'lganda ishlatiladi: yig'indi kichik bo'lsa chap pointer o'ngga, katta bo'lsa o'ng pointer chapga suriladi. Har qadamda bitta variant tashlab yuboriladi, shuning uchun O(n²) o'rniga O(n) bo'ladi. Qo'shimcha xotira kerak emas — O(1) space. Palindrom tekshirish ham shu pattern.",
      whenToUse:
        "Massiv sorted bo'lsa (yoki uni sort qilish mumkin bo'lsa), \"juftlik/uchlik top\", \"palindrom\", \"ikki chetidan solishtir\", \"in-place o'zgartir\" degan shartlar bo'lsa.",
      sayIt:
        "Since the array is sorted, I'll use two pointers, one at the start and one at the end. I move one pointer at each step, so it's O(n) time and O(1) space.",
      template: `let left = 0
let right = arr.length - 1
while (left < right) {
  const sum = arr[left] + arr[right]
  if (sum === target) return [left, right]
  if (sum < target) left++ // need a bigger sum
  else right-- // need a smaller sum
}`,
    },
    {
      id: 'sliding-window',
      title: 'Sliding window',
      summary:
        "Sliding window — massiv yoki string ustida harakatlanadigan \"oyna\" [left, right]. O'ng chegara har qadamda bittaga kengayadi, shart buzilsa chap chegara qisqaradi. Har bir element oynaga bir marta kiradi va bir marta chiqadi, shuning uchun umumiy vaqt O(n). Oyna ichidagi holatni (harflar soni, yig'indi) odatda Map yoki Set'da saqlaymiz.",
      whenToUse:
        "\"Eng uzun/eng qisqa substring yoki subarray\", \"ketma-ket (contiguous) elementlar\", \"k uzunlikdagi oyna\", \"takrorlanmaydigan belgilar\" degan so'zlar bo'lsa.",
      sayIt:
        "I'll use a sliding window with two indexes, left and right. I grow the window on the right and shrink it from the left when the rule breaks. Each element enters and leaves the window once, so it's O(n).",
      template: `let left = 0
let best = 0
const window = new Map()
for (let right = 0; right < s.length; right++) {
  // 1) add s[right] to the window
  window.set(s[right], (window.get(s[right]) || 0) + 1)
  // 2) shrink from the left while the window is not valid
  while (window.get(s[right]) > 1) {
    window.set(s[left], window.get(s[left]) - 1)
    left++
  }
  // 3) update the answer
  best = Math.max(best, right - left + 1)
}`,
    },
    {
      id: 'array-tricks',
      title: 'Prefix/suffix va Kadane',
      summary:
        "Bu massiv bilan ishlashdagi bir nechta foydali usul. Prefix (chapdan) va suffix (o'ngdan) yig'indi yoki ko'paytmani oldindan hisoblab, har bir pozitsiya uchun javobni O(1) da olish mumkin. Kadane algoritmi eng katta yig'indili subarray'ni bitta o'tishda topadi: har qadamda \"oldingi yig'indini davom ettiramanmi yoki shu elementdan yangidan boshlaymanmi?\" deb tanlaymiz. Running minimum/maximum ham shu oilaga kiradi: o'tib ketayotib shu paytgacha bo'lgan eng kichik qiymatni eslab boramiz.",
      whenToUse:
        "\"Eng katta yig'indili subarray\", \"o'zidan boshqa barcha elementlar ko'paytmasi\", \"oraliq (range) yig'indisi\", \"eng arzon paytda sotib ol, eng qimmat paytda sot\" kabi masalalarda; bo'lish (division) taqiqlangan bo'lsa ham.",
      sayIt:
        "I'll keep a running value while I walk through the array once. At each step I decide to extend the current sum or start again from this element, so it's O(n) time and O(1) space.",
      template: `// Kadane: maximum subarray sum
let current = nums[0]
let best = nums[0]
for (let i = 1; i < nums.length; i++) {
  current = Math.max(nums[i], current + nums[i]) // extend or restart
  best = Math.max(best, current)
}

// Prefix sums: sum of nums[i..j] = prefix[j + 1] - prefix[i]
const prefix = [0]
for (const x of nums) prefix.push(prefix[prefix.length - 1] + x)`,
    },
    {
      id: 'binary-search',
      title: 'Binary search',
      summary:
        "Binary search sorted ma'lumotda qidiruv oralig'ini har qadamda ikkiga bo'ladi. O'rtadagi elementni (mid) tekshiramiz, javob qaysi yarimda ekanini aniqlaymiz va ikkinchi yarimni tashlab yuboramiz. Shuning uchun vaqt O(log n). Eng ko'p xato chegaralarda bo'ladi: lo <= hi yoki lo < hi, mid + 1 yoki mid. Aylantirilgan (rotated) sorted massivda ham kamida bitta yarim har doim sorted bo'ladi.",
      whenToUse:
        "Massiv sorted yoki rotated sorted bo'lsa, \"O(log n) da yech\" deyilsa, yoki javob monoton bo'lsa (\"shartni bajaradigan eng kichik X qaysi?\").",
      sayIt:
        "The array is sorted, so I can use binary search. I check the middle element and drop half of the array at each step. That gives O(log n) time.",
      template: `let lo = 0
let hi = nums.length - 1
while (lo <= hi) {
  const mid = Math.floor((lo + hi) / 2)
  if (nums[mid] === target) return mid
  if (nums[mid] < target) lo = mid + 1 // answer is on the right
  else hi = mid - 1 // answer is on the left
}
return -1`,
    },
    {
      id: 'stack',
      title: 'Stack va monotonic stack',
      summary:
        "Stack — LIFO (last in, first out): oxirgi qo'shilgan element birinchi chiqadi. JS'da oddiy massiv push() va pop() bilan stack vazifasini bajaradi. Qavslarni tekshirishda ochilgan qavslarni stack'ga qo'yamiz va yopilgan qavsni stack tepasidagi bilan solishtiramiz. Monotonic stack — elementlari doim o'suvchi yoki kamayuvchi tartibda turadigan stack; u \"keyingi kattaroq element\" turidagi masalalarni O(n) da yechadi.",
      whenToUse:
        "Qavslar, ichma-ich (nested) struktura, \"undo\", \"keyingi kattaroq/kichikroq element\", \"necha kun kutish kerak\" kabi masalalarda; yoki eng oxirgi ochilgan elementni eslab qolish kerak bo'lsa.",
      sayIt:
        "I'll use a stack because the last opened item must be closed first. Each element is pushed and popped at most once, so the total time is O(n).",
      template: `// Monotonic stack: next greater element for each index
const result = new Array(nums.length).fill(-1)
const stack = [] // indexes, values go down from bottom to top
for (let i = 0; i < nums.length; i++) {
  while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
    const j = stack.pop()
    result[j] = nums[i] // nums[i] is the next greater for j
  }
  stack.push(i)
}`,
    },
    {
      id: 'linked-list',
      title: 'Linked list',
      summary:
        "Linked list'da har bir node o'z qiymatini (val) va keyingi node'ga havolani (next) saqlaydi. Index orqali murojaat yo'q, shuning uchun pointer'lar bilan ishlaymiz: prev, curr, next. Dummy node ro'yxat boshi o'zgarishi mumkin bo'lganda kodni soddalashtiradi. Fast & slow pointers (Floyd usuli) — biri ikki qadam, biri bir qadam yuradi; ular uchrashsa, ro'yxatda sikl (cycle) bor.",
      whenToUse:
        "Input ListNode bo'lsa: ro'yxatni teskari aylantirish, ikki ro'yxatni birlashtirish, siklni topish, o'rtasini topish, oxiridan n-chi node'ni o'chirish.",
      sayIt:
        "I'll walk through the list with pointers and change the next links in place. I use a dummy node, so I don't need special code for the head. It's O(n) time and O(1) space.",
      template: `// Reverse a list
let prev = null
let curr = head
while (curr) {
  const next = curr.next
  curr.next = prev
  prev = curr
  curr = next
}

// Fast and slow pointers
let slow = head
let fast = head
while (fast && fast.next) {
  slow = slow.next
  fast = fast.next.next
}`,
    },
    {
      id: 'tree-dfs-bfs',
      title: 'Tree: DFS va BFS',
      summary:
        "Binary tree'da har bir node'ning ko'pi bilan ikkita bolasi bor: left va right. DFS (depth-first search) odatda recursion bilan yoziladi: avval chap va o'ng subtree uchun javobni olamiz, keyin ularni birlashtiramiz. BFS (breadth-first search) queue yordamida tree'ni daraja-daraja (level by level) aylanib chiqadi. BST'da chap subtree'dagi hamma qiymat node'dan kichik, o'ng subtree'dagi hamma qiymat katta; in-order traversal BST qiymatlarini sorted tartibda beradi.",
      whenToUse:
        "Input TreeNode bo'lsa. \"Daraja bo'yicha\", \"har bir level\", \"eng yaqin\" — BFS. \"Chuqurlik\", \"balandlik\", \"har bir subtree uchun tekshir\", \"BST'mi?\" — DFS (recursion).",
      sayIt:
        "I'll solve it with recursion: I get the answer for the left and right subtrees and combine them. I visit every node once, so time is O(n) and space is O(h), the height of the tree.",
      template: `// DFS (recursion)
function dfs(node) {
  if (!node) return 0 // base case
  const left = dfs(node.left)
  const right = dfs(node.right)
  return 1 + Math.max(left, right) // combine
}

// BFS (level by level)
let level = root ? [root] : []
while (level.length) {
  const next = []
  for (const node of level) {
    if (node.left) next.push(node.left)
    if (node.right) next.push(node.right)
  }
  level = next
}`,
    },
    {
      id: 'graph',
      title: 'Graph: grid DFS/BFS',
      summary:
        "Graph — node'lar (vertex) va ular orasidagi bog'lanishlar (edge). Ko'p interview masalalarida graph 2D grid ko'rinishida beriladi: har bir katak node, uning 4 ta qo'shnisi esa edge. Bog'langan qismlarni (connected components) topish uchun DFS yoki BFS bilan har bir katakni bir marta ko'ramiz va visited deb belgilaymiz. Vazifalar orasida bog'liqlik (prerequisite) bo'lsa, bu directed graph va topological sort kerak bo'ladi.",
      whenToUse:
        "2D grid'da \"orollar\", \"hududlar\", \"qo'shni kataklar\" bo'lsa; \"bog'liqlik\", \"qaysi tartibda?\", \"sikl bormi?\" (kurslar, vazifalar) so'ralsa; node'lar va edge'lar ro'yxati berilsa.",
      sayIt:
        "I'll treat the grid as a graph where each cell is a node. When I find land, I run DFS and mark the whole island as visited. Each cell is visited once, so it's O(rows times cols).",
      template: `// Grid DFS
function dfs(grid, r, c) {
  if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length) return
  if (grid[r][c] !== '1') return // water or already visited
  grid[r][c] = '0' // mark as visited
  dfs(grid, r + 1, c)
  dfs(grid, r - 1, c)
  dfs(grid, r, c + 1)
  dfs(grid, r, c - 1)
}

// Adjacency list from edges
const graph = Array.from({ length: n }, () => [])
for (const [a, b] of edges) graph[a].push(b)`,
    },
    {
      id: 'dynamic-programming',
      title: 'Dynamic programming',
      summary:
        "Dynamic programming (DP) — katta masalani kichik, bir-biriga o'xshash qism-masalalarga bo'lish va har birining javobini bir marta hisoblab saqlash. Avval holatni (state) aniqlaymiz: dp[i] nimani bildiradi? Keyin o'tish formulasini yozamiz, masalan dp[i] = dp[i - 1] + dp[i - 2]. Boshlang'ich qiymatlarni (base case) unutmaslik kerak. Ko'pincha butun massiv emas, faqat oxirgi bir-ikki qiymat kerak bo'ladi va xotirani O(1) gacha kamaytirish mumkin.",
      whenToUse:
        "\"Nechta usul bilan?\", \"eng kam/eng ko'p ...\", \"eng yaxshi natija\" so'ralsa va har bir qadamdagi tanlov keyingi qadamlarga ta'sir qilsa. Recursion bir xil qism-masalani qayta-qayta hisoblayotgan bo'lsa.",
      sayIt:
        "This problem has overlapping subproblems, so I'll use dynamic programming. dp[i] is the answer for the first i steps, and I build it from smaller answers. It's O(n) time.",
      template: `// 1) state: dp[i] = answer for the first i items
// 2) base case
// 3) transition from smaller answers
const dp = new Array(n + 1).fill(0)
dp[0] = 1
dp[1] = 1
for (let i = 2; i <= n; i++) {
  dp[i] = dp[i - 1] + dp[i - 2]
}
return dp[n]`,
    },
    {
      id: 'intervals',
      title: 'Intervals',
      summary:
        "Interval masalalarida har bir element [start, end] juftligi. Deyarli har doim birinchi qadam — interval'larni start bo'yicha sort qilish. Shundan keyin ustma-ust tushadigan (overlapping) interval'lar yonma-yon keladi va ularni bitta o'tishda birlashtirish mumkin. Ikki interval kesishadi, agar keyingisining start'i oldingisining end'idan katta bo'lmasa.",
      whenToUse:
        "Input [start, end] juftliklari bo'lsa: uchrashuvlar, vaqt oraliqlari, bron qilish; \"birlashtir\", \"kesishadimi?\", \"nechta xona kerak?\" so'ralsa.",
      sayIt:
        "First I'll sort the intervals by start time. Then overlapping intervals are next to each other, and I can merge them in one pass. Sorting makes it O(n log n).",
      template: `intervals.sort((a, b) => a[0] - b[0])
const merged = []
for (const [start, end] of intervals) {
  const last = merged[merged.length - 1]
  if (last && start <= last[1]) last[1] = Math.max(last[1], end) // overlap
  else merged.push([start, end])
}`,
    },
    {
      id: 'heap',
      title: 'Heap (priority queue)',
      summary:
        "Heap (priority queue) — eng kichik (min-heap) yoki eng katta (max-heap) elementni doim tepada saqlaydigan tuzilma. Element qo'shish va tepadagini olib tashlash O(log n), tepadagini ko'rish esa O(1). JavaScript'da tayyor heap yo'q, shuning uchun interview'da qisqa MinHeap yozish kerak bo'ladi yoki interviewer'dan tayyor heap'ni ishlatishga ruxsat so'rash mumkin. \"Top k\" masalalarda k o'lchamli heap saqlaymiz va vaqt O(n log k) bo'ladi.",
      whenToUse:
        "\"k-chi eng katta/kichik\", \"top k\", \"eng yaqin k ta\", \"doim eng kichigini olib tur\" so'ralsa yoki ma'lumot oqim (stream) bo'lib kelsa.",
      sayIt:
        "I'll keep a min-heap of size k. If the heap grows bigger than k, I remove the smallest element. At the end the top of the heap is the answer, and the time is O(n log k).",
      template: `class MinHeap {
  constructor() { this.a = [] }
  size() { return this.a.length }
  peek() { return this.a[0] }
  push(x) {
    const a = this.a
    a.push(x)
    let i = a.length - 1
    while (i > 0) { // sift up
      const p = (i - 1) >> 1
      if (a[p] <= a[i]) break
      ;[a[p], a[i]] = [a[i], a[p]]
      i = p
    }
  }
  pop() {
    const a = this.a
    const top = a[0]
    const last = a.pop()
    if (a.length) {
      a[0] = last
      let i = 0
      while (true) { // sift down
        const l = 2 * i + 1
        const r = l + 1
        let m = i
        if (l < a.length && a[l] < a[m]) m = l
        if (r < a.length && a[r] < a[m]) m = r
        if (m === i) break
        ;[a[m], a[i]] = [a[i], a[m]]
        i = m
      }
    }
    return top
  }
}`,
    },
    {
      id: 'backtracking',
      title: 'Backtracking',
      summary:
        "Backtracking — barcha variantlarni tartib bilan sinab chiqish: bitta tanlov qilamiz, recursion bilan keyingi qadamga o'tamiz, so'ng tanlovni bekor qilamiz (undo) va keyingisini sinaymiz. Natijalar soni ko'pincha eksponensial (masalan, 2^n ta subset), shuning uchun vaqt ham eksponensial bo'ladi. Muhim joylar — qachon to'xtash (base case) va keraksiz shoxlarni erta kesish (pruning).",
      whenToUse:
        "\"Barcha kombinatsiyalar / subset'lar / permutatsiyalar\", \"barcha yo'llarni qaytar\" so'ralsa va n kichik (masalan, 20 dan oshmaydi) bo'lsa.",
      sayIt:
        "I'll use backtracking. I add one choice, go deeper with recursion, and then remove the choice to try the next one. The number of results is exponential, so the time is exponential too.",
      template: `const result = []
const path = []
function backtrack(start) {
  result.push([...path]) // save a copy of the current choice
  for (let i = start; i < nums.length; i++) {
    path.push(nums[i]) // choose
    backtrack(i + 1) // explore
    path.pop() // undo
  }
}
backtrack(0)`,
    },
    {
      id: 'matrix',
      title: 'Matrix (2D massiv)',
      summary:
        "Matrix masalalari — 2D massiv bilan index'lar orqali ishlash. Asosiy narsa — chegaralarni (top, bottom, left, right) to'g'ri boshqarish va qator/ustun index'larini adashtirmaslik. Ko'p in-place masalalar oddiy qadamlarga bo'linadi: masalan, 90 gradusga burish = transpose + har bir qatorni teskari qilish. Kod yozishdan oldin kichik 3×3 misolni qog'ozda chizib olish juda foydali.",
      whenToUse:
        "Input 2D massiv bo'lsa va \"aylantir (rotate)\", \"spiral tartibda o'qi\", \"in-place o'zgartir\" so'ralsa — ya'ni graph qidiruvi emas, index'lar bilan aniq ishlash kerak bo'lsa.",
      sayIt:
        "I'll keep four boundaries: top, bottom, left and right. After I finish one side, I move that boundary inside. Every cell is visited once, so it's O(m times n).",
      template: `let top = 0
let bottom = matrix.length - 1
let left = 0
let right = matrix[0].length - 1
while (top <= bottom && left <= right) {
  // walk one side, then move that boundary inside
  for (let c = left; c <= right; c++) visit(matrix[top][c])
  top++
  // ... right side, bottom side, left side
}`,
    },
  ],

  problems: [
    // ---------- Kun 4 ----------
    {
      id: 'two-sum',
      title: 'Two Sum',
      url: 'https://leetcode.com/problems/two-sum/',
      difficulty: 'Easy',
      pattern: 'hash-map',
      days: [4],
      task: "Massiv va target berilgan. Yig'indisi target'ga teng bo'lgan ikki sonning index'larini qaytarish kerak.",
      hint: "Har bir son uchun unga qancha yetishmayotganini (target - son) hisobla. O'sha son oldin uchraganmi — buni O(1) da qanday bilish mumkin?",
      approach:
        "The brute force checks every pair with two loops, which is O(n²). To make it faster, I use a hash map from value to index. For each number, I compute target minus the number and check if it is already in the map. If yes, I return both indexes. If not, I store the current number and its index.",
      complexity: { time: 'O(n)', space: 'O(n)' },
      solution: `function twoSum(nums, target) {
  const seen = new Map() // value -> index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i]
    if (seen.has(need)) return [seen.get(need), i]
    seen.set(nums[i], i) // store after the check, so we don't use the same element twice
  }
  return []
}`,
      edgeCases: ['negative numbers', 'the same value twice, like [3, 3]', 'answer uses the first and last element'],
    },
    {
      id: 'contains-duplicate',
      title: 'Contains Duplicate',
      url: 'https://leetcode.com/problems/contains-duplicate/',
      difficulty: 'Easy',
      pattern: 'hash-map',
      days: [4],
      task: "Massivda biror qiymat kamida ikki marta uchrasa true, hamma elementlar har xil bo'lsa false qaytarish kerak.",
      hint: "Ko'rgan sonlaringni biror joyda eslab qol. Qaysi tuzilma \"bu bormi?\" degan savolga O(1) da javob beradi?",
      approach:
        "The brute force compares every pair, which is O(n²). Another option is to sort the array and compare neighbours, which is O(n log n). The best way is to use a Set. I walk through the array, and if the number is already in the Set, I return true. Otherwise I add it and continue.",
      complexity: { time: 'O(n)', space: 'O(n)' },
      solution: `function containsDuplicate(nums) {
  const seen = new Set()
  for (const x of nums) {
    if (seen.has(x)) return true // we saw this value before
    seen.add(x)
  }
  return false
}`,
      edgeCases: ['array with one element', 'all elements are the same', 'negative numbers and zero'],
    },

    // ---------- Kun 5 ----------
    {
      id: 'valid-anagram',
      title: 'Valid Anagram',
      url: 'https://leetcode.com/problems/valid-anagram/',
      difficulty: 'Easy',
      pattern: 'hash-map',
      days: [5],
      task: "Ikki string s va t berilgan. t — s'ning anagrammasi (ya'ni xuddi shu harflardan, xuddi shu sonda tuzilgan) bo'lsa true qaytarish kerak.",
      hint: "Uzunliklar har xil bo'lsa, javob darhol aniq. Har bir harf necha marta uchrashini sanab, ikki string'ni solishtir.",
      approach:
        "One simple way is to sort both strings and compare them, which is O(n log n). A better way is to count letters. If the lengths are different, I return false. I count each character of s in a map, then I decrease the count for each character of t. If a count goes below zero, the strings are not anagrams.",
      complexity: { time: 'O(n)', space: 'O(1) — 26 letters (O(k) for any alphabet)' },
      solution: `function isAnagram(s, t) {
  if (s.length !== t.length) return false
  const count = new Map()
  for (const ch of s) count.set(ch, (count.get(ch) || 0) + 1)
  for (const ch of t) {
    if (!count.get(ch)) return false // t has an extra character
    count.set(ch, count.get(ch) - 1)
  }
  return true
}`,
      edgeCases: ['different lengths', 'empty strings', 'same letters with different counts, like "aab" and "abb"'],
    },
    {
      id: 'valid-palindrome',
      title: 'Valid Palindrome',
      url: 'https://leetcode.com/problems/valid-palindrome/',
      difficulty: 'Easy',
      pattern: 'two-pointers',
      days: [5],
      task: "Katta-kichik harf farqini va harf/raqam bo'lmagan belgilarni hisobga olmaganda, string palindrom (teskarisiga o'qilsa ham bir xil) ekanini tekshirish kerak.",
      hint: "String'ning ikki chetidan bir-biriga qarab yur. Harf yoki raqam bo'lmagan belgilarni o'tkazib yubor.",
      approach:
        "A simple way is to clean the string, reverse it and compare, but this uses extra memory. Instead, I use two pointers, one at the start and one at the end. I skip characters that are not letters or digits. Then I compare the two characters in lower case. If they are different, I return false; if the pointers meet, it's a palindrome.",
      complexity: { time: 'O(n)', space: 'O(1)' },
      solution: `function isPalindrome(s) {
  const isAlnum = (c) => /[a-z0-9]/i.test(c)
  let left = 0
  let right = s.length - 1
  while (left < right) {
    if (!isAlnum(s[left])) { left++; continue } // skip spaces and punctuation
    if (!isAlnum(s[right])) { right--; continue }
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false
    left++
    right--
  }
  return true
}`,
      edgeCases: ['empty string or only spaces (true)', 'only punctuation, like ".,"', 'digits, like "0P" (false)'],
    },

    // ---------- Kun 9 ----------
    {
      id: 'group-anagrams',
      title: 'Group Anagrams',
      url: 'https://leetcode.com/problems/group-anagrams/',
      difficulty: 'Medium',
      pattern: 'hash-map',
      days: [9],
      task: "So'zlar massivi berilgan. Bir-birining anagrammasi bo'lgan so'zlarni bitta guruhga yig'ib, guruhlar ro'yxatini qaytarish kerak.",
      hint: "Anagramma bo'lgan barcha so'zlar uchun bir xil bo'ladigan \"kalit\" (key) topa olasanmi? Keyin shu kalit bo'yicha hash map'da guruhla.",
      approach:
        "Comparing every pair of words is too slow. All anagrams have the same letters, so if I sort the letters of a word, anagrams give the same key. I use a hash map from this key to a list of words. At the end I return all the lists from the map. Another key option is a count of the 26 letters, which avoids sorting.",
      complexity: { time: 'O(n · k log k), k = word length', space: 'O(n · k)' },
      solution: `function groupAnagrams(strs) {
  const groups = new Map() // sorted word -> list of words
  for (const word of strs) {
    const key = word.split('').sort().join('')
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(word)
  }
  return [...groups.values()]
}`,
      edgeCases: ['empty string ""', 'one word only', 'no anagrams at all'],
    },
    {
      id: 'top-k-frequent-elements',
      title: 'Top K Frequent Elements',
      url: 'https://leetcode.com/problems/top-k-frequent-elements/',
      difficulty: 'Medium',
      pattern: 'hash-map',
      days: [9],
      task: "Massiv va k soni berilgan. Eng ko'p uchraydigan k ta elementni qaytarish kerak.",
      hint: "Avval har bir son necha marta uchrashini sana. Chastota n dan katta bo'la olmaydi — buni index sifatida ishlatsa bo'lmaydimi?",
      approach:
        "First I count each number with a hash map. The simple way is to sort the numbers by count, which is O(n log n), or to use a min-heap of size k, which is O(n log k). The best way is bucket sort: a count is never bigger than n, so I make buckets where the index is the count. Then I go from the biggest bucket down and collect numbers until I have k of them.",
      complexity: { time: 'O(n)', space: 'O(n)' },
      solution: `function topKFrequent(nums, k) {
  const count = new Map()
  for (const x of nums) count.set(x, (count.get(x) || 0) + 1)
  // buckets[c] = numbers that appear exactly c times
  const buckets = Array.from({ length: nums.length + 1 }, () => [])
  for (const [num, c] of count) buckets[c].push(num)
  const result = []
  for (let c = buckets.length - 1; c > 0 && result.length < k; c--) {
    for (const num of buckets[c]) {
      result.push(num)
      if (result.length === k) break
    }
  }
  return result
}`,
      edgeCases: ['k equals the number of unique values', 'all numbers are the same', 'negative numbers'],
    },

    // ---------- Kun 12 ----------
    {
      id: 'best-time-to-buy-and-sell-stock',
      title: 'Best Time to Buy and Sell Stock',
      url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
      difficulty: 'Easy',
      pattern: 'array-tricks',
      days: [12],
      task: "prices[i] — i-kundagi aksiya narxi. Bir kun sotib olib, keyingi bir kunda sotib olinadigan eng katta foydani topish kerak (foyda bo'lmasa 0).",
      hint: "Har bir kunni sotish kuni deb tasavvur qil. Shu kungacha bo'lgan eng arzon narxni bilsang, foydani darhol hisoblay olasan.",
      approach:
        "The brute force tries every buy day and every sell day, which is O(n²). Instead, I walk through the prices once and keep the minimum price so far. For each day, I calculate today's price minus that minimum. I keep the biggest profit I see. This is one pass with O(1) extra memory.",
      complexity: { time: 'O(n)', space: 'O(1)' },
      solution: `function maxProfit(prices) {
  let minPrice = Infinity // cheapest day so far
  let best = 0
  for (const price of prices) {
    minPrice = Math.min(minPrice, price)
    best = Math.max(best, price - minPrice) // sell today
  }
  return best
}`,
      edgeCases: ['prices only go down (answer 0)', 'one day only', 'the minimum is after the maximum'],
    },
    {
      id: 'product-of-array-except-self',
      title: 'Product of Array Except Self',
      url: 'https://leetcode.com/problems/product-of-array-except-self/',
      difficulty: 'Medium',
      pattern: 'array-tricks',
      days: [12],
      task: "Har bir i uchun nums[i] dan tashqari barcha elementlar ko'paytmasini qaytarish kerak. Bo'lish (division) ishlatish mumkin emas, vaqt O(n) bo'lishi kerak.",
      hint: "i dan tashqari ko'paytma = (i dan chapdagilar ko'paytmasi) × (i dan o'ngdagilar ko'paytmasi). Ikkalasini ikki o'tishda hisobla.",
      approach:
        "The brute force multiplies all other elements for each index, which is O(n²). Division is not allowed, and it also breaks with zeros. So I use prefix and suffix products. In the first pass from the left, I store the product of everything before i. In the second pass from the right, I multiply it by the product of everything after i.",
      complexity: { time: 'O(n)', space: 'O(1) extra (the output array does not count)' },
      solution: `function productExceptSelf(nums) {
  const n = nums.length
  const result = new Array(n).fill(1)
  let prefix = 1 // product of everything on the left
  for (let i = 0; i < n; i++) {
    result[i] = prefix
    prefix *= nums[i]
  }
  let suffix = 1 // product of everything on the right
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= suffix
    suffix *= nums[i]
  }
  return result
}`,
      edgeCases: ['one zero in the array', 'two or more zeros (all answers are 0)', 'negative numbers'],
    },

    // ---------- Kun 16 ----------
    {
      id: 'two-sum-ii-input-array-is-sorted',
      title: 'Two Sum II - Input Array Is Sorted',
      url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
      difficulty: 'Medium',
      pattern: 'two-pointers',
      days: [16],
      task: "O'sish tartibida sorted massivda yig'indisi target'ga teng ikki sonni topib, ularning 1 dan boshlanadigan index'larini qaytarish kerak. Faqat O(1) qo'shimcha xotira ishlatish mumkin.",
      hint: "Massiv sorted. Eng kichik va eng katta sonni qo'shib ko'r: yig'indi juda katta bo'lsa, qaysi sonni tashlab yuborish kerak?",
      approach:
        "I could use a hash map like in Two Sum, but here only O(1) extra memory is allowed. Since the array is sorted, I use two pointers at the start and the end. If the sum is too small, I move the left pointer right. If it is too big, I move the right pointer left. When the sum equals the target, I return both indexes plus one.",
      complexity: { time: 'O(n)', space: 'O(1)' },
      solution: `function twoSum(numbers, target) {
  let left = 0
  let right = numbers.length - 1
  while (left < right) {
    const sum = numbers[left] + numbers[right]
    if (sum === target) return [left + 1, right + 1] // 1-indexed
    if (sum < target) left++
    else right--
  }
  return []
}`,
      edgeCases: ['negative numbers', 'duplicate values, like [1, 1, 3]', 'answer is the first and last element'],
    },
    {
      id: '3sum',
      title: '3Sum',
      url: 'https://leetcode.com/problems/3sum/',
      difficulty: 'Medium',
      pattern: 'two-pointers',
      days: [16],
      task: "Yig'indisi 0 ga teng bo'lgan barcha uchliklarni [a, b, c] topish kerak. Javobda bir xil uchlik takrorlanmasligi kerak.",
      hint: "Massivni sort qil. Birinchi sonni sikl bilan tanla, qolgan ikkitasini Two Sum II kabi two pointers bilan qidir. Takrorlanuvchi qiymatlarni o'tkazib yuborishni unutma.",
      approach:
        "The brute force checks all triples, which is O(n³). First I sort the array. Then I fix the first number with a loop and look for two numbers that sum to its negative, using two pointers. To avoid duplicate triples, I skip equal values for the first number and also after I find a triple. Sorting is O(n log n), and the main part is O(n²).",
      complexity: { time: 'O(n²)', space: 'O(1) extra (not counting sort and output)' },
      solution: `function threeSum(nums) {
  nums.sort((a, b) => a - b)
  const result = []
  for (let i = 0; i < nums.length - 2; i++) {
    if (nums[i] > 0) break // all next numbers are positive too
    if (i > 0 && nums[i] === nums[i - 1]) continue // skip duplicate first number
    let left = i + 1
    let right = nums.length - 1
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right]
      if (sum < 0) left++
      else if (sum > 0) right--
      else {
        result.push([nums[i], nums[left], nums[right]])
        left++
        right--
        while (left < right && nums[left] === nums[left - 1]) left++ // skip duplicates
      }
    }
  }
  return result
}`,
      edgeCases: ['all zeros, like [0, 0, 0, 0]', 'no triple sums to zero', 'many duplicate values'],
    },

    // ---------- Kun 19 ----------
    {
      id: 'container-with-most-water',
      title: 'Container With Most Water',
      url: 'https://leetcode.com/problems/container-with-most-water/',
      difficulty: 'Medium',
      pattern: 'two-pointers',
      days: [19],
      task: "height[i] — i-pozitsiyadagi vertikal chiziq balandligi. Ikki chiziq va x o'qi bilan hosil bo'ladigan idishga sig'adigan eng ko'p suv hajmini topish kerak.",
      hint: "Ikki chetdan boshla — kenglik eng katta. Hajmni past chiziq cheklaydi. Qaysi pointer'ni surish mantiqiy?",
      approach:
        "The brute force checks every pair of lines, which is O(n²). I start with two pointers at both ends, because this gives the widest container. The area is the shorter height times the width. Then I move the pointer with the shorter line, because the taller line cannot help while the short one limits the area. I keep the maximum area.",
      complexity: { time: 'O(n)', space: 'O(1)' },
      solution: `function maxArea(height) {
  let left = 0
  let right = height.length - 1
  let best = 0
  while (left < right) {
    const area = Math.min(height[left], height[right]) * (right - left)
    best = Math.max(best, area)
    // move the shorter line; the taller one can't make the area bigger
    if (height[left] < height[right]) left++
    else right--
  }
  return best
}`,
      edgeCases: ['only two lines', 'all heights are equal', 'heights with zeros'],
    },
    {
      id: 'valid-parentheses',
      title: 'Valid Parentheses',
      url: 'https://leetcode.com/problems/valid-parentheses/',
      difficulty: 'Easy',
      pattern: 'stack',
      days: [19],
      task: "Faqat ()[]{} belgilaridan iborat string berilgan. Har bir ochilgan qavs to'g'ri tartibda, o'zining turidagi qavs bilan yopilganini tekshirish kerak.",
      hint: "Oxirgi ochilgan qavs birinchi yopilishi kerak. Bu qaysi tuzilmaning qoidasi?",
      approach:
        "The last bracket that opens must close first, so I use a stack. When I see an opening bracket, I push it. When I see a closing bracket, I pop from the stack and check that it is the matching opening bracket. If the stack is empty or the bracket does not match, I return false. At the end the stack must be empty.",
      complexity: { time: 'O(n)', space: 'O(n)' },
      solution: `function isValid(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' }
  const stack = []
  for (const ch of s) {
    if (ch in pairs) {
      if (stack.pop() !== pairs[ch]) return false // wrong type or empty stack
    } else {
      stack.push(ch)
    }
  }
  return stack.length === 0 // nothing left open
}`,
      edgeCases: ['only opening brackets, like "(("', 'starts with a closing bracket', 'wrong order, like "(]" or "([)]"'],
    },

    // ---------- Kun 23 ----------
    {
      id: 'longest-substring-without-repeating-characters',
      title: 'Longest Substring Without Repeating Characters',
      url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
      difficulty: 'Medium',
      pattern: 'sliding-window',
      days: [23],
      task: "String ichida belgilari takrorlanmaydigan eng uzun substring (ketma-ket qism) uzunligini topish kerak.",
      hint: "Oynani o'ngga kengaytirib bor. Takroriy belgi kirsa, chap chegarani o'sha belgining oldingi pozitsiyasidan keyinga sur.",
      approach:
        "The brute force checks every substring, which is O(n²) or worse. I use a sliding window with left and right indexes. I also keep a map from each character to the last index where I saw it. When the right character was already seen inside the window, I move left to the position after it. After each step I update the best length.",
      complexity: { time: 'O(n)', space: 'O(k), k = alphabet size' },
      solution: `function lengthOfLongestSubstring(s) {
  const lastIndex = new Map() // char -> last position
  let left = 0
  let best = 0
  for (let right = 0; right < s.length; right++) {
    const ch = s[right]
    if (lastIndex.has(ch) && lastIndex.get(ch) >= left) {
      left = lastIndex.get(ch) + 1 // jump past the repeated char
    }
    lastIndex.set(ch, right)
    best = Math.max(best, right - left + 1)
  }
  return best
}`,
      edgeCases: ['empty string (0)', 'all the same character, like "bbbb"', 'a repeat that is outside the window, like "abba"'],
    },
    {
      id: 'maximum-subarray',
      title: 'Maximum Subarray',
      url: 'https://leetcode.com/problems/maximum-subarray/',
      difficulty: 'Medium',
      pattern: 'array-tricks',
      days: [23],
      task: "Massivdagi yig'indisi eng katta bo'lgan bo'sh bo'lmagan ketma-ket qismning (subarray) yig'indisini topish kerak.",
      hint: "Har bir elementda tanlov bor: oldingi subarray'ni davom ettirish yoki shu elementdan yangisini boshlash. Oldingi yig'indi manfiy bo'lsa, u yordam beradimi?",
      approach:
        "The brute force checks every subarray, which is O(n²). I use Kadane's algorithm. I keep the best sum of a subarray that ends at the current index. For each number, I either add it to the current sum or start a new subarray from it, whichever is bigger. I also track the best sum overall.",
      complexity: { time: 'O(n)', space: 'O(1)' },
      solution: `function maxSubArray(nums) {
  let current = nums[0] // best sum ending here
  let best = nums[0]
  for (let i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]) // extend or restart
    best = Math.max(best, current)
  }
  return best
}`,
      edgeCases: ['all numbers are negative', 'one element', 'the whole array is the answer'],
    },

    // ---------- Kun 26 ----------
    {
      id: 'binary-search',
      title: 'Binary Search',
      url: 'https://leetcode.com/problems/binary-search/',
      difficulty: 'Easy',
      pattern: 'binary-search',
      days: [26],
      task: "O'sish tartibida sorted massivda target'ning index'ini O(log n) da topish kerak; topilmasa -1 qaytariladi.",
      hint: "O'rtadagi elementni target bilan solishtir. Natijaga qarab massivning qaysi yarmini tashlab yuborish mumkin?",
      approach:
        "A linear scan is O(n), but the array is sorted, so I can do better. I keep two indexes, lo and hi. I check the middle element. If it equals the target, I return its index. If it is smaller, the target is on the right, so lo becomes mid plus one; otherwise hi becomes mid minus one.",
      complexity: { time: 'O(log n)', space: 'O(1)' },
      solution: `function search(nums, target) {
  let lo = 0
  let hi = nums.length - 1
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    if (nums[mid] === target) return mid
    if (nums[mid] < target) lo = mid + 1 // target is on the right
    else hi = mid - 1 // target is on the left
  }
  return -1
}`,
      edgeCases: ['one element', 'target is smaller or bigger than all elements', 'target is the first or last element'],
    },
    {
      id: 'search-in-rotated-sorted-array',
      title: 'Search in Rotated Sorted Array',
      url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
      difficulty: 'Medium',
      pattern: 'binary-search',
      days: [26],
      task: "Sorted massiv noma'lum nuqtada aylantirilgan (masalan, [4,5,6,7,0,1,2]). Unda target'ning index'ini O(log n) da topish kerak; bo'lmasa -1.",
      hint: "mid'ni tanlaganda chap yoki o'ng yarimdan bittasi albatta sorted bo'ladi. Qaysi biri ekanini aniqlab, target o'sha sorted yarimda bormi — tekshir.",
      approach:
        "A linear scan is O(n), but we need O(log n), so I use binary search. The key idea is that one half around mid is always sorted. I check which half is sorted by comparing nums[lo] and nums[mid]. If the target is inside the sorted half, I search there; otherwise I search the other half.",
      complexity: { time: 'O(log n)', space: 'O(1)' },
      solution: `function search(nums, target) {
  let lo = 0
  let hi = nums.length - 1
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    if (nums[mid] === target) return mid
    if (nums[lo] <= nums[mid]) {
      // left half is sorted
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1
      else lo = mid + 1
    } else {
      // right half is sorted
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1
      else hi = mid - 1
    }
  }
  return -1
}`,
      edgeCases: ['array is not rotated', 'one or two elements', 'target is not in the array'],
    },

    // ---------- Kun 64 ----------
    {
      id: 'min-stack',
      title: 'Min Stack',
      url: 'https://leetcode.com/problems/min-stack/',
      difficulty: 'Medium',
      pattern: 'stack',
      days: [64],
      task: "push, pop, top va getMin amallarini qo'llab-quvvatlaydigan stack yozish kerak; har bir amal O(1) vaqtda ishlashi shart.",
      hint: "Har bir element qo'shilganda \"shu paytdagi minimum\"ni ham yonida saqla. pop qilinganda minimum avtomatik ravishda oldingi holatga qaytadi.",
      approach:
        "If I search for the minimum on each getMin call, it is O(n). Instead, I keep a second stack with the minimum at each level. When I push a value, I also push the smaller of this value and the current minimum. When I pop, I pop from both stacks. So getMin just reads the top of the second stack.",
      complexity: { time: 'O(1) for every operation', space: 'O(n)' },
      solution: `class MinStack {
  constructor() {
    this.stack = []
    this.mins = [] // mins[i] = minimum of stack[0..i]
  }
  push(val) {
    const currentMin = this.mins.length ? this.mins[this.mins.length - 1] : val
    this.stack.push(val)
    this.mins.push(Math.min(val, currentMin))
  }
  pop() {
    this.stack.pop()
    this.mins.pop()
  }
  top() {
    return this.stack[this.stack.length - 1]
  }
  getMin() {
    return this.mins[this.mins.length - 1]
  }
}`,
      edgeCases: ['the same minimum pushed twice', 'negative values', 'pop the current minimum, then call getMin'],
    },
    {
      id: 'daily-temperatures',
      title: 'Daily Temperatures',
      url: 'https://leetcode.com/problems/daily-temperatures/',
      difficulty: 'Medium',
      pattern: 'stack',
      days: [64],
      task: "Har bir kun uchun issiqroq kun kelguncha necha kun kutish kerakligini qaytarish kerak; bunday kun bo'lmasa 0.",
      hint: "Hali issiqroq kunini topmagan kunlarning index'larini stack'da saqla. Yangi kun ularning qaysilariga javob bo'ladi?",
      approach:
        "The brute force looks forward from each day, which is O(n²). I use a monotonic stack of indexes of days that still wait for a warmer day. For each new day, while it is warmer than the day on top of the stack, I pop that day and write the difference of indexes. Then I push the current day. Each index is pushed and popped once.",
      complexity: { time: 'O(n)', space: 'O(n)' },
      solution: `function dailyTemperatures(temperatures) {
  const answer = new Array(temperatures.length).fill(0)
  const stack = [] // indexes of days waiting for a warmer day
  for (let i = 0; i < temperatures.length; i++) {
    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const j = stack.pop()
      answer[j] = i - j
    }
    stack.push(i)
  }
  return answer
}`,
      edgeCases: ['temperatures only go down (all 0)', 'equal temperatures (not warmer)', 'one day'],
    },

    // ---------- Kun 65 ----------
    {
      id: 'reverse-linked-list',
      title: 'Reverse Linked List',
      url: 'https://leetcode.com/problems/reverse-linked-list/',
      difficulty: 'Easy',
      pattern: 'linked-list',
      days: [65],
      task: "Singly linked list'ning boshi (head) berilgan. Ro'yxatni teskari aylantirib, yangi boshini qaytarish kerak.",
      hint: "Har bir node'ning next'ini oldingi node'ga qarat. Bog'lanishni uzishdan oldin keyingi node'ni biror o'zgaruvchida saqlab qo'y.",
      approach:
        "I could copy the values into an array and build a new list, but that uses O(n) memory. Instead, I reverse the links in place with three pointers: prev, curr and next. For each node, I save the next node, point curr.next to prev, and then move prev and curr one step forward. At the end, prev is the new head.",
      complexity: { time: 'O(n)', space: 'O(1)' },
      solution: `function reverseList(head) {
  let prev = null
  let curr = head
  while (curr) {
    const next = curr.next // save before we break the link
    curr.next = prev
    prev = curr
    curr = next
  }
  return prev // new head
}`,
      edgeCases: ['empty list (null)', 'one node', 'two nodes'],
    },
    {
      id: 'merge-two-sorted-lists',
      title: 'Merge Two Sorted Lists',
      url: 'https://leetcode.com/problems/merge-two-sorted-lists/',
      difficulty: 'Easy',
      pattern: 'linked-list',
      days: [65],
      task: "Ikkita sorted linked list berilgan. Ularni bitta sorted ro'yxatga birlashtirib, boshini qaytarish kerak.",
      hint: "Ikkala ro'yxat boshidagi node'lardan kichigini olib, natijaga ula. Natija boshini soddalashtirish uchun dummy node ishlat.",
      approach:
        "I use a dummy node so I don't need special code for the head of the result. I keep a tail pointer. While both lists have nodes, I attach the smaller node to the tail and move forward in that list. When one list ends, I attach the rest of the other list. I return dummy.next.",
      complexity: { time: 'O(n + m)', space: 'O(1)' },
      solution: `function mergeTwoLists(list1, list2) {
  const dummy = new ListNode(0) // fake head
  let tail = dummy
  while (list1 && list2) {
    if (list1.val <= list2.val) {
      tail.next = list1
      list1 = list1.next
    } else {
      tail.next = list2
      list2 = list2.next
    }
    tail = tail.next
  }
  tail.next = list1 || list2 // attach the rest
  return dummy.next
}`,
      edgeCases: ['one or both lists are empty', 'lists with equal values', 'one list is much longer'],
    },
    {
      id: 'linked-list-cycle',
      title: 'Linked List Cycle',
      url: 'https://leetcode.com/problems/linked-list-cycle/',
      difficulty: 'Easy',
      pattern: 'linked-list',
      days: [65],
      task: "Linked list'da sikl (cycle) bormi, ya'ni biror node'ning next'i oldingi node'ga qaytadimi — shuni aniqlash kerak.",
      hint: "Ikki pointer har xil tezlikda yursin. Agar sikl bo'lsa, tez pointer sekinini qachondir quvib yetadi.",
      approach:
        "The simple way is to store visited nodes in a Set, but this uses O(n) memory. I use Floyd's fast and slow pointers instead. The slow pointer moves one step and the fast pointer moves two steps. If there is a cycle, the fast pointer will meet the slow one. If the fast pointer reaches null, there is no cycle.",
      complexity: { time: 'O(n)', space: 'O(1)' },
      solution: `function hasCycle(head) {
  let slow = head
  let fast = head
  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
    if (slow === fast) return true // they met inside the cycle
  }
  return false
}`,
      edgeCases: ['empty list', 'one node that points to itself', 'cycle goes back to the head'],
    },

    // ---------- Kun 66 ----------
    {
      id: 'invert-binary-tree',
      title: 'Invert Binary Tree',
      url: 'https://leetcode.com/problems/invert-binary-tree/',
      difficulty: 'Easy',
      pattern: 'tree-dfs-bfs',
      days: [66],
      task: "Binary tree'ni ko'zgudagi aksiga aylantirish kerak: har bir node'ning chap va o'ng bolalari o'rnini almashtirish.",
      hint: "Bitta node uchun nima qilish kerak? Bolalarini almashtir, keyin xuddi shu ishni har bir subtree uchun recursion bilan qil.",
      approach:
        "This is a simple DFS. For each node, I swap its left and right children. Then I call the same function on both children. The base case is a null node, where I just return. Every node is visited once.",
      complexity: { time: 'O(n)', space: 'O(h), h = tree height' },
      solution: `function invertTree(root) {
  if (!root) return null // base case
  const left = invertTree(root.left)
  const right = invertTree(root.right)
  root.left = right // swap the children
  root.right = left
  return root
}`,
      edgeCases: ['empty tree', 'one node', 'a tree that has only left children'],
    },
    {
      id: 'maximum-depth-of-binary-tree',
      title: 'Maximum Depth of Binary Tree',
      url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
      difficulty: 'Easy',
      pattern: 'tree-dfs-bfs',
      days: [66],
      task: "Binary tree'ning maksimal chuqurligini (root'dan eng uzoq barggacha bo'lgan node'lar sonini) topish kerak.",
      hint: "Agar chap va o'ng subtree chuqurligini bilsang, butun tree chuqurligi qanday hisoblanadi?",
      approach:
        "I use DFS with recursion. The depth of an empty tree is zero. For a node, the depth is one plus the bigger depth of its left and right subtrees. I could also use BFS and count the levels, and the result is the same.",
      complexity: { time: 'O(n)', space: 'O(h), h = tree height' },
      solution: `function maxDepth(root) {
  if (!root) return 0 // empty tree has depth 0
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right))
}`,
      edgeCases: ['empty tree (0)', 'one node (1)', 'a very deep, list-like tree'],
    },

    // ---------- Kun 67 ----------
    {
      id: 'binary-tree-level-order-traversal',
      title: 'Binary Tree Level Order Traversal',
      url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
      difficulty: 'Medium',
      pattern: 'tree-dfs-bfs',
      days: [67],
      task: "Binary tree qiymatlarini daraja-daraja (chapdan o'ngga) qaytarish kerak: har bir level — alohida massiv.",
      hint: "Hozirgi darajadagi node'lar ro'yxatini saqla. Ulardan keyingi darajadagi bolalar ro'yxatini yasa.",
      approach:
        "This is a classic BFS. I keep the list of nodes on the current level, starting with the root. For each level, I save their values. Then I build the next level from their left and right children. I stop when the next level is empty.",
      complexity: { time: 'O(n)', space: 'O(n)' },
      solution: `function levelOrder(root) {
  const result = []
  let level = root ? [root] : []
  while (level.length) {
    result.push(level.map((node) => node.val))
    const next = [] // children of the current level
    for (const node of level) {
      if (node.left) next.push(node.left)
      if (node.right) next.push(node.right)
    }
    level = next
  }
  return result
}`,
      edgeCases: ['empty tree (return [])', 'one node', 'a tree where some nodes have only one child'],
    },
    {
      id: 'validate-binary-search-tree',
      title: 'Validate Binary Search Tree',
      url: 'https://leetcode.com/problems/validate-binary-search-tree/',
      difficulty: 'Medium',
      pattern: 'tree-dfs-bfs',
      days: [67],
      task: "Binary tree to'g'ri BST ekanini tekshirish kerak: chap subtree'dagi barcha qiymatlar node'dan qat'iy kichik, o'ngdagilar esa qat'iy katta.",
      hint: "Faqat node'ni o'z bolalari bilan solishtirish yetarli emas. Har bir node uchun ruxsat etilgan oraliqni (min, max) pastga uzatib bor.",
      approach:
        "Checking only a node and its direct children is a common mistake. Instead, I pass a valid range down the tree. The root can be any value. When I go left, the upper limit becomes the node value; when I go right, the lower limit becomes the node value. If any node is outside its range, the tree is not a BST.",
      complexity: { time: 'O(n)', space: 'O(h), h = tree height' },
      solution: `function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true
  if (root.val <= min || root.val >= max) return false // outside the allowed range
  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max)
}`,
      edgeCases: ['duplicate values (not valid)', 'a deep node breaks the rule, like [5,4,6,null,null,3,7]', 'very large or small values'],
    },

    // ---------- Kun 68 ----------
    {
      id: 'number-of-islands',
      title: 'Number of Islands',
      url: 'https://leetcode.com/problems/number-of-islands/',
      difficulty: 'Medium',
      pattern: 'graph',
      days: [68],
      task: "'1' (quruqlik) va '0' (suv)dan iborat 2D grid berilgan. Gorizontal yoki vertikal bog'langan quruqlik kataklari — bitta orol. Orollar sonini topish kerak.",
      hint: "Grid'ni aylanib chiq. Yangi '1' topsang — bu yangi orol. Shu orolning barcha kataklarini DFS bilan \"ko'rilgan\" deb belgila, ikkinchi marta sanalmasin.",
      approach:
        "I treat the grid as a graph where each cell is connected to its four neighbours. I scan every cell. When I find land, I add one to the count and run DFS from it. The DFS marks every connected land cell as water, so I don't count the same island again. Every cell is visited a constant number of times.",
      complexity: { time: 'O(m · n)', space: 'O(m · n) for the recursion in the worst case' },
      solution: `function numIslands(grid) {
  const rows = grid.length
  const cols = grid[0].length
  const sink = (r, c) => {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== '1') return
    grid[r][c] = '0' // mark as visited
    sink(r + 1, c)
    sink(r - 1, c)
    sink(r, c + 1)
    sink(r, c - 1)
  }
  let count = 0
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++ // new island found
        sink(r, c)
      }
    }
  }
  return count
}`,
      edgeCases: ['grid with no land', 'grid that is all land', 'diagonal cells are not connected'],
    },

    // ---------- Kun 69 ----------
    {
      id: 'merge-intervals',
      title: 'Merge Intervals',
      url: 'https://leetcode.com/problems/merge-intervals/',
      difficulty: 'Medium',
      pattern: 'intervals',
      days: [69],
      task: "[start, end] interval'lar massivi berilgan. Ustma-ust tushadigan barcha interval'larni birlashtirib, kesishmaydigan interval'lar ro'yxatini qaytarish kerak.",
      hint: "Interval'larni start bo'yicha sort qil. Endi har bir interval faqat natijadagi oxirgi interval bilan kesishishi mumkin.",
      approach:
        "Comparing every pair is O(n²). First I sort the intervals by start. Then I go through them and compare each one with the last interval in the result. If the start is not bigger than the last end, they overlap, so I extend the last end. Otherwise I add the interval as a new one.",
      complexity: { time: 'O(n log n)', space: 'O(n)' },
      solution: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]) // sort by start
  const merged = []
  for (const [start, end] of intervals) {
    const last = merged[merged.length - 1]
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end) // overlap: extend the last interval
    } else {
      merged.push([start, end])
    }
  }
  return merged
}`,
      edgeCases: ['touching intervals, like [1,4] and [4,5]', 'one interval inside another', 'input is not sorted'],
    },
    {
      id: 'climbing-stairs',
      title: 'Climbing Stairs',
      url: 'https://leetcode.com/problems/climbing-stairs/',
      difficulty: 'Easy',
      pattern: 'dynamic-programming',
      days: [69],
      task: "n pog'onali zinapoyada har safar 1 yoki 2 pog'ona chiqish mumkin. Tepaga chiqishning nechta turli usuli borligini topish kerak.",
      hint: "n-pog'onaga oxirgi qadam yoki (n-1) dan, yoki (n-2) dan keladi. Demak usullar soni qanday formulaga bo'ysunadi?",
      approach:
        "A plain recursion computes the same steps many times and is O(2^n). I notice that the ways to reach step n equal the ways to reach n minus one plus the ways to reach n minus two. This is like Fibonacci. I only need the last two values, so I keep two variables and build the answer from the bottom.",
      complexity: { time: 'O(n)', space: 'O(1)' },
      solution: `function climbStairs(n) {
  let prev = 1 // ways to reach step 0
  let curr = 1 // ways to reach step 1
  for (let i = 2; i <= n; i++) {
    const next = prev + curr // dp[i] = dp[i - 1] + dp[i - 2]
    prev = curr
    curr = next
  }
  return curr
}`,
      edgeCases: ['n = 1', 'n = 2', 'large n (numbers grow fast)'],
    },

    // ---------- Timed Medium: Kun 71 ----------
    {
      id: 'longest-consecutive-sequence',
      title: 'Longest Consecutive Sequence',
      url: 'https://leetcode.com/problems/longest-consecutive-sequence/',
      difficulty: 'Medium',
      pattern: 'hash-map',
      days: [71],
      task: "Sorted bo'lmagan massivda ketma-ket butun sonlardan (masalan 1, 2, 3, 4) iborat eng uzun ketma-ketlik uzunligini O(n) da topish kerak.",
      hint: "Barcha sonlarni Set'ga sol. Ketma-ketlikni faqat uning boshidan sanash kerak — son qachon ketma-ketlik boshi bo'ladi?",
      approach:
        "Sorting gives O(n log n), but we need O(n). I put all numbers in a Set. A number starts a sequence only if number minus one is not in the Set. From each start, I count up while the next number exists. Each number is counted only once, so the total time is O(n).",
      complexity: { time: 'O(n)', space: 'O(n)' },
      solution: `function longestConsecutive(nums) {
  const set = new Set(nums)
  let best = 0
  for (const x of set) {
    if (set.has(x - 1)) continue // not the start of a sequence
    let length = 1
    while (set.has(x + length)) length++
    best = Math.max(best, length)
  }
  return best
}`,
      edgeCases: ['empty array (0)', 'duplicate values', 'negative numbers'],
    },
    {
      id: 'kth-largest-element-in-an-array',
      title: 'Kth Largest Element in an Array',
      url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
      difficulty: 'Medium',
      pattern: 'heap',
      days: [71],
      task: "Massivdagi k-chi eng katta elementni topish kerak (sorted tartibdagi k-chi, alohida qiymat emas). Butun massivni sort qilmasdan yechish so'raladi.",
      hint: "Faqat eng katta k ta sonni saqlab tur. Ularning eng kichigini tez olib tashlash uchun qaysi tuzilma qulay?",
      approach:
        "Sorting the array works in O(n log n). A better way is a min-heap of size k. I push each number into the heap, and if the heap has more than k elements, I remove the smallest. At the end the heap holds the k largest numbers, and its top is the k-th largest. Quickselect is another option with O(n) average time.",
      complexity: { time: 'O(n log k)', space: 'O(k)' },
      solution: `function findKthLargest(nums, k) {
  const heap = [] // min-heap with the k largest numbers
  const swap = (i, j) => { [heap[i], heap[j]] = [heap[j], heap[i]] }
  const push = (x) => {
    heap.push(x)
    let i = heap.length - 1
    while (i > 0 && heap[(i - 1) >> 1] > heap[i]) {
      swap(i, (i - 1) >> 1)
      i = (i - 1) >> 1
    }
  }
  const popMin = () => {
    heap[0] = heap.pop()
    let i = 0
    while (true) {
      const l = 2 * i + 1
      const r = l + 1
      let m = i
      if (l < heap.length && heap[l] < heap[m]) m = l
      if (r < heap.length && heap[r] < heap[m]) m = r
      if (m === i) break
      swap(i, m)
      i = m
    }
  }
  for (const x of nums) {
    push(x)
    if (heap.length > k) popMin() // drop the smallest
  }
  return heap[0]
}`,
      edgeCases: ['k = 1 (the maximum)', 'k = n (the minimum)', 'duplicate values'],
    },

    // ---------- Timed Medium: Kun 73 ----------
    {
      id: 'find-minimum-in-rotated-sorted-array',
      title: 'Find Minimum in Rotated Sorted Array',
      url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
      difficulty: 'Medium',
      pattern: 'binary-search',
      days: [73],
      task: "Takroriy qiymatlarsiz sorted massiv noma'lum nuqtada aylantirilgan. Eng kichik elementni O(log n) da topish kerak.",
      hint: "nums[mid] ni eng o'ngdagi element bilan solishtir. mid o'ngdagidan katta bo'lsa, minimum qaysi tomonda?",
      approach:
        "A linear scan is O(n). I use binary search and compare the middle element with the last element of the range. If nums[mid] is bigger than nums[hi], the drop point is on the right, so lo becomes mid plus one. Otherwise the minimum is at mid or on the left, so hi becomes mid. When lo equals hi, I found the minimum.",
      complexity: { time: 'O(log n)', space: 'O(1)' },
      solution: `function findMin(nums) {
  let lo = 0
  let hi = nums.length - 1
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2)
    if (nums[mid] > nums[hi]) lo = mid + 1 // minimum is on the right
    else hi = mid // mid can be the minimum
  }
  return nums[lo]
}`,
      edgeCases: ['array is not rotated', 'one element', 'two elements, like [2, 1]'],
    },
    {
      id: 'house-robber',
      title: 'House Robber',
      url: 'https://leetcode.com/problems/house-robber/',
      difficulty: 'Medium',
      pattern: 'dynamic-programming',
      days: [73],
      task: "nums[i] — i-uydagi pul. Qo'shni ikki uyni birga o'g'irlab bo'lmaydi. Olish mumkin bo'lgan eng ko'p pul miqdorini topish kerak.",
      hint: "Har bir uyda ikki tanlov bor: shu uyni olish (unda oldingisini olib bo'lmaydi) yoki o'tkazib yuborish. dp[i] nimani bildirishi kerak?",
      approach:
        "Trying all combinations is exponential. I use dynamic programming: the best amount up to house i is the maximum of two options. Option one is to skip this house and keep the best up to i minus one. Option two is to rob it and add its money to the best up to i minus two. I only need the last two values, so the memory is O(1).",
      complexity: { time: 'O(n)', space: 'O(1)' },
      solution: `function rob(nums) {
  let prev = 0 // best up to house i - 2
  let curr = 0 // best up to house i - 1
  for (const money of nums) {
    const next = Math.max(curr, prev + money) // skip it or rob it
    prev = curr
    curr = next
  }
  return curr
}`,
      edgeCases: ['one house', 'two houses', 'best answer skips two houses in a row, like [2, 1, 1, 2]'],
    },

    // ---------- Timed Medium: Kun 75 ----------
    {
      id: 'course-schedule',
      title: 'Course Schedule',
      url: 'https://leetcode.com/problems/course-schedule/',
      difficulty: 'Medium',
      pattern: 'graph',
      days: [75],
      task: "numCourses ta kurs va [a, b] juftliklari berilgan: a kursini olish uchun avval b ni tugatish kerak. Barcha kurslarni tugatish mumkinmi — shuni aniqlash kerak.",
      hint: "Bu directed graph. Agar unda sikl bo'lsa, kurslarni tugatib bo'lmaydi. Hech qanday shartsiz (prerequisite'siz) kurslardan boshlab ko'r.",
      approach:
        "I build a directed graph from each prerequisite to the course that needs it. The question is whether this graph has a cycle. I use Kahn's topological sort: I count incoming edges for each course and start with courses that have zero. When I take a course, I decrease the count of its next courses. If I can take all courses, there is no cycle.",
      complexity: { time: 'O(V + E)', space: 'O(V + E)' },
      solution: `function canFinish(numCourses, prerequisites) {
  const graph = Array.from({ length: numCourses }, () => [])
  const inDegree = new Array(numCourses).fill(0)
  for (const [course, pre] of prerequisites) {
    graph[pre].push(course)
    inDegree[course]++
  }
  const queue = [] // courses with no remaining prerequisites
  for (let i = 0; i < numCourses; i++) if (inDegree[i] === 0) queue.push(i)
  let taken = 0
  while (queue.length) {
    const c = queue.shift()
    taken++
    for (const next of graph[c]) {
      if (--inDegree[next] === 0) queue.push(next)
    }
  }
  return taken === numCourses // false means there is a cycle
}`,
      edgeCases: ['no prerequisites', 'a course that requires itself', 'two separate groups of courses'],
    },
    {
      id: 'kth-smallest-element-in-a-bst',
      title: 'Kth Smallest Element in a BST',
      url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/',
      difficulty: 'Medium',
      pattern: 'tree-dfs-bfs',
      days: [75],
      task: "BST'ning root'i va k berilgan. Tree'dagi k-chi eng kichik qiymatni (1 dan sanaganda) topish kerak.",
      hint: "BST'ni qaysi tartibda aylanib chiqsang, qiymatlar o'sish tartibida keladi? k-chi qiymatda to'xta.",
      approach:
        "I could collect all values, sort them and take the k-th, but that is O(n log n). In a BST, in-order traversal gives the values in sorted order. I do an iterative in-order traversal with a stack and count the nodes I visit. When the count reaches k, I return that value and stop early.",
      complexity: { time: 'O(h + k)', space: 'O(h), h = tree height' },
      solution: `function kthSmallest(root, k) {
  const stack = []
  let node = root
  while (node || stack.length) {
    while (node) { // go as far left as possible
      stack.push(node)
      node = node.left
    }
    node = stack.pop()
    if (--k === 0) return node.val // k-th node in sorted order
    node = node.right
  }
  return -1
}`,
      edgeCases: ['k = 1 (the minimum)', 'k equals the number of nodes', 'tree that has only right children'],
    },

    // ---------- Timed Medium: Kun 79 ----------
    {
      id: 'subsets',
      title: 'Subsets',
      url: 'https://leetcode.com/problems/subsets/',
      difficulty: 'Medium',
      pattern: 'backtracking',
      days: [79],
      task: "Har xil sonlardan iborat massivning barcha mumkin bo'lgan subset'larini (power set) qaytarish kerak, bo'sh to'plam ham kiradi.",
      hint: "Har bir son uchun ikki tanlov bor: subset'ga kiritish yoki kiritmaslik. Recursion bilan tanlov qil va keyin uni bekor qil.",
      approach:
        "There are 2 to the power of n subsets, so the answer itself is exponential. I use backtracking with a current path. At each call, I save a copy of the path as one subset. Then for each next number, I add it, go deeper with recursion, and remove it after. Starting from index i plus one avoids duplicates.",
      complexity: { time: 'O(n · 2^n)', space: 'O(n) for recursion (output not counted)' },
      solution: `function subsets(nums) {
  const result = []
  const path = []
  const backtrack = (start) => {
    result.push([...path]) // every path is a valid subset
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]) // choose
      backtrack(i + 1) // explore
      path.pop() // undo
    }
  }
  backtrack(0)
  return result
}`,
      edgeCases: ['one element', 'the empty subset must be included', 'negative numbers'],
    },
    {
      id: 'spiral-matrix',
      title: 'Spiral Matrix',
      url: 'https://leetcode.com/problems/spiral-matrix/',
      difficulty: 'Medium',
      pattern: 'matrix',
      days: [79],
      task: "m × n matrix'ning barcha elementlarini spiral tartibda (soat strelkasi bo'yicha, tashqaridan ichkariga) qaytarish kerak.",
      hint: "To'rtta chegara saqla: top, bottom, left, right. Bitta tomonni o'qib bo'lgach, o'sha chegarani ichkariga sur.",
      approach:
        "I keep four boundaries: top, bottom, left and right. I read the top row from left to right and move top down. Then I read the right column and move right to the left. I read the bottom row and the left column only if they still exist, to avoid reading a row or column twice. I repeat until the boundaries cross.",
      complexity: { time: 'O(m · n)', space: 'O(1) extra (output not counted)' },
      solution: `function spiralOrder(matrix) {
  const result = []
  let top = 0
  let bottom = matrix.length - 1
  let left = 0
  let right = matrix[0].length - 1
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) result.push(matrix[top][c])
    top++
    for (let r = top; r <= bottom; r++) result.push(matrix[r][right])
    right--
    if (top <= bottom) { // a bottom row is still left
      for (let c = right; c >= left; c--) result.push(matrix[bottom][c])
      bottom--
    }
    if (left <= right) { // a left column is still left
      for (let r = bottom; r >= top; r--) result.push(matrix[r][left])
      left++
    }
  }
  return result
}`,
      edgeCases: ['one row', 'one column', 'non-square matrix, like 3 × 4'],
    },
    {
      id: 'coin-change',
      title: 'Coin Change',
      url: 'https://leetcode.com/problems/coin-change/',
      difficulty: 'Medium',
      pattern: 'dynamic-programming',
      days: [79],
      task: "Tangalar nominallari va amount berilgan. amount'ni yig'ish uchun kerak bo'ladigan eng kam tangalar sonini topish kerak; iloji bo'lmasa -1. Har bir tangadan cheksiz foydalanish mumkin.",
      hint: "dp[x] — x summani yig'ish uchun eng kam tangalar soni bo'lsin. Oxirgi qo'shilgan tanga c bo'lsa, dp[x] qaysi oldingi qiymatdan kelib chiqadi?",
      approach:
        "A greedy approach with the biggest coin first does not always work, for example with coins 1, 3 and 4 and amount 6. I use dynamic programming where dp[x] is the minimum number of coins for amount x. dp[0] is zero, and the rest start as infinity. For each amount and each coin, dp[x] is the minimum of dp[x] and dp[x minus coin] plus one. If dp[amount] is still infinity, I return minus one.",
      complexity: { time: 'O(amount · coins)', space: 'O(amount)' },
      solution: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity) // dp[x] = min coins for x
  dp[0] = 0
  for (let x = 1; x <= amount; x++) {
    for (const coin of coins) {
      if (coin <= x) dp[x] = Math.min(dp[x], dp[x - coin] + 1)
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount]
}`,
      edgeCases: ['amount = 0 (answer 0)', 'impossible amount, like coins [2] and amount 3', 'greedy fails, like coins [1, 3, 4] and amount 6'],
    },

    // ---------- Timed Medium: Kun 82 ----------
    {
      id: 'lru-cache',
      title: 'LRU Cache',
      url: 'https://leetcode.com/problems/lru-cache/',
      difficulty: 'Medium',
      pattern: 'hash-map',
      days: [82],
      task: "Berilgan sig'imli (capacity) LRU cache yozish kerak: get(key) va put(key, value) O(1) da ishlashi, cache to'lganda esa eng uzoq vaqt ishlatilmagan kalit o'chirilishi kerak.",
      hint: "Kalit bo'yicha tez qidiruv va \"ishlatilish tartibi\" kerak. JS'dagi Map kalitlarni qo'shilish tartibida saqlaydi — buni qanday ishlatsa bo'ladi?",
      approach:
        "We need fast lookup and an order of use. The classic solution is a hash map plus a doubly linked list. In JavaScript, a Map keeps keys in insertion order, so I can use it for both. On get or put, I delete the key and insert it again, so it becomes the most recent. When the size is bigger than the capacity, I delete the first key, which is the least recently used.",
      complexity: { time: 'O(1) for get and put', space: 'O(capacity)' },
      solution: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity
    this.map = new Map() // keeps keys in order: oldest first
  }
  get(key) {
    if (!this.map.has(key)) return -1
    const value = this.map.get(key)
    this.map.delete(key) // move the key to the "most recent" end
    this.map.set(key, value)
    return value
  }
  put(key, value) {
    this.map.delete(key)
    this.map.set(key, value)
    if (this.map.size > this.capacity) {
      const oldest = this.map.keys().next().value
      this.map.delete(oldest)
    }
  }
}`,
      edgeCases: ['capacity = 1', 'put an existing key (update, not a new entry)', 'get makes a key recent, so another key is removed'],
    },
    {
      id: 'combination-sum',
      title: 'Combination Sum',
      url: 'https://leetcode.com/problems/combination-sum/',
      difficulty: 'Medium',
      pattern: 'backtracking',
      days: [82],
      task: "Har xil musbat sonlar (candidates) va target berilgan. Yig'indisi target bo'lgan barcha noyob kombinatsiyalarni topish kerak; bir sonni bir necha marta ishlatish mumkin.",
      hint: "Backtracking: sonni qo'sh va qolgan summa bilan davom et. Bir xil kombinatsiya boshqa tartibda takrorlanmasligi uchun faqat joriy index va undan keyingilarni tanla.",
      approach:
        "I use backtracking with the remaining target. At each step I try candidates from the current index, so each combination appears in only one order. I can stay on the same index, because a number can be used many times. If the remaining target is zero, I save a copy of the path. Sorting lets me stop early when a candidate is bigger than the remaining target.",
      complexity: { time: 'O(n^(target / min)) — exponential', space: 'O(target / min) for recursion' },
      solution: `function combinationSum(candidates, target) {
  candidates.sort((a, b) => a - b)
  const result = []
  const path = []
  const backtrack = (start, remaining) => {
    if (remaining === 0) {
      result.push([...path])
      return
    }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > remaining) break // sorted, so the rest are too big
      path.push(candidates[i])
      backtrack(i, remaining - candidates[i]) // i, not i + 1: reuse is allowed
      path.pop()
    }
  }
  backtrack(0, target)
  return result
}`,
      edgeCases: ['no combination exists, like candidates [2] and target 1', 'target equals one candidate', 'the same number used many times'],
    },
    {
      id: 'rotate-image',
      title: 'Rotate Image',
      url: 'https://leetcode.com/problems/rotate-image/',
      difficulty: 'Medium',
      pattern: 'matrix',
      days: [82],
      task: "n × n matrix'ni soat strelkasi bo'yicha 90 gradusga in-place (yangi matrix yaratmasdan) burish kerak.",
      hint: "Burishni ikki oddiy amalga bo'l: diagonal bo'yicha akslantirish (transpose) va har bir qatorni teskari qilish.",
      approach:
        "Using a second matrix is easy, but the task asks for in-place. A 90-degree clockwise rotation equals two simple steps. First I transpose the matrix, which means I swap matrix[i][j] with matrix[j][i]. Then I reverse each row. Both steps work in place.",
      complexity: { time: 'O(n²)', space: 'O(1)' },
      solution: `function rotate(matrix) {
  const n = matrix.length
  // 1) transpose: swap across the main diagonal
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      ;[matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]]
    }
  }
  // 2) reverse each row
  for (const row of matrix) row.reverse()
}`,
      edgeCases: ['1 × 1 matrix', '2 × 2 matrix', 'negative values'],
    },
  ],
}

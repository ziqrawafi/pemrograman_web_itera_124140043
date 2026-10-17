// Latihan Mandiri Pertemuan 2 — jalankan: node latihan.js (atau import di browser)

// --- Let/Const & Arrow ---
const PI = 3.14;
const user = { name: "John", age: 30 };
user.age = 31;                   

const kuadrat = (x) => x * x;
const sapa = () => "Halo!";
const jumlah = (a, b) => a + b;
const buatUser = (name, age) => ({ name, age });

// --- Template literals: HTML string ---
const kartu = ({ name, age }) => `
<div class="card">
  <h3>${name}</h3>
  <p>Umur: ${age} tahun</p>
</div>`;

// --- Destructuring 3 level + for...of ---
const data = { a: { b: { c: "dalam" } } };
const { a: { b: { c } } } = data;
const pasangan = [["x", 1], ["y", 2]];
for (const [kunci, nilai] of pasangan) console.log(kunci, nilai);

// --- Rest parameter: statistik ---
const statistik = (...angka) => ({
  min: Math.min(...angka),
  max: Math.max(...angka),
  rata: angka.reduce((t, n) => t + n, 0) / angka.length,
});

// --- Merge 3 objek dengan spread ---
const gabung = { ...{ a: 1, b: 2 }, ...{ b: 20, c: 3 }, ...{ c: 30, d: 4 } }; // {a:1,b:20,c:30,d:4}

// --- Class: Product -> DigitalProduct & PhysicalProduct (getter/setter) ---
class Product {
  #price;
  constructor(name, price) { this.name = name; this.price = price; }
  get price() { return this.#price; }
  set price(v) { if (v < 0) throw new Error("Harga tidak boleh negatif"); this.#price = v; }
  toString() { return `${this.name}: Rp${this.price.toLocaleString("id-ID")}`; }
}
class DigitalProduct extends Product {
  constructor(name, price, sizeMB) { super(name, price); this.sizeMB = sizeMB; }
  toString() { return `${super.toString()} (${this.sizeMB} MB)`; }
}
class PhysicalProduct extends Product {
  constructor(name, price, weightKg) { super(name, price); this.weightKg = weightKg; }
  toString() { return `${super.toString()} (${this.weightKg} kg)`; }
}

// --- Computed property names ---
const prefix = "item";
const dinamis = { [`${prefix}_1`]: "A", [`${prefix}_2`]: "B" };

// --- Default parameter + destructuring ---
const buatOrder = ({ produk, jumlah = 1, harga = 0 } = {}) => ({ produk, jumlah, total: harga * jumlah });

// --- groupBy dengan reduce, rata-rata, flatten, chaining ---
const groupBy = (arr, key) => arr.reduce((acc, item) => ({ ...acc, [item[key]]: [...(acc[item[key]] ?? []), item] }), {});
const rataUmur = (arr) => arr.reduce((t, { age }) => t + age, 0) / arr.length;
const ratakan = (nested) => nested.flat(Infinity);
const orang = [
  { name: "John", age: 25, role: "admin", active: true },
  { name: "Jane", age: 30, role: "user", active: false },
  { name: "Bob", age: 22, role: "admin", active: true },
];
const analisis = orang.filter((o) => o.active).map((o) => o.age).reduce((t, n) => t + n, 0);

// --- Async: beberapa endpoint, retry + exponential backoff ---
const tunggu = (ms) => new Promise((r) => setTimeout(r, ms));
async function retry(fn, percobaan = 3, jeda = 300) {
  for (let i = 0; i < percobaan; i++) {
    try { return await fn(); }
    catch (err) {
      if (i === percobaan - 1) throw err;
      await tunggu(jeda * 2 ** i);   // 300, 600, 1200 ms
    }
  }
}
async function ambilBanyak(urls) {
  const hasil = await Promise.allSettled(urls.map((u) => retry(() => fetch(u).then((r) => r.json()))));
  return hasil.map((h) => (h.status === "fulfilled" ? h.value : { error: h.reason.message }));
}

// --- Demo cepat ---
console.log(kuadrat(4), sapa(), jumlah(2, 3), buatUser("Wafi", 20), c);
console.log(statistik(5, 2, 8, 1, 9), gabung, dinamis);
console.log(String(new DigitalProduct("E-book", 50000, 12)), String(new PhysicalProduct("Buku", 80000, 0.4)));
console.log(buatOrder({ produk: "Pensil", harga: 2000 }), groupBy(orang, "role"));
console.log(rataUmur(orang), ratakan([1, [2, [3, [4]]]]), analisis);
let gagal = 0;
retry(async () => { if (++gagal < 3) throw new Error("gagal"); return "berhasil setelah " + gagal + " percobaan"; }).then(console.log);

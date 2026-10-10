// ===== Konfigurasi =====
const KUNCI_STORAGE = "minipos_keranjang";
const MIN_DISKON = 50000;
const PERSEN_DISKON = 0.1;
const KODE_PROMO = "HEMAT10";

// ===== Elemen DOM =====
const form = document.getElementById("form-barang");
const inputNama = document.getElementById("nama");
const inputHarga = document.getElementById("harga");
const inputQty = document.getElementById("qty");
const inputKode = document.getElementById("kode");
const inputBayar = document.getElementById("bayar");
const tbody = document.getElementById("isi-keranjang");

// ===== State =====
let keranjang = muatKeranjang();

// ===== Utilitas =====
function formatRupiah(angka) {
  return "Rp" + angka.toLocaleString("id-ID");
}

function muatKeranjang() {
  try {
    const data = JSON.parse(localStorage.getItem(KUNCI_STORAGE));
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

function simpanKeranjang() {
  localStorage.setItem(KUNCI_STORAGE, JSON.stringify(keranjang));
}

// ===== Validasi =====
function setError(input, pesan) {
  document.getElementById("err-" + input.id).textContent = pesan;
  input.classList.toggle("invalid", pesan !== "");
}

function validasiForm() {
  const nama = inputNama.value.trim();
  const hargaMentah = inputHarga.value.trim();
  const qtyMentah = inputQty.value.trim();
  const harga = Number(hargaMentah);
  const qty = Number(qtyMentah);
  let valid = true;

  if (nama.length < 3) {
    setError(inputNama, "Nama barang wajib diisi, minimal 3 karakter.");
    valid = false;
  } else setError(inputNama, "");

  if (hargaMentah === "" || isNaN(harga) || harga < 500) {
    setError(inputHarga, "Harga harus berupa angka minimal Rp500.");
    valid = false;
  } else setError(inputHarga, "");

  if (qtyMentah === "" || !Number.isInteger(qty) || qty < 1) {
    setError(inputQty, "Jumlah harus bilangan bulat minimal 1.");
    valid = false;
  } else setError(inputQty, "");

  return valid ? { nama, harga, qty } : null;
}

// ===== Perhitungan =====
function hitungTotal() {
  return keranjang.reduce((jumlah, item) => jumlah + item.harga * item.qty, 0);
}

function hitungDiskon(total) {
  const kodeValid = inputKode.value.trim().toUpperCase() === KODE_PROMO;
  if (total >= MIN_DISKON || (kodeValid && total > 0)) {
    return Math.round(total * PERSEN_DISKON);
  }
  return 0;
}

// ===== Tampilan =====
function render() {
  tbody.innerHTML = "";

  if (keranjang.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 6;
    td.className = "kosong";
    td.textContent = "Keranjang masih kosong. Tambahkan barang di form.";
    tr.appendChild(td);
    tbody.appendChild(tr);
  }

  keranjang.forEach((item, i) => {
    const tr = document.createElement("tr");
    const kolom = [
      [i + 1, ""],
      [item.nama, ""],
      [formatRupiah(item.harga), "num"],
      [item.qty, "num"],
      [formatRupiah(item.harga * item.qty), "num"],
    ];
    kolom.forEach(([isi, kelas]) => {
      const td = document.createElement("td");
      td.textContent = isi;
      td.className = kelas;
      tr.appendChild(td);
    });

    const tdAksi = document.createElement("td");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn small";
    btn.textContent = "Hapus";
    btn.addEventListener("click", () => hapusItem(i));
    tdAksi.appendChild(btn);
    tr.appendChild(tdAksi);
    tbody.appendChild(tr);
  });

  const total = hitungTotal();
  const diskon = hitungDiskon(total);
  document.getElementById("total").textContent = formatRupiah(total);
  document.getElementById("diskon").textContent = "-" + formatRupiah(diskon);
  document.getElementById("label-diskon").textContent =
    diskon > 0 ? "Diskon 10%" : "Diskon";
  document.getElementById("total-akhir").textContent = formatRupiah(total - diskon);
  renderKembalian(total - diskon);
}

function renderKembalian(totalAkhir) {
  const el = document.getElementById("kembalian");
  el.className = "kembalian";
  if (inputBayar.value.trim() === "" || totalAkhir === 0) {
    el.textContent = "";
    return;
  }
  const bayar = Number(inputBayar.value);
  if (bayar < totalAkhir) {
    el.textContent = "Uang belum mencukupi, kurang " + formatRupiah(totalAkhir - bayar) + ".";
    el.classList.add("kurang");
  } else {
    el.textContent = "Kembalian: " + formatRupiah(bayar - totalAkhir);
    el.classList.add("ok");
  }
}

// ===== Aksi =====
function tambahItem(event) {
  event.preventDefault();
  const data = validasiForm();
  if (!data) return;

  const ada = keranjang.find(
    (it) => it.nama.toLowerCase() === data.nama.toLowerCase() && it.harga === data.harga
  );
  if (ada) ada.qty += data.qty;
  else keranjang.push(data);

  simpanKeranjang();
  form.reset();
  inputNama.focus();
  render();
}

function hapusItem(index) {
  keranjang.splice(index, 1);
  simpanKeranjang();
  render();
}

function transaksiBaru() {
  keranjang = [];
  localStorage.removeItem(KUNCI_STORAGE);
  inputKode.value = "";
  inputBayar.value = "";
  render();
}

// ===== Event listener =====
form.addEventListener("submit", tambahItem);
inputKode.addEventListener("input", render);
inputBayar.addEventListener("input", render);
document.getElementById("btn-reset").addEventListener("click", transaksiBaru);

render();

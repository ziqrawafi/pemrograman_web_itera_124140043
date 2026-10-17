// js/main.js — tampilan (DOM) dan event
import { DashboardApp } from "./dashboard.js";

const app = new DashboardApp();
let editingId = null;

const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const renderStats = () => {
  const { total, done, pending, late } = app.stats;
  $("#stats").innerHTML = `
    <div class="stat"><b>${pending}</b>belum selesai</div>
    <div class="stat"><b>${done}</b>selesai dari ${total}</div>
    <div class="stat"><b class="${late ? "late" : ""}">${late}</b>terlambat</div>`;
};

const renderList = () => {
  const items = app.visible;
  $("#list").innerHTML = items.length
    ? items.map(({ id, title, course, done, deadlineLabel, daysLeft }) => {
        const tone = !done && daysLeft !== null ? (daysLeft < 0 ? "late" : daysLeft <= 2 ? "soon" : "") : "";
        return `
        <li class="item ${done ? "done" : ""}" data-id="${id}">
          <input type="checkbox" data-act="toggle" ${done ? "checked" : ""} aria-label="Tandai selesai: ${esc(title)}">
          <div class="info">
            <div class="name">${esc(title)}</div>
            <div class="meta">${esc(course)} · <span class="${tone}">${deadlineLabel}</span></div>
          </div>
          <div class="acts">
            <button data-act="edit">Ubah</button>
            <button data-act="delete">Hapus</button>
          </div>
        </li>`;
      }).join("")
    : `<li class="empty">Belum ada tugas di sini. Tambahkan tugas pertamamu lewat formulir di atas.</li>`;
};

const render = () => { renderStats(); renderList(); };

const resetForm = () => {
  editingId = null;
  $("#taskForm").reset();
  $("#saveBtn").textContent = "Tambah tugas";
  $("#cancelBtn").hidden = true;
};

$("#taskForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = { title: $("#title").value.trim(), course: $("#course").value.trim(), deadline: $("#deadline").value };
  if (!data.title) return;
  editingId ? app.update(editingId, data) : app.add(data);
  resetForm();
  render();
});

$("#cancelBtn").addEventListener("click", resetForm);

$("#list").addEventListener("click", (e) => {
  const act = e.target.dataset.act;
  const li = e.target.closest(".item");
  if (!act || !li) return;
  const id = Number(li.dataset.id);
  if (act === "toggle") app.toggle(id);
  if (act === "delete" && confirm("Hapus tugas ini?")) app.remove(id);
  if (act === "edit") {
    const { title, course, deadline } = app.tasks.find((t) => t.id === id);
    $("#title").value = title; $("#course").value = course; $("#deadline").value = deadline;
    editingId = id;
    $("#saveBtn").textContent = "Simpan perubahan";
    $("#cancelBtn").hidden = false;
    $("#title").focus();
    return;
  }
  render();
});

document.querySelector(".filters").addEventListener("click", (e) => {
  const f = e.target.dataset.filter;
  if (!f) return;
  app.filter = f;
  document.querySelectorAll(".filters button").forEach((b) => b.classList.toggle("on", b === e.target));
  renderList();
});

// Data dari API (async/await)
const loadExternal = async () => {
  const [weather, quote] = await Promise.all([app.fetchWeather(), app.fetchQuote()]);
  $("#weather").textContent = weather
    ? `ITERA: ${weather.temperature}°C, angin ${weather.windspeed} km/j`
    : "Cuaca tidak tersedia (cek koneksi)";
  $("#quote").textContent = quote ? `“${quote.quote}” — ${quote.author}` : "Semangat mengerjakan tugasmu hari ini.";
};

render();
loadExternal();

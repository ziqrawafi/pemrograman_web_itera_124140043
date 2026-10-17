// js/dashboard.js — model data (TaskItem) dan pengelola state (DashboardApp)

export class TaskItem {
  constructor({ id = Date.now(), title, course = "Umum", deadline = "", done = false } = {}) {
    this.id = id;
    this.title = title;
    this.course = course || "Umum";
    this.deadline = deadline;
    this.done = done;
  }

  // Sisa hari sampai deadline (null jika tidak ada deadline)
  get daysLeft() {
    if (!this.deadline) return null;
    const end = new Date(`${this.deadline}T23:59:59`);
    return Math.ceil((end - new Date()) / 86400000);
  }

  get deadlineLabel() {
    const d = this.daysLeft;
    if (d === null) return "Tanpa deadline";
    if (d < 0) return `Terlambat ${Math.abs(d)} hari`;
    if (d === 0) return "Deadline hari ini";
    return `${d} hari lagi`;
  }
}

export class DashboardApp {
  static KEY = "dashboard_tugas_v1";

  constructor() {
    this.filter = "all";
    this.tasks = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(DashboardApp.KEY);
      return raw ? JSON.parse(raw).map((t) => new TaskItem(t)) : [];
    } catch {
      return [];
    }
  }

  save() {
    try {
      localStorage.setItem(DashboardApp.KEY, JSON.stringify(this.tasks));
    } catch (e) {
      console.warn("Gagal menyimpan:", e);
    }
  }

  // Spread dipakai agar array state tidak diubah langsung (immutable)
  add = ({ title, course, deadline }) => {
    this.tasks = [new TaskItem({ title, course, deadline }), ...this.tasks];
    this.save();
  };

  update = (id, changes) => {
    this.tasks = this.tasks.map((t) => (t.id === id ? new TaskItem({ ...t, ...changes }) : t));
    this.save();
  };

  remove = (id) => {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.save();
  };

  toggle = (id) => {
    const task = this.tasks.find((t) => t.id === id);
    if (task) this.update(id, { done: !task.done });
  };

  get visible() {
    const rules = {
      all: () => true,
      pending: (t) => !t.done,
      done: (t) => t.done,
    };
    return this.tasks.filter(rules[this.filter]);
  }

  get stats() {
    const total = this.tasks.length;
    const done = this.tasks.filter((t) => t.done).length;
    const late = this.tasks.filter((t) => !t.done && t.daysLeft !== null && t.daysLeft < 0).length;
    return { total, done, pending: total - done, late };
  }

  // Cuaca ITERA (Open-Meteo) — async/await + try/catch
  async fetchWeather() {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=-5.36&longitude=105.31&current_weather=true";
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { current_weather: { temperature, windspeed } } = await res.json();
      return { temperature, windspeed };
    } catch {
      return null;
    }
  }

  // Kutipan harian (DummyJSON)
  async fetchQuote() {
    try {
      const res = await fetch("https://dummyjson.com/quotes/random");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { quote, author } = await res.json();
      return { quote, author };
    } catch {
      return null;
    }
  }
}

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ============ ДАННЫЕ В ПАМЯТИ ============
let students = [
  { id: 1, name: 'Иванов Иван', group: 'ПИ-21', course: 2, avg_grade: 4.5 },
  { id: 2, name: 'Петрова Анна', group: 'ПИ-22', course: 2, avg_grade: 4.8 },
  { id: 3, name: 'Сидоров Пётр', group: 'ПИ-21', course: 2, avg_grade: 3.9 }
];
let nextId = 4;

// Валидация
function validate(b) {
  const e = [];
  if (!b.name || typeof b.name !== 'string') e.push('name обязателен (строка)');
  if (!b.group || typeof b.group !== 'string') e.push('group обязателен (строка)');
  if (b.course !== undefined && (!Number.isInteger(b.course) || b.course < 1 || b.course > 6))
    e.push('course: целое число 1-6');
  if (b.avg_grade !== undefined && (typeof b.avg_grade !== 'number' || b.avg_grade < 2 || b.avg_grade > 5))
    e.push('avg_grade: число 2-5');
  return e;
}

// GET все (поиск + сортировка + пагинация)
app.get('/students', (req, res) => {
  let r = [...students];
  const { search, sort, order, page, limit } = req.query;

  if (search) r = r.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  if (sort) {
    const ok = ['id', 'name', 'group', 'course', 'avg_grade'];
    if (!ok.includes(sort)) return res.status(400).json({ error: 'Неверное поле sort' });
    const d = order === 'desc' ? -1 : 1;
    r.sort((a, b) => (a[sort] > b[sort] ? d : a[sort] < b[sort] ? -d : 0));
  }

  const p = parseInt(page), l = parseInt(limit);
  if (p && l) r = r.slice((p - 1) * l, (p - 1) * l + l);

  res.json({ count: r.length, students: r });
});

// GET один
app.get('/students/:id', (req, res) => {
  const s = students.find(x => x.id === +req.params.id);
  s ? res.json(s) : res.status(404).json({ error: 'Не найден' });
});

// POST
app.post('/students', (req, res) => {
  const e = validate(req.body);
  if (e.length) return res.status(400).json({ errors: e });
  const s = { id: nextId++, ...req.body };
  students.push(s);
  res.status(201).json(s);
});

// PUT
app.put('/students/:id', (req, res) => {
  const i = students.findIndex(x => x.id === +req.params.id);
  if (i === -1) return res.status(404).json({ error: 'Не найден' });
  const e = validate(req.body);
  if (e.length) return res.status(400).json({ errors: e });
  students[i] = { id: students[i].id, ...req.body };
  res.json(students[i]);
});

// DELETE — 204
app.delete('/students/:id', (req, res) => {
  const i = students.findIndex(x => x.id === +req.params.id);
  if (i === -1) return res.status(404).json({ error: 'Не найден' });
  students.splice(i, 1);
  res.status(204).send();
});

// 404 для неизвестных маршрутов
app.use((req, res) => res.status(404).json({ error: 'Маршрут не найден' }));

// Запуск
app.listen(port, () => console.log(`Сервер запущен: http://localhost:${port}`));
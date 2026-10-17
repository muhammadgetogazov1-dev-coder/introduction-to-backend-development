const express = require('express');
const app = express();
const port = 3000;

// Текстовый эндпоинт
app.get('/', (req, res) => {
  res.send('API Gateway');
});

//.эндпоин 1 (сущность — студенты)
app.get('/api/students', (req, res) => {
  res.json([
    { id: 1, name: 'Иванов Иван', group: 'IBIT-31', year: 2 },
    { id: 2, name: 'Петрова Мария', group: 'IBIT-32', year: 2 },
    { id: 3, name: 'Сидоров Пётр', group: 'IBIT-31', year: 2 },
    { id: 4, name: 'Капустина Анна', group: 'IBIT-33', year: 1 }
  ]);
});

//эндпоинт 2 (справочник — группы)
app.get('/api/groups', (req, res) => {
  res.json([
    { id: 1, name: 'IBIT-31', course: 2, studentsCount: 25 },
    { id: 2, name: 'IBIT-32', course: 2, studentsCount: 23 },
    { id: 3, name: 'IBIT-33', course: 1, studentsCount: 27 },
    { id: 4, name: 'IBIT-34', course: 1, studentsCount: 24 }
  ]);
});

// Обработка 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
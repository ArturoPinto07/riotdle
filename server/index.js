import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.listen(3001, () => {
  console.log('Servidor funcionando en http://localhost:3001');
});
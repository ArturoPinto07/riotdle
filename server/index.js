import express from 'express';
import cors from 'cors';
import { readFile } from 'node:fs/promises';

const app = express();
app.use(cors());

const lol = JSON.parse(await readFile('data/lol.json', 'utf-8'));
const valorant = JSON.parse(await readFile('data/valorant.json', 'utf-8'));

function personajeDelDia(lista) {
  const dias = Math.floor(Date.now() / 86400000);
  return lista[dias % lista.length];
}

function compararLista(a, b) {
  const comunes = a.filter((x) => b.includes(x));
  if (comunes.length === a.length && comunes.length === b.length) return 'correcto';
  if (comunes.length > 0) return 'parcial';
  return 'incorrecto';
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/lol/personajes', (req, res) => {
  res.json(lol);
});

app.get('/api/valorant/personajes', (req, res) => {
  res.json(valorant);
});

app.get('/api/lol/comparar/:id', (req, res) => {
  const intento = lol.find((p) => p.id === req.params.id);
  if (!intento) {
    return res.status(404).json({ error: 'Campeón no encontrado' });
  }

  const secreto = personajeDelDia(lol);

  res.json({
    acierto: intento.id === secreto.id,
    pistas: {
      clases: compararLista(intento.clases, secreto.clases),
      recurso: intento.recurso === secreto.recurso ? 'correcto' : 'incorrecto',
    },
  });
});

app.listen(3001, () => {
  console.log('Servidor funcionando en http://localhost:3001');
});
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const url = 'https://valorant-api.com/v1/agents?isPlayableCharacter=true&language=es-ES';
const respuesta = await fetch(url);
const { data } = await respuesta.json();

const anios = JSON.parse(await readFile('data/valorant-anios.json', 'utf-8'));

const personajes = data.map((a) => ({
  id: a.uuid,
  nombre: a.displayName,
  rol: a.role.displayName,
  anio: anios[a.displayName] ?? null,
  imagen: a.displayIcon,
}));

const sinAnio = personajes.filter((p) => p.anio === null);
if (sinAnio.length > 0) {
  console.log('Agentes sin año:', sinAnio.map((p) => p.nombre));
}

await mkdir('data', { recursive: true });
await writeFile('data/valorant.json', JSON.stringify(personajes, null, 2));

console.log(`Guardados ${personajes.length} agentes en data/valorant.json`);
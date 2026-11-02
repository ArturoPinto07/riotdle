import { writeFile, mkdir } from 'node:fs/promises';

const respuesta = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
const versiones = await respuesta.json();
const version = versiones[0];

const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/es_ES/champion.json`;
const respuestaCampeones = await fetch(url);
const { data } = await respuestaCampeones.json();

const campeones = Object.values(data);

const personajes = campeones.map((c) => ({
  id: c.id,
  nombre: c.name,
  titulo: c.title,
  clases: c.tags,
  recurso: c.partype,
  imagen: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${c.image.full}`,
}));

await mkdir('data', { recursive: true });
await writeFile('data/lol.json', JSON.stringify(personajes, null, 2));

console.log(`Guardados ${personajes.length} campeones en data/lol.json`);
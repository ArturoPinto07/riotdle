import { useState, useEffect } from 'react';

function App() {
  const [personajes, setPersonajes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [intentos, setIntentos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/lol/personajes')
      .then((res) => res.json())
      .then((datos) => setPersonajes(datos));
  }, []);

  // Ids de los campeones que ya has probado
  const yaUsados = [];
  for (const intento of intentos) {
    yaUsados.push(intento.personaje.id);
  }

  // Has acertado si el intento más reciente (el primero de la lista) fue un acierto
  const acertado = intentos.length > 0 && intentos[0].acierto;

  // Campeones que se muestran mientras escribes
  const sugerencias = [];
  if (busqueda !== '') {
    for (const p of personajes) {
      const coincide = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const noUsado = !yaUsados.includes(p.id);
      if (coincide && noUsado && sugerencias.length < 8) {
        sugerencias.push(p);
      }
    }
  }

  function cambiarBusqueda(evento) {
    setBusqueda(evento.target.value);
  }

  function adivinar(personaje) {
    fetch(`http://localhost:3001/api/lol/comparar/${personaje.id}`)
      .then((res) => res.json())
      .then((resultado) => {
        const nuevoIntento = {
          personaje: personaje,
          acierto: resultado.acierto,
          pistas: resultado.pistas,
        };
        setIntentos([nuevoIntento].concat(intentos));
        setBusqueda('');
      });
  }

  function icono(valor) {
    if (valor === 'correcto') return '🟩';
    if (valor === 'parcial') return '🟨';
    return '🟥';
  }

  let zonaBusqueda;
  if (acertado) {
    zonaBusqueda = <p>¡Acertaste en {intentos.length} intentos!</p>;
  } else {
    zonaBusqueda = (
      <input value={busqueda} onChange={cambiarBusqueda} placeholder="Escribe un campeón..." />
    );
  }

  return (
    <div>
      <h1>Riotdle</h1>

      {zonaBusqueda}

      {sugerencias.map((p) => (
        <div key={p.id}>
          <button onClick={() => adivinar(p)}>
            <img src={p.imagen} alt={p.nombre} width="32" /> {p.nombre}
          </button>
        </div>
      ))}

      <hr />

      {intentos.map((i) => (
        <div key={i.personaje.id}>
          <img src={i.personaje.imagen} alt={i.personaje.nombre} width="48" />
          <strong>{i.personaje.nombre}</strong>
          {' | '}Clases: {icono(i.pistas.clases)}
          {' | '}Recurso: {icono(i.pistas.recurso)}
        </div>
      ))}
    </div>
  );
}

export default App;
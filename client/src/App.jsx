import { useState, useEffect } from 'react';

function App() {
  const [respuesta, setRespuesta] = useState('Cargando...');

  useEffect(() => {
    fetch('http://localhost:3001/api/health')
      .then((res) => res.json())
      .then((datos) => setRespuesta(JSON.stringify(datos)))
      .catch(() => setRespuesta('Error: no se pudo conectar con el servidor'));
  }, []);

  return (
    <div>
      <h1>Riotdle</h1>
      <p>Respuesta del servidor: {respuesta}</p>
    </div>
  );
}

export default App;
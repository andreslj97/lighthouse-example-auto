const path = require('path');

module.exports = async function handler(req, res) {
  try {
    // Import dinámico del módulo ES
    const runLighthouseModule = await import(path.join(__dirname, '..', 'run-lighthouse.js'));
    
    // Asumiendo que exportas una función llamada runLighthouse desde run-lighthouse.mjs
    const { runLighthouse } = runLighthouseModule;

    // Ejecutar la función que corre Lighthouse y sube el reporte
    const result = await runLighthouse();

    // Responder con el URL del reporte
    return res.status(200).json({ message: 'Run complete', url: result.url });

  } catch (error) {
    console.error('Error en handler:', error);
    return res.status(500).json({ error: error.message });
  }
};

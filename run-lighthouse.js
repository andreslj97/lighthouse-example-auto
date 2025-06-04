const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Timestamp para nombrar carpeta única
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const reportDir = path.join(__dirname, 'lighthouse-report', timestamp);
const lhciTempDir = path.join(__dirname, '.lighthouseci');

console.log(`📊 Ejecutando Lighthouse CI...`);

try {
  // Ejecutar lighthouse-ci
  execSync('npx lhci collect', { stdio: 'inherit' });

  // Crear carpeta de destino con timestamp
  fs.mkdirSync(reportDir, { recursive: true });

  // Copiar archivos desde .lighthouseci a carpeta con timestamp
  const files = fs.readdirSync(lhciTempDir);
  files.forEach(file => {
    const src = path.join(lhciTempDir, file);
    const dest = path.join(reportDir, file);
    fs.copyFileSync(src, dest);
  });

  console.log(`✅ Reportes guardados en: ${reportDir}`);
} catch (err) {
  console.error('❌ Error ejecutando LHCI:', err.message);
  process.exit(1);
}

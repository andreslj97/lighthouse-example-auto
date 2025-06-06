import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { google } from 'googleapis';

const lhciTempDir = path.join(process.cwd(), '.lighthouseci');

async function loadCredentials() {
  const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    GOOGLE_TOKEN
  } = process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI || !GOOGLE_TOKEN) {
    throw new Error('Faltan variables de entorno para la autenticación con Google.');
  }

  const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );

  const token = JSON.parse(GOOGLE_TOKEN);
  oAuth2Client.setCredentials(token);

  return oAuth2Client;
}

async function uploadToDrive(auth) {
  const drive = google.drive({ version: 'v3', auth });

  const htmlReports = fs.readdirSync(lhciTempDir)
    .filter(file => file.endsWith('.html'))
    .map(file => ({
      name: file,
      time: fs.statSync(path.join(lhciTempDir, file)).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time);

  if (htmlReports.length < 1) {
    throw new Error('No se encontró ningún archivo HTML de reporte en ' + lhciTempDir);
  }

  const filesToUpload = htmlReports.slice(0, 2); // Subir los dos más recientes
  const urls = [];

  for (const fileInfo of filesToUpload) {
    const reportPath = path.join(lhciTempDir, fileInfo.name);

    const fileMetadata = {
      name: `lighthouse-${fileInfo.name}`,
    };

    const media = {
      mimeType: 'text/html',
      body: fs.createReadStream(reportPath),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    await drive.permissions.create({
      fileId: file.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const url = `https://drive.google.com/file/d/${file.data.id}/view`;
    console.log(`✅ Reporte subido: ${fileInfo.name} → ${url}`);
    urls.push(url);
  }

  return urls;
}

export async function runLighthouse() {

    const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    GOOGLE_TOKEN
  } = process.env;

  try {
    console.log("VARIABLES DE ENTORNO:",    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    GOOGLE_TOKEN);
    
    console.log('📊 Ejecutando Lighthouse CI...');
    execSync('npx lhci collect', { stdio: 'inherit' });

    const auth = await loadCredentials();
    const urls = await uploadToDrive(auth);

    console.log('✅ Reportes subidos a Google Drive:', urls);

    return { url: urls };
  } catch (error) {
    console.error('❌ Error en runLighthouse:', error.message);
    throw error;
  }
}

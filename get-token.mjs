// get-token.mjs

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import readline from 'readline/promises';
import { stdin, stdout } from 'process';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

async function main() {
  const content = await fs.promises.readFile(CREDENTIALS_PATH, 'utf8');
  const credentials = JSON.parse(content);
  const { client_id, client_secret, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Visita esta URL para autorizar la app:');
  console.log(authUrl);

  const rl = readline.createInterface({ input: stdin, output: stdout });
  const code = await rl.question('Ingresa el código que te da Google: ');
  rl.close();

  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  await fs.promises.writeFile(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  console.log('Token guardado en', TOKEN_PATH);
}

main().catch(console.error);

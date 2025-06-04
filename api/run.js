export default async function handler(req, res) {
  const { exec } = await import('child_process')
  exec('node run-lighthouse.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`)
      return res.status(500).send('Failed')
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`)
    }
    console.log(`stdout: ${stdout}`)
    res.status(200).send('Lighthouse run completed')
  })
}

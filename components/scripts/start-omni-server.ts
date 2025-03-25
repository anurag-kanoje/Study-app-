import { spawn } from 'child_process'
import path from 'path'

function startOmniServer() {
  const pythonProcess = spawn('python', [
    path.join(process.cwd(), 'mini-omni2', 'server.py')
  ])

  pythonProcess.stdout.on('data', (data) => {
    console.log(`Omni server output: ${data}`)
  })

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Omni server error: ${data}`)
  })

  pythonProcess.on('close', (code) => {
    console.log(`Omni server process exited with code ${code}`)
  })
}

startOmniServer()


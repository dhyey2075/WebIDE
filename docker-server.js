const { spawn } = require('child_process');

const command = 'docker run -p 9000:9000 dhyey2075/my-node-app';

const child = spawn(command, { shell: true });

child.stdout.on('data', (data) => {
  console.log(`Output: ${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`Error: ${data}`);
});

child.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
});

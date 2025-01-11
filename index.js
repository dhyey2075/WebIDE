const http = require('http');
const os = require('os');
const express = require('express');
const { Server: socketServer } = require('socket.io');
const pty = require('node-pty');
const path = require('path');
const fs = require('fs/promises');
const cors = require('cors');
const chokidar = require('chokidar');
const fsSync = require('fs');

const app = express();
const server = http.createServer(app);
const io = new socketServer({
    cors: '*'
});

app.use(cors({
    origin: '*'
}));

const baseDirectory = os.platform() === 'win32' ? path.join(process.cwd(), 'user') : path.join(process.cwd(), 'user');

// Ensure the base directory exists
if (!fsSync.existsSync(baseDirectory)) {
    fsSync.mkdirSync(baseDirectory, { recursive: true });
}

var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
var ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: baseDirectory,
    env: process.env
});

io.attach(server);

chokidar.watch(baseDirectory).on('all', (event, filePath) => {
    io.emit('file:change', { event, path: filePath });
});

ptyProcess.onData((data) => {
    io.emit('terminal:data', data);
    console.log('🚀 data:', data);
});

ptyProcess.on('error', (err) => {
    console.error('Error in ptyProcess:', err);
});

io.on('connection', (socket) => {
    console.log('🚀 new connection', socket.id);
    socket.on('terminal:write', (data) => {
        ptyProcess.write(data);
    });
    socket.on('file:save', async ({ pt, content }) => {
        console.log('🚀 pt:', pt);
        console.log('🚀 content:', content);
        pt = pt.replaceAll(">", path.sep);
        const fullPath = path.join(baseDirectory, pt);
        try {
            await fs.writeFile(fullPath, content, 'utf8');
        } catch (err) {
            console.error('Error writing file:', err);
        }
    });
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/getcwd', (req, res) => {
    res.json({ cwd: baseDirectory });
});

app.get('/files', async (req, res) => {
    try {
        const fileTree = await generateFileTree(baseDirectory);
        res.json({ tree: fileTree });
    } catch (err) {
        console.error('Error generating file tree:', err);
        res.status(500).json({ error: 'Unable to generate file tree' });
    }
});

app.get('/getfile', async (req, res) => {
    try {
        let { path: filePath } = req.query;
        filePath = filePath.replaceAll(">", path.sep);
        console.log('🚀 path:', filePath);
        const fullPath = path.join(baseDirectory, filePath);
        const file = await fs.readFile(fullPath, 'utf8');
        res.json({ file });
    } catch (error) {
        console.error('Error reading file:', error);
        res.status(500).json({ error: 'Unable to read the file' });
    }
});

async function generateFileTree(directory) {
    const tree = {};

    async function buildTree(currentDir, currentTree) {
        const files = await fs.readdir(currentDir);

        for (const file of files) {
            const filePath = path.join(currentDir, file);
            const stat = await fs.stat(filePath);
            if (stat.isDirectory()) {
                currentTree[file] = {};
                await buildTree(filePath, currentTree[file]);
            } else {
                currentTree[file] = null;
            }
        }
    }

    await buildTree(directory, tree);
    return tree;
}

server.listen(9000, () => {
    console.log('🐳 server is running on port 9000');
});

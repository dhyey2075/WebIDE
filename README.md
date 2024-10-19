# Web IDE

A cloud-based IDE built using Node.js for the backend and React for the frontend, designed to offer a seamless coding experience directly in your browser. It mimics a traditional desktop IDE with a file explorer, integrated terminal, and a large editor window. The IDE supports multiple file creation and automatic saving every 5 seconds, ensuring smooth and efficient development.

## Features

- **File Explorer:** Manage multiple files with a structure similar to desktop IDEs.
- **Editor:** Write and edit code in a large editor window with syntax highlighting.
- **Terminal:** Run commands directly from the integrated terminal.
- **Auto Save:** Changes are automatically saved every 5 seconds.

## Tech Stack

### Backend
- **Node.js**: JavaScript runtime for server-side logic.
- **Modules**:
  - `node-pty`: Enables terminal emulation.
  - `express`: Sets up the server.
  - `socket.io`: Manages real-time communication between the client and server.
  - `chokidar`: Watches for file changes and triggers updates.

### Frontend
- **React**: JavaScript library for building the user interface.
- **Modules**:
  - `xterm`: Terminal emulator for React.
  - `react-ace`: Code editor with syntax highlighting.
  - `socket.io-client`: Connects to the backend server for real-time communication.

## Setup Instructions

Follow these steps to set up the project on your local machine:

### Prerequisites
- **Node.js** (v14+)
- **npm** (v6+)

### Clone the Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```
### Install dependencies
```bash 
npm install
```
### start server
```bash
node index.js
```
This will start server at ``` http://localhost:9000 ```.
Make sure all your fetch request are made at this URL

### Navigate to the client directory
```bash
cd client
```

### Install dependencies
```bash
npm install
```

### Start frontend server
```bash
npm run dev
```
This will start server at ```http://localhost:5173```


import { useEffect, useState, useRef } from 'react'
import Terminal from './components/terminal'
import FileTree from './components/tree'
import './App.css'
import socket from './socket'
import AceEditor from 'react-ace'
import path from 'path'

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

function App() {

  const [fileTree, setFileTree] = useState({})
  const [selectedFile, setSelectedFile] = useState("")
  const [fileContent, setFileContent] = useState("Click on a file to view its content")
  const [isSaved, setIsSaved] = useState(false)

  const getFileTree = async () => {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/files`)
    const data = await res.json()
    console.log(data)
    setFileTree(data.tree)
  }

  useEffect(() => {
    console.log('fetching file tree')
    getFileTree();
  }, [])

  useEffect(() => {
    socket.on('file:change', getFileTree)
    return () => {
      socket.off('file:change', getFileTree)
    }
  }, [])
  useEffect(() => {
    if (selectedFile) {
      handleSelect(selectedFile)
    }
  }, [selectedFile])

  useEffect(() => {
    setIsSaved(false)
    console.log(fileContent)
    const timer = setTimeout(() => {
      if (!isSaved) {
        // console.log("Dhyey", selectedFile)
        const cleanContent = fileContent.replace(/\x00/g, ''); // Remove null bytes
        socket.emit('file:save', { pt: selectedFile, content: fileContent })
        console.log('file saved')
        setIsSaved(true)
      }
    }, 5000);
    return () => [
      clearTimeout(timer)
    ]
  }, [fileContent])

  const handleSelect = async (path) => {
    setSelectedFile(path)
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/getfile?path=${path}`)
    const data = await res.json()
    // console.log(data)
    setFileContent(data.file)
  }
  const saveFile = () => {
    if (!isSaved) {
      // console.log("Dhyey", selectedFile)
      const cleanContent = fileContent.replace(/\x00/g, ''); // Remove null bytes
      socket.emit('file:save', { pt: selectedFile, content: fileContent })
      console.log('file saved')
      setIsSaved(true)
    }
  }

  const handleSaveShortcut = (event) => {
    // Check for Ctrl + S or Cmd + S
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault(); // Prevent the browser's default save dialog
      console.log('Save shortcut pressed');
      
      const cleanContent = fileContent.replace(/\x00/g, ''); // Remove null bytes
      socket.emit('file:save', { pt: selectedFile, content: fileContent })
      console.log('file saved')
      setIsSaved(true)
    }
  };

  useEffect(() => {
    // Add event listener on component mount
    window.addEventListener('keydown', handleSaveShortcut);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleSaveShortcut);
    };
  }, []);

  const runCode = async() => {
    const ext = selectedFile.split('.')[1];
    const modifiedPath = selectedFile.replaceAll("/", "\\");
    // console.log(path2.cwd, modifiedPath);

    
    const data = await fetch(`${import.meta.env.VITE_BASE_URL}/getcwd`);
    const cwd = await data.json();
    console.log(selectedFile.slice(1))
    
    if (ext === 'js') {
      socket.emit('terminal:write', `node ${cwd.cwd}/${selectedFile.slice(1)} \n`);

    } else if (ext === 'py') {
      socket.emit('terminal:write', `python3 ${cwd.cwd}/${selectedFile.slice(1)} \n`);

    } else if (ext === 'java') {
      socket.emit('terminal:write', `javac ${cwd.cwd}/${selectedFile.slice(1)} && java ${cwd.cwd}/${selectedFile.slice(1)} \n`);

    } else if (ext === 'c') {
      socket.emit('terminal:write', `gcc ${cwd.cwd}/${selectedFile.slice(1)} -o ${cwd.cwd}/${selectedFile.slice(1).split('.')[0]} && ${cwd.cwd}/${selectedFile.slice(1).split('.')[0]} \n`);
    } else if (ext === 'cpp') {
      socket.emit('terminal:write', `g++ ${cwd.cwd}/${selectedFile.slice(1)} -o ${cwd.cwd}/${selectedFile.slice(1).split('.')[0]} && ${cwd.cwd}/${selectedFile.slice(1).split('.')[0]} \n`);
    }
    else {
      alert('Unsupported file type');
      console.log('Unsupported file type');
    }
  }

  return (
    <>
      <div className="main">
        <div className="Editor-playground">
          <div className="files">
            <h3>File Explorer</h3>
            <FileTree tree={fileTree} onSelect={handleSelect} />
          </div>
          <div className="Editor">
            <div className="Editor-header">
              <h4>{selectedFile.replaceAll("/", " > ")}</h4>
              <div className="Editor-header-buttons">
                <button onClick={runCode} >Run</button>
                <button onClick={saveFile}>Save</button>
                <h5>{isSaved ? "Saved ✓" : "Unsaved ✗"}</h5>
              </div>
            </div>
            <AceEditor
              value={fileContent}
              onChange={(value) => setFileContent(value)}
              theme="monokai"
              name="editor_div"
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
              }}
              width="100%"
              height="calc(100% - 40px)"
            />
          </div>
        </div>
        <div className="Terminal">
          <Terminal />
        </div>
      </div>
    </>

  )
}

export default App

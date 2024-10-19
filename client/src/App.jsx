import { useEffect, useState } from 'react'
import Terminal from './components/terminal'
import FileTree from './components/tree'
import './App.css'
import socket from './socket'
import AceEditor from 'react-ace'

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

function App() {

  const [fileTree, setFileTree] = useState({})
  const [selectedFile, setSelectedFile] = useState("")
  const [fileContent, setFileContent] = useState("Click on a file to view its content")
  const [isSaved, setIsSaved] = useState(false)

  const getFileTree = async () => {
    const res = await fetch('https://vjl80p28-9000.inc1.devtunnels.ms/files')
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
    if(selectedFile) {
      handleSelect(selectedFile)
    }
  },[selectedFile])

  useEffect(() => {
    setIsSaved(false)
    console.log(fileContent)
    const timer = setTimeout(() => {
      if(!isSaved) {
        // console.log("Dhyey", selectedFile)
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
    const res = await fetch(`https://vjl80p28-9000.inc1.devtunnels.ms/getfile?path=${path}`)
    const data = await res.json()
    // console.log(data)
    setFileContent(data.file)
  }

  return (
    <>
      <div className='main'>
        <div className="Editor-playground">
          <div className="files">Files
            <FileTree tree={fileTree} onSelect={handleSelect} />
          </div>
          <div className="Editor">Editor
            <h4>{selectedFile.replaceAll("/", ">")}</h4>
            <h5>{isSaved ? "Saved" : "Unsaved"}</h5>
            <AceEditor
            value={fileContent}
            onChange={(value) => setFileContent(value)}
            theme="github"
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true
            }}
             width='100vw' height='58vh' />
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

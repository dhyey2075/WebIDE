import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { basicLight } from "@uiw/codemirror-theme-basic";
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import { useResizable } from 'react-resizable-layout';



const DarkCodeEditor = ({ fileContent, setFileContent }) => {
    const [isDark, setIsDark] = useState(true);

  const onChange = (value) => {
    setFileContent(value);
    console.log("Code updated:", value);
  };

  return (
    <div style={{ height: "100vh", background: "#1e1e1e", padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 style={{ color: "#fff" }}>VS Code Web</h1>
        <span>
            <button onClick={
                () => {
                    setIsDark(!isDark);
                }
            } style={{ background: `${isDark ? 'white': '#1e1e1e'}`, color: `${isDark ? '#1e1e1e':'white'}`, padding: "0.5rem 1rem", border: "none", cursor: "pointer" }}>{isDark ? "Set to Light":'Set to Dark'}</button>
        </span>
      </div>
      <CodeMirror
        value={fileContent}
        height="400px"
        extensions={[javascript()]} // Add JavaScript syntax highlighting
        theme={isDark ? githubDark : githubLight} // Apply the One Dark theme
        onChange={onChange}
      />
    </div>
  );
};

export default DarkCodeEditor;

import { Terminal as XTerminal } from '@xterm/xterm';
import { useEffect, useRef } from 'react';
import '@xterm/xterm/css/xterm.css';
import socket from '../socket';

const Terminal = () => {
    const terminalRef = useRef(null);
    const isRendered = useRef(false);
    
    useEffect(() => {
        if(isRendered.current) return;
        isRendered.current = true; 

        const term = new XTerminal();
        term.open(terminalRef.current);
        term.write('Welcome to the terminal\r');
        term.onData((data) => {
            // console.log(data);
            socket.emit('terminal:write', data);
        })
        socket.on('terminal:data', (data) => {
            // console.log(data);
            term.write(data);
        })
        socket.off('terminal:data', (data) => {
            // console.log(data);
            term.write(data);
        })

    }, [])
    return (
        <div ref = {terminalRef} id="terminal">

        </div>
    )
}
export default Terminal;
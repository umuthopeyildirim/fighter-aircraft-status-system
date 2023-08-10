import { useState, useEffect } from 'react';

const WS_URL = 'ws://localhost:5175';

function App() {
  const [enableDebug, setEnableDebug] = useState(true);
  const [debugConsoleOutput, setDebugConsoleOutput] = useState([]);
  const [ws, setWs] = useState(null);  // Hold the WebSocket instance
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  useEffect(() => {
    if (isBroadcasting) {
      startWebsocket();
    } else {
      stopWebsocket();
    }

    // Cleanup WebSocket connection when component unmounts or WebSocket is stopped
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [isBroadcasting]);

  function startWebsocket() {
    const newWs = new WebSocket(WS_URL);

    newWs.onopen = () => {
      console.log('WebSocket connection established.');
      addToConsoleArray('WebSocket connection established.');
      newWs.send('START');
      addToConsoleArray('START');
    };

    newWs.onmessage = (event) => {
      console.log(event.data);
      addToConsoleArray(event.data);
    };

    setWs(newWs);
  }

  function stopWebsocket() {
    if (ws) {
      ws.send('STOP');
      console.log('WebSocket connection closed.');
      addToConsoleArray('WebSocket connection closed.');
      ws.close();
      setWs(null);
    }
  }

  function addToConsoleArray(message) {
    const timestamp = new Date().toLocaleString();
    const timestampedMessage = `[${timestamp}] ${message}`;
    setDebugConsoleOutput((prevOutput) => [...prevOutput, timestampedMessage]);
  }
  
  console.log(debugConsoleOutput)
  return (
    <>
      <div className='w-screen h-screen'>
        {/* Flight Control SVGS */}
        <div className='w-screen h-5/6 bg-black'>
          <div>

          </div>
        </div>
        {/* Start and Stop Websocket */}
        <div className='w-screen h-1/6 bg-white'>
          <button className='w-1/2 h-1/2 bg-green-500' onClick={() => setIsBroadcasting(true)}>Start</button>
          <button className='w-1/2 h-1/2 bg-red-500' onClick={() => setIsBroadcasting(false)}>Stop</button>
          {/* Debug Console */}
          <div className='w-full h-1/2 bg-gray-100'>
            {/* Debug Controlls */}
            <div className='w-full bg-gray-300'>
              <button className='w-1/2 h-1/2 bg-blue-500' onClick={() => setEnableDebug(!enableDebug)}>Enable Debug</button>
              <button className='w-1/2 h-1/2 bg-cyan-500' onClick={() => setDebugConsoleOutput([])}>Reset</button>

            </div>
            {/* Debug Console Output */}
            {enableDebug && (
            <div className='w-full h-full bg-gray-800'>
              <h1 className='text-white'>Debug Console Output</h1>
              <div className='w-full h-80 bg-gray-700 overflow-auto'>
                {/* Use overflow-auto to make the output scrollable */}
                {debugConsoleOutput.map((message, index) => (
                  <p key={index} className='text-white'>{message}</p>
                ))}
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default App

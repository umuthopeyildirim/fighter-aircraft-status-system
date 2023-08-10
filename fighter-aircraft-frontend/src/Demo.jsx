import { useState } from 'react';

const WS_URL = 'ws://localhost:5175'

function Demo() {
  const [debugConsoleOutput, setDebugConsoleOutput] = useState([]);

  function startWebsocket() {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('WebSocket connection established.');
      setDebugConsoleOutput([...debugConsoleOutput, 'WebSocket connection established.']);

      ws.send('START');
      setDebugConsoleOutput([...debugConsoleOutput, 'START']);
    };

    ws.onmessage = (event) => {
      console.log(event.data);
      setDebugConsoleOutput([...debugConsoleOutput, event.data]);
    };
  }

  return (
    <>
      <div className='w-screen h-screen'>
        {/* Flight Control SVGS */}
        <div className='w-screen h-5/6 bg-black'>
          <div></div>
        </div>
        {/* Start and Stop Websocket */}
        <div className='w-screen h-1/6 bg-white'>
          <button className='w-1/2 h-1/2 bg-green-500' onClick={() => startWebsocket()}>
            Start
          </button>
          <button className='w-1/2 h-1/2 bg-red-500' onClick={() => setIsBroadcasting(false)}>
            Stop
          </button>
          {/* Debug Console */}
          <div className='w-full h-1/2 bg-gray-100'>
            {debugConsoleOutput.map((message, index) => (
              <p key={index}>{message}</p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Demo;
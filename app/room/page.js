"use client"
import React, { useEffect, useState } from 'react';

const QueueManagement = () => {
  const [queue, setQueue] = useState([]);
  const [room, setRoom] = useState([]);
  const [skip, setSkip] = useState([]);
  const [calledPerson, setCalledPerson] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // const newWs = new WebSocket('ws://34.230.68.77:8000');
    const newWs = new WebSocket('ws://localhost:8000');

    newWs.onopen = () => {
      console.log('WebSocket connection opened');
    };

    newWs.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log('Received from server:'+ data);
      if (Array.isArray(data.queue)) {
        // Received a new queue
        setQueue(queue);
      } else {
        // Received a called person
        setQueue(queue);
      }

      setQueue(queue);
      setRoom(room);
      setSkip(skip);
    };

    newWs.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setWs(newWs);

    return () => {
      newWs.close();
    };
  }, []);

  const addToQueue = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ action: 'add', room: 1 }));
    } else {
      console.error('WebSocket not open or not initialized.');
    }
  };
  
  const callNextInQueue = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ action: 'join', room: 1 }));
    } else {
      console.error('WebSocket not open or not initialized.');
    }
  };
  

  return (
    <div>
      <h1 className='font-bold text-center my-2 text-*4xl'>Room 1</h1>
      <button className="p-2 m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={addToQueue}>
         Add to Queue
      </button>
      <button className="p-2 m-2 bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={callNextInQueue}>
         Call Next
      </button>
     
      <h2>Queue</h2>
      <ul>
        {queue.map((person, index) => (
          <li key={index}>{person}</li>
        ))}
      </ul>
      {/* {calledPerson && <p>Called: {calledPerson}</p>} */}
    </div>
  );
};

export default QueueManagement;

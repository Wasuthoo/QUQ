"use client"
import React, { useEffect, useState } from 'react';

const QueueManagement = () => {
  const [queue, setQueue] = useState([]);
  const [calledPerson, setCalledPerson] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const newWs = new WebSocket('ws://34.230.68.77:8000');

    newWs.onopen = () => {
      console.log('WebSocket connection opened');
    };

    newWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received from server:', data);

      if (Array.isArray(data)) {
        // Received a new queue
        setQueue(data);
      } else {
        // Received a called person
        setQueue(data.queue);
        setCalledPerson(data.calledPerson);
      }
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
      ws.send('add'); // Send the string message 'add'
    } else {
      console.error('WebSocket not open or not initialized.');
    }
  };
  
  const callNextInQueue = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send('call'); // Send the string message 'call'
    } else {
      console.error('WebSocket not open or not initialized.');
    }
  };
  

  return (
    <div>
      <h1 className='font-bold text-xl'>Queue Management</h1>
      <h1 className='font-bold'>Room2</h1>

      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={addToQueue}>
         Add to Queue
      </button>
      <button className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={callNextInQueue}>
         Call Next
      </button>
      <button className='btn' onClick={addToQueue}></button>
    </div>
  );
};

export default QueueManagement;
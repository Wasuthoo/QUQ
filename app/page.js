"use client"
import React, { useEffect, useState } from 'react';

const QueueManagement = () => {
  const [queue, setQueue] = useState([]);
  const [calledPerson, setCalledPerson] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const newWs = new WebSocket('ws://3.85.73.139:8000');
    // const newWs = new WebSocket('ws://localhost:8000');

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
      <h1>Queue Management</h1>
      <button onClick={addToQueue}>Add to Queue</button>
      <button onClick={callNextInQueue}>Call Next</button>
      <h2>Queue</h2>
      <ul>
        {queue.map((person, index) => (
          <li key={index}>{person}</li>
        ))}
      </ul>
      {calledPerson && <p>Called: {calledPerson}</p>}
    </div>
  );
};

export default QueueManagement;

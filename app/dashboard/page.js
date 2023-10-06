"use client"
import React, { useEffect, useState } from 'react';

const QueueManagement = () => {
  const [queue, setQueue] = useState([]);
  const [calledPerson, setCalledPerson] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const newWs = new WebSocket('ws://localhost:8000');

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
      <h1 className='font-bold text-center my-2 text-4xl'>DASHBOARD</h1>
      <div className='flex'>
        <h1>status : </h1>
        {calledPerson && <p>Called: {calledPerson}</p>}
      </div>

      <div className='flex'>
        <div className='container p-2 m-2 bg-red-300 w-20 h-32 '>
          <h1>Room 1</h1>
        </div>
        <div className='container p-2 m-2 bg-red-300 w-20 h-32 '>
          <h1>Room 2</h1>
        </div>
        <div className='container p-2 m-2 bg-red-300 w-20 h-32 '>
          <h1>Room 3</h1>
        </div>
      </div>



      <h2>Queue</h2>
      <div className=''>
        <ul className=''>
          {queue.map((person, index) => (
            <div className='container p-2 m-2 bg-gray-300'>
              <li key={index}>{person}</li>
            </div>

          ))}
        </ul>
      </div>


    </div>
  );
};

export default QueueManagement;

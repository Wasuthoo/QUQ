"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image'

const QueueManagement = () => {
  const [queue, setQueue] = useState([]);
  const [skip, setSkip] = useState([]);
  const [room, setRoom] = useState([]);
  const [calledPerson, setCalledPerson] = useState('');
  const [ws, setWs] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    // const newWs = new WebSocket('ws://34.230.68.77:8000');
    const newWs = new WebSocket('ws://localhost:8000');

    newWs.onopen = () => {
      console.log('WebSocket connection opened');
    };

    newWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received from server:', data);
      console.log('Received from server:', data.room);


      if (Array.isArray(data.room)) {
        // Received a new queue
        setRoom(data.room);
      } 
      if (Array.isArray(data.skip)) {
        // Received a new queue
        setSkip(data.skip);
      }
      if (Array.isArray(data.queue)) {
        // Received a new queue
        setQueue(data.queue);
        
      } else {
       log('error') 
      }
      setLoading(false);
    };



    newWs.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setWs(newWs);

    return () => {
      newWs.close();
    };
  }, []);

  if (isLoading) {
    return <div className="App">Loading...</div>;
  }

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

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
    <div className='bg-yellow-400 h-screen'>
      <div className="relative object-cover">
        <img src="bg-classroom.svg" />
        <div className=''>
          <Image className='absolute top-9 left-[75px]'
            src="/door.png"
            width={150}
            height={150}
            alt='door1'
          />
          <h1 className='absolute font-bold top-[190px] left-[120px]'>Room 1</h1>
          <h1 className='absolute font-bold top-[55px] left-[130px]'>{room[0].status}</h1>
        </div>
        <div>
          <Image className='absolute top-9 left-[360px]'
            src="/door.png"
            width={150}
            height={150}
            alt='door2'
          />
          <h1 className='absolute font-bold top-[190px] left-[405px]'>Room 2</h1>
          <h1 className='absolute font-bold top-[55px] left-[405px]'>{room[1].status}</h1>
        </div>

        <div>
          <Image className='absolute top-9 left-[650px]'
            src="/door.png"
            width={150}
            height={150}
            alt='door2'
          />
          <h1 className='absolute font-bold top-[190px] left-[695px]'>Room 3</h1>
          <h1 className='absolute font-bold top-[55px] left-[695px]'>{room[2].status}</h1>
        </div>
      </div>
     
      <div className='flex'>
        <h1>queue : </h1>
        <ul>
          {queue.map((person, index) => (
            <li key={index}>{person}</li>
          ))}
        </ul>
        </div>

    </div>
  );
};

export default QueueManagement;

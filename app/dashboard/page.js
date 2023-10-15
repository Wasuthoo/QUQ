"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image'
import Door from '@/components/Door';


const QueueManagement = () => {
  const [queue, setQueue] = useState([]);
  const [skip, setSkip] = useState([]);
  const [room, setRoom] = useState([]);
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
        setRoom(data.room);
      }
      if (Array.isArray(data.skip)) {
        setSkip(data.skip);
      }
      if (Array.isArray(data.queue)) {
        setQueue(data.queue);

      } else {
        log('Received UNKNOWN message from server: ', data);
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

  return (
    <div className='bg-yellow-400 h-screen'>
      <div className="">
        <img src="bg-classroom.svg" />

        <div className=' absolute flex top-[100px]  bg-transparent '>
          <Door showImage={room[0].status}
            room={'Room1'}
            status={room[0].status}
            queue={room[0].queue}
          />

          <Door showImage={room[1].status}
            room={'Room2'}
            status={room[1].status}
            queue={room[1].queue}
          />

          <Door showImage={room[2].status}
            room={'Room3'}
            status={room[2].status}
            queue={room[2].queue}
          />
        </div>
      </div>

      <div className='text-2xl font-bold absolute top-[720px] left-[130px]'>
        <h1>Skip Queue</h1>
        <div className='p-2 flex'>
            {skip.map((person, index) => (
              <a className='p-2' key={index}>{person}</a>
            ))}
          
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

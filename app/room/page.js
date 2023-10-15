"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image'

const QueueManagement = () => {
  const [queue, setQueue] = useState([]);
  const [skip, setSkip] = useState([]);
  const [room, setRoom] = useState([]);
  const [RoomNum, setRoomNum] = useState('');
  const [GetRoomNum, setGetRoomNum] = useState(true);
  const [ws, setWs] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isJoin, setjoin] = useState(true);


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

  const selectRoom = (rn) => {
    setGetRoomNum(false);
    setRoomNum(rn);
  }

  if (GetRoomNum) {
    return (
      <div>
        <h1 className='font-bold text-4xl text-center my-4 '>
          Select Room
        </h1>
        <button className="p-2 m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => { selectRoom(1) }}>
          Room 1
        </button>
        <button className="p-2 m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => { selectRoom(2) }}>
          Room 2
        </button>
        <button className="p-2 m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => { selectRoom(3) }}>
          Room 3
        </button>
      </div>

    );
  }



  const skipQueue = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ room: RoomNum - 1, action: 'skip' }));
    } else {
      console.error('WebSocket not open or not initialized.');
    }
  };

  const joinQueue = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      setjoin(false);
      ws.send(JSON.stringify({ room: RoomNum - 1, action: 'join' }));
    } else {
      console.error('WebSocket not open or not initialized.');
    }
  };

  const finishQueue = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      setjoin(true);
      ws.send(JSON.stringify({ room: RoomNum - 1, action: 'finish' }));
    } else {
      console.error('WebSocket not open or not initialized.');
    }
  };



  return (
    <div>
      <h1 className='font-bold text-4xl text-center my-4 '>
        Room {RoomNum}
      </h1>
      <h1 className='font-bold text-2xl text-center my-2 text-*4xl'>
        {room[RoomNum - 1].status} {room[RoomNum - 1].queue}
      </h1>
      {
        (isJoin) ? (
          <div className='text-center'>
          <button className="p-2 m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={skipQueue}>
            Skip
          </button>
          <button className="p-2 m-2 bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={joinQueue}>
            Join
          </button>
        </div>
        ) : (
          <div className='text-center'>
          <button className="p-2 m-2 bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={finishQueue}>
            Finish
          </button>
        </div>
        )

      }
     


      <h2>Queue</h2>
      <ul>
        {queue.map((person, index) => (
          <li key={index}>{person}</li>
        ))}
      </ul>

      <h2>Skip queue</h2>
      <ul>
        {skip.map((person, index) => (
          <li key={index}>{person}</li>
        ))}
      </ul>
    </div>
  );
};

export default QueueManagement;

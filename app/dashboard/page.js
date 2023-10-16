"use client"
import React, { useEffect, useState } from 'react';
import Door from '@/components/Door';

const QueueManagement = () => {
  // Initialize state variables
  const [queue, setQueue] = useState([]);
  const [skip, setSkip] = useState([]);
  const [room, setRoom] = useState([]);
  const [ws, setWs] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    // Establish a WebSocket connection when the component mounts
    // const newWs = new WebSocket('ws://localhost:8000');
    const newWs = new WebSocket('ws://3.85.73.139:8000');


    // WebSocket event handlers
    newWs.onopen = () => {
      console.log('WebSocket connection opened');
    };
    newWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received from server:', data);

      if (Array.isArray(data.room)) {
        setRoom(data.room);
      }
      if (Array.isArray(data.skip)) {
        setSkip(data.skip);
      }
      if (Array.isArray(data.queue)) {
        setQueue(data.queue);
      } else {
        console.error('Received UNKNOWN message from server: ', data);
      }
      setLoading(false);
    };

    newWs.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Set the WebSocket instance to state and close the connection when the component unmounts
    setWs(newWs);
    return () => {
      newWs.close();
    };
  }, []);

  // If the data is still loading, display a loading message
  if (isLoading) {
    return <div className="App">Loading...</div>;
  }

  // Function to reset the queue
  const resetQueue = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ room: 0, action: 'reset' }));
    } else {
      console.error('WebSocket not open or not initialized.');
    }
  }

  // Render the Queue Management UI
  return (
    <div className='bg-yellow-400 h-screen'>
      <div className="">
        <img src="bg-classroom.svg" />

        <div>
          <img className=' absolute top-[1050px] left-[600px]'
            src="draw.png"
            width={300}
            height={300} />
          <div className='absolute top-[890px] left-[100px] text-white text-4xl '>
            <h1 className='text-center px-52' >Interview Round 1 </h1>
            <h1 className='text-center px-52 text-xl' >Date 17 OCT 2023 Time : 09.00 - 12.00</h1>
            <br></br>
            <h1 className='p-2' >Total Queue : 24 </h1>
            <h1 className='p-2'>Finish Queue : {24 - queue.length - skip.length}</h1>
            <h1 className='p-2'>Waiting Queue : {queue.length}</h1>
            <h1 className='p-2'>Skip Queue : {skip.length}</h1>
          </div>
          <img src="blackboard.png" className='' />
        </div>

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

      <button className="p-2 m-2 bg-red-500 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={resetQueue}>
        Reset Queue
      </button>

      <div className='flex'>
        {/* <h1>queue : </h1> */}
        {/* show queue */}
        {/* <ul>
          {queue.map((person, index) => (
            <li key={index}>{person}</li>
          ))}
        </ul> */}
      </div>
    </div>
  );
};

export default QueueManagement;

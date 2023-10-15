import React from 'react';
import Image from 'next/image'

const Door = ({ showImage, room, status,queue }) => {
  return (
    <div>
      {(showImage === 'calling' )?  (
        <div className='relative '>
          <Image 
          
            src="/door-open.png"
            width={340}
            height={340}
            alt='door1'
          />
          <h1 className='font-bold absolute top-[200px] left-[145px]'>{room}</h1>
          <h1 className='font-bold absolute top-[55px] left-[130px]'>{status} {queue}</h1>

        </div>

      ) :
      (
        <div className='relative '>
        <Image className=''
          src="/door-close.png"
          width={340}
          height={340}
          alt='door1'
        />
        <h1 className='font-bold absolute top-[200px] left-[145px]'>{room}</h1>
        <h1 className='font-bold absolute top-[55px] left-[130px]'>{status} {queue}</h1>

      </div>

      )}
    </div>
  );
};

export default Door;

"use client"

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import  QRCode from '@/components/QRCode';

function Home () {
  const [userId, setUserId] = useState(uuidv4());
  const [isDriver, setIsDriver] = useState(false);

  return (
    <>
      <button onClick={() => { setIsDriver(!isDriver) }}>change</button>
      {userId && <QRCode userId={userId} isDriver={isDriver}/>}
    </>
  )

}

export default Home

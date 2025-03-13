"use client"

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import  QRCode from '@/components/QrCode';

function Home () {
  const [userId, setUserId] = useState(uuidv4());
  const [isDriver, setIsDriver] = useState(false);

  return (
    <>
      <button onClick={() => { setIsDriver(!isDriver) }}>change</button>
      {true && userId && <QRCode userId={userId} isDriver={isDriver}/>}
    </>
  )

}

export default Home

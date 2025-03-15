"use client"

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import  QRCode from '@/components/QRCode';

function Home () {
  const [userId, setUserId] = useState(0x9e25Fe3734338F2cBF23e765a892a61AD23D19b2);
  const [isDriver, setIsDriver] = useState(false);

  return (
    <>
      {true && userId && <QRCode userId={"0x9e25Fe3734338F2cBF23e765a892a61AD23D19b2"} isDriver={isDriver}/>}
    </>
  )

}

export default Home

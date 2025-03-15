const fetchSelfProof = async (address) => {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_SERVER
    + "/proof?address="
    + address
  )
  let data = await res.json()
  console.log(data)
  return data
}

export default fetchSelfProof
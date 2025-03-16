const fetchSelfProof = async (address) => {
  const res = await fetch("http://localhost:8080"
    + "/proof?address="
    + address
  )
  let data = await res.json()
  console.log(data)
  return data
}

export default fetchSelfProof
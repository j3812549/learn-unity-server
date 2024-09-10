import axios from "axios"

export async function test() {
  const data = await axios.get('http://localhost:3501/index.js')
  return data.data
}
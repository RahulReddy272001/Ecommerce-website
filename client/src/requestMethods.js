import axios from "axios";

const BASE_URL = "http://localhost:5000/api/"
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZDJjNjE2ZjQ4YTkzOGM2OTAzM2M2ZSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY1ODc1Nzc0MSwiZXhwIjoxNjU5MDE2OTQxfQ.Yy9Ytdb_kRw9qmS-s0KeW8H-An2pJsCUGylGtrMVMcM"

export const publicRequest = axios.create({
  baseURL: BASE_URL,
})

export const userRequest = axios.create({
  baseURL: BASE_URL,
  header: { token: `Bearer ${TOKEN}` }
})
import axios from 'axios'
import { apiUrl } from '../config/config.js'

const api = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api

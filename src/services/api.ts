// src/services/api.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:5247/api/', // Cambia esto por tu URL de API
  headers: {
    'Content-Type': 'application/json'
  }
})

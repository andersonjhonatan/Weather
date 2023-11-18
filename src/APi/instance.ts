import axios from 'axios'

const API_KEY = '9d812b7c62449945234d0c78b168e0ee'

export const METRIC = 'metric'

const baseURL = 'https://api.openweathermap.org/data/2.5/weather'

export const instance = axios.create({
  baseURL,
  params: {
    appid: API_KEY
  },
})

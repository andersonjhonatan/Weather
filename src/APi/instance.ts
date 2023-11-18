import axios from 'axios'

export const METRIC = 'metric'

const baseURL = 'http://api.openweathermap.org/data/2.5/weather'

export const instance = axios.create({
  baseURL,
  params: {
    appid: import.meta.env.REACT_APP_API_KEY,
  },
})

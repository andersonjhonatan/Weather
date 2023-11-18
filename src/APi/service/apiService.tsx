import { instance } from '../instance'
const lang = 'pt_br'


export const getWeather = async (lat: number, lon: number) => {
  const response = await instance.get('', {
    params: {
      lat,
      lon,
    },
  })
  return response
}

export const getWeatherByCity = async (city: string) => {
  const response = await instance.get('', {
    params: {
      q: city,
      lang,
    },
  })
  return response
}

export const getWeatherByZipCode = async (zipCode: string, country?: string) => {
  country = 'BR'
  const response = await instance.get('', {
    params: {
      zip: `${zipCode},${country}`,
      lang,
    },
  })
  return response
}

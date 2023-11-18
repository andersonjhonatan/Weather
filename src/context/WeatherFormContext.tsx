import { ReactNode, createContext, useState } from 'react'
import {
  FieldErrors,
  FieldValues,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
  useForm,
} from 'react-hook-form'
import { getWeatherByCity, getWeatherByZipCode } from '../APi/service/apiService'

interface Coord {
  lon: number
  lat: number
}

interface Weather {
  id: number
  main: string
  description: string
  icon: string
}

interface Main {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  humidity: number
}

interface Wind {
  speed: number
  deg: number
}

interface Clouds {
  all: number
}

interface Sys {
  type: number
  id: number
  country: string
  sunrise: number
  sunset: number
}

interface WeatherApiResponse {
  coord: Coord
  weather: Weather[]
  base: string
  main: Main
  visibility: number
  wind: Wind
  clouds: Clouds
  dt: number
  sys: Sys
  timezone: number
  id: number
  name: string
  cod: number
}

type ContextCreateData = {
  register: UseFormRegister<FieldValues>
  handleSubmit: UseFormHandleSubmit<FieldValues>
  onSubmit: (data: WeatherFormData) => void
  data?: WeatherApiResponse
  loading?: boolean
  errors?: FieldErrors<FieldValues>
}

interface WeatherFormData {
  city?: string
  zipCode?: string
}
export const WeatherFormContext = createContext({} as ContextCreateData)

const WeatherFormContextProvider = ({ children }: { children: ReactNode }) => {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const [data, setData] = useState<WeatherApiResponse>()
  const [loading, setLoading] = useState(false)


  

  const onSubmit: SubmitHandler<FieldValues> = async ({ city, zipCode }) => {
    setLoading(true)
    try {
      if (city) {
        const { data } = await getWeatherByCity(city)
        return setData(data)
      }
      if (zipCode) {
        const { data } = await getWeatherByZipCode(zipCode)
        return setData(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  }

  return (
    <WeatherFormContext.Provider
      value={{ register, handleSubmit, onSubmit, data, loading, errors }}
    >
      {children}
    </WeatherFormContext.Provider>
  )
}

export default WeatherFormContextProvider

import { ReactNode, createContext, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { getWeatherByCity, getWeatherByZipCode } from '../APi/service/apiService'
import { WeatherApiResponse } from '../interfaces/IApi'
import { ContextCreateData } from '../types/TContexWeather'

export const WeatherFormContext = createContext({} as ContextCreateData)

const WeatherFormContextProvider = ({ children }: { children: ReactNode }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

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

  const valor = {
    register,
    handleSubmit,
    onSubmit,
    data,
    loading,
    errors,
  } as ContextCreateData

  return (
    <WeatherFormContext.Provider value={valor}>{children}</WeatherFormContext.Provider>
  )
}

export default WeatherFormContextProvider

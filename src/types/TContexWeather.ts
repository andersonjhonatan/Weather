import { FieldErrors, FieldValues, UseFormHandleSubmit, UseFormRegister } from "react-hook-form"
import { WeatherApiResponse, WeatherFormData } from "../interfaces/IApi"

export type ContextCreateData = {
  register: UseFormRegister<FieldValues>
  handleSubmit: UseFormHandleSubmit<FieldValues>
  onSubmit: (data: WeatherFormData) => void
  data?: WeatherApiResponse
  loading?: boolean
  errors?: FieldErrors<FieldValues>
}
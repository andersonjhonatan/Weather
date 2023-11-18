import { useContext } from 'react'
import { WeatherFormContext } from '../../context/WeatherFormContext'
import { LuSearchCheck, LuSearch } from 'react-icons/lu'
import { FcHighPriority } from 'react-icons/fc'

const Form = () => {
  const contextoProviderWeather = useContext(WeatherFormContext)

  const { data, register, handleSubmit, onSubmit, errors } = contextoProviderWeather

  return (
    <section className="flex justify-center w-full flex-col items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-2
        w-full justify-center"
      >
        <div className="relative flex">
          <input
            type="text"
            className="flex text p-2 pl-4 rounded-2xl placeholder:pl-4 focus:pl-4 outline-none"
            placeholder="Cidade"
            {...register('city', {
              required: true,
              validate: {
                isString: (value) => typeof value === 'string',
              },
            })}
          />
          <button className="absolute right-2 top-2/4 -translate-y-2/4 " type="submit">
            {data ? (
              <LuSearchCheck size={30} className="text-gray-500" />
            ) : (
              <LuSearch size={30} className="text-gray-500" />
            )}
          </button>
        </div>
        <input
          type="text"
          className="flex-1 p-2 pl-4 w-1/2 rounded-2xl placeholder:pl-4 focus:pl-4 hidden"
          placeholder="CEP"
          {...register('zipCode')}
        />
      </form>
      {errors && errors.city && (
        <div className="flex items-center mt-2 gap-1 bg-black p-2 rounded-full">
          <FcHighPriority size={20} className="text-red-500" />
          <p className="text-white text-xs bg-black p-1 rounded-full">
            Cidade obrigatória
          </p>
        </div>
      )}
    </section>
  )
}

export default Form

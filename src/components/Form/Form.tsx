import { useContext } from 'react'
import { WeatherFormContext } from '../../context/WeatherFormContext'
import { LuSearchCheck, LuSearch } from 'react-icons/lu'

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
        <p className="text-red-500 text-sm mt-2">Cidade obrigatória</p>
      )}
    </section>
  )
}

export default Form

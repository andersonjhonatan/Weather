import { useContext } from 'react'
import { WeatherFormContext } from '../../context/WeatherFormContext'
import { WiHumidity } from 'react-icons/wi'
import { FiWind } from 'react-icons/fi'
import { IoIosSunny } from 'react-icons/io'

const WeatherTemp = () => {
  const { data, loading } = useContext(WeatherFormContext)

  const icon = data?.weather[0].icon
  const temperatura = data?.main.temp.toFixed().slice(0, 2)
  const description = data?.weather[0].description

  const name = data?.name
  const country = data?.sys.country
  const temp_max = data?.main.temp_max.toFixed().slice(0, 2)
  const temp_min = data?.main.temp_min.toFixed().slice(0, 2)
  const humidity = data?.main.humidity
  const wind = data?.wind.speed.toFixed().slice(0, 1)

  return (
    <section className="flex justify-center items-center  h-full">
      {!loading && !data && (
        <p className="text-5xl text-slate-400 font-bold">Pesquise sua cidade</p>
      )}

      {loading && (
        <IoIosSunny
          size={100}
          className="animate-spin ease-linear duration-2000 text-yellow-600 "
        />
      )}

      {data && !loading && (
        <div className="flex gap-4 justify-center items-stretch w-full text-white">
          <picture className=" flex-1 flex  justify-center items-center  w-full">
            {description?.trim().toLowerCase() === 'céu limpo' ? (
              <IoIosSunny size={300} className="text-yellow-500 " />
            ) : (
              <img
                src={`http://openweathermap.org/img/wn/${icon}@4x.png`}
                alt="icon-weather-app"
                width={600}
                height={600}
              />
            )}
          </picture>
          <div className="flex-1 flex justify-center items-center  flex-col  w-full gap-6">
            {/* Description e temperatura */}
            <div className="flex flex-col gap-2 text-center">
              <p className="text-[7rem] font-thin">{temperatura}°C</p>
              <p className="text-1xl">{description}</p>
              <p className="text-1xl">
                {name}, <strong>{country}</strong>
              </p>
            </div>

            {/* Temperatura maxima e minima */}

            <div className="flex gap-4 mt-4">
              <p className="text-1xl">Máxima {temp_max}°C</p>
              <p className="text-1xl">Mínima {temp_min}°C</p>
            </div>

            {/* Humidade e vento */}

            <div className="flex gap-6">
              <div className="flex gap-2 mt-4 items-center ">
                <WiHumidity size={60} color="white" />
                <section className="flex flex-col">
                  <p className="text-1xl flex flex-1">{humidity}%</p>
                  <p className="text-1xl flex-1">Umidade</p>
                </section>
              </div>

              <div className="flex gap-2 mt-4 items-center ">
                <FiWind size={60} color="white" />
                <section className="flex flex-col">
                  <p>{wind} Km/h</p>
                  <p className="text-1xl flex-1">Wind Speed</p>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default WeatherTemp

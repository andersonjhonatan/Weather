import Form from './components/Form/Form'
import WeatherTemp from './components/Weather'
import WeatherFormContextProvider from './context/WeatherFormContext'
import { TiWeatherPartlySunny } from 'react-icons/ti'

function App() {
  return (
    <WeatherFormContextProvider>
      <main className="flex justify-center h-screen w-screen items-center flex-col-reverse gap-4 relative">
        <div
          className="flex flex-col gap-2 p-4 rounded-3xl h-3/4 w-2/4 max-lg:w-2/3 max-md:w-3/4 max-sm:w-4/5  shadow-2xl from-[#023047] from-60%  to-[#106778] 
          bg-gradient-to-tl  relative"
        >
          <TiWeatherPartlySunny
            size={50}
            className="text-yellow-500 absolute max-lg:w-14 max-lg:h-14 max-lg:-translate-x-2/4 max-lg:-translate-y-2/4 max-md:w-10 max-md:h-10 max-md:-translate-x-2/4 max-md:-translate-y-2/4 max-sm:w-8 max-sm:h-8 max-sm:-translate-x-2/4 max-sm:-translate-y-2/4"
          />

          <Form />
          <WeatherTemp />
        </div>
       
      </main>
    </WeatherFormContextProvider>
  )
}

export default App

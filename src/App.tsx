import Form from './components/Form/Form'
import WeatherTemp from './components/Weather'
import WeatherFormContextProvider from './context/WeatherFormContext'
import { TiWeatherPartlySunny } from 'react-icons/ti'

function App() {
  return (
    <WeatherFormContextProvider>
      <main className="flex justify-center h-screen w-screen items-center">
        <div
          className="flex flex-col gap-2   p-4 rounded-3xl h-3/4 mt-3 w-2/4 max-lg:w-2/3 max-md:w-3/4 max-sm:w-4/5  shadow-2xl from-[#023047] from-60%  to-[#106778] 
          bg-gradient-to-tl"
        >
          <TiWeatherPartlySunny size={50} className="text-yellow-500" />
          <Form />
          <WeatherTemp />
        </div>
      </main>
    </WeatherFormContextProvider>
  )
}

export default App

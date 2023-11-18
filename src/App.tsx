import Form from './components/Form/Form'
import WeatherTemp from './components/Weather'
import WeatherFormContextProvider from './context/WeatherFormContext'
import { TiWeatherPartlySunny } from 'react-icons/ti'

function App() {
  return (
    <WeatherFormContextProvider>
      <main className="flex justify-center h-screen w-screen items-center">
        <div className="flex flex-col gap-2 bg-gradient-to-bl from-[#52f9ff53] to-[#f5f5f585] p-4 rounded-3xl h-3/4 mt-3 w-2/4 shadow-2xl shadow-slate-700">
          <TiWeatherPartlySunny size={50} />
          <Form />
          <WeatherTemp />
        </div>
      </main>
    </WeatherFormContextProvider>
  )
}

export default App

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  FiClock,
  FiDroplet,
  FiEye,
  FiHeart,
  FiMapPin,
  FiNavigation,
  FiRefreshCw,
  FiSearch,
  FiSun,
  FiWind,
  FiX,
} from 'react-icons/fi'
import {
  displayTemperature,
  describeWeather,
  formatDay,
  formatLongDate,
  formatTime,
  getForecast,
  locationLabel,
  LocationResult,
  searchLocations,
  shortLocationLabel,
  TemperatureUnit,
  WeatherResponse,
  weatherEmoji,
  weatherTheme,
  windDirection,
} from './weather'

const FAVORITES_KEY = 'weather-k2:favorites'
const RECENTS_KEY = 'weather-k2:recents'

function readStoredLocations(key: string): LocationResult[] {
  try {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as LocationResult[]) : []
  } catch {
    return []
  }
}

function sameLocation(a: LocationResult, b: LocationResult): boolean {
  return Math.abs(a.latitude - b.latitude) < 0.001 && Math.abs(a.longitude - b.longitude) < 0.001
}

function App() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<LocationResult[]>([])
  const [location, setLocation] = useState<LocationResult | null>(null)
  const [weather, setWeather] = useState<WeatherResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState('')
  const [unit, setUnit] = useState<TemperatureUnit>('celsius')
  const [favorites, setFavorites] = useState<LocationResult[]>(() => readStoredLocations(FAVORITES_KEY))
  const [recents, setRecents] = useState<LocationResult[]>(() => readStoredLocations(RECENTS_KEY))
  const requestRef = useRef<AbortController | null>(null)

  const persistRecents = useCallback((place: LocationResult) => {
    setRecents((current) => {
      const next = [place, ...current.filter((item) => !sameLocation(item, place))].slice(0, 5)
      localStorage.setItem(RECENTS_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const loadLocation = useCallback(
    async (place: LocationResult, options?: { keepQuery?: boolean; remember?: boolean }) => {
      requestRef.current?.abort()
      const controller = new AbortController()
      requestRef.current = controller
      setLoading(true)
      setError('')
      setSuggestions([])

      try {
        const forecast = await getForecast(place.latitude, place.longitude, controller.signal)
        setWeather(forecast)
        setLocation(place)
        if (!options?.keepQuery) setQuery('')
        if (options?.remember !== false) persistRecents(place)
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === 'AbortError') return
        setError(caught instanceof Error ? caught.message : 'Algo deu errado ao carregar o clima.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    },
    [persistRecents],
  )

  const searchAndLoad = useCallback(
    async (term: string) => {
      const trimmed = term.trim()
      if (!trimmed) return

      setLoading(true)
      setError('')
      try {
        const results = await searchLocations(trimmed)
        if (!results.length) {
          setError('Não encontramos essa cidade. Tente outro nome ou inclua o estado.')
          setLoading(false)
          return
        }
        await loadLocation(results[0])
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Não foi possível pesquisar a cidade.')
        setLoading(false)
      }
    },
    [loadLocation],
  )

  useEffect(() => {
    void searchAndLoad('Ibimirim')
    return () => requestRef.current?.abort()
  }, [searchAndLoad])

  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < 3) {
      setSuggestions([])
      return
    }

    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      searchLocations(trimmed, controller.signal)
        .then(setSuggestions)
        .catch((caught) => {
          if (!(caught instanceof DOMException && caught.name === 'AbortError')) setSuggestions([])
        })
    }, 350)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  useEffect(() => {
    if (!location || !weather) return
    document.title = `${shortLocationLabel(location)} · ${Math.round(weather.current.temperature_2m)}° · Weather K2`
  }, [location, weather])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void searchAndLoad(query)
  }

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError('Seu navegador não oferece suporte à localização automática.')
      return
    }

    setLocating(true)
    setError('')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const place: LocationResult = {
          name: 'Minha localização',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        void loadLocation(place, { remember: false }).finally(() => setLocating(false))
      },
      () => {
        setError('Não foi possível acessar sua localização. Verifique a permissão do navegador.')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const isFavorite = Boolean(location && favorites.some((item) => sameLocation(item, location)))

  const toggleFavorite = () => {
    if (!location || location.name === 'Minha localização') return
    const selectedLocation = location

    setFavorites((current) => {
      const next = current.some((item) => sameLocation(item, selectedLocation))
        ? current.filter((item) => !sameLocation(item, selectedLocation))
        : [selectedLocation, ...current].slice(0, 6)
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
      return next
    })
  }

  const hourly = useMemo(() => {
    if (!weather) return []
    const start = Math.max(0, weather.hourly.time.findIndex((time) => time >= weather.current.time))
    return weather.hourly.time.slice(start, start + 10).map((time, offset) => {
      const index = start + offset
      return {
        time,
        temperature: weather.hourly.temperature_2m[index],
        probability: weather.hourly.precipitation_probability[index],
        code: weather.hourly.weather_code[index],
      }
    })
  }, [weather])

  const currentTheme = weather
    ? weatherTheme(weather.current.weather_code, weather.current.is_day === 1)
    : 'cloudy'

  const temperatureSymbol = unit === 'celsius' ? '°C' : '°F'

  return (
    <div className={`app-shell theme-${currentTheme}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="weather-noise" aria-hidden="true" />

      <header className="topbar container">
        <a className="brand" href="#top" aria-label="Weather K2 — início">
          <span className="brand-mark">K2</span>
          <span>
            <strong>Weather</strong>
            <small>tempo inteligente</small>
          </span>
        </a>

        <div className="topbar-actions">
          <button
            className="unit-toggle"
            type="button"
            onClick={() => setUnit((current) => (current === 'celsius' ? 'fahrenheit' : 'celsius'))}
            aria-label="Alternar unidade de temperatura"
          >
            <span className={unit === 'celsius' ? 'active' : ''}>°C</span>
            <span className={unit === 'fahrenheit' ? 'active' : ''}>°F</span>
          </button>
          <button className="icon-button" type="button" onClick={handleUseLocation} aria-label="Usar minha localização">
            {locating ? <FiRefreshCw className="spin" /> : <FiNavigation />}
          </button>
        </div>
      </header>

      <main id="top" className="container dashboard">
        <section className="search-section" aria-label="Pesquisa de cidade">
          <div>
            <span className="eyebrow">Previsão meteorológica</span>
            <h1>O clima da sua cidade, sem complicação.</h1>
            <p>Condições atuais, próximas horas e previsão de 7 dias em uma experiência rápida e responsiva.</p>
          </div>

          <div className="search-wrap">
            <form className="search-box" onSubmit={handleSubmit}>
              <FiSearch aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar cidade ou CEP"
                aria-label="Buscar cidade ou CEP"
                autoComplete="off"
              />
              {query && (
                <button type="button" className="clear-search" onClick={() => setQuery('')} aria-label="Limpar pesquisa">
                  <FiX />
                </button>
              )}
              <button className="search-submit" type="submit">Buscar</button>
            </form>

            {suggestions.length > 0 && (
              <div className="suggestions" role="listbox" aria-label="Sugestões de cidades">
                {suggestions.map((suggestion) => (
                  <button
                    key={`${suggestion.id ?? suggestion.latitude}-${suggestion.longitude}`}
                    type="button"
                    onClick={() => void loadLocation(suggestion)}
                  >
                    <FiMapPin />
                    <span>
                      <strong>{suggestion.name}</strong>
                      <small>{[suggestion.admin1, suggestion.country].filter(Boolean).join(', ')}</small>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => setError('')} aria-label="Fechar aviso"><FiX /></button>
          </div>
        )}

        {loading && !weather ? (
          <section className="loading-state" aria-label="Carregando previsão">
            <div className="loading-orbit"><span /></div>
            <strong>Buscando o céu agora...</strong>
            <p>Organizando temperatura, vento e previsão dos próximos dias.</p>
          </section>
        ) : weather && location ? (
          <div className="content-grid">
            <div className="main-column">
              <section className="hero-card glass-card">
                <div className="hero-card-header">
                  <div>
                    <div className="location-line"><FiMapPin /> {locationLabel(location)}</div>
                    <p>{formatLongDate(weather.current.time)}</p>
                  </div>
                  {location.name !== 'Minha localização' && (
                    <button
                      className={`favorite-button ${isFavorite ? 'favorite-active' : ''}`}
                      type="button"
                      onClick={toggleFavorite}
                      aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                      <FiHeart />
                    </button>
                  )}
                </div>

                <div className="hero-weather">
                  <div className="weather-symbol" aria-hidden="true">
                    {weatherEmoji(weather.current.weather_code, weather.current.is_day === 1)}
                  </div>
                  <div className="temperature-block">
                    <div className="temperature-value">
                      {displayTemperature(weather.current.temperature_2m, unit)}<span>{temperatureSymbol}</span>
                    </div>
                    <strong>{describeWeather(weather.current.weather_code)}</strong>
                    <p>Sensação de {displayTemperature(weather.current.apparent_temperature, unit)}{temperatureSymbol}</p>
                  </div>
                </div>

                <div className="metrics-grid">
                  <article className="metric-card">
                    <span><FiDroplet /></span>
                    <div><small>Umidade</small><strong>{weather.current.relative_humidity_2m}%</strong></div>
                  </article>
                  <article className="metric-card">
                    <span><FiWind /></span>
                    <div><small>Vento</small><strong>{Math.round(weather.current.wind_speed_10m)} km/h</strong></div>
                  </article>
                  <article className="metric-card">
                    <span><FiEye /></span>
                    <div><small>Visibilidade</small><strong>{Math.round(weather.current.visibility / 1000)} km</strong></div>
                  </article>
                  <article className="metric-card">
                    <span>↗</span>
                    <div><small>Pressão</small><strong>{Math.round(weather.current.pressure_msl)} hPa</strong></div>
                  </article>
                  <article className="metric-card">
                    <span>☁</span>
                    <div><small>Nuvens</small><strong>{weather.current.cloud_cover}%</strong></div>
                  </article>
                  <article className="metric-card">
                    <span>〰</span>
                    <div><small>Rajadas</small><strong>{Math.round(weather.current.wind_gusts_10m)} km/h</strong></div>
                  </article>
                </div>
              </section>

              <section className="glass-card section-card">
                <div className="section-heading">
                  <div><span className="section-icon"><FiClock /></span><div><h2>Próximas horas</h2><p>Variação ao longo do dia</p></div></div>
                  <small>{weather.timezone_abbreviation ?? weather.timezone}</small>
                </div>
                <div className="hourly-strip">
                  {hourly.map((item, index) => (
                    <article className={`hour-card ${index === 0 ? 'current-hour' : ''}`} key={item.time}>
                      <small>{index === 0 ? 'Agora' : formatTime(item.time)}</small>
                      <span>{weatherEmoji(item.code, weather.current.is_day === 1)}</span>
                      <strong>{displayTemperature(item.temperature, unit)}°</strong>
                      <em>💧 {item.probability}%</em>
                    </article>
                  ))}
                </div>
              </section>

              <section className="glass-card section-card">
                <div className="section-heading">
                  <div><span className="section-icon">7</span><div><h2>Próximos 7 dias</h2><p>Máximas, mínimas e chance de chuva</p></div></div>
                </div>
                <div className="daily-list">
                  {weather.daily.time.map((day, index) => (
                    <article className="day-row" key={day}>
                      <div className="day-name"><strong>{index === 0 ? 'Hoje' : formatDay(day)}</strong><small>{day.slice(5).split('-').reverse().join('/')}</small></div>
                      <div className="day-condition"><span>{weatherEmoji(weather.daily.weather_code[index])}</span><small>{describeWeather(weather.daily.weather_code[index])}</small></div>
                      <div className="rain-chance">💧 {weather.daily.precipitation_probability_max[index]}%</div>
                      <div className="day-temp"><strong>{displayTemperature(weather.daily.temperature_2m_max[index], unit)}°</strong><span>{displayTemperature(weather.daily.temperature_2m_min[index], unit)}°</span></div>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className="side-column">
              <section className="glass-card sun-card">
                <div className="section-heading compact">
                  <div><span className="section-icon"><FiSun /></span><div><h2>Sol hoje</h2><p>Ciclo do dia</p></div></div>
                </div>
                <div className="sun-orbit"><div className="sun-dot" /></div>
                <div className="sun-times">
                  <div><small>Nascer</small><strong>{formatTime(weather.daily.sunrise[0])}</strong></div>
                  <div><small>Pôr do sol</small><strong>{formatTime(weather.daily.sunset[0])}</strong></div>
                </div>
              </section>

              <section className="glass-card details-card">
                <div className="section-heading compact">
                  <div><span className="section-icon"><FiWind /></span><div><h2>Vento</h2><p>Direção e intensidade</p></div></div>
                </div>
                <div className="wind-compass">
                  <div className="compass-ring"><span style={{ transform: `rotate(${weather.current.wind_direction_10m}deg)` }}>↑</span></div>
                  <div><strong>{windDirection(weather.current.wind_direction_10m)}</strong><small>{Math.round(weather.current.wind_speed_10m)} km/h</small></div>
                </div>
                <div className="detail-line"><span>Precipitação agora</span><strong>{weather.current.precipitation.toFixed(1)} mm</strong></div>
                <div className="detail-line"><span>Máx. vento hoje</span><strong>{Math.round(weather.daily.wind_speed_10m_max[0])} km/h</strong></div>
              </section>

              <section className="glass-card locations-card">
                <div className="section-heading compact">
                  <div><span className="section-icon"><FiHeart /></span><div><h2>Seus lugares</h2><p>Favoritos e recentes</p></div></div>
                </div>

                {favorites.length > 0 && (
                  <div className="location-group">
                    <small>Favoritos</small>
                    <div className="location-chips">
                      {favorites.map((place) => (
                        <button key={`${place.latitude}-${place.longitude}`} type="button" onClick={() => void loadLocation(place)}>
                          <FiHeart /> {shortLocationLabel(place)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="location-group">
                  <small>Recentes</small>
                  <div className="recent-list">
                    {recents.length ? recents.map((place) => (
                      <button key={`${place.latitude}-${place.longitude}`} type="button" onClick={() => void loadLocation(place)}>
                        <span><FiMapPin /><span><strong>{place.name}</strong><small>{place.admin1 ?? place.country ?? 'Local pesquisado'}</small></span></span>
                        <span>›</span>
                      </button>
                    )) : <p className="empty-copy">Suas pesquisas recentes aparecerão aqui.</p>}
                  </div>
                </div>
              </section>

              <button className="refresh-button" type="button" onClick={() => location && void loadLocation(location, { keepQuery: true, remember: false })} disabled={loading}>
                <FiRefreshCw className={loading ? 'spin' : ''} /> Atualizar dados
              </button>
            </aside>
          </div>
        ) : null}
      </main>

      <footer className="container footer">
        <div><strong>K2 Tech</strong><span>Weather Experience</span></div>
        <p>Dados meteorológicos por Open-Meteo · Desenvolvido por K2 Tech</p>
      </footer>
    </div>
  )
}

export default App

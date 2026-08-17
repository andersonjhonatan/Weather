export type TemperatureUnit = 'celsius' | 'fahrenheit'

export interface LocationResult {
  id?: number
  name: string
  latitude: number
  longitude: number
  country?: string
  country_code?: string
  admin1?: string
  timezone?: string
}

export interface WeatherResponse {
  latitude: number
  longitude: number
  timezone: string
  timezone_abbreviation?: string
  current: {
    time: string
    temperature_2m: number
    relative_humidity_2m: number
    apparent_temperature: number
    is_day: number
    precipitation: number
    weather_code: number
    cloud_cover: number
    pressure_msl: number
    wind_speed_10m: number
    wind_direction_10m: number
    wind_gusts_10m: number
    visibility: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    precipitation_probability: number[]
    weather_code: number[]
  }
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    sunrise: string[]
    sunset: string[]
    precipitation_probability_max: number[]
    wind_speed_10m_max: number[]
  }
}

interface GeoSearchResponse {
  results?: LocationResult[]
}

const GEO_BASE = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_BASE = 'https://api.open-meteo.com/v1/forecast'

const IBIMIRIM: LocationResult = {
  name: 'Ibimirim',
  latitude: -8.54056,
  longitude: -37.69028,
  country: 'Brasil',
  country_code: 'BR',
  admin1: 'Pernambuco',
  timezone: 'America/Recife',
}

export async function searchLocations(query: string, signal?: AbortSignal): Promise<LocationResult[]> {
  const trimmed = query.trim()
  if (trimmed.length < 2) return []

  // A tela inicial usa Ibimirim como demonstração. Resolver localmente elimina
  // uma chamada de rede no primeiro carregamento e deixa o conteúdo aparecer antes.
  if (trimmed.toLocaleLowerCase('pt-BR') === 'ibimirim') return [IBIMIRIM]

  const params = new URLSearchParams({
    name: trimmed,
    count: '5',
    language: 'pt',
    format: 'json',
  })

  const response = await fetch(`${GEO_BASE}?${params.toString()}`, { signal })
  if (!response.ok) throw new Error('Não foi possível buscar cidades agora.')

  const payload = (await response.json()) as GeoSearchResponse
  return payload.results ?? []
}

export async function getForecast(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'visibility',
    ].join(','),
    // A interface exibe somente temperatura, chance de chuva e condição nas
    // próximas horas; não baixamos séries que não são renderizadas.
    hourly: ['temperature_2m', 'precipitation_probability', 'weather_code'].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'precipitation_probability_max',
      'wind_speed_10m_max',
    ].join(','),
    timezone: 'auto',
    forecast_days: '7',
    forecast_hours: '12',
  })

  const response = await fetch(`${WEATHER_BASE}?${params.toString()}`, { signal })
  if (!response.ok) throw new Error('Não foi possível carregar a previsão do tempo.')

  return (await response.json()) as WeatherResponse
}

export function describeWeather(code: number): string {
  if (code === 0) return 'Céu limpo'
  if (code === 1) return 'Predominantemente limpo'
  if (code === 2) return 'Parcialmente nublado'
  if (code === 3) return 'Nublado'
  if ([45, 48].includes(code)) return 'Neblina'
  if ([51, 53, 55, 56, 57].includes(code)) return 'Garoa'
  if ([61, 63, 65, 66, 67].includes(code)) return 'Chuva'
  if ([71, 73, 75, 77].includes(code)) return 'Neve'
  if ([80, 81, 82].includes(code)) return 'Pancadas de chuva'
  if ([85, 86].includes(code)) return 'Pancadas de neve'
  if ([95, 96, 99].includes(code)) return 'Tempestade'
  return 'Condição variável'
}

export function weatherEmoji(code: number, isDay = true): string {
  if (code === 0) return isDay ? '☀️' : '🌙'
  if ([1, 2].includes(code)) return isDay ? '🌤️' : '☁️'
  if (code === 3) return '☁️'
  if ([45, 48].includes(code)) return '🌫️'
  if ([51, 53, 55, 56, 57].includes(code)) return '🌦️'
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return '🌧️'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return '❄️'
  if ([95, 96, 99].includes(code)) return '⛈️'
  return '🌡️'
}

export function weatherTheme(code: number, isDay: boolean): string {
  if (!isDay) return 'night'
  if (code === 0) return 'clear'
  if ([1, 2, 3].includes(code)) return 'cloudy'
  if ([45, 48].includes(code)) return 'fog'
  if ([95, 96, 99].includes(code)) return 'storm'
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow'
  return 'cloudy'
}

export function displayTemperature(value: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') return Math.round((value * 9) / 5 + 32)
  return Math.round(value)
}

export function locationLabel(location: LocationResult): string {
  return [location.name, location.admin1, location.country].filter(Boolean).join(', ')
}

export function shortLocationLabel(location: LocationResult): string {
  return [location.name, location.admin1].filter(Boolean).join(', ')
}

export function formatDay(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'short' })
    .format(new Date(`${date}T12:00:00`))
    .replace('.', '')
}

export function formatLongDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(new Date(date))
}

export function formatTime(date: string): string {
  const timePart = date.split('T')[1]
  return timePart?.slice(0, 5) ?? date
}

export function windDirection(degrees: number): string {
  const directions = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO']
  const index = Math.round((degrees % 360) / 45) % 8
  return directions[index]
}

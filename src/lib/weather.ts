/**
 * Open-Meteo weather fetch for Petrovac na Moru.
 * No API key required. Free tier permits ~10k requests/day.
 * In-memory cache (10 min TTL) avoids hitting the API per page request.
 */

const LAT = 42.2058;
const LNG = 18.9444;
const TTL_MS = 10 * 60 * 1000;

interface CachedWeather {
  fetched_at: number;
  current: {
    temperature: number;
    weather_code: number;
    wind_speed: number;
  };
  daily: {
    date: string;
    temp_max: number;
    temp_min: number;
    weather_code: number;
  }[];
  sea?: {
    temperature: number;
  };
}

let cache: CachedWeather | null = null;

export async function getWeather(): Promise<CachedWeather | null> {
  if (cache && Date.now() - cache.fetched_at < TTL_MS) return cache;

  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(LAT));
  url.searchParams.set('longitude', String(LNG));
  url.searchParams.set('current', 'temperature_2m,weather_code,wind_speed_10m');
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,weather_code');
  url.searchParams.set('timezone', 'Europe/Belgrade');
  url.searchParams.set('forecast_days', '7');

  // Sea surface temperature (separate marine API)
  const seaUrl = new URL('https://marine-api.open-meteo.com/v1/marine');
  seaUrl.searchParams.set('latitude', String(LAT));
  seaUrl.searchParams.set('longitude', String(LNG));
  seaUrl.searchParams.set('current', 'sea_surface_temperature');
  seaUrl.searchParams.set('timezone', 'Europe/Belgrade');

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3500);

    const [airRes, seaRes] = await Promise.all([
      fetch(url, { signal: ctrl.signal }),
      fetch(seaUrl, { signal: ctrl.signal }).catch(() => null),
    ]);
    clearTimeout(timer);

    if (!airRes.ok) return cache; // serve stale on network error

    const air = (await airRes.json()) as {
      current: { temperature_2m: number; weather_code: number; wind_speed_10m: number };
      daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        weather_code: number[];
      };
    };

    const sea = seaRes && seaRes.ok
      ? ((await seaRes.json()) as { current: { sea_surface_temperature: number } })
      : null;

    cache = {
      fetched_at: Date.now(),
      current: {
        temperature: air.current.temperature_2m,
        weather_code: air.current.weather_code,
        wind_speed: air.current.wind_speed_10m,
      },
      daily: air.daily.time.map((date, i) => ({
        date,
        temp_max: air.daily.temperature_2m_max[i],
        temp_min: air.daily.temperature_2m_min[i],
        weather_code: air.daily.weather_code[i],
      })),
      sea: sea ? { temperature: sea.current.sea_surface_temperature } : undefined,
    };
    return cache;
  } catch {
    return cache; // stale cache or null
  }
}

/** WMO weather code → emoji + label (sr) */
export function describeWeather(code: number): { icon: string; label: string } {
  if (code === 0) return { icon: '☀️', label: 'Sunčano' };
  if (code <= 2) return { icon: '🌤️', label: 'Pretežno sunčano' };
  if (code === 3) return { icon: '☁️', label: 'Oblačno' };
  if (code >= 45 && code <= 48) return { icon: '🌫️', label: 'Magla' };
  if (code >= 51 && code <= 55) return { icon: '🌦️', label: 'Slaba kiša' };
  if (code >= 61 && code <= 65) return { icon: '🌧️', label: 'Kiša' };
  if (code >= 71 && code <= 77) return { icon: '🌨️', label: 'Snijeg' };
  if (code >= 80 && code <= 82) return { icon: '🌧️', label: 'Pljuskovi' };
  if (code >= 95) return { icon: '⛈️', label: 'Grmljavina' };
  return { icon: '☁️', label: 'Promjenljivo' };
}

export function dayName(iso: string, locale = 'sr-Latn'): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(d);
}

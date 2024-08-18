import { Redis } from "ioredis";

interface WeatherData {
  maxTemperature: number;
  minTemperature: number;
  temperature: number;
  sky: number;
  precipitation: number;
}

export class DataStore {
  public redis;
  constructor() {
    this.redis = new Redis({
      host: "localhost",
      port: 6379,
      db: 0,
    });
  }

  async saveWeatherData(
    x: number,
    y: number,
    data: WeatherData,
  ): Promise<void> {
    const timestamp = Math.floor(Date.now() / 600000);
    const key = `weather:${x}:${y}:${timestamp}`;

    await this.redis.hset(key, data);
  }

  async getWeatherData(x: number, y: number): Promise<WeatherData | null> {
    const timestamp = Math.floor(Date.now() / 600000);
    const key = `weather:${x}:${y}:${timestamp}`;

    const data = await this.redis.hgetall(key);

    if (Object.keys(data).length === 0) return null;

    return {
      maxTemperature: parseFloat(data.maxTemperature),
      minTemperature: parseFloat(data.minTemperature),
      temperature: parseFloat(data.temperature),
      sky: parseFloat(data.sky),
      precipitation: parseFloat(data.precipitation),
    };
  }
}

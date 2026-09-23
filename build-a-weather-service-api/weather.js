import express from 'express';

const router = express.Router();

const SUPPORTED_CITIES = ['New York', 'London', 'Tokyo', 'Paris'];

router.get('/', (req, res) => {
  res.json({ cities: SUPPORTED_CITIES });
});

router.get('/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const response = await fetch(
      `https://weather-proxy.freecodecamp.rocks/api/city/${city}`
    );

    if (!response.ok) {
      throw new Error(`status: ${response.status}`);
    }

    const data = await response.json();

    res.json({
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
    });
  } catch (error) {
    res
      .status(404)
      .json({ error: `Could not fetch weather data for "${req.params.city}".` });
  }
});

export default router;
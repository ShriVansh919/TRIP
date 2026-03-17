import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import Fuse from 'fuse.js';
import {
  db,
  initDb,
  getAllCities,
  findCityByName,
  findCityByAlias,
  upsertCity,
  getDestination,
  getFlights,
  getHotels,
  getTransport,
  getPois
} from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;
const startedAt = Date.now();

initDb();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  const cities = db.prepare('SELECT COUNT(*) as c FROM cities').get().c;
  const flights = db.prepare('SELECT COUNT(*) as c FROM flights').get().c;
  const hotels = db.prepare('SELECT COUNT(*) as c FROM hotels').get().c;
  const transport = db.prepare('SELECT COUNT(*) as c FROM transport').get().c;
  res.json({ status: 'ok', cities, flights, hotels, transport, uptime: Math.floor((Date.now() - startedAt) / 1000) + 's' });
});

app.get('/api/cities', async (req, res) => {
  const q = (req.query.q || '').trim();
  const limit = Number(req.query.limit || 6);
  const cities = getAllCities();

  if (!q) {
    return res.json(cities.map(cleanCity));
  }

  const fuse = new Fuse(cities, {
    keys: ['name', 'aliases'],
    threshold: 0.4,
    minMatchCharLength: 2
  });

  let results = fuse.search(q).slice(0, limit).map((r) => cleanCity(r.item));

  if (results.length === 0 && q.length > 1) {
    const geo = await geocodeAndCache(q);
    if (geo) results = [cleanCity(geo)];
  }

  res.json(results);
});

app.post('/api/geocode-cache', async (req, res) => {
  const name = (req.body.name || '').trim();
  if (!name) return res.status(400).json({ error: 'name required' });
  const city = await geocodeAndCache(name);
  if (!city) return res.status(404).json({ error: 'city not found' });
  res.json(cleanCity(city));
});

app.get('/api/search', async (req, res) => {
  try {
    const fromParam = (req.query.from || '').trim();
    const toParam = (req.query.to || '').trim();
    const travelers = Number(req.query.travelers || 1);
    const departDate = req.query.date || new Date().toISOString().slice(0, 10);
    const returnDate = req.query.returnDate || '';

    if (!fromParam || !toParam) {
      return res.status(400).json({ error: 'from and to are required' });
    }

    const fromCity = await ensureCity(fromParam);
    const toCity = await ensureCity(toParam);
    if (!fromCity || !toCity) {
      return res.status(404).json({ error: 'City not found' });
    }

    const flightTarget = resolveFlightTarget(toCity);
    let flights = getFlights(fromCity.name, flightTarget);
    if (!flights.length && toCity.nearest_hub) {
      flights = getFlights(fromCity.name, normalizeHub(toCity.nearest_hub));
    }
    if (!flights.length && fromCity.nearest_hub) {
      flights = getFlights(normalizeHub(fromCity.nearest_hub), flightTarget);
    }

    let flightsMessage = null;

    if (!flights.length) {
      flights = buildConnectingFlights(fromCity, toCity, flightTarget);
      if (flights.length) {
        flightsMessage = null;
      }
    }

    if (!flights.length) {
      flightsMessage = 'No flights found. Consider train or bus.';
    }

    let hotels = getHotels(toCity.name);
    if (!hotels.length) {
      hotels = generateFallbackHotels(toCity);
    }
    const transport = ensureTransportOptions(fromCity, toCity);

    const withCodes = attachAirportCodes(flights, fromCity, toCity);

    const scoredFlights = scoreTrips(withCodes, { priceKey: 'economy_price', durationKey: 'duration_mins', stopsKey: 'stops', timeKey: 'departure_time' });
    const hotelBase = hotels.map((h) => ({ ...h, departure_time: '09:00', stops: h.tier === 'luxury' ? 0 : h.tier === 'mid' ? 1 : 2, duration_mins: Math.round((h.distance_from_center_km || 1) * 15), economy_price: h.price_per_night }));
    const scoredHotels = scoreTrips(hotelBase, { priceKey: 'economy_price', durationKey: 'duration_mins', stopsKey: 'stops', timeKey: 'departure_time' });
    const scoredTransport = scoreTrips(transport, { priceKey: 'price', durationKey: 'duration_mins', stopsKey: 'stops', timeKey: 'departure_time' });

    const destination = (getDestination(toCity.name) || { city: toCity.name, description: 'Travel destination', best_season: 'Year round', safety_score: 7 });
    destination.state = toCity.state;
    const fromDestination = getDestination(fromCity.name) || { city: fromCity.name, airport_code: fromCity.has_airport ? (fromCity.aliases?.[1] || '').toUpperCase() : null, airport_name: fromCity.name };
    const pois = getPois(toCity.name) || [];

    const airports = {
      from: buildAirport(fromCity, fromDestination),
      to: buildAirport(toCity, destination)
    };

    res.json({
      flights: scoredFlights,
      flightsMessage,
      hotels: scoredHotels,
      transport: scoredTransport,
      destination,
      pois,
      meta: { from: cleanCity(fromCity), to: cleanCity(toCity), departDate, returnDate, travelers, airports }
    });
  } catch (err) {
    console.error('search error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/landing-cities', (req, res) => {
  const cities = getAllCities();
  const getCheapest = db.prepare('SELECT MIN(economy_price) as p FROM flights WHERE LOWER(from_city)=LOWER(?) AND LOWER(to_city)=LOWER(?)');
  const origin = 'Delhi';
  const results = cities.map((c) => {
    const price = getCheapest.get(origin, c.name)?.p || null;
    return { name: c.name, state: c.state, lat: c.lat, lng: c.lng, price };
  });
  res.json(results);
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`TripIntel server listening on http://127.0.0.1:${PORT}`);
});

function cleanCity(city) {
  const { aliases, ...rest } = city;
  return { ...rest, aliases: aliases || [] };
}

async function ensureCity(name) {
  const existing = findCityByAlias(name);
  if (existing) return existing;
  return await geocodeAndCache(name);
}

async function geocodeAndCache(name) {
  const existing = findCityByAlias(name);
  if (existing) return existing;
  const geo = await geocodeCity(name);
  if (!geo) return null;
  return upsertCity(geo);
}

async function geocodeCity(name) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(name)},India&format=json&addressdetails=1&limit=1`;
  const resp = await fetch(url, {
    headers: { 'User-Agent': 'TripIntel/1.0 (tripintel.app)' }
  });
  if (!resp.ok) return null;
  const data = await resp.json();
  const first = data[0];
  if (!first) return null;
  const displayName = first.display_name || name;
  const state = first.address?.state || first.address?.state_district || 'India';
  const localName = first.address?.city || first.address?.town || first.address?.village || name;
  return {
    name: titleCase(name),
    state,
    lat: parseFloat(first.lat),
    lng: parseFloat(first.lon),
    has_airport: 0,
    nearest_hub: null,
    hub_distance_km: null,
    aliases: [name, titleCase(name), localName.toLowerCase()].filter(Boolean)
  };
}

function resolveFlightTarget(city) {
  if (city.has_airport) return city.name;
  return normalizeHub(city.nearest_hub || city.name);
}

function normalizeHub(hub) {
  if (!hub) return '';
  return hub
    .replace(/Airport/gi, '')
    .replace(/\s+\)/g, ')')
    .replace(/\s+/g, ' ')
    .trim();
}

function ensureTransportOptions(fromCity, toCity) {
  let rows = getTransport(fromCity.name, toCity.name);
  if (rows.length >= 3) return rows;

  const distanceKm = haversine(fromCity, toCity) || 200;
  const basePrice = Math.max(400, Math.round(distanceKm * 1.6));
  const cabPrice = Math.round(distanceKm * 12);

  const defaults = [
    {
      from_city: fromCity.name,
      to_city: toCity.name,
      mode: 'train',
      operator: 'Express',
      vehicle_type: 'Sleeper',
      departure_time: '06:10',
      arrival_time: '12:10',
      duration_mins: Math.round(distanceKm * 1.2),
      price: basePrice,
      booking_url: 'https://www.irctc.co.in/nget/train-search',
      train_number: 'EXP' + String(Math.floor(distanceKm)),
      boarding_point: 'Central'
    },
    {
      from_city: fromCity.name,
      to_city: toCity.name,
      mode: 'bus',
      operator: 'Volvo',
      vehicle_type: 'AC Sleeper',
      departure_time: '21:00',
      arrival_time: '06:00',
      duration_mins: Math.round(distanceKm * 1.4),
      price: Math.round(basePrice * 0.8),
      booking_url: `https://www.redbus.in/bus-tickets/${fromCity.name.toLowerCase()}-to-${toCity.name.toLowerCase()}`,
      train_number: null,
      boarding_point: 'Main Bus Stand'
    },
    {
      from_city: fromCity.name,
      to_city: toCity.name,
      mode: 'cab',
      operator: 'Intercity',
      vehicle_type: 'Sedan',
      departure_time: '09:00',
      arrival_time: '15:00',
      duration_mins: Math.max(120, Math.round(distanceKm * 1.1)),
      price: cabPrice,
      booking_url: 'https://www.olacabs.com',
      train_number: null,
      boarding_point: 'Home Pickup'
    }
  ];

  const insert = db.prepare(`INSERT INTO transport (from_city, to_city, mode, operator, vehicle_type, departure_time, arrival_time, duration_mins, price, booking_url, train_number, boarding_point) VALUES (@from_city, @to_city, @mode, @operator, @vehicle_type, @departure_time, @arrival_time, @duration_mins, @price, @booking_url, @train_number, @boarding_point)`);
  const tx = db.transaction((items) => items.forEach((i) => insert.run(i)));
  tx(defaults);
  return getTransport(fromCity.name, toCity.name);
}

function buildConnectingFlights(fromCity, toCity, target) {
  const hubs = ['Delhi', 'Mumbai'];
  const results = [];

  hubs.forEach((hubName) => {
    const hubCity = findCityByName(hubName);
    if (!hubCity) return;
    if (hubCity.name === fromCity.name || hubCity.name === toCity.name) return;

    let legOne = getFlights(fromCity.name, hubCity.name);
    if (!legOne.length) {
      legOne = generateFallbackFlights(fromCity, hubCity, hubCity.name, { noteOverride: null });
    }

    let legTwo = getFlights(hubCity.name, target);
    if (!legTwo.length) {
      legTwo = generateFallbackFlights(hubCity, toCity, target, { noteOverride: toCity.has_airport ? null : 'Nearest airport — onward cab required' });
    }

    if (!legOne.length || !legTwo.length) return;

    legOne.forEach((a) => {
      legTwo.forEach((b) => {
        const layoverMins = computeLayoverMins(a.arrival_time, b.departure_time);
        const totalDuration = Number(a.duration_mins || 0) + Number(b.duration_mins || 0) + layoverMins;
        const airlineLabel = (a.airline || '').trim() && (a.airline || '').trim().toLowerCase() === (b.airline || '').trim().toLowerCase()
          ? a.airline
          : `${a.airline} + ${b.airline}`;
        results.push({
          from_city: a.from_city,
          to_city: b.to_city,
          airline: airlineLabel,
          flight_number: `${a.flight_number} · ${b.flight_number}`,
          departure_time: a.departure_time,
          arrival_time: b.arrival_time,
          duration_mins: totalDuration,
          economy_price: Number(a.economy_price || 0) + Number(b.economy_price || 0),
          business_price: Number(a.business_price || 0) + Number(b.business_price || 0),
          stops: 1,
          baggage_checkin_kg: Math.min(Number(a.baggage_checkin_kg || 15), Number(b.baggage_checkin_kg || 15)),
          is_refundable: a.is_refundable && b.is_refundable ? 1 : 0,
          note: `Connecting via ${hubName} · 1 stop`,
          segments: [
            attachCodesToSegment(a, fromCity, hubCity),
            attachCodesToSegment(b, hubCity, toCity)
          ],
          layover_mins: layoverMins,
          via: hubName
        });
      });
    });
  });

  return results;
}

function generateFallbackFlights(fromCity, toCity, target, { noteOverride } = {}) {
  const distanceKm = haversine(fromCity, toCity) || 500;
  const basePrice = Math.max(3200, Math.round(distanceKm * 8));
  const duration = Math.max(60, Math.round(distanceKm * 0.6));
  const airline = 'IndiGo';
  const flights = [
    {
      from_city: fromCity.name,
      to_city: target,
      airline,
      flight_number: `${airline.slice(0, 2).toUpperCase()}${Math.floor(Math.random() * 8000)}`,
      departure_time: '07:45',
      arrival_time: '10:00',
      duration_mins: duration,
      economy_price: basePrice,
      business_price: Math.round(basePrice * 3.2),
      stops: toCity.has_airport ? 0 : 1,
      baggage_checkin_kg: 15,
      is_refundable: 1,
      note: noteOverride !== undefined ? noteOverride : toCity.has_airport ? null : 'Nearest airport — onward cab required'
    }
  ];

  const insert = db.prepare(`INSERT INTO flights (from_city, to_city, airline, flight_number, departure_time, arrival_time, duration_mins, economy_price, business_price, stops, baggage_checkin_kg, is_refundable, note) VALUES (@from_city, @to_city, @airline, @flight_number, @departure_time, @arrival_time, @duration_mins, @economy_price, @business_price, @stops, @baggage_checkin_kg, @is_refundable, @note)`);
  const tx = db.transaction((items) => items.forEach((f) => insert.run(f)));
  tx(flights);
  return getFlights(fromCity.name, target);
}

function attachAirportCodes(flights, fromCity, toCity) {
  const cache = new Map();
  const codeFor = (cityName) => {
    const key = cityName.toLowerCase();
    if (cache.has(key)) return cache.get(key);
    const dest = getDestination(cityName);
    const code = dest?.airport_code || fallbackCode(cityName);
    const name = dest?.airport_name || cityName;
    const entry = { code, name };
    cache.set(key, entry);
    return entry;
  };

  return flights.map((f) => {
    const fromMeta = codeFor(f.from_city || fromCity.name);
    const toMeta = codeFor(f.to_city || toCity.name);
    const segments = (f.segments || []).map((s) => attachCodesToSegment(s, { name: s.from_city }, { name: s.to_city }));
    return { ...f, from_code: fromMeta.code, from_airport: fromMeta.name, to_code: toMeta.code, to_airport: toMeta.name, segments };
  });
}

function attachCodesToSegment(segment, fromCity, toCity) {
  const fromDest = getDestination(fromCity.name);
  const toDest = getDestination(toCity.name);
  return {
    ...segment,
    from_code: fromDest?.airport_code || fallbackCode(fromCity.name),
    to_code: toDest?.airport_code || fallbackCode(toCity.name)
  };
}

function fallbackCode(name = '') {
  return name.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() || 'XXX';
}

function computeLayoverMins(arrival, nextDeparture) {
  const a = parseTime(arrival);
  const b = parseTime(nextDeparture);
  if (a == null || b == null) return 90;
  let diff = b - a;
  if (diff < 0) diff += 24 * 60;
  return diff || 90;
}

function parseTime(str) {
  if (!str || typeof str !== 'string') return null;
  const [h, m] = str.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

function buildAirport(city, dest) {
  return {
    city: city.name,
    code: dest?.airport_code || fallbackCode(city.name),
    name: dest?.airport_name || city.name
  };
}

function generateFallbackHotels(city) {
  const insert = db.prepare(`INSERT INTO hotels (city, name, tier, price_per_night, rating, amenities, distance_from_center_km) VALUES (@city, @name, @tier, @price_per_night, @rating, @amenities, @distance_from_center_km)`);
  const base = [
    { name: `${city.name} Comfort Inn`, tier: 'mid', price_per_night: 3200, rating: 4.1, amenities: JSON.stringify(['WiFi', 'Breakfast', 'AC']), distance_from_center_km: 2.4 },
    { name: `${city.name} Grand Stay`, tier: 'luxury', price_per_night: 6200, rating: 4.6, amenities: JSON.stringify(['WiFi', 'Pool', 'Spa']), distance_from_center_km: 1.5 },
    { name: `${city.name} Budget Lodge`, tier: 'budget', price_per_night: 1900, rating: 3.7, amenities: JSON.stringify(['WiFi', 'AC']), distance_from_center_km: 3.2 }
  ];
  const tx = db.transaction((rows) => rows.forEach((r) => insert.run({ ...r, city: city.name })));
  tx(base);
  return getHotels(city.name);
}

function scoreTrips(items, { priceKey, durationKey, stopsKey, timeKey }) {
  if (!items || !items.length) return [];
  const prices = items.map((i) => Number(i[priceKey] || 0));
  const durations = items.map((i) => Number(i[durationKey] || 0));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minDuration = Math.min(...durations);
  const maxDuration = Math.max(...durations);

  return items.map((item) => {
    const priceScore = maxPrice === minPrice ? 40 : ((maxPrice - Number(item[priceKey])) / (maxPrice - minPrice)) * 40;
    const durationScore = maxDuration === minDuration ? 30 : ((maxDuration - Number(item[durationKey])) / (maxDuration - minDuration)) * 30;
    const stopsVal = item[stopsKey] ?? 0;
    const comfortScore = stopsVal === 0 ? 20 : stopsVal === 1 ? 12 : 4;

    const timeVal = item[timeKey] || '00:00';
    const hour = Number(timeVal.split(':')[0]);
    const convenienceScore = hour >= 6 && hour < 10 ? 10 : hour >= 10 && hour < 20 ? 6 : 3;

    const total = Math.round(priceScore + durationScore + comfortScore + convenienceScore);
    return { ...item, tripScore: total };
  });
}

function haversine(a, b) {
  if (!a.lat || !a.lng || !b.lat || !b.lng) return null;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const aVal = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
  return R * c;
}

function titleCase(str) {
  return str
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

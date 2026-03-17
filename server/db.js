import path from 'path';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { citySeeds, destinationSeeds, flightSeeds, hotelSeeds, transportSeeds, poiSeeds } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'tripintel.db');

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      state TEXT,
      lat REAL,
      lng REAL,
      has_airport INTEGER,
      nearest_hub TEXT,
      hub_distance_km REAL,
      aliases TEXT
    );

    CREATE TABLE IF NOT EXISTS destinations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city_id INTEGER,
      description TEXT,
      best_season TEXT,
      safety_score INTEGER,
      airport_code TEXT,
      airport_name TEXT,
      FOREIGN KEY (city_id) REFERENCES cities(id)
    );

    CREATE TABLE IF NOT EXISTS flights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_city TEXT,
      to_city TEXT,
      airline TEXT,
      flight_number TEXT,
      departure_time TEXT,
      arrival_time TEXT,
      duration_mins INTEGER,
      economy_price INTEGER,
      business_price INTEGER,
      stops INTEGER,
      baggage_checkin_kg INTEGER,
      is_refundable INTEGER,
      note TEXT
    );

    CREATE TABLE IF NOT EXISTS hotels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city TEXT,
      name TEXT,
      tier TEXT,
      price_per_night INTEGER,
      rating REAL,
      amenities TEXT,
      distance_from_center_km REAL
    );

    CREATE TABLE IF NOT EXISTS transport (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_city TEXT,
      to_city TEXT,
      mode TEXT,
      operator TEXT,
      vehicle_type TEXT,
      departure_time TEXT,
      arrival_time TEXT,
      duration_mins INTEGER,
      price INTEGER,
      booking_url TEXT,
      train_number TEXT,
      boarding_point TEXT
    );

    CREATE TABLE IF NOT EXISTS pois (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city TEXT,
      name TEXT,
      type TEXT,
      entry_fee TEXT,
      hours TEXT,
      description TEXT,
      lat REAL,
      lng REAL
    );
  `);

  seedDb();
}

function seedDb() {
  const cityCount = db.prepare('SELECT COUNT(*) as count FROM cities').get().count;
  if (cityCount === 0) {
    const stmt = db.prepare(`INSERT INTO cities (name, state, lat, lng, has_airport, nearest_hub, hub_distance_km, aliases) VALUES (@name, @state, @lat, @lng, @has_airport, @nearest_hub, @hub_distance_km, @aliases)`);
    const insertMany = db.transaction((rows) => {
      rows.forEach((row) => stmt.run({ ...row, aliases: JSON.stringify(row.aliases || []) }));
    });
    insertMany(citySeeds);
  }

  const destinationCount = db.prepare('SELECT COUNT(*) as count FROM destinations').get().count;
  if (destinationCount === 0) {
    const cityByName = db.prepare('SELECT id FROM cities WHERE name = ?');
    const stmt = db.prepare(`INSERT INTO destinations (city_id, description, best_season, safety_score, airport_code, airport_name) VALUES (@city_id, @description, @best_season, @safety_score, @airport_code, @airport_name)`);
    const insertMany = db.transaction((rows) => {
      rows.forEach((row) => {
        const city = cityByName.get(row.city);
        if (city) {
          stmt.run({ ...row, city_id: city.id });
        }
      });
    });
    insertMany(destinationSeeds);
  }

  const flightCount = db.prepare('SELECT COUNT(*) as count FROM flights').get().count;
  if (flightCount === 0) {
    const stmt = db.prepare(`INSERT INTO flights (from_city, to_city, airline, flight_number, departure_time, arrival_time, duration_mins, economy_price, business_price, stops, baggage_checkin_kg, is_refundable, note) VALUES (@from_city, @to_city, @airline, @flight_number, @departure_time, @arrival_time, @duration_mins, @economy_price, @business_price, @stops, @baggage_checkin_kg, @is_refundable, @note)`);
    const insertMany = db.transaction((rows) => {
      rows.forEach((row) => stmt.run({ note: null, ...row }));
    });
    insertMany(flightSeeds);
  }

  const hotelCount = db.prepare('SELECT COUNT(*) as count FROM hotels').get().count;
  if (hotelCount === 0) {
    const stmt = db.prepare(`INSERT INTO hotels (city, name, tier, price_per_night, rating, amenities, distance_from_center_km) VALUES (@city, @name, @tier, @price_per_night, @rating, @amenities, @distance_from_center_km)`);
    const insertMany = db.transaction((rows) => {
      rows.forEach((row) => stmt.run({ ...row, amenities: JSON.stringify(row.amenities || []) }));
    });
    insertMany(hotelSeeds);
  }

  const transportCount = db.prepare('SELECT COUNT(*) as count FROM transport').get().count;
  if (transportCount === 0) {
    const stmt = db.prepare(`INSERT INTO transport (from_city, to_city, mode, operator, vehicle_type, departure_time, arrival_time, duration_mins, price, booking_url, train_number, boarding_point) VALUES (@from_city, @to_city, @mode, @operator, @vehicle_type, @departure_time, @arrival_time, @duration_mins, @price, @booking_url, @train_number, @boarding_point)`);
    const insertMany = db.transaction((rows) => {
      rows.forEach((row) => stmt.run(row));
    });
    insertMany(transportSeeds);
  }

  const poiCount = db.prepare('SELECT COUNT(*) as count FROM pois').get().count;
  if (poiCount === 0) {
    const stmt = db.prepare(`INSERT INTO pois (city, name, type, entry_fee, hours, description, lat, lng) VALUES (@city, @name, @type, @entry_fee, @hours, @description, @lat, @lng)`);
    const insertMany = db.transaction((rows) => {
      rows.forEach((row) => stmt.run(row));
    });
    insertMany(poiSeeds);
  }
}

export function getAllCities() {
  const rows = db.prepare('SELECT * FROM cities ORDER BY name').all();
  return rows.map((r) => ({ ...r, aliases: safeJsonParse(r.aliases) }));
}

export function findCityByName(name) {
  const row = db.prepare('SELECT * FROM cities WHERE LOWER(name) = LOWER(?)').get(name.trim());
  return row ? { ...row, aliases: safeJsonParse(row.aliases) } : null;
}

export function findCityByAlias(name) {
  const lower = name.trim().toLowerCase();
  const rows = db.prepare('SELECT * FROM cities').all();
  return rows.map((r) => ({ ...r, aliases: safeJsonParse(r.aliases) })).find((r) => {
    return r.name.toLowerCase() === lower || (r.aliases || []).some((a) => a.toLowerCase() === lower);
  }) || null;
}

export function insertCity(city) {
  const stmt = db.prepare(`INSERT INTO cities (name, state, lat, lng, has_airport, nearest_hub, hub_distance_km, aliases) VALUES (@name, @state, @lat, @lng, @has_airport, @nearest_hub, @hub_distance_km, @aliases)`);
  const result = stmt.run({ ...city, aliases: JSON.stringify(city.aliases || []) });
  return findCityByName(city.name) || { id: result.lastInsertRowid, ...city };
}

export function upsertCity(city) {
  const existing = findCityByAlias(city.name);
  if (existing) return existing;
  return insertCity(city);
}

export function getDestination(cityName) {
  const row = db.prepare('SELECT d.*, c.name as city FROM destinations d JOIN cities c ON c.id = d.city_id WHERE LOWER(c.name) = LOWER(?)').get(cityName);
  return row || null;
}

export function getFlights(fromCity, toCity) {
  return db.prepare('SELECT * FROM flights WHERE LOWER(from_city) = LOWER(?) AND LOWER(to_city) = LOWER(?)').all(fromCity, toCity);
}

export function getHotels(city) {
  return db.prepare('SELECT * FROM hotels WHERE LOWER(city) = LOWER(?)').all(city).map((h) => ({ ...h, amenities: safeJsonParse(h.amenities) }));
}

export function getTransport(fromCity, toCity) {
  return db.prepare('SELECT * FROM transport WHERE LOWER(from_city) = LOWER(?) AND LOWER(to_city) = LOWER(?)').all(fromCity, toCity);
}

export function getPois(city) {
  return db.prepare('SELECT * FROM pois WHERE LOWER(city) = LOWER(?)').all(city);
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value || '[]');
  } catch (e) {
    return [];
  }
}

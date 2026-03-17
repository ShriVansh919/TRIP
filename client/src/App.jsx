import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import Fuse from 'fuse.js';
import { addDays, differenceInCalendarDays } from 'date-fns';
import styles from './App.module.css';
import './index.css';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const hotelMarkerMap = new Map();

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

const cityDotIcon = L.divIcon({
  className: 'city-dot',
  html: '<div style="width:8px;height:8px;border-radius:50%;background:#00c896;opacity:0.6;box-shadow:0 0 8px #00c896;"></div>',
  iconSize: [8, 8]
});

const defaultDepart = addDays(new Date(), 1);
const defaultReturn = addDays(defaultDepart, 5);

const fuseConfig = {
  keys: ['name', 'aliases'],
  threshold: 0.2,
  minMatchCharLength: 2,
  includeScore: true
};

const tabs = [
  { key: 'flights', label: 'Flights' },
  { key: 'hotels', label: 'Hotels' },
  { key: 'transport', label: 'Transport' }
];

const popularRoutes = [
  ['Mumbai', 'Goa'],
  ['Delhi', 'Manali'],
  ['Bangalore', 'Kochi'],
  ['Delhi', 'Jaipur'],
  ['Chennai', 'Ooty'],
  ['Kolkata', 'Darjeeling']
];

function App() {
  const [cities, setCities] = useState([]);
  const [fromInput, setFromInput] = useState('Delhi');
  const [toInput, setToInput] = useState('Jaipur');
  const [fromCity, setFromCity] = useState(null);
  const [toCity, setToCity] = useState(null);
  const [departDate, setDepartDate] = useState(formatISODate(defaultDepart));
  const [returnDate, setReturnDate] = useState(formatISODate(defaultReturn));
  const [people, setPeople] = useState({ adults: 2, children: 0, infants: 0 });
  const [activeTab, setActiveTab] = useState('flights');
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [suggestions, setSuggestions] = useState({ field: '', list: [], active: 0 });
  const [results, setResults] = useState({ flights: [], hotels: [], transport: [], destination: null, meta: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selection, setSelection] = useState({ flight: null, hotel: null, transport: null });
  const suggestionRef = useRef(null);
  const mapRef = useRef(null);
  const hotelMarkersRef = useRef([]);
  const poiMarkersRef = useRef([]);
  const weatherMarkerRef = useRef(null);
  const [layer, setLayer] = useState('route');
  const [landingCities, setLandingCities] = useState([]);
  const [destWeather, setDestWeather] = useState(null);
  const [wikiSummary, setWikiSummary] = useState('');
  const [compare, setCompare] = useState({ list: [], open: false });
  const hasResults = Boolean(results.meta);
  const hasAnyOptions = (results.flights?.length || results.hotels?.length || results.transport?.length) > 0;
  const isIdle = !hasResults && !hasAnyOptions && !selection.flight && !selection.hotel && !selection.transport && !loading;

  useEffect(() => {
    fetch('/api/cities')
      .then((r) => r.json())
      .then((data) => setCities(data))
      .catch(() => setError('Could not load cities'));
    fetch('/api/landing-cities').then((r) => r.json()).then(setLandingCities).catch(() => {});
  }, []);

  const fuse = useMemo(() => new Fuse(cities, fuseConfig), [cities]);

  const totalTravelers = people.adults + people.children + people.infants;
  const nights = Math.max(1, differenceInCalendarDays(new Date(returnDate), new Date(departDate)) || 5);

  useEffect(() => {
    const handler = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setSuggestions({ field: '', list: [], active: 0 });
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const handleInputChange = (field, value) => {
    if (field === 'from') setFromInput(value);
    if (field === 'to') setToInput(value);
    if (value.length >= 2 && cities.length) {
      const hits = fuse.search(value).slice(0, 6).map((r) => r.item);
      setSuggestions({ field, list: hits, active: 0 });
    } else {
      setSuggestions({ field, list: [], active: 0 });
    }
  };

  const handleKey = (field, e) => {
    if (!suggestions.list.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSuggestions((prev) => ({ ...prev, active: Math.min(prev.list.length - 1, prev.active + 1) }));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSuggestions((prev) => ({ ...prev, active: Math.max(0, prev.active - 1) }));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const city = suggestions.list[suggestions.active];
      if (city) selectCity(field, city);
    } else if (e.key === 'Escape') {
      setSuggestions({ field: '', list: [], active: 0 });
    }
  };

  const clearInput = (field) => {
    if (field === 'from') {
      setFromInput('');
      setFromCity(null);
    } else {
      setToInput('');
      setToCity(null);
    }
    setSuggestions({ field: '', list: [], active: 0 });
  };

  const selectCity = (field, city) => {
    if (field === 'from') {
      setFromCity(city);
      setFromInput(city.name);
    } else {
      setToCity(city);
      setToInput(city.name);
    }
    setSuggestions({ field: '', list: [], active: 0 });
  };

  const resolveCity = async (field, value) => {
    const exact = cities.find((c) => c.name.toLowerCase() === value.toLowerCase());
    if (exact) return exact;
    const fuzzyMatch = fuse.search(value)[0];
    if (fuzzyMatch && fuzzyMatch.score < 0.2) return fuzzyMatch.item;
    const resp = await fetch('/api/geocode-cache', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: value })
    });
    if (!resp.ok) throw new Error(`We don't have travel data for ${value} yet`);
    const city = await resp.json();
    setCities((prev) => (prev.find((c) => c.name === city.name) ? prev : [...prev, city]));
    return city;
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError('');
      const from = await resolveCity('from', fromInput);
      const to = await resolveCity('to', toInput);
      setFromCity(from);
      setToCity(to);
      const url = `/api/search?from=${encodeURIComponent(from.name)}&to=${encodeURIComponent(to.name)}&date=${formatISODate(departDate)}&returnDate=${formatISODate(returnDate)}&travelers=${totalTravelers}`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('Search failed');
      const data = await resp.json();
      setResults(data);
      setActiveTab('flights');
      setDrawerOpen(true);
      setSelection({ flight: null, hotel: null, transport: null });
      setLayer('route');
      setDestWeather(null);
      setWikiSummary('');
      fetchWeather(data.meta?.to).then(setDestWeather).catch(() => {});
      fetchWiki(data.meta?.to?.name || to.name).then(setWikiSummary).catch(() => {});
    } catch (err) {
      setError(err.message || 'Could not search');
    } finally {
      setLoading(false);
    }
  };

  const updateSelection = (type, item) => {
    setSelection((prev) => ({ ...prev, [type]: item }));
  };

  const totalBudget = (() => {
    const flightPrice = selection.flight ? (selection.flight.selected_price ?? selection.flight.economy_price) : 0;
    const flightTotal = selection.flight ? flightPrice * totalTravelers : 0;
    const hotelTotal = selection.hotel ? selection.hotel.price_per_night * nights : 0;
    const transportTotal = selection.transport ? selection.transport.price : 0;
    return flightTotal + hotelTotal + transportTotal;
  })();

  const showLandingDots = !results.meta;
  const mapCenter = toCity?.lat ? [toCity.lat, toCity.lng] : [20.5, 78.9];
  const fromPoint = fromCity?.lat ? [fromCity.lat, fromCity.lng] : null;
  const linePositions = fromPoint && toCity?.lat ? [fromPoint, [toCity.lat, toCity.lng]] : null;
  const distanceKm = computeDistance(results.meta?.from, results.meta?.to);
  const showSidePanel = drawerOpen && (hasResults || hasAnyOptions || selection.flight || selection.hotel || selection.transport);

  useEffect(() => {
    if (mapRef.current && linePositions) {
      mapRef.current.fitBounds(linePositions, { padding: [80, 80] });
    }
  }, [linePositions]);

  useEffect(() => {
    // cleanup markers on layer change or results change
    clearMarkers(hotelMarkersRef.current);
    hotelMarkersRef.current = [];
    hotelMarkerMap.clear();
    clearMarkers(poiMarkersRef.current);
    poiMarkersRef.current = [];
    if (weatherMarkerRef.current) {
      mapRef.current?.removeLayer(weatherMarkerRef.current);
      weatherMarkerRef.current = null;
    }

    if (!mapRef.current) return;
    if (layer === 'hotels' && results.hotels?.length && results.meta?.to) {
      const markers = results.hotels.map((h, idx) => createHotelMarker(h, results.meta.to, idx, mapRef.current, scrollToHotel));
      hotelMarkersRef.current = markers;
    }
    if (layer === 'places' && results.pois?.length && results.meta?.to) {
      const markers = results.pois.map((p) => createPoiMarker(p, mapRef.current));
      poiMarkersRef.current = markers;
    }
    if (layer === 'weather' && destWeather && results.meta?.to) {
      const popup = L.popup({ autoClose: false, closeButton: true })
        .setLatLng([results.meta.to.lat, results.meta.to.lng])
        .setContent(`<div style="color:#000">${destWeather.label}</div>`);
      popup.addTo(mapRef.current);
      weatherMarkerRef.current = popup;
    }
  }, [layer, results, destWeather]);

  return (
    <div className={styles.app}>
      <div className={styles.mapTint} aria-hidden />
      <MapContainer center={mapCenter} zoom={5} scrollWheelZoom className={styles.map} zoomControl={false} whenCreated={(map) => (mapRef.current = map)}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="&copy; OpenStreetMap & CartoDB" />
        {showLandingDots && landingCities.map((c, idx) => (
          <Marker key={c.name + idx} position={[c.lat, c.lng]} icon={cityDotIcon} eventHandlers={{ click: () => { setToInput(c.name); setToCity({ name: c.name, lat: c.lat, lng: c.lng, state: c.state }); }, mouseover: (e) => e.target.bindPopup(`${c.name} · ${c.state} ${c.price ? '· From ₹'+c.price : ''}`).openPopup() }} />
        ))}
        {fromPoint && (
          <Marker position={fromPoint} title={fromCity?.name}>
            <Popup>{fromCity?.name}</Popup>
          </Marker>
        )}
        {toCity?.lat && (
          <Marker position={[toCity.lat, toCity.lng]} title={toCity?.name}>
            <Popup>{toCity.name}</Popup>
          </Marker>
        )}
        {linePositions && <Polyline positions={linePositions} pathOptions={{ color: '#00c896', weight: 3, opacity: 0.8 }} />}        
      </MapContainer>

      {isIdle && (
        <div className={styles.heroOverlay}>
          <div className={styles.heroCard}>
            <div className={styles.heroPill}>Dark mode · Live map</div>
            <div className={styles.heroTitle}>Plan cinematic trips in minutes.</div>
            <div className={styles.heroSubtitle}>Curated flights, stays, weather, and places layered onto an immersive map. Start with a popular route or search your own.</div>
            <div className={styles.heroActions}>
              <button className={styles.heroCTA} type="button" onClick={() => { setFromInput('Delhi'); setToInput('Goa'); setFromCity(null); setToCity(null); handleSearch(); }}>
                Plan Delhi → Goa
              </button>
              <div className={styles.heroChips}>
                {popularRoutes.slice(0, 3).map(([f, t]) => (
                  <button key={`${f}-${t}`} type="button" className={styles.heroChip} onClick={() => { setFromInput(f); setToInput(t); setFromCity(null); setToCity(null); }}>
                    {f} → {t}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.statBlock}><span className={styles.statLabel}>Safety overlays</span><span className={styles.statValue}>10/10 scale</span></div>
              <div className={styles.statBlock}><span className={styles.statLabel}>Weather pulse</span><span className={styles.statValue}>Live + 3-day</span></div>
              <div className={styles.statBlock}><span className={styles.statLabel}>Trip compare</span><span className={styles.statValue}>Flights · Rides</span></div>
            </div>
          </div>
        </div>
      )}

      <div className={`${styles.searchBar} ${hasResults ? styles.searchBarCompact : ''}`} ref={suggestionRef}>
        <div className={styles.searchRow}>
          <CityInput
            label="From"
            value={fromInput}
            onChange={(v) => handleInputChange('from', v)}
            onKeyDown={(e) => handleKey('from', e)}
            suggestions={suggestions.field === 'from' ? suggestions.list : []}
            activeIndex={suggestions.field === 'from' ? suggestions.active : 0}
            onSelect={(c) => selectCity('from', c)}
            onClear={() => clearInput('from')}
          />
          <CityInput
            label="To"
            value={toInput}
            onChange={(v) => handleInputChange('to', v)}
            onKeyDown={(e) => handleKey('to', e)}
            suggestions={suggestions.field === 'to' ? suggestions.list : []}
            activeIndex={suggestions.field === 'to' ? suggestions.active : 0}
            onSelect={(c) => selectCity('to', c)}
            onClear={() => clearInput('to')}
          />
          <DateInput label="Depart" value={departDate} onChange={setDepartDate} />
          <DateInput label="Return" value={returnDate} onChange={setReturnDate} />
          <PeoplePicker people={people} setPeople={setPeople} />
          <button className={styles.searchBtn} onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching…' : 'Search'}
          </button>
        </div>
        {showLandingDots && (
          <div className={styles.landingChips}>
            {popularRoutes.map(([f, t]) => (
              <button key={`${f}-${t}`} className={styles.chipBtn} type="button" onClick={() => { setFromInput(f); setToInput(t); setFromCity(null); setToCity(null); }}>
                {f} → {t}
              </button>
            ))}
          </div>
        )}
        {error && <div className={styles.error}>{error}</div>}
      </div>

      {showSidePanel && (
        <BudgetCard
          selection={selection}
          nights={nights}
          travelers={totalTravelers}
          total={totalBudget}
          from={fromCity}
          to={toCity}
          destination={results.destination}
          weather={destWeather}
          wiki={wikiSummary}
        />
      )}

      <ResultsDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        activeTab={activeTab}
        setActiveTab={(t) => {
          setActiveTab(t);
          if (t === 'hotels') setLayer('hotels');
          else if (t === 'flights' || t === 'transport') setLayer('route');
        }}
        results={results}
        onSelect={updateSelection}
        selection={selection}
        travelers={totalTravelers}
        nights={nights}
        compare={compare}
        setCompare={setCompare}
        layer={layer}
        setLayer={setLayer}
        distanceKm={distanceKm}
      />

      {linePositions && layer === 'route' && drawerOpen && (
        <div className={styles.routeInfo}>Distance ~ {distanceKm ? `${distanceKm} km` : '—'}</div>
      )}
      {drawerOpen && activeTab === 'flights' && (
        <CompareBar compare={compare} setCompare={setCompare} selections={selection} />
      )}
    </div>
  );
}

function CityInput({ label, value, onChange, onSelect, suggestions, activeIndex, onKeyDown, onClear }) {
  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      <div className={styles.inputWrapper}>
        <input
          className={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search city"
        />
        {value && (
          <button className={styles.clearBtn} onClick={onClear} type="button" aria-label="Clear input">
            ×
          </button>
        )}
      </div>
      {suggestions && suggestions.length > 0 && (
        <div className={styles.dropdown}>
          {suggestions.map((city, idx) => (
            <button
              key={city.name + idx}
              className={`${styles.dropdownItem} ${idx === activeIndex ? styles.activeItem : ''}`}
              type="button"
              onMouseDown={(e) => {
                // Prevent input from losing focus before click registers
                e.preventDefault();
              }}
              onClick={() => {
                onSelect(city);
              }}
            >
              <span>{city.name}</span>
              <span className={styles.muted}>· {city.state}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DateInput({ label, value, onChange }) {
  const inputRef = useRef(null);
  const display = formatDisplayDate(value);
  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      <input
        type="date"
        ref={inputRef}
        className={styles.hiddenDate}
        value={formatISODate(value)}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        className={`${styles.input} ${styles.dateButton}`}
        onClick={() => inputRef.current?.showPicker ? inputRef.current.showPicker() : inputRef.current?.focus()}
        type="button"
      >
        {display}
      </button>
    </div>
  );
}

function PeoplePicker({ people, setPeople }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const label = `${people.adults} Adult${people.adults > 1 ? 's' : ''}${people.children ? ` · ${people.children} Child` : ''}${people.infants ? ` · ${people.infants} Infant` : ''}`;

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handler);
    }
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const adjust = (key, delta) => {
    setPeople((prev) => {
      const next = Math.max(0, (prev[key] || 0) + delta);
      const updated = { ...prev, [key]: next };
      if (key === 'adults' && updated.adults < 1) updated.adults = 1;
      return updated;
    });
  };

  return (
    <div className={styles.field} ref={dropdownRef}>
      <span className={styles.label}>People</span>
      <button className={`${styles.input} ${styles.dateButton}`} onClick={() => setOpen((s) => !s)} type="button">{label}</button>
      {open && (
        <div className={styles.peopleDropdown}>
          {['adults', 'children', 'infants'].map((k) => (
            <div key={k} className={styles.peopleRow}>
              <span className={styles.label}>{title(k)}</span>
              <div className={styles.counter}>
                <button onClick={() => adjust(k, -1)}>-</button>
                <span>{people[k]}</span>
                <button onClick={() => adjust(k, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ResultsDrawer({ open, setOpen, activeTab, setActiveTab, results, onSelect, selection, travelers, nights, compare, setCompare, layer, setLayer, distanceKm }) {
  const tabsContent = {
    flights: results.flights || [],
    hotels: results.hotels || [],
    transport: results.transport || []
  };
  const mapLayers = [
    { key: 'route', label: 'Route line' },
    { key: 'hotels', label: 'Stays on map' },
    { key: 'places', label: 'Places' },
    { key: 'weather', label: 'Weather' }
  ];
  const [fareChoice, setFareChoice] = useState({});
  const emptyTips = {
    flights: ['Try nearby airports', 'Use flexible dates', 'Pick a popular route chip'],
    hotels: ['Switch map focus to "Stay map"', 'Zoom the map to see markers', 'Adjust trip length for better matches'],
    transport: ['Try route view to check distance', 'Look at buses for shorter routes', 'Search adjoining cities']
  };
  const toggleCompare = (item, kind) => {
    setCompare((prev) => {
      const exists = prev.list.find((x) => x.kind === kind && x.id === item.id && x.label === item.label);
      let list = exists ? prev.list.filter((x) => !(x.kind === kind && x.id === item.id && x.label === item.label)) : [...prev.list, { ...item, kind }];
      if (list.length > 3) list = list.slice(list.length - 3);
      return { ...prev, list };
    });
  };

  return (
    <div className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}>
      <div className={styles.drawerHeader}>
        <div className={styles.navGroups}>
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.key}
                className={`${styles.tab} ${activeTab === tab.key ? styles.activeTab : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className={styles.mapNav}>
            <span className={styles.navLabel}>Map focus</span>
            <div className={styles.mapChips}>
              {mapLayers.map((l) => (
                <button key={l.key} type="button" className={`${styles.mapChip} ${layer === l.key ? styles.mapChipActive : ''}`} onClick={() => setLayer(l.key)}>
                  {l.label}
                </button>
              ))}
            </div>
            {distanceKm ? <span className={`${styles.distancePill} ${styles.distanceNote}`}>Route · ~{distanceKm} km · direct line</span> : null}
          </div>
        </div>
        <button className={styles.drawerToggle} onClick={() => setOpen(!open)} aria-label={open ? 'Hide results' : 'Show results'}>
          {open ? '⯅ Hide results' : '⯆ Show results'}
        </button>
      </div>

      <div className={styles.cardsArea}>
        {activeTab === 'flights' && results.flightsMessage && tabsContent.flights.length === 0 && (
          <EmptyState icon="✈️" title="No flights found" message={results.flightsMessage} tips={emptyTips.flights} />
        )}
        {tabsContent[activeTab].length === 0 && !results.flightsMessage && (
          <EmptyState
            icon={activeTab === 'flights' ? '🧭' : activeTab === 'hotels' ? '🛏️' : '🚌'}
            title="No results yet"
            message="Search to see curated options for this trip."
            tips={emptyTips[activeTab]}
          />
        )}
        {activeTab === 'flights' && tabsContent.flights.map((f) => {
          const fare = fareChoice[f.flight_number] || 'economy';
          const onFareChange = (next) => {
            setFareChoice((prev) => ({ ...prev, [f.flight_number]: next }));
            if (selection.flight?.flight_number === f.flight_number) {
              const price = next === 'business' && f.business_price ? f.business_price : f.economy_price;
              onSelect('flight', { ...f, selected_fare: next, selected_price: price });
            }
          };
          const compared = !!compare.list.find((x) => x.kind === 'flight' && x.flight_number === f.flight_number);
          return (
            <FlightCard
              key={`${f.airline}-${f.flight_number}`}
              flight={f}
              airports={results.meta?.airports}
              selected={selection.flight?.flight_number === f.flight_number}
              onSelect={(flight) => onSelect('flight', flight)}
              fare={fare}
              onFareChange={onFareChange}
              onCompare={() => toggleCompare({ ...f, label: `${f.airline} ${f.flight_number}`, price: f.economy_price, duration: f.duration_mins, tripScore: f.tripScore, id: f.flight_number }, 'flight')}
              compared={compared}
            />
          );
        })}

        {activeTab === 'hotels' && tabsContent.hotels.map((h) => (
          <HotelCard key={`${h.city}-${h.name}`} hotel={h} nights={nights} selected={selection.hotel?.name === h.name} onSelect={() => onSelect('hotel', h)} />
        ))}

        {activeTab === 'transport' && tabsContent.transport.map((t) => (
          <div key={`${t.mode}-${t.departure_time}-${t.price}`} className={`${styles.card} ${styles.cardRelative} ${selection.transport?.departure_time === t.departure_time && selection.transport?.mode === t.mode ? styles.selected : ''}`} onClick={() => onSelect('transport', t)}>
            <input
              type="checkbox"
              className={styles.selectBox}
              checked={!!compare.list.find((x) => x.kind === 'transport' && x.departure_time === t.departure_time && x.mode === t.mode)}
              onChange={(e) => {
                e.stopPropagation();
                toggleCompare({ ...t, label: `${title(t.mode)} ${t.operator}`, price: t.price, duration: t.duration_mins, tripScore: t.tripScore, id: `${t.mode}-${t.departure_time}-${t.price}` }, 'transport');
              }}
            />
            <div className={styles.cardMainVertical}>
              {t.mode === 'train' && (
                <>
                  <div className={styles.title}>{t.operator}{t.train_number ? ` · ${t.train_number}` : ''}</div>
                  <div className={styles.sub}>{stationName(t.from_city)} → {stationName(t.to_city)}</div>
                  <div className={styles.sub}>{t.departure_time} → {t.arrival_time} • {formatDuration(t.duration_mins)}</div>
                  <div className={styles.sub}>Sleeper · 3AC · 2AC</div>
                </>
              )}

              {t.mode === 'bus' && (
                <>
                  <div className={styles.title}>{t.operator} · {t.vehicle_type}</div>
                  <div className={styles.sub}>{busPoint(t.boarding_point, t.from_city)} → {busPoint(null, t.to_city)}</div>
                  <div className={styles.sub}>{t.departure_time} → {t.arrival_time} • {formatDuration(t.duration_mins)}</div>
                </>
              )}

              {t.mode === 'cab' && (
                <>
                  <div className={styles.title}>Ola Outstation · {t.vehicle_type}</div>
                  <div className={styles.sub}>{t.departure_time} → {t.arrival_time} • {formatDuration(t.duration_mins)}</div>
                  {distanceKm && <div className={styles.sub}>{distanceKm} km estimated</div>}
                  <div className={styles.sub}>{cabBreakdown(t.price, distanceKm)}</div>
                </>
              )}

              <div className={styles.transportFooter}>
                <div className={styles.priceBlock}>
                  <span className={styles.price}>₹{t.price.toLocaleString()}</span>
                  <ScoreRing score={t.tripScore} />
                </div>
                <div className={styles.buttonRow}>
                  {t.mode === 'train' && (
                    <>
                      <a className={styles.bookBtn} href="https://www.irctc.co.in/nget/train-search" target="_blank" rel="noreferrer">Book on IRCTC</a>
                    </>
                  )}
                  {t.mode === 'bus' && (
                    <>
                      <a className={styles.bookBtn} href={`https://www.redbus.in/bus-tickets/${(t.from_city || '').toLowerCase()}-to-${(t.to_city || '').toLowerCase()}`} target="_blank" rel="noreferrer">Book on RedBus</a>
                      <a className={styles.bookBtn} href="https://www.abhibus.com" target="_blank" rel="noreferrer">Book on AbhiBus</a>
                    </>
                  )}
                  {t.mode === 'cab' && (
                    <>
                      <a className={styles.bookBtn} href="https://www.olacabs.com" target="_blank" rel="noreferrer">Book on Ola</a>
                      <a className={styles.bookBtn} href="https://www.uber.com/in" target="_blank" rel="noreferrer">Book on Uber</a>
                    </>
                  )}
                </div>
              </div>

              {t.mode === 'cab' && travelers >= 4 && distanceKm && (
                <div className={styles.tempoBlock}>
                  <div className={styles.sub}>Tempo Traveller · {distanceKm} km</div>
                  <div className={styles.sub}>₹{Math.round(distanceKm * 18).toLocaleString()} · ₹18/km · Tolls extra</div>
                  <div className={styles.buttonRow}>
                    <a className={styles.bookBtn} href="https://www.olacabs.com" target="_blank" rel="noreferrer">Book on Ola</a>
                    <a className={styles.bookBtn} href="https://www.uber.com/in" target="_blank" rel="noreferrer">Book on Uber</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BudgetCard({ selection, nights, travelers, total, from, to, destination, weather, wiki }) {
  const hasSelection = selection.flight || selection.hotel || selection.transport;
  const flightPrice = selection.flight ? (selection.flight.selected_price ?? selection.flight.economy_price) : null;
  return (
    <div className={styles.budgetCard}>
      <div className={styles.title}>TripIntel Budget</div>
      <div className={styles.sub}>{from?.name || 'From'} → {to?.name || 'To'}</div>
      
      {!hasSelection ? (
        <div className={styles.emptyBudgetCard}>
          <div className={styles.emptyBudgetIcon}>🧭</div>
          <div>
            <div className={styles.title}>Start planning</div>
            <div className={styles.sub}>Pick any flight, stay, or ride to build your budget instantly.</div>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.budgetRow}><span>Flights</span><span>{selection.flight ? `₹${(flightPrice * travelers).toLocaleString()} total (${travelers} traveler${travelers > 1 ? 's' : ''})` : '—'}</span></div>
          <div className={styles.budgetRow}><span>Hotels</span><span>{selection.hotel ? `₹${(selection.hotel.price_per_night * nights).toLocaleString()} (${nights} nights)` : '—'}</span></div>
          <div className={styles.budgetRow}><span>Transport</span><span>{selection.transport ? `₹${selection.transport.price.toLocaleString()}` : '—'}</span></div>
          <div className={styles.total}>Total · ₹{total.toLocaleString()}</div>
        </>
      )}

      {destination && (
        <div className={styles.destCard}>
          <div className={styles.destTitle}>{destination.city}{destination.state ? ` · ${destination.state}` : ''}</div>
          <div className={styles.safety}>Safety: {destination.safety_score || 7}/10</div>
          <div className={styles.destMeta}>Best time: {destination.best_season || 'Year round'}</div>
          <div className={styles.destMeta}>Airport: {destination.airport_name || 'N/A'} {destination.airport_code ? `(${destination.airport_code})` : ''}</div>
          {weather && <div className={styles.weatherLine}>{weather.label}</div>}
          <div className={styles.about}>{wiki || destination.description}</div>
        </div>
      )}
    </div>
  );
}

function ScoreRing({ score }) {
  const angle = Math.min(100, Math.max(0, score || 0)) * 3.6;
  return (
    <div className={styles.ring} style={{ backgroundImage: `conic-gradient(var(--accent-green) ${angle}deg, rgba(255,255,255,0.08) ${angle}deg)` }}>
      <span>{Math.round(score || 0)}</span>
    </div>
  );
}

function FlightCard({ flight, airports, selected, onSelect, fare, onFareChange, onCompare, compared }) {
  const airline = flight.airline || '';
  const airlineMeta = getAirlineMeta(airline);
  const price = fare === 'business' && flight.business_price ? flight.business_price : flight.economy_price;
  const stopsLabel = flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}${flight.via ? ` · ${flight.via}` : ''}`;
  const stopsTone = flight.stops === 0 ? styles.badgeGreen : styles.badgeAmber;
  const refundableText = flight.is_refundable ? '✓ Refundable' : '✗ Non-refundable';
  const refundableTone = flight.is_refundable ? styles.badgeGreen : styles.badgeRed;
  const baggage = `${flight.baggage_checkin_kg || 15}kg + 7kg cabin`;
  const hillWarning = flight.note && flight.note.toLowerCase().includes('nearest airport');

  const fromCode = flight.from_code || airports?.from?.code || '—';
  const toCode = flight.to_code || airports?.to?.code || '—';

  const segments = flight.segments && flight.segments.length > 0 ? flight.segments : null;
  const layoverWarn = flight.layover_mins && flight.layover_mins < 60;

  const handleSelect = () => {
    onSelect({ ...flight, selected_fare: fare, selected_price: price });
  };

  return (
    <div className={`${styles.card} ${styles.flightCard} ${styles.cardRelative} ${selected ? styles.selected : ''}`} onClick={handleSelect}>
      <label className={styles.selectChip} onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" className={styles.selectBox} checked={compared} onChange={() => onCompare()} aria-label="Add to compare" />
        <span>{compared ? 'In compare' : 'Compare'}</span>
      </label>
      <div className={styles.flightTop}>
        <div className={styles.airlineRow}>
          <div className={styles.logoWrap}>
            {airlineMeta.code ? (
              <img
                src={`https://pics.avs.io/200/80/${airlineMeta.code}.png`}
                alt={airline}
                width={60}
                height={24}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : null}
            <span className={styles.airlineText}>{airline} {airlineMeta.code ? `· ${airlineMeta.code}` : ''}</span>
          </div>
          <div className={styles.badgeRow}>
            <span className={`${styles.badge} ${stopsTone}`}>{stopsLabel}</span>
            <span className={`${styles.badge} ${refundableTone}`}>{refundableText}</span>
          </div>
        </div>

        <div className={styles.timeRow}>
          <div className={styles.timeBlock}>
            <div className={styles.code}>{fromCode}</div>
            <div className={styles.timeMono}>{flight.departure_time}</div>
          </div>
          <div className={styles.timeline}>
            <div className={styles.line} />
            <div className={styles.duration}>{formatDuration(flight.duration_mins)}</div>
          </div>
          <div className={styles.timeBlock}>
            <div className={styles.code}>{toCode}</div>
            <div className={styles.timeMono}>{flight.arrival_time}</div>
          </div>
        </div>

        {segments && (
          <div className={styles.segmentWrap}>
            {segments.map((seg, idx) => (
              <div key={idx} className={styles.segmentCard}>
                <div className={styles.sub}>{seg.from_code} → {seg.to_code}</div>
                <div className={styles.timeMono}>{seg.departure_time} → {seg.arrival_time}</div>
              </div>
            ))}
            <div className={styles.layover}>
              ↓ {formatDuration(flight.layover_mins || 90)} layover{flight.via ? ` at ${flight.via}` : ''}
              {layoverWarn && <span className={styles.note}> ⚠ Tight connection</span>}
            </div>
          </div>
        )}

        {hillWarning && <div className={styles.warningBox}>⚠ {flight.note}</div>}

        <div className={styles.priceRow}>
          <div className={styles.fareToggle} onClick={(e) => e.stopPropagation()}>
            {['economy', 'business'].map((tier) => (
              <button
                key={tier}
                type="button"
                className={`${styles.fareChip} ${fare === tier ? styles.fareChipActive : ''}`}
                onClick={() => onFareChange(tier)}
              >
                {title(tier)}
              </button>
            ))}
          </div>
          <div className={styles.priceBlock}>
            <span className={styles.priceMono}>₹{price.toLocaleString()}</span>
            <ScoreRing score={flight.tripScore} />
          </div>
        </div>

        <div className={styles.metaRow}>
          <span className={styles.sub}>{baggage}</span>
        </div>
      </div>

      <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
        <a className={styles.bookBtn} href="https://www.makemytrip.com/flights/" target="_blank" rel="noreferrer" title="Opens third-party site. TripIntel doesn't process payments.">Book MakeMyTrip</a>
        <a className={styles.bookBtn} href="https://www.easemytrip.com/flights/" target="_blank" rel="noreferrer" title="Opens third-party site. TripIntel doesn't process payments.">Book EaseMyTrip</a>
        <a className={styles.bookBtn} href={`https://www.skyscanner.co.in/transport/flights/${fromCode.toLowerCase()}/${toCode.toLowerCase()}/`} target="_blank" rel="noreferrer" title="Opens third-party site. TripIntel doesn't process payments.">Skyscanner</a>
      </div>
    </div>
  );
}

function title(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatISODate(dateVal) {
  const d = new Date(dateVal);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

function formatDisplayDate(dateVal) {
  const d = new Date(dateVal);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function stationName(city) {
  return `${city} Jn`;
}

function busPoint(point, city) {
  if (point) return point;
  return `${city} Bus Stand`;
}

function formatDuration(mins = 0) {
  const m = Number(mins) || 0;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return `${h}h ${rem}m`;
}

function computeDistance(a, b) {
  if (!a?.lat || !a?.lng || !b?.lat || !b?.lng) return null;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return Math.round(R * c);
}

function cabBreakdown(price, distanceKm) {
  if (!distanceKm) return `₹${price.toLocaleString()} · Tolls extra`;
  const perKm = Math.round(price / distanceKm);
  return `₹${price.toLocaleString()} · ₹${perKm}/km · Tolls ~₹200 extra`;
}

function getAirlineMeta(name = '') {
  const map = {
    indigo: { code: '6E' },
    'spicejet': { code: 'SG' },
    'air india': { code: 'AI' },
    vistara: { code: 'UK' },
    'akasa air': { code: 'QP' }
  };
  const key = name.toLowerCase();
  return map[key] || { code: '' };
}

function HotelCard({ hotel, nights, selected, onSelect }) {
  const tierMap = {
    budget: { cls: styles.tierBudget, label: 'BUDGET' },
    mid: { cls: styles.tierMid, label: 'MID-RANGE' },
    luxury: { cls: styles.tierLuxury, label: 'LUXURY' }
  };
  const tier = tierMap[hotel.tier] || tierMap.mid;
  const stars = '★'.repeat(Math.round(hotel.rating)) + '☆'.repeat(Math.max(0, 5 - Math.round(hotel.rating)));
  const amenities = hotel.amenities || [];
  const main = amenities.slice(0, 4);
  const more = amenities.length - main.length;
  const total = hotel.price_per_night * nights;
  return (
    <div className={`${styles.card} ${styles.cardRelative} ${selected ? styles.selected : ''}`} data-hotel={hotel.name} onClick={onSelect} onMouseEnter={() => highlightHotelMarker(hotel.name)}>
      <div className={styles.cardMain}>
        <div>
          <div className={styles.title}>{hotel.name} <span className={`${styles.tierBadge} ${tier.cls}`}>{tier.label}</span></div>
          <div className={styles.sub}><span className={styles.stars}>{stars}</span> {hotel.rating.toFixed(1)} / 5 · {hotel.distance_from_center_km} km from center</div>
          <div className={styles.chips}>{main.map((a) => <span key={a} className={styles.chip}>{a}</span>)}{more > 0 && <span className={styles.chip}>+{more} more</span>}</div>
        </div>
        <div className={styles.priceBlock}>
          <span className={styles.priceMono}>₹{hotel.price_per_night.toLocaleString()}/night</span>
          <div className={styles.sub}>Total ₹{total.toLocaleString()} for {nights} nights</div>
          <ScoreRing score={hotel.tripScore} />
        </div>
      </div>
      <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
        <a className={styles.bookBtn} href="https://www.makemytrip.com/hotels/" target="_blank" rel="noreferrer">Check on MakeMyTrip</a>
        <a className={styles.bookBtn} href="https://www.goibibo.com/hotels/" target="_blank" rel="noreferrer">Check on Goibibo</a>
      </div>
    </div>
  );
}

function LayerButtons({ active, setActive }) {
  const layers = ['route', 'hotels', 'places', 'weather'];
  return (
    <div className={styles.layerButtons}>
      {layers.map((l) => (
        <button key={l} className={`${styles.layerBtn} ${active === l ? styles.layerBtnActive : ''}`} type="button" onClick={() => setActive(l)}>{title(l)}</button>
      ))}
    </div>
  );
}

function CompareBar({ compare, setCompare }) {
  if (compare.list.length < 2) return null;
  return (
    <>
      <div className={styles.compareBar}>
        Comparing {compare.list.length} options
        <button className={styles.bookBtn} type="button" onClick={() => setCompare((p) => ({ ...p, open: true }))}>Compare Now</button>
        <button className={styles.bookBtn} type="button" onClick={() => setCompare({ list: [], open: false })}>Clear</button>
      </div>
      {compare.open && <CompareDrawer compare={compare} setCompare={setCompare} />}
    </>
  );
}

function CompareDrawer({ compare, setCompare }) {
  const headers = compare.list.map((i, idx) => `${i.label || 'Option'} ${idx + 1}`);
  const rows = [
    { label: 'Price', values: compare.list.map((i) => i.price), best: 'min' },
    { label: 'Duration', values: compare.list.map((i) => i.duration), best: 'min' },
    { label: 'Departure', values: compare.list.map((i) => i.departure_time || '-') },
    { label: 'Trip Score', values: compare.list.map((i) => i.tripScore), best: 'max' }
  ];
  const bestIdx = (values, mode) => {
    const nums = values.filter((v) => typeof v === 'number');
    if (!nums.length) return -1;
    if (mode === 'min') {
      const min = Math.min(...nums);
      return values.findIndex((v) => v === min);
    }
    const max = Math.max(...nums);
    return values.findIndex((v) => v === max);
  };

  return (
    <div className={styles.compareDrawer}>
      <div className={styles.drawerHeader}>
        <div className={styles.title}>Comparison</div>
        <button className={styles.drawerToggle} type="button" onClick={() => setCompare((p) => ({ ...p, open: false }))}>Close</button>
      </div>
      <table className={styles.compareTable}>
        <thead>
          <tr>
            <th>Metric</th>
            {headers.map((h) => <th key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const winner = row.best ? bestIdx(row.values, row.best) : -1;
            return (
              <tr key={row.label}>
                <td>{row.label}</td>
                {row.values.map((v, idx) => (
                  <td key={idx} className={winner === idx ? styles.winner : ''}>{typeof v === 'number' ? v : v}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ icon = '🧭', title = 'No results', message = 'Try a different search.', tips = [] }) {
  return (
    <div className={`${styles.card} ${styles.emptyState}`}>
      <div className={styles.emptyHeader}>
        <span className={styles.emptyIcon}>{icon}</span>
        <div>
          <div className={styles.title}>{title}</div>
          <div className={styles.sub}>{message}</div>
        </div>
      </div>
      {tips?.length ? (
        <div className={styles.emptyTips}>
          {tips.map((tip) => (
            <span key={tip} className={styles.chip}>{tip}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function fetchWeather(city) {
  if (!city?.lat || !city?.lng) return Promise.resolve(null);
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current=temperature_2m,weathercode&timezone=Asia/Kolkata&daily=temperature_2m_max,temperature_2m_min&forecast_days=3`;
  return fetch(url)
    .then((r) => r.json())
    .then((d) => {
      const code = d.current?.weathercode;
      const emoji = weatherEmoji(code);
      const temp = Math.round(d.current?.temperature_2m || 0);
      const mins = d.daily?.temperature_2m_min || [];
      const maxs = d.daily?.temperature_2m_max || [];
      const threeDay = mins.slice(0, 3).map((mn, i) => `${Math.round(mn)}°/${Math.round(maxs[i] || mn)}°`).join(' · ');
      const min = Math.round(mins[0] || 0);
      const max = Math.round(maxs[0] || 0);
      return { label: `${emoji} ${temp}°C right now · ${min}°/${max}° · ${threeDay}` };
    })
    .catch(() => null);
}

function weatherEmoji(code) {
  if (code === 0 || code === 1) return '☀️';
  if (code === 2 || code === 3) return '⛅';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌦️';
  return '⛅';
}

function fetchWiki(name) {
  if (!name) return Promise.resolve('');
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`;
  return fetch(url)
    .then((r) => r.json())
    .then((d) => (d.extract ? d.extract.split('. ').slice(0, 3).join('. ') : ''))
    .catch(() => '');
}

function clearMarkers(list = []) {
  list.forEach((m) => m && m.remove());
}

function jitter(name, idx, scale) {
  const seed = Math.abs(hashCode(name) + idx * 31);
  return ((seed % 1000) / 1000 - 0.5) * scale;
}

function hashCode(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  return h;
}

function createHotelMarker(hotel, city, idx, map, onClick) {
  const offset = hotel.tier === 'luxury' ? 0.03 : hotel.tier === 'mid' ? 0.02 : 0.01;
  const lat = city.lat + jitter(hotel.name, idx, offset);
  const lng = city.lng + jitter(hotel.name, idx + 7, offset);
  const color = hotel.tier === 'luxury' ? '#a06bff' : hotel.tier === 'mid' ? '#f5a623' : '#00c896';
  const icon = L.divIcon({
    className: 'hotel-div',
    html: `<div style="background:#1c1c22;border:1px solid ${color};border-radius:4px;padding:2px 6px;font-size:11px;color:${color};white-space:nowrap">₹${hotel.price_per_night}/n</div>`,
    iconSize: [60, 20]
  });
  const marker = L.marker([lat, lng], { icon })
    .addTo(map)
    .on('click', () => onClick && onClick(hotel.name))
    .on('mouseover', function () { this.setZIndexOffset(1000); })
    .on('mouseout', function () { this.setZIndexOffset(0); });
  marker.hotelName = hotel.name;
  hotelMarkerMap.set(hotel.name, marker);
  return marker;
}

function createPoiMarker(poi, map) {
  const emojiMap = { monument: '🏛️', temple: '🛕', restaurant: '🍽️', market: '🛍️', nature: '🌿', viewpoint: '👁️' };
  const icon = L.divIcon({
    className: 'poi-div',
    html: `<div style="font-size:16px">${emojiMap[poi.type] || '📍'}</div>`,
    iconSize: [20, 20]
  });
  const marker = L.marker([poi.lat, poi.lng], { icon })
    .addTo(map)
    .bindPopup(`<div><strong>${poi.name}</strong><br/>${poi.description}<br/>${poi.entry_fee} · ${poi.hours}</div>`);
  return marker;
}

function scrollToHotel(name) {
  const el = document.querySelector(`[data-hotel="${CSS.escape(name)}"]`);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add(styles.highlightPulse);
    setTimeout(() => el.classList.remove(styles.highlightPulse), 1200);
  }
}

function highlightHotelMarker(name) {
  const marker = hotelMarkerMap.get(name);
  if (marker) {
    marker.setZIndexOffset(1200);
    marker._icon && (marker._icon.style.filter = 'drop-shadow(0 0 6px #00c896)');
    setTimeout(() => {
      marker.setZIndexOffset(0);
      marker._icon && (marker._icon.style.filter = '');
    }, 800);
  }
}


export default App;

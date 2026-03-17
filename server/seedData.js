export const citySeeds = [
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.076, lng: 72.8777, has_airport: 1, nearest_hub: null, hub_distance_km: null, aliases: ['bombay', 'bom', 'mumbai'] },
  { name: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.209, has_airport: 1, nearest_hub: null, hub_distance_km: null, aliases: ['new delhi', 'del', 'dilli', 'ndls'] },
  { name: 'Goa', state: 'Goa', lat: 15.2993, lng: 74.124, has_airport: 1, nearest_hub: null, hub_distance_km: null, aliases: ['goa'] },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, has_airport: 1, nearest_hub: null, hub_distance_km: null, aliases: ['jaipur', 'jai'] },
  { name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946, has_airport: 1, nearest_hub: null, hub_distance_km: null, aliases: ['bengaluru', 'blr', 'bangalore'] },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, has_airport: 1, nearest_hub: null, hub_distance_km: null, aliases: ['madras', 'maa'] },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, has_airport: 1, nearest_hub: null, hub_distance_km: null, aliases: ['calcutta', 'cal'] },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.385, lng: 78.4867, has_airport: 1, nearest_hub: null, hub_distance_km: null, aliases: ['hyd', 'hyderabad'] },
  { name: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673, has_airport: 1, nearest_hub: null, hub_distance_km: null, aliases: ['cochin', 'cok'] },
  { name: 'Manali', state: 'Himachal Pradesh', lat: 32.2432, lng: 77.1892, has_airport: 0, nearest_hub: 'Kullu (Bhuntar Airport)', hub_distance_km: 50, aliases: ['manali'] },
  { name: 'Shimla', state: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734, has_airport: 0, nearest_hub: 'Chandigarh Airport', hub_distance_km: 90, aliases: ['simla'] },
  { name: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lng: 73.7125, has_airport: 1, nearest_hub: null, hub_distance_km: null, aliases: ['udaipur'] },
  { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739, has_airport: 1, nearest_hub: null, hub_distance_km: null, aliases: ['banaras', 'kashi', 'bns'] },
  { name: 'Rishikesh', state: 'Uttarakhand', lat: 30.0869, lng: 78.2676, has_airport: 0, nearest_hub: 'Dehradun (Jolly Grant Airport)', hub_distance_km: 35, aliases: ['rishikesh'] },
  { name: 'Etawah', state: 'Uttar Pradesh', lat: 26.776, lng: 79.023, has_airport: 0, nearest_hub: 'Kanpur Airport', hub_distance_km: 140, aliases: ['etawah', 'ethwha', 'etwa'] },
  { name: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319, has_airport: 1, nearest_hub: null, hub_distance_km: null, aliases: ['kanpur', 'cawnpore'] },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, has_airport: 1, nearest_hub: null, hub_distance_km: null, aliases: ['pune', 'pnq'] },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, has_airport: 1, nearest_hub: null, hub_distance_km: null, aliases: ['amd', 'ahmedabad'] },
  { name: 'Srinagar', state: 'Jammu and Kashmir', lat: 34.0837, lng: 74.7973, has_airport: 1, nearest_hub: null, hub_distance_km: null, aliases: ['srinagar', 'srg'] },
  { name: 'Darjeeling', state: 'West Bengal', lat: 27.036, lng: 88.2627, has_airport: 0, nearest_hub: 'Bagdogra Airport', hub_distance_km: 80, aliases: ['darjeeling'] },
  { name: 'Ooty', state: 'Tamil Nadu', lat: 11.4102, lng: 76.695, has_airport: 0, nearest_hub: 'Coimbatore Airport', hub_distance_km: 80, aliases: ['ooty', 'udagamandalam'] }
];

export const destinationSeeds = [
  { city: 'Mumbai', description: 'India’s financial capital with a fast-paced seafront vibe.', best_season: 'Nov-Feb', safety_score: 8, airport_code: 'BOM', airport_name: 'Chhatrapati Shivaji Maharaj Intl' },
  { city: 'Delhi', description: 'Heritage capital blending Mughal lanes and modern boulevards.', best_season: 'Oct-Mar', safety_score: 7, airport_code: 'DEL', airport_name: 'Indira Gandhi International' },
  { city: 'Goa', description: 'Beaches, shacks, and sunsets with a Portuguese soul.', best_season: 'Nov-Feb', safety_score: 8, airport_code: 'GOX', airport_name: 'Manohar International' },
  { city: 'Jaipur', description: 'Pink City forts, bazaars, and royal cuisine.', best_season: 'Oct-Mar', safety_score: 8, airport_code: 'JAI', airport_name: 'Jaipur International' },
  { city: 'Bangalore', description: 'Garden city with cafes, tech hubs, and cool evenings.', best_season: 'Aug-Feb', safety_score: 9, airport_code: 'BLR', airport_name: 'Kempegowda International' },
  { city: 'Chennai', description: 'Marina beach, filter coffee, Carnatic music, and temples.', best_season: 'Dec-Feb', safety_score: 8, airport_code: 'MAA', airport_name: 'Chennai International' },
  { city: 'Kolkata', description: 'Culture capital with trams, mishti doi, and colonial charm.', best_season: 'Nov-Feb', safety_score: 8, airport_code: 'CCU', airport_name: 'Netaji Subhash Chandra Bose Intl' },
  { city: 'Hyderabad', description: 'Hyderabadi biryani, bazaars, and the emerging tech corridor.', best_season: 'Nov-Feb', safety_score: 8, airport_code: 'HYD', airport_name: 'Rajiv Gandhi International' },
  { city: 'Kochi', description: 'Backwaters, Chinese fishing nets, and spice markets.', best_season: 'Sep-Mar', safety_score: 9, airport_code: 'COK', airport_name: 'Cochin International' },
  { city: 'Manali', description: 'Himalayan resort town for snowscapes and treks.', best_season: 'Oct-Mar', safety_score: 8, airport_code: 'KUU', airport_name: 'Kullu (Bhuntar Airport)' },
  { city: 'Shimla', description: 'Colonial hill town with mall roads and pine forests.', best_season: 'Oct-Apr', safety_score: 8, airport_code: 'IXC', airport_name: 'Chandigarh Airport' },
  { city: 'Udaipur', description: 'Lake city palaces and old-town ghats.', best_season: 'Oct-Mar', safety_score: 9, airport_code: 'UDR', airport_name: 'Maharana Pratap Airport' },
  { city: 'Varanasi', description: 'Ghats, aartis, and timeless lanes on the Ganga.', best_season: 'Oct-Mar', safety_score: 7, airport_code: 'VNS', airport_name: 'Lal Bahadur Shastri Airport' },
  { city: 'Rishikesh', description: 'Yoga capital on the Ganga with rapids and bridges.', best_season: 'Sep-Apr', safety_score: 9, airport_code: 'DED', airport_name: 'Jolly Grant Airport, Dehradun' },
  { city: 'Etawah', description: 'Ganga ravines, safari park, and Chambal river vibes.', best_season: 'Nov-Feb', safety_score: 7, airport_code: 'KNU', airport_name: 'Kanpur Airport' },
  { city: 'Kanpur', description: 'Industrial city with leather hubs and Ganga ghats.', best_season: 'Nov-Feb', safety_score: 7, airport_code: 'KNU', airport_name: 'Kanpur Airport' },
  { city: 'Pune', description: 'Student city with forts, cafes, and Sahyadri getaways.', best_season: 'Jul-Mar', safety_score: 9, airport_code: 'PNQ', airport_name: 'Pune International' },
  { city: 'Ahmedabad', description: 'Sabarmati, pols, and thriving food lanes.', best_season: 'Nov-Feb', safety_score: 9, airport_code: 'AMD', airport_name: 'Sardar Vallabhbhai Patel Intl' },
  { city: 'Srinagar', description: 'Dal Lake shikaras, gardens, and Himalayan air.', best_season: 'Apr-Oct', safety_score: 8, airport_code: 'SXR', airport_name: 'Sheikh ul-Alam International' },
  { city: 'Darjeeling', description: 'Tea gardens, toy train, and Kanchenjunga views.', best_season: 'Oct-Apr', safety_score: 9, airport_code: 'IXB', airport_name: 'Bagdogra Airport' },
  { city: 'Ooty', description: 'Nilgiri hill station with gardens and toy train rides.', best_season: 'Sep-May', safety_score: 9, airport_code: 'CJB', airport_name: 'Coimbatore Airport' }
];

const flights = [];

function addFlightPair(from, to, variants) {
  variants.forEach((v, idx) => {
    const suffix = String(idx + 1).padStart(2, '0');
    flights.push({ ...v, from_city: from, to_city: to, flight_number: v.flight_number || `${v.airline.slice(0, 2).toUpperCase()}${Math.floor(Math.random() * 800) + idx + 100}` });
    flights.push({ ...v, from_city: to, to_city: from, flight_number: v.flight_number ? `${v.flight_number}R` : `${v.airline.slice(0, 2).toUpperCase()}${Math.floor(Math.random() * 800) + idx + 400}` });
  });
}

function addDirect(from, to, variants) {
  const list = Array.isArray(variants) ? variants : [variants];
  list.forEach((v) => flights.push({ ...v, from_city: from, to_city: to, flight_number: v.flight_number || `${v.airline.slice(0, 2).toUpperCase()}${Math.floor(Math.random() * 8000)}` }));
}

function titleCase(str) {
  return str
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

// Major trunk routes (multiple options)
addFlightPair('Delhi', 'Mumbai', [
  { airline: 'IndiGo', departure_time: '06:25', arrival_time: '08:45', duration_mins: 140, economy_price: 5200, business_price: 15400, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 },
  { airline: 'Air India', departure_time: '09:10', arrival_time: '11:30', duration_mins: 140, economy_price: 6100, business_price: 18100, stops: 0, baggage_checkin_kg: 20, is_refundable: 1 },
  { airline: 'SpiceJet', departure_time: '18:15', arrival_time: '20:45', duration_mins: 150, economy_price: 4800, business_price: 13200, stops: 0, baggage_checkin_kg: 15, is_refundable: 0 }
]);

addFlightPair('Delhi', 'Bangalore', [
  { airline: 'Vistara', departure_time: '07:05', arrival_time: '09:55', duration_mins: 170, economy_price: 6400, business_price: 19300, stops: 0, baggage_checkin_kg: 20, is_refundable: 1 },
  { airline: 'IndiGo', departure_time: '15:10', arrival_time: '17:55', duration_mins: 165, economy_price: 5800, business_price: 16900, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 },
  { airline: 'Akasa Air', departure_time: '21:00', arrival_time: '23:55', duration_mins: 175, economy_price: 5200, business_price: 14500, stops: 0, baggage_checkin_kg: 15, is_refundable: 0 }
]);

addFlightPair('Delhi', 'Chennai', [
  { airline: 'Air India', departure_time: '06:40', arrival_time: '09:35', duration_mins: 175, economy_price: 6600, business_price: 18800, stops: 0, baggage_checkin_kg: 20, is_refundable: 1 },
  { airline: 'SpiceJet', departure_time: '16:20', arrival_time: '19:20', duration_mins: 180, economy_price: 5900, business_price: 16000, stops: 0, baggage_checkin_kg: 15, is_refundable: 0 }
]);

addFlightPair('Delhi', 'Hyderabad', [
  { airline: 'IndiGo', departure_time: '08:00', arrival_time: '10:20', duration_mins: 140, economy_price: 5400, business_price: 15800, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 },
  { airline: 'Vistara', departure_time: '19:15', arrival_time: '21:40', duration_mins: 145, economy_price: 6200, business_price: 17700, stops: 0, baggage_checkin_kg: 20, is_refundable: 1 }
]);

addFlightPair('Delhi', 'Goa', [
  { airline: 'IndiGo', departure_time: '05:50', arrival_time: '08:20', duration_mins: 150, economy_price: 5600, business_price: 16200, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 },
  { airline: 'SpiceJet', departure_time: '13:20', arrival_time: '15:55', duration_mins: 155, economy_price: 5200, business_price: 15000, stops: 0, baggage_checkin_kg: 15, is_refundable: 0 }
]);

addFlightPair('Mumbai', 'Bangalore', [
  { airline: 'Vistara', departure_time: '07:30', arrival_time: '09:00', duration_mins: 90, economy_price: 4200, business_price: 13200, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 },
  { airline: 'IndiGo', departure_time: '12:15', arrival_time: '13:50', duration_mins: 95, economy_price: 3900, business_price: 11800, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 },
  { airline: 'Akasa Air', departure_time: '20:00', arrival_time: '21:35', duration_mins: 95, economy_price: 3600, business_price: 11200, stops: 0, baggage_checkin_kg: 15, is_refundable: 0 }
]);

addFlightPair('Mumbai', 'Chennai', [
  { airline: 'IndiGo', departure_time: '06:10', arrival_time: '07:55', duration_mins: 105, economy_price: 4100, business_price: 12100, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 },
  { airline: 'Air India', departure_time: '18:20', arrival_time: '20:05', duration_mins: 105, economy_price: 4600, business_price: 13900, stops: 0, baggage_checkin_kg: 20, is_refundable: 1 }
]);

addFlightPair('Mumbai', 'Hyderabad', [
  { airline: 'SpiceJet', departure_time: '09:00', arrival_time: '10:25', duration_mins: 85, economy_price: 3700, business_price: 11000, stops: 0, baggage_checkin_kg: 15, is_refundable: 0 },
  { airline: 'IndiGo', departure_time: '17:10', arrival_time: '18:30', duration_mins: 80, economy_price: 4000, business_price: 12200, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 }
]);

addFlightPair('Mumbai', 'Kolkata', [
  { airline: 'Vistara', departure_time: '07:45', arrival_time: '10:30', duration_mins: 165, economy_price: 5600, business_price: 16600, stops: 0, baggage_checkin_kg: 20, is_refundable: 1 },
  { airline: 'IndiGo', departure_time: '15:00', arrival_time: '17:40', duration_mins: 160, economy_price: 5200, business_price: 15000, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 }
]);

addFlightPair('Mumbai', 'Jaipur', [
  { airline: 'SpiceJet', departure_time: '06:35', arrival_time: '08:15', duration_mins: 100, economy_price: 3800, business_price: 11200, stops: 0, baggage_checkin_kg: 15, is_refundable: 0 },
  { airline: 'Air India', departure_time: '19:45', arrival_time: '21:30', duration_mins: 105, economy_price: 4300, business_price: 13000, stops: 0, baggage_checkin_kg: 20, is_refundable: 1 }
]);

addFlightPair('Bangalore', 'Hyderabad', [
  { airline: 'IndiGo', departure_time: '08:25', arrival_time: '09:40', duration_mins: 75, economy_price: 3300, business_price: 10100, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 },
  { airline: 'SpiceJet', departure_time: '18:10', arrival_time: '19:30', duration_mins: 80, economy_price: 3200, business_price: 9600, stops: 0, baggage_checkin_kg: 15, is_refundable: 0 }
]);

addFlightPair('Bangalore', 'Chennai', [
  { airline: 'IndiGo', departure_time: '06:50', arrival_time: '07:45', duration_mins: 55, economy_price: 2600, business_price: 8800, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 },
  { airline: 'Akasa Air', departure_time: '20:10', arrival_time: '21:10', duration_mins: 60, economy_price: 2500, business_price: 8200, stops: 0, baggage_checkin_kg: 15, is_refundable: 0 }
]);

addFlightPair('Bangalore', 'Kolkata', [
  { airline: 'Vistara', departure_time: '07:00', arrival_time: '09:40', duration_mins: 160, economy_price: 5200, business_price: 15200, stops: 0, baggage_checkin_kg: 20, is_refundable: 1 },
  { airline: 'IndiGo', departure_time: '14:30', arrival_time: '17:10', duration_mins: 160, economy_price: 4900, business_price: 14600, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 }
]);

addFlightPair('Chennai', 'Kolkata', [
  { airline: 'IndiGo', departure_time: '05:55', arrival_time: '08:30', duration_mins: 155, economy_price: 4800, business_price: 14000, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 },
  { airline: 'SpiceJet', departure_time: '16:10', arrival_time: '18:45', duration_mins: 155, economy_price: 4500, business_price: 13200, stops: 0, baggage_checkin_kg: 15, is_refundable: 0 }
]);

addFlightPair('Chennai', 'Hyderabad', [
  { airline: 'IndiGo', departure_time: '08:45', arrival_time: '10:00', duration_mins: 75, economy_price: 3100, business_price: 9800, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 },
  { airline: 'Air India', departure_time: '19:20', arrival_time: '20:30', duration_mins: 70, economy_price: 3400, business_price: 10800, stops: 0, baggage_checkin_kg: 20, is_refundable: 1 }
]);

addFlightPair('Hyderabad', 'Kolkata', [
  { airline: 'IndiGo', departure_time: '06:30', arrival_time: '08:40', duration_mins: 130, economy_price: 4300, business_price: 12600, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 },
  { airline: 'SpiceJet', departure_time: '18:25', arrival_time: '20:45', duration_mins: 140, economy_price: 4100, business_price: 12000, stops: 0, baggage_checkin_kg: 15, is_refundable: 0 }
]);

addFlightPair('Ahmedabad', 'Delhi', [
  { airline: 'IndiGo', departure_time: '07:40', arrival_time: '09:00', duration_mins: 80, economy_price: 3200, business_price: 9800, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 },
  { airline: 'Air India', departure_time: '18:00', arrival_time: '19:20', duration_mins: 80, economy_price: 3600, business_price: 11000, stops: 0, baggage_checkin_kg: 20, is_refundable: 1 }
]);

addFlightPair('Ahmedabad', 'Mumbai', [
  { airline: 'IndiGo', departure_time: '06:35', arrival_time: '07:35', duration_mins: 60, economy_price: 2500, business_price: 7600, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 },
  { airline: 'Akasa Air', departure_time: '20:25', arrival_time: '21:30', duration_mins: 65, economy_price: 2400, business_price: 7300, stops: 0, baggage_checkin_kg: 15, is_refundable: 0 }
]);

addFlightPair('Pune', 'Delhi', [
  { airline: 'Vistara', departure_time: '06:10', arrival_time: '08:05', duration_mins: 115, economy_price: 4300, business_price: 12500, stops: 0, baggage_checkin_kg: 20, is_refundable: 1 },
  { airline: 'IndiGo', departure_time: '19:00', arrival_time: '20:55', duration_mins: 115, economy_price: 3900, business_price: 11800, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 }
]);

addFlightPair('Pune', 'Bangalore', [
  { airline: 'IndiGo', departure_time: '07:30', arrival_time: '08:35', duration_mins: 65, economy_price: 2300, business_price: 7500, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 },
  { airline: 'SpiceJet', departure_time: '21:00', arrival_time: '22:10', duration_mins: 70, economy_price: 2200, business_price: 7100, stops: 0, baggage_checkin_kg: 15, is_refundable: 0 }
]);

addFlightPair('Varanasi', 'Delhi', [
  { airline: 'IndiGo', departure_time: '06:05', arrival_time: '07:30', duration_mins: 85, economy_price: 3000, business_price: 9200, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 },
  { airline: 'Air India', departure_time: '18:25', arrival_time: '19:50', duration_mins: 85, economy_price: 3400, business_price: 10200, stops: 0, baggage_checkin_kg: 20, is_refundable: 1 }
]);

addFlightPair('Srinagar', 'Delhi', [
  { airline: 'Vistara', departure_time: '07:15', arrival_time: '08:35', duration_mins: 80, economy_price: 4100, business_price: 12200, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 },
  { airline: 'IndiGo', departure_time: '16:10', arrival_time: '17:35', duration_mins: 85, economy_price: 3800, business_price: 11400, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 }
]);

addFlightPair('Kochi', 'Bangalore', [
  { airline: 'IndiGo', departure_time: '06:20', arrival_time: '07:20', duration_mins: 60, economy_price: 2400, business_price: 7600, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 },
  { airline: 'Akasa Air', departure_time: '20:05', arrival_time: '21:15', duration_mins: 70, economy_price: 2200, business_price: 7200, stops: 0, baggage_checkin_kg: 15, is_refundable: 0 }
]);

addFlightPair('Kochi', 'Chennai', [
  { airline: 'IndiGo', departure_time: '09:00', arrival_time: '10:10', duration_mins: 70, economy_price: 2500, business_price: 7700, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 }
]);

addFlightPair('Kochi', 'Hyderabad', [
  { airline: 'SpiceJet', departure_time: '07:30', arrival_time: '09:10', duration_mins: 100, economy_price: 3400, business_price: 9600, stops: 0, baggage_checkin_kg: 15, is_refundable: 0 }
]);

addFlightPair('Goa', 'Bangalore', [
  { airline: 'IndiGo', departure_time: '08:05', arrival_time: '09:15', duration_mins: 70, economy_price: 2600, business_price: 7800, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 },
  { airline: 'Akasa Air', departure_time: '20:10', arrival_time: '21:25', duration_mins: 75, economy_price: 2400, business_price: 7400, stops: 0, baggage_checkin_kg: 15, is_refundable: 0 }
]);

addFlightPair('Goa', 'Hyderabad', [
  { airline: 'SpiceJet', departure_time: '14:00', arrival_time: '15:30', duration_mins: 90, economy_price: 2900, business_price: 8900, stops: 0, baggage_checkin_kg: 15, is_refundable: 0 }
]);

addFlightPair('Jaipur', 'Kolkata', [
  { airline: 'IndiGo', departure_time: '10:10', arrival_time: '12:40', duration_mins: 150, economy_price: 4200, business_price: 12400, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 }
]);

addFlightPair('Udaipur', 'Mumbai', [
  { airline: 'Vistara', departure_time: '07:10', arrival_time: '08:15', duration_mins: 65, economy_price: 3300, business_price: 10200, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 }
]);

addFlightPair('Kanpur', 'Delhi', [
  { airline: 'IndiGo', departure_time: '09:20', arrival_time: '10:20', duration_mins: 60, economy_price: 2600, business_price: 8200, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 }
]);

addFlightPair('Kanpur', 'Mumbai', [
  { airline: 'SpiceJet', departure_time: '17:20', arrival_time: '19:10', duration_mins: 110, economy_price: 4200, business_price: 12200, stops: 0, baggage_checkin_kg: 15, is_refundable: 0 }
]);

// Hill station access via nearest hubs (note required)
const hillNote = 'Nearest airport — onward cab required';

// Manali via Kullu (Bhuntar)
['Delhi', 'Mumbai', 'Bangalore', 'Chandigarh', 'Jaipur'].forEach((origin, idx) => {
  addDirect(origin, 'Kullu (Bhuntar)', {
    airline: idx % 2 === 0 ? 'IndiGo' : 'SpiceJet',
    departure_time: `${6 + idx}:10`,
    arrival_time: `${8 + idx}:00`,
    duration_mins: 110 + idx * 5,
    economy_price: 5200 + idx * 400,
    business_price: 13800 + idx * 600,
    stops: idx === 2 ? 1 : 0,
    baggage_checkin_kg: 15,
    is_refundable: 1,
    note: hillNote
  });
});

// Shimla via Chandigarh
['Delhi', 'Mumbai', 'Hyderabad', 'Bangalore'].forEach((origin, idx) => {
  addDirect(origin, 'Chandigarh', {
    airline: idx % 2 === 0 ? 'Vistara' : 'IndiGo',
    departure_time: `${7 + idx}:05`,
    arrival_time: `${8 + idx}:15`,
    duration_mins: 70 + idx * 10,
    economy_price: 3200 + idx * 500,
    business_price: 9800 + idx * 800,
    stops: 0,
    baggage_checkin_kg: 15,
    is_refundable: 1,
    note: hillNote
  });
});

// Rishikesh via Dehradun
['Delhi', 'Mumbai', 'Bangalore'].forEach((origin, idx) => {
  addDirect(origin, 'Dehradun', {
    airline: idx === 0 ? 'IndiGo' : 'SpiceJet',
    departure_time: `${8 + idx}:25`,
    arrival_time: `${9 + idx}:35`,
    duration_mins: 70 + idx * 15,
    economy_price: 3000 + idx * 600,
    business_price: 9400 + idx * 900,
    stops: 0,
    baggage_checkin_kg: 15,
    is_refundable: 1,
    note: hillNote
  });
});

// Darjeeling via Bagdogra
['Delhi', 'Kolkata', 'Mumbai'].forEach((origin, idx) => {
  addDirect(origin, 'Bagdogra', {
    airline: idx === 1 ? 'Air India' : 'IndiGo',
    departure_time: `${9 + idx}:15`,
    arrival_time: `${11 + idx}:00`,
    duration_mins: 105 + idx * 15,
    economy_price: 4200 + idx * 500,
    business_price: 12600 + idx * 800,
    stops: 0,
    baggage_checkin_kg: 15,
    is_refundable: 1,
    note: hillNote
  });
});

// Ooty via Coimbatore
['Chennai', 'Bangalore', 'Mumbai'].forEach((origin, idx) => {
  addDirect(origin, 'Coimbatore', {
    airline: idx === 2 ? 'SpiceJet' : 'IndiGo',
    departure_time: `${7 + idx}:40`,
    arrival_time: `${8 + idx}:55`,
    duration_mins: 75 + idx * 10,
    economy_price: 2800 + idx * 400,
    business_price: 9200 + idx * 700,
    stops: 0,
    baggage_checkin_kg: 15,
    is_refundable: 1,
    note: hillNote
  });
});

// Extra routes to exceed 80 and cover more cities
addFlightPair('Delhi', 'Ahmedabad', [
  { airline: 'SpiceJet', departure_time: '13:00', arrival_time: '14:25', duration_mins: 85, economy_price: 3100, business_price: 10100, stops: 0, baggage_checkin_kg: 15, is_refundable: 0 }
]);

addFlightPair('Hyderabad', 'Pune', [
  { airline: 'IndiGo', departure_time: '06:35', arrival_time: '07:45', duration_mins: 70, economy_price: 2400, business_price: 7800, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 },
  { airline: 'SpiceJet', departure_time: '19:30', arrival_time: '20:45', duration_mins: 75, economy_price: 2300, business_price: 7600, stops: 0, baggage_checkin_kg: 15, is_refundable: 0 }
]);

addFlightPair('Kolkata', 'Goa', [
  { airline: 'IndiGo', departure_time: '05:50', arrival_time: '08:50', duration_mins: 180, economy_price: 6200, business_price: 17500, stops: 1, baggage_checkin_kg: 15, is_refundable: 1 }
]);

addFlightPair('Jaipur', 'Pune', [
  { airline: 'Vistara', departure_time: '10:20', arrival_time: '12:00', duration_mins: 100, economy_price: 3500, business_price: 11200, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 }
]);

addFlightPair('Ahmedabad', 'Hyderabad', [
  { airline: 'Akasa Air', departure_time: '07:10', arrival_time: '08:40', duration_mins: 90, economy_price: 3200, business_price: 10400, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 }
]);

addFlightPair('Pune', 'Hyderabad', [
  { airline: 'IndiGo', departure_time: '11:10', arrival_time: '12:15', duration_mins: 65, economy_price: 2300, business_price: 7900, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 }
]);

addFlightPair('Varanasi', 'Mumbai', [
  { airline: 'Air India', departure_time: '06:20', arrival_time: '08:50', duration_mins: 150, economy_price: 5200, business_price: 15000, stops: 0, baggage_checkin_kg: 20, is_refundable: 1 }
]);

addFlightPair('Srinagar', 'Mumbai', [
  { airline: 'Vistara', departure_time: '10:30', arrival_time: '13:05', duration_mins: 155, economy_price: 6200, business_price: 18400, stops: 0, baggage_checkin_kg: 15, is_refundable: 1 }
]);

export const flightSeeds = flights;

const hotelTiers = {
  budget: { price: 1800, rating: 3.6, distance: 3.2 },
  mid: { price: 3200, rating: 4.1, distance: 2.4 },
  luxury: { price: 7800, rating: 4.7, distance: 1.2 }
};

export const hotelSeeds = citySeeds.flatMap(city => {
  const base = city.name;
  const entries = [
    { tier: 'budget', name: `${base} Budget Inn`, price: hotelTiers.budget.price, rating: hotelTiers.budget.rating, distance: hotelTiers.budget.distance, amenities: ['WiFi', 'Breakfast', 'AC'] },
    { tier: 'budget', name: `${base} Travelers Hub`, price: hotelTiers.budget.price + 400, rating: hotelTiers.budget.rating + 0.1, distance: hotelTiers.budget.distance + 0.4, amenities: ['WiFi', 'AC'] },
    { tier: 'mid', name: `${base} Midtown Comfort`, price: hotelTiers.mid.price, rating: hotelTiers.mid.rating, distance: hotelTiers.mid.distance, amenities: ['WiFi', 'Breakfast', 'Gym'] },
    { tier: 'mid', name: `${base} Courtyard`, price: hotelTiers.mid.price + 500, rating: hotelTiers.mid.rating + 0.2, distance: hotelTiers.mid.distance + 0.3, amenities: ['WiFi', 'Breakfast', 'Pool'] },
    { tier: 'luxury', name: `${base} Grand Palace`, price: hotelTiers.luxury.price + (city.has_airport ? 600 : 0), rating: hotelTiers.luxury.rating, distance: hotelTiers.luxury.distance, amenities: ['WiFi', 'Pool', 'Spa', 'Valet'] }
  ];

  return entries.map((h, idx) => ({
    city: city.name,
    name: h.name,
    tier: h.tier,
    price_per_night: h.price + idx * 120,
    rating: Math.min(5, h.rating + idx * 0.05),
    amenities: h.amenities,
    distance_from_center_km: +(h.distance + idx * 0.2).toFixed(2)
  }));
});

const poiTypes = ['monument', 'temple', 'restaurant', 'market', 'nature', 'viewpoint'];
export const poiSeeds = citySeeds.flatMap((city, idx) => {
  return poiTypes.slice(0, 5).map((type, tIdx) => {
    const offset = 0.01 + tIdx * 0.004 + idx * 0.0001;
    const lat = +(city.lat + ((tIdx % 2 === 0 ? 1 : -1) * offset)).toFixed(5);
    const lng = +(city.lng + ((tIdx % 3 === 0 ? -1 : 1) * offset)).toFixed(5);
    return {
      city: city.name,
      name: `${city.name} ${titleCase(type)} ${tIdx + 1}`,
      type,
      entry_fee: type === 'nature' || type === 'viewpoint' ? 'Free' : `₹${50 + tIdx * 20}`,
      hours: '9am - 7pm',
      description: `${titleCase(type)} spot in ${city.name}.`,
      lat,
      lng
    };
  });
});

export const transportSeeds = [
  { from_city: 'Delhi', to_city: 'Jaipur', mode: 'train', operator: 'Shatabdi', vehicle_type: 'Chair Car', departure_time: '06:05', arrival_time: '10:40', duration_mins: 275, price: 1050, booking_url: 'https://www.irctc.co.in/nget/train-search', train_number: '12015', boarding_point: 'NDLS' },
  { from_city: 'Delhi', to_city: 'Jaipur', mode: 'bus', operator: 'RSRTC', vehicle_type: 'Volvo', departure_time: '08:00', arrival_time: '13:15', duration_mins: 315, price: 850, booking_url: 'https://www.redbus.in/bus-tickets/delhi-to-jaipur', train_number: null, boarding_point: 'Kashmiri Gate' },
  { from_city: 'Delhi', to_city: 'Jaipur', mode: 'cab', operator: 'Intercity', vehicle_type: 'Sedan', departure_time: '09:00', arrival_time: '13:00', duration_mins: 240, price: 4800, booking_url: 'https://www.uber.com/in', train_number: null, boarding_point: 'Home Pickup' },

  { from_city: 'Mumbai', to_city: 'Goa', mode: 'train', operator: 'Konkan Kanya', vehicle_type: 'Sleeper', departure_time: '23:00', arrival_time: '10:30', duration_mins: 690, price: 1450, booking_url: 'https://www.irctc.co.in/nget/train-search', train_number: '20111', boarding_point: 'CSMT' },
  { from_city: 'Mumbai', to_city: 'Goa', mode: 'bus', operator: 'VRL', vehicle_type: 'Sleeper AC', departure_time: '20:30', arrival_time: '08:15', duration_mins: 705, price: 1700, booking_url: 'https://www.redbus.in/bus-tickets/mumbai-to-goa', train_number: null, boarding_point: 'Bandra' },
  { from_city: 'Mumbai', to_city: 'Goa', mode: 'cab', operator: 'Intercity', vehicle_type: 'SUV', departure_time: '07:00', arrival_time: '18:00', duration_mins: 660, price: 9000, booking_url: 'https://www.olacabs.com', train_number: null, boarding_point: 'Home Pickup' },

  { from_city: 'Bangalore', to_city: 'Chennai', mode: 'train', operator: 'Shatabdi', vehicle_type: 'Chair Car', departure_time: '06:00', arrival_time: '10:45', duration_mins: 285, price: 1200, booking_url: 'https://www.irctc.co.in/nget/train-search', train_number: '12007', boarding_point: 'SBC' },
  { from_city: 'Bangalore', to_city: 'Chennai', mode: 'bus', operator: 'KPN', vehicle_type: 'Volvo', departure_time: '23:00', arrival_time: '06:00', duration_mins: 420, price: 950, booking_url: 'https://www.redbus.in/bus-tickets/bangalore-to-chennai', train_number: null, boarding_point: 'Silk Board' },
  { from_city: 'Bangalore', to_city: 'Chennai', mode: 'cab', operator: 'Intercity', vehicle_type: 'Sedan', departure_time: '07:00', arrival_time: '12:30', duration_mins: 330, price: 7200, booking_url: 'https://www.olacabs.com', train_number: null, boarding_point: 'Home Pickup' },

  { from_city: 'Delhi', to_city: 'Manali', mode: 'bus', operator: 'HPTDC', vehicle_type: 'Volvo', departure_time: '18:00', arrival_time: '07:00', duration_mins: 780, price: 1700, booking_url: 'https://www.redbus.in/bus-tickets/delhi-to-manali', train_number: null, boarding_point: 'ISBT Kashmiri Gate' },
  { from_city: 'Delhi', to_city: 'Manali', mode: 'cab', operator: 'Himalayan Cabs', vehicle_type: 'SUV', departure_time: '07:00', arrival_time: '18:00', duration_mins: 660, price: 9600, booking_url: 'https://www.olacabs.com', train_number: null, boarding_point: 'Home Pickup' },

  { from_city: 'Kolkata', to_city: 'Darjeeling', mode: 'train', operator: 'Padatik Express', vehicle_type: 'Sleeper', departure_time: '23:20', arrival_time: '08:10', duration_mins: 530, price: 1450, booking_url: 'https://www.irctc.co.in/nget/train-search', train_number: '12377', boarding_point: 'SDAH' },
  { from_city: 'Kolkata', to_city: 'Darjeeling', mode: 'bus', operator: 'NBSTC', vehicle_type: 'Volvo', departure_time: '20:30', arrival_time: '07:00', duration_mins: 630, price: 1250, booking_url: 'https://www.redbus.in/bus-tickets/kolkata-to-darjeeling', train_number: null, boarding_point: 'Esplanade' },
  { from_city: 'Kolkata', to_city: 'Darjeeling', mode: 'cab', operator: 'Hills Ride', vehicle_type: 'SUV', departure_time: '06:00', arrival_time: '14:00', duration_mins: 480, price: 10500, booking_url: 'https://www.olacabs.com', train_number: null, boarding_point: 'Home Pickup' }
];

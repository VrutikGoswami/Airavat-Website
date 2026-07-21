/**
 * Curated airport reference for the flight finder's city/airport autocomplete.
 * Focused on the markets Airavat serves from Kenya (India, the Gulf, Asia,
 * Europe, Africa and the Indian Ocean) rather than an exhaustive world list.
 *
 * `search` matches on IATA code, city, airport name, country and common
 * aliases, and ranks exact/prefix hits first. Add rows as new routes open.
 */

export type Airport = {
  /** IATA code, e.g. "NBO". */
  code: string;
  city: string;
  name: string;
  country: string;
  /** Alternative spellings/old names people search by. */
  aliases?: string[];
};

export const airports: Airport[] = [
  // --- Kenya ---------------------------------------------------------------
  { code: "NBO", city: "Nairobi", name: "Jomo Kenyatta International", country: "Kenya" },
  { code: "WIL", city: "Nairobi", name: "Wilson (safari flights)", country: "Kenya" },
  { code: "MBA", city: "Mombasa", name: "Moi International", country: "Kenya" },
  { code: "UKA", city: "Ukunda", name: "Ukunda / Diani", country: "Kenya", aliases: ["diani"] },
  { code: "MYD", city: "Malindi", name: "Malindi", country: "Kenya" },
  { code: "KIS", city: "Kisumu", name: "Kisumu International", country: "Kenya" },
  { code: "EDL", city: "Eldoret", name: "Eldoret International", country: "Kenya" },

  // --- India ---------------------------------------------------------------
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj Intl", country: "India", aliases: ["bombay"] },
  { code: "DEL", city: "Delhi", name: "Indira Gandhi International", country: "India", aliases: ["new delhi"] },
  { code: "BLR", city: "Bengaluru", name: "Kempegowda International", country: "India", aliases: ["bangalore"] },
  { code: "MAA", city: "Chennai", name: "Chennai International", country: "India", aliases: ["madras"] },
  { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi International", country: "India" },
  { code: "CCU", city: "Kolkata", name: "Netaji Subhas Chandra Bose Intl", country: "India", aliases: ["calcutta"] },
  { code: "AMD", city: "Ahmedabad", name: "Sardar Vallabhbhai Patel Intl", country: "India" },
  { code: "COK", city: "Kochi", name: "Cochin International", country: "India", aliases: ["cochin"] },
  { code: "GOI", city: "Goa", name: "Dabolim", country: "India" },
  { code: "GOX", city: "Goa", name: "Manohar International (Mopa)", country: "India", aliases: ["mopa"] },
  { code: "PNQ", city: "Pune", name: "Pune", country: "India" },
  { code: "TRV", city: "Thiruvananthapuram", name: "Trivandrum International", country: "India", aliases: ["trivandrum"] },
  { code: "JAI", city: "Jaipur", name: "Jaipur International", country: "India" },
  { code: "ATQ", city: "Amritsar", name: "Sri Guru Ram Dass Jee Intl", country: "India" },
  { code: "IXC", city: "Chandigarh", name: "Chandigarh International", country: "India" },
  { code: "LKO", city: "Lucknow", name: "Chaudhary Charan Singh Intl", country: "India" },

  // --- Middle East ---------------------------------------------------------
  { code: "DXB", city: "Dubai", name: "Dubai International", country: "United Arab Emirates" },
  { code: "DWC", city: "Dubai", name: "Al Maktoum International", country: "United Arab Emirates" },
  { code: "AUH", city: "Abu Dhabi", name: "Zayed International", country: "United Arab Emirates" },
  { code: "SHJ", city: "Sharjah", name: "Sharjah International", country: "United Arab Emirates" },
  { code: "DOH", city: "Doha", name: "Hamad International", country: "Qatar" },
  { code: "BAH", city: "Manama", name: "Bahrain International", country: "Bahrain" },
  { code: "KWI", city: "Kuwait City", name: "Kuwait International", country: "Kuwait" },
  { code: "MCT", city: "Muscat", name: "Muscat International", country: "Oman" },
  { code: "JED", city: "Jeddah", name: "King Abdulaziz International", country: "Saudi Arabia" },
  { code: "RUH", city: "Riyadh", name: "King Khalid International", country: "Saudi Arabia" },
  { code: "DMM", city: "Dammam", name: "King Fahd International", country: "Saudi Arabia" },
  { code: "MED", city: "Medina", name: "Prince Mohammad Bin Abdulaziz", country: "Saudi Arabia", aliases: ["madinah"] },

  // --- Asia ----------------------------------------------------------------
  { code: "BKK", city: "Bangkok", name: "Suvarnabhumi", country: "Thailand" },
  { code: "DMK", city: "Bangkok", name: "Don Mueang International", country: "Thailand" },
  { code: "HKT", city: "Phuket", name: "Phuket International", country: "Thailand" },
  { code: "SIN", city: "Singapore", name: "Changi", country: "Singapore" },
  { code: "KUL", city: "Kuala Lumpur", name: "Kuala Lumpur International", country: "Malaysia" },
  { code: "HKG", city: "Hong Kong", name: "Hong Kong International", country: "Hong Kong" },
  { code: "CAN", city: "Guangzhou", name: "Baiyun International", country: "China" },
  { code: "PVG", city: "Shanghai", name: "Pudong International", country: "China" },
  { code: "PEK", city: "Beijing", name: "Capital International", country: "China", aliases: ["peking"] },
  { code: "ICN", city: "Seoul", name: "Incheon International", country: "South Korea" },
  { code: "NRT", city: "Tokyo", name: "Narita International", country: "Japan" },
  { code: "HND", city: "Tokyo", name: "Haneda", country: "Japan" },
  { code: "CMB", city: "Colombo", name: "Bandaranaike International", country: "Sri Lanka" },
  { code: "MLE", city: "Malé", name: "Velana International", country: "Maldives", aliases: ["maldives"] },
  { code: "KTM", city: "Kathmandu", name: "Tribhuvan International", country: "Nepal" },
  { code: "DAC", city: "Dhaka", name: "Hazrat Shahjalal International", country: "Bangladesh" },

  // --- Europe --------------------------------------------------------------
  { code: "LHR", city: "London", name: "Heathrow", country: "United Kingdom" },
  { code: "LGW", city: "London", name: "Gatwick", country: "United Kingdom" },
  { code: "MAN", city: "Manchester", name: "Manchester", country: "United Kingdom" },
  { code: "IST", city: "Istanbul", name: "Istanbul Airport", country: "Turkey" },
  { code: "SAW", city: "Istanbul", name: "Sabiha Gökçen", country: "Turkey" },
  { code: "CDG", city: "Paris", name: "Charles de Gaulle", country: "France" },
  { code: "AMS", city: "Amsterdam", name: "Schiphol", country: "Netherlands" },
  { code: "FRA", city: "Frankfurt", name: "Frankfurt", country: "Germany" },
  { code: "ZRH", city: "Zurich", name: "Zurich", country: "Switzerland" },
  { code: "FCO", city: "Rome", name: "Fiumicino", country: "Italy" },
  { code: "MAD", city: "Madrid", name: "Adolfo Suárez Barajas", country: "Spain" },

  // --- Africa --------------------------------------------------------------
  { code: "JNB", city: "Johannesburg", name: "O. R. Tambo International", country: "South Africa" },
  { code: "CPT", city: "Cape Town", name: "Cape Town International", country: "South Africa" },
  { code: "ADD", city: "Addis Ababa", name: "Bole International", country: "Ethiopia" },
  { code: "DAR", city: "Dar es Salaam", name: "Julius Nyerere International", country: "Tanzania" },
  { code: "JRO", city: "Kilimanjaro", name: "Kilimanjaro International", country: "Tanzania" },
  { code: "EBB", city: "Entebbe", name: "Entebbe International", country: "Uganda", aliases: ["kampala"] },
  { code: "KGL", city: "Kigali", name: "Kigali International", country: "Rwanda" },
  { code: "CAI", city: "Cairo", name: "Cairo International", country: "Egypt" },
  { code: "LOS", city: "Lagos", name: "Murtala Muhammed International", country: "Nigeria" },
  { code: "ACC", city: "Accra", name: "Kotoka International", country: "Ghana" },
  { code: "LUN", city: "Lusaka", name: "Kenneth Kaunda International", country: "Zambia" },
  { code: "HRE", city: "Harare", name: "Robert Gabriel Mugabe Intl", country: "Zimbabwe" },

  // --- Indian Ocean --------------------------------------------------------
  { code: "ZNZ", city: "Zanzibar", name: "Abeid Amani Karume International", country: "Tanzania" },
  { code: "MRU", city: "Mauritius", name: "Sir Seewoosagur Ramgoolam Intl", country: "Mauritius" },
  { code: "SEZ", city: "Mahé", name: "Seychelles International", country: "Seychelles", aliases: ["seychelles"] },
  { code: "TNR", city: "Antananarivo", name: "Ivato International", country: "Madagascar" },

  // --- North America (occasional) -----------------------------------------
  { code: "JFK", city: "New York", name: "John F. Kennedy International", country: "United States" },
  { code: "YYZ", city: "Toronto", name: "Pearson International", country: "Canada" },
];

/** Display label used as the field value once a suggestion is picked. */
export function airportLabel(a: Airport): string {
  return `${a.city} (${a.code})`;
}

function score(a: Airport, q: string): number {
  const code = a.code.toLowerCase();
  const city = a.city.toLowerCase();
  const name = a.name.toLowerCase();
  const country = a.country.toLowerCase();
  const aliases = a.aliases ?? [];

  if (code === q) return 100;
  if (code.startsWith(q)) return 92;
  if (city.startsWith(q)) return 84;
  if (aliases.some((al) => al.startsWith(q))) return 78;
  if (city.includes(q)) return 60;
  if (aliases.some((al) => al.includes(q))) return 52;
  if (name.includes(q)) return 44;
  if (country.startsWith(q)) return 40;
  if (country.includes(q)) return 30;
  return 0;
}

/** Ranked airport matches for a query. Empty query returns no rows. */
export function searchAirports(query: string, limit = 7): Airport[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return airports
    .map((a) => ({ a, s: score(a, q) }))
    .filter(({ s }) => s > 0)
    .sort((x, y) => y.s - x.s || x.a.city.localeCompare(y.a.city))
    .slice(0, limit)
    .map(({ a }) => a);
}

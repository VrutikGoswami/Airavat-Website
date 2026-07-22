export type PublicFlightLeg = {
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  durationMinutes: number;
  stops: number;
  flightNumbers: string[];
};

export type PublicFlightOffer = {
  id: string;
  airline: string;
  currency: string;
  total: number;
  cabin: string;
  baggage: string;
  meals: string;
  fareType: string;
  seatsRemaining?: number;
  legs: PublicFlightLeg[];
};

export type PublicFlightSearchResponse = {
  offers: PublicFlightOffer[];
  searchedAt: string;
};

import {EVENT_TYPES, DESTINATIONS, OFFERS_BY_TYPE} from './const.js';

let nextId = 1;

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePoint() {
  const type = getRandomItem(EVENT_TYPES);
  const destination = getRandomItem(DESTINATIONS);
  const allOffers = OFFERS_BY_TYPE[type];
  const offers = allOffers.slice(0, Math.floor(Math.random() * (allOffers.length + 1)));

  const dateFrom = new Date(2019, 2, 18 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  const dateTo = new Date(dateFrom.getTime() + Math.floor(Math.random() * 5 * 60 * 60 * 1000));

  return {
    id: nextId++,
    type,
    destinationId: destination.id,
    offers,
    dateFrom,
    dateTo,
    basePrice: Math.floor(Math.random() * 500) + 20,
    isFavorite: Math.random() > 0.5,
  };
}

export {generatePoint};

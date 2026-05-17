const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const DESTINATIONS = [
  {
    id: 1,
    name: 'Amsterdam',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
    pictures: [
      {src: 'https://loremflickr.com/248/152?random=1', description: 'Amsterdam'},
      {src: 'https://loremflickr.com/248/152?random=2', description: 'Amsterdam'},
    ],
  },
  {
    id: 2,
    name: 'Geneva',
    description: 'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
    pictures: [
      {src: 'https://loremflickr.com/248/152?random=3', description: 'Geneva'},
    ],
  },
  {
    id: 3,
    name: 'Chamonix',
    description: 'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris.',
    pictures: [
      {src: 'https://loremflickr.com/248/152?random=4', description: 'Chamonix'},
      {src: 'https://loremflickr.com/248/152?random=5', description: 'Chamonix'},
    ],
  },
];

const OFFERS_BY_TYPE = {
  flight: [
    {id: 1, title: 'Add luggage', price: 50},
    {id: 2, title: 'Switch to comfort', price: 80},
    {id: 3, title: 'Add meal', price: 15},
  ],
  taxi: [
    {id: 4, title: 'Order Uber', price: 20},
  ],
  bus: [],
  train: [
    {id: 5, title: 'Travel by train', price: 40},
  ],
  ship: [],
  drive: [
    {id: 6, title: 'Rent a car', price: 200},
  ],
  'check-in': [
    {id: 7, title: 'Add breakfast', price: 50},
  ],
  sightseeing: [
    {id: 8, title: 'Book tickets', price: 40},
    {id: 9, title: 'Lunch in city', price: 30},
  ],
  restaurant: [],
};

export {EVENT_TYPES, DESTINATIONS, OFFERS_BY_TYPE, FilterType};

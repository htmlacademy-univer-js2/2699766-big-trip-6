const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const DEFAULT_POINT = {
  type: 'flight',
  destinationId: null,
  offers: [],
  dateFrom: new Date(),
  dateTo: new Date(),
  basePrice: 0,
  isFavorite: false,
};

export {FilterType, SortType, UpdateType, UserAction, DEFAULT_POINT};

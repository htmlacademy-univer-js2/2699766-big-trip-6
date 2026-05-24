import {FilterType} from '../const.js';

const now = new Date();

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((p) => p.dateFrom > now),
  [FilterType.PRESENT]: (points) => points.filter((p) => p.dateFrom <= now && p.dateTo >= now),
  [FilterType.PAST]: (points) => points.filter((p) => p.dateTo < now),
};

export {filter};

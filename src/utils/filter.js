import {FilterType} from '../const.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((p) => p.dateFrom > new Date()),
  [FilterType.PRESENT]: (points) => points.filter((p) => p.dateFrom <= new Date() && p.dateTo >= new Date()),
  [FilterType.PAST]: (points) => points.filter((p) => p.dateTo < new Date()),
};

export {filter};

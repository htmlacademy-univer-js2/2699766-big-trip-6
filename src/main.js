import {render} from './render.js';
import FilterView from './view/filter.js';
import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points.js';
import {generatePoint} from './mock/point.js';
import {DESTINATIONS, OFFERS_BY_TYPE} from './mock/const.js';

const model = new PointsModel();
model.setPoints(Array.from({length: 4}, generatePoint));
model.setDestinations(DESTINATIONS);
model.setOffersByType(OFFERS_BY_TYPE);

const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

render(new FilterView(model.getPoints()), tripControlsFilters);

const tripPresenter = new TripPresenter(tripEvents, model);
tripPresenter.init();

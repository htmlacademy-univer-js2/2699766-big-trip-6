import {render} from './render.js';
import FilterView from './view/filter.js';
import TripPresenter from './presenter/trip.js';

const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

render(new FilterView(), tripControlsFilters);

const tripPresenter = new TripPresenter(tripEvents);
tripPresenter.init();

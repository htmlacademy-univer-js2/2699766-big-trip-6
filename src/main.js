import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import {generatePoint} from './mock/points.js';
import {DESTINATIONS, OFFERS_BY_TYPE} from './mock/const.js';

const pointsModel = new PointsModel();
pointsModel.setPoints(Array.from({length: 4}, generatePoint));
pointsModel.setDestinations(DESTINATIONS);
pointsModel.setOffersByType(OFFERS_BY_TYPE);

const filterModel = new FilterModel();

const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
const newEventBtn = document.querySelector('.trip-main__event-add-btn');

const tripPresenter = new TripPresenter(tripEvents, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(tripControlsFilters, filterModel, pointsModel);

filterPresenter.init();
tripPresenter.init();

newEventBtn.addEventListener('click', () => {
  newEventBtn.disabled = true;
  tripPresenter.createPoint(() => {
    newEventBtn.disabled = false;
  });
});

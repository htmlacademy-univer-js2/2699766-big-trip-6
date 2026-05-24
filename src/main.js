import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import BigTripApiService from './big-trip-api-service.js';

const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';
const AUTHORIZATION = 'Basic eo0w590ik29889a';

const apiService = new BigTripApiService(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel(apiService);
const filterModel = new FilterModel();

const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
const newEventBtn = document.querySelector('.trip-main__event-add-btn');

const tripPresenter = new TripPresenter(tripEvents, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(tripControlsFilters, filterModel, pointsModel);

filterPresenter.init();
tripPresenter.init();
pointsModel.init();

newEventBtn.addEventListener('click', () => {
  newEventBtn.disabled = true;
  tripPresenter.createPoint(() => {
    newEventBtn.disabled = false;
  });
});

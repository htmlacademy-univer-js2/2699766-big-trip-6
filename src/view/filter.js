import AbstractView from '../framework/view/abstract-view.js';

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const now = new Date();

const isPointFuture = (point) => point.dateFrom > now;
const isPointPresent = (point) => point.dateFrom <= now && point.dateTo >= now;
const isPointPast = (point) => point.dateTo < now;

export default class FilterView extends AbstractView {
  #points;

  constructor(points) {
    super();
    this.#points = points;
  }

  get template() {
    const filters = [
      {type: FilterType.EVERYTHING, label: 'Everything', isDisabled: this.#points.length === 0},
      {type: FilterType.FUTURE, label: 'Future', isDisabled: this.#points.filter(isPointFuture).length === 0},
      {type: FilterType.PRESENT, label: 'Present', isDisabled: this.#points.filter(isPointPresent).length === 0},
      {type: FilterType.PAST, label: 'Past', isDisabled: this.#points.filter(isPointPast).length === 0},
    ];

    return `
      <form class="trip-filters" action="#" method="get">
        ${filters.map(({type, label, isDisabled}) => `
          <div class="trip-filters__filter">
            <input id="filter-${type}" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="${type}" ${type === FilterType.EVERYTHING ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
            <label class="trip-filters__filter-label" for="filter-${type}">${label}</label>
          </div>`).join('')}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`;
  }
}

import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';
import {filter} from '../utils/filter.js';

export default class FilterView extends AbstractView {
  #points;
  #currentFilter;
  #onFilterChange;

  constructor(points, currentFilter, onFilterChange) {
    super();
    this.#points = points;
    this.#currentFilter = currentFilter;
    this.#onFilterChange = onFilterChange;

    this.element.addEventListener('change', (evt) => {
      this.#onFilterChange(evt.target.value);
    });
  }

  get template() {
    const filters = [
      {type: FilterType.EVERYTHING, label: 'Everything'},
      {type: FilterType.FUTURE, label: 'Future'},
      {type: FilterType.PRESENT, label: 'Present'},
      {type: FilterType.PAST, label: 'Past'},
    ];

    return `
      <form class="trip-filters" action="#" method="get">
        ${filters.map(({type, label}) => `
          <div class="trip-filters__filter">
            <input id="filter-${type}" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="${type}"
              ${type === this.#currentFilter ? 'checked' : ''}
              ${filter[type](this.#points).length === 0 ? 'disabled' : ''}>
            <label class="trip-filters__filter-label" for="filter-${type}">${label}</label>
          </div>`).join('')}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`;
  }
}

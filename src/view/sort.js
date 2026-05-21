import AbstractView from '../framework/view/abstract-view.js';

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export default class SortView extends AbstractView {
  #currentSort;
  #onSortChange;

  constructor(currentSort = SortType.DAY, onSortChange) {
    super();
    this.#currentSort = currentSort;
    this.#onSortChange = onSortChange;

    this.element.addEventListener('change', (evt) => {
      if (evt.target.dataset.sortType) {
        this.#onSortChange(evt.target.dataset.sortType);
      }
    });
  }

  get template() {
    return `
      <form class="trip-events__trip-sort trip-sort" action="#" method="get">
        <div class="trip-sort__item trip-sort__item--day">
          <input id="sort-day" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" data-sort-type="${SortType.DAY}" ${this.#currentSort === SortType.DAY ? 'checked' : ''}>
          <label class="trip-sort__btn" for="sort-day">Day</label>
        </div>
        <div class="trip-sort__item trip-sort__item--event">
          <input id="sort-event" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" disabled>
          <label class="trip-sort__btn" for="sort-event">Event</label>
        </div>
        <div class="trip-sort__item trip-sort__item--time">
          <input id="sort-time" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" data-sort-type="${SortType.TIME}" ${this.#currentSort === SortType.TIME ? 'checked' : ''}>
          <label class="trip-sort__btn" for="sort-time">Time</label>
        </div>
        <div class="trip-sort__item trip-sort__item--price">
          <input id="sort-price" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" data-sort-type="${SortType.PRICE}" ${this.#currentSort === SortType.PRICE ? 'checked' : ''}>
          <label class="trip-sort__btn" for="sort-price">Price</label>
        </div>
        <div class="trip-sort__item trip-sort__item--offer">
          <input id="sort-offer" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" disabled>
          <label class="trip-sort__btn" for="sort-offer">Offers</label>
        </div>
      </form>`;
  }
}

export {SortType};

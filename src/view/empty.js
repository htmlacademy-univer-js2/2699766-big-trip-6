import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const MESSAGE = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};

export default class EmptyView extends AbstractView {
  #filterType;

  constructor(filterType = FilterType.EVERYTHING) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return `<p class="trip-events__msg">${MESSAGE[this.#filterType]}</p>`;
  }
}

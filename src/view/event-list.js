import {createElement} from '../render.js';

export default class EventListView {
  getTemplate() {
    return '<ul class="trip-events__list"></ul>';

  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
}

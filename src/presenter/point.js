import {render, replace} from '../render.js';
import EventView from '../view/event.js';
import EventEditView from '../view/event-edit.js';

export default class PointPresenter {
  #container;
  #point;
  #destination;
  #offersByType;
  #destinations;
  #onDataChange;
  #onModeChange;

  #eventView = null;
  #eventEditView = null;

  constructor(container, point, destination, offersByType, destinations, onDataChange, onModeChange) {
    this.#container = container;
    this.#point = point;
    this.#destination = destination;
    this.#offersByType = offersByType;
    this.#destinations = destinations;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
  }

  init() {
    this.#eventView = new EventView(
      this.#point,
      this.#destination,
      () => {
        this.#onModeChange();
        this.#replacePointWithForm();
        document.addEventListener('keydown', this.#onEscKeydown);
      },
      () => {
        this.#onDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
      }
    );

    this.#eventEditView = new EventEditView(
      this.#point,
      this.#destination,
      this.#offersByType,
      this.#destinations,
      (evt) => {
        evt.preventDefault();
        this.#replaceFormWithPoint();
      },
      () => this.#replaceFormWithPoint()
    );

    render(this.#eventView, this.#container);
  }

  resetView() {
    if (this.#eventEditView.element.parentElement) {
      this.#replaceFormWithPoint();
    }
  }

  #replacePointWithForm() {
    replace(this.#eventEditView, this.#eventView);
  }

  #replaceFormWithPoint() {
    replace(this.#eventView, this.#eventEditView);
    document.removeEventListener('keydown', this.#onEscKeydown);
  }

  #onEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormWithPoint();
    }
  };
}

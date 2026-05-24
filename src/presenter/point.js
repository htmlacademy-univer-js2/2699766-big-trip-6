import {render, replace, remove} from '../render.js';
import EventView from '../view/event.js';
import EventEditView from '../view/event-edit.js';
import {UserAction, UpdateType} from '../const.js';

export default class PointPresenter {
  #container;
  #point;
  #destination;
  #offersByType;
  #destinations;
  #onUserAction;
  #onModeChange;
  #eventView = null;
  #eventEditView = null;

  constructor(container, point, destination, offersByType, destinations, onUserAction, onModeChange) {
    this.#container = container;
    this.#point = point;
    this.#destination = destination;
    this.#offersByType = offersByType;
    this.#destinations = destinations;
    this.#onUserAction = onUserAction;
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
        this.#onUserAction(
          UserAction.UPDATE_POINT,
          UpdateType.PATCH,
          {...this.#point, isFavorite: !this.#point.isFavorite}
        );
      }
    );

    this.#eventEditView = new EventEditView(
      this.#point,
      this.#destination,
      this.#offersByType,
      this.#destinations,
      (evt) => {
        evt.preventDefault();
        this.#onUserAction(UserAction.UPDATE_POINT, UpdateType.MINOR, this.#point);
        this.#replaceFormWithPoint();
      },
      () => this.#replaceFormWithPoint(),
      (point) => {
        this.#onUserAction(UserAction.DELETE_POINT, UpdateType.MINOR, point);
      },
      false
    );

    render(this.#eventView, this.#container);
  }

  update(updatedPoint, updatedDestination) {
    this.#point = updatedPoint;
    this.#destination = updatedDestination;
    const prevEventView = this.#eventView;
    this.#eventView = new EventView(
      this.#point,
      this.#destination,
      () => {
        this.#onModeChange();
        this.#replacePointWithForm();
        document.addEventListener('keydown', this.#onEscKeydown);
      },
      () => {
        this.#onUserAction(
          UserAction.UPDATE_POINT,
          UpdateType.PATCH,
          {...this.#point, isFavorite: !this.#point.isFavorite}
        );
      }
    );
    replace(this.#eventView, prevEventView);
    remove(prevEventView);
  }

  resetView() {
    if (this.#eventEditView?.element.parentElement) {
      this.#replaceFormWithPoint();
    }
  }

  destroy() {
    remove(this.#eventView);
    remove(this.#eventEditView);
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

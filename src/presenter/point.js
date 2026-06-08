import {render, replace, remove} from '../render.js';
import EventView from '../view/event.js';
import EventEditView from '../view/event-edit.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

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
  #mode = Mode.DEFAULT;

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
      async () => {
        try {
          await this.#onUserAction(
            UserAction.UPDATE_POINT,
            UpdateType.PATCH,
            {...this.#point, isFavorite: !this.#point.isFavorite}
          );
        } catch {
          this.#eventView.shake();
        }
      }
    );

    this.#eventEditView = new EventEditView(
      this.#point,
      this.#destination,
      this.#offersByType,
      this.#destinations,
      async (point) => {
        this.#eventEditView.setSaving();
        try {
          await this.#onUserAction(UserAction.UPDATE_POINT, UpdateType.MINOR, {...this.#point, ...point});
        } catch {
          this.#eventEditView.setAborting();
        }
      },
      () => this.#replaceFormWithPoint(),
      async (point) => {
        this.#eventEditView.setDeleting();
        try {
          await this.#onUserAction(UserAction.DELETE_POINT, UpdateType.MINOR, {...this.#point, ...point});
        } catch {
          this.#eventEditView.setAborting();
        }
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
      async () => {
        try {
          await this.#onUserAction(
            UserAction.UPDATE_POINT,
            UpdateType.PATCH,
            {...this.#point, isFavorite: !this.#point.isFavorite}
          );
        } catch {
          this.#eventView.shake();
        }
      }
    );
    replace(this.#eventView, prevEventView);
    remove(prevEventView);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormWithPoint();
    }
  }

  destroy() {
    remove(this.#eventView);
    remove(this.#eventEditView);
    document.removeEventListener('keydown', this.#onEscKeydown);
  }

  #replacePointWithForm() {
    replace(this.#eventEditView, this.#eventView);
    this.#mode = Mode.EDITING;
  }

  #replaceFormWithPoint() {
    replace(this.#eventView, this.#eventEditView);
    document.removeEventListener('keydown', this.#onEscKeydown);
    this.#mode = Mode.DEFAULT;
  }

  #onEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormWithPoint();
    }
  };
}

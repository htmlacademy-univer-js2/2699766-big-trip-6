import {render, replace} from '../render.js';
import SortView from '../view/sort.js';
import EventListView from '../view/event-list.js';
import EventView from '../view/event.js';
import EventEditView from '../view/event-edit.js';
import EmptyView from '../view/empty.js';

export default class TripPresenter {
  #container;
  #model;

  constructor(container, model) {
    this.#container = container;
    this.#model = model;
  }

  init() {
    const points = this.#model.getPoints();
    const destinations = this.#model.getDestinations();
    const offersByType = this.#model.getOffersByType();

    if (points.length === 0) {
      render(new EmptyView(), this.#container);
      return;
    }

    const eventList = new EventListView();
    render(new SortView(), this.#container);
    render(eventList, this.#container);

    points.forEach((point) => {
      const destination = this.#model.getDestinationById(point.destinationId);
      this.#renderPoint(point, destination, offersByType, destinations, eventList.element);
    });
  }

  #renderPoint(point, destination, offersByType, destinations, container) {
    const eventView = new EventView(point, destination, () => {
      replacePointWithForm();
      document.addEventListener('keydown', onEscKeydown);
    });

    const eventEditView = new EventEditView(point, destination, offersByType, destinations,
      (evt) => {
        evt.preventDefault();
        replaceFormWithPoint();
      },
      () => replaceFormWithPoint()
    );

    function replacePointWithForm() {
      replace(eventEditView, eventView);
    }

    function replaceFormWithPoint() {
      replace(eventView, eventEditView);
      document.removeEventListener('keydown', onEscKeydown);
    }

    function onEscKeydown(evt) {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormWithPoint();
      }
    }

    render(eventView, container);
  }
}

import {render} from '../render.js';
import SortView from '../view/sort.js';
import EventListView from '../view/event-list.js';
import EmptyView from '../view/empty.js';
import PointPresenter from './point.js';

export default class TripPresenter {
  #container;
  #model;
  #pointPresenters = new Map();

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
      const pointPresenter = new PointPresenter(
        eventList.element,
        point,
        destination,
        offersByType,
        destinations,
        (updatedPoint) => this.#handleDataChange(updatedPoint),
        () => this.#handleModeChange()
      );
      pointPresenter.init();
      this.#pointPresenters.set(point.id, pointPresenter);
    });
  }

  #handleDataChange(updatedPoint) {
    this.#model.updatePoint(updatedPoint);
    const destination = this.#model.getDestinationById(updatedPoint.destinationId);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint, destination);
  }

  #handleModeChange() {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  }
}

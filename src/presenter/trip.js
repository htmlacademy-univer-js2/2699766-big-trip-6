import {render, remove} from '../render.js';
import SortView, {SortType} from '../view/sort.js';
import EventListView from '../view/event-list.js';
import EmptyView from '../view/empty.js';
import PointPresenter from './point.js';

const sortPoints = {
  [SortType.DAY]: (points) => points.slice().sort((a, b) => a.dateFrom - b.dateFrom),
  [SortType.TIME]: (points) => points.slice().sort((a, b) => (b.dateTo - b.dateFrom) - (a.dateTo - a.dateFrom)),
  [SortType.PRICE]: (points) => points.slice().sort((a, b) => b.basePrice - a.basePrice),
};

export default class TripPresenter {
  #container;
  #model;
  #pointPresenters = new Map();
  #currentSort = SortType.DAY;
  #sortView = null;
  #eventListView = null;

  constructor(container, model) {
    this.#container = container;
    this.#model = model;
  }

  init() {
    const points = this.#model.getPoints();

    if (points.length === 0) {
      render(new EmptyView(), this.#container);
      return;
    }

    this.#eventListView = new EventListView();
    this.#sortView = new SortView(this.#currentSort, (sortType) => this.#handleSortChange(sortType));

    render(this.#sortView, this.#container);
    render(this.#eventListView, this.#container);

    this.#renderPoints();
  }

  #renderPoints() {
    const points = sortPoints[this.#currentSort](this.#model.getPoints());
    const destinations = this.#model.getDestinations();
    const offersByType = this.#model.getOffersByType();

    points.forEach((point) => {
      const destination = this.#model.getDestinationById(point.destinationId);
      const pointPresenter = new PointPresenter(
        this.#eventListView.element,
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

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #handleDataChange(updatedPoint) {
    this.#model.updatePoint(updatedPoint);
    const destination = this.#model.getDestinationById(updatedPoint.destinationId);
    this.#pointPresenters.get(updatedPoint.id).update(updatedPoint, destination);
  }

  #handleModeChange() {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  }

  #handleSortChange(sortType) {
    if (sortType === this.#currentSort) {
      return;
    }
    this.#currentSort = sortType;
    this.#clearPoints();
    this.#renderPoints();
  }
}

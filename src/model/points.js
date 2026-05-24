import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #points = [];
  #destinations = [];
  #offersByType = {};

  setPoints(points) {
    this.#points = points;
  }

  setDestinations(destinations) {
    this.#destinations = destinations;
  }

  setOffersByType(offersByType) {
    this.#offersByType = offersByType;
  }

  getPoints() {
    return this.#points;
  }

  getDestinations() {
    return this.#destinations;
  }

  getOffersByType() {
    return this.#offersByType;
  }

  getDestinationById(id) {
    return this.#destinations.find((d) => d.id === id);
  }

  updatePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex((p) => p.id === updatedPoint.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }
    this.#points[index] = updatedPoint;
    this._notify(updateType, updatedPoint);
  }

  addPoint(updateType, point) {
    this.#points = [point, ...this.#points];
    this._notify(updateType, point);
  }

  deletePoint(updateType, point) {
    const index = this.#points.findIndex((p) => p.id === point.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }
    this.#points = this.#points.filter((p) => p.id !== point.id);
    this._notify(updateType, point);
  }
}

export default class PointsModel {
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

  updatePoint(updatedPoint) {
    const index = this.#points.findIndex((p) => p.id === updatedPoint.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }
    this.#points[index] = updatedPoint;
  }
}

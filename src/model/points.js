export default class PointsModel {
  constructor() {
    this._points = [];
    this._destinations = [];
    this._offersByType = {};
  }

  setPoints(points) {
    this._points = points;
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  setOffersByType(offersByType) {
    this._offersByType = offersByType;
  }

  getPoints() {
    return this._points;
  }

  getDestinations() {
    return this._destinations;
  }

  getOffersByType() {
    return this._offersByType;
  }

  getDestinationById(id) {
    return this._destinations.find((d) => d.id === id);
  }
}

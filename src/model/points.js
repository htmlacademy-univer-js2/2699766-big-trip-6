import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class PointsModel extends Observable {
  #apiService;
  #points = [];
  #destinations = [];
  #offersByType = {};

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  async init() {
    try {
      const [points, destinations, offers] = await Promise.all([
        this.#apiService.getPoints(),
        this.#apiService.getDestinations(),
        this.#apiService.getOffers(),
      ]);

      this.#destinations = destinations;
      this.#offersByType = this.#adaptOffers(offers);
      this.#points = points.map((point) => this.#adaptPointToClient(point));
      this._notify(UpdateType.INIT);
    } catch {
      this.#points = [];
      this._notify(UpdateType.ERROR);
    }
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

  async updatePoint(updateType, updatedPoint) {
    try {
      const response = await this.#apiService.updatePoint(updatedPoint);
      const adapted = this.#adaptPointToClient(response);
      const index = this.#points.findIndex((p) => p.id === adapted.id);
      if (index === -1) {
        throw new Error('Can\'t update unexisting point');
      }
      this.#points[index] = adapted;
      this._notify(updateType, adapted);
    } catch {
      throw new Error('Can\'t update point');
    }
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

  #adaptOffers(offers) {
    const result = {};
    offers.forEach(({type, offers: typeOffers}) => {
      result[type] = typeOffers;
    });
    return result;
  }

  #adaptPointToClient(point) {
    const pointOffers = this.#offersByType[point.type] || [];
    return {
      id: point.id,
      type: point.type,
      destinationId: point.destination,
      dateFrom: new Date(point['date_from']),
      dateTo: new Date(point['date_to']),
      basePrice: point['base_price'],
      isFavorite: point['is_favorite'],
      offers: pointOffers.filter((offer) => point.offers.includes(offer.id)),
    };
  }
}

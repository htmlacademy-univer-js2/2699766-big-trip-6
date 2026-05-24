import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class BigTripApiService extends ApiService {
  getPoints() {
    return this._load({url: 'points'}).then(ApiService.parseResponse);
  }

  getDestinations() {
    return this._load({url: 'destinations'}).then(ApiService.parseResponse);
  }

  getOffers() {
    return this._load({url: 'offers'}).then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(BigTripApiService.adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });
    return ApiService.parseResponse(response);
  }

  async addPoint(point) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(BigTripApiService.adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });
    return ApiService.parseResponse(response);
  }

  async deletePoint(point) {
    await this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });
  }

  static adaptToServer(point) {
    const adapted = {
      'type': point.type,
      'destination': point.destinationId,
      'date_from': point.dateFrom instanceof Date ? point.dateFrom.toISOString() : point.dateFrom,
      'date_to': point.dateTo instanceof Date ? point.dateTo.toISOString() : point.dateTo,
      'base_price': point.basePrice,
      'is_favorite': point.isFavorite,
      'offers': point.offers.map((offer) => offer.id),
    };
    if (point.id !== undefined) {
      adapted['id'] = point.id;
    }
    return adapted;
  }
}

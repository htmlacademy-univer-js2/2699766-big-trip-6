import AbstractView from '../framework/view/abstract-view.js';

export default class TripInfoView extends AbstractView {
  #points;

  constructor(points) {
    super();
    this.#points = points;
  }

  get template() {
    const totalCost = this.#points.reduce((sum, point) => {
      const offersCost = point.offers.reduce((acc, offer) => acc + offer.price, 0);
      return sum + point.basePrice + offersCost;
    }, 0);

    return `
      <section class="trip-main__trip-info trip-info">
        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
        </p>
      </section>`;
  }
}

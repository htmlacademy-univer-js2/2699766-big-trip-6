import AbstractView from '../framework/view/abstract-view.js';

const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export default class EventEditView extends AbstractView {
  #point;
  #destination;
  #offersByType;
  #destinations;
  #onFormSubmit;
  #onRollupClick;

  constructor(point, destination, offersByType, destinations, onFormSubmit, onRollupClick) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offersByType = offersByType;
    this.#destinations = destinations;
    this.#onFormSubmit = onFormSubmit;
    this.#onRollupClick = onRollupClick;

    this.element.querySelector('.event--edit').addEventListener('submit', this.#onFormSubmit);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onRollupClick);
  }

  get template() {
    const {type, dateFrom, dateTo, basePrice, offers} = this.#point;
    const {name, description, pictures} = this.#destination;

    const typeListHtml = EVENT_TYPES.map((t) => `
      <div class="event__type-item">
        <input id="event-type-${t}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${t}" ${t === type ? 'checked' : ''}>
        <label class="event__type-label event__type-label--${t}" for="event-type-${t}-1">${t}</label>
      </div>`).join('');

    const destinationsHtml = this.#destinations.map(({name: n}) => `<option value="${n}"></option>`).join('');

    const availableOffers = this.#offersByType[type] || [];
    const offersHtml = availableOffers.length ? `
      <section class="event__section event__section--offers">
        <h3 class="event__section-title event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${availableOffers.map(({id, title, price}) => `
            <div class="event__offer-selector">
              <input class="event__offer-checkbox visually-hidden" id="event-offer-${id}-1" type="checkbox" name="event-offer-${id}" ${offers.some((o) => o.id === id) ? 'checked' : ''}>
              <label class="event__offer-label" for="event-offer-${id}-1">
                <span class="event__offer-title">${title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${price}</span>
              </label>
            </div>`).join('')}
        </div>
      </section>` : '';

    const photosHtml = pictures.map(({src, description: desc}) =>
      `<img class="event__photo" src="${src}" alt="${desc}">`).join('');

    const destinationHtml = `
      <section class="event__section event__section--destination">
        <h3 class="event__section-title event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">${photosHtml}</div>
        </div>
      </section>`;

    return `
      <li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
          <header class="event__header">
            <div class="event__type-wrapper">
              <label class="event__type event__type-btn" for="event-type-toggle-1">
                <span class="visually-hidden">Choose event type</span>
                <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
              </label>
              <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">
              <div class="event__type-list">
                <fieldset class="event__type-group">
                  <legend class="visually-hidden">Event type</legend>
                  ${typeListHtml}
                </fieldset>
              </div>
            </div>
            <div class="event__field-group event__field-group--destination">
              <label class="event__label event__type-output" for="event-destination-1">${type}</label>
              <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
              <datalist id="destination-list-1">${destinationsHtml}</datalist>
            </div>
            <div class="event__field-group event__field-group--time">
              <label class="visually-hidden" for="event-start-time-1">From</label>
              <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom.toLocaleString('en-GB')}">
              &mdash;
              <label class="visually-hidden" for="event-end-time-1">To</label>
              <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo.toLocaleString('en-GB')}">
            </div>
            <div class="event__field-group event__field-group--price">
              <label class="event__label" for="event-price-1">
                <span class="visually-hidden">Price</span>&euro;
              </label>
              <input class="event__input event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
            </div>
            <button class="event__save-btn btn btn--blue" type="submit">Save</button>
            <button class="event__reset-btn" type="reset">Delete</button>
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>
          </header>
          <section class="event__details">
            ${offersHtml}
            ${destinationHtml}
          </section>
        </form>
      </li>`;
  }
}

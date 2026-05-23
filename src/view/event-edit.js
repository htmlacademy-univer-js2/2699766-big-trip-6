import he from 'he';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const FLATPICKR_DATE_FORMAT = 'd/m/y H:i';

export default class EventEditView extends AbstractStatefulView {
  #offersByType;
  #destinations;
  #onFormSubmit;
  #onRollupClick;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor(point, destination, offersByType, destinations, onFormSubmit, onRollupClick) {
    super();
    this._state = {
      type: point.type,
      destinationId: point.destinationId,
      offers: point.offers,
      dateFrom: point.dateFrom,
      dateTo: point.dateTo,
      basePrice: point.basePrice,
      isFavorite: point.isFavorite,
    };
    this.#offersByType = offersByType;
    this.#destinations = destinations;
    this.#onFormSubmit = onFormSubmit;
    this.#onRollupClick = onRollupClick;

    this._restoreHandlers();
  }

  get template() {
    const {type, destinationId, offers, dateFrom, dateTo, basePrice} = this._state;
    const destination = this.#destinations.find((d) => d.id === destinationId);
    const {name, description, pictures} = destination;

    const typeListHtml = EVENT_TYPES.map((t) => `
      <div class="event__type-item">
        <input id="event-type-${t}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${t}" ${t === type ? 'checked' : ''}>
        <label class="event__type-label event__type-label--${t}" for="event-type-${t}-1">${t}</label>
      </div>`).join('');

    const destinationsHtml = this.#destinations.map(({name: n}) => `<option value="${he.encode(n)}"></option>`).join('');

    const availableOffers = this.#offersByType[type] || [];
    const offersHtml = availableOffers.length ? `
      <section class="event__section event__section--offers">
        <h3 class="event__section-title event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${availableOffers.map(({id, title, price}) => `
            <div class="event__offer-selector">
              <input class="event__offer-checkbox visually-hidden" id="event-offer-${id}-1" type="checkbox" name="event-offer-${id}" ${offers.some((o) => o.id === id) ? 'checked' : ''}>
              <label class="event__offer-label" for="event-offer-${id}-1">
                <span class="event__offer-title">${he.encode(title)}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${price}</span>
              </label>
            </div>`).join('')}
        </div>
      </section>` : '';

    const photosHtml = pictures.map(({src, description: desc}) =>
      `<img class="event__photo" src="${src}" alt="${he.encode(desc)}">`).join('');

    const destinationHtml = `
      <section class="event__section event__section--destination">
        <h3 class="event__section-title event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${he.encode(description)}</p>
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
              <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(name)}" list="destination-list-1">
              <datalist id="destination-list-1">${destinationsHtml}</datalist>
            </div>
            <div class="event__field-group event__field-group--time">
              <label class="visually-hidden" for="event-start-time-1">From</label>
              <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(dateFrom).format('DD/MM/YY HH:mm')}">
              &mdash;
              <label class="visually-hidden" for="event-end-time-1">To</label>
              <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(dateTo).format('DD/MM/YY HH:mm')}">
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

  _restoreHandlers() {
    this.element.querySelector('.event--edit').addEventListener('submit', this.#onFormSubmit);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onRollupClick);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#onTypeChange);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#onDestinationChange);

    this.#setDatepickers();
  }

  removeElement() {
    super.removeElement();
    this.#destroyDatepickers();
  }

  #setDatepickers() {
    this.#destroyDatepickers();

    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: FLATPICKR_DATE_FORMAT,
        defaultDate: this._state.dateFrom,
        onChange: ([date]) => this._setState({dateFrom: date}),
      }
    );

    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: FLATPICKR_DATE_FORMAT,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: ([date]) => this._setState({dateTo: date}),
      }
    );
  }

  #destroyDatepickers() {
    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  #onTypeChange = (evt) => {
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #onDestinationChange = (evt) => {
    const newDestination = this.#destinations.find((d) => d.name === evt.target.value);
    if (newDestination) {
      this.updateElement({destinationId: newDestination.id});
    }
  };
}

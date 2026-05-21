import AbstractView from '../framework/view/abstract-view.js';

function formatTime(date) {
  return date.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'});
}

function formatDate(date) {
  return date.toLocaleDateString('en-GB', {month: 'short', day: 'numeric'}).toUpperCase();
}

function formatDuration(dateFrom, dateTo) {
  const diff = dateTo - dateFrom;
  const minutes = Math.floor(diff / 60000) % 60;
  const hours = Math.floor(diff / 3600000) % 24;
  const days = Math.floor(diff / 86400000);

  if (days > 0) {
    return `${String(days).padStart(2, '0')}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }
  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }
  return `${String(minutes).padStart(2, '0')}M`;
}

export default class EventView extends AbstractView {
  #point;
  #destination;
  #onRollupClick;
  #onFavoriteClick;

  constructor(point, destination, onRollupClick, onFavoriteClick) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#onRollupClick = onRollupClick;
    this.#onFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onRollupClick);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#onFavoriteClick);
  }

  get template() {
    const {type, dateFrom, dateTo, basePrice, offers, isFavorite} = this.#point;
    const {name} = this.#destination;

    const offersHtml = offers.map(({title, price}) => `
      <li class="event__offer">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </li>`).join('');

    return `
      <li class="trip-events__item">
        <div class="event">
          <time class="event__date" datetime="${dateFrom.toISOString()}">${formatDate(dateFrom)}</time>
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${type} ${name}</h3>
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${dateFrom.toISOString()}">${formatTime(dateFrom)}</time>
              &mdash;
              <time class="event__end-time" datetime="${dateTo.toISOString()}">${formatTime(dateTo)}</time>
            </p>
            <p class="event__duration">${formatDuration(dateFrom, dateTo)}</p>
          </div>
          <p class="event__price">&euro;&nbsp;<span class="event__price-value">${basePrice}</span></p>
          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">${offersHtml}</ul>
          <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>`;
  }
}

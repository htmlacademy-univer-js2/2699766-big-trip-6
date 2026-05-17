import {render, RenderPosition} from '../render.js';
import SortView from '../view/sort.js';
import EventListView from '../view/event-list.js';
import EventView from '../view/event.js';
import EventEditView from '../view/event-edit.js';

export default class TripPresenter {
  constructor(container, model) {
    this._container = container;
    this._model = model;
  }

  init() {
    const points = this._model.getPoints();
    const destinations = this._model.getDestinations();
    const offersByType = this._model.getOffersByType();
    const eventList = new EventListView();

    render(new SortView(), this._container);
    render(eventList, this._container);

    const firstPoint = points[0];
    const firstDestination = this._model.getDestinationById(firstPoint.destinationId);
    render(new EventEditView(firstPoint, firstDestination, offersByType, destinations), eventList.getElement(), RenderPosition.AFTERBEGIN);

    points.slice(1, 4).forEach((point) => {
      const destination = this._model.getDestinationById(point.destinationId);
      render(new EventView(point, destination), eventList.getElement());
    });
  }
}

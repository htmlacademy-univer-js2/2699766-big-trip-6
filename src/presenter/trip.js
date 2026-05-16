import {render, RenderPosition} from '../render.js';
import SortView from '../view/sort.js';
import EventListView from '../view/event-list.js';
import EventView from '../view/event.js';
import EventEditView from '../view/event-edit.js';

export default class TripPresenter {
  constructor(container) {
    this._container = container;
  }

  init() {
    const eventList = new EventListView();

    render(new SortView(), this._container);
    render(eventList, this._container);

    render(new EventEditView(), eventList.getElement(), RenderPosition.AFTERBEGIN);
    render(new EventView(), eventList.getElement());
    render(new EventView(), eventList.getElement());
    render(new EventView(), eventList.getElement());
  }
}

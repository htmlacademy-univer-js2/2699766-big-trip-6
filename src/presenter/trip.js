import {render, remove} from '../render.js';
import SortView from '../view/sort.js';
import EventListView from '../view/event-list.js';
import EmptyView from '../view/empty.js';
import LoadingView from '../view/loading.js';
import PointPresenter from './point.js';
import {UpdateType, UserAction, FilterType, DEFAULT_POINT, SortType} from '../const.js';
import {filter} from '../utils/filter.js';

const FAILED_LOAD_MESSAGE = 'Failed to load latest route information';

let newPointId = 100;

export default class TripPresenter {
  #container;
  #pointsModel;
  #filterModel;
  #pointPresenters = new Map();
  #currentSort = SortType.DAY;
  #sortView = null;
  #eventListView = null;
  #emptyView = null;
  #loadingView = null;
  #newEventView = null;
  #isLoading = true;
  #isError = false;

  constructor(container, pointsModel, filterModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#loadingView = new LoadingView();
    render(this.#loadingView, this.#container);
  }

  createPoint(onDestroy) {
    this.#currentSort = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#handleModeChange();

    if (!this.#eventListView) {
      this.#eventListView = new EventListView();
      render(this.#eventListView, this.#container);
    }

    if (this.#emptyView) {
      remove(this.#emptyView);
      this.#emptyView = null;
    }

    const destinations = this.#pointsModel.getDestinations();
    const offersByType = this.#pointsModel.getOffersByType();
    const defaultPoint = {...DEFAULT_POINT, destinationId: destinations[0]?.id ?? null};

    import('../view/event-edit.js').then(({default: EventEditView}) => {
      this.#newEventView = new EventEditView(
        defaultPoint,
        destinations[0] ?? {id: null, name: '', description: '', pictures: []},
        offersByType,
        destinations,
        (evt) => {
          evt.preventDefault();
          this.#handleUserAction(UserAction.ADD_POINT, UpdateType.MINOR, {
            ...defaultPoint,
            id: newPointId++,
          });
          remove(this.#newEventView);
          this.#newEventView = null;
          onDestroy();
        },
        () => {
          remove(this.#newEventView);
          this.#newEventView = null;
          onDestroy();
          if (this.#pointsModel.getPoints().length === 0) {
            this.#renderEmpty();
          }
        },
        true
      );

      render(this.#newEventView, this.#eventListView.element, 'afterbegin');
    });
  }

  #getFilteredPoints() {
    return filter[this.#filterModel.getFilter()](this.#pointsModel.getPoints());
  }

  #getSortedPoints() {
    const points = this.#getFilteredPoints();
    switch (this.#currentSort) {
      case SortType.TIME:
        return points.slice().sort((a, b) => (b.dateTo - b.dateFrom) - (a.dateTo - a.dateFrom));
      case SortType.PRICE:
        return points.slice().sort((a, b) => b.basePrice - a.basePrice);
      default:
        return points.slice().sort((a, b) => a.dateFrom - b.dateFrom);
    }
  }

  #renderBoard() {
    if (this.#isLoading) {
      return;
    }

    if (this.#isError) {
      this.#emptyView = new EmptyView();
      this.#emptyView.element.textContent = FAILED_LOAD_MESSAGE;
      render(this.#emptyView, this.#container);
      return;
    }

    const points = this.#getFilteredPoints();

    if (points.length === 0) {
      this.#renderEmpty();
      return;
    }

    this.#renderSort();
    this.#eventListView = new EventListView();
    render(this.#eventListView, this.#container);
    this.#renderPoints();
  }

  #renderEmpty() {
    this.#emptyView = new EmptyView(this.#filterModel.getFilter());
    render(this.#emptyView, this.#container);
  }

  #renderSort() {
    this.#sortView = new SortView(this.#currentSort, this.#handleSortChange);
    render(this.#sortView, this.#container);
  }

  #renderPoints() {
    this.#getSortedPoints().forEach((point) => {
      const destination = this.#pointsModel.getDestinationById(point.destinationId);
      const pointPresenter = new PointPresenter(
        this.#eventListView.element,
        point,
        destination,
        this.#pointsModel.getOffersByType(),
        this.#pointsModel.getDestinations(),
        this.#handleUserAction,
        this.#handleModeChange
      );
      pointPresenter.init();
      this.#pointPresenters.set(point.id, pointPresenter);
    });
  }

  #clearBoard(resetSort = false) {
    if (this.#newEventView) {
      remove(this.#newEventView);
      this.#newEventView = null;
    }
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    if (this.#sortView) {
      remove(this.#sortView);
      this.#sortView = null;
    }
    if (this.#eventListView) {
      remove(this.#eventListView);
      this.#eventListView = null;
    }
    if (this.#emptyView) {
      remove(this.#emptyView);
      this.#emptyView = null;
    }

    if (resetSort) {
      this.#currentSort = SortType.DAY;
    }
  }

  #handleUserAction = (userAction, updateType, point) => {
    switch (userAction) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, point);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, point);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, point);
        break;
    }
  };

  #handleModelEvent = (updateType, point) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(point.id)?.update(point, this.#pointsModel.getDestinationById(point.destinationId));
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard(true);
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingView);
        this.#renderBoard();
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        this.#isError = true;
        remove(this.#loadingView);
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    if (this.#newEventView) {
      remove(this.#newEventView);
      this.#newEventView = null;
    }
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortChange = (sortType) => {
    if (sortType === this.#currentSort) {
      return;
    }
    this.#currentSort = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };
}

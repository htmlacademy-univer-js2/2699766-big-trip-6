import {render, replace, remove} from '../render.js';
import FilterView from '../view/filter.js';
import {UpdateType} from '../const.js';

export default class FilterPresenter {
  #container;
  #filterModel;
  #pointsModel;
  #filterView = null;

  constructor(container, filterModel, pointsModel) {
    this.#container = container;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelChange);
    this.#filterModel.addObserver(this.#handleModelChange);
  }

  init() {
    const prevFilterView = this.#filterView;

    this.#filterView = new FilterView(
      this.#pointsModel.getPoints(),
      this.#filterModel.getFilter(),
      this.#handleFilterChange
    );

    if (prevFilterView === null) {
      render(this.#filterView, this.#container);
      return;
    }

    replace(this.#filterView, prevFilterView);
    remove(prevFilterView);
  }

  #handleModelChange = () => {
    this.init();
  };

  #handleFilterChange = (filterType) => {
    if (this.#filterModel.getFilter() === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}

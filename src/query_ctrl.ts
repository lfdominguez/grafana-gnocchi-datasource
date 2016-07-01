///<reference path="../typings/index.d.ts" />

export class GnocchiDatasourceQueryCtrl  {
  static templateUrl = 'partials/query.editor.html';

  // This is a copy of QueryCtrl interface
  target: any;
  datasource: any;
  panelCtrl: any;
  panel: any;
  hasRawMode: boolean;
  error: string;

  // local stuffs
  aggregators: any;
  queryModes: any;

  constructor(public $scope, private $injector) {
    this.$scope = $scope;
    this.panel = this.panelCtrl.panel;

    // TODO(sileht): Allows custom
    this.aggregators = ['mean', 'sum', 'min', 'max',
        'std', 'median', 'first', 'last', 'count'].concat(
        _.range(1, 100).map(function (i) { return i + "pct"; }));
    this.queryModes = [
        {text: 'Measurements of a metric of multiple resources', value: 'resource_search'},
        {text: 'Aggregated measurements of a metric across resources', value: 'resource_aggregation'},
        {text: 'Measurements of a metric of a resource', value: 'resource'},
        {text: 'Measurements of a metric', value: 'metric'}
    ];

    if (!this.target.refId) {
        this.target.refId = this.getNextQueryLetter();
    }

    // default
    if (!this.target.aggregator) {
        this.target.aggregator = 'mean' ;
    }
    if (!this.target.queryMode) {
        this.target.queryMode = "resource_search";
    }

    this.target.validQuery = false;
    this.target.queryError = 'No query';

    this.queryUpdated();
  }

  refresh(){
    this.panelCtrl.refresh();
  }

  suggestResourceIDs(query, callback) {
    this.datasource
      .performSuggestQuery(query, 'resources', this.target)
      .then(callback);
  }

  queryUpdated() {
    this.target.queryError = this.datasource.validateTarget(this.target, false);
    this.target.validQuery = !this.target.queryError;
    this.refresh();
  }

  suggestMetricIDs(query, callback) {
    this.datasource
      .performSuggestQuery(query, 'metrics', this.target)
      .then(callback);
  }

  suggestMetricNames(query, callback) {
    this.datasource
      .performSuggestQuery(query, 'metric_names', this.target)
      .then(callback);
  }

  // QueryCTRL stuffs
  getNextQueryLetter() {
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    return _.find(letters, refId => {
      return _.every(this.panel.targets, function(other: any) {
        return other.refId !== refId;
      });
    });
  }

}

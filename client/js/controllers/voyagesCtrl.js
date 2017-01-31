angular
  .module('app')
  .controller('VoyagesCtrl', VoyagesCtrl);

function VoyagesCtrl($log, PortCall) {

  let ctrl = this;

  ctrl.voyages = [];

  ctrl.dateOptions = {
    initDate: new Date(2016, 00, 01),
    formatYear: 'yy',
    startingDay: 1
  };

  ctrl.getRoutes = (etd, eta) => {
    const params = { etd, eta };

    PortCall.getRoutes(params).$promise
      .then(voyages => {
        ctrl.voyages = voyages;
      })
      .catch(err => {
        $log.error(err);
      });
  };

}

VoyagesCtrl.$inject = ['$log', 'PortCall'];

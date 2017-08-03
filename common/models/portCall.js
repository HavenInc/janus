'use strict';

module.exports = function(PortCall) {

  PortCall.getRoutes = function(etd, eta,incTrans, cb) {
    // For more information on how to query data in loopback please see
    // https://docs.strongloop.com/display/public/LB/Querying+data
    const query = {
      where: {
        and: [
          { // port call etd >= etd param, or can be null
            or: [{ etd: { gte: etd } }, { etd: null }]
          },
          { // port call eta <= eta param, or can be null
            or: [{ eta: { lte: eta } }, { eta: null }]
          }
        ]
      }
    };

    PortCall.find(query)
      .then(calls => {

        /*
          All port calls are grouped by RouteID
        */
        var routeIdPortCallsMap = getRouteIdPortCallsMap(calls);

      /*
       All direct routes based on port calls.
      */
      var allVoyages = getAllDirectVoyages(routeIdPortCallsMap);

      /*
      If transit shipments are requested, do the below.
      */
      if (incTrans) {
          /*
          Group all the routes from each port.
          */
          let portVoyageMap = getPortVoyageMap(allVoyages);

          /*
            Find out all transit shipments starting from each port.
          */
          for (let port in portVoyageMap) {
              var curRoutes = getTransitRoutes(null,
                                               port,
                                               portVoyageMap,
                                               etd,
                                               eta);
              for (let i = 0; i < curRoutes.length; i++) {
                  allVoyages.push(curRoutes[i]);
              }
          }
      }

      return cb(null, allVoyages);
      })
      .catch(err => {
        console.log(err);
        return cb(err);
      });
  };

  PortCall.remoteMethod('getRoutes', {
    accepts: [
      { arg: 'etd', 'type': 'date' },
      { arg: 'eta', 'type': 'date' },
      { arg: 'incTrans', 'type': 'boolean' }
    ],
    returns: [
      { arg: 'routes', type: 'array', root: true }
    ]
  });


};

/**
 * [get map of routeId to port calls for that routeId]
 * @param  {[type]} calls [port calls withing the given window]
 * @return {[type]}       [map of routeId to port calls for that routeId]
 */
function getRouteIdPortCallsMap(calls){
  var routeIdPortCallsMap = [];
  calls.forEach((call) => {
      if (routeIdPortCallsMap[call.routeId] == null) {
          routeIdPortCallsMap[call.routeId] = [];
        }
        routeIdPortCallsMap[call.routeId].push(call);
  });
  return routeIdPortCallsMap;

}

/**
 * [get All Direct Voyages from routeId to poet calls map]
 * @param  {[type]} routeIdPortCallsMap [routeId to port calls map]
 * @return {[type]}                     [list of direct voyages]
 */
function getAllDirectVoyages(routeIdPortCallsMap){
  let allVoyages = [];
  for (let routeId in routeIdPortCallsMap) {
      for (let i = 0; i < routeIdPortCallsMap[routeId].length; i++) {
          for (let j = i + 1;
               j < routeIdPortCallsMap[routeId].length;
               j++) {
              if (routeIdPortCallsMap[routeId][i].port !==
                  routeIdPortCallsMap[routeId][j].port) {
                  var route = {};
                  route.vessel = routeIdPortCallsMap[routeId][i].vessel;
                  route.from = routeIdPortCallsMap[routeId][i].port;
                  route.to = routeIdPortCallsMap[routeId][j].port;
                  route.type = 'direct';
                  route.etd = routeIdPortCallsMap[routeId][i].etd;
                  route.eta = routeIdPortCallsMap[routeId][j].eta;
                  route.routeId = routeId;
                  allVoyages.push(route);
              }
          }
      }
  }
  return allVoyages;
}

/**
 * [get map of port to list of direct voyages from that port]
 * @param  {[type]} allVoyages [list of direct voyages]
 * @return {[type]}            [port to list of direct voyages map]
 */
function getPortVoyageMap(allVoyages){
  let portVoyageMap = [];
  allVoyages.forEach((route) => {
      if (portVoyageMap[route.from] == null) {
          portVoyageMap[route.from] = [];
      }
      portVoyageMap[route.from].push(route);
  });
  return portVoyageMap;
}



/**
 * [get all transit voyages from each port]
 * @param  {[type]} prevRoute     [previous port]
 * @param  {[type]} curPort       [current port]
 * @param  {[type]} portVoyageMap [all port and direct voyage map]
 * @param  {[type]} etd           [etd]
 * @param  {[type]} eta           [eta]
 * @return {[type]}               [all trasite yoyages fromt that port]
 */
function getTransitRoutes(prevRoute, curPort, portVoyageMap, etd, eta) {
   let curRoutes = [];
   let transRoutes = [];
   let routes = portVoyageMap[curPort];
   /*
     If current port have no routes starting from it, return empty array
   */
   if (routes == null) {
       return [];
   }

   routes.forEach((route) => {
     /*
       if eta and etd is in required window
       , vessels are same,
       routes are diff then attach to prevRoute
     */
     if (route.etd != null &&
         route.etd >= etd &&
         route.eta != null &&
         route.eta <= eta &&
         (prevRoute === null || prevRoute.vessel === route.vessel) &&
         (prevRoute === null || prevRoute.routeId !== route.routeId)) {
         curRoutes.push(route);
         if (prevRoute !== null && prevRoute.from !== route.to) {
             let transRoute = {};
             transRoute.from = prevRoute.from;
             transRoute.to = route.to;
             transRoute.etd = prevRoute.etd;
             transRoute.eta = route.eta;
             transRoute.type = 'transit';
             transRoute.vessel = route.vessel;
             if (route.from === transRoute.from) {
                 transRoute.routeId = route.routeId;
             } else {
                 transRoute.routeId = prevRoute.routeId +
                     '--(' + route.from + ')->' +
                     route.routeId;
             }
             transRoutes.push(transRoute);
         }
     }

   });

   /*
     For each matching routes from curPort,
     call the same function recursively
     by making curRoute as prevRoute.
   */

   for (let i = 0; i < curRoutes.length; i++) {
       let nextLevelRoutes = getTransitRoutes(curRoutes[i],
           curRoutes[i].to,
           portVoyageMap,
           curRoutes[i].eta,
           eta);
       for (let j = 0; j < nextLevelRoutes.length; j++) {
           if (curPort !== nextLevelRoutes[j].to) {
               let transRoute = {};
               transRoute.from = curPort;
               transRoute.to = nextLevelRoutes[j].to;
               transRoute.etd = curRoutes[i].etd;
               transRoute.eta = nextLevelRoutes[j].eta;
               transRoute.vessel = nextLevelRoutes[j].vessel;
               transRoute.type = 'transit';
               if (transRoute.from === nextLevelRoutes[j].from) {
                   transRoute.routeId = nextLevelRoutes[j].routeId;
               } else {
                   transRoute.routeId = curRoutes[i].routeId +
                       '--(' + nextLevelRoutes[j].from + ')-->' +
                       nextLevelRoutes[j].routeId;
               }
               transRoutes.push(transRoute);
           }
       }
   }
   return transRoutes;
}

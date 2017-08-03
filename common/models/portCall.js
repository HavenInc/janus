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
      var routeIdPortCallsMap = [];
      /*
        Group by RouteID
      */
      for(var i=0; i < calls.length; i++) {
        if(routeIdPortCallsMap[calls[i].routeId] == null){
          routeIdPortCallsMap[calls[i].routeId] = [];
        }
        routeIdPortCallsMap[calls[i].routeId].push(calls[i]);
      }

      /*
       All direct routes based on port calls.
      */
      var allRoutes = [];
      for (var routeId in routeIdPortCallsMap) {
         for( i=0; i < routeIdPortCallsMap[routeId].length; i++) {
            for(var j=i+1; j < routeIdPortCallsMap[routeId].length; j++) {
              if(routeIdPortCallsMap[routeId][i].port !==
                 routeIdPortCallsMap[routeId][j].port){
                 var route={};
                 route.vessel = routeIdPortCallsMap[routeId][i].vessel;
                 route.from = routeIdPortCallsMap[routeId][i].port;
                 route.to =  routeIdPortCallsMap[routeId][j].port;
                  route.type = 'direct';
                  route.etd = routeIdPortCallsMap[routeId][i].etd;
                  route.eta = routeIdPortCallsMap[routeId][j].eta;
                  route.routeId = routeId;
                  allRoutes.push(route);
              }
            }
         }
      }

      /*
      If transit shipments are requested, do the below.
      */
      if(incTrans){
            /*
              Group all the routes from each port.
            */
            var portRouteMap = [];
              for( i=0; i < allRoutes.length; i++) {
              if(portRouteMap[allRoutes[i].from] == null){
                portRouteMap[allRoutes[i].from] = [];
              }
              portRouteMap[allRoutes[i].from].push(allRoutes[i]);
            }

            /*
              Find out all transit shipments starting from each port.
            */
          for (var port in portRouteMap) {
    var curRoutes = getTransitRoutes(null, port,portRouteMap, etd,eta);
      for( i = 0; i<curRoutes.length;i++ ){
          allRoutes.push(curRoutes[i]);
      }
            }
      }

      return cb(null, allRoutes);
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

 function getTransitRoutes(prevRoute, curPort, portRouteMap,etd, eta){
    var curRoutes = [];
    var transRoutes = [];
    var routes = portRouteMap[curPort];
    /*
      If current port have no routes starting from it, return empty array
    */
    if(routes == null){
      return [];
    }
    for(var i=0; i<routes.length; i++){
    /*
      if eta and etd is in required window
      , vessels are same,
      routes are diff then attach to prevRoute
    */
      if(routes[i].etd != null &&
         routes[i].etd >= etd  &&
         routes[i].eta != null &&
         routes[i].eta <= eta  &&
         (prevRoute === null || prevRoute.vessel === routes[i].vessel) &&
         (prevRoute === null || prevRoute.routeId !== routes[i].routeId)){
              curRoutes.push(routes[i]);
              if(prevRoute !== null && prevRoute.from !== routes[i].to){
                  var route = {};
                  route.from = prevRoute.from;
                  route.to =  routes[i].to;
                  route.etd = prevRoute.etd;
                  route.eta = routes[i].eta;
                  route.type = 'transit';
                  route.vessel = routes[i].vessel;
                  if(routes[i].from === route.from){
                      route.routeId = routes[i].routeId;
                  } else{
                      route.routeId = prevRoute.routeId +
                                      '--('+routes[i].from+')->' +
                                      routes[i].routeId;
                  }
                  transRoutes.push(route);
              }
      }
    }

    /*
      For each matching routes from curPort,
      call the same function recursively
      by making curRoute as prevRoute.
    */

    for( i=0; i< curRoutes.length; i++){
      var nextLevelRoutes = getTransitRoutes(curRoutes[i],
                                             curRoutes[i].to,
                                             portRouteMap,
                                             curRoutes[i].eta,
                                             eta);
      for(var j=0; j< nextLevelRoutes.length; j++){
        if(curPort !== nextLevelRoutes[j].to){
          var transRoute = {};
          transRoute.from = curPort;
          transRoute.to = nextLevelRoutes[j].to;
          transRoute.etd = curRoutes[i].etd;
          transRoute.eta = nextLevelRoutes[j].eta;
          transRoute.vessel = nextLevelRoutes[j].vessel;
          transRoute.type = 'transit';
          if(transRoute.from === nextLevelRoutes[j].from){
            transRoute.routeId = nextLevelRoutes[j].routeId;
          } else{
            transRoute.routeId = curRoutes[i].routeId +
                                 '--('+nextLevelRoutes[j].from+')-->' +
                                 nextLevelRoutes[j].routeId;
          }
          transRoutes.push(transRoute);
        }
      }
    }
    return transRoutes;
 }

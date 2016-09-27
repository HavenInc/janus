module.exports = function init(server) {
  var Voyage = server.models.Voyage;

  var voyage = [
    {id:1, vessel: "USS Harpoon", port: "HKHKG", eta: "2016-01-01 00:00:00", etd: "2015-01-03 00:00:00"},
    {id:2, vessel: "USS Harpoon", port: "SGSIN", eta: "2016-01-06 00:00:00", etd: "2015-01-09 00:00:00"},
    {id:3, vessel: "USS Harpoon", port: "USLAX", eta: "2016-09-12 00:00:00", etd: "2015-01-15 00:00:00"},
    {id:4, vessel: "USS Harpoon", port: "USOAK", eta: "2016-09-18 00:00:00", etd: "2015-01-21 00:00:00"},
    {id:5, vessel: "USS Starboard", port: "HKHKG", eta: "2016-01-02 00:00:00", etd: "2016-01-04 00:00:00"},
    {id:6, vessel: "USS Starboard", port: "USLAX", eta: "2016-01-06 00:00:00", etd: "2015-01-08 00:00:00"},
    {id:7, vessel: "USS Starboard", port: "USOAK", eta: "2016-01-10 00:00:00", etd: "2015-01-12 00:00:00"},
    {id:8, vessel: "USS Starboard", port: "SGSIN", eta: "2016-01-14 00:00:00", etd: "2015-01-16 00:00:00"},
    {id:9, vessel: "USS Starboard", port: "HKHKG", eta: "2016-01-18 00:00:00", etd: "2015-01-20 00:00:00"},
    {id:10, vessel: "USS Starboard", port: "USLAX", eta: "2016-01-22 00:00:00", etd: "2015-01-24 00:00:00"},
    {id:11, vessel: "HMS Port", port: "USOAK", eta: "2016-01-10 00:00:00", etd: "2015-01-15 00:00:00"},
    {id:12, vessel: "HMS Port", port: "HKHKG", eta: "2016-01-20 00:00:00", etd: "2015-01-25 00:00:00"},
    {id:13, vessel: "HMS Port", port: "SGSIN", eta: "2016-01-30 00:00:00", etd: "2015-02-05 00:00:00"}
  ];

  Voyage.create(voyage, function(err, result) {
    if (err) console.log(err);
    console.log("Done importing initial voyage data!");
  });
};

module.exports = function init(server) {
  var Voyage = app.models.voyage;

  var voyage = [
    {id:1, vessel: "Harpoon", port: "HKHKG", eta: "2015-09-18 16:00:00", etd: "2015-09-18 00:00:00"},
    {id:1, vessel: "Harpoon", port: "USOAK", eta: "2015-09-18 16:00:00", etd: "2015-09-18 00:00:00"},
    {id:1, vessel: "Harpoon", port: "SGSIN", eta: "2015-09-18 16:00:00", etd: "2015-09-18 00:00:00"},
    {id:1, vessel: "Harpoon", port: "USLAX", eta: "2015-09-18 16:00:00", etd: "2015-09-18 00:00:00"},
    {id:1, vessel: "Harpoon", port: "HKHKG", eta: "2015-09-18 16:00:00", etd: "2015-09-18 00:00:00"},
    {id:1, vessel: "Harpoon", port: "HKHKG", eta: "2015-09-18 16:00:00", etd: "2015-09-18 00:00:00"}
  ];

  Promise.all([
    Voyage.create(voyage1),
    Voyage.create(voyage2),
    Voyage.create(voyage3),
    Voyage.create(voyage4),
    Voyage.create(voyage5),
    Voyage.create(voyage6),
    Voyage.create(voyage7)
  ])
  Voyage.create(voyage1);


  const roleParams = _.map(roles, (role) => {
    return { personId: person.id, orgId: person.currentOrgId, role: role }
  });

  OrgPersonRole.create(roleParams, (err, res) => {
    if (err) return cb(err);
    return cb(null, res);
  });
};

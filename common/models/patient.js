'use strict';
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyC2nwExUanh5YahWAllC65tmfDpU0jrtwk',
  Promise: Promise,
});

module.exports = function(Patient) {
  Patient.address = async function(id) {
    const pat = await Patient.find();
    if (!pat) throw 'Patient not found';
    await Promise.all(
      pat.map(async (p, i) => {
        console.log(p);
        const a = await googleMapsClient
          .findPlace({
            input: pat[i].endereco + ' parque do lago brumadinho',
            inputtype: 'textquery',
            fields: ['formatted_address', 'geometry'],
          })
          .asPromise();
        if (a.json.candidates.length) {
          console.log(a.json.candidates[0].geometry.location);
          pat[i].updateAttributes({
            location: a.json.candidates[0].geometry.location,
          });
        }
      })
    );
    return true;
  };

  Patient.remoteMethod('address', {
    accepts: {
      arg: 'id',
      type: 'string',
      required: true,
    },
    returns: {
      arg: 'events',
      root: true,
    },
    http: {
      path: '/:id/address',
      verb: 'get',
    },
  });
};

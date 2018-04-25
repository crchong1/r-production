var pharmacyDB = require('../database/pharmacyDB.js');

//medications page functions

//functions for pharmacy problems
var getAllPharmacy = function (req, res) {
  console.log("getAllPharmacy called in routes")
  pharmacyDB.getAllPharmacy(function (data, err) {
    if (err) {
      console.log(err);
    } else {
      console.log("pharmacy routes data: " + data);
      res.send({ data: data });
    }
  });
};


var submitNewPharmacy = function (req, res) {
  console.log("submitNewPharmacy called in routes")
  // check to see if there is already data in the table
  pharmacyDB.getAllPharmacy(function (data, err) {
    if (err) {
      console.log(err);
    } else {
      // if there is no data in the table yet
      if (data.length == 0) {
        // we create a new entry here
        pharmacyDB.putNewPharmacy(req.body.section,
          req.body.genericName, req.body.proprietaryName, req.body.drugClass,
          req.body.type, req.body.description, req.body.manufactureDate,
          req.body.expirationDate, req.body.lotNumber, req.body.concentration, 
          req.body.amountPerUnit, req.body.unitsRemaining, function (data, err) {
            if (err) {
              console.log(err);
            } else {
              res.send({ data: data });
            }
          });
      }
      // if there is already data in the table so we need to update it
      else {
        // this function takes in existing data and updates it
        pharmacyDB.putPharmacyEntry(req.body.section,
          req.body.genericName, req.body.proprietaryName, req.body.drugClass,
          req.body.type, req.body.description, req.body.manufactureDate,
          req.body.expirationDate, req.body.lotNumber, req.body.concentration, 
          req.body.amountPerUnit, req.body.unitsRemaining, function (data, err) {
            if (err) {
              console.log("error")
            }
            else if (data) {
              res.send({
                data: data
              });
            }
          });
      }
    }
  });
};

// var editPharmacy = function (req, res) {
//   console.log("editPharmacy called in routes")
//   // this function takes in existing data and edits it
//   pharmacyDB.editPharmacy(req.body.id, req.body.section,
//     req.body.genericName, req.body.proprietaryName, req.body.drugClass,
//     req.body.type, req.body.description, req.body.manufactureDate,
//     req.body.expirationDate, req.body.lotNumber, req.body.concentration, 
//     req.body.amountPerUnit, req.body.unitsRemaining, req.body.preEditData, function (data, err) {
//       if (err) {
//         console.log("error")
//       }
//       else if (data) {
//         res.send({
//           data: data
//         });
//       }
//     });
// };

// var deletePharmacy = function (req, res) {
//   console.log("deletePharmacy called in routes")
//   // this function takes in existing data and updates it
//   pharmacyDB.deletePharmacy(req.body.id, req.body.preEditData, function (data, err) {
//     if (err) {
//       console.log("error")
//     }
//     else if (data) {
//       res.send({
//         data: data
//       });
//     }
//   });
// };

  // this method handles the get_main request from app.js and reroutes it to the getMain function above
var pharmacyRoutes = { 
  //medications functions
  get_all_pharmacy: getAllPharmacy,
  submit_pharmacy: submitNewPharmacy,
  // edit_pharmacy: editPharmacy,
  // delete_pharmacy: deletePharmacy
  };
  
  module.exports = pharmacyRoutes;
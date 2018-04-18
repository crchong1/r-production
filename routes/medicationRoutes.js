var medicationDB = require('../database/medicationDB.js');

//medications page functions

//functions for chronic problems
var getAllChronicMed = function (req, res) {
  console.log("getAllChronicMed called in routes")
  var id = req.body.id;
  medicationDB.getAllChronicMed(id, function (data, err) {
    if (err) {
      console.log(err);
    } else {
      console.log("chronic routes data: " + data);
      res.send({ data: data });
    }
  });
};


var submitNewChronicMed = function (req, res) {
  console.log("submitNewChronic called in routes")
  var id = req.body.id;
  // check to see if there is already data in the table
  medicationDB.getAllChronicMed(id, function (data, err) {
    if (err) {
      console.log(err);
    } else {
      // if there is no data in the table yet
      if (data.length == 0) {
        // we create a new entry here
        medicationDB.putNewChronicMed(req.body.id, req.body.chronicMedName,
          req.body.chronicMedDose, req.body.chronicMedTime, req.body.chronicMedRoute,
          req.body.chronicMedStartDate, req.body.chronicMedEndDate, req.body.chronicMedDiagnosis,
          req.body.chronicMedNotes, function (data, err) {
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
        medicationDB.putChronicMedEntry(req.body.id, req.body.chronicMedName,
          req.body.chronicMedDose, req.body.chronicMedTime, req.body.chronicMedRoute,
          req.body.chronicMedStartDate, req.body.chronicMedEndDate, req.body.chronicMedDiagnosis,
          req.body.chronicMedNotes, function (data, err) {
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

var editChronicMed = function (req, res) {
  console.log("editChronicMed called in routes")
  // this function takes in existing data and edits it
  medicationDB.editChronicMed(req.body.id, req.body.chronicMedName,
    req.body.chronicMedDose, req.body.chronicMedTime, req.body.chronicMedRoute,
    req.body.chronicMedStartDate, req.body.chronicMedEndDate, req.body.chronicMedDiagnosis,
    req.body.chronicMedNotes, req.body.preEditData, function (data, err) {
      if (err) {
        console.log("error")
      }
      else if (data) {
        res.send({
          data: data
        });
      }
    });
};

var deleteChronicMed = function (req, res) {
  console.log("deleteChronicMed called in routes")
  // this function takes in existing data and updates it
  medicationDB.deleteChronicMed(req.body.id, req.body.preEditData, function (data, err) {
    if (err) {
      console.log("error")
    }
    else if (data) {
      res.send({
        data: data
      });
    }
  });
};

//functions for acute problems
var getAllAcuteMed = function (req, res) {
  console.log("getAllAcuteMed called in routes")
  var id = req.body.id;
  medicationDB.getAllAcuteMed(id, function (data, err) {
    if (err) {
      console.log(err);
    } else {
      console.log("acute routes data: " + data);
      res.send({ data: data });
    }
  });
};


var submitNewAcuteMed = function (req, res) {
  console.log("submitNewAcute called in routes")
  var id = req.body.id;
  // check to see if there is already data in the table
  medicationDB.getAllAcuteMed(id, function (data, err) {
    if (err) {
      console.log(err);
    } else {
      // if there is no data in the table yet
      if (data.length == 0) {
        // we create a new entry here
        medicationDB.putNewAcuteMed(req.body.id, req.body.acuteMedName,
          req.body.acuteMedDose, req.body.acuteMedTime, req.body.acuteMedRoute,
          req.body.acuteMedStartDate, req.body.acuteMedEndDate, req.body.acuteMedDiagnosis,
          req.body.acuteMedNotes, function (data, err) {
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
        medicationDB.putAcuteMedEntry(req.body.id, req.body.acuteMedName,
          req.body.acuteMedDose, req.body.acuteMedTime, req.body.acuteMedRoute,
          req.body.acuteMedStartDate, req.body.acuteMedEndDate, req.body.acuteMedDiagnosis,
          req.body.acuteMedNotes, function (data, err) {
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

var editAcuteMed = function (req, res) {
  console.log("editAcuteMed called in routes")
  // this function takes in existing data and edits it
  medicationDB.editAcuteMed(req.body.id, req.body.acuteMedName,
    req.body.acuteMedDose, req.body.acuteMedTime, req.body.acuteMedRoute,
    req.body.acuteMedStartDate, req.body.acuteMedEndDate, req.body.acuteMedDiagnosis,
    req.body.acuteMedNotes, req.body.preEditData, function (data, err) {
      if (err) {
        console.log("error")
      }
      else if (data) {
        res.send({
          data: data
        });
      }
    });
};

var deleteAcuteMed = function (req, res) {
  console.log("deleteAcuteMed called in routes")
  // this function takes in existing data and updates it
  medicationDB.deleteAcuteMed(req.body.id, req.body.preEditData, function (data, err) {
    if (err) {
      console.log("error")
    }
    else if (data) {
      res.send({
        data: data
      });
    }
  });
};
  

  // this method handles the get_main request from app.js and reroutes it to the getMain function above
var medicationRoutes = { 
  //medications functions
  get_all_chronic_med: getAllChronicMed,
  submit_chronic_med: submitNewChronicMed,
  edit_chronic_med: editChronicMed,
  delete_chronic_med: deleteChronicMed,

  get_all_acute_med: getAllAcuteMed,
  submit_acute_med: submitNewAcuteMed,
  edit_acute_med: editAcuteMed,
  delete_acute_med: deleteAcuteMed
  };
  
  module.exports = medicationRoutes;
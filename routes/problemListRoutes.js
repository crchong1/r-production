var problemListDB = require('../database/problemListDB.js');

//functions for chronic problems
var getAllChronic = function (req, res) {
  console.log("getAllChronic called in routes")
  var id = req.body.id;
  problemListDB.getAllChronic(id, function (data, err) {
    if (err) {
      console.log(err);
    } else {
      console.log("chronic routes data: " + data);
      res.send({ data: data });
    }
  });
};


var submitNewChronic = function (req, res) {
  console.log("submitNewChronic called in routes")
  var id = req.body.id;
  // check to see if there is already data in the table
  problemListDB.getAllChronic(id, function (data, err) {
    if (err) {
      console.log(err);
    } else {
      // if there is no data in the table yet
      if (data.length == 0) {
        // we create a new entry here
        problemListDB.putNewChronic(req.body.id, req.body.chronicDiagnosis,
          req.body.chronicDetails, req.body.chronicTreatment, req.body.chronicDateOnset,
          req.body.chronicEndDate, req.body.chronicNotes, function (data, err) {
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
        problemListDB.putChronicEntry(req.body.id, req.body.chronicDiagnosis,
          req.body.chronicDetails, req.body.chronicTreatment, req.body.chronicDateOnset,
          req.body.chronicEndDate, req.body.chronicNotes, function (data, err) {
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

var editChronic = function (req, res) {
  console.log("editChronic called in routes")
  // this function takes in existing data and edits it
  problemListDB.editChronic(req.body.id, req.body.chronicDiagnosis,
    req.body.chronicDetails, req.body.chronicTreatment, req.body.chronicDateOnset,
    req.body.chronicEndDate, req.body.chronicNotes, req.body._id, function (data, err) {
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

var deleteChronic = function (req, res) {
  console.log("deleteChronic called in routes")
  // this function takes in existing data and updates it
  problemListDB.deleteChronic(req.body.id, req.body._id, function (data, err) {
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
var getAllAcute = function (req, res) {
  var id = req.body.id;
  problemListDB.getAllAcute(id, function (data, err) {
    if (err) {
      console.log(err);
    } else {
      res.send({ data: data });
    }
  });
};


var submitNewAcute = function (req, res) {
  var id = req.body.id;
  // check to see if there is already data in the table
  problemListDB.getAllAcute(id, function (data, err) {
    if (err) {
      console.log(err);
    } else {
      // if there is no data in the table yet
      if (data.length == 0) {
        // we create a new entry here
        problemListDB.putNewAcute(req.body.id, req.body.acuteDiagnosis,
          req.body.acuteDetails, req.body.acuteTreatment, req.body.acuteDateOnset,
          req.body.acuteEndDate, req.body.acuteNotes, function (data, err) {
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
        problemListDB.putAcuteEntry(req.body.id, req.body.acuteDiagnosis,
          req.body.acuteDetails, req.body.acuteTreatment, req.body.acuteDateOnset,
          req.body.acuteEndDate, req.body.acuteNotes, function (data, err) {
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

var editAcute = function (req, res) {
  console.log("editAcute called in routes")
  // this function takes in existing data and edits it
  problemListDB.editAcute(req.body.id, req.body.acuteDiagnosis,
    req.body.acuteDetails, req.body.acuteTreatment, req.body.acuteDateOnset,
    req.body.acuteEndDate, req.body.acuteNotes, req.body._id, function (data, err) {
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

var deleteAcute = function (req, res) {
  console.log("deleteAcute called in routes")
  // this function takes in existing data and updates it
  problemListDB.deleteAcute(req.body.id, req.body._id, function (data, err) {
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

var problemListRoutes = {
  get_all_chronic: getAllChronic,
  submit_chronic: submitNewChronic,
  edit_chronic: editChronic,
  delete_chronic: deleteChronic,

  get_all_acute: getAllAcute,
  submit_acute: submitNewAcute,
  edit_acute: editAcute,
  delete_acute: deleteAcute
};

module.exports = problemListRoutes;
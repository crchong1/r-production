var patientsDB = require('../database/patientsDB.js');
var weightDB = require('../database/weightDB.js');
var problemListDB = require('../database/problemListDB.js');

//functions for chronic problems
var getAllChronic = function(req, res) {
  console.log("getAllChronic called in routes")
  var id = req.body.id;
  problemListDB.getAllChronic(id, function(data, err) {
    if(err) {
      console.log(err);
    } else {
      console.log("chronic routes data: " + data);
      res.send({data: data});
    }
  });
};

  
var submitNewChronic = function(req, res) {
  console.log("submitNewChronic called in routes");
  var id = req.body.id;
    // check to see if there is already data in the table
  problemListDB.getAllChronic(id, function(data, err) {
    if(err) {
      console.log(err);
    } else {
      // if there is no data in the table yet
      if(data.length == 0){
        // we create a new entry here
        problemListDB.putNewChronic(req.body.id, req.body.chronicDiagnosis, 
          req.body.chronicDetails, req.body.chronicTreatment, req.body.chronicDateOnset,
          req.body.chronicEndDate, function(data, err) {
          if(err) {
            console.log(err);
          } else {
            res.send({data: data});
          }
        });
      }
      // if there is already data in the table so we need to update it
      else {
        // this function takes in existing data and updates it
        problemListDB.putChronicEntry(req.body.id, req.body.chronicDiagnosis, 
          req.body.chronicDetails, req.body.chronicTreatment, req.body.chronicDateOnset,
          req.body.chronicEndDate, function(data, err) {
          if(err){
            console.log("error")
          }
          else if(data){
            res.send({
              data: data
            });
          }
        });
      }
    }
  });
};

//functions for chronic problems
var getAllAcute = function(req, res) {
  var id = req.body.id;
  problemListDB.getAllAcute(id, function(data, err) {
    if(err) {
      console.log(err);
    } else {
      res.send({data: data});
    }
  });
};


var submitNewAcute = function(req, res) {
  var id = req.body.id;
  // check to see if there is already data in the table
  problemListDB.getAllAcute(id, function(data, err) {
    if(err) {
      console.log(err);
    } 
    else {
      // if there is no data in the table yet
      if(data.length == 0){
          // we create a new entry here
          problemListDB.putNewAcute(req.body.id, req.body.acuteDiagnosis, 
            req.body.acuteDetails, req.body.acuteTreatment, req.body.acuteDateOnset,
            req.body.acuteEndDate, function(data, err) {
              if(err) {
                console.log(err);
              } else {
                res.send({data: data});
              }
            });
      } // if there is already data in the table so we need to update it
      else {
          // this function takes in existing data and updates it
          problemListDB.putAcuteEntry(req.body.id, req.body.acuteDiagnosis, 
            req.body.acuteDetails, req.body.acuteTreatment, req.body.acuteDateOnset,
            req.body.acuteEndDate, function(data, err) {
            if(err){
              console.log("error")
            }
            else if(data){
              res.send({
                data: data
              });
            }
          });
      }
    }
  });
};

var problemListRoutes = {
  get_all_chronic: getAllChronic,
  submit_chronic: submitNewChronic,
  get_all_acute: getAllAcute,
  submit_acute: submitNewAcute
};

module.exports = problemListRoutes;
var patientsDB = require('../database/patientsDB.js');
var immRecordDB = require('../database/immRecordDB.js');

var getAllImmRecords = function(req, res) {
  console.log("!!! get all imm in routes !!!");
  
  var id = req.body.id;
  console.log(id);
  immRecordDB.getAllRecords(id, function(data, err) {
    if(err) {
      console.log("!!!DB ERROR!!!");
      console.log(err);
    } else {
      console.log("DB SUCCESS");
      res.send({data: data});
    }
  });
};

var submitImmunization = function(req, res) {
  console.log("!!! submit imm in routes!!");
  console.log(id);
  var id = req.body.id;
    // check to see if there is already data in the table
    immRecordDB.getAllRecords(id, function(data, err) {
      if(err) {
        console.log(err);
      } else {
      // if there is no data in the table yet
      if(data.length == 0){
        // we create a new entry here
        immRecordDB.putNewRecord(req.body.id, req.body.age, req.body.immunization,
          req.body.lot, req.body.dueDate, req.body.dateCompleted, req.body.notes,
          function(data, err) {
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
        immRecordDB.putRecordEntry(req.body.id, req.body.age, req.body.immunization,
          req.body.lot, req.body.dueDate, req.body.dateCompleted, req.body.notes,
          function(data, err) {
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

  var editImmunization = function (req, res) {
    console.log("editImmunization called in routes");
    // this function takes in existing data and edits it
    immRecordDB.editRecord(req.body.id, req.body.age, req.body.immunization,
      req.body.lot, req.body.dueDate, req.body.dateCompleted, req.body.notes, req.body.preEditData,
      function (data, err) {
        if (err) {
          console.log("error in editImmunization route");
        }
        else if (data) {
          res.send({
            data: data
          });
        }
      });
  };

  var deleteImmunization = function (req, res) {
    console.log("deleteAcute called in routes");
    // this function takes in existing data and updates it
    immRecordDB.deleteImmRecord(req.body.id, req.body.preEditData,
      function (data, err) {
        if (err) {
          console.log("error in deleteImmunization route");
        }
        else if (data) {
          res.send({
            data: data
          });
        }
      });
  };

  var immRecordRoutes = {
    get_all_immune_records: getAllImmRecords,
    submit_immunization: submitImmunization,
    edit_immunization: editImmunization,
    delete_immunization: deleteImmunization,
  };

  module.exports = immRecordRoutes;
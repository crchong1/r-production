var patientsDB = require('../database/patientsDB.js');
var weightDB = require('../database/weightDB.js');
var problemListDB = require('../database/problemListDB.js');
var allergyDB = require('../database/allergyDB.js');

// this function renders login.ejs first now
var getMain = function (req, res) {
  res.render('login.ejs');
}

// renders the form page which is used to submit a new patient
var getForm = function (req, res) {
  res.render('form.ejs');
}

// renders the patientSearch page which has a search bar
var getSearchPatients = function (req, res) {
  res.render('patientSearch.ejs');
}

var getPharmacy = function(req, res) {
	res.render('pharmacy.ejs');
}
var getDispensary = function(req, res){
	res.render('dispensary.ejs');
}

var getAnyPatientPage = function (req, res) {
  var id = decodeURI(req.params.id); // gets id from url
  var age = 'undefined';

  patientsDB.getPatientById(id, function (data, err) {

    if (err) {
      console.log(err);
    } else {
      // render the patientPage with the returned data

      res.render('template.ejs', { data: data[0], age });
    }
  });
}


var getWccForm = function (req, res) {
  console.log('here')
  console.log(req.body)
  var id = decodeURI(req.params.id); // gets id from url
  var age = req.body.age;
  console.log('age: ' + age);
  patientsDB.getPatientById(id, function (data, err) {
    if (err) {
      console.log(err);
    } else {
      // render the patientPage with the returned data
      console.log('here')
      res.render('template.ejs', { data: data[0], age: req.body.age });
    }
  });
}



// saves a new patient to the database, and returns patient data 
// params: a JSON of data from form
// returns: patient data (why though??? unclear)
// used in form.ejs in views
var submitPatient = function (req, res) {
  console.log(req.body);
  patientsDB.putPatient(req.body, function (data, err) {
    if (err) {
      console.log("error")
    }
    else if (data) {
      res.send({
        message: '',
        patient: data
      });
    }
    else {
    }
  })
  res.render('form.ejs')
}

//used to render the patient page depending on the url of the patient that was clicked
//params: patient url with id embedded in url
var getPatient = function (req, res) {
  var id = decodeURI(req.params.id); // gets id from url
  patientsDB.getPatientById(id, function (data, err) {
    if (err) {
      console.log(err);
    } else {
      // render the patientPage with the returned data
      res.render('template.ejs', { data: data[0], url: 'patientPage' });
    }
  });
};

// this function finds all the patients starting with the input
// it will then return the data back in JSON format
var getPatientKeys = function (req, res) {
  console.log('get patient: ' + req.body.search);
  // get the field and the search data from the body
  var search = req.body.search;
  var field = req.body.field;
  // pass the fields in the getPatientKeys function in patientsDB
  patientsDB.getPatientKeys(search, field, function (data, err) {
    if (err) {
      alert("Error from getPatientKeys, patients DB, in routes.js -> getPatientKeys")
    }
    else if (data) {
        res.send({
        message: '',
        patient: data
      });
    }
    else {
      alert("No data or error in routes.js -> getPatientKeys")
    }
  });
}

// display the weight page
var getWeightPage = function (req, res) {
  res.render('weight.ejs');
};

var getAllWeights = function (req, res) {
  var id = req.body.id;
  weightDB.getAllWeights(id, function (data, err) {
    if (err) {
      console.log(err);
    } else {
      console.log("data1: " + data);
      res.send({ data: data });
    }
  });
};
var submitNewWeight = function (req, res) {
  var id = req.body.id;
  // check to see if there is already data in the table
  weightDB.getAllWeights(id, function (data, err) {
    if (err) {
      console.log(err);
    } else {
      // if there is no data in the table yet
      if (data.length == 0) {
        // we create a new entry here
        weightDB.putNewWeightHistory(req.body.id, req.body.weight, req.body.date, function (data, err) {
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
        weightDB.putWeightEntry(req.body.id, req.body.weight, req.body.date, function (data, err) {
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

var submitNewTest = function (req, res) {
  console.log(req.body)
  var data = req.body
  res.send({ data: data })
}

//functions for allergy problems
var getAllAllergy = function (req, res) {
  console.log("getAllAllergy called in routes")
  var id = req.body.id;
  allergyDB.getAllAllergy(id, function (data, err) {
    if (err) {
      console.log(err);
    } else {
      console.log("allergy routes data: " + data);
      res.send({ data: data });
    }
  });
};

var submitNewAllergy = function (req, res) {
  console.log("submitNewAllergy called in routes")
  var id = req.body.id;
  // check to see if there is already data in the table
  allergyDB.getAllAllergy(id, function (data, err) {
    if (err) {
      console.log(err);
    } else {
      // if there is no data in the table yet
      if (data.length == 0) {
        // we create a new entry here
        allergyDB.putNewAllergy(req.body.id, req.body.allergen,
          req.body.allergySymptoms, req.body.allergySeverity, req.body.allergyDateOnset,
          req.body.allergyNotes, function (data, err) {
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
        allergyDB.putAllergyEntry(req.body.id, req.body.allergen,
          req.body.allergySymptoms, req.body.allergySeverity, req.body.allergyDateOnset,
          req.body.allergyNotes, function (data, err) {
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

var editAllergy = function (req, res) {
  console.log("editAllergy called in routes")
  // this function takes in existing data and updates it
  allergyDB.editAllergy(req.body.id, req.body.allergen,
    req.body.allergySymptoms, req.body.allergySeverity, req.body.allergyDateOnset,
    req.body.allergyNotes, req.body.preEditData, function (data, err) {
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


var deleteAllergy = function (req, res) {
  console.log("deleteAllergy called in routes")
  allergyDB.deleteAllergy(req.body.id, req.body.preEditData, function (data, err) {
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
var routes = {
  get_any_patient_page: getAnyPatientPage,
  get_main: getMain,
  get_form: getForm,
  get_wcc_form: getWccForm,
  get_weight_page: getWeightPage,
  get_patient_page: getPatient,
  get_pharmacy_page: getPharmacy,
  get_dispenary: getDispensary,
  submit_patient: submitPatient,
  get_patient_keys: getPatientKeys,
  get_patient_search: getSearchPatients,
  get_all_weights: getAllWeights,
  submit_weight: submitNewWeight,
  submit_test: submitNewTest,
  get_all_allergy: getAllAllergy,
  submit_allergy: submitNewAllergy,
  delete_allergy: deleteAllergy,
  edit_allergy: editAllergy
};

module.exports = routes;

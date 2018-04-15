var patientsDB = require('../database/patientsDB.js');
var historyDB = require('../database/historyDB.js');

var getAllLivingHistory = function(req, res) {
  var id = req.body.id;
  historyDB.getAllLivingHistory(id, function(data, err) {
    if(err) {
      console.log(err);
    } else {
      res.send({data: data});
    }
  });
};
  
var submitLiving = function(req, res) {
  var id = req.body.id;
    // check to see if there is already data in the table
  historyDB.getAllLivingHistory(id, function(data, err) {
    if(err) {
      console.log(err);
    } else {
      // if there is no data in the table yet
      if(data.length == 0){
        // we create a new entry here
        historyDB.putNewLivingHistory(req.body.id, req.body.house, 
          req.body.startAge, req.body.startDate, req.body.endDate,
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
        historyDB.putLivingHistory(req.body.id, req.body.house, 
            req.body.startAge, req.body.startDate, req.body.endDate,
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

var getAllFeedingHistory = function(req, res) {
  var id = req.body.id;
  historyDB.getAllFeedingHistory(id, function(data, err) {
    if(err) {
      console.log(err);
    } else {
      res.send({data: data});
    }
  });
};

var submitFeeding = function(req, res) {
  var id = req.body.id;
  // check to see if there is already data in the table
  historyDB.getAllFeedingHistory(id, function(data, err) {
    if(err) {
      console.log(err);
    } 
    else {
      // if there is no data in the table yet
      if(data.length == 0){
          // we create a new entry here
          historyDB.putNewFeedingHistory(req.body.id, req.body.underweight, 
            req.body.brand, req.body.amount, req.body.startDate,
            req.body.endDate, function(data, err) {
              if(err) {
                console.log(err);
              } else {
                res.send({data: data});
              }
            });
      } // if there is already data in the table so we need to update it
      else {
          // this function takes in existing data and updates it
          historyDB.putFeedingHistory(req.body.id, req.body.underweight, 
            req.body.brand, req.body.amount, req.body.startDate,
            req.body.endDate, function(data, err)  {
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


var updateSocialHistory = function(req, res) {
    var id = req.body.id;
    var text = req.body.text;
    historyDB.updateSocialHistory(id, text, function(data, err) {
      if(err) {
        console.log(err);
      } else {
        res.send({data: data});
      }
    });
};

var updateBackground = function(req, res) {
    var id = req.body.id;
    var text = req.body.text;
    historyDB.updateBackground(id, text, function(data, err) {
      if(err) {
        console.log(err);
      } else {
        res.send({data: data});
      }
    });
};

var historyRoutes = {
  get_all_feeding_history: getAllFeedingHistory,
  submit_feeding: submitFeeding,
  get_all_living_history: getAllLivingHistory,
  submit_living: submitLiving,
  update_social_history: updateSocialHistory,
  update_background: updateBackground
};

module.exports = historyRoutes;
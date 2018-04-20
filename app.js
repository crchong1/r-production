/* Some initialization boilerplate. Also, we include the code from
   routes/routes.js, so we can have access to the routes. Note that
   we get back the object that is defined at the end of routes.js,
   and that we use the fields of that object (e.g., routes.get_main)
   to access the routes. */

var express = require('express');
var app = express();
app.use(express.bodyParser());
app.use(express.logger("default"));
app.use(express.static('static'));

var routes = require('./routes/routes.js');
var problemListRoutes = require('./routes/problemListRoutes.js');
var medicationRoutes = require('./routes/medicationRoutes.js');
var historyRoutes = require('./routes/historyRoutes.js');
var scans = require('./routes/scans.js');


/* Below we install the routes. The first argument is the URL that we
   are routing, and the second argument is the handler function that
   should be invoked when someone opens that URL. Note the difference
   between app.get and app.post; normal web requests are GETs, but
   POST is often used when submitting web forms ('method="post"'). */

app.get('/', routes.get_main);
app.get('/patientSearch', routes.get_patient_search);
app.get('/patientPage/:id', routes.get_any_patient_page);
app.get('/patientPage/:id/history', routes.get_any_patient_page);
app.get('/patientPage/:id/problemList', routes.get_any_patient_page);
app.get('/patientPage/:id/medications', routes.get_any_patient_page);
app.get('/patientPage/:id/allergies', routes.get_any_patient_page);
app.get('/patientPage/:id/immunization', routes.get_any_patient_page);
app.get('/patientPage/:id/testing', routes.get_any_patient_page);
app.get('/patientPage/:id/growthCharts', routes.get_any_patient_page);
app.get('/patientPage/:id/wellChildCheck', routes.get_any_patient_page);
app.get('/patientPage/:id/wellChildCheck/form', routes.get_wcc_form);
app.post('/patientPage/:id/wellChildCheck/form', routes.get_wcc_form);
app.get('/patientPage/:id/wellChildCheck/formBaby', routes.get_any_patient_page);
app.get('/pharmacy', routes.get_pharmacy_page);
app.get('/dispensary', routes.get_dispenary);

app.get('/patientPage/:id/wellChildCheck/page', routes.get_any_patient_page);
app.get('/patientPage/:id/nurseNotes', routes.get_any_patient_page);
app.get('/patientPage/:id/nurseNotes/vitalSigns', routes.get_any_patient_page);
app.get('/patientPage/:id/nurseNotes/symptomAnalysis', routes.get_any_patient_page);
app.get('/patientPage/:id/nurseNotes/systemAssessments', routes.get_any_patient_page);
app.get('/patientPage/:id/nurseNotes/miscellaneous', routes.get_any_patient_page);
app.get('/patientPage/:id/scans', routes.get_any_patient_page);

app.get('/weight', routes.get_weight_page);
app.get('/form', routes.get_form);

app.post('/getAllWeights', routes.get_all_weights);
app.post('/weight', routes.submit_weight);
app.post('/addTest', routes.submit_test);
app.post('/form', routes.submit_patient);
app.post('/getPatientKeys', routes.get_patient_keys);

//problem list page
app.post('/getAllChronic', problemListRoutes.get_all_chronic);
app.post('/chronicProblem', problemListRoutes.submit_chronic);
app.post('/editChronic', problemListRoutes.edit_chronic);
app.post('/deleteChronic', problemListRoutes.delete_chronic);

app.post('/getAllAcute', problemListRoutes.get_all_acute);
app.post('/acuteProblem', problemListRoutes.submit_acute);
app.post('/editAcute', problemListRoutes.edit_acute);
app.post('/deleteAcute', problemListRoutes.delete_acute);


//allergy page
app.post('/getAllAllergy', routes.get_all_allergy);
app.post('/allergy', routes.submit_allergy);
app.post('/editAllergy', routes.edit_allergy);
app.post('/deleteAllergy', routes.delete_allergy);

//medication page
app.post('/getAllChronicMed', medicationRoutes.get_all_chronic_med);
app.post('/chronicMed', medicationRoutes.submit_chronic_med);
app.post('/editChronicMed', medicationRoutes.edit_chronic_med);
app.post('/deleteChronicMed', medicationRoutes.delete_chronic_med);

app.post('/getAllAcuteMed', medicationRoutes.get_all_acute_med);
app.post('/acuteMed', medicationRoutes.submit_acute_med);
app.post('/editAcuteMed', medicationRoutes.edit_acute_med);
app.post('/deleteAcuteMed', medicationRoutes.delete_acute_med);


//Patient History page
app.post('/getAllFeedingHistory', historyRoutes.get_all_feeding_history);
app.post('/submitFeeding', historyRoutes.submit_feeding);
app.post('/getAllLivingHistory', historyRoutes.get_all_living_history);
app.post('/submitLiving', historyRoutes.submit_living);
app.post('/updateSocialHistory', historyRoutes.update_social_history);
app.post('/updateBackground', historyRoutes.update_background);

//Pharmacy page
app.post('/getAllPharmacy', routes.get_all_pharmacy);
app.post('/pharmacy', routes.submit_pharmacy);
app.post('/editPharmacy', routes.edit_pharmacy);
app.post('/deletePharmacy', routes.delete_pharmacy);

/* Run the server */
console.log('Author: Connor Chong (conchong)');
app.listen(8080);
console.log('Server running on port 8080. Now open http://localhost:8080/ in your browser!');

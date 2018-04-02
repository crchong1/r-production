/* Some initialization boilerplate. Also, we include the code from
   routes/routes.js, so we can have access to the routes. Note that
   we get back the object that is defined at the end of routes.js,
   and that we use the fields of that object (e.g., routes.get_main)
   to access the routes. */

var express = require('express');
var routes = require('./routes/routes.js');
var app = express();
app.use(express.bodyParser());
app.use(express.logger("default"));
app.use(express.static('static'));


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

app.post('/getAllChronic', routes.get_all_chronic);
app.post('/chronicProblem', routes.submit_chronic);
app.post('/getAllAcute', routes.get_all_acute);
app.post('/acuteProblem', routes.submit_acute);

/* Run the server */
console.log('Author: Connor Chong (conchong)');
app.listen(8080);
console.log('Server running on port 8080. Now open http://localhost:8080/ in your browser!');

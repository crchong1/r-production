
//var script = "/files/js/pageScript.js";
 //   $.getScript(script);

$(document).ready(function(){
      console.log('nursenotes')
      $("input[name=problem]:radio").change(function () {
        console.log('here')
        var selected = $("input[name=problem]:checked").val();
        console.log(selected)
        if (selected === 'newProblem') {
          //addProblem(this);
                              $('#continuingForm').hide()
                    $('#problemForm').show();
        } else if (selected === 'correspondingProblem') {
          $('#problemForm').hide();
          $('#continuingForm').show();
        }
      });






    });


function addProblem(thiss) {
  var form = "";
  form += '<form id="problemForm" class="tr addForm collapse"> \
  <span class="td"><input type="text" name="diagnosis" placeholder="Diagnosis"></span> \
  <span class="td"><input type="text" name="details" placeholder="Details"></span> \
  <span class="td"><input type="text" name="treatment" placeholder="Treatment"></span> \
  <span class="td"><input type="text" name="onset" class="datepicker form-control" ></span> \
  <span class="td"><input type="text" name="resolution" placeholder="Resolution"></span> \
  <input type="submit" value="Submit" id="submit" name="submit" class="btn btn-primary formSubmit"> \
  <input type="button" value="Cancel" name="cancel" class="btn btn-danger formSubmit cancel" data-toggle="collapse" data-target="#chronicForm"> \
  </form>';
  $(thiss).next().append(form);

  $(function () {
    $('.datepicker').datepicker({ 
      autoclose: true, 
      todayHighlight: true
    }).datepicker('update', new Date());
  });


} 







/*



      $(function () {
        $('.datepicker').datepicker({ 
          autoclose: true, 
          todayHighlight: true
        }).datepicker('update', new Date());
      });

  // Make sidebar sticky
  var elements = document.querySelectorAll('.sticky');
  Stickyfill.add(elements);


  // Initial Page Load
  $.ajax({
    type: 'POST',
    url: '/getPatientKeys',
    data: {
      search: '',
      field: 'lastName',
    },
    success: function(result) {
      patients = result.patient;
      getPatientData(result.patient);
    }
  });


     // Show and hide buttons and forms on click
     $('form').hide();
     $('.add').on('click', function() {
      $(this).hide();
      $(this).parent().parent().find('.addForm').show();
      setCss(this);
      console.log('add form')



    });

     $('.section').on('click', '.editBtn', function() {
      $('.editBtn').hide()
      var row = $(this).closest('.row');
      $(row).attr('id', 'editingRow');
      console.log(row)
      row.hide();
  //  editEntry(row);
  editEntryGeneric(row);
  setCss(this);

    // row.remove();

  });


     $('.section').on('click', '.editCard', function() {
      $('.editBtn').hide();
      $('.editCard').hide();
      var content = $(this).closest('.section').find('.container');
      $(content).attr('id', 'editingRow');
      content.hide();
      var form = $('#editingRow').closest('.section').find('form')[0];
      var background = $('#backgroundInfo')[0].innerHTML;
      $(form).find('textarea').attr({'value': background})
      $(form).show();
    });
    // Cancel edit and re-display entry
    $('.section').on('click', '.cancelCardEdit',function(event) {
      console.log('cancel edit')
      var form = $('#editingRow').closest('.section').find('form')[0];
      $(form).hide();
      $('#editingRow').show();
      $('.editBtn').show();
      $('.editCard').show();
      $('#editingRow').removeAttr('id');
    });

        // Cancel edit and re-display entry
        $('.section').on('click', '.cancelEdit',function(event) {
          console.log('cancel edit')
          var form = '#' + $(this).closest('.section').find('form').attr('id');
          $(form).remove();
          $('#editingRow').show();
          $('.editBtn').show();
          $('#editingRow').removeAttr('id');
        });

        // Cancel new entry
        $('.section').on('click', '.cancel',function(event) {
          var form = '#' + $(this).closest('.section').find('form').attr('id');
          console.log('cancel')
          $(form)[0].reset();
          $(form).hide();
          $(form).closest('.section').find('.add').show();
        });

        // Handles deletion of entry
        $('.section').on('click', '.delete',function(event) {
          console.log('delete entry')
          var form = '#' + $(this).closest('.section').find('form').attr('id');
          $(form).remove();
          alert('Are you sure you want to delete this entry?')
          $('#editingRow').remove();
          $('.editBtn').show();
        });

        // Handles for submission for adding new entry
        $('.section').on('submit', '.addForm', function(event) {
          event.preventDefault();
          console.log("on submit");
          var formData = $(this).serializeArray();
          var form = this.id;
          var type = form.substring(0, ((form.length)-4));

          $.ajax({
            type: 'POST',
            url: '/addTest',
            data: { 
              formData,
              form: form,
              type: type
            },

            success: function (result) {
              var form = '#' + result.data.form;
              $(form)[0].reset();
              $(form).hide();
              console.log('add form reset')
              $(form).closest('.section').find('.add').show();
              updateTable(result.data, result.data.type);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
              console.error("error: " + errorThrown);
            }
          });

        });

         // Handles for submission for editing existing entry
         $('.section').on('submit', '.editForm', function(event) {
          event.preventDefault();
          console.log("on submit");
          var formData = $(this).serializeArray();
          var form = this.id;
          var type = form.substring(0, ((form.length)-4));

          $.ajax({
            type: 'POST',
            url: '/addTest',
            data: { 
              formData,
              form: form,
              type: type
            },


            success: function (result) {
              console.log(result);
              var form = '#' + result.data.form;
              var hiddenRow = $(form).prev();
              hiddenRow.remove();

              console.log(result.data.type)
              // $(form).hide();
              $('.editBtn').show();
              $('#editForm').remove();

              updateTable(result.data, result.data.type);

            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
              console.error("error: " + errorThrown);
            }
          });

        });

       });

  // Not right, need to update based on all data in the patient, not just append as most recent
  var updateTable = function(data, type ) {
    var formData = data.formData;
    var table = '#' + type + 'TableBody'
    var tableData = '<tr>';
    for (i = 0; i < formData.length; i++) {
      tableData += '<td>' + formData[i].value + '</td>'
    }
    tableData += '<td><button class="edit btn">Edit</button></td></tr>'
    $(table).append(tableData);
  }

  
  var setCss = function(thiss) {
    var form = $(thiss).closest('.section').find('form');
    $(form).first().css("display", "inline-flex")
    var formElms = $(form).find('div').children('span')
    var items = $(thiss).closest('.section').find('tr').children('th'); 
    if (items.length == 0) {
      var items = $(thiss).closest('.section').find('.labels').children('div'); 
    }
    for (var i = 0; i < items.length - 1; i++) {
      var width = (items[i].offsetWidth).toString() + 'px';
      var elm = formElms[i];

      $(elm).css({'width': width, 'padding': '4px'})
      $(elm).children().css({'background':'#f6f6f7', 'max-width':width,'border-width':'2px', 'border-radius': '3px'});
    }
  } 

  var editEntryGeneric = function(row) {
    // getting values from row
    var data = [];
    var table = document.getElementById("editingRow"); 
    var cells = $(table).children('div').children('div');
    for (var i = 0; i < cells.length; i++) {
      data.push(cells[i].innerHTML);
    }
    
    var form = $('#editingRow').closest('.section').find('form')[0].outerHTML;
    $(row).after(form);
    $(row).next().attr('id', 'editForm')
    // getting form input name fields
    var items = $("#editForm :input").map(function(index, elm) {
      return {name: elm.name, type:elm.type, value: $(elm).val()};
    });
    // setting form name attributes to be same as previous values
    for (var i = 0; i < items.length - 2; i++) {
      // For select boxes
      if (items[i].type === 'select-one') {
        var match = data[i].toString();
        var itemName = items[i].name.toString();
        var name = '[name="' + itemName + '"] option[value="' + match + '"]';
        $(name).attr("selected", "selected")

        // For radio boxes
      } else if (items[i].type === 'radio') {
        if (data[i].toString().trim() == 'Yes') {
          var item = items[i].name
          var name = 'input[name="' + item + '"]'
          $(name).first().prop('checked', true);
        }

        // For text boxes and date
      } else {
        var name = '#editForm input[name=' + items[i].name;
        var val = data[i];
        $(name).attr('value', val)
      }

    }
    // finalizing form appearance
    $('#editForm').attr('class', 'editForm')
    //$('#editForm').show();
    $('#editForm').find("[name='cancel']").attr('class', 'formSubmit cancelEdit')
    $('#editForm').find("[value='Submit']").before('')
    $('#editForm').find('.cancelEdit').after('<input type="button" value="Delete" name="delete" class="formSubmit delete"/>');

  }


  // Displays the patient's data on page
  var getPatientData = function(patient) {
    var temp = patient;
        // temporary data
        var allergies = [{allergen: 'peanut', severity: 'mild', reaction: 'throat closure', onsent: '12-08-2009', notes: 'avoid tree nuts in general, especially almonds'}];
        console.log('here:' + patient);

        var cards = "";
        var date = new Date(2018,2,12);
        var i = 1;
        var patient = patient[i];

        // Update sidebar content
        $('#name').text(patient.firstName + ' ' + patient.lastName);
  $('#ageSex').text(getAge(patient.birthdate) + ', ' + 'F' ); //paitient.sex
  $('#dob').text(patient.birthdate);
  $('#heightWeight').text(patient.height + " cm, " + patient.weight + " kgs");
  $('#allergiesSide').text('Allergies: ' + allergies[0].allergen );

}

function getAge(fromdate, todate){
  if(todate) todate= new Date(todate);
  else todate= new Date();

  var age= [], fromdate= new Date(fromdate),
  y= [todate.getFullYear(), fromdate.getFullYear()],
  ydiff= y[0]-y[1],
  m= [todate.getMonth() + 1, fromdate.getMonth()],
  mdiff= m[0]-m[1],
  d= [todate.getDate(), fromdate.getDate()],
  ddiff= d[0]-d[1];

  if(mdiff < 0 || (mdiff=== 0 && ddiff<0))--ydiff;
  if(mdiff<0) mdiff+= 12;
  if(ddiff<0){
    fromdate.setMonth(m[1]+1, 0);
    ddiff= fromdate.getDate()-d[1]+d[0];
    --mdiff;
  }
  w = Math.floor(ddiff/7);
  ddiff = ddiff % 7;
                  // 3 or older -> show year
                  if (ydiff > 2) age.push(ydiff+ ' year'+(ydiff> 1? 's ':' '));
                  else if (ydiff> 0) {
                    // Over a year -> show year and month
                    age.push(ydiff+ ' year'+(ydiff> 1? 's ':' '));
                    if(mdiff> 0) age.push(mdiff+ ' month'+(mdiff> 1? 's':''));
                    // Less than a year -> show month and day
                  } else if (mdiff> 3) {
                    age.push(mdiff+ ' month'+(mdiff> 1? 's':''));
                    if (w> 0) age.push(w+ ' week' + (w> 1? 's':''));
                  } else if (mdiff>0) {
                    age.push(mdiff+ ' month'+(mdiff> 1? 's ':' '));
                    if(w> 0) age.push(w+ ' week'+(w> 1? 's':''));
                  } else {
                    if(w> 0) age.push(w+ ' week'+(w> 1? 's':''));
                    if(ddiff> 0) age.push(ddiff+ ' day'+(ddiff> 1? 's':''));
                  }

                  if(age.length>1) age.splice(age.length-1,0,' and ');    
                  return age.join('');
                }


                */


$(document).ready(function () {

	//console.log("ready");

	$('#header').load('/files/html/header.html');

	$(function () {
		$('.datepicker').datepicker({
			autoclose: true,
			todayHighlight: true
		}).datepicker('update', new Date());
	});

	// Make sidebar sticky
	var elements = document.querySelectorAll('.sticky');
	Stickyfill.add(elements);

	// Show and hide buttons and forms on click
	$('.addForm').hide();
	$('.editForm').hide();
	$('.add').on('click', function () {
		$(this).closest('.section').find('.addForm').show();
		$(this).hide();
		setCss(this);
	});

	//  var index;
	//  $('.section').on('click', '.editBtn', function() {
	//  	var edits = $(this).closest('.section').find('.editBtn');
	//  	index = ($(edits).index(this));

	//  	$('.editBtn').hide()
	//  	var row = $(this).parent().parent();
	//  	$(this).parent().parent().attr('id', 'editingRow');
	//  	setCss(this);
	//  	console.log(row)
	//  	row.hide();
	// //	editEntry(row);
	// editEntryGeneric(row);
	// 	// row.remove();
	// 	console.log(index)
	// });




	// Cancel edit and re-display entry
	$('.section').on('click', '.cancelEdit', function (event) {
		console.log('cancel edit')
		var row = $(this).parent().prev();
		var form = '#' + $(this).closest('.section').find('form').attr('id');
		$(form).remove();
		$(row).show();
		$('.editBtn').show();
	});

	// Cancel new entry
	$('.section').on('click', '.cancel', function (event) {
		var form = '#' + $(this).closest('.section').find('form').attr('id');
		console.log('cancel')
		$(form)[0].reset();
		$(form).hide();
		$(form).parent().find('button').show();
	});
});

// Not right, need to update based on all data in the patient, not just append as most recent
var updateTable = function (data, type) {
	console.log("data in updateTable in pageScript: " + data);
	console.log("data.formData in updateTable in pageScript: " + data.formData);
	var formData = data.formData;
	var table = '#' + type + 'TableBody'
	var tableData = '<tr>';
	for (i = 0; i < formData.length; i++) {
		tableData += '<td>' + formData[i].value + '</td>'
	}
	tableData += '<td><button class="edit btn">Edit</button></td></tr>'
	$(table).append(tableData);
}

// "thiss" is not a typo
var setCss = function (thiss) {
	var form = $(thiss).closest('.section').find('form');
	var formElms = $(form).children('span')
	var items = $(thiss).closest('.section').find('tr').children('th');
	for (var i = 0; i < items.length - 1; i++) {
		var width = items[i].offsetWidth.toString() + 'px';
		var elm = formElms[i];
		$(elm).css({ 'width': width, 'padding': '4px' })
		$(elm).children().css({ 'background': '#f6f6f7', 'max-width': width, 'border-width': '2px', 'border-radius': '3px' });
	}
}

var editEntryGeneric = function (row) {
	// getting values from row
	var data = [];

	$(row).children("td").each(function(index, td){
		data.push($(td).html());
	})

	var form = $(row).closest('.section').find('form')[0].outerHTML;
	$(row).after(form);
	$(row).next().attr('id', 'editForm')
	console.log($('#editForm'))
	// getting form input name fields
	var items = $("#editForm :input").map(function (index, elm) {
		return { name: elm.name, type: elm.type, value: $(elm).val() };
	});
	console.log(data)
	console.log(items)
	// setting form name attributes to be same as previous values
	for (var i = 0; i < items.length - 2; i++) {
		// For select boxes
		if (items[i].type === 'select-one') {
			var match = data[i].toString();
			var itemName = items[i].name.toString();
			var name = '[name="' + itemName + '"] option[value="' + match + '"]';
			$(name).attr("selected", "selected")
		} 
		// For radio boxes
		else if (items[i].type === 'radio') {
			var match = data[i].toString();
			var name = '[value="' + match + '"]';
			if (data[i] === 'Yes') {
				$(name).prop('checked', true)
			} else {
				$(name).prop('checked', true)
			}
		} 
		// date
		else if (items[i].type == 'date') {
			var name = '#editForm input[name=' + items[i].name;
			var val = data[i];

			//turns date string into html value readable value
			$(name).val(new Date(val).toISOString().substr(0, 10));
		}
		// For text boxes 
		else if (items[i].type == 'textarea') {
			var name = '#editForm textarea[name=' + items[i].name;
			var val = data[i];
			$(name).val(val);
		// for other inputs
		}else {
			var name = '#editForm input[name=' + items[i].name;
			var val = data[i];
			$(name).val(val);
		}
	}
	// finalizing form appearance
	$('#editForm').attr('class', 'tr editForm')
	$('#editForm').show();
	$('#editForm').find("[name='cancel']").attr('class', 'formSubmit cancelEdit')
	$('#editForm').find("[value='Submit']").before('')
	$('#editForm').find('.cancelEdit').after('<input type="button" value="Delete" name="delete" class="formSubmit delete"/>');

}


// Displays the patient's data on page
var getPatientData = function (patient) {
	var temp = patient;
	// temporary data
	var allergies = [{ allergen: 'peanut', severity: 'mild', reaction: 'throat closure', onsent: '12-08-2009', notes: 'avoid tree nuts in general, especially almonds' }];
	console.log('here:' + patient);

	var cards = "";
	var date = new Date(2018, 2, 12);
	var i = 1;
	var patient = patient[i];

	// Update sidebar content
	$('#name').text(patient.firstName + ' ' + patient.lastName);
	$('#ageSex').text(getAge(patient.birthdate) + ', ' + 'F'); //paitient.sex
	$('#dob').text(patient.birthdate);
	$('#heightWeight').text(patient.height + " cm, " + patient.weight + " kgs");
	$('#allergiesSide').text('Allergies: ' + allergies[0].allergen);
}

function getAge(fromdate, todate) {
	if (todate) todate = new Date(todate);
	else todate = new Date();

	var age = [], fromdate = new Date(fromdate),
		y = [todate.getFullYear(), fromdate.getFullYear()],
		ydiff = y[0] - y[1],
		m = [todate.getMonth() + 1, fromdate.getMonth()],
		mdiff = m[0] - m[1],
		d = [todate.getDate(), fromdate.getDate()],
		ddiff = d[0] - d[1];

	if (mdiff < 0 || (mdiff === 0 && ddiff < 0))--ydiff;
	if (mdiff < 0) mdiff += 12;
	if (ddiff < 0) {
		fromdate.setMonth(m[1] + 1, 0);
		ddiff = fromdate.getDate() - d[1] + d[0];
		--mdiff;
	}
	w = Math.floor(ddiff / 7);
	ddiff = ddiff % 7;
	// 3 or older -> show year
	if (ydiff > 2) age.push(ydiff + ' year' + (ydiff > 1 ? 's ' : ' '));
	else if (ydiff > 0) {
		// Over a year -> show year and month
		age.push(ydiff + ' year' + (ydiff > 1 ? 's ' : ' '));
		if (mdiff > 0) age.push(mdiff + ' month' + (mdiff > 1 ? 's' : ''));
		// Less than a year -> show month and day
	} else if (mdiff > 3) {
		age.push(mdiff + ' month' + (mdiff > 1 ? 's' : ''));
		if (w > 0) age.push(w + ' week' + (w > 1 ? 's' : ''));
	} else if (mdiff > 0) {
		age.push(mdiff + ' month' + (mdiff > 1 ? 's ' : ' '));
		if (w > 0) age.push(w + ' week' + (w > 1 ? 's' : ''));
	} else {
		if (w > 0) age.push(w + ' week' + (w > 1 ? 's' : ''));
		if (ddiff > 0) age.push(ddiff + ' day' + (ddiff > 1 ? 's' : ''));
	}

	if (age.length > 1) age.splice(age.length - 1, 0, ' and ');
	return age.join('');
}


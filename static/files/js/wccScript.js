

$(document).ready(function() {


	console.log('wccscript')
	$('#showMoreUpcoming').on('click', function() {
		var val = $(this).attr('value')
		if (val === 'Show More') {
			$(this).attr('value', 'Show Less')
		} else {
			$(this).attr('value', 'Show More')
		}
		$('.more').toggle();
	});

	$('.linkBtn').on('click', function() {
		console.log(this)
		var age = this.innerHTML;
		age = age.split(' ')[0];
		console.log(age);
		console.log("/patientPage/"+patientId+"/wellChildCheck/form")
		// $.post( "/patientPage/"+patientId+"/wellChildCheck/form", { age: age} );

		$.ajax({
	      		type: 'GET',
	      		url: "/patientSearch", //"/patientPage/"+patientId+"/wellChildCheck/form",
	      		data: { 
	      			data: age
	      		},

	      		success: function (result) {
	      			// alert('success');
	      		},
	      		error: function(XMLHttpRequest, textStatus, errorThrown) {
	      			console.error("error: " + errorThrown);
	      		}
	      	});
/*
		$.ajax({
			url: '/patientPage/'+patientId+'/wellChildCheck/form',
			type: 'GET',
			data: age,
			success: function(res) {
				console.log(res);
				alert(res);
			});
	});
	*/
	});

});



/*
console.log('adf')
get();
$('document').ready(function() {
console.log('wccscript')
afd();
   $('#showMoreUpcoming').on('click', function() {
     var val = $(this).attr('value')
     if (val === 'Show More') {
      $(this).attr('value', 'Show Less')
    } else {
      $(this).attr('value', 'Show More')
    }
    $('.more').toggle();
var patientId = <%=data.id%>;
    console.log(patientId);
  });


});
*/

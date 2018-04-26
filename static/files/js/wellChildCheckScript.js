


$(document).ready(function(){
  
  var replaced = $("#all").html().replace(/patientId/g, patientId);
$("#all").html(replaced);

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
  $.get( "wccFormContent", { age: age} );
});


    });


/*
console.log('khere')
$(document).ready(function() {

  var replaced = $("#all").html().replace(/patientId/g, patientId);
$("#all").html(replaced);

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
  $.get( "wccFormContent", { age: age} );
})r;


});


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

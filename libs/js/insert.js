$(document).ready()
{

$("#menu-close").click(function(e) {
    e.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
});

$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
});

$(function() {
    $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {

            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });
});


$.ajaxSetup({ cache: false });

$('#warning').hide().removeClass('hidden');
$('#success').hide().removeClass('hidden');

$('#signup').click(function(){

	var name, email;
	
	name = $('#name').val();
	email = $('#email').val();

	if(validateEmail(email))
	{

		$.getJSON('/php/insert.php',{Name: name, Email: email}, function(returnVal)
        {
			ga('send', 'event', 'button', 'click', 'signup', 1);
			$('#success').show();
			$('.rootText').css('margin-top','20px');
		});
	}
	else
	{
		$('#warning').show();
		setTimeout(function() { $('#warning').hide(); }, 5000);
	}

});


function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
	
}


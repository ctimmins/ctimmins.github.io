google.load('visualization', '1.0', {'packages':['corechart']})
google.setOnLoadCallback(function()
{

$(document).ready(function() {
    
    var handler = '../libs/php/manager.php',
		backButton = $('#back');

    $.ajaxSetup({ cache: false });
    $.fn.editable.defaults.mode = 'inline';
    
    login("","");
    
    $("#logout").click(function(){
        $.getJSON(handler,{Mode: 'Logout'}, function(returnVal)
        {
            location.reload();
        });
    });
    
    $('#signinbutton').show().click(function()
    {
        login($('#email').val(),$('#pass').val());
    });

    $('.form-control').keypress(function (e) 
    {
      if (e.which == 13)
        login($('#email').val(),$('#pass').val());
    });
    
    function login(email,pass)
    {   
        $.getJSON(handler,{Email: email, Password: pass, Mode: 'GetUserDetails'}, function(returnVal)
        {   
            if(returnVal != null)
            {
                $.getScript('../libs/js/dashboard.js', function () {
                    getMainPage(email,pass,returnVal,backButton,handler);
                });
            }
            else if(!(email == "" && pass == ""))
                alert("Incorrect Password or Email"); 
        });   
	}
    
    $('#signupbutton').show().click(function()
    {
        $.getScript('../libs/js/new_account.js', function () {
            createAccount(handler, login);
        });  
    });

    
});
});

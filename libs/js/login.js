$(document).ready(function() {
    
    var handler = '../libs/php/manager.php';

    $.ajaxSetup({ cache: false });
    
    $('#signinbutton').click(function()
    {
        login($('#email').val(),$('#pass').val());
    });
    
    $('#signupbutton').click(function()
    {
        window.location = "signup.html?email="+$('#email').val();
    });

    $('.form-control').keypress(function (e) 
    {
      if (e.which == 13)
        login($('#email').val(),$('#pass').val());
    });
    
    login("","");
    
    function login(email,pass)
    {   
        $.getJSON(handler,{Email: email, Password: pass, Mode: 'GetUserDetails'}, function(returnVal)
        {   
            if(returnVal != "Fail")
                window.location = "dashboard.html";
            else if(!(email == "" && pass == ""))
            {
                $('#error').show();
                setTimeout(function() { $('#error').hide();}, 5000);
            }
        });   
	}
    
});
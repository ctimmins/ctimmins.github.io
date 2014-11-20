$(document).ready(function() {
    
    $("#resetbutton").click(function()
    {
        $.getJSON('../libs/php/manager.php',{Email:$('#email').val(),Mode: 'SendResetEmail'}, function(returnVal)
        {
            if(returnVal == "Email")
            {
                $('#good').show();
                $("#email").parent().toggleClass("has-success");
                setTimeout(function() { window.location = "login.html"}, 5000);
            }
            else
            {
                $('#error').show();
                $("#email").parent().toggleClass("has-error");
                setTimeout(function() { $('#error').hide();}, 5000);
            }
        });
    });
});
$(document).ready(function() {
    
    $("#resetbutton").click(function()
    {
        if($('#pass1').val() == $('#pass2').val() && $('#pass1').val() != "")
        {
            $.getJSON('../libs/php/manager.php',{UserID:getUrlVars()["A"],Salt:getUrlVars()["B"],Pass1:$('#pass1').val(),Pass2:$('#pass2').val(),Mode: 'ResetPass'}, function(returnVal)
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
        }
        else
        {
            $('#error').show();
            $("#email").parent().toggleClass("has-error");
            setTimeout(function() { $('#error').hide();}, 5000);
        }
    });
    
    function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
    
});
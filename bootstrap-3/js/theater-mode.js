$(document).ready(function() {
    $('#theater-mode').hide();
    $('#videoColumn').hover(
        function() {
            $('#theater-mode').fadeIn();
        },
        function() {
            $('#theater-mode').fadeOut();
        }
    );
    $('#playlist-mode').hide();
    $('#theater-mode').click(function() {
        $(this).prop("id", "playlist-mode");
        $('#playlistColumn').slideUp("fast", function() {
            $('#videoColumn').removeClass('col-xs-8');
            $('#videoColumn').css("padding-right", "15px");
            $('#videoColumn').addClass('col-xs-12');
            $('#theater-mode').hide();
        });
        $('#videoColumn').hover(
            function() {
                $('#playlist-mode').fadeIn();
            },
            function() {
                $('#playlist-mode').fadeOut();
            }
        );
    });
    $('#playlist-mode').click(function() {
        $(this).prop("id", "theater-mode");
        $('#videoColumn').removeClass('col-xs-12');
        $('#videoColumn').css("padding-right", "0px");
        $('#videoColumn').addClass('col-xs-8', function() {
            $('#playlistColumn').delay("400").show("fast");
            $('#theater-mode').show();
            $('#playlist-mode').hide();
        });
    });
});

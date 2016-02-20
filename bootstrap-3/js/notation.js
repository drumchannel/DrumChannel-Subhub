$(document).ready(function() {
    $('#notation').hide();
    $('#show-notation').click(function() {
        var link = $(this);
        $('#notation').slideToggle("500ms", function() {
            if ($(this).is(':visible')) {
                link.text('Hide Notation');
                link.prepend('<span class="fa fa-times">&nbsp;</span>')
            } else {
                link.text('Show Notation');
                link.prepend('<span class="fa fa-music">&nbsp;</span>')
            }
        });
    });
});

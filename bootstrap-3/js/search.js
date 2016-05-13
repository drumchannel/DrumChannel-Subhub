$(window).load(function() {

    // quick search regex
    var qsRegex;
    var buttonFilter;
    // init Isotope
    var $container = $('.master-classes').isotope({
        itemSelector: '.master-class-item',
        layoutMode: 'fitRows',
        filter: function() {
            var $this = $(this);
            var searchResult = qsRegex ? $this.text().match(qsRegex) : true;
            var buttonResult = buttonFilter ? $this.is(buttonFilter) : true;
            return searchResult && buttonResult;
        },
        getSortData: {
            title: '.class-title',
            teacher: '.class-instructor',
            difficulty: '#lesson-difficulty',
        }
    });

    // bind filter button click
    $('#filters').on('click', 'button', function() {
        buttonFilter = $(this).attr('data-filter');
        $container.isotope();
    });

    // bind sort button click
    $('#sort-order').on('click', 'button', function() {
        var sortValue = $(this).attr('data-sort-value');
        $container.isotope({
            sortBy: sortValue
        });
    });

    // use value of search field to filter
    var $quicksearch = $('#quicksearch').keyup(debounce(function() {
        qsRegex = new RegExp($quicksearch.val(), 'gi');
        $container.isotope();
    }));

    // change is-checked class on buttons
    $('.button-group').each(function(i, buttonGroup) {
        var $buttonGroup = $(buttonGroup);
        $buttonGroup.on('click', 'button', function() {
            $buttonGroup.find('.active').removeClass('active');
            $(this).addClass('active');
        });
    });


    // debounce so filtering doesn't happen every millisecond
    function debounce(fn, threshold) {
        var timeout;
        return function debounced() {
            if (timeout) {
                clearTimeout(timeout);
            }

            function delayed() {
                fn();
                timeout = null;
            }
            setTimeout(delayed, threshold || 100);
        };
    }
});

$(function () {
    //////////////////////////////////////////////////////////
    // OnLoad
    // On first run, load in the Twitter data and build the two tables.
    //////////////////////////////////////////////////////////
    TwitterLibraries.loadData(function () {

        $.each($.merge(TwitterLibraries.Authorities, TwitterLibraries.Libraries), function (key, val) {
            $('#divGallery').append('<div class="item col-lg-3 col-md-3 col-xs-4" data-groups=[] data-title="' + val[0] + '" data-date="' + val[9] + '">'
                + '<div class="well well-sm"><h5>' + val[0] + '</h5>'
                + '<ul class="list-group">'
                + '<li class="list-group-item">'
                + '<span class="badge">' + val[5] + '</span>'
                + 'Tweets'
                + '</li>'
                + '<li class="list-group-item">'
                + '<span class="badge">' + val[6] + '</span>'
                + 'Followers'
                + '</li>'
                + '</ul>'
                + '<div class="alert alert-success"><strong>' + val[11] + '</strong></div>'
                + '</div></div>');

        });
        $('#divGallery').append('<div class="col-xs-1 shufflesizer"></div>');

        // Shuffle!
        var Shuffle = window.shuffle;
        var shuffle = new Shuffle(document.getElementById('divGallery'), {
            itemSelector: '.item',
            sizer: '.shufflesizer'
        });
        $('.loading').hide();
    });
});
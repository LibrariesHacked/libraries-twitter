$(function () {
    var formatDetails = function (d) {
        var html = '<div>No twitter account.</div>';
        if (d[1] != '') {
            html = '<div><div class="media">' +
            '<div class="media-left">' +
            '<a href="' + d[4] + '">' + '<img class="media-object" src="' + d[10] + '" alt="">' + '</a>' +
            '</div>' +
            '<div class="media-body">' +
            '<h4 class="media-heading">' + d[0] + '</h4>' +
            '<p><small>Account created ' + d[13] + ' ago. Currently with ' + d[5] + ' followers, ' + d[6] + ' following, ' + d[7] + ' tweets, and ' + d[8] + ' favourites' + '</small></p>' +
            '<p>' + d[3] + '</p>' +
            '<small>Latest tweet, ' + d[14] + ' ago</small>' +
            '<div class="well">' + d[11] + '</div>' +
            '</div>' +
            '</div></div>';
        }
        return html;
    };

    var buildDataTable = function () {
        var table = $('#tableTwitter')
                .DataTable(
                {
                    processing: true,
                    dom: 'Bfrtip',
                    buttons: [
                        //'print'
                    ],
                    data: createData($.merge(TwitterLibraries.Authorities, TwitterLibraries.Libraries)),
                    order: [[14, 'desc']],
                    columns: [
                        {
                            title: "Name", data: 0,
                            render: function (data, type, row) {
                                return data + (row[1] ? (' <a href="https://twitter.com/' + row[1] + '" target="_blank">(' + row[1] + ')</a>') : ' <span class="text-danger">(No account)</span>');
                            }
                        },
                        { title: "Description", data: 3, visible: false },
                        { title: "Website", data: 4, visible: false },
                        { title: "Followers", data: 5, defaultContent: '' },
                        { title: "Following", data: 6, visible: false, defaultContent: '' },
                        { title: "Tweets", data: 7, defaultContent: '' },
                        { title: "Favourites", data: 8, visible: false, defaultContent: '' },
                        { title: "Last tweeted", data: 12, defaultContent: '', iDataSort: 14 },
                        { title: "Created", data: 9, defaultContent: '', iDataSort: 13 },
                        { title: "Image", data: 10, visible: false },
                        { title: "Last tweet", data: 11, className: 'none' },
                        { title: "Created friendly", data: 13, visible: false, iDataSort: 13 },
                        { title: "Tweeted friendly", data: 14, visible: false, iDataSort: 14 },
                        { title: "Created system", data: 15, visible: false },
                        { title: "Tweeted system", data: 16, visible: false }
                    ],
                    responsive: {
                        details: {
                            display: $.fn.dataTable.Responsive.display.modal({
                                header: function (row) {
                                    var data = row.data();
                                    return data[0];
                                }
                            }),
                            renderer: function (api, rowIdx, columns) {
                                // Just show everything we want to.
                                var description = columns[1].data;
                                var website = columns[2].data;
                                var followers = columns[3].data;
                                var following = columns[4].data;
                                var tweets = columns[5].data;
                                var favourites = columns[6].data;
                                var tweetedDate = columns[7].data;
                                var createdDate = columns[8].data;
                                var profileImage = columns[9].data;
                                var tweet = columns[10].data;
                                var createdFriendly = columns[11].data;
                                var tweetedFriendly = columns[12].data;
                                var html = '<p>' + (createdFriendly ? 'Account created ' + createdFriendly + ' ago.' : 'No account created') + '</p>'
                                    + '<p><span class="label label-success">' + tweets + ' tweets</span> '
                                    + '<span class="label label-info">' + followers + ' followers</span></p>'
                                    + (tweetedFriendly ? ('<div class="alert alert-info"><strong>' + tweetedFriendly + ' ago: </strong>' + tweet + '</div>') : '')
                                    + (website ? '<a class="btn btn-primary btn-sm" href="' + website + '" target="_blank">Website</a> ' : '')
                                    + '<button class="btn btn-default btn-sm" type="button" data-dismiss="modal">Close</button>';
                                return html;
                            }
                        }
                    },
                    bAutoWidth: false
                })
    };

    //////////////////////////////////////////////////////
    // Function: CreateData()
    // 
    // Input: dataset []
    // Returns:
    //////////////////////////////////////////////////////
    var createData = function (ds) {
        $.each(ds, function (i, x) {
            while (x.length < 17) x.push('');
            var now = moment();
            if (x[9]) ds[i][15] = parseInt(moment(x[9], 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').format('YYYYMMDDHHmm'));
            if (x[9]) ds[i][13] = moment.duration(now - moment(x[9], 'dd MMM DD HH:mm:ss ZZ YYYY', 'en')).humanize();
            if (x[9]) ds[i][9] = moment(x[9], 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').format('Do MMM YY');
            if (x[12]) ds[i][16] = parseInt(moment(x[12], 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').format('YYYYMMDDHHmm'));
            if (x[12]) ds[i][14] = moment.duration(now - moment(x[12], 'dd MMM DD HH:mm:ss ZZ YYYY', 'en')).humanize();
            if (x[12]) ds[i][12] = moment(x[12], 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').format('Do MMM YY');
        });
        return ds;
    };

    //////////////////////////////////////////////////////////
    // OnLoad
    // On first run, load in the Twitter data and build the two tables.
    //////////////////////////////////////////////////////////
    TwitterLibraries.loadData(function () {
        buildDataTable();
        $('.loading').hide();
    });
});
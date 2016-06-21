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

    var buildDataTable = function (twitterType) {
        var table = $('#table' + twitterType + 'Twitter')
                .DataTable(
                {
                    processing: true,
                    dom: 'Bfrtip',
                    buttons: [
                        //'print'
                    ],
                    data: createData(TwitterLibraries[twitterType]),
                    order: [[14, 'desc']],
                    columns: [
                        {
                            title: "Name", data: 0,
                            render: function (data, type, row) {
                                return data + ' <a href="https://twitter.com/' + row[1] + '" target="_blank">(' + row[1] + ')</a>';
                            }
                        },
                        { title: "Description", data: 3, visible: false },
                        { title: "Website", data: 4, visible: false },
                        { title: "Followers", data: 5, defaultContent: '' },
                        { title: "Following", data: 6, visible: false, defaultContent: '' },
                        { title: "Tweets", data: 7, defaultContent: '' },
                        { title: "Favourites", data: 8, visible: false, defaultContent: '' },
                        { title: "Created", data: 9, defaultContent: '', "iDataSort": 15 },
                        { title: "Image", data: 10, visible: false },
                        { title: "Last tweet", data: 11, visible: false },
                        { title: "Last tweeted", data: 12, defaultContent: '', "iDataSort": 16 },
                        { title: "Created friendly", data: 13, visible: false, "iDataSort": 15 },
                        { title: "Tweeted friendly", data: 14, visible: false, "iDataSort": 16 },
                        { title: "Created system", data: 15, visible: false },
                        { title: "Tweeted system", data: 16, visible: false }
                    ],
                    responsive: true,
                    //drawCallback: function (settings) {
                    //    var api = this.api();
                    //    var rows = api.rows({ page: 'current' }).nodes();
                    //    var last = null;
                    //    api.column(12, { page: 'current' }).data().each(function (group, i) {
                    //        if (last !== group) {
                    //            $(rows).eq(i).before(
                    //                '<tr class="grouping"><td colspan="7">' + (group != '' ? 'Last tweeted ' + group + ' ago' : 'Never tweeted') + '</td></tr>'
                    //            );
                    //            last = group;
                    //        }
                    //    });
                    //}
                });

        // Add event listener for opening and closing details
        //$('#table' + twitterType + 'Twitter tbody').on('click', 'tr', function () {
        //    var tr = $(this).closest('tr');
        //    var row = table.row(tr);
        //    if (row.child.isShown()) {
        //        row.child.hide();
        //        tr.removeClass('shown');
        //    }
        //    else {
        //        row.child(formatDetails(row.data()), 'nohover').show();
        //        tr.addClass('shown');
        //    }
        //});
    };

    var createData = function (ds) {
        $.each(ds, function (i, x) {
            while (x.length < 17) x.push('');
            var now = moment();
            if (x[9]) ds[i][15] = moment(x[9], 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').format('YYYYMMDDHHmm');
            if (x[9]) ds[i][13] = moment.duration(now - moment(x[9], 'dd MMM DD HH:mm:ss ZZ YYYY', 'en')).humanize();
            if (x[9]) ds[i][9] = moment(x[9], 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').format('Do MMM YY');
            if (x[12]) ds[i][16] = moment(x[12], 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').format('YYYYMMDDHHmm');
            if (x[12]) ds[i][14] = moment.duration(now - moment(x[12], 'dd MMM DD HH:mm:ss ZZ YYYY', 'en')).humanize();
            if (x[12]) ds[i][12] = moment(x[12], 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').format('Do MMM YY');
        });
        return ds;
    };

    TwitterLibraries.loadData(function () {
        buildDataTable('Authorities');
        buildDataTable('Libraries');
        $('.loading').hide();
    });
});
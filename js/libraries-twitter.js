$(function () {

    /* Formatting function for row details - modify as you need */
    function formatDetails(d) {
        // `d` is the original data object for the row
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
    }

    var authorities, libraries;
    $.when(
        $.getJSON('data/AuthoritiesTwitter.json', function (data) {
            authorities = data;
        }),
        $.getJSON('data/LibrariesTwitter.json', function (data) {
            libraries = data;
        })
    ).then(function () {

        // Combine together the authorities and the libraries
        var data = $.merge(authorities, libraries);

        // Go through and convert the last tweeted date to friendly values
        $.each(data, function (i, x) {
            while (x.length < 17) x.push('');
            var now = moment();
            // Created is index 9
            if (x[9]) data[i][15] = moment(x[9], 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').format('YYYYMMDDHHMM');
            if (x[9]) data[i][9] = moment(x[9], 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').format('Do MMM YY');
            if (x[9]) data[i][13] = moment.duration(now - moment(x[9], 'Do MMM YY')).humanize();

            // Last tweeted is index 12
            if (x[12]) data[i][16] = moment(x[12], 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').format('YYYYMMDDHHMM');
            if (x[12]) data[i][12] = moment(x[12], 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').format('Do MMM YY');
            if (x[12]) data[i][14] = moment.duration(now - moment(x[12], 'Do MMM YY')).humanize();
        });

        // Initialise the table
        var table = $('#tableTwitter')
                .DataTable(
                {
                    processing: true,
                    dom: 'Bfrtip',
                    buttons: [
                        //'print'
                    ],
                    data: data,
                    order: [[16, 'desc']],
                    columns: [
                        { title: "Name", data: 0 },
                        {
                            title: "Twitter",
                            data: 1,
                            render: function (data, type, row) {
                                return '<a href="https://twitter.com/' + data + '" target="_blank">' + data + '</a>';
                            }
                        },
                        { title: "Type", data: 2 },
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
                    drawCallback: function (settings) {
                        var api = this.api();
                        var rows = api.rows({ page: 'current' }).nodes();
                        var last = null;
                        api.column(14, { page: 'current' }).data().each(function (group, i) {
                            if (last !== group) {
                                $(rows).eq(i).before(
                                    '<tr class="grouping"><td colspan="7">' + (group != '' ? 'Last tweeted ' + group + ' ago' : 'Never tweeted')  + '</td></tr>'
                                );
                                last = group;
                            }
                        });
                    }
                });

        // Add event listener for opening and closing details
        $('#tableTwitter tbody').on('click', 'tr', function () {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child(formatDetails(row.data()), 'nohover').show();
                tr.addClass('shown');
            }
        });
        $('.loading').hide();
    });
});
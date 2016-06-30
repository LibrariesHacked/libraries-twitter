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
                                return data + ' <a href="https://twitter.com/' + row[1] + '" target="_blank">(' + row[1] + ')</a>';
                            }
                        },
                        { title: "Description", data: 3, visible: false },
                        { title: "Website", data: 4, visible: false },
                        { title: "Followers", data: 5, defaultContent: '' },
                        { title: "Following", data: 6, visible: false, defaultContent: '' },
                        { title: "Tweets", data: 7, defaultContent: '' },
                        { title: "Favourites", data: 8, visible: false, defaultContent: '' },
                        { title: "Last tweeted", data: 12, defaultContent: '', "iDataSort": 16 },
                        { title: "Created", data: 9, defaultContent: '', "iDataSort": 15 },
                        { title: "Image", data: 10, visible: false },
                        { title: "Last tweet", data: 11, visible: false },
                        { title: "Created friendly", data: 13, visible: false, "iDataSort": 15 },
                        { title: "Tweeted friendly", data: 14, visible: false, "iDataSort": 16 },
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
                            renderer: function ( api, rowIdx, columns ) {
                                var data = $.map( columns, function ( col, i ) {
                                    return '<tr>'+
                                            '<td>'+col.title+':'+'</td> '+
                                            '<td>'+col.data+'</td>'+
                                        '</tr>';
                                } ).join('');
                                return $('<table/>').append( data );
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
            if (x[9]) ds[i][15] = moment(x[9], 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').format('YYYYMMDDHHmm');
            if (x[9]) ds[i][13] = moment.duration(now - moment(x[9], 'dd MMM DD HH:mm:ss ZZ YYYY', 'en')).humanize();
            if (x[9]) ds[i][9] = moment(x[9], 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').format('Do MMM YY');
            if (x[12]) ds[i][16] = moment(x[12], 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').format('YYYYMMDDHHmm');
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
$(function () {
    //////////////////////////////////////////////////////////
    // OnLoad
    // On first run, load in the Twitter data and build the two tables.
    //////////////////////////////////////////////////////////
    TwitterLibraries.loadData(function () {
        var allData = $.map($.merge(TwitterLibraries.Authorities, TwitterLibraries.Libraries), function (val, key) {
            return {
                library: val[0], twitterHandle: val[1], type: val[2], description: val[3], website: val[4],
                tweets: (val[7] || 0), following: (val[6] || 0), followers: (val[5] || 0), likes: (val[8] || 0), accountCreated: moment(val[9], 'dd MMM DD HH:mm:ss ZZ YYYY', 'en'),
                picUrl: val[10], lastTweet: (val[11] || ''), lastTweeted: moment(val[12], 'dd MMM DD HH:mm:ss ZZ YYYY', 'en')
            };
        });
        // For the counts we're going to grade them relatively.
        var countClasses = { 0: 'danger', 1: 'default', 2: 'warning', 3: 'info', 4: 'success' };
        var smileyIcons = { 0: 'thumbs-o-down', 1: 'thumbs-o-up', 2: 'smile-o', 3: 'star-o', 4: 'heart-o' };
        var tweetCounts = $(allData).map(function (i, x) {
            return parseFloat(x.tweets) || 0;
        }).toArray().sort(function (a, b) { return a - b });
        var followerCounts = $(allData).map(function (i, x) {
            return parseFloat(x.followers) || 0;
        }).toArray().sort(function (a, b) { return a - b });

        // Also going to set up some keywords.
        // Also remove stopwords.
        var stopwords = ['a', 'about', 'above', 'above', 'across', 'after', 'afterwards', 'again', 'against', 'all', 'almost', 'alone', 'along', 'already', 'also', 'although', 'always', 'am', 'among', 'amongst', 'amoungst', 'amount', 'an', 'and', 'another', 'any', 'anyhow', 'anyone', 'anything', 'anyway', 'anywhere', 'are', 'around', 'as', 'at', 'back', 'be', 'became', 'because', 'become', 'becomes', 'becoming', 'been', 'before', 'beforehand', 'behind', 'being', 'below', 'beside', 'besides', 'between', 'beyond', 'bill', 'both', 'bottom', 'but', 'by', 'call', 'can', 'cannot', 'cant', 'co', 'con', 'could', 'couldnt', 'cry', 'de', 'describe', 'detail', 'do', 'done', 'down', 'due', 'during', 'each', 'eg', 'eight', 'either', 'eleven', 'else', 'elsewhere', 'empty', 'enough', 'etc', 'even', 'ever', 'every', 'everyone', 'everything', 'everywhere', 'except', 'few', 'fifteen', 'fify', 'fill', 'find', 'fire', 'first', 'five', 'for', 'former', 'formerly', 'forty', 'found', 'four', 'from', 'front', 'full', 'further', 'get', 'give', 'go', 'had', 'has', 'hasnt', 'have', 'he', 'hence', 'her', 'here', 'hereafter', 'hereby', 'herein', 'hereupon', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'however', 'hundred', 'ie', 'if', 'in', 'inc', 'indeed', 'interest', 'into', 'is', 'it', 'its', 'itself', 'keep', 'last', 'latter', 'latterly', 'least', 'less', 'ltd', 'made', 'many', 'may', 'me', 'meanwhile', 'might', 'mill', 'mine', 'more', 'moreover', 'most', 'mostly', 'move', 'much', 'must', 'my', 'myself', 'name', 'namely', 'neither', 'never', 'nevertheless', 'next', 'nine', 'no', 'nobody', 'none', 'noone', 'nor', 'not', 'nothing', 'now', 'nowhere', 'of', 'off', 'often', 'on', 'once', 'one', 'only', 'onto', 'or', 'other', 'others', 'otherwise', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'part', 'per', 'perhaps', 'please', 'put', 'rather', 're', 'same', 'see', 'seem', 'seemed', 'seeming', 'seems', 'serious', 'several', 'she', 'should', 'show', 'side', 'since', 'sincere', 'six', 'sixty', 'so', 'some', 'somehow', 'someone', 'something', 'sometime', 'sometimes', 'somewhere', 'still', 'such', 'system', 'take', 'ten', 'than', 'that', 'the', 'their', 'them', 'themselves', 'then', 'thence', 'there', 'thereafter', 'thereby', 'therefore', 'therein', 'thereupon', 'these', 'they', 'thickv', 'thin', 'third', 'this', 'those', 'though', 'three', 'through', 'throughout', 'thru', 'thus', 'to', 'together', 'too', 'top', 'toward', 'towards', 'twelve', 'twenty', 'two', 'un', 'under', 'until', 'up', 'upon', 'us', 'very', 'via', 'was', 'we', 'well', 'were', 'what', 'whatever', 'when', 'whence', 'whenever', 'where', 'whereafter', 'whereas', 'whereby', 'wherein', 'whereupon', 'wherever', 'whether', 'which', 'while', 'whither', 'who', 'whoever', 'whole', 'whom', 'whose', 'why', 'will', 'with', 'within', 'without', 'would', 'yet', 'you', 'your', 'yours', 'yourself', 'yourselves', 'the', 'today', 'new', 'library', 'rt', 'mt', 'twitter', 'amp', 'quot', 'http', 'https', 'book', 'books', 'read', 'join', 'reading', 'free', 'great', 'come', 'tomorrow', 'today', 'visit', 'week', 'libraries'];
        var wordCounts = {};
        $.each(allData, function (key, val) {
            // Word counting
            var words = val.lastTweet.replace(/[^\w\s]/gi, '').split(' ');
            $.each(words, function (k, v) {
                var word = v.toLowerCase();
                if (stopwords.indexOf(word) == -1) wordCounts[word] = (wordCounts[word] || 0) + 1;
            });
            var tweetsQuarter = (Math.round((tweetCounts.indexOf(val.tweets) / tweetCounts.length) * 4));
            var followersQuarter = (Math.round((followerCounts.indexOf(val.followers) / followerCounts.length) * 4));
            $('#divGallery').append('<div class="item col col-lg-3 col-md-4 col-sm-4 col-xs-12" data-title="' + val.library + '" data-tweets="' + val.tweets + '" data-followers="' + val.followers + '" data-type="' + val.type + '" data-date-tweeted="' + (val.lastTweeted.isValid() ? val.lastTweeted.format('YYYYMMDDHHmm') : '0') + '" data-date-created="' + (val.accountCreated.isValid() ? val.accountCreated.format('YYYYMMDDHHmm') : 0) + '">'
                + '<div class="panel panel-default">'
                + '<div class="panel-heading">'
                + '<span class="itemTitle text-' + countClasses[tweetsQuarter] + '">' + val.library + ' </span>'
                + '<br/><small class="text-muted">' + (val.accountCreated.isValid() ? 'Created ' + val.accountCreated.fromNow() : 'No twitter account.') + '.</small>'
                + '</div>'
                + '<div class="panel-body">'
                + '<p><span class="label label-' + countClasses[tweetsQuarter] + '">' + val.tweets + ' tweets</span>  '
                + '<span class="label label-' + countClasses[followersQuarter] + '">' + val.followers + ' followers</span></p>'
                + (val.lastTweeted.isValid() ? '<p><small>' + val.lastTweeted.fromNow() + ': ' + val.lastTweet + '</small></p>' : '')
                + '</div>'
                + '<div class="panel-footer">'
                + (val.website ? ('<a class="btn btn-info btn-xs" href="' + val.website + '" target="_blank"><span class="glyphicon glyphicon-link"></span>&nbsp;Website</a>') : '')
                + (val.description ? (' <button class="btn btn-primary btn-xs" type="button" data-original-title="" data-toggle="popover" data-content="' + val.description + '" data-placement="right" data-container="body"><span class="glyphicon glyphicon-info-sign"></span>&nbsp;Info</a>') : '')
                + '</div>'
                + '</div></div>');
        });
        $('#divGallery').append('<div class="col col-lg-3 col-md-4 col-sm-4 col-xs-12" id="shufflesizer"></div>');
        var wordCountSorted = Object.keys(wordCounts).map(function (val, ind) {
            return { word: val, count: wordCounts[val] }
        }).sort(function (a, b) {
            return b.count - a.count;
        });

        // Take twenty keywords - currently disabled.
        $.each(wordCountSorted.slice(0, 6), function () {
            // $('#pKeywords').append('<span class="label label-' + countClasses[Math.round(Math.random() * 4)] + '">' + this.word + '</span> ');
        });

        // Shuffle!
        var shuffle = null;
        setTimeout(function () {
            var Shuffle = window.shuffle;
            shuffle = new Shuffle(document.getElementById('divGallery'), {
                itemSelector: '.item',
                sizer: '#shufflesizer',
                initialSort: {
                    reverse: true,
                    by: function (element) {
                        var sortVal = element.getAttribute('data-date-tweeted');
                        return sortVal;
                    },
                }
            });
            $('.loading').hide();
        }, 200);
        // Events
        $('#txtSearch').on('keyup', function () {
            shuffle.filter(function (element, shuffle) {
                var libName = element.querySelector('.itemTitle').textContent.toLowerCase().trim();
                return libName.indexOf($('#txtSearch').val().toLowerCase()) !== -1;
            });
        });
        $('#selOrder').on('change', function () {
            shuffle.sort({
                reverse: true,
                by: function (element) {
                    var sortVal = element.getAttribute($('#selOrder').val());
                    return parseInt(sortVal);
                }
            });
        });
        $('#selType').on('change', function () {
            shuffle.filter(function (element, shuffle) {
                var filter = $('#selType').val();
                if (filter == 'All') return true;
                return element.getAttribute('data-type') == filter;
            });
        });
        // Initialise popovers
        $('button[data-toggle="popover"]').popover();
    });
});
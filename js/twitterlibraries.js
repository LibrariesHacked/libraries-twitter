var TwitterLibraries = {
    Authorities: [],
    Libraries: [],

    //////////////////////////////////////////
    // Function: LoadData()
    //////////////////////////////////////////
    loadData: function (callback) {
        $.when(
            $.getJSON('data/AuthoritiesTwitter.json', function (data) {
                this.Authorities = data;
            }.bind(this)),
            $.getJSON('data/LibrariesTwitter.json', function (data) {
                this.Libraries = data;
            }.bind(this))).then(function () {
                callback();
            });
    }
};
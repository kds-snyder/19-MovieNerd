function AppViewModel() {
  var self = this;

  self.searchInput = ko.observable();
  self.movies = ko.observableArray();
  self.failure = ko.observable();
  self.errorMessage = ko.observable();
  self.filterString = ko.observable('');
  self.filteringTV = ko.observable();


  self.search = function() {
    // Search for the input, using omdbapi
    $.getJSON( "http://omdbapi.com/?s=" +
                  self.searchInput() + self.filterString(),
                                              function( data ) {

      // If data was found, then map it to the movies array,
      //  otherwise set the error indicator and message
      if (data.Search) {
        ko.mapping.fromJS(data.Search, {}, self.movies);
        self.failure(false);
        self.errorMessage('');
      }
      else {
        self.failure(true);
        self.errorMessage(data.Error);
      }

    });

    // If filtering TV shows, search for episode data;
    //  it may not exist
    if (self.filteringTV()) {
      $.getJSON( "http://omdbapi.com/?s=" +
                    self.searchInput() + '&type=episode',
                                                function( data ) {
          // If episode data was found, push to the movies array
          //  and initialize failure indicator & error message
          if (data.Search) {

            for (var i = 0; i < data.Search.length; ++i) {
              var currentShow = data.Search[i];
              self.movies.push ({
                Title: ko.observable(currentShow.Title),
                Year: ko.observable(currentShow.Year),
                imdbID: ko.observable(currentShow.imdbID),
                Type: ko.observable(currentShow.Type),
                Poster: ko.observable(currentShow.Poster)
              });
            }

            self.failure(false);
            self.errorMessage('');
          }
      });
    }
  };

  // Filter for all
  self.filterAll = function() {
    self.filterString('');
    self.filteringTV(false);
  };

  // Filter for movies
  self.filterMovies = function() {
    self.filterString('&type=movie');
    self.filteringTV(false);
  };

  // Filter for TV shows
  self.filterTV = function() {
    self.filterString('&type=series');
    self.filteringTV(true);
  };


};

ko.applyBindings(new AppViewModel());

function AppViewModel() {
  var self = this;

  self.searchInput = ko.observable();
  self.movies = ko.observableArray();
  self.failure = ko.observable();
  self.errorMessage = ko.observable();
  self.showMovies = ko.observable(false);
  self.filterSearchString = ko.observable('');
  self.selectedFilterText = ko.observable('All');


  self.search = function() {
    // Search only if user entered text
    // Set indicator to not show movies if search string is empty
    if (self.searchInput().length == 0) {
      self.failure(false);
      self.errorMessage('');
      self.showMovies(false);
      return;
    }

    // Search for the input, using omdbapi
    $.getJSON( "http://omdbapi.com/?s=" +
                  self.searchInput() + self.filterSearchString(),
                                              function( data ) {

      // If data was found, then map it to the movies array,
      //  otherwise set the error indicator and message
      if (data.Search) {
        ko.mapping.fromJS(data.Search, {}, self.movies);
        self.failure(false);
        self.errorMessage('');
        self.showMovies(true);
      }
      else {
        self.failure(true);
        self.errorMessage(data.Error);
        self.showMovies(false);
      }

    });

    // If filtering TV shows, search for episode data;
    //  it may not exist
    if (self.selectedFilterText() == 'tv shows') {
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

  // Set filtering according to user selection
  self.setFilter = function(filter) {

    //self.selectedFilterText(filter.toLowerCase());
    self.selectedFilterText(filter);

    // Set string to add to search according to selected filter
    switch(self.selectedFilterText()) {
      case ('All'):
        self.filterSearchString('');
        break;
      case ('Movies'):
        self.filterSearchString('&type=movie');
        break;
      case ('TV Shows'):
        self.filterSearchString('&type=series');
        break;
      default:
        self.filterSearchString('');
    }
  };


};

ko.applyBindings(new AppViewModel());

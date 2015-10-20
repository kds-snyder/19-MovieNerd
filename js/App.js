function AppViewModel() {
  var self = this;

  self.searchInput = ko.observable();
  self.movies = ko.observableArray();
  self.failure = ko.observable();
  self.errorMessage = ko.observable();


  self.search = function() {
    // Search for the input, using omdbapi
    $.getJSON( "http://omdbapi.com/?s=" + self.searchInput(), function( data ) {

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
  };


};

ko.applyBindings(new AppViewModel());

var visualization;
var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

$(document).ready(function(){
	
  $('#addressSearch').keyup(function(){
    delay(function(){
      var addressSearchInput = $('#addressSearch').val().toLowerCase();
      var addressQuery = '';
      var streetInput = (addressSearchInput.indexOf(' ') > 0) ? addressSearchInput.substr(addressSearchInput.indexOf(' ')+1) : '';
      console.log(streetInput);
      if(addressSearchInput.length > 2){
        if(streetInput.length > 2){
          addressQuery = 'SELECT A,C,B,D WHERE (LOWER(A) LIKE "%'+addressSearchInput+'%") OR (LOWER(A) LIKE "%'+streetInput+'%" AND B IS NOT NULL) ORDER BY B DESC LIMIT 10';
        } else {
          addressQuery = 'SELECT A,C,B,D WHERE LOWER(A) LIKE "%'+addressSearchInput+'%" ORDER BY B ASC LIMIT 10';
        }
      }

      if(addressQuery){
        google.setOnLoadCallback(drawVisualization(addressQuery));    
      } else {
        $('#addressOutput').empty();
      }
      
    }, 200 );

  });
  
});


function drawVisualization(addressQuery) {
  console.log(addressQuery);
  var query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1DnK7kz9r3W2Jit0lU8TE7H8-4jOesD9_SHsEgEOrs4k/edit#gid=46921725'
    );
  query.setQuery(addressQuery);
  query.send(handleQueryResponse);
}

function handleQueryResponse(response) {
  if (response.isError()) {
    alert('error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }
  var data = response.getDataTable();
  if(data.getNumberOfRows() < 1){
    $('#addressOutput').html('No Address Match Found on Pick-up Routes.');
  } else {
    visualization = new google.visualization.Table(document.getElementById('addressOutput'));
    visualization.draw(data, null);
  };
}
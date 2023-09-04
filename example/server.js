var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);

// Read server input.
const input = parseInt(process.argv[2]);
console.log('Input: ', input);
if (isNaN(input) || input < 0 || input > 100) {
  console.log('input should be an integer between 0 and 100');
  return;
}

// Serve JIFF static files
app.use('/dist', express.static(path.join(__dirname, '..', 'jiff', 'dist')));
app.use('/lib/ext', express.static(path.join(__dirname, '..', 'jiff', 'lib', 'ext')));
app.use('/bignumber.js', express.static(path.join(__dirname, '..', 'jiff', 'node_modules', 'bignumber.js')));

// Server client page.
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'client.html'));
});

// Create and start JIFF server.
var JIFFServer = require('jiff');
var jiffServerBigNumber = require('../jiff/lib/ext/jiff-server-bignumber.js');
var jiffServer = new JIFFServer(http, {
  logs: true,
  hooks: {
    onDisconnect: [
      function (_, computation_id, party_id) {
        if (party_id === 1 && computation_id == 'example') {
          console.log('Client disconnected! shutting down ...');
          process.exit(0);
        }
      }
    ]
  }
});
jiffServer.apply_extension(jiffServerBigNumber);

// Specify the server side computation.
jiffServer.computationMaps.maxCount['example'] = 2;
var computationInstance = jiffServer.compute('example', {
  crypto_provider: 'http://localhost:4321'
});

computationInstance.wait_for([1], function () {
  // Perform server-side computation.
  console.log('Computation initialized!');
  
  // Share the server's input with the client and receive the client input share.
  var shares = computationInstance.share(input, 2, [1, 's1'], [1, 's1']);

  // Add the two shares.
  var result = shares[1].smult(shares['s1']);
  
  // Reveal result.
  computationInstance.open(result, [1]);
});

// Serve static files.
http.listen(3000, function () {
  console.log('listening on *:3000');
  console.log('Direct your browser to http://localhost:3000/');
  console.log('Follow the instructions on that page to perform the computation');
  console.log('You can only perform the computation once. You will need to restart the server to perform additional ones');
  console.log();
});

var express = require('express')
var app = express();

app.use(express.static(__dirname));

console.log('listening on 8888');
app.listen(8888);

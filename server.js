

const app = require('./src/index');
const http = require('http');

var server=http.createServer(function(req,res){
    res.end('test');
});

server.on('listening',function(){
    console.log('ok, server is running');
});

server.listen(process.env.PORT);
var express = require('express');
var http=require('http');
var session = require('express-session');
var SessionStore = require('express-mysql-session');
var app = express();          
var morgan = require('morgan');      
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var routes = require('./server/routes/index');
var errorHandler = require('./server/config/errorHandler');
app.use(express.static(__dirname + '/public'));            
app.use(morgan('dev'));                                
app.use(bodyParser.urlencoded({'extended':'true'}));           
app.use(bodyParser.json());                                
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(cookieParser());
var options = {
    host: 'localhost',
    user: 'root',
    password: '99996578',
    database: 'mediadb'
}
var sessionStore=new SessionStore(options);
var sessionMiddleware=session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    cookie:{
        path:"/",
        httpOnly:true,
        maxAge:null
    },
    resave: true,
    saveUninitialized: true,
    store: sessionStore
});


var server=http.createServer(app);
server.listen(8000,function(){
    console.log('server listening on port 8000');
});

var io = require('socket.io').listen(server);
io.use(function(socket,next){
    sessionMiddleware(socket.request,socket.request.res,next);
})
app.use(sessionMiddleware);
app.use(errorHandler.handler);


io.on('connection',require('./server/config/socketConnection.js').on);

app.use('/',routes);
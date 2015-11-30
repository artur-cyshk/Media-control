exports.on=function (socket) {
    socket.on('like', function (data) {
        data.userId=socket.request.session.user;
        socket.broadcast.emit('like',data);
    });
    socket.on('watch', function () {
        socket.broadcast.emit('watch');
    });
    socket.on('comment', function (data) {
        socket.broadcast.emit('comment',data);
    });
    socket.on('favorites', function (data) {
        data.userId=socket.request.session.user;
        socket.broadcast.emit('favorites',data);
    });
    socket.on('username',function(data){
        data.userId=socket.request.session.user;
        socket.emit('username',data);
    })
};
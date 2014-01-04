$(function() {
  var PEERJS_ID = 'your api key';
  var myId = String(Math.ceil( Math.random()*1000 + 100 ));
  var peer = new Peer(myId, {key: PEERJS_ID});
  $('#myId').text(myId);

  var inputMessage = function(id, message) {
    $('#messageData').prepend($('<div/>').text(id + ': ' + message));
  };

  var connect = function(conn) {
    $('.connected').prepend($('<div/>').text('ID: ' + conn.peer + 'と通信中'));

    $('#sendMessage').click(function() {
      var text = $('#message').val();
      $('#message').val('');
      if(text === '') return;
      conn.send({
        message: text,
        ids: [myId]
      });
      inputMessage(myId, text);
    });

    conn.on('data', function(data){
      var id = data.ids[0];
      var ids = data.ids;
      var message = data.message;
      $.each(peer.connections, function(_id, _conn) {
        if($.inArray(_id, ids) == -1) {
          ids.push(myId);
          _conn[0].send({
            message: message,
            ids: ids
          });
        }
      });
      inputMessage(id, message);
    });
  };

  $('#connectButton').click(function() {
    var id = $('#connect').val();
    if(id === '') return;
    var connectFlag = false;
    $.each(peer.connections, function(_id) {
      if(id == _id) connectFlag = true;
    });
    if(connectFlag) return;
    var conn = peer.connect(id, {'serialization': 'binary-utf8'});
    conn.on('open', function(){
      connect(conn);
    });
  });

  peer.on('connection', function(conn) {
    connect(conn);
  });
});

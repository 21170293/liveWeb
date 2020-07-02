
var socket=io();

var conn;
var peer_id;


const message= document.getElementById('message'),
        handle=document.getElementById('handle'),
        output=document.getElementById('output'),
        button =document.getElementById('button'),
        typing= document.getElementById('typing'),
        rvideo =document.getElementById('rvideo'),
        lvideo =document.getElementById('lvideo'),
        callbtn=document.getElementById('call-button'),
        conbtn=document.getElementById('con-button');



//Setting up a event listener
button.addEventListener('click',(evt)=>{
    evt.preventDefault(); //prevent page reloading
    socket.emit('userMessage',{
        handle:handle.value,
        message: message.value
    });
    document.getElementById('message').value='';

});

 //Recieving data from server i.e; who is typing
 socket.on('userTyping',function (data) {
    typing.innerHTML='<p><em>'+data+' is typing...</em></p>';
});



//send name of handler who is typing 
message.addEventListener('keyup', function () {

    socket.emit('userTyping',handle.value);
    
});




//Recieving data return from server
socket.on('server',function (data){
    //create text element
    typing.innerHTML='';
    output.innerHTML+='<p><strong> '+data.handle+'</strong> '+data.message+'</p>';
});



/* Video chat */

//Get local video with permission
function getLVideo(callbacks){
    navigator.getUserMedia =navigator.getUserMedia || navigator.webkitGetUserMedia ||navigator.mozGetUserMedia;
    var constraints={
        audio :false,
        video: true
    }
    navigator.getUserMedia(constraints,callbacks.success,callbacks.error)
    
}
function recieveStream(stream,elemid){
    var video=document.getElementById(elemid);
    video.srcObject=stream;
    window.peer_stream =stream;
}
getLVideo({
    success : function (stream) {
        window.localstream =stream;
        recieveStream(stream,'lvideo');    
    },
    error : function (err) {
        alert('Cannot access your camera');
        console.log(err);
    }
});




// Create with a peer connection with peer object
var peer = new Peer();
//Display peer id on DOM
peer.on('open', function() {
    document.getElementById("displayId").innerHTML='<em>Your ID: </em>'+peer.id;
    console.log('My peer ID is: ' +peer.id);
  });
peer.on('connection', function (connection) {
    conn=connection;
    console.log(conn);
    console.log(connection.peer);
    peer_id=connection.peer;
    document.getElementById('connID').value=peer_id;
});

peer.on('error', function (err) {
    alert('An error has happnd '+err);
    console.log(err);
});

//on click with the  connection button  =expose ice information to eachother
document.getElementById('con-button').addEventListener('click',function (){
 peer_id=document.getElementById('connID').value;
 if(peer_id){
     conn=peer.connect(peer_id);
 }    
 else{
     alert('Enter an Id');
     return false;
 }
})
//cal on click(offer and answer is exchanged)
peer.on('call', function (call) {
    var acceptCall =confirm('Do Want to answer');
    if(acceptCall){
        call.answer(window.localstream);
        call.on('stream', function (stream) {
            window.peer_stream=stream;
            recieveStream(stream,'rvideo');
        });
        call.on('close',function () {
            alert("The Call is ended");
        });
    }
    else{
        console.log('call denied');
    }
})
//ask to call
document.getElementById('call-button').addEventListener('click',function () {
    console.log('Calling a peer :'+peer_id);
    console.log(peer);

    var call=peer.call(peer_id,window.localstream);
    call.on('stream', function (stream) {
        window.peer_stream=stream;
        recieveStream(stream,'rvideo');
    })
})
// accpet the call

// display the remote video and local video on the clients






/*
//Listener for call
callbtn.addEventListener('click', function(evt){
    evt.preventDefault();
    socket.emit('vcall', navigator.getUserMedia(
        {video:{}},
        stream =>lvideo.srcObject= stream ,
        err => console.error(err)
    ));
});

//Recieving video data from server
socket.on('vcall',function(data){

})
//Configruation for video

//=> lvideo.srcObject= stream

*/

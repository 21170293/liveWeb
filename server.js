const express=require('express');
const app=express();
const http=require('http').createServer(app);
const io=require('socket.io')(http);
const PORT=process.env.PORT || 3000;


//Connecting to PORT
http.listen(PORT,() => {
console.log('Listening on port : '+PORT)
});


//sending file html 

app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/index.html");
});
//setting up folder for use "PUBLIC"
app.use(express.static('public'));



//SCOKET.io setup for client
io.on('connection', function (socket) {
    console.log('Client is Connected');
    //Listening message from user
    socket.on('userMessage',function (data){
        //Now broadcast the data(message)
        io.emit('server',data)
    });
    
        //Listening for who is typing
    socket.on('userTyping',function (data) {
        socket.broadcast.emit('userTyping',data);
    });
   

});


//






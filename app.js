const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'/public')

app.use(express.static(publicDirectoryPath))

let count =10;

io.on('connection',(socket)=>{
    console.log('New WebSocter');

    socket.emit('message','Welcome')
    socket.emit('location','User Location')
    socket.broadcast.emit('message','A new user has joined')

    socket.on('sendMessage',(message,callback)=>{
        io.emit('message',message)
        callback('Delivered')
    })

    socket.on('disconnect',()=>{
        io.emit('message','A user has left')
    })

    socket.on('sendLocation', (coords)=>{
        io.emit('location', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
    })

})

server.listen(port,()=>{
    console.log(`Server is ${port}`);
})
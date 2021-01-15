const chatForm=document.getElementById('chat-form');
const chatMessages =document.querySelector('.chat-messages');
const roomName= document.getElementById('room-name');
const userList=document.getElementById('users');

// get user from url
const {username, room}= Qs.parse(location.search,{
    ignoreQueryPrefix:true
});
const socket=io();

socket.emit('joinRoom',{username, room});

// get room and user
socket.on('roomUsers', ({room, users})=>{
    outputRoomName(room);
    outputUsers(users);
});

socket.on('message', message=>{
    console.log(message);
    outputMessage(message);

    // scroll down
    chatMessages.scrollTop= chatMessages.scrollHeight;
});
// message submit

chatForm.addEventListener('submit', e =>{
    e.preventDefault();
    const msg=e.target.elements.msg.value;
   // enter message to server
   socket.emit('chatMessage', msg); 

   // clear msgbox
   e.target.elements.msg.value="";
   e.target.elements.msg.focus();
})

// out put message
const outputMessage=(message)=>{
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`	<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div);
}
// add users
function outputUsers(users){
    userList.innerHTML=`
    ${users.map(user => `<li>${user.username} </li>`).join('')}`;
}

// add room name
function outputRoomName(room){
    roomName.innerText=room;

}
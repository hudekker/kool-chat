// var socket = io();

let formMsg = document.getElementById('form-msg');
let inputMsg = document.getElementById('input-msg');
let formPartnerId = document.getElementById('form-partner-id');
let inputPartnerId = document.getElementById('input-partner-id');

let conn;
let peer;
let peerId;
let partnerId;
let modal = document.querySelector("#add-user-modal")
let btnAddUser = document.querySelector("#btn-add-user");
let btnPartnerId = document.querySelector('#btn-partner-id');

const getPeerId = (peer) => {
  return new Promise((resolve, reject) => {
    peer.on("open", (id) => resolve(id));
  });
};

const waitForPeer = () => {
  return new Promise((resolve, reject) => {
    setInterval(() => peer?.id ? resolve() : null, 200);
  });
};

const connOpen = (conn, boolReceiver = false) => {
  return new Promise((resolve, reject) => {
    conn.on("open", () => {
      displayMsg(`Friend Id = ${conn.peer}`, 'admin-msg');
      displayMsg(`Connected with ${conn.peer}`, 'admin-msg');
      // if (boolReceiver) {
      //   // displayMsg(`Received connection request from ${conn.peer}`, "", false);
      //   displayMsg(`Friend Id = ${conn.peer}`, 'admin-msg');
      // } else {
      //   displayMsg(`Connected with ${conn.peer}`, 'admin-msg');
      // }
      resolve();
    });
  });
};

const receiveConnRequest = async (conn2) => {

  // Wait for the connection to open 
  conn = conn2;

  let boolReceiver = true;
  await connOpen(conn, boolReceiver);
  console.log('finished waiting for receive conn request');

  // Keep this event listener open, will receive data multiple times
  conn.on("data", (data) => {
    displayMsg(`${data} `, 'friend-msg');
  });

  conn.on("close", () => {
    displayMsg(`${conn.peer} left the chat`, 'admin-msg');
    conn.close();
    conn = "";
  });

  conn.on("error", (err) => {
    displayMsg(`${err} `, 'admin-msg');
    conn.close();
    conn = "";
  });

  // Event listener tied to this conn
  // conn.send(msg);
  // sendMsg.addEventListener("click", (evt) => sendMessage(conn));
};

const sendConnRequest = async () => {

  // let partnerId = '';

  // Create the conn
  conn = peer.connect(partnerId);
  // displayMsg(`Sending connection request to ${partnerId} `, 'admin-msg');

  // Wait for the conn to open and add it to the dropdown
  let boolReceiver = false;
  await connOpen(conn, boolReceiver);
  console.log('Sent Conn request and finished waiting for connOpen');
  // Keep this event listener open, will receive data multiple times
  conn.on("data", (data) => {
    displayMsg(`${data} `, 'friend-msg');
  });

  conn.on("close", () => {
    displayMsg(`${partnerId} left the chat`, 'admin-msg');
    conn.close();
    conn = "";
  });

  conn.on("error", (err) => {
    displayMsg(`Error ${err.type} `, 'admin-msg');
    conn.close();
    conn = "";
  });

  // Event listener tied to this conn
  // sendMsg.addEventListener("click", () => sendMessage(conn));
};




window.onload = async (event) => {
  // Get your peer object and wait for it to open
  let id = '';
  id = Math.floor(1000 + Math.random() * 9000);

  peer = new Peer(id, {
    host: "evening-atoll-16293.herokuapp.com",
    port: 443,
    secure: true,
  });

  debugger;

  peerId = await getPeerId(peer);

  await waitForPeer();

  displayMsg(`My ID = ${peerId} `, 'admin-msg');
  document.querySelector('#peer-id').innerHTML = `Your ID is <span class='highlight'> ${peerId}</span > `;

  // Receive conn request
  peer.on("connection", receiveConnRequest);

  // // Or send conn request
  // sendConnRequest();
}

formMsg.addEventListener('submit', function (e) {
  e.preventDefault();
  if (inputMsg.value) {
    displayMsg(inputMsg.value, 'my-msg');
    conn.send(inputMsg.value);
    inputMsg.value = '';
  }
});

formPartnerId.addEventListener('submit', function (e) {
  e.preventDefault();
});

// socket.on('chat message', function (msg) {
//   var item = document.createElement('li');
//   var div = document.createElement('div');
//   div.classList.add('shift')
//   item.appendChild(div)
//   // item.textContent = msg;
//   div.textContent = msg;
//   messages.appendChild(item);
//   window.scrollTo(0, document.body.scrollHeight);
// });

const displayMsg = (msg, msgClass) => {
  let item = document.createElement('li');
  let div = document.createElement('div');
  item.classList.add(msgClass)
  item.appendChild(div)
  // item.textContent = msg;
  div.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
}


// When the user clicks the button, open the modal 
btnAddUser.onclick = function () {
  modal.classList.remove('modal-hide');
}

// When the user clicks on <span> (x), close the modal
document.querySelector("#close").onclick = function () {
  modal.classList.add('modal-hide')
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.classList.add('modal-hide')
  }
}

btnPartnerId.onclick = function () {
  partnerId = document.querySelector('#input-partner-id').value;
  if (partnerId !== '') {
    console.log(partnerId);
    // displayMsg(`Friend ID = ${partnerId} `, `admin-msg`)
    sendConnRequest();
  }
  modal.classList.add('modal-hide');
}


import io from "socket.io-client";

// const socket = io('http://localhost:3000')
// const URL = "http://localhost:3000";
// const URL = "https://chat-app-joydeep.herokuapp.com";
const URL = "https://serene-crag-69679.herokuapp.com";
const socket = io(URL, { autoConnect: false });

// socket.onAny((event, ...args) => {
//   console.log(event + "\n", args);
// });

export default socket;
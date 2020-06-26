import io from "socket.io-client";

export const socket = io("http://" + process.env.REACT_APP_IP_ADDRESS + ":3001");

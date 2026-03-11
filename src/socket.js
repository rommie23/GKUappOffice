import { io } from "socket.io-client";
import {BASE_URL} from '@env'

const SOCKET_URL = BASE_URL; // same as API base URL

export const socket = io(SOCKET_URL, {
  transports: ["websocket"], // faster, stable
  autoConnect: false,
});

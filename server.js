import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import onCall from "./socket-event/onCall.js";
import onWebrtcSignal from "./socket-event/onWebrtcSignal.js";
import onHangUp from "./socket-event/onHangUp.js";


const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

export let io;

app.prepare().then(() => {
    const httpServer = createServer(handler);

    io = new Server(httpServer);
    let onlineUsers = [];

    io.on("connection", (socket) => {

        // add user to online users list
        socket.on("addNewUser", (user) => {
            user && !onlineUsers.some((u) => u.userId === user.id) && onlineUsers.push({
                userId: user.id,
                socketId: socket.id,
                profile: user
            });

            // update online users list
            io.emit("getUsers", onlineUsers);
        });

        // Call Event
        socket.on('call', onCall)
        socket.on("webrtcSignal", onWebrtcSignal);
        socket.on("hangup", onHangUp)

        socket.on("disconnect", () => {
            onlineUsers = onlineUsers.filter((u) => u.socketId !== socket.id);

            // update online users list
            io.emit("getUsers", onlineUsers);
        })
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});
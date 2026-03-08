import type { NitroApp } from "nitropack";
import { Server as Engine } from "engine.io";
import { Server } from "socket.io";

interface User {
  id: string;
  username: string;
}

interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
}

const users = new Map<string, User>();
const messages: Message[] = [];

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine();
  const io = new Server({ cors: { origin: "*", methods: ["GET", "POST"] } });

  io.bind(engine);

  io.on("connection", (socket) => {
    console.log("🎉 New user connected:", socket.id);

    socket.on("user-join", (username: string) => {
      const user: User = { id: socket.id, username: username };
      users.set(socket.id, user);
      console.log(`👋 ${username} joined the party !`);
      socket.emit("message-history", messages);
      socket.broadcast.emit("user-joined", {
        username: username,
        message: `${username} joined the chat`,
        timestamp: new Date(),
      });
      io.emit("users-update", Array.from(users.values()));
    });

    socket.on("new-message", (data: { message: string }) => {
      const user = users.get(socket.id);
      if (user) {
        const messageObj: Message = {
          id: Date.now().toString(),
          username: user.username,
          message: data.message,
          timestamp: new Date(),
        };
        messages.push(messageObj);
        if (messages.length > 100) {
          messages.shift();
        }
        io.emit("message-received", messageObj);
        console.log(`📢 ${user.username} : $ { data.message }`);
      }
    });

    socket.on("disconnect", () => {
      const user = users.get(socket.id);
      if (user) {
        users.delete(socket.id);
        console.log(`👋 ${user.username} left the chat`);
        socket.broadcast.emit("user-left", {
          username: user.username,
          message: `${user.username} left the chat`,
          timestamp: new Date(),
        });
        io.emit("users-update", Array.from(users.values()));
      }
    });
  });

  nitroApp.router.use(
    "/socket.io/",
    defineEventHandler({
      handler(event) {
        engine.handleRequest(event.node.req, event.node.res);
        event._handled = true;
      },
      websocket: {
        open(peer) {
          engine.prepare(peer._internal.nodeReq);
          engine.onWebSocket(
            peer._internal.nodeReq,
            peer._internal.nodeReq.socket,
            peer.websocket,
          );
        },
      },
    }),
  );
});

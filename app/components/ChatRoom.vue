<template>
  <div class="flex h-screen bg-gray-100">
    <!-- The community sidebar - I love seeing who's online! -->
    <div class="w-64 bg-white shadow-lg">
      <div class="p-4 bg-indigo-600 text-white">
        <h3 class="font-semibold">Online Now ({{ users.length }})</h3>
      </div>
      <div class="p-4">
        <div
          v-for="user in users"
          :key="user.id"
          class="flex items-center space-x-2 mb-2 animate-pulse"
        >
          <div class="w-2 h-2 bg-green-400 rounded-full"></div>
          <span class="text-sm font-medium">{{ user.username }}</span>
        </div>
      </div>
    </div>
    <div class="flex-1 flex flex-col">
      <!-- Header with a personal touch -->
      <div class="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 class="text-xl font-semibold">🚀 Community Chat</h1>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-600"
            >Hey there, {{ currentUser }}! 👋</span
          >
          <button
            @click="leaveChat"
            class="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
          >
            Leave Chat
          </button>
        </div>
      </div>
      <div
        ref="messagesContainer"
        class="flex-1 overflow-y-auto p-4 space-y-4 messages-container"
      >
        <div
          v-for="message in messages"
          :key="message.id"
          class="flex flex-col message-bubble"
        >
          <div
            v-if="message.type === 'system'"
            class="text-center text-gray-500 text-sm italic bg-gray-100 rounded-full py-2 px-4 mx-auto"
          >
            {{ message.message }}
          </div>
          <!-- Regular chat messages -->
          <UChatMessage
            v-else
            :content="message.message"
            :side="message.username === currentUser ? 'right' : 'left'"
            :variant="message.username === currentUser ? 'outline' : 'solid'"
            :user="{
              side: 'left',
              variant: 'solid',
              avatar: {
                src: 'https://github.com/benjamincanac.png',
              },
            }"
            :createdAt="formatTime(message.timestamp)"
          />
        </div>
      </div>
      <div class="bg-white p-4 border-t shadow-lg">
        <form @submit.prevent="sendMessage" class="flex space-x-2">
          <input
            v-model="newMessage"
            type="text"
            placeholder="What's on your mind? Type here..."
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            maxlength="500"
            @input="handleTyping"
          />
          <button
            type="submit"
            :disabled="!newMessage.trim()"
            class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
          >
            Send 🚀
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { io, Socket } from "socket.io-client";

const props = defineProps<{
  username: string;
}>();

const emit = defineEmits<{
  "leave-chat": [];
}>();

interface User {
  id: string;
  username: string;
}

interface Message {
  id: string;
  username?: string;
  message: string;
  timestamp: Date;
  type?: "system" | "user";
}

const socket = ref<Socket | null>(null);
const messages = ref<Message[]>([]);
const users = ref<User[]>([]);
const newMessage = ref("");
const messagesContainer = ref<HTMLElement>();
const currentUser = computed(() => props.username);

const initializeSocket = () => {
  console.log("🔌 Connecting to the chat universe...");
  socket.value = io();

  socket.value.emit("user-join", props.username);

  socket.value.on("message-history", (history: Message[]) => {
    console.log("📚 Loading message history...");
    messages.value = history.map((msg) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
      type: "user",
    }));
    nextTick(() => scrollToBottom());
  });

  socket.value.on("message-received", (message: Message) => {
    console.log("💬 New message from", message.username);
    messages.value.push({
      ...message,
      timestamp: new Date(message.timestamp),
      type: "user",
    });
    nextTick(() => scrollToBottom());
  });

  socket.value.on("user-joined", (data: any) => {
    console.log("🎉 Someone new joined!");
    messages.value.push({
      id: Date.now().toString(),
      message: data.message,
      timestamp: new Date(data.timestamp),
      type: "system",
    });
    nextTick(() => scrollToBottom());
  });

  socket.value.on("user-left", (data: any) => {
    console.log("👋 Someone left the chat");
    messages.value.push({
      id: Date.now().toString(),
      message: data.message,
      timestamp: new Date(data.timestamp),
      type: "system",
    });
    nextTick(() => scrollToBottom());
  });

  socket.value.on("users-update", (usersList: User[]) => {
    console.log("User list updated:", usersList.length, "users online");
    users.value = usersList;
  });

  socket.value.on("connect", () => {
    console.log("Connected to chat server!");
  });

  socket.value.on("disconnect", () => {
    console.log("Disconnected from chat server");
  });
};

const sendMessage = () => {
  if (!newMessage.value.trim() || !socket.value) return;

  console.log("📤 Sending message:", newMessage.value);
  socket.value.emit("new-message", {
    message: newMessage.value.trim(),
  });

  newMessage.value = "";
};

const leaveChat = () => {
  console.log("👋 Leaving the chat...");
  if (socket.value) {
    socket.value.disconnect();
  }
  localStorage.removeItem("chat-username");
  emit("leave-chat");
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

onMounted(() => {
  console.log("🚀 Chat room mounting for", props.username);
  initializeSocket();
});

onBeforeUnmount(() => {
  console.log("🧹 Cleaning up socket connection...");
  if (socket.value) {
    socket.value.disconnect();
  }
});
</script>

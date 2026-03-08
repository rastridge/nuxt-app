<template>
  <div>
    <UsernameSetup v-if="!currentUsername" @username-set="handleUsernameSet" />
    <ChatRoom
      v-else
      :username="currentUsername"
      @leave-chat="handleLeaveChat"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const currentUsername = ref("");

const handleUsernameSet = (username: string) => {
  console.log("🎉 Username set:", username);
  currentUsername.value = username;
};

const handleLeaveChat = () => {
  console.log("👋 User left the chat");
  currentUsername.value = "";
};

onMounted(() => {
  const existingUsername = localStorage.getItem("chat-username");
  if (existingUsername) {
    console.log("🔄 Returning user detected:", existingUsername);
    currentUsername.value = existingUsername;
  }
});
</script>

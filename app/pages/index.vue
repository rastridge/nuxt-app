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

<script setup>
const currentUsername = ref("");

/* const getItem = async (user_name) => {
  const { data } = await useFetch(`/chat/${user_name}`, {
    method: "get",
  });
  return data.value;
}; */

const handleUsernameSet = (username) => {
  console.log("🎉 Username set:", username);
  currentUsername.value = username;
};

const handleLeaveChat = () => {
  console.log("👋 User left the chat");
  currentUsername.value = "";
};

onMounted(() => {
  // const existingUsername = getItem("chat-username");
  const existingUsername = localStorage.getItem("chat-username");
  if (existingUsername) {
    console.log("🔄 Returning user detected:", existingUsername);
    currentUsername.value = existingUsername;
  }
});
</script>

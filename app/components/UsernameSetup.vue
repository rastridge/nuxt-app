<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Join the ASR Chat
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Choose a unique username to start chatting
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="joinChat">
        <div>
          <label for="username" class="sr-only">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            maxlength="20"
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Enter your username"
          />
        </div>

        <div v-if="error" class="text-red-600 text-sm">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="!username.trim() || isJoining"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isJoining ? "Joining..." : "Join Chat" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  "username-set": [username: string];
}>();

const username = ref("");
const error = ref("");
const isJoining = ref(false);

/* const setItem = async (chat_user: string) => {
  const { data } = await useFetch(`/chat/set/`, {
    method: "post",
    body: {
      chat_user,
    },
  });
  return data.value;
};
 */
const joinChat = async () => {
  if (!username.value.trim()) {
    error.value = "Username cannot be empty";
    return;
  }

  if (username.value.length > 20) {
    error.value = "Username must be 20 characters or less";
    return;
  }

  isJoining.value = true;
  error.value = "";

  try {
    localStorage.setItem("chat-username", username.value.trim());
    console.log("Username saved successfully:", username.value.trim());

    emit("username-set", username.value.trim());
  } catch (err) {
    error.value = "Failed to join chat. Please try again.";
    console.error("Failed to save username:", err);
  } finally {
    isJoining.value = false;
  }
};

onMounted(() => {
  const existingUsername = localStorage.getItem("chat-username");
  if (existingUsername) {
    username.value = existingUsername;
    console.log("🎉 Welcome back,", existingUsername);
  }
});
</script>

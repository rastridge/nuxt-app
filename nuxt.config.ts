// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: ["@nuxt/ui"],
  css: ["~/assets/css/main.css"],
  nitro: { experimental: { websocket: true } },
  runtimeConfig: {
    DB_HOST: "mysql.buffalorugby.org",
    DB_USER: "rastridge",
    DB_PASSWORD: "BMG$KGD3Y#tt$dY",
    DB_DATABASE: "buffalorugby",
  },
});

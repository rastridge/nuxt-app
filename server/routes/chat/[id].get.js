// import { chatService } from "#server/services/chatService";
export default defineEventHandler(async (event) => {
  const id = event.context.params.id;
  return chatService.getItem(id);
});

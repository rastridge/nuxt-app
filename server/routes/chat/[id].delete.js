export default defineEventHandler(async (event) => {
  const id = event.context.params.id;
  return chatService.deleteItem(id);
});

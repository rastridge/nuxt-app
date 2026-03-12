const { doDBQuery } = useQuery();

export const chatService = {
  getItem,
  setItem,
  deleteItem,
};

async function getItem(id) {
  const sql = `SELECT
                    chat_user_id,
                    chat_user
                FROM
                    inbrc_chat
                WHERE
                    deleted = 0
                    AND
                    chat_user_id = ${id}`;

  const chat = await doDBQuery(sql);
  return chat[0];
}

async function setItem(chat_user) {
  let sql = `INSERT INTO inbrc_chat
								SET
								chat_user = ?`;

  let inserts = [];
  inserts.push(chat_user);

  const chat = await doDBQuery(sql, inserts);
  return chat;
}

async function deleteItem(chat_user) {
  const sql = `DELETE FROM inbrc_chat WHERE chat_user = "${chat_user}"`;
  const chat = await doDBQuery(sql);
  return chat;
}

const pool = require('./db');

module.exports = {
  getTasks: async (userId) => {
    try {
      const result = await pool.query(
        'SELECT id, title, description, completed FROM tasks WHERE user_id = $1 ORDER BY id',
        [userId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error en getTasks:', error);
      throw error;
    }
  },

  createTask: async (userId, taskData) => {
    try {
      const { title, description = '' } = taskData;
      const result = await pool.query(
        'INSERT INTO tasks (user_id, title, description, completed) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, title, description, false]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error en createTask:', error);
      throw error;
    }
  },

  updateTask: async (userId, taskId, updateData) => {
    try {
      const fields = [];
      const values = [];
      let idx = 3;

      if (updateData.title !== undefined) {
        fields.push(`title = $${idx++}`);
        values.push(updateData.title);
      }
      if (updateData.description !== undefined) {
        fields.push(`description = $${idx++}`);
        values.push(updateData.description);
      }
      if (updateData.completed !== undefined) {
        fields.push(`completed = $${idx++}`);
        values.push(updateData.completed);
      }

      if (fields.length === 0) return null;

      const query = `
        UPDATE tasks
        SET ${fields.join(', ')}
        WHERE id = $1 AND user_id = $2
        RETURNING *;
      `;

      const result = await pool.query(query, [taskId, userId, ...values]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error en updateTask:', error);
      throw error;
    }
  },

  deleteTask: async (userId, taskId) => {
    try {
      await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);
    } catch (error) {
      console.error('Error en deleteTask:', error);
      throw error;
    }
  },
};

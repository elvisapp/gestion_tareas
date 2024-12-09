const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 4000; // Cambiado a 4000

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: 'example',
    database: 'task_manager'
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
    } else {
        console.log('Conectado a MySQL');
    }
});

db.query(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT false
    )
`, (err) => {
    if (err) throw err;
    console.log('Tabla "tasks" creada o ya existente');
});

app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/tasks', (req, res) => {
    const { title } = req.body;
    db.query('INSERT INTO tasks (title) VALUES (?)', [title], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId });
    });
});

app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    db.query('UPDATE tasks SET completed = ? WHERE id = ?', [completed, id], (err) => {
        if (err) throw err;
        res.send('Tarea actualizada');
    });
});

app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.send('Tarea eliminada');
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});

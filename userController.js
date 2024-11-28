const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar usuario
exports.register = (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.query(sql, [username, hashedPassword], (err) => {
        if (err) return res.status(500).json({ message: 'Error al registrar usuario' });
        res.status(200).json({ message: 'Usuario registrado con éxito' });
    });
};

// Iniciar sesión
exports.login = (req, res) => {
    const { username, password } = req.body;

    const sql = `SELECT * FROM users WHERE username = ?`;
    db.query(sql, [username], (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });

        const user = results[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });

        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    });
};

// Guardar puntaje
exports.saveScore = (req, res) => {
    const { score } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const sql = `INSERT INTO scores (user_id, score) VALUES (?, ?)`;
    db.query(sql, [decoded.id, score], (err) => {
        if (err) return res.status(500).json({ message: 'Error al guardar el puntaje' });
        res.status(200).json({ message: 'Puntaje guardado exitosamente' });
    });
};

// Obtener puntajes
exports.getScores = (req, res) => {
    const sql = `
        SELECT u.username, s.score, s.game_date
        FROM scores s
        JOIN users u ON s.user_id = u.id
        ORDER BY s.score DESC
        LIMIT 10
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error al obtener puntajes' });
        res.status(200).json(results);
    });
};

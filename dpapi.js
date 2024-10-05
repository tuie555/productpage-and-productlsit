const express = require('express');
const { Pool } = require('pg');
const multer = require('multer');
const fs = require('fs');
const uuid = require('uuid');
const app = express();
const pool = new Pool({
  user: 'postgres',
  host: 'x526d.3bbddns.com',
  database: 'product',
  password: 'camtse67',
  port: 19543,
});

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './picture/');
  },
  filename: function (req, file, cb) {
    const uniqueId = uuid.v4();
    cb(null, `${uniqueId}-${file.originalname}`);
  },
})

const imageUpload = multer({
  storage: imageStorage
});

app.use(express.json());

// API endpoint to retrieve all users
app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving users' });
  }
});

// API endpoint to create a new user
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await pool.query('INSERT INTO sellers (seller_name, seller_email) VALUES ($1, $2) RETURNING *', [name, email]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// API endpoint to upload an image
app.post('/upload-image', imageUpload.single('Image'), async (req, res) => {
  try {
    const image = req.file;
    const uniqueId = image.filename.split('-')[0];
    const imageUrl = `http://x526d.3bbddns.com:19542/picture/${image.filename}`;
    
    const result = await pool.query('INSERT INTO productlist (image_id, image_url) VALUES ($1, $2) RETURNING *', [uniqueId, imageUrl]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating product' });
  }
});



app.get('/images/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = `./picture/${filename}`;
  res.sendFile(filePath);
});

app.listen(3035, () => {
  console.log('API listening on port 3035');
});
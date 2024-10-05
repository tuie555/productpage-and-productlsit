const express = require('express');
const app = express();
const { Pool } = require('pg');
const multer = require('multer');
const fs = require('fs');
const uuid = require('uuid');
const cors = require('cors');

app.use(cors());

// Database connection (Postgres)
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
    cb(null, `${file.originalname}`);
  },
})

const imageUpload = multer({
  storage: imageStorage
});

app.use(express.json());

// API endpoint to add data to the database

  app.get('/add-data', (req, res) => {
    // Retrieve the cards from the database
    const cards = pool.query('SELECT * FROM products', (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: 'Error loading cards' });
      } else {
        res.json(results);
      }
    });
  });

  app.post('/add-product', imageUpload.single('Image'), async (req, res) => {
    try {
      const { name, price, category, details, seller } = req.body;
      imageUrl = uploadedImage;
      
      const query = {
        text: `INSERT INTO products (product_name, price, category, details, image_url, seller) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        values: [name, price, category, details, imageUrl, seller]
      };
      const result = await pool.query(query);
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating product' });
    }
  });
  
let uploadedImage = '';

// API endpoint to retrieve products
app.get('/PullPro', (req, res) => {
  // Retrieve the products from the database
  pool.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Error loading products' });
    } else if (!results || !results.rows) {
      res.status(404).send({ message: 'No products found' });
    } else {
      const products = results.rows.map((product) => ({
        id: product.product_id,
        name: product.product_name,
        price: product.price,
        image: product.image_url,
        description: product.details,
        category: product.category,
        seller: product.seller
      }));
      res.json(products);
    }
  });
});

app.post('/upload-image', imageUpload.single('Image'), async (req, res) => {
  try {
    const imagexd = req.file;
    const imageUrl = `http://x526d.3bbddns.com:19544/picture/${image.filename}`;
    uploadedImage = imageUrl;
     res.json({ imageUrl });
  } catch (error) {
    console.error(error);
    res.status(4500).json({ message: 'Error creating product' });
  }
});

// API endpoint to retrieve an image
app.get('/images/:filename', (req, res) => {
  const filename = req.params.file;
  const filePath = `./picture/${filename}`;
  res.sendFile(filePath);
});

app.listen(2000, () => {
  console.log('Server listening on port 2000');
});
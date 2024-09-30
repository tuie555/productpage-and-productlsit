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
    cb(null, `${uniqueId}-${file.originalname}`);
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

// API endpoint to retrieve products
app.get('/PullPro', (req, res) => {
  // Retrieve the products from the database
  pool.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Error loading products' });
    } else {
      const products = results.rows.map((product) => ({
        id: product.product_id,
        name: product.product_name,
        price: product.price,
        image: [product.image_url],
        description: product.details,
        category: product.category
      }));
      
      res.json(products);
    }
  });
});

// API endpoint to upload an image
app.post('/upload-image', imageUpload.array('Image', 12), async (req, res) => {
  try {
    const { v4: uuidv4 } = require('uuid');
    const images = req.files;
    const uniqueId = uuidv4().split('-')[0];
    let productId = 1;

    const imageUrls = images.map((image) => {
      // Construct image URL (ideally more dynamically)
      const imageUrl = `http://x526d.3bbddns.com:19544/picture/${image.filename}`; 
      return imageUrl;
    });1

    const query = {
      text: `INSERT INTO productlist(image_urls, image_id) VALUES ($1, $2)`,
      values: [JSON.stringify(imageUrls), uniqueId]
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) { // Check if the product was found
      return res.status(404).json({ message: 'Product not found' });
    }

    productId++;

    res.json({ message: 'Images uploaded successfully' }); 
  } catch (error) {
    console.error(`Error uploading images: ${error.message}`);
    res.status(500).json({ message: 'Error uploading images' }); 
  }
});

// API endpoint to retrieve an image
app.get('/images/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = `./picture/${filename}`;
  res.sendFile(filePath);
});

app.listen(2000, () => {
  console.log('Server listening on port 2000');
});
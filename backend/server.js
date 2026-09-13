const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const getData = (file) => JSON.parse(fs.readFileSync(path.join(__dirname, 'data', file)));
const saveData = (file, data) => fs.writeFileSync(path.join(__dirname, 'data', file), JSON.stringify(data, null, 2));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.get('/api/products', (req, res) => res.json(getData('products.json')));
app.post('/api/products', upload.single('image'), (req, res) => {
  const products = getData('products.json');
  const imageUrl = req.file ? 'http://localhost:5000/uploads/' + req.file.filename : (req.body.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500');
  const newProduct = {
    id: Date.now().toString(),
    name: req.body.name,
    price: Number(req.body.price),
    category: req.body.category || 'Casual',
    stock: Number(req.body.stock || 10),
    image: imageUrl
  };
  products.unshift(newProduct);
  saveData('products.json', products);
  res.json(newProduct);
});

app.delete('/api/products/:id', (req, res) => {
  let products = getData('products.json');
  products = products.filter(p => p.id !== req.params.id);
  saveData('products.json', products);
  res.json({ message: 'Deleted' });
});

app.get('/api/orders', (req, res) => res.json(getData('orders.json')));
app.get('/api/users', (req, res) => res.json(getData('users.json')));

app.listen(5000, () => console.log('SHOP.CO Backend Running on http://localhost:5000'));
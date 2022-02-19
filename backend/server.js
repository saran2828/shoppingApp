const express = require('express')
const fs = require('fs')
cors = require('cors')
const app = express()
app.use(cors())
//this line is required to parse the request body
app.use(express.json())

app.post('/product/add', (req, res) => {
    const products = getProductList();
    const reqData = req.body
    if (reqData.name == null || reqData.quantity == null || reqData.category == null || reqData.price == null) {
        return res.status(401).send({ error: true, msg: 'product detail missing' })
    }
    //check if the product name exist already
    const findExist = products.find(product => product.name === reqData.name)
    if (findExist) {
        return res.status(409).send({ error: true, msg: 'product name already exist' })
    }
    reqData.id = Math.floor(Math.random() * 1000);//just for test
    products.push(reqData);
    saveProduct(products);
    res.send({ success: true, msg: 'Product added successfully' });

})

app.get('/product', (req, res) => {
    const products = getProductList();
    res.send(products)
})


app.get('/product/get/:id', (req, res) => {
    const id = req.params.id;
    const products = getProductList();
    const product = products.find((p) => {
        return p.id == id;
    });
    res.send(product);
})


app.get('/product/get/category/:category', (req, res) => {
    const category = req.params.category;
    const products = getProductList();
    const fetched = products.filter((p) => {
        return p.category.toLowerCase() === category.toLowerCase();
    });
    res.send(fetched);
})

app.put('/product/update/:id', (req, res) => {
    const id = req.params.id;
    const product = req.body;
    const products = getProductList();
    const updateProduct = products.filter((p) => {
        return p.id != id
    }
    );
    product.id = id;
    updateProduct.push(product);
    saveProduct(updateProduct)
    res.send({ success: true, msg: 'Product data updated successfully' })
})

app.delete('/product/delete/:id', (req, res) => {
    const id = req.params.id
    const products = getProductList();
    const filterProduct = products.filter(product => product.id != id);
    saveProduct(filterProduct);
    res.send({ success: true, msg: 'Product removed successfully' })
})



const saveProduct = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync('products.json', stringifyData)
}

const getProductList = () => {
    const jsonData = fs.readFileSync('products.json')
    return JSON.parse(jsonData)
}



//configure the server port
app.listen(3000, () => {
    console.log('Server runs on port 3000')
})
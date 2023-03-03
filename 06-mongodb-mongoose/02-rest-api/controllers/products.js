const Product = require('../models/Product.js');
const mapProduct = require('../mappers/product.js');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
    const {subcategory} = ctx.query;

    if (!subcategory || !mongoose.isValidObjectId(subcategory)) return next();

    const prodList = await Product.find({subcategory:{_id: subcategory}});
    
    ctx.body = {products: prodList.map(product => mapProduct(product))};
};

module.exports.productList = async function productList(ctx, next) {
    const prodList = await Product.find();
    
    ctx.body = {products: prodList.map(product => mapProduct(product))};
};

module.exports.productById = async function productById(ctx, next) {
    
    const id = ctx.params.id;
    if (!mongoose.isValidObjectId(id)) ctx.throw(400);
    
    const prod = await Product.findOne({_id: id});
    if (!prod) ctx.throw(404);
    
    ctx.body = {product: mapProduct(prod)};
};


const express = require('express');

const ProductsService = require('../../services/products');
const { config } = require('../../config/index');

const cacheResponse = require("../../utils/cacheResponse");
const { FIVE_MINUTES_IN_SECONDS } = require("../../utils/time");

function productsApi(app){

    const router = express.Router();
    app.use("/api/products", router);

    const productService = new ProductsService();



    router.get('/',async function(req,res,next){
        cacheResponse(res,FIVE_MINUTES_IN_SECONDS);
        const {tags} = req.query;

        try {
        
            const products = await productService.getProducts({tags});
            res.render("products", { products, dev: config.dev });
        } catch (error) {
            next(error)
        }
        
    });
}
module.exports = productsApi;
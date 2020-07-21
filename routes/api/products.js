const express = require('express');
const passport = require("passport");
const router = express.Router();
const ProductsService = require('../../services/products');

const validation = require('../../utils/middlewares/validationHandler');


const { productIdSchema, productTagSchema, createProductSchema, updateProductSchema} = require("../../utils/schemas/products");

//JWT Strategy

require("../../utils/auth/strategies/jwt");

const productService = new ProductsService();

const cacheResponse = require("../../utils/cacheResponse");
const { FIVE_MINUTES_IN_SECONDS,SIXTY_MINUTES_IN_SECONDS } = require("../../utils/time");




router.get('/', async function(req,res,next){

    cacheResponse(res,FIVE_MINUTES_IN_SECONDS)

    const { tags } = req.query;

    try {
       
        const products = await productService.getProducts({tags})
        
        res.status(200).json({
            data: products,
            message: 'products listed'
        })
        
    } catch (error) {
        next(error);
    }
    
});

router.get('/:productId', async function(req,res,next){

    cacheResponse(res,SIXTY_MINUTES_IN_SECONDS)
    const { productId }  = req.params;

    try {
        const product = await productService.getProduct({productId})

        res.status(200).json({
            data: product,
            message: 'products retrieved'
        })
    } catch (error) {
        next(error);
    }
    
});

router.post('/', validation(createProductSchema) ,async function(req,res,next){

    const { body:product } = req;

    try {
        const createdProduct = await productService.createProduct({product});

        res.status(201).json({
            data: createdProduct,
            message: 'products created'
        })
        
    } catch (error) {
        next(error);
    }
    
});

router.put('/:productId',passport.authenticate("jwt", {session:false}),validation({productId: productIdSchema},"params") ,validation(updateProductSchema) ,async function(req,res,next){

    const { productId } = req.params;
    const { body:product } = req

    try {
        const updatedProduct = await productService.updateProduct({productId,product})

        res.status(200).json({
            data: updatedProduct,
            message: 'products update'
        });

    } catch (error) {
        next(error)
    }
    
});

router.delete('/:productId',passport.authenticate("jwt", {session:false}), async function(req,res,next){

    const { productId } = req.params;
    const product = await productService.deleteProduct({productId})

    try {
        res.status(200).json({
            data: product,
            message: 'products deleted'
        })
    } catch (error) {
        next(error)
    }
    
});

module.exports = router;
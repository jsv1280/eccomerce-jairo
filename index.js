const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const boom = require("boom");
const debug = require("debug")("app:server");
const helmet = require("helmet");
const productsRouter = require("./routes/views/products");
const productsApiRouter = require("./routes/api/products");
const authApiRouter = require('./routes/api/auth')

const {
    logErrors,
    wrapErrors,
    clientErrorHandler,
    errorHandler
} = require('./utils/middlewares/errorsHandlers');

const isRequestAjaxOrAPi = require('./utils/isRequestAjaxOrApi');

//app
const app = express();

//middleware
app.use(helmet());
app.use(bodyParser.json());

// static files
app.use('/static', express.static(path.join(__dirname,"public")))

// View engine setup
app.set("views",path.join(__dirname,"views"));
app.set("view engine","pug");



// routes
app.use("/products",productsRouter);
productsRouter(app);
app.use("/api/auth", authApiRouter);

//redirect
app.get('/', function(req,res){
    res.redirect('/products');
});

app.use(function(req,res,next){
    if(isRequestAjaxOrAPi(req)){
        const {
            output: { statusCode , payload}
        } = boom.notFound();

        res.status(statusCode).json(payload);
    }

    res.status(404).render("404");

    
})

// error handlers
app.use(logErrors);
app.use(wrapErrors);
app.use(clientErrorHandler);
app.use(errorHandler);


// server
const server = app.listen(8000, function(){
    debug(`Listening http://localhost:${server.address().port}`)
});
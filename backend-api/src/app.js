const express = require('express');
const cors = require('cors');
const JSend = require('./jsend');
const usersRouter = require('./routes/users.router');
const cartRouter = require('./routes/carts.router');
const productRouter = require('./routes/products.router');
const orderRouter = require('./routes/orders.router');
const authRouter = require('./routes/auth.router');

const {
  resourceNotFound,
  handleError,
} = require('./controllers/errors.controller');
const { specs, swaggerUi } = require('./docs/swagger');

const app = express();

// Session middleware must be initialized before routes
const session = require('express-session');

// Middleware configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize session middleware
app.use(session({
    secret: 'Projectweb123@', // Change this to your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Basic route
app.get('/', (req, res) => {
    return res.json(JSend.success());
});

// API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Static files
app.use('/public', express.static('public'));

// Set up routers
usersRouter.setup(app); 
cartRouter.setup(app);
productRouter.setup(app);
orderRouter.setup(app);
authRouter.setup(app);
const path = require('path');
app.use('/images', express.static(path.join(__dirname, '\\backend-api\\public\\images')));


// Handle 404 response
app.use(resourceNotFound);

// Define error-handling middleware last, after other app.use() and router calls
app.use(handleError);

module.exports = app;

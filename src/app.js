const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const routerViews = require('./routes/views.routes')
const productRouter = require('./routes/products.routes')
const cartRouter = require('./routes/cart.routes')


const app = express();
const httpServer = app.listen(8080, () => console.log('Server running on port 8080'));
const io = new Server(httpServer);



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/', routerViews);
app.use('/realtimeproducts', routerViews);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter );



io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('add-product', (data) => {
        console.log(data);
    })

    socket.on('delete-product', (data) => {
        console.log(data);
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    })

    socket.on('productAdded', () => {
        io.emit('updateProducts')});

})
   

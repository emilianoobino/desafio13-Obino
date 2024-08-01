import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import "./database.js";
import exphbs from "express-handlebars";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import { faker } from '@faker-js/faker';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import authMiddleware from "./middleware/authmiddleware.js";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import userRouter from "./routes/user.router.js";
import checkoutRouter from './routes/checkout.router.js';
import SocketManager from "./sockets/socketmanager.js";
import addLogger from "./utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 8080;

// Función para generar productos falsos
const generateFakeProducts = (numProducts = 100) => {
  const products = [];
  for (let i = 0; i < numProducts; i++) {
    products.push({
      _id: faker.datatype.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      category: faker.commerce.department(),
      image: faker.image.imageUrl(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });
  }
  return products;
};

// Endpoint para obtener productos falsos
app.get('/mockingproducts', (req, res) => {
  const products = generateFakeProducts();
  res.json(products);
});

// Middleware
app.use(addLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ credentials: true, origin: 'http://localhost:8080' }));
app.use(cookieParser());

// Endpoint para probar los logs
app.get("/loggertest", (req, res) => {
  req.logger.http("Mensaje HTTP"); 
  req.logger.info("Mensaje INFO"); 
  req.logger.warning("Mensaje WARNING"); 
  req.logger.error("Mensaje ERROR"); 
  res.send("Logs generados");
});

// Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, 'views'));

// Configuración de session
app.use(session({
  secret: "secretCoder",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: `mongodb+srv://chaval198678:tonyfunko@cluster0.6l6psjf.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0`,
    ttl: 120
  })
}));

app.use(flash());

// Configuración de Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Middleware de autenticación
app.use(authMiddleware(['/login', '/register', '/api/users/register', '/api/users/login']));

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/", viewsRouter);
app.use('/checkout', checkoutRouter);

// Ruta para la página de login
app.get('/login', (req, res) => {
  res.render('login');
});

// Iniciar el servidor
const httpServer = app.listen(PUERTO, () => {
  console.log(`Conectado a http://localhost:${PUERTO}`);
});

// Websockets
new SocketManager(httpServer);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});



import express from 'express';
import passport from 'passport';
import UserController from '../controllers/user.controller.js';
import authMiddleware from "../middleware/authmiddleware.js";
import CustomError from "../services/errores/custom-error.js";
import generarInfoError from "../services/errores/info.js";
import { EErrors } from "../services/errores/enums.js";
import { isAdmin, isUser } from "../middleware/authorization.js";

const router = express.Router();
const userController = new UserController();

// Registro de usuarios
router.post('/register', userController.register.bind(userController));

// Inicio de sesión de usuarios
router.post('/login', passport.authenticate('login', { 
    successRedirect: '/api/users/profile',
    failureRedirect: '/login',
    failureFlash: true 
}));

// Aplicar middleware de autenticación a rutas protegidas
router.use(authMiddleware(['/login', '/register', '/requestPasswordReset', '/reset-password']));

router.get('/profile', passport.authenticate("jwt", { session: false }), userController.profile.bind(userController));
router.post('/logout', userController.logout.bind(userController));
router.get('/admin', passport.authenticate("jwt", { session: false }), userController.admin.bind(userController));
router.post("/requestPasswordReset", userController.requestPasswordReset.bind(userController));
router.post('/reset-password', userController.resetPassword.bind(userController));
router.put("/premium/:uid", userController.cambiarRolPremium.bind(userController));

// Rutas de productos (ejemplo simplificado)
router.post('/products', isAdmin, (req, res) => {
    res.send('Producto creado');
});

router.put('/products/:id', isAdmin, (req, res) => {
    res.send('Producto actualizado');
});

router.delete('/products/:id', isAdmin, (req, res) => {
    res.send('Producto eliminado');
});

// Ruta para agregar productos al carrito (ejemplo)
router.post('/carts', isUser, (req, res) => {
    res.send('Producto agregado al carrito');
});

export default router;





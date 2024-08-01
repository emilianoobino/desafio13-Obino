import UserModel from "../models/user.model.js";
import CartModel from "../models/cart.model.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
import UserDTO from "../dto/user.dto.js";
import { logger } from '../utils/logger.js';
import generarResetToken from "../utils/tokenreset.js";
import EmailManager from "../services/email.js";
import jwt from 'jsonwebtoken';

const emailManager = new EmailManager();

class UserController {
    async register(req, res) {
        const { first_name, last_name, email, password, age } = req.body;
        try {
            const existeUsuario = await UserModel.findOne({ email });
            if (existeUsuario) {
                logger.warn(`Intento de registro con email ya existente: ${email}`);
                return res.status(400).send("El usuario ya existe");
            }

            // Crear un nuevo carrito
            const newCart = new CartModel();
            await newCart.save();

            const newUser = await UserModel.create({
                first_name,
                last_name,
                email,
                cart: newCart._id,
                password: createHash(password),
                age
            });

            await newUser.save();

            // Generar token JWT
            const token = jwt.sign({ user: newUser }, "coderhouse", {
                expiresIn: "1h"
            });

            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            req.session.login = true;
            req.session.user = { ...newUser._doc };

            logger.info(`Nuevo usuario registrado: ${email}`);
            res.redirect("/api/users/profile");
        } catch (error) {
            logger.error('Error en registro de usuario:', error);
            res.status(500).send("Error interno del servidor");
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const usuarioEncontrado = await UserModel.findOne({ email });

            if (!usuarioEncontrado) {
                logger.warn(`Intento de login con email no registrado: ${email}`);
                return res.status(401).send("Usuario no válido");
            }

            const esValido = isValidPassword(password, usuarioEncontrado);
            if (!esValido) {
                logger.warn(`Intento de login con contraseña incorrecta: ${email}`);
                return res.status(401).send("Contraseña incorrecta");
            }

            req.session.login = true;
            req.session.user = { ...usuarioEncontrado._doc };

            logger.info(`Usuario logueado: ${email}`);
            res.redirect("/api/users/profile");
        } catch (error) {
            logger.error('Error en login de usuario:', error);
            res.status(500).send("Error interno del servidor");
        }
    }

    async profile(req, res) {
        try {
            const isPremium = req.user.role === 'premium';
            const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);
            const isAdmin = req.user.role === 'admin';

            res.render("profile", { user: userDto, isPremium, isAdmin });
            logger.info(`Perfil del usuario renderizado: ${req.user.email}`);
        } catch (error) {
            logger.error('Error al renderizar el perfil del usuario:', error);
            res.status(500).send('Error interno del servidor');
        }
    }

    async logout(req, res) {
        req.session.destroy();
        res.clearCookie("coderCookieToken");
        res.redirect("/login");
        logger.info(`Usuario deslogueado: ${req.user.email}`);
    }

    async admin(req, res) {
        if (req.user.role !== "admin") {
            logger.warn(`Acceso denegado para usuario: ${req.user.email}`);
            return res.status(403).send("Acceso denegado");
        }
        res.render("admin");
        logger.info(`Acceso a página de admin por: ${req.user.email}`);
    }

    async requestPasswordReset(req, res) {
        const { email } = req.body;

        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                logger.warn(`Solicitud de restablecimiento de contraseña para usuario no encontrado: ${email}`);
                return res.status(404).send("Usuario no encontrado");
            }

            const token = generarResetToken();
            user.resetToken = {
                token: token,
                expiresAt: new Date(Date.now() + 3600000) // 1 hora de duración
            };
            await user.save();

            await emailManager.enviarCorreoRestablecimiento(email, user.first_name, token);

            logger.info(`Correo de restablecimiento de contraseña enviado a: ${email}`);
            res.redirect("/confirmacion-envio");
        } catch (error) {
            logger.error('Error en solicitud de restablecimiento de contraseña:', error);
            res.status(500).send("Error interno del servidor");
        }
    }

    async resetPassword(req, res) {
        const { email, password, token } = req.body;

        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                logger.warn(`Restablecimiento de contraseña para usuario no encontrado: ${email}`);
                return res.render("passwordcambio", { error: "Usuario no encontrado" });
            }

            const resetToken = user.resetToken;
            if (!resetToken || resetToken.token !== token) {
                logger.warn(`Token de restablecimiento de contraseña inválido para: ${email}`);
                return res.render("passwordreset", { error: "El token de restablecimiento de contraseña es inválido" });
            }

            const now = new Date();
            if (now > resetToken.expiresAt) {
                logger.warn(`Token de restablecimiento de contraseña expirado para: ${email}`);
                return res.redirect("/passwordcambio");
            }

            if (isValidPassword(password, user)) {
                logger.warn(`Intento de restablecimiento de contraseña con la misma contraseña anterior para: ${email}`);
                return res.render("passwordcambio", { error: "La nueva contraseña no puede ser igual a la anterior" });
            }

            user.password = createHash(password);
            user.resetToken = undefined; // Marcar el token como utilizado
            await user.save();

            logger.info(`Contraseña restablecida correctamente para: ${email}`);
            return res.redirect("/login");
        } catch (error) {
            logger.error('Error en restablecimiento de contraseña:', error);
            return res.status(500).render("passwordreset", { error: "Error interno del servidor" });
        }
    }

    async cambiarRolPremium(req, res) {
        try {
            const { uid } = req.params;

            const user = await UserModel.findById(uid);
            if (!user) {
                logger.warn(`Cambio de rol fallido: Usuario no encontrado con ID ${uid}`);
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const nuevoRol = user.role === 'usuario' ? 'premium' : 'usuario';

            const actualizado = await UserModel.findByIdAndUpdate(uid, { role: nuevoRol }, { new: true });
            logger.info(`Rol de usuario actualizado: ${user.email}, nuevo rol: ${nuevoRol}`);
            res.json(actualizado);
        } catch (error) {
            logger.error('Error al cambiar rol de usuario:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
}

export default UserController;



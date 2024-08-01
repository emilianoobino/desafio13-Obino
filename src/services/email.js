import nodemailer from 'nodemailer';

class EmailManager {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "chaval198678@gmail.com",
                pass: "emud itxo icac omvq"
            }
        });
    }

    async enviarCorreoCompra(email, first_name, ticket) {
        try {
            const mailOptions = {
                from: `"Tony's Funko" <chaval198678@gmail.com>`,
                to: email,
                subject: 'Confirmación de compra',
                html: `
                    <h1>Confirmación de compra</h1>
                    <p>Gracias por tu compra, ${first_name}!</p>
                    <p>El número de tu orden es: ${ticket}</p>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log('Correo de confirmación de compra enviado');
        } catch (error) {
            console.error('Error al enviar el correo de confirmación de compra:', error);
            throw new Error('Error al enviar el correo de confirmación de compra');
        }
    }

    async enviarCorreoRestablecimiento(email, first_name, token) {
        try {
            const mailOptions = {
                from: `"Tony's Funko" <chaval198678@gmail.com>`,
                to: email,
                subject: 'Restablecimiento de Contraseña',
                html: `
                    <h1>Restablecimiento de Contraseña</h1>
                    <p>Hola ${first_name},</p>
                    <p>Has solicitado restablecer tu contraseña. Utiliza el siguiente código para cambiar tu contraseña:</p>
                    <p><strong>${token}</strong></p>
                    <p>Este código expirará en 1 hora.</p>
                    <a href="http://localhost:8080/password">Restablecer Contraseña</a>
                    <p>Si no solicitaste este restablecimiento, ignora este correo.</p>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log('Correo de restablecimiento de contraseña enviado');
        } catch (error) {
            console.error("Error al enviar el correo de restablecimiento de contraseña:", error);
            throw new Error('Error al enviar el correo de restablecimiento de contraseña');
        }
    }
}

export default EmailManager;


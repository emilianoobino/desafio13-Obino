import CartModel from "../models/cart.model.js";

class CartRepository {
    async createCart(cartData) {
        try {
            const newCart = new CartModel(cartData);
            await newCart.save();
            return newCart;
        } catch (error) {
            throw new Error("Error al crear el carrito");
        }
    }

    async getCartById(cartId) {
        try {
            return await CartModel.findById(cartId).populate('products.product').lean();
        } catch (error) {
            throw new Error("Error al obtener el carrito");
        }
    }

    async updateCart(cartId, cartData) {
        try {
            return await CartModel.findByIdAndUpdate(cartId, cartData, { new: true });
        } catch (error) {
            throw new Error("Error al actualizar el carrito");
        }
    }

    async deleteCart(cartId) {
        try {
            return await CartModel.findByIdAndDelete(cartId);
        } catch (error) {
            throw new Error("Error al eliminar el carrito");
        }
    }

    async getCarts() {
        try {
            return await CartModel.find();
        } catch (error) {
            throw new Error("Error al obtener los carritos");
        }
    }

    async getProductsFromCart(cartId) {
        try {
            const cart = await CartModel.findById(cartId).populate('products.product');
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
            return cart;
        } catch (error) {
            throw new Error("Error al obtener los productos del carrito");
        }
    }

    async addProductToCart(cartId, product, quantity) {
        try {
            const cart = await this.getCartById(cartId);
            const productId = product._id;
            const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }
            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error("Error al agregar el producto al carrito");
        }
    }

    async deleteProductById(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
            const index = cart.products.findIndex(p => p.product.toString() === productId);
            if (index !== -1) {
                cart.products.splice(index, 1);
                await cart.save();
            }
            return cart;
        } catch (error) {
            throw new Error("Error al eliminar el producto del carrito");
        }
    }

    async clearCart(cartId) {
        try {
            const products = [];
            return await CartModel.findByIdAndUpdate(cartId, { products }, { new: true });
        } catch (error) {
            throw new Error("Error al vaciar el carrito");
        }
    }
}

export default CartRepository;


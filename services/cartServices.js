import CartModel from '../models/cartModel';

const cartServices = {
  getAllCart: async () => {
    try {
      const cart = await CartModel.findAll();
      return cart;
    } catch (error) {
      console.error('Lỗi khi lấy tất cả giỏ hàng:', error);
      throw error;
    }
  },
  createCart: async (cartData) => {
    try {
      const cart = await CartModel.create(cartData);
      return cart;
    } catch (error) {
      console.error('Lỗi khi tạo gio hang:', error);
      throw error;
    }
  },
  updateCart: async (id, cartData) => {
    try {
      const cart = await CartModel.findByPk(id);
      if (!cart) {
        return null;
      }
      await cart.update(cartData);
      return cart;
    } catch (error) {
      console.error('Lỗi khi cập nhật giỏ hàng:', error);
      throw error;
    }
  },
  deleteCart: async (id) => {
    try {
      const cart = await CartModel.findByPk(id);
      if (!cart) {
        return null;
      }
      await cart.destroy();
      return cart;
    } catch (error) {
      console.error('Lỗi khi xóa giỏ hàng:', error);
      throw error;
    }
  },
};

export default cartServices;

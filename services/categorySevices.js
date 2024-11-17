import CategoryModel from '../models/categoryModel';

const categoryServices = {
  getAllCategories: async () => {
    try {
      const categories = await CategoryModel.findAll();
      return categories;
    } catch (error) {
      console.error('Lỗi khi lấy tất cả danh mục:', error);
      throw error;
    }
  },

  createCategory: async (categoryData) => {
    try {
      const category = await CategoryModel.create(categoryData);
      return category;
    } catch (error) {
      console.error('Lỗi khi tạo danh mục mới:', error);
      throw error;
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const category = await CategoryModel.findByPk(id);
      if (!category) {
        throw new Error('Danh mục không tồn tại');
      }

      await category.update(categoryData);
      return category;
    } catch (error) {
      console.error('Lỗi khi cập nhật danh mục:', error);
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      const category = await CategoryModel.findByPk(id);
      if (!category) {
        throw new Error('Danh mục không tồn tại');
      }
      await category.destroy();
      return { message: 'Danh mục đã được xóa' };
    } catch (error) {
      console.error('Lỗi khi xóa danh mục:', error);
      throw error;
    }
  },
};

module.exports = categoryServices;

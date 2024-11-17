import BrandModel from '../models/brandModel';

const brandServices = {
  getAllBrands: async () => {
    try {
      const brands = await BrandModel.findAll();
      return brands;
    } catch (error) {
      console.error('Lỗi khi lấy tất cả thương hiệu:', error);
      throw error;
    }
  },
  createBrand: async (brandData) => {
    try {
      const newBrand = await BrandModel.create(brandData);
      return newBrand;
    } catch (error) {
      console.error('Lỗi khi tạo thương hiệu:', error);
      throw error;
    }
  },
  updateBrand: async (id, brandData) => {
    try {
      const brand = await BrandModel.findByPk(id);
      if (!brand) {
        throw new Error('Thương hiệu không tồn tại');
      }
      await brand.update(brandData);
      return brand;
    } catch (error) {
      console.error('Lỗi khi cập nhật thương hiệu:', error);
      throw error;
    }
  },
  deleteBrand: async (id) => {
    try {
      const brand = await BrandModel.findByPk(id);
      if (!brand) {
        throw new Error('Thương hiệu không tồn tại');
      }
      await brand.destroy();
    } catch (error) {
      console.error('Lỗi khi xoá thương hiệu:', error);
      throw error;
    }
  },
};
export default brandServices;

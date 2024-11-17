import brandServices from '../services/brandServices';
const uploadFile = require('../middleware/uploadMiddleware');
const upload = uploadFile('brands');

const getAllBrands = async (req, res) => {
  try {
    const brands = await brandServices.getAllBrands();
    res.json({brands: brands});
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy tất cả thương hiệu' });
  }
};

const addNewBrand = (req, res) => {
  const { name } = req.body;
  const brand = { name };
  if (req.file) {
    const imageUrl = req.file.path;
    brand.logo = imageUrl; 
  }
  try {
    brandServices.createBrand(brand);
    res.json({ message: 'Thêm thương hiệu thành công', brand });
  } catch (error) {
    res.status(500).json({ error: 'Thêm thương hiệu thất bại' });
  }
};

const updateBrand = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const brand = { name };

  if (req.file) {
    const imageUrl = req.file.path;
    brand.logo = imageUrl;
  }

  try {
    brandServices.updateBrand(id, brand);
    res.json({ message: 'Cập nhật thuong hiệu thành công', data: { id, ...brand } });
  } catch (error) {
    res.status(500).json({ error: 'Cập nhật thuong hiệu thất bại' });
  }
};

const deleteBrand = (req, res) => {
  const { id } = req.params;
  try {
    brandServices.deleteBrand(id);
    res.json({ message: 'Xóa thuong hiệu thành công' });
  } catch (error) {
    res.status(500).json({ error: 'Xóa thuong hiệu thất bại' });
  }
};

module.exports = {
  getAllBrands,
  addNewBrand,
  updateBrand,
  deleteBrand,
  upload,
};

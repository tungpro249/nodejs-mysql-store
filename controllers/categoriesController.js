const uploadFile = require('../middleware/uploadMiddleware');
import categoryServices from '../services/categorySevices';
const upload = uploadFile('categories');

const getAllCategories = async (req, res) => {
  try {
    const category = await categoryServices.getAllCategories();
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy tất cả danh mục' });
  }
};

const addNewCategory = (req, res) => {
  const { name } = req.body;
  const category = { name };
  if (req.file) {
    const imageUrl = req.file.path;
    category.image = `${imageUrl}`;
  }
  try {
    categoryServices.createCategory(category);
    res.json({ message: 'Thêm danh mục thành công', category });
  } catch (error) {
    res.status(500).json({ error: 'Thêm danh mục thất bại' });
  }
};

const updateCategory = (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  const category = { name };
  if (req.file) {
    const imageUrl = req.file.path;
    category.image = `${imageUrl}`;
  }
  try {
    categoryServices.updateCategory(id, category);
    res.json({
      message: 'Cập nhật danh mục thành công',
      data: { id, ...category },
    });
  } catch (error) {
    res.status(500).json({ error: 'Cập nhật danh mục thất bại' });
  }
};

const deleteCategory = (req, res) => {
  const id = req.params.id;
  try {
    categoryServices.deleteCategory(id);
    res.json({ message: 'Xóa danh mục thành công' });
  } catch (error) {
    res.status(500).json({ error: 'Xóa danh mục thất bại' });
  }
};
module.exports = {
  getAllCategories,
  addNewCategory,
  updateCategory,
  deleteCategory,
  upload,
};

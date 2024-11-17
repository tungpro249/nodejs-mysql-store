// models/comment.js
import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/configDatabaseSequilize';
import User from './user'; // Import model User
import Product from './product'; // Import model Product

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date_created: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Quan hệ với User và Product (One-to-Many)
Comment.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(Comment, { foreignKey: 'product_id' });

export default Comment;

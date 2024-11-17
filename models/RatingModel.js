// models/rating.js
import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/configDatabaseSequilize';
import User from './user';
import Product from './product'; 

const Rating = sequelize.define('Rating', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  review: {
    type: DataTypes.TEXT,
    allowNull: true,
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
Rating.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Rating, { foreignKey: 'user_id' });
Rating.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(Rating, { foreignKey: 'product_id' });

export default Rating;

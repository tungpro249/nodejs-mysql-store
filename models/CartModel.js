// models/cart.js
import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/configDatabaseSequilize';
import User from './user'; // Import model User

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Quan hệ với User (One-to-Many)
Cart.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Cart, { foreignKey: 'user_id' });

export default Cart;

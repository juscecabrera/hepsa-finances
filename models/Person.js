import { DataTypes } from 'sequelize';
import sequelize from '../lib/sequelize.js';

const Person = sequelize.define('Person', {
  // El id se genera automáticamente
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  timestamps: true,
});

export default Person;

import { DataTypes } from 'sequelize';
import sequelize from '../lib/sequelize.js';
import Person from './Person.js';

const Payment = sequelize.define('Payment', {
  // Usamos 'id' de tipo string (como en la data original) y lo definimos como primary key
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  timestamps: true,
});

// Relación: Un Person tiene muchos Payment
Person.hasMany(Payment, { foreignKey: 'personId', as: 'payments' });
Payment.belongsTo(Person, { foreignKey: 'personId', as: 'person' });

export default Payment;

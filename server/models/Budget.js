const mongoose = require('mongoose');
const moment = require('moment');

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  month: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return moment(v, 'MMMM YYYY', true).isValid();
      },
      message: 'Month must be in format "MMMM YYYY" (e.g., January 2025)'
    }
  }
});

module.exports = mongoose.model('Budget', budgetSchema);
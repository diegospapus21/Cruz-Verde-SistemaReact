const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  checkIn: {
    type: Date,
    required: true,
    default: Date.now
  },
  checkOut: {
    type: Date,
    default: null
  },
  locationIn: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true }
  },
  locationOut: {
    lat: Number,
    lng: Number,
    address: String
  },
  duration: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
});

// Calcular duración al hacer checkout (sin usar next)
attendanceSchema.pre('save', function() {
  if (this.checkOut && this.checkIn) {
    this.duration = Math.round((this.checkOut - this.checkIn) / (1000 * 60));
  }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
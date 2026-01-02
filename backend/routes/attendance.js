const express = require('express');
const Attendance = require('../models/Attendance');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/attendance/checkin
// @desc    Registrar entrada
// @access  Private
router.post('/checkin', protect, async (req, res) => {
  try {
    const { lat, lng, address } = req.body;

    // Verificar si hay una sesión activa
    const activeSession = await Attendance.findOne({
      userId: req.user._id,
      checkOut: null
    });

    if (activeSession) {
      return res.status(400).json({
        success: false,
        message: 'Ya tienes una sesión activa'
      });
    }

    const attendance = await Attendance.create({
      userId: req.user._id,
      locationIn: { lat, lng, address }
    });

    res.status(201).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/attendance/checkout/:id
// @desc    Registrar salida
// @access  Private
router.put('/checkout/:id', protect, async (req, res) => {
  try {
    const { lat, lng, address } = req.body;

    const attendance = await Attendance.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Asistencia no encontrada'
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Esta sesión ya está cerrada'
      });
    }

    attendance.checkOut = new Date();
    attendance.locationOut = { lat, lng, address };
    await attendance.save();

    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/attendance/my
// @desc    Obtener mis asistencias
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const attendances = await Attendance.find({ userId: req.user._id })
      .sort({ checkIn: -1 });

    res.json({
      success: true,
      count: attendances.length,
      data: attendances
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/attendance/active
// @desc    Obtener sesión activa
// @access  Private
router.get('/active', protect, async (req, res) => {
  try {
    const attendance = await Attendance.findOne({
      userId: req.user._id,
      checkOut: null
    });

    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
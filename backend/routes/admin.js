const express = require('express');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/volunteers
// @desc    Obtener todos los voluntarios
// @access  Private/Admin
router.get('/volunteers', protect, admin, async (req, res) => {
  try {
    const volunteers = await User.find({ role: 'volunteer' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: volunteers.length,
      data: volunteers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/admin/volunteers/:id/toggle
// @desc    Habilitar/deshabilitar voluntario
// @access  Private/Admin
router.put('/volunteers/:id/toggle', protect, admin, async (req, res) => {
  try {
    const volunteer = await User.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Voluntario no encontrado'
      });
    }

    if (volunteer.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'No puedes deshabilitar un administrador'
      });
    }

    volunteer.active = !volunteer.active;
    await volunteer.save();

    res.json({
      success: true,
      data: volunteer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/admin/attendances
// @desc    Obtener todas las asistencias
// @access  Private/Admin
router.get('/attendances', protect, admin, async (req, res) => {
  try {
    const attendances = await Attendance.find()
      .populate('userId', 'name email')
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

// @route   GET /api/admin/reports
// @desc    Obtener reportes
// @access  Private/Admin
router.get('/reports', protect, admin, async (req, res) => {
  try {
    const { month, year } = req.query;
    
    let query = {};
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      query.checkIn = { $gte: startDate, $lte: endDate };
    }

    const attendances = await Attendance.find(query)
      .populate('userId', 'name email active');

    // Agrupar por usuario
    const reports = {};
    attendances.forEach(att => {
      const userId = att.userId._id.toString();
      if (!reports[userId]) {
        reports[userId] = {
          user: att.userId,
          attendances: 0,
          totalMinutes: 0
        };
      }
      reports[userId].attendances++;
      if (att.duration) {
        reports[userId].totalMinutes += att.duration;
      }
    });

    const reportsArray = Object.values(reports).map(r => ({
      ...r,
      totalHours: (r.totalMinutes / 60).toFixed(2)
    }));

    res.json({
      success: true,
      data: reportsArray
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/admin/stats
// @desc    Obtener estadísticas generales
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
    const activeVolunteers = await User.countDocuments({ role: 'volunteer', active: true });
    const totalAttendances = await Attendance.countDocuments();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAttendances = await Attendance.countDocuments({
      checkIn: { $gte: today }
    });

    res.json({
      success: true,
      data: {
        totalVolunteers,
        activeVolunteers,
        totalAttendances,
        todayAttendances
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { User, Calendar, Clock, TrendingUp } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { getMyAttendances } from '../../Services/api';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    totalHours: 0,
    avgHours: 0
  });

  const loadAttendances = useCallback(async () => {
    try {
      const response = await getMyAttendances();
      const data = response.data.data;
      calculateStats(data);
    } catch (error) {
      console.error('Error cargando asistencias:', error);
    }
  }, []);

  useEffect(() => {
    loadAttendances();
  }, [loadAttendances]);

  const calculateStats = (data) => {
    const now = new Date();
    const thisMonth = data.filter(a => {
      const date = new Date(a.checkIn);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });

    const totalMinutes = data.reduce((sum, att) => sum + (att.duration || 0), 0);
    const totalHours = totalMinutes / 60;
    const avgHours = data.length > 0 ? totalHours / data.length : 0;

    setStats({
      total: data.length,
      thisMonth: thisMonth.length,
      totalHours: totalHours.toFixed(1),
      avgHours: avgHours.toFixed(1)
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Mi Perfil</h2>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={48} className="text-green-600" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-800">{user?.name}</h3>
            <p className="text-gray-600 mt-1">{user?.email}</p>
            <span className="inline-block mt-3 px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Voluntario Activo
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="text-blue-600" size={32} />
            </div>
            <p className="text-blue-600 text-sm font-medium">Total Asistencias</p>
            <p className="text-3xl font-bold text-blue-700 mt-2">{stats.total}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="text-purple-600" size={32} />
            </div>
            <p className="text-purple-600 text-sm font-medium">Horas Totales</p>
            <p className="text-3xl font-bold text-purple-700 mt-2">{stats.totalHours}h</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="text-green-600" size={32} />
            </div>
            <p className="text-green-600 text-sm font-medium">Este Mes</p>
            <p className="text-3xl font-bold text-green-700 mt-2">{stats.thisMonth}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="text-orange-600" size={32} />
            </div>
            <p className="text-orange-600 text-sm font-medium">Promedio/Día</p>
            <p className="text-3xl font-bold text-orange-700 mt-2">{stats.avgHours}h</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Información de la Cuenta</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-gray-600">Nombre</span>
            <span className="font-medium text-gray-800">{user?.name}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-gray-600">Correo</span>
            <span className="font-medium text-gray-800">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-gray-600">Rol</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Voluntario
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Estado</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              Activo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, Calendar, TrendingUp } from 'lucide-react';
import { getStats, getAllAttendances, getVolunteers } from '../../Services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVolunteers: 0,
    activeVolunteers: 0,
    totalAttendances: 0,
    todayAttendances: 0
  });
  const [recentAttendances, setRecentAttendances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, attendancesRes] = await Promise.all([
        getStats(),
        getAllAttendances()
      ]);
      
      setStats(statsRes.data.data);
      setRecentAttendances(attendancesRes.data.data.slice(0, 10));
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Panel de Administración</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Voluntarios Activos</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{stats.activeVolunteers}</p>
              <p className="text-xs text-gray-400 mt-1">de {stats.totalVolunteers} totales</p>
            </div>
            <Users className="text-green-600" size={48} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Asistencias Hoy</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{stats.todayAttendances}</p>
              <p className="text-xs text-gray-400 mt-1">registradas</p>
            </div>
            <CheckCircle className="text-blue-600" size={48} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Registros</p>
              <p className="text-4xl font-bold text-purple-600 mt-2">{stats.totalAttendances}</p>
              <p className="text-xs text-gray-400 mt-1">históricos</p>
            </div>
            <Calendar className="text-purple-600" size={48} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Promedio Diario</p>
              <p className="text-4xl font-bold text-orange-600 mt-2">
                {stats.totalAttendances > 0 ? Math.round(stats.totalAttendances / 30) : 0}
              </p>
              <p className="text-xs text-gray-400 mt-1">últimos 30 días</p>
            </div>
            <TrendingUp className="text-orange-600" size={48} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Actividad Reciente</h3>
        <div className="space-y-3">
          {recentAttendances.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay registros aún</p>
          ) : (
            recentAttendances.map(att => (
              <div key={att._id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-800">{att.userId?.name || 'Usuario'}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(att.checkIn).toLocaleString('es-ES')}
                  </p>
                </div>
                <div className="text-right">
                  {att.checkOut ? (
                    <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle size={16} />
                      Completado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-blue-600 text-sm">
                      <Calendar size={16} />
                      En curso
                    </span>
                  )}
                  {att.duration && (
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.floor(att.duration / 60)}h {att.duration % 60}m
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
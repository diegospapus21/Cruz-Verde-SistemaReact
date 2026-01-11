import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Download, Calendar } from 'lucide-react';
import { getReports } from '../../Services/api';

const Reports = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getReports({ month: selectedMonth, year: selectedYear });
      setReports(response.data.data);
    } catch (error) {
      console.error('Error cargando reportes:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const exportToCSV = () => {
    const headers = ['Nombre', 'Email', 'Asistencias', 'Horas Totales', 'Estado'];
    const rows = reports.map(r => [
      r.user.name,
      r.user.email,
      r.attendances,
      r.totalHours,
      r.user.active ? 'Activo' : 'Inactivo'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_${selectedYear}_${selectedMonth}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const years = [2024, 2025, 2026];

  const totalAttendances = reports.reduce((sum, r) => sum + r.attendances, 0);
  const totalHours = reports.reduce((sum, r) => sum + parseFloat(r.totalHours), 0);

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Reportes</h2>
        
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          >
            {months.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <button
            onClick={exportToCSV}
            disabled={reports.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Voluntarios</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{reports.length}</p>
            </div>
            <Calendar className="text-green-600" size={48} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Asistencias</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{totalAttendances}</p>
            </div>
            <CheckCircle className="text-blue-600" size={48} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Horas Totales</p>
              <p className="text-4xl font-bold text-purple-600 mt-2">{totalHours.toFixed(1)}h</p>
            </div>
            <Calendar className="text-purple-600" size={48} />
          </div>
        </div>
      </div>

      {/* Tabla de Reportes */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando reportes...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">No hay datos para el período seleccionado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Voluntario</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-700">Asistencias</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-700">Horas Totales</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-700">Estado</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.user._id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-800">{report.user.name}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-600">{report.user.email}</p>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="font-medium text-gray-800">{report.attendances}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="font-medium text-green-600">{report.totalHours}h</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {report.user.active ? (
                        <span className="inline-flex items-center gap-1 text-green-600 text-sm px-3 py-1 bg-green-50 rounded-full">
                          <CheckCircle size={14} />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600 text-sm px-3 py-1 bg-red-50 rounded-full">
                          <XCircle size={14} />
                          Inactivo
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
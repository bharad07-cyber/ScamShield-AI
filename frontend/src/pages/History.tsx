import React, { useState } from 'react';
import { useScan } from '../context/ScanContext';
import { exportScanToPdf } from '../services/pdfExporter';
import type { ScanItem } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { RiskScoreBadge } from '../components/ui/RiskScoreBadge';
import {
  History as HistoryIcon,
  Search,
  Star,
  Trash2,
  RotateCcw,
  Download,
  Eye,
  X
} from 'lucide-react';

export const History: React.FC = () => {
  const { scans, toggleFavorite, deleteScan, restoreScan } = useScan();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [showTrash, setShowTrash] = useState(false);
  const [selectedScan, setSelectedScan] = useState<ScanItem | null>(null);

  const filteredScans = scans.filter(item => {
    const isDeletedMatch = showTrash ? item.isDeleted : !item.isDeleted;
    if (!isDeletedMatch) return false;

    const matchesSearch = item.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || item.type === typeFilter;
    const matchesRisk = riskFilter === 'All' || item.riskLevel === riskFilter;

    return matchesSearch && matchesType && matchesRisk;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <HistoryIcon className="w-7 h-7 text-blue-500" />
            <span>Scan History & Security Audits</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Search, filter, favorite, and export PDF reports for past threat vector scans.
          </p>
        </div>

        <button
          onClick={() => setShowTrash(!showTrash)}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
            showTrash ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
          }`}
        >
          <Trash2 className="w-4 h-4" />
          <span>{showTrash ? 'Viewing Trash Bin' : 'Trash Bin'}</span>
        </button>
      </div>

      {/* Controls Bar */}
      <GlassCard hoverEffect={false} className="p-4 space-y-3 border-blue-500/20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by target or keyword..."
              className="glass-input w-full pl-9 pr-3 py-2 rounded-xl text-xs"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="glass-input w-full px-3 py-2 rounded-xl text-xs bg-[#0A0A0F]"
            >
              <option value="All">All Scan Vectors</option>
              <option value="Message">Message</option>
              <option value="Website">Website</option>
              <option value="Email">Email</option>
              <option value="QR Code">QR Code</option>
              <option value="Image">Image OCR</option>
              <option value="Phone">Phone</option>
            </select>
          </div>

          <div>
            <select
              value={riskFilter}
              onChange={e => setRiskFilter(e.target.value)}
              className="glass-input w-full px-3 py-2 rounded-xl text-xs bg-[#0A0A0F]"
            >
              <option value="All">All Risk Levels</option>
              <option value="Critical">Critical Risk</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Scans Data Grid */}
      <GlassCard hoverEffect={false} className="p-0 overflow-hidden border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                <th className="py-3.5 px-4">Vector</th>
                <th className="py-3.5 px-4">Target / Content</th>
                <th className="py-3.5 px-4">Risk Rating</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredScans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    No scan records match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-white/5 transition-all">
                    <td className="py-3 px-4 font-mono font-bold text-blue-400">{scan.type}</td>
                    <td className="py-3 px-4 font-medium text-white truncate max-w-xs">{scan.target}</td>
                    <td className="py-3 px-4">
                      <RiskScoreBadge level={scan.riskLevel} score={scan.scamProbability} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">
                      {new Date(scan.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => toggleFavorite(scan.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          scan.isFavorite ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'text-gray-400 border-transparent hover:bg-white/10'
                        }`}
                        title="Favorite"
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>

                      <button
                        onClick={() => setSelectedScan(scan)}
                        className="p-1.5 text-gray-300 hover:text-white rounded-lg hover:bg-white/10"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => exportScanToPdf(scan)}
                        className="p-1.5 text-blue-400 hover:text-blue-300 rounded-lg hover:bg-blue-600/10"
                        title="Download PDF Audit"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      {showTrash ? (
                        <button
                          onClick={() => restoreScan(scan.id)}
                          className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg"
                          title="Restore"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => deleteScan(scan.id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Details View Modal */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedScan(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <RiskScoreBadge level={selectedScan.riskLevel} score={selectedScan.scamProbability} size="lg" />
              <span className="text-xs text-gray-400 font-mono">Scan Vector: {selectedScan.type}</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Target Content</h3>
              <p className="text-xs font-mono bg-black/50 p-3 rounded-xl border border-white/10 text-gray-200">
                {selectedScan.target}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">AI Breakdown Explanation</h3>
              <p className="text-xs text-gray-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
                {selectedScan.result.explanation}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => exportScanToPdf(selectedScan)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF Report</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

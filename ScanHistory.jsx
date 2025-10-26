// frontend/src/pages/ScanHistory.jsx
import { useState, useEffect } from 'react';

export default function ScanHistory() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/history');
        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }
        const data = await response.json();
        setScans(data);
      } catch (err) {
        console.error('Failed to load history:', err);
        // Optionally show error UI
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Helper: Map confidence to status label
  const getStatusLabel = (confidence) => {
    if (confidence >= 90) return 'treated';
    if (confidence >= 80) return 'monitoring';
    return 'resolved';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'treated':
        return 'bg-[#091B07]/20 text-[#091B07] border border-[#091B07]/30';
      case 'monitoring':
        return 'bg-[#091B07]/10 text-[#091B07] border border-[#091B07]/20';
      case 'resolved':
        return 'bg-[#091B07]/30 text-[#091B07] border border-[#091B07]/40';
      default:
        return 'bg-[#091B07]/20 text-[#091B07] border border-[#091B07]/30';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'treated':
        return 'Treatment Applied';
      case 'monitoring':
        return 'Monitoring Progress';
      case 'resolved':
        return 'Issue Resolved';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#C0CFC5] pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-[#091B07] mb-2">Scan History</h1>
          <p className="text-[#091B07] mb-8">Review your pest identification history and treatment records</p>
          <div className="text-center py-16 glass-card rounded-2xl">
            <div className="text-6xl mb-4">⏳</div>
            <h3 className="text-2xl font-semibold text-[#091B07] mb-3">Loading Scan History...</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#C0CFC5] pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#091B07] mb-2">Scan History</h1>
          <p className="text-[#091B07]">
            Review your pest identification history and treatment records
          </p>
        </div>

        {/* Scan History Grid */}
        <div className="grid gap-6">
          {scans.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-2xl">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">📸</div>
                <h3 className="text-2xl font-semibold text-[#091B07] mb-3">No Scan History Yet</h3>
                <p className="text-[#091B07] mb-6">
                  Start protecting your crops by uploading your first pest image for analysis.
                </p>
                <button className="bg-[#091B07] text-[#C0CFC5] px-8 py-3 rounded-xl font-semibold hover:bg-[#091B07]/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Scan Your First Pest
                </button>
              </div>
            </div>
          ) : (
            scans.map((scan) => (
              <div key={scan.id} className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Pest Image */}
                  <div className="lg:w-64 lg:h-48 w-full h-56 flex-shrink-0">
                    <img 
  src={`http://localhost:5000${scan.image_url}`} 
  alt={`Pest: ${scan.pest_name}`}
  className="w-full h-full object-cover rounded-xl border-2 border-[#C0CFC5] shadow-lg"
/>
                  </div>
                  
                  {/* Scan Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-[#091B07] mb-1">{scan.pest_name}</h3>
                        <p className="text-[#091B07] text-sm">
                          Scanned on {formatDate(scan.scanned_at)}
                        </p>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2">
                        <span className="bg-[#091B07] text-[#C0CFC5] px-3 py-1 rounded-full text-sm font-semibold w-fit">
                          {scan.confidence_percent}% Confidence
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold w-fit ${getStatusColor(getStatusLabel(scan.confidence_percent))}`}>
                          {getStatusText(getStatusLabel(scan.confidence_percent))}
                        </span>
                      </div>
                    </div>
                    
                    {/* Treatment Information */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-[#091B07] mb-2 text-lg">Treatment Plan</h4>
                      <div className="bg-[#C0CFC5] rounded-lg p-4 border border-[#091B07]/20">
                        <p className="text-[#091B07] leading-relaxed">
                          {scan.treatment_guidance}
                        </p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button className="text-[#091B07] hover:text-[#091B07]/80 font-medium text-sm border border-[#091B07] px-4 py-2 rounded-lg hover:bg-[#091B07]/10 transition-all flex items-center gap-2">
                        <span>View Details</span>
                      </button>
                      <button className="text-[#091B07] hover:text-[#091B07]/80 font-medium text-sm border border-[#091B07] px-4 py-2 rounded-lg hover:bg-[#091B07]/10 transition-all flex items-center gap-2">
                        <span>Rescan</span>
                      </button>
                      <button className="text-[#091B07] hover:text-[#091B07]/80 font-medium text-sm border border-[#091B07] px-4 py-2 rounded-lg hover:bg-[#091B07]/10 transition-all flex items-center gap-2">
                        <span>Delete Record</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats Summary */}
        {scans.length > 0 && (
          <div className="mt-8 glass-card rounded-2xl p-6">
            <h3 className="text-xl font-bold text-[#091B07] mb-4">Scan Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#091B07]">{scans.length}</div>
                <div className="text-[#091B07] text-sm">Total Scans</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#091B07]">
                  {Math.round(scans.reduce((acc, scan) => acc + scan.confidence_percent, 0) / scans.length)}%
                </div>
                <div className="text-[#091B07] text-sm">Avg. Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#091B07]">
                  {scans.filter(scan => getStatusLabel(scan.confidence_percent) === 'resolved').length}
                </div>
                <div className="text-[#091B07] text-sm">Resolved Issues</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#091B07]">
                  {new Set(scans.map(scan => scan.pest_name)).size}
                </div>
                <div className="text-[#091B07] text-sm">Unique Pests</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
import { supabase } from '../config/supabase';

export class StrategicService {
  static async getStrategicKpis() {
    // 1. Fetch Projects with Responsables for Revenue by Manager
    const { data: projects, error: projError } = await supabase
      .from('projets')
      .select('ca_total, responsables(nom)');

    if (projError) throw projError;

    // 2. Fetch Leads (Demandes) for Channel Dependency
    const { data: demandes, error: demError } = await supabase
      .from('demandes')
      .select('source');

    if (demError) throw demError;

    // --- CALCULATIONS ---

    // A. Revenue by Manager
    const managerRevenue: Record<string, number> = {};
    projects?.forEach(p => {
      const name = p.responsables?.nom || 'Non assigné';
      managerRevenue[name] = (managerRevenue[name] || 0) + (p.ca_total || 0);
    });

    const revenueByManager = Object.entries(managerRevenue)
      .map(([name, value]) => ({
        name,
        value,
        width: "0%", // Will calculate below
        color: name === 'Hiba' ? 'bg-primary' : (name === 'Soukaina' ? 'bg-primary-container' : 'bg-surface-dim')
      }))
      .sort((a, b) => b.value - a.value);

    const maxRevenue = Math.max(...revenueByManager.map(m => m.value), 1);
    revenueByManager.forEach(m => {
      m.width = `${Math.round((m.value / maxRevenue) * 100)}%`;
    });

    // B. Channel Dependency
    const sourceCounts: Record<string, number> = {};
    demandes?.forEach(d => {
      const source = d.source || 'Autre';
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });

    const totalLeads = demandes?.length || 0;
    const channelDependency = Object.entries(sourceCounts)
      .map(([name, count]) => ({
        name,
        percentage: totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0
      }))
      .sort((a, b) => b.percentage - a.percentage);

    // C. Leader Stats (Top 3)
    const leaderStats = revenueByManager.slice(0, 3).map(m => ({
      name: m.name,
      value: formatCurrency(m.value),
      unit: "MAD",
      trend: "+5%", // Static for now as we don't have historical data easily accessible
      initials: m.name.split(' ').map(n => n[0]).join('')
    }));

    // D. Satisfaction (Mock for now but structured)
    const globalSatisfaction = 94.8;
    const satisfactionEvolution = [80, 90, 95, 85, 92, 98]; // Semi-mocked bar chart data

    return {
      channelDependency,
      revenueByManager,
      leaderStats,
      globalSatisfaction,
      satisfactionEvolution,
      totalProjects: projects?.length || 0
    };
  }
}

function formatCurrency(val: number) {
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return (val / 1000).toFixed(1) + 'k';
  return Math.round(val).toString();
}

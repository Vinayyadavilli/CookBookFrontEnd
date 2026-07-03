import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Users, UtensilsCrossed, CreditCard, Activity } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
  <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
    <div style={{ padding: '1rem', borderRadius: '0.75rem', backgroundColor: `rgba(${color}, 0.1)`, color: `rgb(${color})` }}>
      {icon}
    </div>
    <div>
      <p className="form-label" style={{ marginBottom: '0.25rem' }}>{title}</p>
      <h3 className="page-title">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/admin/analytics').then(res => setData(res.data.data)).catch(console.error);
  }, []);

  if (!data) return <div style={{ color: 'var(--text-secondary)' }}>Loading analytics...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <StatCard title="Total Users" value={data.total_users} icon={<Users size={24} />} color="59, 130, 246" />
        <StatCard title="Total Recipes" value={data.total_recipes} icon={<UtensilsCrossed size={24} />} color="16, 185, 129" />
        <StatCard title="Active Subscriptions" value={data.active_subscriptions} icon={<Activity size={24} />} color="245, 158, 11" />
        <StatCard title="Total Revenue" value={`$${data.total_revenue_inr}`} icon={<CreditCard size={24} />} color="139, 92, 246" />
      </div>
    </div>
  );
};

export default Dashboard;

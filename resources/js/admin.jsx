import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminDashboard from './components/AdminDashboard';

const container = document.getElementById('admin-dashboard-root');
if (container) {
    // Helper function to safely parse json data from attributes
    const parseAttribute = (attrName, defaultValue = {}) => {
        try {
            const val = container.getAttribute(attrName);
            return val ? JSON.parse(val) : defaultValue;
        } catch (e) {
            console.error(`Error parsing attribute ${attrName}:`, e);
            return defaultValue;
        }
    };

    const stats = parseAttribute('data-stats');
    const recentResults = parseAttribute('data-recent-results', []);
    const recentChats = parseAttribute('data-recent-chats', []);
    const topUsers = parseAttribute('data-top-users', []);
    const chartData = parseAttribute('data-chart-data');
    const routes = parseAttribute('data-routes');

    const root = ReactDOM.createRoot(container);
    root.render(
        <React.StrictMode>
            <AdminDashboard 
                stats={stats} 
                recentResults={recentResults}
                recentChats={recentChats}
                topUsers={topUsers}
                chartData={chartData}
                routes={routes}
            />
        </React.StrictMode>
    );
}

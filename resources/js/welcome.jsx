import React from 'react';
import ReactDOM from 'react-dom/client';
import WelcomeApp from './components/WelcomeApp';

const container = document.getElementById('welcome-root');
if (container) {
    // Read configuration parameters passed from Laravel blade environment
    const loginRoute = container.getAttribute('data-login-route') || '/login';
    const adminRoute = container.getAttribute('data-admin-route') || '/admin';
    const isAuthenticated = container.getAttribute('data-authenticated') === 'true';
    const userName = container.getAttribute('data-user-name') || '';
    const statsPatients = container.getAttribute('data-stats-patients') || '50,000+';
    const statsDoctors = container.getAttribute('data-stats-doctors') || '120+';
    const apkRoute = container.getAttribute('data-apk-route') || '/downloads/mataceria-latest.apk';

    let doctors = [];
    try {
        doctors = JSON.parse(container.getAttribute('data-doctors') || '[]');
    } catch (e) {
        console.error('Failed to parse doctors attribute', e);
    }

    const root = ReactDOM.createRoot(container);
    root.render(
        <React.StrictMode>
            <WelcomeApp 
                loginRoute={loginRoute} 
                adminRoute={adminRoute} 
                isAuthenticated={isAuthenticated}
                userName={userName}
                statsPatients={statsPatients}
                statsDoctors={statsDoctors}
                doctors={doctors}
                apkRoute={apkRoute}
            />
        </React.StrictMode>
    );
}

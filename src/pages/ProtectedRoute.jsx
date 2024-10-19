import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const userRole = JSON.parse(localStorage.getItem('userRole'))?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
        return <Navigate to="/login" />;
    }

    return children;
};

// Usage
<ProtectedRoute allowedRoles={['admin']}>
    <AdminDashboard />
</ProtectedRoute>

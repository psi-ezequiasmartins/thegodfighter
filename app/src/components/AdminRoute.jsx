/**
 * src/components/AdminRoute.jsx
 */

import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('tgf_user') || '{}');
  if (user.role !== 'admin') {
    return <Navigate to="/events" replace />;
  }
  return children;
}

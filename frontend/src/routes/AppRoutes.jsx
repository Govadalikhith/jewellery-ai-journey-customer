import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppShell } from '../components/AppShell';

import { LoginPage } from '../pages/LoginPage';
import { OverviewPage } from '../pages/OverviewPage';
import { CustomersListPage } from '../pages/CustomersListPage';
import { CustomerDetailPage } from '../pages/CustomerDetailPage';
import { JourneyTimelinePage } from '../pages/JourneyTimelinePage';
import { ServiceTicketsPage } from '../pages/ServiceTicketsPage';
import { AIInsightsPage } from '../pages/AIInsightsPage';
import { SegmentsPage } from '../pages/SegmentsPage';
import { ConsentGovernancePage } from '../pages/ConsentGovernancePage';
import { ModelOutcomesPage } from '../pages/ModelOutcomesPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { UsersPage } from '../pages/UsersPage';
import { AuditLogsPage } from '../pages/AuditLogsPage';
import { SettingsPage } from '../pages/SettingsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Authenticated Application Shell */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<OverviewPage />} />
          <Route path="customers" element={<CustomersListPage />} />
          <Route path="customers/:id" element={<CustomerDetailPage />} />
          <Route path="journeys" element={<JourneyTimelinePage />} />
          <Route path="journeys/:id" element={<JourneyTimelinePage />} />
          <Route path="tickets" element={<ServiceTicketsPage />} />
          <Route path="tickets/:id" element={<ServiceTicketsPage />} />
          <Route path="ai-insights" element={<AIInsightsPage />} />
          <Route path="segments" element={<SegmentsPage />} />
          <Route path="consent-governance" element={<ConsentGovernancePage />} />
          <Route path="model-outcomes" element={<ModelOutcomesPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

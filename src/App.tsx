import { Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/AppShell'
import WelcomeScreen from './screens/WelcomeScreen'
import StationScreen from './screens/StationScreen'
import IdeaBriefScreen from './screens/IdeaBriefScreen'
import CouncilSetupScreen from './screens/CouncilSetupScreen'
import CouncilSessionScreen from './screens/CouncilSessionScreen'
import OptionCompareScreen from './screens/OptionCompareScreen'
import DecisionScreen from './screens/DecisionScreen'
import ApprovalInboxScreen from './screens/ApprovalInboxScreen'
import AgentsScreen from './screens/AgentsScreen'
import AgentEditScreen from './screens/AgentEditScreen'
import HistoryScreen from './screens/HistoryScreen'
import BudgetScreen from './screens/BudgetScreen'
import SettingsScreen from './screens/SettingsScreen'

export default function App() {
  return (
    <Routes>
      <Route path="/welcome" element={<WelcomeScreen />} />
      <Route element={<AppShell />}>
        <Route path="/station" element={<StationScreen />} />
        <Route path="/brief" element={<IdeaBriefScreen />} />
        <Route path="/council-setup" element={<CouncilSetupScreen />} />
        <Route path="/session" element={<CouncilSessionScreen />} />
        <Route path="/session/:sessionId" element={<CouncilSessionScreen />} />
        <Route path="/options" element={<OptionCompareScreen />} />
        <Route path="/decision" element={<DecisionScreen />} />
        <Route path="/approvals" element={<ApprovalInboxScreen />} />
        <Route path="/agents" element={<AgentsScreen />} />
        <Route path="/agents/new" element={<AgentEditScreen />} />
        <Route path="/agents/:agentId/edit" element={<AgentEditScreen />} />
        <Route path="/sessions" element={<HistoryScreen />} />
        <Route path="/budget" element={<BudgetScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
      </Route>
      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  )
}

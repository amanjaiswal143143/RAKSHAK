import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAISafety } from '../hooks/useAISafety.js';
import { useOfflineMode } from '../hooks/useOfflineMode.js';
import AnimatedHeartbeat from '../components/home/AnimatedHeartbeat';
import SOSButton from '../components/home/SOSButton';
import EmergencyActionPanel from '../components/home/EmergencyActionPanel';
import GuardianCard from '../components/home/GuardianCard';
import QuickActionCard from '../components/home/QuickActionCard';
import AIInsightPanel from '../components/home/AIInsightPanel';
import StatusIndicator from '../components/home/StatusIndicator';

const Home = () => {
  const navigate = useNavigate();
  const { riskScore, riskLevel, suggestions } = useAISafety();
  const { isOffline, networkType, getOfflineDuration, formatOfflineDuration } = useOfflineMode();
  const [showEmergencyPanel, setShowEmergencyPanel] = useState(false);

  const quickActions = useMemo(() => ([
    { title: 'Nearby Help', subtitle: 'Hospitals & police', icon: '📍', route: '/nearby-help' },
    { title: 'Start Safe Trip', subtitle: 'Share live route', icon: '🚗', route: '/guardian' },
    { title: 'Offline Rescue', subtitle: 'Path recovery mode', icon: '🗺️', route: '/path-recovery' },
    { title: 'AI Safety Insights', subtitle: 'Smart risk updates', icon: '🤖', route: '/', action: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) },
    { title: 'Emergency Contacts', subtitle: 'Open SOS workflow', icon: '📞', route: '/sos' },
  ]), []);

  const guardians = useMemo(() => ([
    { name: 'Aarav', relation: 'Primary Guardian', status: 'online', lastSeen: 'now' },
    { name: 'Mira', relation: 'Trusted Contact', status: 'online', lastSeen: '2m ago' },
  ]), []);

  const emergencyActions = useMemo(() => ([
    { id: 'sos', icon: '🆘', title: 'Send Emergency SOS', subtitle: 'Open immediate SOS confirmation', onClick: () => navigate('/sos') },
    { id: 'location', icon: '📡', title: 'Share Live Location', subtitle: 'Send trip tracking link', onClick: () => navigate('/guardian') },
    { id: 'hospitals', icon: '🏥', title: 'Nearby Hospitals', subtitle: 'View closest medical support', onClick: () => navigate('/nearby-help') },
    { id: 'police', icon: '👮', title: 'Nearby Police Stations', subtitle: 'Find nearest police assistance', onClick: () => navigate('/nearby-help') },
    { id: 'guardian', icon: '🛡️', title: 'Guardian Tracking', subtitle: 'Manage trusted contacts', onClick: () => navigate('/guardian') },
    { id: 'offline', icon: '🌐', title: 'Offline Rescue Mode', subtitle: 'Use cached path recovery tools', onClick: () => navigate('/path-recovery') },
    {
      id: 'sms',
      icon: '✉️',
      title: 'Emergency SMS Fallback',
      subtitle: 'Open SMS with emergency template',
      onClick: () => {
        window.location.href = 'sms:?body=EMERGENCY%20-%20Please%20help.%20My%20live%20location%20is%20available%20in%20Rakshak%20AI.';
      },
    },
    {
      id: 'ai',
      icon: '🧠',
      title: 'AI Safety Suggestions',
      subtitle: 'Review live insights and warnings',
      onClick: () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      },
    },
  ]), [navigate]);

  const connectivityText = isOffline
    ? `Offline ${formatOfflineDuration(getOfflineDuration())}`
    : `Online • ${networkType?.toUpperCase?.() || 'UNKNOWN'}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,51,51,0.18),_transparent_44%),linear-gradient(180deg,_#090909_0%,_#050505_100%)] pb-28 safe-area-top"
    >
      <div className="px-5 pt-6 max-w-2xl mx-auto">
        <header className="mb-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-white/50">Rakshak AI</p>
              <h1 className="text-3xl font-bold text-white mt-1">Emergency OS</h1>
              <p className="text-sm text-white/65 mt-1">Calm, intelligent and always ready.</p>
            </div>
            <div className="glass rounded-2xl px-3 py-2 border border-neonGreen/30">
              <p className="text-[10px] uppercase tracking-[0.12em] text-white/60">Protection</p>
              <p className="text-sm font-semibold text-neonGreen">Live</p>
            </div>
          </div>
          <AnimatedHeartbeat />
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
          <StatusIndicator
            label="AI Status"
            value={riskLevel === 'critical' ? 'High Alert' : 'Monitoring'}
            tone={riskLevel === 'critical' || riskLevel === 'high' ? 'danger' : 'success'}
            pulse
          />
          <StatusIndicator
            label="Safety Score"
            value={`${riskScore}/100`}
            tone={riskScore < 40 ? 'danger' : riskScore < 70 ? 'warning' : 'success'}
          />
          <StatusIndicator
            label="Connectivity"
            value={connectivityText}
            tone={isOffline ? 'warning' : 'info'}
            pulse={!isOffline}
          />
        </section>

        <section className="relative mb-7">
          <div className="glass rounded-3xl border border-white/10 p-6 shadow-[0_25px_48px_rgba(0,0,0,0.35)]">
            <p className="text-center text-xs uppercase tracking-[0.2em] text-white/50">Emergency access</p>
            <SOSButton onClick={() => setShowEmergencyPanel(true)} />
            <p className="text-center text-sm text-white/65">Tap to open emergency action panel</p>
          </div>
        </section>

        <section className="mb-7">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
            <span className="text-xs text-white/50">Thumb-ready</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <QuickActionCard
                key={action.title}
                icon={action.icon}
                title={action.title}
                subtitle={action.subtitle}
                onClick={action.action || (() => navigate(action.route))}
              />
            ))}
          </div>
        </section>

        <section className="mb-7">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Guardians</h2>
            <button
              type="button"
              onClick={() => navigate('/guardian')}
              className="text-xs text-neonBlue hover:text-white transition-colors"
            >
              Manage
            </button>
          </div>
          <div className="space-y-3">
            {guardians.map((guardian) => (
              <GuardianCard
                key={guardian.name}
                {...guardian}
                onShareTrip={() => navigate('/guardian')}
              />
            ))}
          </div>
        </section>

        <AIInsightPanel riskScore={riskScore} riskLevel={riskLevel} suggestions={suggestions} />
      </div>

      <EmergencyActionPanel
        open={showEmergencyPanel}
        onClose={() => setShowEmergencyPanel(false)}
        actions={emergencyActions}
      />
    </motion.div>
  );
};

export default Home;

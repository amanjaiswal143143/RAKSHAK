import React, { memo } from 'react';

const levelStyles = {
  critical: 'text-neonRed border-neonRed/40 bg-neonRed/15',
  high: 'text-orange-300 border-orange-300/40 bg-orange-300/10',
  medium: 'text-yellow-300 border-yellow-300/40 bg-yellow-300/10',
  low: 'text-neonGreen border-neonGreen/40 bg-neonGreen/10',
};

const AIInsightPanel = ({ riskScore, riskLevel, suggestions = [] }) => (
  <section className="glass rounded-3xl border border-white/10 p-5">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-white/50">AI safety intelligence</p>
        <p className="text-2xl font-bold text-white mt-1">Safety Score {riskScore}/100</p>
      </div>
      <span className={`px-3 py-1 text-xs uppercase tracking-[0.12em] rounded-full border ${levelStyles[riskLevel] || levelStyles.low}`}>
        {riskLevel}
      </span>
    </div>
    <div className="mt-4 space-y-2.5">
      {(suggestions.length ? suggestions.slice(0, 3) : [{ icon: '🤖', message: 'AI monitoring is active. Keep location sharing enabled.' }]).map((suggestion, index) => (
        <div key={`${suggestion.message}-${index}`} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 flex items-start gap-2.5">
          <span className="text-base leading-5">{suggestion.icon || '✨'}</span>
          <p className="text-sm text-white/90 leading-5">{suggestion.message}</p>
        </div>
      ))}
    </div>
  </section>
);

export default memo(AIInsightPanel);

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SaaSProject } from '../types';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Percent, 
  DollarSign, 
  CheckCircle,
  BarChart4,
  Activity
} from 'lucide-react';

interface ValidationChartsProps {
  projects: SaaSProject[];
}

type MetricType = 'waitlist' | 'pageviews' | 'preSales' | 'conversion';

export default function ValidationCharts({ projects }: ValidationChartsProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('waitlist');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Active projects (exclude killed for core validation metrics)
  const activeAndInbox = projects.filter(p => p.status !== 'Killed');

  // Find max value to normalize coordinates
  const getMetricValue = (p: SaaSProject, type: MetricType): number => {
    switch(type) {
      case 'waitlist': return p.metrics.waitlistCount;
      case 'pageviews': return p.metrics.landingPageViews;
      case 'preSales': return p.metrics.preSalesCount;
      case 'conversion': return p.metrics.conversionRate;
    }
  };

  const getMetricLabel = (type: MetricType): string => {
    switch(type) {
      case 'waitlist': return 'Waitlist Signups';
      case 'pageviews': return 'Landing Page Views';
      case 'preSales': return 'Pre-Sales Secured';
      case 'conversion': return 'Conversion Rate';
    }
  };

  const getMetricUnit = (type: MetricType): string => {
    switch(type) {
      case 'waitlist': return 'leads';
      case 'pageviews': return 'views';
      case 'preSales': return 'sales';
      case 'conversion': return '%';
    }
  };

  const getMetricColorClass = (type: MetricType): string => {
    switch(type) {
      case 'waitlist': return 'text-amber-400';
      case 'pageviews': return 'text-blue-400';
      case 'preSales': return 'text-emerald-400';
      case 'conversion': return 'text-purple-400';
    }
  };

  const values = activeAndInbox.map(p => getMetricValue(p, selectedMetric));
  const maxValue = Math.max(...values, 10); // avoid div-by-zero

  // SVG parameters
  const height = 180;
  const width = 640;
  const paddingX = 40;
  const paddingY = 25;

  // Generate points
  const points = activeAndInbox.map((p, idx) => {
    if (activeAndInbox.length <= 1) return { x: width / 2, y: height / 2 };
    const step = (width - paddingX * 2) / (activeAndInbox.length - 1);
    const x = paddingX + idx * step;
    const value = getMetricValue(p, selectedMetric);
    // invert Y since 0 is top
    const y = height - paddingY - (value / maxValue) * (height - paddingY * 2);
    return { x, y };
  });

  // SVG Line path string
  const linePath = points.length > 1
    ? points.map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ')
    : '';

  // SVG Area path string
  const areaPath = points.length > 1
    ? `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  return (
    <div id="validation-panel-container" className="grid grid-cols-1 xl:grid-cols-3 gap-6 font-sans">
      
      {/* 1. Main Graphical Trends Card */}
      <div className="xl:col-span-2 bg-zinc-950 border border-zinc-900 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
        <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none"></div>
        <div className="absolute right-12 bottom-12 h-32 w-32 rounded-full bg-amber-500/5 blur-3xl pointer-events-none"></div>

        {/* Top bar logic & selectors */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-zinc-100 flex items-center gap-2">
              <BarChart4 className="h-4 w-4 text-amber-500" />
              SaaS Demand validation streams
            </h3>
            <p className="text-[11px] text-zinc-500 mt-1 font-mono">Comparing waitlist volume vs dynamic acquisition ratios</p>
          </div>

          <div className="flex flex-wrap gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            {(['waitlist', 'pageviews', 'preSales', 'conversion'] as MetricType[]).map((metric) => (
              <button
                key={metric}
                id={`btn-metric-toggle-${metric}`}
                onClick={() => setSelectedMetric(metric)}
                className={`text-[10px] font-mono px-2.5 py-1.5 rounded-md transition-all ${
                  selectedMetric === metric
                    ? 'bg-zinc-800 text-zinc-100 shadow'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                {metric.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Graphic Stage */}
        <div className="relative border border-zinc-900 bg-zinc-950/40 rounded-lg p-3 my-2 flex-grow flex flex-col justify-center min-h-[190px]">
          {activeAndInbox.length === 0 ? (
            <div className="text-center py-10 text-xs text-zinc-600 font-mono">
              Insufficient operating data to map curves
            </div>
          ) : (
            <>
              {/* Highlight Hover Card */}
              <div className="absolute top-2 right-2 text-[10px] font-mono bg-zinc-900 border border-zinc-800/80 px-2 py-1 rounded text-zinc-400 h-6 flex items-center">
                {hoveredIndex !== null ? (
                  <>
                    <span className="text-zinc-200 font-semibold mr-1">{activeAndInbox[hoveredIndex].name}:</span>
                    <span className={`${getMetricColorClass(selectedMetric)}`}>
                      {getMetricValue(activeAndInbox[hoveredIndex], selectedMetric).toLocaleString()} {getMetricUnit(selectedMetric)}
                    </span>
                  </>
                ) : (
                  <span>Hover points to map performance</span>
                )}
              </div>

              {/* SVG Curve */}
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
                <defs>
                  <linearGradient id={`${selectedMetric}-gradient`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={
                      selectedMetric === 'waitlist' ? '#f59e0b' : // amber
                      selectedMetric === 'pageviews' ? '#3b82f6' : // blue
                      selectedMetric === 'preSales' ? '#10b981' : // emerald
                      '#a855f7' // purple
                    } stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                  </linearGradient>
                  
                  <linearGradient id={`${selectedMetric}-line`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.4" />
                    <stop offset="50%" stopColor={
                      selectedMetric === 'waitlist' ? '#fbbf24' : 
                      selectedMetric === 'pageviews' ? '#60a5fa' : 
                      selectedMetric === 'preSales' ? '#34d399' : 
                      '#c084fc'
                    } stopOpacity="1" />
                    <stop offset="100%" stopColor="#312e81" stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                {/* Y grids */}
                <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#18181b" strokeDasharray="3,3" />
                <line x1={paddingX} y1={(height) / 2} x2={width - paddingX} y2={(height) / 2} stroke="#18181b" strokeDasharray="3,3" />
                <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#27272a" />

                {/* Vertical guides */}
                {points.map((pt, i) => (
                  <line 
                    key={`v-guide-${i}`}
                    x1={pt.x} 
                    y1={paddingY} 
                    x2={pt.x} 
                    y2={height - paddingY} 
                    stroke={hoveredIndex === i ? '#27272a' : '#141416'} 
                    strokeWidth={hoveredIndex === i ? 1.5 : 1}
                  />
                ))}

                {/* Curve fills */}
                {points.length > 1 && (
                  <>
                    <path d={areaPath} fill={`url(#${selectedMetric}-gradient)`} />
                    <path d={linePath} fill="none" stroke={`url(#${selectedMetric}-line)`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </>
                )}

                {/* Data Points */}
                {points.map((pt, idx) => (
                  <g key={`group-pt-${idx}`}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={hoveredIndex === idx ? 6 : 4}
                      fill="#09090b"
                      stroke={
                        selectedMetric === 'waitlist' ? '#f59e0b' :
                        selectedMetric === 'pageviews' ? '#3b82f6' :
                        selectedMetric === 'preSales' ? '#10b981' :
                        '#a855f7'
                      }
                      strokeWidth={hoveredIndex === idx ? 2.5 : 1.5}
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                  </g>
                ))}
              </svg>

              {/* X Names labels block */}
              <div className="flex justify-between px-6 mt-1 text-[9px] font-mono text-zinc-500 uppercase tracking-tight select-none">
                {activeAndInbox.map((p, idx) => (
                  <span 
                    key={`lbl-${idx}`} 
                    className={`max-w-[80px] text-center truncate cursor-help ${
                      hoveredIndex === idx ? 'text-zinc-200 font-bold scale-105 transition-transform' : ''
                    }`}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {p.name}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. Side Panel Cards: Comparative Efficiency */}
      <div id="side-comparatives-panel" className="flex flex-col gap-4">
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 flex-1 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-3 top-3 opacity-15">
            <TrendingUp className="h-20 w-20 text-indigo-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-zinc-900 border border-zinc-800 text-indigo-400">
                <Users className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-semibold text-zinc-300">Waitlist Velocity Leader</span>
            </div>
            {activeAndInbox.length > 0 ? (
              (() => {
                const sorted = [...activeAndInbox].sort((a,b) => b.metrics.waitlistCount - a.metrics.waitlistCount);
                const leader = sorted[0];
                return (
                  <div className="mt-4">
                    <span className="block text-lg font-bold text-zinc-100 tracking-tight">{leader.name}</span>
                    <span className="block text-xs font-mono text-amber-500 mt-0.5">{leader.metrics.waitlistCount.toLocaleString()} pre-registrations</span>
                    <p className="text-[11px] text-zinc-500 mt-2 line-clamp-2">Targeting: {leader.targetMarket}</p>
                  </div>
                );
              })()
            ) : null}
          </div>
          <div className="border-t border-zinc-900 pt-3 mt-3 text-[10px] font-mono text-zinc-550 flex items-center justify-between">
            <span>Market velocity:</span>
            <span className="text-emerald-400">+18% avg weekly velocity</span>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 flex-1 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-3 top-3 opacity-15">
            <DollarSign className="h-20 w-20 text-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-zinc-900 border border-zinc-800 text-emerald-400">
                <DollarSign className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-semibold text-zinc-300">Acquisition Efficiency (CPC)</span>
            </div>
            {activeAndInbox.length > 0 ? (
              (() => {
                const sorted = [...activeAndInbox].sort((a,b) => a.metrics.cpc - b.metrics.cpc);
                const efficiencyLeader = sorted[0];
                return (
                  <div className="mt-4">
                    <span className="block text-lg font-bold text-zinc-100 tracking-tight">{efficiencyLeader.name}</span>
                    <span className="block text-xs font-mono text-emerald-400 mt-0.5">${efficiencyLeader.metrics.cpc.toFixed(2)} cost per click</span>
                    <p className="text-[11px] text-zinc-500 mt-2 line-clamp-2">Monetization setup: {efficiencyLeader.monetization}</p>
                  </div>
                );
              })()
            ) : null}
          </div>
          <div className="border-t border-zinc-900 pt-3 mt-3 text-[10px] font-mono text-zinc-550 flex items-center justify-between">
            <span>Average Campaign CPC:</span>
            <span className="text-zinc-400">$1.15 limit</span>
          </div>
        </div>
      </div>
    </div>
  );
}

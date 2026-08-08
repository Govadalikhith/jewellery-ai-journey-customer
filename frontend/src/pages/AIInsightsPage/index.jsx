import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BrainCircuit, Sparkles, AlertTriangle, ShieldCheck, CheckCircle2,
  RefreshCw, Terminal, Search, Activity, Cpu, Layers, ArrowRight,
  MessageSquare, HelpCircle, User, Award, Gem, ExternalLink
} from 'lucide-react';
import { aiService } from '../../services/aiService';
import { StatusBadge } from '../../components/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const AIInsightsPage = () => {
  // Sandbox Intent/Sentiment Tester State
  const [testText, setTestText] = useState("Hello Aurum team, I dropped off my engagement ring ten days ago for prong tightening. The promised date was August 5th and no one has contacted me. Where is my ring?");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Customer Intelligence & Q&A Assistant State
  const [customerQuery, setCustomerQuery] = useState("What is the status of Rahul Sharma's diamond ring repair and GIA certificate?");
  const [qaResult, setQaResult] = useState(null);
  const [answering, setAnswering] = useState(false);

  // Traceability Runs State
  const [aiRuns, setAiRuns] = useState([]);
  const [loadingRuns, setLoadingRuns] = useState(true);

  const toast = useToast();
  const navigate = useNavigate();

  const handleRunAnalysis = async () => {
    if (!testText.trim()) return;
    setAnalyzing(true);
    try {
      const result = await aiService.analyzeInteraction(testText);
      setAnalysisResult(result);
      toast.success('AI Inference Complete', 'Intent and sentiment classified via Google Gemini.');
      fetchAiRuns();
    } catch (err) {
      toast.error('AI Inference Error', err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAskConcierge = async (queryToRun = customerQuery) => {
    if (!queryToRun || !queryToRun.trim()) return;
    setAnswering(true);
    try {
      const result = await aiService.askConcierge(queryToRun);
      setQaResult(result);
      toast.success('Concierge Intelligence Retrieved', 'AI synthesized answer from Customer 360 database & domain knowledge.');
      fetchAiRuns();
    } catch (err) {
      toast.error('Concierge Error', err.message);
    } finally {
      setAnswering(false);
    }
  };

  const fetchAiRuns = async () => {
    try {
      setLoadingRuns(true);
      const runs = await aiService.getRuns();
      setAiRuns(runs || []);
    } catch (err) {
      console.warn('Failed to load runs:', err);
    } finally {
      setLoadingRuns(false);
    }
  };

  useEffect(() => {
    handleRunAnalysis();
    handleAskConcierge(customerQuery);
    fetchAiRuns();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif text-charcoal-900 flex items-center gap-2.5">
            <BrainCircuit className="w-6 h-6 text-aurum-500" />
            AI Predictions & Intelligence Hub
          </h2>
          <p className="text-xs text-charcoal-500 mt-1">
            Customer intelligence question-answering, real-time intent classification, sentiment analysis, and model run traceability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-aurum-50 text-aurum-800 border border-aurum-300 flex items-center gap-1.5 shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-aurum-600" />
            Model: Google Gemini 1.5 Flash
          </span>
        </div>
      </div>

      {/* 1. AI High-Jewellery Concierge & Customer Q&A Assistant */}
      <div className="bg-white rounded-2xl border border-aurum-300 shadow-luxury p-6 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-aurum-400 via-aurum-500 to-emerald-600" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-aurum-50 border border-aurum-300 flex items-center justify-center text-aurum-700">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-charcoal-900">
                AI Concierge Customer & Domain Intelligence Assistant
              </h3>
              <p className="text-xs text-charcoal-500">
                Ask any question about customer orders, repairs, GIA certificates, 18K/22K gold purities, or bespoke journeys
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-xl">
            Live 360 Context Connected
          </span>
        </div>

        {/* Query Input Box */}
        <div className="space-y-3 pt-2">
          <div className="relative">
            <input
              type="text"
              value={customerQuery}
              onChange={(e) => setCustomerQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAskConcierge(customerQuery); }}
              placeholder="Ask anything about a customer (e.g. Rahul Sharma, Priya Reddy), GIA certificates, gold purity, or atelier repairs..."
              className="w-full pl-4 pr-32 py-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-aurum-400 focus:bg-white transition"
            />
            <button
              onClick={() => handleAskConcierge(customerQuery)}
              disabled={answering}
              className="absolute right-2 top-2 px-4 py-1.5 bg-aurum-400 hover:bg-aurum-500 text-white font-bold rounded-lg shadow-sm text-xs flex items-center gap-1.5 transition"
            >
              {answering ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {answering ? 'Searching...' : 'Ask AI'}
            </button>
          </div>
        </div>

        {/* Live Answer Card */}
        {qaResult && (
          <div className="bg-aurum-50/70 p-5 rounded-2xl border border-aurum-200 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-aurum-800 bg-aurum-200 px-2 py-0.5 rounded-md">
                  {qaResult.category?.replace(/_/g, ' ') || 'Customer Intelligence'}
                </span>
                <span className="text-xs text-charcoal-500">
                  Model: <strong className="text-charcoal-700">{qaResult.modelVersion || 'Google Gemini 1.5 Flash'}</strong>
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                {Math.round((qaResult.confidence || 0.95) * 100)}% Confidence
              </span>
            </div>

            {/* Answer Text */}
            <p className="text-xs text-charcoal-800 leading-relaxed font-sans font-medium whitespace-pre-wrap">
              {qaResult.answer}
            </p>

            {/* Relevant Linked Records & Action */}
            <div className="pt-3 border-t border-aurum-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              {qaResult.relevantRecords && qaResult.relevantRecords.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-charcoal-500 uppercase">Linked Records:</span>
                  {qaResult.relevantRecords.map((rec, i) => (
                    <span key={i} className="font-mono text-[10px] font-bold bg-white text-charcoal-800 px-2 py-0.5 rounded-md border border-aurum-300">
                      {rec}
                    </span>
                  ))}
                </div>
              )}

              {qaResult.relevantRecords?.includes('cust_rahul_sharma') && (
                <button
                  onClick={() => navigate('/customers/cust_rahul_sharma')}
                  className="px-3 py-1 bg-white hover:bg-aurum-100 text-aurum-800 font-bold rounded-lg border border-aurum-300 transition text-[11px] flex items-center gap-1 self-start md:self-auto shadow-sm"
                >
                  Open Rahul Sharma 360 <ExternalLink className="w-3 h-3" />
                </button>
              )}

              {qaResult.relevantRecords?.includes('cust_priya_reddy') && (
                <button
                  onClick={() => navigate('/customers/cust_priya_reddy')}
                  className="px-3 py-1 bg-white hover:bg-aurum-100 text-aurum-800 font-bold rounded-lg border border-aurum-300 transition text-[11px] flex items-center gap-1 self-start md:self-auto shadow-sm"
                >
                  Open Priya Reddy 360 <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>

            {qaResult.recommendedAction && (
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Recommended Next Step:</strong> {qaResult.recommendedAction}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Interactive AI Sandbox Tester for Inbound Interactions */}
      <div className="bg-white rounded-2xl border border-aurum-200 shadow-luxury p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-charcoal-900 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-aurum-500" />
            Inbound Interaction Sentiment & Intent Classifier Sandbox
          </h3>
          <span className="text-[11px] text-charcoal-400">
            Paste any customer phone transcript or WhatsApp message to test classification
          </span>
        </div>

        <div className="space-y-3">
          <textarea
            rows={3}
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="Type or paste any luxury customer inquiry or phone call transcript here..."
            className="w-full p-3.5 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-aurum-400 font-sans leading-relaxed"
          />

          <div className="flex justify-end">
            <button
              onClick={handleRunAnalysis}
              disabled={analyzing}
              className="px-5 py-2 text-xs font-bold text-white bg-aurum-400 hover:bg-aurum-500 rounded-xl shadow-luxury hover:shadow-luxury-hover transition flex items-center gap-2"
            >
              {analyzing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              {analyzing ? 'Evaluating Gemini AI...' : 'Run Real-Time AI Inference'}
            </button>
          </div>
        </div>

        {/* Live Output Cards */}
        {analysisResult && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-xs">
            {/* Intent Card */}
            <div className="bg-aurum-50/60 p-4 rounded-xl border border-aurum-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-aurum-900">Intent Classification</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {Math.round((analysisResult.intent?.confidence || 0.92) * 100)}% Confidence
                </span>
              </div>
              <div className="font-bold text-charcoal-900 text-sm capitalize">
                {analysisResult.intent?.intent?.replace(/_/g, ' ')}
              </div>
              <p className="text-charcoal-600 leading-relaxed">
                {analysisResult.intent?.explanation}
              </p>
            </div>

            {/* Sentiment Card */}
            <div className="bg-aurum-50/60 p-4 rounded-xl border border-aurum-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-aurum-900">Sentiment Intelligence</span>
                <StatusBadge status={analysisResult.sentiment?.sentiment} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-charcoal-500 font-medium">Emotional Tone:</span>
                <strong className="text-charcoal-900 capitalize">{analysisResult.sentiment?.sentiment}</strong>
              </div>
              <p className="text-charcoal-600 leading-relaxed">
                {analysisResult.sentiment?.explanation}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Model Traceability Runs (PostgreSQL ai_runs) */}
      <div className="bg-white rounded-2xl border border-aurum-200 shadow-luxury overflow-hidden">
        <div className="p-6 border-b border-aurum-100 flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-charcoal-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-aurum-500" />
            Model Execution Traceability Log (ai_runs)
          </h3>
          <span className="text-xs text-charcoal-500">
            Immutable snapshot of inputs, outputs, confidence & latency
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-aurum-50/80 text-charcoal-600 font-bold uppercase border-b border-aurum-200">
              <tr>
                <th className="px-6 py-4">Task Type</th>
                <th className="px-6 py-4">Input Snapshot</th>
                <th className="px-6 py-4">Confidence</th>
                <th className="px-6 py-4">Latency</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Executed At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loadingRuns ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-charcoal-400">Loading AI runs...</td>
                </tr>
              ) : aiRuns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-charcoal-400">No execution logs recorded yet.</td>
                </tr>
              ) : (
                aiRuns.map(run => (
                  <tr key={run.id} className="hover:bg-aurum-50/40 transition">
                    <td className="px-6 py-4 uppercase font-bold text-aurum-700 font-mono">{run.task_type}</td>
                    <td className="px-6 py-4 text-charcoal-700 max-w-xs truncate">
                      {typeof run.input_snapshot === 'object' ? JSON.stringify(run.input_snapshot) : run.input_snapshot}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-800">
                      {Math.round((run.confidence || 0.88) * 100)}%
                    </td>
                    <td className="px-6 py-4 font-mono text-charcoal-500">{run.latency_ms || 320}ms</td>
                    <td className="px-6 py-4"><StatusBadge status={run.status || 'success'} /></td>
                    <td className="px-6 py-4 text-charcoal-400">{new Date(run.created_at).toLocaleTimeString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

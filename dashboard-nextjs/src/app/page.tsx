import Link from 'next/link';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050511] text-slate-200 font-sans selection:bg-emerald-500/30 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center z-10">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight">
          MultiPump<span className="text-slate-100"> OS</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/signup" className="text-sm font-medium bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-full transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transform hover:-translate-y-0.5">
            Get Started &rarr;
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Next-Gen Hardware Control</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight max-w-4xl">
          Scale Your Devices <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">Without Limits.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
          The ultimate platform to monitor, manage, and automate thousands of hardware points from a single, beautiful dashboard.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/signup" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-lg font-bold px-8 py-4 rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/25 transform hover:-translate-y-1">
            Create Free Account
          </Link>
          <Link href="/login" className="bg-slate-800/50 hover:bg-slate-800 text-white text-lg font-bold px-8 py-4 rounded-2xl border border-slate-700/50 transition-all backdrop-blur-sm">
            Access Dashboard
          </Link>
        </div>
      </main>

      {/* Mockup Preview UI */}
      <div className="w-full max-w-5xl mx-auto mt-16 mb-[-100px] z-10 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050511] via-transparent to-transparent z-20" />
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-t-3xl shadow-2xl p-4 overflow-hidden">
           <div className="flex gap-2 mb-4 px-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
           </div>
           <div className="h-64 bg-slate-950/50 rounded-xl border border-slate-800 flex items-center justify-center">
              <div className="flex items-center gap-3 opacity-50">
                <svg className="w-8 h-8 text-emerald-500 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="font-mono text-slate-400">Syncing telemetry data...</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { use } from 'react';
import { useRouter } from 'next/navigation';

export default function DeviceView({ params }: { params: Promise<{ mac: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  // We need to decode the MAC if it was URL encoded
  const decodedMac = decodeURIComponent(resolvedParams.mac);

  return (
    <div className="h-screen flex flex-col bg-gray-900 border-none m-0 p-0 overflow-hidden">
      <div className="bg-gray-950 text-white px-4 py-3 flex items-center justify-between shadow-md z-10 shrink-0 border-b border-gray-800">
        <button onClick={() => router.push('/dashboard')} className="flex items-center text-sm font-semibold hover:text-blue-400 transition-colors">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Dashboard
        </button>
        <span className="font-mono text-xs opacity-60 flex items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
          {decodedMac}
        </span>
      </div>
      
      {/* Load the raw legacy UI pointing directly to the target MAC address */}
      <iframe 
        src={`http://localhost:3000/?mac=${encodeURIComponent(decodedMac)}`} 
        className="w-full flex-1 border-none bg-base-100"
        title="Device Control Panel"
      />
    </div>
  );
}

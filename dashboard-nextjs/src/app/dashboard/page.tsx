"use client";
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface Device {
  macAddress: string;
  serialNumber: string;
  alias: string;
}

export default function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [email, setEmail] = useState('');
  const router = useRouter();

  const [macAddress, setMacAddress] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [alias, setAlias] = useState('');

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => {
      if (!user) router.push('/');
      else {
        setEmail(user.email!);
        fetchDevices(user.email!);
      }
    });
    return unsub;
  }, [router]);

  const fetchDevices = async (userEmail: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/devices?email=${userEmail}`);
      const data = await res.json();
      setDevices(data);
    } catch(err) { console.error(err); }
  };

  const registerDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3000/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ macAddress, serialNumber, ownerEmail: email, alias })
      });
      fetchDevices(email);
      setMacAddress(''); setSerialNumber(''); setAlias('');
    } catch(err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight">Devices Overview</h1>
          <button onClick={() => auth.signOut()} className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-red-400 font-semibold transition-colors">
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl sticky top-8">
              <h2 className="text-xl font-bold mb-6 text-gray-200">Register Device</h2>
              <form onSubmit={registerDevice} className="space-y-4">
                <input className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-emerald-500 focus:outline-none transition-colors" placeholder="MAC Address (e.g. 68:FE:71...)" value={macAddress} onChange={e => setMacAddress(e.target.value)} required />
                <input className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-emerald-500 focus:outline-none transition-colors" placeholder="8-Digit Serial Number" value={serialNumber} onChange={e => setSerialNumber(e.target.value)} />
                <input className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:border-emerald-500 focus:outline-none transition-colors" placeholder="Alias (e.g. Farm Pump 1)" value={alias} onChange={e => setAlias(e.target.value)} />
                <button className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-emerald-900/50 mt-2">Activate Device</button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-200 hidden lg:block">Active Hardware</h2>
            {devices.length === 0 ? (
              <div className="bg-gray-800/30 border border-gray-800 p-12 rounded-2xl text-center">
                <p className="text-gray-400 font-medium">No devices found.</p>
                <p className="text-gray-500 text-sm mt-2">Register your first module on the left.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {devices.map(dev => (
                  <div key={dev.macAddress} onClick={() => router.push(`/device/${dev.macAddress}`)} className="bg-gray-800 hover:bg-gray-750 p-6 rounded-2xl cursor-pointer border border-gray-700 hover:border-blue-500 transition-all shadow-md group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="18" x2="6.01" y2="18"></line><line x1="10" y1="18" x2="10.01" y2="18"></line><path d="M16 14V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v8"></path></svg>
                      </div>
                      <span className="text-xs font-semibold bg-gray-900 text-gray-300 px-3 py-1 rounded-full border border-gray-700">Online</span>
                    </div>
                    <p className="font-bold text-xl text-white mb-1 group-hover:text-blue-300 transition-colors">{dev.alias || 'Unnamed Module'}</p>
                    <p className="text-sm text-gray-500 font-mono mb-6">{dev.macAddress}</p>
                    <div className="border-t border-gray-700 pt-4 flex justify-between items-center text-sm font-semibold text-blue-400">
                      Open Controller <span>&rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

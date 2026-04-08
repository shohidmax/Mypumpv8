import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';

type ScreenState = 'LOGIN' | 'DASHBOARD' | 'DEVICE';
interface Device { macAddress: string; serialNumber: string; alias: string; }

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('LOGIN');
  const [user, setUser] = useState<User | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [activeMac, setActiveMac] = useState<string>('');

  // Login Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  // Reg Form
  const [regMac, setRegMac] = useState('');
  const [regSerial, setRegSerial] = useState('');
  const [regAlias, setRegAlias] = useState('');
  const [loading, setLoading] = useState(true);

  const LOCAL_API_URL = 'http://10.0.2.2:3000'; // Default for android emulator mapping to localhost

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      if (u) {
        setScreen('DASHBOARD');
        fetchDevices(u.email!);
      } else {
        setScreen('LOGIN');
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const fetchDevices = async (mail: string) => {
    try {
      const res = await fetch(`${LOCAL_API_URL}/api/devices?email=${mail}`);
      const data = await res.json();
      setDevices(data);
    } catch (err) { console.warn("Fetch failed, ensure server is running.", err); }
  };

  const handleAuth = async () => {
    try {
      if(isLogin) await signInWithEmailAndPassword(auth, email, password);
      else await createUserWithEmailAndPassword(auth, email, password);
    } catch(err: any) { alert(err.message); }
  };

  const registerDevice = async () => {
    try {
      await fetch(`${LOCAL_API_URL}/api/devices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ macAddress: regMac, serialNumber: regSerial, ownerEmail: user?.email, alias: regAlias })
      });
      fetchDevices(user!.email!);
      setRegMac(''); setRegSerial(''); setRegAlias('');
    } catch(err) { alert("Registration failed. Check network."); }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  if (screen === 'LOGIN') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>MultiPump Login</Text>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#9CA3AF" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#9CA3AF" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.btn} onPress={handleAuth}><Text style={styles.btnText}>{isLogin ? 'Login' : 'Register'}</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.link}>{isLogin ? 'Need an account? Register' : 'Have an account? Login'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === 'DEVICE') {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#111827'}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setScreen('DASHBOARD')}><Text style={styles.backText}>&larr; Back to Devices</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>{activeMac}</Text>
        </View>
        <WebView 
          source={{ uri: `${LOCAL_API_URL}/?mac=${encodeURIComponent(activeMac)}` }} 
          style={{flex: 1}} 
        />
      </SafeAreaView>
    );
  }

  // DASHBOARD
  return (
    <SafeAreaView style={styles.dashboardContainer}>
      <ScrollView contentContainerStyle={{padding: 20}}>
        <Text style={styles.dashboardTitle}>My Devices</Text>
        <Text style={styles.subtitle}>Logged in as {user?.email}</Text>
        <TouchableOpacity onPress={() => auth.signOut()} style={styles.logoutBtn}><Text style={styles.logoutText}>Logout</Text></TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Add New Device</Text>
          <TextInput style={styles.input} placeholderTextColor="#9CA3AF" placeholder="MAC Address" value={regMac} onChangeText={setRegMac} />
          <TextInput style={styles.input} placeholderTextColor="#9CA3AF" placeholder="Serial Number" value={regSerial} onChangeText={setRegSerial} />
          <TextInput style={styles.input} placeholderTextColor="#9CA3AF" placeholder="Alias (e.g. Pump 1)" value={regAlias} onChangeText={setRegAlias} />
          <TouchableOpacity style={styles.btn} onPress={registerDevice}><Text style={styles.btnText}>Register</Text></TouchableOpacity>
        </View>

        <Text style={styles.cardTitle}>Active Devices</Text>
        {devices.length === 0 ? <Text style={styles.subtitle}>No devices yet.</Text> : 
          devices.map(d => (
            <TouchableOpacity key={d.macAddress} style={styles.deviceCard} onPress={() => { setActiveMac(d.macAddress); setScreen('DEVICE'); }}>
              <Text style={styles.deviceAlias}>{d.alias || 'Unnamed'}</Text>
              <Text style={styles.deviceMac}>{d.macAddress}</Text>
            </TouchableOpacity>
          ))
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center', padding: 20 },
  center: { flex: 1, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center'},
  dashboardContainer: { flex: 1, backgroundColor: '#111827' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#60A5FA', marginBottom: 40 },
  input: { width: '100%', backgroundColor: '#1F2937', color: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#374151' },
  btn: { width: '100%', backgroundColor: '#2563EB', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { color: '#9CA3AF', marginTop: 20 },
  dashboardTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginTop: 40 },
  subtitle: { color: '#9CA3AF', marginBottom: 15 },
  logoutBtn: { padding: 10, alignSelf: 'flex-start', marginBottom: 20, backgroundColor: '#374151', borderRadius: 8 },
  logoutText: { color: '#F87171', fontWeight: 'bold' },
  card: { backgroundColor: '#1F2937', padding: 20, borderRadius: 12, marginBottom: 30, borderWidth: 1, borderColor: '#374151' },
  cardTitle: { fontSize: 18, color: '#fff', fontWeight: 'bold', marginBottom: 15 },
  deviceCard: { backgroundColor: '#374151', padding: 20, borderRadius: 12, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#3B82F6' },
  deviceAlias: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  deviceMac: { color: '#9CA3AF', marginTop: 5, fontFamily: 'monospace' },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1F2937', borderBottomWidth: 1, borderBottomColor: '#374151' },
  backText: { color: '#60A5FA', fontWeight: 'bold', fontSize: 16 },
  headerTitle: { color: '#fff', fontFamily: 'monospace', fontSize: 12, opacity: 0.7 }
});

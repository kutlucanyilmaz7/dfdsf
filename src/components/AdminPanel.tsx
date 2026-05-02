import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Settings as SettingsIcon, 
  Shield, 
  Mail, 
  Database,
  Search,
  Plus,
  Trash2,
  Lock,
  Unlock,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '../../lib/utils';
import { User } from '../types';

interface Stats {
  totalUsers: number;
  totalCredits: number;
  totalIncome: number;
  activeSessions: number;
  chartData: { date: string, users: number, usage: number }[];
}

interface Log {
  id: number;
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
  timestamp: string;
}

export function AdminPanel() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    console.log('Fetching admin data...');
    try {
      const statsRes = await fetch('/api/admin/stats');
      const usersRes = await fetch('/api/admin/users');
      const logsRes = await fetch('/api/admin/logs');
      
      if (!statsRes.ok || !usersRes.ok || !logsRes.ok) {
        throw new Error('API request failed');
      }

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const logsData = await logsRes.json();
      
      console.log('Admin data received:', { stats: !!statsData, users: usersData.length, logs: logsData.length });
      
      setStats(statsData);
      setUsers(usersData);
      setLogs(logsData);
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string, data: Partial<User>) => {
    try {
      const res = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...data })
      });
      if (res.ok) {
        toast.success('Kullanıcı güncellendi');
        fetchData();
      }
    } catch (err) {
      toast.error('Güncelleme başarısız');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Kullanıcı silindi');
        fetchData();
      }
    } catch (err) {
      toast.error('Silme işlemi başarısız');
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    u.lastName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <Activity className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-zinc-500 font-medium tracking-tight">Veriler Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Card className="w-full max-w-md p-8 text-center space-y-4">
          <div className="p-3 bg-rose-50 rounded-full w-fit mx-auto">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900">Yükleme Hatası</h2>
          <p className="text-zinc-500">Yönetim paneli verileri alınamadı. Lütfen internet bağlantınızı kontrol edin veya daha sonra tekrar deneyin.</p>
          <Button onClick={fetchData} className="w-full">
            <Activity className="w-4 h-4 mr-2" /> Tekrar Dene
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 h-screen overflow-auto bg-slate-50/50">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Yönetim Paneli</h1>
          <p className="text-zinc-500 font-medium">CroopsAI platformunu gerçek zamanlı izleyin.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchData} className="bg-white">
            <Activity className="w-4 h-4 mr-2 text-primary" /> Yenile
          </Button>
          <Badge variant="outline" className="px-4 py-2 bg-indigo-50 text-indigo-600 border-indigo-100 flex gap-2 font-bold shadow-sm">
            <Shield className="w-4 h-4" /> Süper Admin
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Toplam Kullanıcı', value: stats?.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100/50', trend: '+12%', up: true },
          { label: 'Harcanan Kredi', value: stats?.totalCredits, icon: Database, color: 'text-emerald-600', bg: 'bg-emerald-100/50', trend: '+5%', up: true },
          { label: 'Toplam Ciro', value: `${stats?.totalIncome} TL`, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-100/50', trend: '-2%', up: false },
          { label: 'Aktif Oturumlar', value: stats?.activeSessions, icon: Activity, color: 'text-violet-600', bg: 'bg-violet-100/50', trend: '+24%', up: true },
        ].map((item, i) => (
          <Card key={i} className="bg-white border-zinc-200 shadow-sm hover:shadow-md transition-all border-l-4" style={{ borderColor: i === 0 ? '#2563eb' : i === 1 ? '#059669' : i === 2 ? '#d97706' : '#7c3aed' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{item.label}</CardTitle>
              <div className={`p-2 rounded-lg ${item.bg}`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-zinc-900">{item.value ?? '0'}</div>
              <div className={cn("text-xs font-bold mt-1 flex items-center gap-1", item.up ? "text-emerald-600" : "text-rose-600")}>
                {item.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {item.trend} geçen haftadan beri
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chart Column */}
        <Card className="lg:col-span-2 bg-white border-zinc-200 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-zinc-50">
            <CardTitle className="text-zinc-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Sistem Analitiği
            </CardTitle>
            <CardDescription>Son 7 günlük kullanıcı kaydı ve kredi kullanımı.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.chartData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10a37f" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10a37f" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="usage" stroke="#10a37f" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                  <Area type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Logs Column */}
        <Card className="bg-white border-zinc-200 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-zinc-50">
            <CardTitle className="text-zinc-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-violet-600" />
              Sistem Günlüğü
            </CardTitle>
            <CardDescription>Gerçek zamanlı olay akışı.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-50">
              {logs.map((log) => (
                <div key={log.id} className="p-4 flex gap-3 hover:bg-zinc-50 transition-colors">
                  <div className="mt-1">
                    {log.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    {log.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-500" />}
                    {log.type === 'warning' && <Clock className="w-4 h-4 text-amber-500" />}
                    {log.type === 'info' && <Database className="w-4 h-4 text-blue-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-800">{log.message}</p>
                    <p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold tracking-tight">
                      {new Date(log.timestamp).toLocaleTimeString('tr-TR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full text-xs text-zinc-500 py-4 font-bold border-t border-zinc-50">
              TÜMÜNÜ GÖR
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-zinc-200/50 p-1 rounded-xl w-fit">
          <TabsTrigger value="users" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2">
            <Users className="w-4 h-4" /> Kullanıcılar
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2">
            <SettingsIcon className="w-4 h-4" /> Ayarlar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="bg-white border-zinc-200 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-zinc-50 flex md:flex-row flex-col gap-4 items-center justify-between">
              <div>
                <CardTitle className="text-zinc-900">Kullanıcı Veritabanı</CardTitle>
                <CardDescription>Platformdaki tüm kayıtlı kullanıcıları yönetin.</CardDescription>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input 
                  placeholder="İsim veya e-posta ile ara..." 
                  className="pl-10 h-11 bg-zinc-50 border-zinc-200 focus:bg-white rounded-xl transition-all shadow-inner"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-zinc-50/50 border-b border-zinc-100 text-zinc-500 uppercase text-[10px] font-black tracking-widest">
                      <th className="p-5 text-left">Kullanıcı</th>
                      <th className="p-5 text-left">Konum</th>
                      <th className="p-5 text-left">Kredi</th>
                      <th className="p-5 text-left">Durum</th>
                      <th className="p-5 text-right">Eylemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-zinc-50/30 transition-colors group">
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-xs">
                              {u.email[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-zinc-900">{u.firstName} {u.lastName}</div>
                              <div className="text-xs text-zinc-500 font-medium">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-5 text-zinc-600 font-medium">
                          {u.city}, {u.country}
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2">
                            <Input 
                              type="number" 
                              className="w-20 h-8 bg-zinc-50 border-zinc-100 text-xs font-bold text-center" 
                              defaultValue={u.credits}
                              onBlur={(e) => updateUser(u.id, { credits: parseInt(e.target.value) })}
                            />
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-none">
                              Kredi
                            </Badge>
                          </div>
                        </td>
                        <td className="p-5">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "px-3 py-1 font-bold text-[10px] uppercase",
                              u.status === 'suspended' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                            )}
                          >
                            {u.status === 'suspended' ? 'Askıda' : 'Aktif'}
                          </Badge>
                        </td>
                        <td className="p-5">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 hover:bg-zinc-100"
                              onClick={() => updateUser(u.id, { isAdmin: !u.isAdmin })}
                              title={u.isAdmin ? "Admin Yetkisini Al" : "Admin Yap"}
                            >
                              <Shield className={cn("w-4 h-4", u.isAdmin ? "text-indigo-600" : "text-zinc-400")} />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 hover:bg-zinc-100"
                              onClick={() => updateUser(u.id, { status: u.status === 'suspended' ? 'active' : 'suspended' })}
                            >
                              {u.status === 'suspended' ? <Unlock className="w-4 h-4 text-emerald-500" /> : <Lock className="w-4 h-4 text-amber-500" />}
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 hover:bg-rose-50 text-rose-500"
                              onClick={() => deleteUser(u.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-white border-zinc-200 shadow-sm">
              <CardHeader className="border-b border-zinc-50">
                <CardTitle className="text-zinc-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  Ödeme Entegrasyonları
                </CardTitle>
                <CardDescription>PayTR ve Akbank API yapılandırması.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">PayTR Merchant ID</label>
                    <Input defaultValue="2341XX" className="h-11 bg-zinc-50 border-zinc-200 focus:bg-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">PayTR Key</label>
                    <Input type="password" value="********" className="h-11 bg-zinc-50 border-zinc-200 focus:bg-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Akbank Mağaza No</label>
                  <Input defaultValue="AKB-9923" className="h-11 bg-zinc-50 border-zinc-200 focus:bg-white" />
                </div>
                <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 font-bold">
                  ÖDEME AYARLARINI KAYDET
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white border-zinc-200 shadow-sm">
              <CardHeader className="border-b border-zinc-50">
                <CardTitle className="text-zinc-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Zeka Motoru (AI) Ayarları
                </CardTitle>
                <CardDescription>Model parametreleri ve token limitleri.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Aktif AI Model</label>
                  <Input defaultValue="deepseek-chat" className="h-11 bg-zinc-50 border-zinc-200 focus:bg-white font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Max Tokens</label>
                    <Input type="number" defaultValue="4096" className="h-11 bg-zinc-50 border-zinc-200 focus:bg-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Sıcaklık (Temp)</label>
                    <Input type="number" defaultValue="0.7" step="0.1" className="h-11 bg-zinc-50 border-zinc-200 focus:bg-white" />
                  </div>
                </div>
                <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 font-bold">
                  AI PARAMETRELERİNİ GÜNCELLE
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

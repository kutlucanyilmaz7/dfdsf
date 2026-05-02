import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const TURKEY_CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin',
  'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale',
  'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum',
  'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta', 'Mersin',
  'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli',
  'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş',
  'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas',
  'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak',
  'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan',
  'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
].sort();

const COUNTRY_CITIES: Record<string, string[]> = {
  TR: TURKEY_CITIES,
  AZ: ['Bakü', 'Gence', 'Sumgayıt', 'Mingeçevir', 'Lankeran', 'Şirvan', 'Nahçıvan', 'Şeki', 'Yevlah'],
  US: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
  GB: ['London', 'Birmingham', 'Glasgow', 'Liverpool', 'Bristol', 'Manchester', 'Sheffield', 'Leeds', 'Edinburgh', 'Leicester'],
  DE: ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dortmund', 'Essen'],
  FR: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
  IT: ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence'],
  ES: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Palma'],
  RU: ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan', 'Nizhny Novgorod', 'Chelyabinsk', 'Samara'],
  NL: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Tilburg', 'Groningen'],
  BE: ['Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège', 'Bruges'],
  CH: ['Zurich', 'Geneva', 'Basel', 'Lausanne', 'Bern', 'Winterthur'],
  AT: ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck'],
  BR: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte'],
  CA: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa'],
  AU: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra'],
  CN: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Wuhan'],
  JP: ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka'],
  KR: ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju'],
  SA: ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar'],
  AE: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Al Ain'],
  QA: ['Doha', 'Al Rayyan', 'Al Wakrah', 'Al Khor'],
};

const COUNTRIES = [
  { code: 'TR', name: 'Türkiye' },
  { code: 'AZ', name: 'Azerbaycan' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'RU', name: 'Russia' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'BR', name: 'Brazil' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'CN', name: 'China' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'QA', name: 'Qatar' },
].sort((a, b) => a.name.localeCompare(b.name));

export function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('user_id', data.user.id);
      toast.success(t('login') + ' başarılı!');
      window.location.href = '/';
    } else {
      toast.error('E-posta veya şifre hatalı.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-50 via-white to-white">
      <Card className="w-full max-w-md bg-white border-zinc-200 shadow-2xl shadow-zinc-200/50">
        <CardHeader className="text-center pt-8 pb-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 font-bold text-white shadow-lg shadow-primary/20">C</div>
          <CardTitle className="text-2xl font-bold text-zinc-900 tracking-tight">{t('login')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-500">E-posta</label>
            <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="örnek@croops.ai" className="bg-white border-zinc-200 focus:border-primary text-zinc-900" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-500">{t('password')}</label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="bg-white border-zinc-200 focus:border-primary text-zinc-900" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 p-8 pt-4">
          <Button onClick={handleLogin} className="w-full h-11 font-semibold">{t('login')}</Button>
          <p className="text-sm text-zinc-500 text-center">
            Hesabınız yok mu? <button onClick={() => navigate('/register')} className="text-primary hover:underline font-medium">{t('register')}</button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export function Register() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    country: 'TR',
    city: ''
  });
  const navigate = useNavigate();

  const handleRegister = async () => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    
    if (res.ok) {
      toast.success(t('register') + ' başarılı!');
      navigate('/login');
    } else {
      const data = await res.json();
      toast.error(data.error || 'Kayıt başarısız.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-50 via-white to-white">
      <Card className="w-full max-w-md bg-white border-zinc-200 shadow-2xl shadow-zinc-200/50">
        <CardHeader className="text-center pt-8 pb-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 font-bold text-white shadow-lg shadow-primary/20">C</div>
          <CardTitle className="text-2xl font-bold text-zinc-900 tracking-tight">{t('register')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-500">{t('first_name')}</label>
              <Input value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="bg-white border-zinc-200 focus:border-primary text-zinc-900" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-500">{t('last_name')}</label>
              <Input value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="bg-white border-zinc-200 focus:border-primary text-zinc-900" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-500">E-posta</label>
            <Input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="bg-white border-zinc-200 focus:border-primary text-zinc-900" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-500">{t('password')}</label>
            <Input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="bg-white border-zinc-200 focus:border-primary text-zinc-900" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-500">{t('phone')}</label>
            <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+90 5XX XXX XX XX" className="bg-white border-zinc-200 focus:border-primary text-zinc-900" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-500">{t('country')}</label>
              <select 
                value={form.country} 
                onChange={e => setForm({...form, country: e.target.value, city: ''})}
                className="w-full h-10 px-3 py-2 bg-white border border-zinc-200 rounded-md text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none shadow-sm"
              >
                {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-500">{t('city')}</label>
              {COUNTRY_CITIES[form.country] ? (
                <select 
                  value={form.city} 
                  onChange={e => setForm({...form, city: e.target.value})}
                  className="w-full h-10 px-3 py-2 bg-white border border-zinc-200 rounded-md text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none shadow-sm"
                >
                  <option value="">{t('city')} Seçin</option>
                  {COUNTRY_CITIES[form.country].map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              ) : (
                <Input value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="bg-white border-zinc-200 focus:border-primary text-zinc-900" />
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 p-8 pt-4">
          <Button onClick={handleRegister} className="w-full h-11 font-semibold">{t('register')}</Button>
          <p className="text-sm text-zinc-500 text-center">
            Zaten hesabınız var mı? <button onClick={() => navigate('/login')} className="text-primary hover:underline font-medium">{t('login')}</button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

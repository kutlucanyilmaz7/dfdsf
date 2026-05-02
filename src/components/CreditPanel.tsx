import React from 'react';
import { CreditPackage, CREDIT_PACKAGES } from '../types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Check, CreditCard, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function CreditPanel() {
  const { t } = useTranslation();
  const handlePurchase = async (pkg: CreditPackage, method: 'paytr' | 'akbank') => {
    try {
      const endpoint = method === 'paytr' ? '/api/paytr/create-session' : '/api/akbank/process';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: pkg.id })
      });
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else if (data.success) {
        alert('Ödeme başarıyla simüle edildi! Kredileriniz eklendi.');
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-12 space-y-12 bg-white">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-zinc-900">{t('packages')}</h2>
        <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
          CroopsAI ile daha fazla üretmek için size en uygun paketi seçin.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {CREDIT_PACKAGES.map((pkg) => (
          <Card key={pkg.id} className="relative bg-white border-zinc-200 hover:border-primary transition-all group overflow-hidden shadow-sm hover:shadow-xl">
            {pkg.id === 'pro' && (
              <div className="absolute top-0 right-0 bg-primary px-3 py-1 text-[10px] uppercase font-bold text-white rounded-bl-lg">
                Popüler
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl text-zinc-900 font-bold">{pkg.name}</CardTitle>
              <CardDescription className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-black text-zinc-900">{pkg.price} TL</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex bg-zinc-50 p-4 rounded-2xl items-center gap-3 border border-zinc-100">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Zap className="text-primary w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-zinc-900">{pkg.credits} {t('credits')}</div>
                  <div className="text-xs text-zinc-500 font-medium">Kullanım sınırı yok</div>
                </div>
              </div>
              <ul className="space-y-3 pt-2">
                {['Gelişmiş AI Erişimi', '7/24 Destek', 'Hızlı Yanıt Süresi', 'Ömür Boyu Geçerli'].map(feature => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-zinc-600 font-medium">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-6 pt-2">
              <Button 
                onClick={() => handlePurchase(pkg, 'paytr')} 
                className="w-full h-12 bg-black hover:bg-zinc-800 text-white shadow-xl shadow-zinc-200/50 font-bold rounded-xl transition-all active:scale-[0.98]"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                {t('purchase')}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

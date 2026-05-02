import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Settings, ShieldCheck, Rocket } from 'lucide-react';

export function InstallWizard() {
  const [step, setStep] = useState(1);
  const [keys, setKeys] = useState({
    deepseek: '',
    paytrId: '',
    paytrKey: '',
    paytrSalt: ''
  });

  const next = () => setStep(s => s + 1);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black">
      <Card className="w-full max-w-lg bg-zinc-900/50 border-zinc-800 backdrop-blur-2xl">
        <CardHeader className="text-center p-8">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary animate-pulse">
            <Settings className="w-8 h-8" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Kurulum Sihirbazı</CardTitle>
          <CardDescription>CroopsAI platformuna hoş geldiniz. Hadi sistemi yapılandıralım.</CardDescription>
        </CardHeader>
        
        <CardContent className="p-8 pt-0">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">AI API Anahtarı</label>
                <Input 
                  placeholder="sk-..." 
                  value={keys.deepseek}
                  onChange={e => setKeys({...keys, deepseek: e.target.value})}
                  className="bg-zinc-950 border-zinc-800"
                />
              </div>
              <p className="text-xs text-zinc-500">
                Platformdan aldığınız anahtarı buraya girin. Bu anahtar AI servislerini çalıştırmak için gereklidir.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Merchant ID (PayTR)</label>
                  <Input 
                    placeholder="ID"
                    value={keys.paytrId}
                    onChange={e => setKeys({...keys, paytrId: e.target.value})}
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Merchant Key</label>
                  <Input 
                    placeholder="Key"
                    value={keys.paytrKey}
                    onChange={e => setKeys({...keys, paytrKey: e.target.value})}
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Merchant Salt</label>
                <Input 
                  placeholder="Salt"
                  value={keys.paytrSalt}
                  onChange={e => setKeys({...keys, paytrSalt: e.target.value})}
                  className="bg-zinc-950 border-zinc-800"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8 space-y-4 animate-in zoom-in duration-500">
              <ShieldCheck className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="text-xl font-bold">Her Şey Hazır!</h3>
              <p className="text-zinc-500 text-sm">Ayarlarınız kaydedildi. Artık yapay zeka ile sohbete başlayabilir ve ödeme alabilirsiniz.</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-8 pt-0 flex justify-between gap-4">
          {step < 3 ? (
            <>
              <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`h-1 rounded-full transition-all ${i === step ? 'w-8 bg-primary' : 'w-2 bg-zinc-800'}`} />
                ))}
              </div>
              <Button onClick={next} className="min-w-28 h-11">
                İleri
              </Button>
            </>
          ) : (
            <Button onClick={() => window.location.href = '/'} className="w-full h-11 flex gap-2">
              <Rocket className="w-4 h-4" /> CroopsAI'yı Başlat
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

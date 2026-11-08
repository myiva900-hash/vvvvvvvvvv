import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Check, 
  Copy, 
  Smartphone, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  PhoneCall,
  Clock,
  ExternalLink
} from 'lucide-react';

interface VipPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVipActivated?: () => void;
}

export const VipPaymentModal: React.FC<VipPaymentModalProps> = ({ 
  isOpen, 
  onClose,
  onVipActivated
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText('2238763').then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('0780949484').then(() => {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    });
  };

  const handleVerifyPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setActivating(true);
    setTimeout(() => {
      setActivating(false);
      setActivated(true);
      if (onVipActivated) onVipActivated();
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150 overflow-hidden">
        
        {/* Top Gradient Banner */}
        <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 text-slate-950 p-5 relative overflow-hidden shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 text-slate-950/70 hover:text-slate-950 rounded-full hover:bg-black/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shadow-lg border border-amber-300/40">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-black tracking-tight text-slate-950">
                  KWISHYURA VIP PREMIUM 👑
                </h3>
              </div>
              <p className="text-xs font-bold text-slate-900/90">
                Mutiganda Yvan VPN · High-Speed Tunneling
              </p>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-slate-800 dark:text-slate-100 text-xs">
          
          {/* Price Tag */}
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 block mb-0.5">
                Tarifu ya VIP / Package
              </span>
              <span className="text-base sm:text-lg font-extrabold text-amber-700 dark:text-amber-300">
                ⚡ 2000 FRW / 1 WEEK
              </span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] shadow-xs">
              7 DAYS UNLIMITED
            </div>
          </div>

          {/* Payment Credentials Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Amakuru yo Kwishyuriraho (MTN MoMo)</span>
            </div>

            {/* Merchant Code */}
            <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  MoMo Merchant Code
                </span>
                <span className="text-sm font-mono font-black text-amber-600 dark:text-amber-400">
                  CODE 2238763
                </span>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-[11px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Koporora'}</span>
              </button>
            </div>

            {/* Phone Number & Account Name */}
            <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Nimero ya MTN (Izina: Yvan Mutiganda)
                </span>
                <span className="text-sm font-mono font-black text-slate-900 dark:text-slate-100">
                  0780949484
                </span>
              </div>
              <button
                onClick={handleCopyPhone}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-[11px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPhone ? 'Copied' : 'Koporora'}</span>
              </button>
            </div>

            {/* USSD Dial Shortcut */}
            <a
              href="tel:*182*8*1*2238763*2000%23"
              className="w-full py-2 bg-amber-400 hover:bg-amber-500 active:scale-98 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Kanda Uce USSD (*182*8*1*2238763*2000#)</span>
            </a>
          </div>

          {/* Verification / Activation */}
          <form onSubmit={handleVerifyPayment} className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Shyiramo Transaction ID cyangwa Nimero wishyuriyeho:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={transactionId}
                onChange={e => setTransactionId(e.target.value)}
                placeholder="Urugero: MP261108... cyangwa 078..."
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-slate-100"
              />
              <button
                type="submit"
                disabled={activating || activated}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
              >
                {activated ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Yemejwe!</span>
                  </>
                ) : activating ? (
                  <span>Irimo kwemezwa...</span>
                ) : (
                  <span>EMEZA VIP</span>
                )}
              </button>
            </div>
            {activated && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold text-center mt-1">
                ✅ Konti yawe ya VIP yamaze gufungurwa! Ubu uri gukoresha Geo/VIP Node 01 (Rwanda, Kigali).
              </p>
            )}
          </form>

          {/* VIP Features list */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Ibyiza byo kwishyura VIP:</span>
            </div>
            <ul className="list-disc pl-5 space-y-0.5 text-[10px]">
              <li>Umuvuduko w'ikirenga (High-speed tunnel, 7ms latency muri Kigali).</li>
              <li>Amakuru adashira (Unlimited download & upload).</li>
              <li>Guhuza ako kanya nta gutegereza cyangwa guhagarara.</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ArrowRight, Home, Calendar } from 'lucide-react';
import { useVerifyPayment } from '../features/payments/hooks';
import Button from '../components/ui/Button';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get('reference') || searchParams.get('trxref');
  const { mutate: verifyPayment, isLoading, isError, data } = useVerifyPayment();
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  useEffect(() => {
    console.log('PaymentSuccess mounted. Reference:', reference);
    if (reference) {
      verifyPayment(
        { reference },
        {
          onSuccess: (res) => {
            console.log('Verification Success:', res.data);
            setStatus('success');
          },
          onError: (err) => {
            console.error('Verification Error:', err.response?.data || err.message);
            setStatus('error');
          },
        }
      );
    } else {
      setStatus('error');
    }
  }, [reference, verifyPayment]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-white">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {status === 'verifying' && (
          <div className="space-y-6">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping" />
              <div className="relative bg-white rounded-full p-6 shadow-xl border border-slate-100 flex items-center justify-center h-full w-full">
                <Loader2 className="w-10 h-10 text-accent animate-spin" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Verifying Payment</h1>
              <p className="text-slate-500 font-medium">Please wait while we confirm your transaction with Paystack...</p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-xl ring-1 ring-emerald-100">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payment Successful!</h1>
              <p className="text-slate-500 font-medium leading-relaxed">
                Your booking has been confirmed. You can now view it in your dashboard.
              </p>
            </div>
            <div className="pt-8 flex flex-col gap-4">
              <Button 
                onClick={() => navigate('/dashboard/bookings')}
                className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-lg"
              >
                Go to Dashboard <ArrowRight size={18} />
              </Button>
              <Link 
                to="/" 
                className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors flex items-center justify-center gap-2"
              >
                <Home size={14} /> Back to Home
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <div className="bg-rose-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-xl ring-1 ring-rose-100">
              <XCircle className="w-12 h-12 text-rose-500" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payment Verification Failed</h1>
              <p className="text-slate-500 font-medium leading-relaxed">
                We couldn't verify your payment reference. If you believe this is an error, please contact support.
              </p>
            </div>
            <div className="pt-8 flex flex-col gap-4">
              <Button 
                onClick={() => navigate('/dashboard/bookings')}
                variant="outline"
                className="w-full h-14 border-2 border-slate-200 text-slate-900 rounded-2xl font-black uppercase tracking-widest transition-all"
              >
                Return to Bookings
              </Button>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Reference: <span className="text-slate-600 Sele">{reference || 'Unknown'}</span>
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentSuccess;

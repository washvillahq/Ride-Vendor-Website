import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ArrowRight, Home } from 'lucide-react';
import api from '../lib/axios';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';

/**
 * PaymentSuccess page — shown after Paystack redirects back to the app.
 *
 * Uses simple local state instead of React Query useMutation to avoid
 * any timing/lifecycle edge-cases with React 19 concurrent mode.
 */
const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Paystack can pass reference as 'reference' OR 'trxref'
  const reference = searchParams.get('reference') || searchParams.get('trxref');

  // Simple state machine: 'idle' | 'pending' | 'success' | 'error'
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const verificationStarted = useRef(false);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    // Guard: no reference in URL → jump straight to error
    if (!reference) {
      console.warn('[PaymentSuccess] No reference found in URL params:', window.location.href);
      setStatus('error');
      setErrorMsg('No payment reference found in the URL.');
      return;
    }

    // Guard: wait for zustand auth store to hydrate before making authenticated requests
    if (!isHydrated) {
      console.log('[PaymentSuccess] Waiting for auth store hydration...');
      return;
    }

    // Guard: prevent double-fire (React StrictMode, fast refresh, etc.)
    if (verificationStarted.current) {
      console.warn('[PaymentSuccess] Verification already started — skipping duplicate call.');
      return;
    }
    verificationStarted.current = true;

    console.log('[PaymentSuccess] Starting verification for reference:', reference);
    setStatus('pending');

    api
      .post('/payments/verify', { reference })
      .then((data) => {
        // axios interceptor already unwraps to response.data (the JSON body)
        console.log('[PaymentSuccess] Verification SUCCESS:', data);
        setStatus('success');
      })
      .catch((err) => {
        console.error('[PaymentSuccess] Verification FAILED:', err);
        // err is the normalized error from the axios interceptor
        const msg =
          err?.message ||
          err?.data?.message ||
          'We could not verify your payment. Please contact support.';
        setErrorMsg(msg);
        setStatus('error');
      });
  }, [reference, isHydrated]);

  const isVerifying = status === 'idle' || status === 'pending';
  const isSuccess = status === 'success';
  const isError = status === 'error';

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-white">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* ── Verifying ── */}
        {isVerifying && (
          <div className="space-y-6">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping" />
              <div className="relative bg-white rounded-full p-6 shadow-xl border border-slate-100 flex items-center justify-center h-full w-full">
                <Loader2 className="w-10 h-10 text-accent animate-spin" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-medium text-slate-900 tracking-tight">Verifying Payment</h1>
              <p className="text-slate-500 font-medium">
                Please wait while we confirm your transaction with Paystack...
              </p>
            </div>
          </div>
        )}

        {/* ── Success ── */}
        {isSuccess && (
          <div className="space-y-6">
            <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-xl ring-1 ring-emerald-100">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-medium text-slate-900 tracking-tight">Payment Successful!</h1>
              <p className="text-slate-500 font-medium leading-relaxed">
                Your booking has been confirmed. You can now view it in your dashboard.
              </p>
            </div>
            <div className="pt-8 flex flex-col gap-4">
              <Button
                onClick={() => navigate('/dashboard/bookings')}
                className="w-full h-14 bg-slate-900 text-white rounded-2xl font-medium uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-lg"
              >
                Go to Dashboard <ArrowRight size={18} />
              </Button>
              <Link
                to="/"
                className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors flex items-center justify-center gap-2"
              >
                <Home size={14} /> Back to Home
              </Link>
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {isError && (
          <div className="space-y-6">
            <div className="bg-rose-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-xl ring-1 ring-rose-100">
              <XCircle className="w-12 h-12 text-rose-500" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-medium text-slate-900 tracking-tight">
                Payment Verification Failed
              </h1>
              <p className="text-slate-500 font-medium leading-relaxed">
                {errorMsg || "We couldn't verify your payment. If you believe this is an error, please contact support."}
              </p>
            </div>
            <div className="pt-8 flex flex-col gap-4">
              <Button
                onClick={() => navigate('/dashboard/bookings')}
                variant="outline"
                className="w-full h-14 border-2 border-slate-200 text-slate-900 rounded-2xl font-medium uppercase tracking-widest transition-all"
              >
                Return to Bookings
              </Button>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Reference: <span className="text-slate-600">{reference || 'Unknown'}</span>
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentSuccess;

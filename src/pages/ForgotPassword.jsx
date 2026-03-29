import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '../features/auth/schema';
import { useForgotPassword } from '../features/auth/hooks';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { mutate: forgotPassword, isPending: isLoading, isSuccess } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data) => {
    forgotPassword(data, {
      onSuccess: () => {
        // Success is handled by the hook
      },
    });
  };

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Back to login
        </button>

        {!isSuccess ? (
          <>
            <h2 className="text-4xl font-medium text-slate-900 tracking-tight">Forgot password?</h2>
            <p className="text-slate-500 font-medium tracking-tight">
              No worries! Enter your email address and we'll send you a link to reset your password.
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h2 className="text-4xl font-medium text-slate-900 tracking-tight text-center">Check your email</h2>
            <p className="text-slate-500 font-medium tracking-tight text-center">
              We've sent a password reset link to your email address.
            </p>
          </>
        )}
      </div>

      {!isSuccess ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            icon={<Mail size={18} className="text-slate-400" />}
            className="bg-[#F4F3F5] border-transparent focus:bg-white h-14"
            {...register('email')}
            error={errors.email}
          />

          <Button
            type="submit"
            variant="accent"
            size="xl"
            className="w-full rounded-2xl transition-all hover:scale-[1.02] active:scale-95"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <p className="text-sm text-blue-800">
              <strong>Didn't receive the email?</strong> Check your spam folder or try another email address.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="xl"
            className="w-full rounded-2xl"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </Button>
        </div>
      )}

      <div className="text-center pt-4">
        <p className="text-sm font-medium text-slate-400">
          Remember your password?{' '}
          <Link to="/login" className="text-[#002E3E] border-b-2 border-accent pb-0.5 hover:text-accent transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

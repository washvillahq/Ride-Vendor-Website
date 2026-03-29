import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '../features/auth/schema';
import { useResetPassword } from '../features/auth/hooks';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const { mutate: resetPassword, isPending: isLoading, isSuccess } = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data) => {
    resetPassword({ token, password: data.password }, {
      onSuccess: () => {
        // Success handled by hook
      },
    });
  };

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        {!isSuccess ? (
          <>
            <h2 className="text-4xl font-medium text-slate-900 tracking-tight">Reset password</h2>
            <p className="text-slate-500 font-medium tracking-tight">
              Enter your new password below.
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h2 className="text-4xl font-medium text-slate-900 tracking-tight text-center">Password reset successful!</h2>
            <p className="text-slate-500 font-medium tracking-tight text-center">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
          </>
        )}
      </div>

      {!isSuccess ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            icon={<Lock size={18} className="text-slate-400" />}
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-accent focus:outline-none transition-colors"
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            className="bg-[#F4F3F5] border-transparent focus:bg-white h-14"
            {...register('password')}
            error={errors.password}
          />

          <Input
            label="Confirm New Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            icon={<Lock size={18} className="text-slate-400" />}
            suffix={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="hover:text-accent focus:outline-none transition-colors"
                tabIndex="-1"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            className="bg-[#F4F3F5] border-transparent focus:bg-white h-14"
            {...register('confirmPassword')}
            error={errors.confirmPassword}
          />

          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wider">Password Requirements:</p>
            <ul className="text-xs text-slate-500 space-y-1">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                At least 8 characters long
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                At least one uppercase letter
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                At least one lowercase letter
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                At least one number
              </li>
            </ul>
          </div>

          <Button
            type="submit"
            variant="accent"
            size="xl"
            className="w-full rounded-2xl transition-all hover:scale-[1.02] active:scale-95"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      ) : (
        <Button
          type="button"
          variant="accent"
          size="xl"
          className="w-full rounded-2xl"
          onClick={() => navigate('/login')}
        >
          Go to Login
        </Button>
      )}
    </div>
  );
};

export default ResetPasswordPage;

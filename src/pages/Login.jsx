import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../features/auth/schema';
import { useLogin } from '../features/auth/hooks';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending: isLoading } = useLogin();
  const [searchParams] = useSearchParams();
  const isExpired = searchParams.get('expired') === 'true';
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    login(data);
  };

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        {isExpired && (
          <div className="bg-[#1A2B3D] border border-white/10 rounded-2xl p-4 flex items-center gap-3 mb-6 animate-in slide-in-from-top-2 duration-500">
            <AlertCircle className="text-accent shrink-0" size={18} />
            <p className="text-[11px] font-bold text-white uppercase tracking-widest">
              Session Expired. Please sign in again.
            </p>
          </div>
        )}
        <h2 className="text-4xl font-medium text-slate-900 tracking-tight">Welcome back</h2>
        <p className="text-slate-500 font-medium tracking-tight">Access your curated showroom dashboard.</p>
      </div>

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
        <div className="space-y-1">
          <Input
            label="Password"
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
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-xs font-medium uppercase tracking-widest text-[#785900] hover:text-accent transition-colors"
            >
              Forgot password?
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="accent"
          size="xl"
          className="w-full rounded-2xl transition-all hover:scale-[1.02] active:scale-95"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Sign In
        </Button>
      </form>

      <div className="text-center pt-4">
        <p className="text-sm font-medium text-slate-400">
          New here? <Link to="/register" className="text-[#002E3E] border-b-2 border-accent pb-0.5 hover:text-accent transition-colors">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

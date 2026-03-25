import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../features/auth/schema';
import { useLogin } from '../features/auth/hooks';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock } from 'lucide-react';

const LoginPage = () => {
  const { mutate: login, isPending: isLoading } = useLogin();

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
        <h2 className="text-4xl font-medium text-slate-900 tracking-tight">Welcome back</h2>
        <p className="text-slate-500 font-medium">Access your curated showroom dashboard.</p>
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
            type="password"
            placeholder="••••••••"
            icon={<Lock size={18} className="text-slate-400" />}
            className="bg-[#F4F3F5] border-transparent focus:bg-white h-14"
            {...register('password')}
            error={errors.password}
          />
          <div className="flex justify-end">
            <Link to="/forgot-password" size="sm" className="text-xs font-meduim  uppercase tracking-widest text-[#785900] hover:text-accent transition-colors">
              Forgot password?
            </Link>
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

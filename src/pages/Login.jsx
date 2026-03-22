import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../features/auth/schema';
import { useLogin } from '../features/auth/hooks';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const LoginPage = () => {
  const { mutate: login, isLoading } = useLogin();
  
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
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          {...register('email')}
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          error={errors.password}
        />
        <Button
          type="submit"
          className="w-full h-12 rounded-xl font-bold"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Sign In
        </Button>
      </form>
      <div className="text-center text-sm">
        <span className="text-slate-500">Don't have an account? </span>
        <a href="/register" className="font-bold hover:underline">Sign up</a>
      </div>
    </div>
  );
};

export default LoginPage;

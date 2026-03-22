import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../features/auth/schema';
import { useRegister } from '../features/auth/hooks';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const RegisterPage = () => {
  const { mutate: registerUser, isLoading } = useRegister();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data) => {
    // Backend expects specific fields, confirmPassword is only for client-side
    const { confirmPassword, ...submitData } = data;
    registerUser(submitData);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="John Doe"
          {...register('name')}
          error={errors.name}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          {...register('email')}
          error={errors.email}
        />
        <Input
          label="Phone Number"
          placeholder="+234..."
          {...register('phone')}
          error={errors.phone}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          error={errors.password}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword')}
          error={errors.confirmPassword}
        />
        <Button 
          type="submit" 
          className="w-full h-12 rounded-xl font-bold" 
          isLoading={isLoading}
          disabled={isLoading}
        >
          Create Account
        </Button>
      </form>
      <div className="text-center text-sm">
        <span className="text-slate-500">Already have an account? </span>
        <a href="/login" className="font-bold hover:underline">Sign in</a>
      </div>
    </div>
  );
};

export default RegisterPage;

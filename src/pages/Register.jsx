import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../features/auth/schema';
import { useRegister } from '../features/auth/hooks';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { User, Mail, Phone, Lock } from 'lucide-react';

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
    registerUser(data);
  };

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Create your account</h2>
        <p className="text-slate-500 font-medium tracking-tight">Create an account to start your acquisition journey.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          icon={<User size={18} className="text-slate-400" />}
          className="bg-slate-50 border-transparent focus:bg-white h-14"
          {...register('name')}
          error={errors.name}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          icon={<Mail size={18} className="text-slate-400" />}
          className="bg-slate-50 border-transparent focus:bg-white h-14"
          {...register('email')}
          error={errors.email}
        />
        <Input
          label="Phone Number"
          placeholder="+234 000 000 0000"
          icon={<Phone size={18} className="text-slate-400" />}
          className="bg-slate-50 border-transparent focus:bg-white h-14"
          {...register('phone')}
          error={errors.phone}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={<Lock size={18} className="text-slate-400" />}
          className="bg-slate-50 border-transparent focus:bg-white h-14"
          {...register('password')}
          error={errors.password}
        />
        
        <div className="pt-4">
          <Button 
            type="submit" 
            variant="accent"
            size="xl"
            className="w-full rounded-2xl transition-all hover:scale-[1.02] active:scale-95" 
            isLoading={isLoading}
            disabled={isLoading}
          >
            Create Account
          </Button>
        </div>
      </form>

      <div className="text-center pt-2">
        <p className="text-sm font-bold text-slate-400">
          Already have an account? <Link to="/login" className="text-[#002E3E] border-b-2 border-accent pb-0.5 hover:text-accent transition-colors">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

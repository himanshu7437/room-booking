import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success('Login successful!');
      
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex text-gray-900 bg-white">
      {/* Left section - Branding/Image */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:items-center bg-indigo-600 p-12 relative overflow-hidden">
        {/* Background decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="2" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-lg">
          <div className="mx-auto bg-white/10 w-20 h-20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-xl mb-8 border border-white/20">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Hotel Admin System</h1>
          <p className="text-lg text-indigo-100 leading-relaxed">
            Manage your bookings, rooms, and events efficiently with our comprehensive dashboard solution.
          </p>
        </div>
      </div>

      {/* Right section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-gray-50 lg:bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden mx-auto bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-6">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please enter your details to sign in.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
            <div className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder="admin@hotel.com"
                className="bg-white"
              />
              
              <Input
                label="Password"
                type="password"
                {...register('password')}
                error={errors.password?.message}
                placeholder="••••••••"
                className="bg-white"
              />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 border-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <Button type="submit" className="w-full py-2.5 text-base" isLoading={isSubmitting}>
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

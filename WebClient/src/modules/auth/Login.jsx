import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FormInput } from '@/components/forms/FormInput';
import { useLoginMutation } from '../../store/apis/authApi';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials } from '../../store/authSlice';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '../../contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
  rememberMe: z.boolean().optional()
});

function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { login: authContextLogin } = useAuth();
  const [login, { isLoading }] = useLoginMutation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data) => {
    try {
      const response = await login({ email: data.email, matKhau: data.password }).unwrap();
      dispatch(setCredentials({
        token: response.token,
        user: response.user
      }));
      authContextLogin(response.token, response.user);
      
      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn quay trở lại EZTravel!"
      });

      const role = response.user.role?.toString().toUpperCase();
      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (role === 'PROVIDER' || role === 'SERVICEPROVIDER' || role === 'PROVIDER_APPROVED') {
        navigate('/provider/dashboard');
      } else if (role === 'PROVIDER_PENDING') {
        navigate('/provider/pending');
      } else {
        navigate('/');
      }
    } catch (err) {
      toast({
        title: "Đăng nhập thất bại",
        description: err?.data?.message || 'Email hoặc mật khẩu không chính xác',
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full border border-border shadow-lg bg-card text-card-foreground">
      <CardHeader className="space-y-1.5 p-6 sm:p-8">
        <CardTitle className="text-2xl font-bold tracking-tight text-heading">Đăng nhập</CardTitle>
        <CardDescription>
          Chào mừng trở lại! Vui lòng đăng nhập vào tài khoản của bạn.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 sm:p-8 pt-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-4">
            <FormInput
              id="email"
              label="Email"
              error={errors.email}
              startIcon={<Mail className="h-5 w-5 text-muted-foreground" />}
            >
              <Input
                type="text"
                placeholder="name@example.com"
                className="h-12"
                {...register('email')}
              />
            </FormInput>

            <FormInput
              id="password"
              label={
                <div className="flex items-center justify-between w-full">
                  <span>Mật khẩu</span>
                  <Link to="/auth/forgot-password" className="text-sm font-medium text-primary hover:underline">
                    Quên mật khẩu?
                  </Link>
                </div>
              }
              error={errors.password}
              startIcon={<Lock className="h-5 w-5 text-muted-foreground" />}
              endElement={
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground focus:outline-none flex items-center justify-center"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              }
            >
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="h-12"
                {...register('password')}
              />
            </FormInput>
          </div>

          <div className="flex items-center gap-2 pt-1 select-none">
            <Checkbox id="rememberMe" {...register('rememberMe')} className="cursor-pointer" />
            <Label
              htmlFor="rememberMe"
              className="text-sm font-medium text-muted-foreground cursor-pointer select-none leading-none">
              Ghi nhớ đăng nhập
            </Label>
          </div>

          <Button type="submit" className="mt-2 h-12 w-full text-base font-semibold" disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground uppercase font-semibold tracking-wider">Hoặc tiếp tục với</span>
            </div>
          </div>

          <Button type="button" variant="outline" className="flex h-12 w-full items-center justify-center gap-2 text-base font-medium">
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.369 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.109 -17.884 43.989 -14.754 43.989 Z" />
              </g>
            </svg>
            Đăng nhập bằng Google
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link to="/auth/register" className="font-semibold text-primary hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default Login;

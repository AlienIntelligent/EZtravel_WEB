import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle2, ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FormInput } from '@/components/forms/FormInput';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useRegisterMutation } from '../../store/apis/authApi';

// Step Schemas
const step1Schema = z.object({
  name: z.string()
    .min(1, 'Họ tên không hợp lệ')
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, 'Họ tên không hợp lệ'),
  email: z.string().min(1, 'Vui lòng nhập email').email('Email không hợp lệ')
});

const step2Schema = z.object({
  password: z.string()
    .min(1, 'Mật khẩu là bắt buộc')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa')
    .regex(/[a-z]/, 'Mật khẩu phải chứa ít nhất 1 chữ cái viết thường')
    .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 chữ số'),
  confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"]
});

const step3Schema = z.object({
  phone: z.string()
    .optional()
    .refine((val) => !val || /^(0[3|5|7|8|9])+([0-9]{8})\b$/.test(val), {
      message: "Số điện thoại không hợp lệ"
    }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Bạn phải đồng ý với Điều khoản dịch vụ"
  })
});

export default function Register() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Custom states for checking username availability (stubbed check)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const [registerUser, { isLoading: isRegistering }] = useRegisterMutation();

  const { register, handleSubmit, trigger, watch, formState: { errors } } = useForm({
    resolver: zodResolver(
      step === 1 ? step1Schema :
      step === 2 ? step2Schema :
      step3Schema
    ),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      acceptTerms: false
    },
    mode: 'onChange'
  });

  const passwordValue = watch('password') || '';
  const emailValue = watch('email') || '';

  // Trigger availability stub when typing email
  const handleEmailChange = async () => {
    if (!errors.email && emailValue.includes('@')) {
      setIsCheckingUsername(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      setIsCheckingUsername(false);
      setUsernameAvailable(true);
    } else {
      setUsernameAvailable(false);
    }
  };

  const handleNext = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger(['name', 'email']);
    } else if (step === 2) {
      isValid = await trigger(['password', 'confirmPassword']);
    }
    
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (data) => {
    if (step < 3) {
      handleNext();
      return;
    }
    
    try {
      const response = await registerUser({
        hoTen: data.name,
        email: data.email,
        matKhau: data.password,
        soDienThoai: data.phone || undefined
      }).unwrap();
      const devOtp = response?.data?.devOtp || response?.data?.DevOtp || response?.devOtp || response?.DevOtp;

      toast({
        title: "Đăng ký thành công",
        description: "Mã OTP kích hoạt tài khoản đã được gửi qua email của bạn."
      });

      // Redirect to OTP Verification page with email in query string and state
      navigate(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`, {
        state: { email: data.email, type: 'register', devOtp }
      });
    } catch (err) {
      toast({
        title: "Đăng ký thất bại",
        description: err?.data?.message || "Đăng ký thất bại. Email có thể đã tồn tại.",
        variant: "destructive"
      });
    }
  };

  // Password strength calculation helper
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'Chưa nhập', color: 'bg-muted', text: 'text-muted-foreground' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    
    if (score === 1) return { score, label: 'Yếu', color: 'bg-danger', text: 'text-danger' };
    if (score === 2) return { score, label: 'Trung bình', color: 'bg-warning', text: 'text-warning' };
    if (score === 3) return { score, label: 'Khá', color: 'bg-blue-500', text: 'text-blue-500' };
    return { score, label: 'Mạnh', color: 'bg-success', text: 'text-success' };
  };

  const strength = getPasswordStrength(passwordValue);
  const score = strength.score;

  function PasswordStrength({ password }) {
    if (password.length === 0) return null;
    return (
      <div className="mt-3 animate-in fade-in duration-200">
        <div className="flex gap-1 h-1.5 w-full mb-1">
          <div className={`flex-1 rounded-full ${score >= 1 ? strength.color : 'bg-muted'}`} />
          <div className={`flex-1 rounded-full ${score >= 2 ? strength.color : 'bg-muted'}`} />
          <div className={`flex-1 rounded-full ${score >= 3 ? strength.color : 'bg-muted'}`} />
          <div className={`flex-1 rounded-full ${score >= 4 ? strength.color : 'bg-muted'}`} />
        </div>
        <p className={`text-xs font-semibold text-right ${strength.text}`}>{strength.label}</p>
      </div>
    );
  }

  return (
    <Card className="w-full border border-border shadow-lg bg-card text-card-foreground">
      <CardHeader className="space-y-1.5 p-6 sm:p-8">
        <CardTitle className="text-2xl font-bold tracking-tight text-heading">Đăng ký tài khoản</CardTitle>
        <CardDescription>
          Bắt đầu hành trình khám phá Việt Nam cùng EZTravel.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 sm:p-8 pt-0">
        {/* Progress Indicator */}
        <div className="mb-6 px-2">
          <div className="flex items-center justify-between relative z-0">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-muted -z-10"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary transition-all duration-300 -z-10" style={{ width: `${(step - 1) / 2 * 100}%` }}></div>
            
            {[1, 2, 3].map((num) => (
              <div key={num} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 relative z-10 ${
                step > num ? 'bg-primary text-primary-foreground' :
                step === num ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' :
                'bg-muted text-muted-foreground'}`}
              >
                {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs font-medium text-muted-foreground">
            <span>Thông tin</span>
            <span>Bảo mật</span>
            <span>Hoàn tất</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 min-h-[260px] flex flex-col justify-between">
          {/* Step 1: Info */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <FormInput
                id="name"
                label="Họ và tên"
                error={errors.name}
                startIcon={<User className="h-5 w-5 text-muted-foreground" />}
              >
                <Input
                  placeholder="Nguyễn Văn A"
                  className="h-12"
                  {...register('name')}
                />
              </FormInput>

              <FormInput
                id="email"
                label="Email"
                error={errors.email}
                startIcon={<Mail className="h-5 w-5 text-muted-foreground" />}
                endElement={
                  usernameAvailable ? (
                    <ShieldCheck className="h-5 w-5 text-success" />
                  ) : null
                }
              >
                <Input
                  type="text"
                  placeholder="name@example.com"
                  className="h-12"
                  {...register('email', { onChange: handleEmailChange })}
                />
              </FormInput>
              {isCheckingUsername && <p className="text-xs text-muted-foreground -mt-2">Đang kiểm tra email...</p>}
            </div>
          )}

          {/* Step 2: Security */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <FormInput
                  id="password"
                  label="Mật khẩu"
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
                <PasswordStrength password={passwordValue} />
              </div>

              <FormInput
                id="confirmPassword"
                label="Xác nhận mật khẩu"
                error={errors.confirmPassword}
                startIcon={<Lock className="h-5 w-5 text-muted-foreground" />}
                endElement={
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground focus:outline-none flex items-center justify-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                }
              >
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="h-12"
                  {...register('confirmPassword')}
                />
              </FormInput>
            </div>
          )}

          {/* Step 3: Finish */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <FormInput
                id="phone"
                label="Số điện thoại (Tùy chọn)"
                error={errors.phone}
                startIcon={<Phone className="h-5 w-5 text-muted-foreground" />}
              >
                <Input
                  placeholder="0912345678"
                  className="h-12"
                  {...register('phone')}
                />
              </FormInput>

              <div className="space-y-2 pt-2">
                <div className="flex items-start gap-2">
                  <Checkbox id="acceptTerms" {...register('acceptTerms')} className="mt-0.5 cursor-pointer" />
                  <Label
                    htmlFor="acceptTerms"
                    className="text-xs leading-normal text-muted-foreground cursor-pointer select-none">
                    Tôi đồng ý với các <a href="#" className="text-primary hover:underline font-medium">Điều khoản dịch vụ</a> và <a href="#" className="text-primary hover:underline font-medium">Chính sách bảo mật</a> của EZTravel.
                  </Label>
                </div>
                {errors.acceptTerms && <p className="text-sm text-danger font-medium mt-1">{errors.acceptTerms.message}</p>}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-12 pt-24">
            {step > 1 && (
              <Button type="button" variant="outline" className="h-12 px-6" onClick={handleBack}>
                <ChevronLeft className="w-16 h-16 mr-8" />
                Quay lại
              </Button>
            )}
            
            {step < 3 ? (
              <Button type="button" className="h-12 flex-1" onClick={handleNext}>
                Tiếp tục
                <ChevronRight className="w-16 h-16 ml-8" />
              </Button>
            ) : (
              <Button type="submit" className="h-12 flex-1" disabled={isRegistering}>
                {isRegistering ? 'Đang tạo...' : 'Hoàn tất đăng ký'}
              </Button>
            )}
          </div>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Đã có tài khoản?{" "}
          <Link to="/auth/login" className="font-semibold text-primary hover:underline">
            Đăng nhập
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

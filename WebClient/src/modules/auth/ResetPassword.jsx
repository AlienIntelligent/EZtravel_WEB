import { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormInput } from '@/components/forms/FormInput';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useResetPasswordMutation } from '../../store/apis/authApi';

const resetSchema = z.object({
 password: z.string()
 .min(1, 'Mật khẩu chưa đạt yêu cầu')
 .min(8, 'Mật khẩu chưa đạt yêu cầu')
 .regex(/[A-Z]/, 'Mật khẩu chưa đạt yêu cầu')
 .regex(/[a-z]/, 'Mật khẩu chưa đạt yêu cầu')
 .regex(/[0-9]/, 'Mật khẩu chưa đạt yêu cầu'),
 confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc')
}).refine((data) => data.password === data.confirmPassword, {
 message: "Mật khẩu xác nhận không khớp",
 path: ["confirmPassword"]
});

export default function ResetPassword() {
 const navigate = useNavigate();
 const location = useLocation();
 const { toast } = useToast();
 const [resetPassword, { isLoading }] = useResetPasswordMutation();
 const [showPassword, setShowPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);

 // Parse email and code from query parameters
 const queryParams = new URLSearchParams(location.search);
 const email = queryParams.get('email') || '';
 const code = queryParams.get('code') || '';

 const { register, handleSubmit, watch, formState: { errors } } = useForm({
 resolver: zodResolver(resetSchema),
 defaultValues: {
 password: '',
 confirmPassword: ''
 }
 });

 const passwordValue = watch('password') || '';

 const onSubmit = async (data) => {
 if (!email || !code) {
 toast({
 title: "Lỗi yêu cầu",
 description: "Thiếu thông tin email hoặc mã xác thực.",
 variant: "destructive"
 });
 return;
 }

 try {
 await resetPassword({
 email,
 code,
 newPassword: data.password
 }).unwrap();

 toast({
 title: "Đặt lại mật khẩu thành công",
 description: "Mật khẩu của bạn đã được cập nhật. Vui lòng đăng nhập bằng mật khẩu mới."
 });
 navigate('/auth/login');
 } catch (err) {
 toast({
 title: "Đặt lại mật khẩu thất bại",
 description: err?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.",
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

 const rules = [
 { label: "Tối thiểu 8 ký tự", regex: /.{8,}/ },
 { label: "Ít nhất 1 chữ hoa", regex: /[A-Z]/ },
 { label: "Ít nhất 1 chữ thường", regex: /[a-z]/ },
 { label: "Ít nhất 1 chữ số", regex: /[0-9]/ }
 ];

 return (
 <Card className="w-full border border-border shadow-lg bg-card text-card-foreground">
 <CardHeader className="space-y-1.5 p-6 sm:p-8">
 <CardTitle className="text-2xl font-bold tracking-tight text-heading">Đặt lại mật khẩu</CardTitle>
 <CardDescription>
 Nhập mật khẩu mới của bạn bên dưới để hoàn tất việc khôi phục tài khoản.
 </CardDescription>
 </CardHeader>

 <CardContent className="p-6 sm:p-8 pt-0">
 <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
 <div className="space-y-2">
 <FormInput
 id="password"
 label="Mật khẩu mới"
 error={errors.password}
 startIcon={<Lock className="h-5 w-5 text-muted-foreground" />}
 endElement={
 <button
 type="button"
 className="text-muted-foreground hover:text-foreground focus:outline-none flex items-center justify-center"
 onClick={() => setShowPassword(!showPassword)}
 disabled={isLoading}
 >
 {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
 </button>
 }
 >
 <Input
 type={showPassword ? 'text' : 'password'}
 placeholder="••••••••"
 className="h-12"
 {...register('password')}
 disabled={isLoading}
 />
 </FormInput>
 
 {/* Password Strength Meter */}
 {passwordValue.length > 0 && (
 <div className="mt-3 animate-in fade-in duration-200">
 <div className="flex gap-1 h-1.5 w-full mb-1">
 <div className={`flex-1 rounded-full ${score >= 1 ? strength.color : 'bg-muted'}`} />
 <div className={`flex-1 rounded-full ${score >= 2 ? strength.color : 'bg-muted'}`} />
 <div className={`flex-1 rounded-full ${score >= 3 ? strength.color : 'bg-muted'}`} />
 <div className={`flex-1 rounded-full ${score >= 4 ? strength.color : 'bg-muted'}`} />
 </div>
 <p className={`text-xs font-semibold text-right ${strength.text}`}>{strength.label}</p>
 </div>
 )}

 {/* Live Validation Rules */}
 <div className="mt-4 grid grid-cols-2 gap-2 text-xs p-3 bg-muted/30 rounded-xl border border-border/50">
 {rules.map((rule, idx) => {
 const isValid = rule.regex.test(passwordValue);
 return (
 <div key={idx} className={`flex items-center gap-1.5 transition-colors duration-200 ${isValid ? 'text-success' : 'text-muted-foreground font-medium'}`}>
 {isValid ? <CheckCircle2 className="w-16 h-16 text-success" /> : <XCircle className="w-16 h-16 text-muted-foreground " />}
 <span>{rule.label}</span>
 </div>
 );
 })}
 </div>
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
 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
 disabled={isLoading}
 >
 {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
 </button>
 }
 >
 <Input
 type={showConfirmPassword ? 'text' : 'password'}
 placeholder="••••••••"
 className="h-12"
 {...register('confirmPassword')}
 disabled={isLoading}
 />
 </FormInput>

 <Button type="submit" className="mt-4 h-12 w-full text-base font-semibold" disabled={isLoading}>
 {isLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
 </Button>
 </form>
 </CardContent>
 </Card>
 );
}

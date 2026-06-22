import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormInput } from '@/components/forms/FormInput';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useForgotPasswordMutation } from '../../store/apis/authApi';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [devOtp, setDevOtp] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setEmailError("Vui lòng nhập email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Email không hợp lệ");
      return;
    }
    setEmailError('');

    try {
      const response = await forgotPassword({ email }).unwrap();
      setDevOtp(response?.devOtp || response?.DevOtp || '');
      toast({
        title: "Yêu cầu thành công",
        description: "Mã xác thực đã được gửi đến email của bạn."
      });
      setIsSubmitted(true);
    } catch (err) {
      toast({
        title: "Yêu cầu thất bại",
        description: err?.data?.message || "Không thể gửi mã xác nhận. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full border border-border shadow-lg bg-card text-card-foreground">
      <CardHeader className="space-y-1.5 p-6 sm:p-8">
        <Link to="/auth/login" className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors w-fit">
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Quay lại đăng nhập
        </Link>
        <CardTitle className="text-2xl font-bold tracking-tight text-heading">Quên mật khẩu?</CardTitle>
        <CardDescription>
          Đừng lo lắng! Nhập email của bạn và chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 sm:p-8 pt-0">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              id="email"
              label="Email đăng ký"
              error={emailError}
              startIcon={<Mail className="h-5 w-5 text-muted-foreground" />}
            >
              <Input
                type="text"
                placeholder="name@example.com"
                className="h-12"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                disabled={isLoading}
              />
            </FormInput>

            <Button type="submit" className="mt-4 h-12 w-full text-base font-semibold" disabled={isLoading}>
              {isLoading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
            </Button>
          </form>
        ) : (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="p-4 bg-success/10 border border-success/20 rounded-xl">
              <p className="text-sm text-success font-medium flex items-start gap-2 leading-relaxed">
                <Mail className="w-5 h-5 shrink-0 mt-0.5" />
                <span>
                  Chúng tôi đã gửi một mã xác nhận gồm 6 chữ số đến email <strong>{email}</strong>. Vui lòng kiểm tra hộp thư đến hoặc thư rác.
                </span>
              </p>
            </div>
            {devOtp && (
              <div className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
                Mã OTP dev: {devOtp}
              </div>
            )}
            <Button 
              className="h-12 w-full" 
              onClick={() => navigate(`/auth/verify-otp?email=${encodeURIComponent(email)}&type=reset`, { state: { email, type: 'reset', devOtp } })}>
              Nhập mã xác nhận
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

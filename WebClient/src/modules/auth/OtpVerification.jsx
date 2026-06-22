import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useVerifyOtpMutation, useResendOtpMutation } from '../../store/apis/authApi';

export default function OtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse email from query parameter or state
  const queryParams = new URLSearchParams(location.search);
  const emailParam = queryParams.get('email');
  const email = emailParam || location.state?.email || 'your-email@example.com';
  const flowType = queryParams.get('type') || location.state?.type || 'register';
  const isPasswordReset = flowType === 'reset';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [cooldown, setCooldown] = useState(60);
  const [devOtp, setDevOtp] = useState(location.state?.devOtp || '');
  const inputRefs = useRef([]);
  const { toast } = useToast();

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (index, value) => {
    if (isNaN(Number(value))) return;
    if (otpError) setOtpError('');

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Auto previous on backspace if empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    if (otpError) setOtpError('');
    const pastedData = e.clipboardData.getData('text').slice(0, 6).replace(/[^0-9]/g, '');
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      // Focus on the next empty input or the last one
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setOtpError("Mã OTP phải gồm 6 chữ số");
      return;
    }
    setOtpError('');
    
    try {
      const response = await verifyOtp({ email, code: otpValue, type: flowType }).unwrap();
      toast({
        title: "Xác thực thành công",
        description: "Tài khoản của bạn đã được kích hoạt. Vui lòng đăng nhập."
      });
      if (isPasswordReset) {
        navigate(response?.resetUrl || `/auth/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(otpValue)}`);
      } else {
        navigate('/auth/login');
      }
    } catch (err) {
      toast({
        title: "Xác thực thất bại",
        description: err?.data?.message || 'Mã xác thực không chính xác hoặc đã hết hạn',
        variant: "destructive"
      });
    }
  };

  const handleResend = async () => {
    try {
      const response = await resendOtp({ email, type: flowType }).unwrap();
      setDevOtp(response?.devOtp || response?.DevOtp || '');
      toast({
        title: "Gửi lại OTP thành công",
        description: "Mã xác thực mới đã được gửi đến email của bạn."
      });
      setCooldown(60);
      setOtpError('');
    } catch (err) {
      toast({
        title: "Không thể gửi lại OTP",
        description: err?.data?.message || 'Vui lòng thử lại sau',
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full border border-border shadow-lg bg-card text-card-foreground">
      <CardHeader className="space-y-1.5 p-6 sm:p-8">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors w-fit"
        >
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Quay lại
        </button>
        <CardTitle className="text-2xl font-bold tracking-tight text-heading">Xác minh email</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Chúng tôi đã gửi mã xác thực gồm 6 chữ số đến email <br />
          <strong className="text-foreground">{email}</strong>
        </CardDescription>
        {devOtp && (
          <div className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
            Mã OTP dev: {devOtp}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-6 sm:p-8 pt-0">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex justify-center gap-2 py-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="h-12 w-12 rounded-xl border-2 border-slate-300 bg-background text-center text-lg font-bold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 sm:h-14 sm:w-14 sm:text-2xl dark:border-slate-700"
                autoFocus={index === 0}
              />
            ))}
          </div>
          {otpError && (
            <p className="text-sm text-danger mt-1 text-center font-medium">{otpError}</p>
          )}

          <div className="flex items-center justify-between text-xs sm:text-sm pt-2">
            {cooldown > 0 ? (
              <div className="flex items-center text-warning font-medium">
                <Timer className="w-16 h-16 mr-8" />
                Gửi lại mã trong {cooldown}s
              </div>
            ) : (
              <div className="flex items-center text-success font-medium">
                Sẵn sàng gửi lại
              </div>
            )}
            <button
              type="button"
              className="text-primary hover:underline font-semibold disabled:opacity-50 disabled:no-underline"
              disabled={cooldown > 0 || isResending}
              onClick={handleResend}>
              {isResending ? 'Đang gửi...' : 'Gửi lại mã'}
            </button>
          </div>

          <Button
            type="submit"
            className="mt-4 h-12 w-full text-base font-semibold"
            disabled={isVerifying}>
            {isVerifying ? 'Đang xác nhận...' : 'Xác nhận'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

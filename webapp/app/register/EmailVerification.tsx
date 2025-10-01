"use client";

import { Constant } from '@/configs/constant';
import { useAuth } from '@/contexts/AuthContext';
import React, { useState, useRef, useEffect } from 'react';

interface EmailVerificationProps {
  email: string;
  error?: string;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  error
}) => {

  const { verifyCode } = useAuth();
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-verify when all digits are entered
  useEffect(() => {
    const code = digits.join('');
    if (code.length === 6 && !code.includes('')) {
      setIsVerifying(true);
    }
  }, [digits, verifyCode]);

  const handleDigitChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const pastedDigits = text.replace(/\D/g, '').slice(0, 6);
        const newDigits = [...digits];
        for (let i = 0; i < pastedDigits.length && i < 6; i++) {
          newDigits[i] = pastedDigits[i];
        }
        setDigits(newDigits);

        // Focus the next empty input or the last one
        const nextIndex = Math.min(pastedDigits.length, 5);
        inputRefs.current[nextIndex]?.focus();
      });
    }
  };

  const handleVerify = async () => {
    try {
      setIsVerifying(true);
      const verifyCodeResponse = await verifyCode({
        registerSessionId: localStorage.getItem(Constant.REGISTER_SESSION_ID_KEY) || '',
        sixDigitsCode: digits.join('')
      })
      if (verifyCodeResponse) {
      } else {
        throw new Error('Verify code failed');
      }   
    }
    catch (error) {
      console.error('Verify code failed:', error);
    }
    finally {
      setIsVerifying(false);
    }
  };

  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split('@');
    const maskedLocal = localPart.length > 2
      ? localPart.slice(0, 2) + '*'.repeat(localPart.length - 2)
      : localPart;
    return `${maskedLocal}@${domain}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Xác thực Email</h1>
          <p className="text-gray-600 text-sm">
            Chúng tôi đã gửi mã xác thực 6 chữ số đến
          </p>
          <p className="text-blue-600 font-medium mt-1">{maskEmail(email)}</p>
        </div>

        {/* Verification Code Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
            Nhập mã xác thực
          </label>

          <div className="flex justify-center gap-3 mb-4">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                disabled={isVerifying}
              />
            ))}
          </div>

          {error && (
            <div className="text-center">
              <p className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                {error}
              </p>
            </div>
          )}

          {isVerifying && (
            <div className="text-center">
              <div className="inline-flex items-center text-blue-600 text-sm">
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></span>
                Đang xác thực...
              </div>
            </div>
          )}
        </div>

        {/* Send */}
        <div className="text-center mb-6">
          <button
            onClick={handleVerify}
            disabled={countdown > 0 || isVerifying}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Xác nhận
          </button>

          <p className="text-gray-500 text-xs mt-2">
            Không nhận được mã? Kiểm tra hộp thư spam hoặc <a href='#' className='underline'>Gửi lại mã</a>
          </p>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-700 mb-2">Lưu ý:</h3>
          <ul className="text-xs text-blue-600 space-y-1">
            <li>• Mã xác thực có hiệu lực trong 5 phút</li>
            <li>• Kiểm tra cả hộp thư spam nếu không thấy email</li>
          </ul>
        </div>

        {/* Back to Register */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Email không chính xác?{' '}
            <button
              onClick={() => window.location.reload()}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors pointer"
            >
              Quay lại đăng ký
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;

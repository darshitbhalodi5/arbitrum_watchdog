import { useEffect, useRef } from 'react';
import Script from 'next/script';
import toast from 'react-hot-toast';

interface TelegramUser {
  id: number;
  first_name: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface TelegramVerificationProps {
  inputHandle: string;
  onVerificationComplete: (success: boolean, username?: string) => void;
}

const TelegramVerification = ({ inputHandle, onVerificationComplete }: TelegramVerificationProps) => {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Define the global callback function for Telegram widget
    window.onTelegramAuth = (user: TelegramUser) => {
      console.log('Telegram auth response:', user);

      if (!user.username) {
        console.error('No username found in Telegram response');
        toast.error('Please set a username in your Telegram account first');
        onVerificationComplete(false);
        return;
      }

      // Format handles for comparison
      const formattedInputHandle = inputHandle.startsWith('@') ? inputHandle.slice(1) : inputHandle;
      const telegramUsername = user.username.toLowerCase();
      
      console.log('Comparing handles:', {
        input: formattedInputHandle.toLowerCase(),
        telegram: telegramUsername
      });

      if (formattedInputHandle.toLowerCase() === telegramUsername) {
        console.log('Telegram handle verified successfully');
        toast.success('Telegram handle verified successfully!');
        onVerificationComplete(true, user.username);
      } else {
        console.error('Telegram handle mismatch');
        toast.error('The provided handle does not match your Telegram account');
        onVerificationComplete(false);
      }
    };

    // Check if the widget container exists
    if (widgetRef.current) {
      console.log('Widget container found, attempting to render Telegram widget');
    }

    return () => {
      // Cleanup
      window.onTelegramAuth = () => {}; // Set to no-op function instead of deleting
    };
  }, [inputHandle, onVerificationComplete]);

  const handleScriptLoad = () => {
    console.log('Telegram widget script loaded successfully');
  };

  const handleScriptError = () => {
    console.error('Failed to load Telegram widget script');
    toast.error('Failed to load Telegram verification widget');
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <Script
        src="https://telegram.org/js/telegram-widget.js?22"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
        onError={handleScriptError}
      />
      
      <div 
        ref={widgetRef}
        className="telegram-login"
        data-telegram-login={process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}
        data-size="medium"
        data-radius="8"
        data-onauth="onTelegramAuth(user)"
        data-request-access="write"
      />
    </div>
  );
};

// Add type declaration for the global Telegram callback
declare global {
  interface Window {
    onTelegramAuth: (user: TelegramUser) => void;
  }
}

export default TelegramVerification; 
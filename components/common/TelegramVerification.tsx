import { useEffect, useRef } from 'react';
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
    // Load Telegram script
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || '');
    script.setAttribute('data-size', 'medium');
    script.setAttribute('data-radius', '8');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    script.async = true;

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

    // Add script to widget container
    if (widgetRef.current) {
      widgetRef.current.appendChild(script);
      console.log('Telegram widget script added to container');
    }

    return () => {
      // Cleanup
      if (widgetRef.current) {
        const scriptElement = widgetRef.current.querySelector('script');
        if (scriptElement) {
          scriptElement.remove();
        }
      }
      window.onTelegramAuth = () => {};
    };
  }, [inputHandle, onVerificationComplete]);

  return (
    <div className="flex flex-col items-start gap-2">
      <div 
        ref={widgetRef}
        className="telegram-login"
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
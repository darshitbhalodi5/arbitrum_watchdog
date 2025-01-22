import Image from 'next/image';
import Link from 'next/link';
import TruenceLogo from '@/public/assets/logo.png';
import TruenceSymbol from '@/public/assets/symbol.png';

export default function Navbar() {
  return (
    <nav className="bg-[#0A0B0C] border-b border-[#1A1B1E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <Link href="/" className="flex-shrink-0 flex items-center gap-3">
            <Image
              src={TruenceSymbol}
              alt="Truence Symbol"
              width={28}
              height={28}
              className="object-contain"
              priority
            />
            <Image
              src={TruenceLogo}
              alt="Truence Logo"
              width={120}
              height={32}
              className="object-contain"
              priority
            />
          </Link>
        </div>
      </div>
    </nav>
  );
} 
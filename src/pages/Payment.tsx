import { useState } from "react";

export default function Payment() {
  const [clickCount, setClickCount] = useState(0);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount === 5) {
      window.location.href = "/admin";
    }
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4">
            Payment Methods
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Pay with ABA or KHQR - Cambodian payment methods
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          <div 
            className="glass rounded-2xl p-6 sm:p-8 hover-lift cursor-pointer animate-scale-in"
            onClick={handleLogoClick}
          >
            <div className="aspect-square mb-6 rounded-xl bg-secondary/50 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                  <span className="text-3xl sm:text-4xl font-bold text-primary-foreground">ABA</span>
                </div>
                <p className="text-sm text-muted-foreground">Click 5 times for admin</p>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 gradient-text">ABA Bank</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Fast and secure payment through ABA mobile banking. Instant transaction confirmation 
              with bank-level security. Available 24/7 for your convenience.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 sm:p-8 hover-lift animate-scale-in" style={{animationDelay: '0.1s'}}>
            <div className="aspect-square mb-6 rounded-xl bg-secondary/50 flex items-center justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <span className="text-2xl sm:text-3xl font-bold text-primary-foreground">KHQR</span>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 gradient-text">KHQR Payment</h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Scan and pay using any KHQR-enabled banking app. Universal QR payment standard 
              accepted across all major Cambodian banks. Simple and convenient.
            </p>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 glass rounded-2xl p-6 sm:p-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
          <h2 className="text-xl sm:text-2xl font-bold gradient-text mb-4">Why Choose Our Payment Methods?</h2>
          <ul className="space-y-3 text-sm sm:text-base text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">✓</span>
              <span>100% secure transactions with bank-level encryption</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">✓</span>
              <span>Instant payment confirmation and order processing</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">✓</span>
              <span>24/7 availability - pay anytime, anywhere</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">✓</span>
              <span>No additional fees or hidden charges</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
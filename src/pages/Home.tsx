import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import heroBanner from "@/assets/hero-banner.png";

export default function Home() {
  const [settings, setSettings] = useState({
    store_name: "TehTehAir Store",
    cta_text: "Explore Store",
    hero_image_url: null as string | null,
  });

  useEffect(() => {
    loadSettings();

    const channel = supabase
      .channel('settings-home-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'store_settings'
        },
        () => {
          loadSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase
      .from('store_settings')
      .select('store_name, cta_text, hero_image_url')
      .single();
    
    if (data) {
      setSettings({
        store_name: data.store_name || settings.store_name,
        cta_text: data.cta_text || settings.cta_text,
        hero_image_url: data.hero_image_url,
      });
    }
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={settings.hero_image_url || heroBanner}
            alt="Hero Background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-overlay" />
        </div>

        {/* Content */}
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 gradient-text leading-tight">
              {settings.store_name}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
              Premium digital products at unbeatable prices. Fast delivery, safe transactions, 
              and 100% satisfaction guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/store">
                <Button size="lg" className="glow hover-lift text-base sm:text-lg px-8 py-6 sm:py-7 w-full sm:w-auto">
                  {settings.cta_text}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="text-base sm:text-lg px-8 py-6 sm:py-7 w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-primary/20 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-glow-pulse" style={{animationDelay: '1s'}} />
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="container mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Instant Delivery",
                description: "Get your products immediately after payment",
                emoji: "⚡",
              },
              {
                title: "Secure Payment",
                description: "ABA and KHQR payment methods available",
                emoji: "🔒",
              },
              {
                title: "Best Prices",
                description: "Unbeatable discounts on premium products",
                emoji: "💰",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-6 sm:p-8 hover-lift text-center animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl sm:text-5xl mb-4">{feature.emoji}</div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 gradient-text">{feature.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
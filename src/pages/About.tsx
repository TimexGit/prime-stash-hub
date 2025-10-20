import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Zap, Heart, Award } from "lucide-react";

export default function About() {
  const [settings, setSettings] = useState({
    about_description: "We deliver fast and safe. Your satisfaction is our priority.",
  });

  useEffect(() => {
    loadSettings();

    const channel = supabase
      .channel('settings-changes')
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
      .select('about_description')
      .single();
    
    if (data) {
      setSettings({ about_description: data.about_description || settings.about_description });
    }
  };

  const features = [
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "Get your digital products instantly after payment confirmation",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Bank-level security for all transactions and data protection",
    },
    {
      icon: Heart,
      title: "Customer Focused",
      description: "Your satisfaction is our top priority with 24/7 support",
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "Only authentic and verified premium products",
    },
  ];

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4">
            About TehTehAir Store
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {settings.about_description}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="glass rounded-2xl p-6 sm:p-8 hover-lift animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 shadow-glow">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 gradient-text">{feature.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="glass rounded-2xl p-6 sm:p-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-6">Our Commitment</h2>
          <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            <p>
              At TehTehAir Store, we are dedicated to providing the best digital products at 
              unbeatable prices. Our mission is to make premium subscriptions and services 
              accessible to everyone.
            </p>
            <p>
              We carefully verify all our products to ensure authenticity and quality. Every 
              purchase comes with our satisfaction guarantee and responsive customer support.
            </p>
            <p>
              Our payment methods are secure and convenient, designed specifically for the 
              Cambodian market with ABA and KHQR integration. We process orders instantly 
              and deliver digital products within minutes of payment confirmation.
            </p>
            <p className="text-primary font-semibold pt-2">
              Thank you for choosing TehTehAir Store - Your trusted partner for premium digital products!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
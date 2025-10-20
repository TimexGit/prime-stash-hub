import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { MessageCircle, Send } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  description?: string;
  originalPrice: number;
  discountPrice: number;
  imageUrl?: string;
}

export const ProductCard = ({
  name,
  description,
  originalPrice,
  discountPrice,
  imageUrl,
}: ProductCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const discount = Math.round(((originalPrice - discountPrice) / originalPrice) * 100);

  const handleBuyNow = () => {
    setShowDetails(false);
    setShowContact(true);
  };

  return (
    <>
      <div className="glass rounded-2xl p-4 sm:p-6 hover-lift group cursor-pointer transition-all duration-300">
        <div className="relative mb-4 aspect-square rounded-xl overflow-hidden bg-secondary/50">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}
          <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
            -{discount}%
          </Badge>
        </div>

        <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground group-hover:gradient-text transition-all">
          {name}
        </h3>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-lg sm:text-xl font-bold text-primary">${discountPrice.toFixed(2)}</span>
          <span className="text-sm sm:text-base text-muted-foreground line-through">
            ${originalPrice.toFixed(2)}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setShowDetails(true)}
          >
            See More
          </Button>
          <Button className="flex-1 glow" onClick={handleBuyNow}>
            Buy Now
          </Button>
        </div>
      </div>

      {/* Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="glass-strong border-border animate-scale-in max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl gradient-text">{name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {imageUrl && (
              <div className="aspect-square rounded-xl overflow-hidden bg-secondary/50">
                <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
              </div>
            )}
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{description}</p>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-2xl sm:text-3xl font-bold text-primary">${discountPrice.toFixed(2)}</span>
              <span className="text-lg sm:text-xl text-muted-foreground line-through">
                ${originalPrice.toFixed(2)}
              </span>
              <Badge className="bg-destructive text-destructive-foreground">-{discount}%</Badge>
            </div>
            <Button className="w-full glow" size="lg" onClick={handleBuyNow}>
              Buy Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Modal */}
      <Dialog open={showContact} onOpenChange={setShowContact}>
        <DialogContent className="glass-strong border-border animate-scale-in max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl gradient-text">Choose Contact Method</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <a
              href="https://t.me/tephh"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button variant="outline" className="w-full" size="lg">
                <Send className="mr-2 h-5 w-5" />
                Telegram @tephh
              </Button>
            </a>
            <a
              href="https://m.me/putephh"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button variant="outline" className="w-full" size="lg">
                <MessageCircle className="mr-2 h-5 w-5" />
                Messenger @putephh
              </Button>
            </a>
            <Button variant="ghost" className="w-full" onClick={() => setShowContact(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
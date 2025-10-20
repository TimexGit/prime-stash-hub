import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, LogOut, Plus, Edit, Eye, EyeOff, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

interface Product {
  id: string;
  name: string;
  description: string | null;
  original_price: number;
  discount_price: number;
  image_url: string | null;
  is_hidden: boolean;
}

interface StoreSettings {
  id: string;
  store_name: string;
  store_description: string;
  cta_text: string;
  about_description: string;
  payment_description: string;
  hero_image_url: string | null;
  store_logo_url: string | null;
  payment_logo_url: string | null;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    const adminAuth = sessionStorage.getItem("adminAuth");
    if (!adminAuth) {
      navigate("/admin");
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      const [productsRes, settingsRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('store_settings').select('*').single(),
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (settingsRes.data) setSettings(settingsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    navigate("/admin");
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase.from('products').insert({
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      original_price: parseFloat(formData.get('original_price') as string),
      discount_price: parseFloat(formData.get('discount_price') as string),
      image_url: formData.get('image_url') as string,
    });

    if (error) {
      toast.error("Failed to add product");
    } else {
      toast.success("Product added successfully");
      setIsAddDialogOpen(false);
      loadData();
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;

    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase
      .from('products')
      .update({
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        original_price: parseFloat(formData.get('original_price') as string),
        discount_price: parseFloat(formData.get('discount_price') as string),
        image_url: formData.get('image_url') as string,
      })
      .eq('id', editingProduct.id);

    if (error) {
      toast.error("Failed to update product");
    } else {
      toast.success("Product updated successfully");
      setEditingProduct(null);
      loadData();
    }
  };

  const toggleProductVisibility = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from('products')
      .update({ is_hidden: !currentState })
      .eq('id', id);

    if (error) {
      toast.error("Failed to update visibility");
    } else {
      toast.success(currentState ? "Product shown" : "Product hidden");
      loadData();
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      toast.error("Failed to delete product");
    } else {
      toast.success("Product deleted successfully");
      loadData();
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!settings) return;

    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase
      .from('store_settings')
      .update({
        store_name: formData.get('store_name') as string,
        store_description: formData.get('store_description') as string,
        cta_text: formData.get('cta_text') as string,
        about_description: formData.get('about_description') as string,
        payment_description: formData.get('payment_description') as string,
      })
      .eq('id', settings.id);

    if (error) {
      toast.error("Failed to update settings");
    } else {
      toast.success("Settings updated successfully");
      loadData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Products</h2>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="glow">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-strong max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input id="name" name="name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" rows={3} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="original_price">Original Price</Label>
                        <Input id="original_price" name="original_price" type="number" step="0.01" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discount_price">Discount Price</Label>
                        <Input id="discount_price" name="discount_price" type="number" step="0.01" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image_url">Image URL</Label>
                      <Input id="image_url" name="image_url" placeholder="/assets/product.png" />
                    </div>
                    <Button type="submit" className="w-full">Add Product</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {products.map((product) => (
                <div key={product.id} className="glass rounded-xl p-4 flex items-center gap-4">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${product.discount_price} <span className="line-through">${product.original_price}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleProductVisibility(product.id, product.is_hidden)}
                    >
                      {product.is_hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setEditingProduct(product)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-strong max-w-md max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Product</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdateProduct} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-name">Product Name</Label>
                            <Input id="edit-name" name="name" defaultValue={editingProduct?.name} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea id="edit-description" name="description" rows={3} defaultValue={editingProduct?.description || ''} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-original_price">Original Price</Label>
                              <Input id="edit-original_price" name="original_price" type="number" step="0.01" defaultValue={editingProduct?.original_price} required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-discount_price">Discount Price</Label>
                              <Input id="edit-discount_price" name="discount_price" type="number" step="0.01" defaultValue={editingProduct?.discount_price} required />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-image_url">Image URL</Label>
                            <Input id="edit-image_url" name="image_url" defaultValue={editingProduct?.image_url || ''} />
                          </div>
                          <Button type="submit" className="w-full">Update Product</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" variant="destructive" onClick={() => deleteProduct(product.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            {settings && (
              <form onSubmit={handleUpdateSettings} className="glass rounded-xl p-6 space-y-6">
                <h2 className="text-2xl font-bold">Store Settings</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="store_name">Store Name</Label>
                  <Input id="store_name" name="store_name" defaultValue={settings.store_name} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store_description">Store Description</Label>
                  <Textarea id="store_description" name="store_description" rows={2} defaultValue={settings.store_description} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cta_text">CTA Button Text</Label>
                  <Input id="cta_text" name="cta_text" defaultValue={settings.cta_text} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about_description">About Page Description</Label>
                  <Textarea id="about_description" name="about_description" rows={3} defaultValue={settings.about_description} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_description">Payment Method Description</Label>
                  <Textarea id="payment_description" name="payment_description" rows={2} defaultValue={settings.payment_description} />
                </div>

                <Button type="submit" className="w-full glow">
                  Save Settings
                </Button>
              </form>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
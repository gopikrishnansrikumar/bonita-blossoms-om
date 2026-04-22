import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { LogOut, Package, PenSquare, Settings, ShoppingBag, Image as ImageIcon, Shield, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { lovable } from "@/integrations/lovable";
import { getAdminData } from "@/lib/storefront";
import { bootstrapAdminRole, deleteProduct, getSessionState, saveProduct, saveSettings, saveSiteContent, signInWithPassword, signOutAdmin, signUpWithPassword, updateOrderStatus, type ProductInput } from "@/lib/admin";
import { formatPrice } from "@/lib/site";

const productCategories = ["Roses", "Bouquets", "Luxury", "Mixed Bouquets", "Luxury Arrangements"] as const;

export const Route = createFileRoute("/admin")({
  loader: async () => {
    const state = await getSessionState();
    if (!state.session) return { needsAuth: true as const, isAdmin: false, data: null };
    if (!state.isAdmin) return { needsAuth: false as const, isAdmin: false, data: null };
    const data = await getAdminData();
    return { needsAuth: false as const, isAdmin: true, data };
  },
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Bonita Flowers" },
      { name: "description", content: "Manage Bonita Flowers products, content, media, and orders." },
    ],
  }),
  component: AdminPage,
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function AdminPage() {
  const router = useRouter();
  const loaderData = Route.useLoaderData();
  const saveProductFn = useServerFn(saveProduct);
  const deleteProductFn = useServerFn(deleteProduct);
  const saveContentFn = useServerFn(saveSiteContent);
  const saveSettingsFn = useServerFn(saveSettings);
  const updateOrderStatusFn = useServerFn(updateOrderStatus);
  const bootstrapAdminFn = useServerFn(bootstrapAdminRole);

  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [productForm, setProductForm] = useState<ProductInput>({
    name: "",
    slug: "",
    category: "Bouquets",
    price_omr: 0,
    short_description: "",
    description: "",
    image_url: "",
    image_path: null,
    is_featured: false,
    is_active: true,
    sort_order: 0,
  });

  const data = loaderData.data;
  const groupedOrderItems = useMemo(() => {
    const items = data?.orderItems ?? [];
    return items.reduce<Record<string, typeof items>>((acc, item) => {
      acc[item.order_id] ??= [];
      acc[item.order_id].push(item);
      return acc;
    }, {});
  }, [data]);

  useEffect(() => {
    if (productForm.name && !productForm.id) {
      setProductForm((current) => ({ ...current, slug: slugify(current.name) }));
    }
  }, [productForm.name, productForm.id]);

  async function refresh() {
    await router.invalidate();
  }

  async function handleAuthSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      const result =
        authMode === "login"
          ? await signInWithPassword(authForm.email, authForm.password)
          : await signUpWithPassword(authForm.email, authForm.password);

      if (result.error) {
        setAuthError(result.error.message);
      } else if (authMode === "signup") {
        setAuthError("Check your email to confirm your account, then sign in.");
      } else {
        await refresh();
      }
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/admin" });
    if (result?.error) setAuthError(result.error.message);
  }

  async function claimAdminAccess() {
    setBootstrapping(true);
    setAuthError("");
    try {
      await bootstrapAdminFn({ data: {} });
      await refresh();
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Could not claim admin access.");
    } finally {
      setBootstrapping(false);
    }
  }

  async function handleSignOut() {
    await signOutAdmin();
    await refresh();
  }

  if (loaderData.needsAuth) {
    return <AuthScreen authMode={authMode} setAuthMode={setAuthMode} authForm={authForm} setAuthForm={setAuthForm} authError={authError} authLoading={authLoading} onSubmit={handleAuthSubmit} onGoogle={handleGoogleSignIn} />;
  }

  if (!loaderData.isAdmin) {
    return (
      <section className="mx-auto max-w-xl px-5 py-24 text-center lg:px-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
          <Shield className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-serif text-4xl text-foreground">Admin access required</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          If this is the first admin account for Bonita Flowers, you can securely claim admin access now.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={claimAdminAccess} disabled={bootstrapping} className="rounded-full bg-accent px-6 text-accent-foreground">
            {bootstrapping ? "Claiming access…" : "Claim admin access"}
          </Button>
          <Button variant="outline" className="rounded-full" asChild>
            <Link to="/">Back to website</Link>
          </Button>
        </div>
        {authError && <p className="mt-4 text-sm text-destructive">{authError}</p>}
      </section>
    );
  }

  if (!data) {
    throw redirect({ to: "/admin" });
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-secondary/20">
        <Sidebar collapsible="icon" className="border-r border-border/60">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Bonita Admin</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {[
                    { id: "products", label: "Products", icon: Package },
                    { id: "content", label: "Content", icon: PenSquare },
                    { id: "orders", label: "Orders", icon: ShoppingBag },
                    { id: "media", label: "Media", icon: ImageIcon },
                    { id: "settings", label: "Settings", icon: Settings },
                  ].map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild>
                        <a href={`#${item.id}`}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur md:px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="h-9 w-9 rounded-full border border-border" />
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Dashboard</p>
                <h1 className="font-serif text-2xl text-foreground">Bonita Flowers</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-full" asChild>
                <Link to="/">View storefront</Link>
              </Button>
              <Button variant="outline" className="rounded-full" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" /> Sign out
              </Button>
            </div>
          </header>

          <div className="space-y-8 px-4 py-6 md:px-6">
            <section className="grid gap-4 md:grid-cols-4">
              {[
                { label: "Products", value: data.products.length },
                { label: "Orders", value: data.orders.length },
                { label: "Featured", value: data.products.filter((p) => p.is_featured).length },
                { label: "Media assets", value: data.mediaAssets.length },
              ].map((stat) => (
                <Card key={stat.label} className="rounded-lg border-border/70 bg-background">
                  <CardHeader>
                    <CardDescription>{stat.label}</CardDescription>
                    <CardTitle className="font-serif text-3xl">{stat.value}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </section>

            <Tabs defaultValue="products" className="space-y-6">
              <TabsList className="h-auto flex-wrap justify-start rounded-full bg-background p-1 shadow-sm">
                <TabsTrigger value="products" className="rounded-full">Products</TabsTrigger>
                <TabsTrigger value="content" className="rounded-full">Content</TabsTrigger>
                <TabsTrigger value="orders" className="rounded-full">Orders</TabsTrigger>
                <TabsTrigger value="media" className="rounded-full">Media</TabsTrigger>
                <TabsTrigger value="settings" className="rounded-full">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="products" id="products">
                <Card className="rounded-lg border-border/70 bg-background">
                  <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <div>
                      <CardTitle>Product management</CardTitle>
                      <CardDescription>Add, edit, and organize bouquets.</CardDescription>
                    </div>
                    <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="rounded-full bg-accent text-accent-foreground"><Plus className="h-4 w-4" /> New product</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{productForm.id ? "Edit product" : "New product"}</DialogTitle>
                          <DialogDescription>Update bouquet details, pricing, and image.</DialogDescription>
                        </DialogHeader>
                        <ProductForm
                          form={productForm}
                          setForm={setProductForm}
                          onSave={async () => {
                            await saveProductFn({ data: productForm });
                            setProductDialogOpen(false);
                            setProductForm({ name: "", slug: "", category: "Bouquets", price_omr: 0, short_description: "", description: "", image_url: "", image_path: null, is_featured: false, is_active: true, sort_order: 0 });
                            await refresh();
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Featured</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <img src={product.image_url || "https://placehold.co/80x96?text=Flower"} alt={product.name} className="h-14 w-12 rounded-sm object-cover" />
                                <div>
                                  <p className="font-medium text-foreground">{product.name}</p>
                                  <p className="text-xs text-muted-foreground">{product.slug}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{formatPrice(Number(product.price_omr))}</TableCell>
                            <TableCell>{product.is_featured ? "Yes" : "No"}</TableCell>
                            <TableCell>{product.is_active ? "Visible" : "Hidden"}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => { setProductForm({ ...product, price_omr: Number(product.price_omr), image_url: product.image_url || "", image_path: product.image_path, }); setProductDialogOpen(true); }}>Edit</Button>
                                <Button variant="outline" size="sm" onClick={async () => { await deleteProductFn({ data: { id: product.id } }); await refresh(); }}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" id="content">
                <div className="grid gap-4 lg:grid-cols-2">
                  {data.siteContent.map((section) => (
                    <Card key={section.id} className="rounded-lg border-border/70 bg-background">
                      <CardHeader>
                        <CardTitle>{section.key}</CardTitle>
                        <CardDescription>Edit homepage copy and imagery.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Input value={section.title || ""} onChange={(e) => { section.title = e.target.value; }} placeholder="Title" />
                        <Input value={section.subtitle || ""} onChange={(e) => { section.subtitle = e.target.value; }} placeholder="Subtitle" />
                        <Textarea value={section.body || ""} onChange={(e) => { section.body = e.target.value; }} rows={5} placeholder="Body" />
                        <Input value={section.image_url || ""} onChange={(e) => { section.image_url = e.target.value; }} placeholder="Banner image URL" />
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-foreground">Visible</label>
                          <Switch checked={section.enabled} onCheckedChange={(checked) => { section.enabled = checked; }} />
                        </div>
                        <Button className="rounded-full bg-accent text-accent-foreground" onClick={async () => { await saveContentFn({ data: { id: section.id, title: section.title || "", subtitle: section.subtitle || "", body: section.body || "", image_url: section.image_url || "", enabled: section.enabled, sort_order: section.sort_order } }); await refresh(); }}>
                          Save section
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="orders" id="orders">
                <Card className="rounded-lg border-border/70 bg-background">
                  <CardHeader>
                    <CardTitle>Order management</CardTitle>
                    <CardDescription>Track customer requests and update delivery status.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {data.orders.map((order) => (
                      <div key={order.id} className="rounded-sm border border-border/70 p-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <p className="font-medium text-foreground">{order.customer_name}</p>
                            <p className="text-sm text-muted-foreground">{order.phone} · {order.city}</p>
                            <p className="mt-2 text-sm text-muted-foreground">{order.address}</p>
                            {order.note && <p className="mt-2 text-sm text-muted-foreground">Note: {order.note}</p>}
                          </div>
                          <div className="flex flex-col items-start gap-3 md:items-end">
                            <p className="font-medium text-foreground">{formatPrice(Number(order.total_amount))}</p>
                            <Select value={order.status} onValueChange={async (value) => { await updateOrderStatusFn({ data: { orderId: order.id, status: value as "pending" | "completed" | "delivered" } }); await refresh(); }}>
                              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-3">
                          {(groupedOrderItems[order.id] || []).map((item) => (
                            <div key={item.id} className="rounded-sm border border-border/60 bg-secondary/40 px-3 py-2 text-sm">
                              {item.product_name} × {item.quantity}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="media" id="media">
                <Card className="rounded-lg border-border/70 bg-background">
                  <CardHeader>
                    <CardTitle>Media library</CardTitle>
                    <CardDescription>Manage uploaded image links for products and banners.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {data.mediaAssets.map((asset) => (
                        <div key={asset.id} className="rounded-sm border border-border/70 p-3">
                          <img src={asset.public_url || "https://placehold.co/400x500?text=Media"} alt={asset.alt_text || asset.file_name} className="aspect-[4/5] w-full rounded-sm object-cover" />
                          <p className="mt-3 truncate text-sm font-medium text-foreground">{asset.file_name}</p>
                          <p className="truncate text-xs text-muted-foreground">{asset.public_url}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">Upload assets in the backend storage bucket, then paste the image URL into products or content.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" id="settings">
                {data.siteSettings && (
                  <Card className="rounded-lg border-border/70 bg-background">
                    <CardHeader>
                      <CardTitle>Store settings</CardTitle>
                      <CardDescription>Update contact details, delivery info, and section visibility.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 lg:grid-cols-2">
                      <Input defaultValue={data.siteSettings.whatsapp_number || ""} id="whatsapp_number" placeholder="WhatsApp number" />
                      <Input defaultValue={data.siteSettings.phone_display || ""} id="phone_display" placeholder="Phone display" />
                      <Input defaultValue={data.siteSettings.phone_e164 || ""} id="phone_e164" placeholder="Phone E.164" />
                      <Input defaultValue={data.siteSettings.email || ""} id="email" placeholder="Email" />
                      <Input defaultValue={data.siteSettings.instagram_url || ""} id="instagram_url" placeholder="Instagram URL" className="lg:col-span-2" />
                      <Textarea defaultValue={data.siteSettings.delivery_info || ""} id="delivery_info" placeholder="Delivery information" className="lg:col-span-2" rows={5} />
                      <div className="flex items-center justify-between rounded-sm border border-border/70 p-3"><span>Hero section</span><Switch defaultChecked={data.siteSettings.hero_enabled} id="hero_enabled" /></div>
                      <div className="flex items-center justify-between rounded-sm border border-border/70 p-3"><span>Featured products</span><Switch defaultChecked={data.siteSettings.featured_enabled} id="featured_enabled" /></div>
                      <div className="flex items-center justify-between rounded-sm border border-border/70 p-3"><span>Delivery section</span><Switch defaultChecked={data.siteSettings.delivery_enabled} id="delivery_enabled" /></div>
                      <div className="flex items-center justify-between rounded-sm border border-border/70 p-3"><span>Instagram gallery</span><Switch defaultChecked={data.siteSettings.instagram_enabled} id="instagram_enabled" /></div>
                      <div className="lg:col-span-2">
                        <Button className="rounded-full bg-accent text-accent-foreground" onClick={async () => {
                          const getInputValue = (id: string) => (document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null)?.value ?? "";
                          const getSwitchValue = (id: string) => (document.getElementById(id) as HTMLButtonElement | null)?.getAttribute("aria-checked") === "true";
                          await saveSettingsFn({ data: { id: data.siteSettings.id, whatsapp_number: getInputValue("whatsapp_number"), phone_display: getInputValue("phone_display"), phone_e164: getInputValue("phone_e164"), instagram_url: getInputValue("instagram_url"), email: getInputValue("email"), delivery_info: getInputValue("delivery_info"), hero_enabled: getSwitchValue("hero_enabled"), featured_enabled: getSwitchValue("featured_enabled"), delivery_enabled: getSwitchValue("delivery_enabled"), instagram_enabled: getSwitchValue("instagram_enabled") } });
                          await refresh();
                        }}>
                          Save settings
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function AuthScreen({ authMode, setAuthMode, authForm, setAuthForm, authError, authLoading, onSubmit, onGoogle }: { authMode: "login" | "signup"; setAuthMode: (mode: "login" | "signup") => void; authForm: { email: string; password: string }; setAuthForm: (value: { email: string; password: string }) => void; authError: string; authLoading: boolean; onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>; onGoogle: () => Promise<void>; }) {
  return (
    <section className="mx-auto max-w-md px-5 py-20 lg:px-10">
      <Card className="rounded-lg border-border/70 bg-background shadow-[var(--shadow-petal)]">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-4xl">Admin Dashboard</CardTitle>
          <CardDescription>Secure access for Bonita Flowers management.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex rounded-full bg-secondary p-1">
            <button type="button" className={`flex-1 rounded-full px-4 py-2 text-sm ${authMode === "login" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`} onClick={() => setAuthMode("login")}>Sign in</button>
            <button type="button" className={`flex-1 rounded-full px-4 py-2 text-sm ${authMode === "signup" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`} onClick={() => setAuthMode("signup")}>Create account</button>
          </div>
          <form className="space-y-4" onSubmit={onSubmit}>
            <Input type="email" placeholder="Email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} />
            <Input type="password" placeholder="Password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} />
            <Button type="submit" className="w-full rounded-full bg-accent text-accent-foreground" disabled={authLoading}>
              {authLoading ? "Please wait…" : authMode === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>
          <Button variant="outline" className="mt-3 w-full rounded-full" onClick={onGoogle}>Continue with Google</Button>
          {authError && <p className="mt-4 text-sm text-destructive">{authError}</p>}
        </CardContent>
      </Card>
    </section>
  );
}

function ProductForm({ form, setForm, onSave }: { form: ProductInput; setForm: (value: ProductInput) => void; onSave: () => Promise<void>; }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" />
      <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} placeholder="product-slug" />
      <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
        <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
        <SelectContent>
          {productCategories.map((category) => <SelectItem key={category} value={category}>{category}</SelectItem>)}
        </SelectContent>
      </Select>
      <Input type="number" value={form.price_omr} onChange={(e) => setForm({ ...form, price_omr: Number(e.target.value) })} placeholder="Price" />
      <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="Image URL" className="md:col-span-2" />
      <Input value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} placeholder="Short description" className="md:col-span-2" />
      <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={5} className="md:col-span-2" />
      <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} placeholder="Sort order" />
      <div className="flex items-center justify-between rounded-sm border border-border/70 px-4 py-3"><span className="text-sm">Featured</span><Switch checked={form.is_featured} onCheckedChange={(checked) => setForm({ ...form, is_featured: checked })} /></div>
      <div className="flex items-center justify-between rounded-sm border border-border/70 px-4 py-3"><span className="text-sm">Visible</span><Switch checked={form.is_active} onCheckedChange={(checked) => setForm({ ...form, is_active: checked })} /></div>
      <div className="md:col-span-2 flex justify-end">
        <Button className="rounded-full bg-accent text-accent-foreground" onClick={onSave}>Save product</Button>
      </div>
    </div>
  );
}
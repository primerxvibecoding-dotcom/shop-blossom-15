import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  adminListProducts,
  adminUpsertProduct,
  adminDeleteProduct,
  adminListCategories,
} from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: AdminProducts,
});

const empty = {
  slug: "",
  name: "",
  short_description: "",
  description: "",
  price: 0,
  compare_at_price: null as number | null,
  stock: 0,
  category_id: null as string | null,
  is_active: true,
  is_featured: false,
  is_deal: false,
  image_url: "",
};

function AdminProducts() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListProducts);
  const catsFn = useServerFn(adminListCategories);
  const upsertFn = useServerFn(adminUpsertProduct);
  const delFn = useServerFn(adminDeleteProduct);

  const { data: products } = useQuery({ queryKey: ["admin-products"], queryFn: () => listFn() });
  const { data: cats } = useQuery({ queryKey: ["admin-cats"], queryFn: () => catsFn() });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(empty);

  function startEdit(p: any) {
    setEditing(p);
    setForm({ ...empty, ...p, image_url: "" });
    setOpen(true);
  }
  function startCreate() {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  }

  const saveMut = useMutation({
    mutationFn: () =>
      upsertFn({
        data: {
          ...form,
          id: editing?.id,
          image_url: form.image_url || null,
          compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
          price: Number(form.price),
          stock: Number(form.stock),
        } as any,
      }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      setOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });
  const delMut = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={startCreate}><Plus className="h-4 w-4 mr-1" /> New product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit product" : "New product"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Slug"><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></Field>
              <Field label="Price"><Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} /></Field>
              <Field label="Compare price"><Input type="number" step="0.01" value={form.compare_at_price ?? ""} onChange={(e) => setForm({ ...form, compare_at_price: e.target.value ? parseFloat(e.target.value) : null })} /></Field>
              <Field label="Stock"><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} /></Field>
              <Field label="Category">
                <select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={form.category_id ?? ""} onChange={(e) => setForm({ ...form, category_id: e.target.value || null })}>
                  <option value="">— none —</option>
                  {(cats ?? []).map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Short description" full><Input value={form.short_description ?? ""} onChange={(e) => setForm({ ...form, short_description: e.target.value })} /></Field>
              <Field label="Description" full><Textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
              <Field label="Image URL (replaces current)" full><Input value={form.image_url ?? ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://…" /></Field>
              <div className="sm:col-span-2 flex gap-4 flex-wrap">
                <Toggle label="Active" checked={form.is_active} onChange={(v) => setForm({ ...form, is_active: v })} />
                <Toggle label="Featured" checked={form.is_featured} onChange={(v) => setForm({ ...form, is_featured: v })} />
                <Toggle label="Deal" checked={form.is_deal} onChange={(v) => setForm({ ...form, is_deal: v })} />
              </div>
            </div>
            <Button onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
              {saveMut.isPending ? "Saving…" : "Save product"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((p: any) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-muted-foreground">{p.categories?.name ?? "—"}</td>
                <td className="p-3 font-semibold text-primary">${Number(p.price).toFixed(2)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  {p.is_active ? <span className="text-success">Active</span> : <span className="text-muted-foreground">Hidden</span>}
                </td>
                <td className="p-3 flex gap-1 justify-end">
                  <button onClick={() => startEdit(p)} className="p-1.5 hover:bg-muted rounded"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => confirm("Delete?") && delMut.mutate(p.id)} className="p-1.5 hover:bg-muted rounded text-destructive"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ label, full, children }: any) {
  return (
    <div className={full ? "sm:col-span-2 space-y-1" : "space-y-1"}>
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <Switch checked={checked} onCheckedChange={onChange} />
      {label}
    </label>
  );
}

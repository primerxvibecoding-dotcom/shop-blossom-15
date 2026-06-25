import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  adminListCategories,
  adminUpsertCategory,
  adminDeleteCategory,
} from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/categories")({
  component: AdminCategories,
});

const empty = { slug: "", name: "", icon: "", parent_id: null as string | null, position: 0, is_active: true };

function AdminCategories() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListCategories);
  const upsertFn = useServerFn(adminUpsertCategory);
  const delFn = useServerFn(adminDeleteCategory);
  const { data: cats } = useQuery({ queryKey: ["admin-cats"], queryFn: () => listFn() });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(empty);

  const saveMut = useMutation({
    mutationFn: () => upsertFn({ data: { ...form, id: editing?.id, position: Number(form.position) } as any }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-cats"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Saved");
      setOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });
  const delMut = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-cats"] });
      toast.success("Deleted");
    },
    onError: (e: any) => toast.error(e.message),
  });

  function startEdit(c: any) {
    setEditing(c);
    setForm({ ...empty, ...c });
    setOpen(true);
  }
  function startCreate() {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  }

  const parents = (cats ?? []).filter((c: any) => !c.parent_id);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={startCreate}><Plus className="h-4 w-4 mr-1" /> New category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit category" : "New category"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <div><Label className="text-xs">Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label className="text-xs">Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
              <div>
                <Label className="text-xs">Parent</Label>
                <select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={form.parent_id ?? ""} onChange={(e) => setForm({ ...form, parent_id: e.target.value || null })}>
                  <option value="">— Top level —</option>
                  {parents.filter((p: any) => p.id !== editing?.id).map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div><Label className="text-xs">Icon (lucide name)</Label><Input value={form.icon ?? ""} onChange={(e) => setForm({ ...form, icon: e.target.value })} /></div>
              <div><Label className="text-xs">Position</Label><Input type="number" value={form.position} onChange={(e) => setForm({ ...form, position: parseInt(e.target.value) || 0 })} /></div>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
                Active
              </label>
            </div>
            <Button onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>Save</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr><th className="p-3">Name</th><th className="p-3">Slug</th><th className="p-3">Parent</th><th className="p-3">Pos</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {(cats ?? []).map((c: any) => (
              <tr key={c.id} className="border-t border-border">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-muted-foreground">{c.slug}</td>
                <td className="p-3 text-muted-foreground">{parents.find((p: any) => p.id === c.parent_id)?.name ?? "—"}</td>
                <td className="p-3">{c.position}</td>
                <td className="p-3 flex gap-1 justify-end">
                  <button onClick={() => startEdit(c)} className="p-1.5 hover:bg-muted rounded"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => confirm("Delete?") && delMut.mutate(c.id)} className="p-1.5 hover:bg-muted rounded text-destructive"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

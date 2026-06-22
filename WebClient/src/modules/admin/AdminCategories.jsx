import { useMemo, useState } from "react";
import {
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Tag,
  Trash2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "../../store/apis/adminApi";

const getCategoryId = (category) => category?.id ?? category?.maTag;
const getCategoryName = (category) => category?.name ?? category?.tenTag ?? "Danh muc";
const getCategoryType = (category) => category?.type ?? category?.loaiTag ?? "GENERAL";

export default function AdminCategories() {
  const { toast } = useToast();
  const {
    data: categories = [],
    isLoading,
    isError,
    refetch,
  } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [form, setForm] = useState({ name: "", type: "GENERAL" });
  const [keyword, setKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const availableTypes = useMemo(
    () => [...new Set(categories.map(getCategoryType))].sort(),
    [categories],
  );
  const filteredCategories = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return categories.filter((category) => {
      const matchesKeyword =
        !normalizedKeyword ||
        getCategoryName(category).toLowerCase().includes(normalizedKeyword);
      const matchesType = !typeFilter || getCategoryType(category) === typeFilter;
      return matchesKeyword && matchesType;
    });
  }, [categories, keyword, typeFilter]);

  const handleCreate = async (event) => {
    event.preventDefault();
    const name = form.name.trim();
    const type = form.type.trim().toUpperCase() || "GENERAL";
    if (name.length < 2) {
      setError("Ten danh muc can it nhat 2 ky tu.");
      return;
    }

    try {
      await createCategory({ name, type }).unwrap();
      setForm({ name: "", type: "GENERAL" });
      setError("");
      toast({
        title: "Da tao danh muc",
        description: "Danh muc moi da duoc luu vao he thong.",
        variant: "success",
      });
    } catch (err) {
      setError(err?.data?.message ?? "Khong the tao danh muc.");
    }
  };

  const handleDelete = async (category) => {
    const id = getCategoryId(category);
    const placeCount = category.placeCount ?? 0;
    if (!id || placeCount > 0) return;
    if (!window.confirm(`Xoa danh muc "${getCategoryName(category)}"?`)) return;

    setDeletingId(id);
    try {
      await deleteCategory(id).unwrap();
      toast({
        title: "Da xoa danh muc",
        description: "Danh muc khong con xuat hien trong he thong.",
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Khong the xoa danh muc",
        description: err?.data?.message ?? "Vui long thu lai.",
        variant: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-10">
      <div className="flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Danh muc dia diem</h1>
          <p className="mt-2 text-sm text-slate-500">
            Quan ly tag dung de phan loai va tim kiem dia diem.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          onClick={() => refetch()}
        >
          <RefreshCw className="h-4 w-4" />
          Lam moi
        </button>
      </div>

      <section>
        <h2 className="text-lg font-bold text-slate-950">Tao danh muc</h2>
        <form className="mt-4 grid gap-4 md:grid-cols-[1fr_220px_auto]" onSubmit={handleCreate}>
          <div>
            <label className="text-sm font-semibold text-slate-700" htmlFor="category-name">
              Ten danh muc
            </label>
            <input
              id="category-name"
              className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-500"
              value={form.name}
              onChange={(event) => {
                setForm((current) => ({ ...current, name: event.target.value }));
                if (error) setError("");
              }}
              disabled={isCreating}
              maxLength={100}
              placeholder="VD: Bien dao"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700" htmlFor="category-type">
              Loai
            </label>
            <input
              id="category-type"
              className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm uppercase outline-none focus:border-slate-500"
              value={form.type}
              onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
              disabled={isCreating}
              maxLength={50}
              placeholder="GENERAL"
            />
          </div>
          <button
            type="submit"
            className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            disabled={isCreating || !form.name.trim()}
          >
            {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Tao
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </section>

      <section className="border-t pt-7">
        <div className="mb-5 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              className="h-10 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-slate-500"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tim theo ten danh muc..."
            />
          </div>
          <select
            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none"
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
          >
            <option value="">Tat ca loai</option>
            {availableTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="flex min-h-56 items-center justify-center rounded-md border border-slate-200 bg-white">
            <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
          </div>
        ) : isError ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Khong the tai danh muc.{" "}
            <button type="button" className="font-semibold underline" onClick={() => refetch()}>
              Thu lai
            </button>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="rounded-md border border-slate-200 bg-white px-5 py-12 text-center">
            <Tag className="mx-auto h-8 w-8 text-slate-400" />
            <h3 className="mt-4 font-bold text-slate-950">Khong co danh muc phu hop</h3>
            <p className="mt-2 text-sm text-slate-500">Thu doi bo loc hoac tao danh muc moi.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
            <div className="grid grid-cols-[1fr_160px_120px_56px] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold uppercase text-slate-500">
              <span>Danh muc</span>
              <span>Loai</span>
              <span>Dia diem</span>
              <span />
            </div>
            <div className="divide-y divide-slate-200">
              {filteredCategories.map((category) => {
                const id = getCategoryId(category);
                const placeCount = category.placeCount ?? 0;
                return (
                  <div
                    key={id}
                    className="grid grid-cols-[1fr_160px_120px_56px] items-center gap-4 px-4 py-4 text-sm"
                  >
                    <span className="font-semibold text-slate-950">{getCategoryName(category)}</span>
                    <span className="text-slate-600">{getCategoryType(category)}</span>
                    <span className="text-slate-600">{placeCount}</span>
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-35"
                      onClick={() => handleDelete(category)}
                      disabled={isDeleting || placeCount > 0}
                      title={placeCount > 0 ? "Danh muc dang duoc su dung" : "Xoa danh muc"}
                    >
                      {deletingId === id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

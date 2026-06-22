import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Check,
  Edit3,
  Loader2,
  Plus,
  Power,
  PowerOff,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  useCreateAdminProviderPackageMutation,
  useGetAdminProviderPackagesQuery,
  useUpdateAdminProviderPackageMutation,
  useUpdateAdminProviderPackageStatusMutation,
} from "../../store/apis/adminApi";

const emptyForm = {
  name: "",
  description: "",
  monthlyPrice: "0",
  annualPrice: "0",
  priorityCoefficient: "1.00",
  searchPriority: false,
  aiPriority: false,
  homePriority: false,
  partnerBadge: false,
};

const inputClass =
  "h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20";

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

const getErrorMessage = (error) =>
  error?.data?.message ?? "Không thể lưu thay đổi. Vui lòng thử lại.";

function FeatureMark({ enabled, label }) {
  return (
    <span
      title={label}
      className={`inline-flex h-7 items-center gap-1 rounded border px-2 text-xs font-medium ${
        enabled
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-50 text-slate-400"
      }`}
    >
      {enabled ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <X className="h-3.5 w-3.5" aria-hidden="true" />}
      {label}
    </span>
  );
}

export default function PackageManager() {
  const { toast } = useToast();
  const {
    data: packages = [],
    isLoading,
    isError,
    refetch,
  } = useGetAdminProviderPackagesQuery();
  const [createPackage, { isLoading: isCreating }] =
    useCreateAdminProviderPackageMutation();
  const [updatePackage, { isLoading: isUpdating }] =
    useUpdateAdminProviderPackageMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateAdminProviderPackageStatusMutation();
  const [keyword, setKeyword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const activeCount = useMemo(
    () => packages.filter((item) => item.isActive).length,
    [packages],
  );
  const filteredPackages = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) return packages;
    return packages.filter((item) =>
      `${item.name} ${item.description ?? ""}`.toLowerCase().includes(normalized),
    );
  }, [keyword, packages]);

  const openCreate = () => {
    setEditingPackage(null);
    setForm(emptyForm);
    setFormError("");
    setDialogOpen(true);
  };

  const openEdit = (item) => {
    setEditingPackage(item);
    setForm({
      name: item.name,
      description: item.description ?? "",
      monthlyPrice: String(item.monthlyPrice),
      annualPrice: String(item.annualPrice),
      priorityCoefficient: String(item.priorityCoefficient),
      searchPriority: item.searchPriority,
      aiPriority: item.aiPriority,
      homePriority: item.homePriority,
      partnerBadge: item.partnerBadge,
    });
    setFormError("");
    setDialogOpen(true);
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = form.name.trim();
    const monthlyPrice = Number(form.monthlyPrice);
    const annualPrice = Number(form.annualPrice);
    const priorityCoefficient = Number(form.priorityCoefficient);

    if (name.length < 2 || name.length > 100) {
      setFormError("Tên gói phải có từ 2 đến 100 ký tự.");
      return;
    }
    if (
      !Number.isFinite(monthlyPrice) ||
      !Number.isFinite(annualPrice) ||
      monthlyPrice < 0 ||
      annualPrice < 0
    ) {
      setFormError("Giá tháng và giá năm phải là số không âm.");
      return;
    }
    if (!Number.isFinite(priorityCoefficient) || priorityCoefficient <= 0) {
      setFormError("Hệ số ưu tiên phải lớn hơn 0.");
      return;
    }

    const body = {
      name,
      description: form.description.trim() || null,
      monthlyPrice,
      annualPrice,
      priorityCoefficient,
      searchPriority: form.searchPriority,
      aiPriority: form.aiPriority,
      homePriority: form.homePriority,
      partnerBadge: form.partnerBadge,
    };

    try {
      if (editingPackage) {
        await updatePackage({ id: editingPackage.id, body }).unwrap();
      } else {
        await createPackage(body).unwrap();
      }
      setDialogOpen(false);
      toast({
        title: editingPackage ? "Đã cập nhật gói" : "Đã tạo gói",
        description: `${name} đã được lưu vào danh mục nhà cung cấp.`,
        variant: "success",
      });
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  const handleStatusChange = async (item) => {
    try {
      await updateStatus({ id: item.id, isActive: !item.isActive }).unwrap();
      toast({
        title: item.isActive ? "Đã vô hiệu hóa gói" : "Đã kích hoạt gói",
        description: item.name,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Không thể đổi trạng thái",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center" role="status" aria-label="Đang tải gói nhà cung cấp">
        <Loader2 className="h-7 w-7 animate-spin text-teal-700" aria-hidden="true" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4 py-8">
        <h1 className="text-2xl font-bold text-slate-950">Gói nhà cung cấp</h1>
        <div className="border-l-4 border-rose-600 bg-rose-50 p-4 text-sm text-rose-800" role="alert">
          Không thể tải danh mục gói nhà cung cấp.
        </div>
        <Button type="button" variant="outline" onClick={refetch}>
          <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Gói nhà cung cấp</h1>
          <p className="mt-1 text-sm text-slate-500">
            {packages.length} gói, {activeCount} đang hoạt động
          </p>
        </div>
        <Button type="button" onClick={openCreate} className="self-start sm:self-auto">
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          Tạo gói
        </Button>
      </header>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <label htmlFor="package-search" className="sr-only">Tìm gói nhà cung cấp</label>
        <input
          id="package-search"
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Tìm theo tên hoặc mô tả"
          className={`${inputClass} pl-9`}
        />
      </div>

      <section className="overflow-hidden rounded-md border border-slate-200 bg-white" aria-labelledby="package-table-title">
        <h2 id="package-table-title" className="sr-only">Danh sách gói nhà cung cấp</h2>
        {filteredPackages.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <BadgeCheck className="mx-auto h-8 w-8 text-slate-300" aria-hidden="true" />
            <p className="mt-3 text-sm font-medium text-slate-700">
              {packages.length === 0 ? "Chưa có gói nhà cung cấp" : "Không tìm thấy gói phù hợp"}
            </p>
          </div>
        ) : (
          <>
          <div className="divide-y divide-slate-100 md:hidden">
            {filteredPackages.map((item) => (
              <article key={item.id} className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-slate-950">{item.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                      {item.description || "Không có mô tả"}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded px-2 py-1 text-xs font-semibold ${
                    item.isActive
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-700"
                  }`}>
                    {item.isActive ? "Hoạt động" : "Đã tắt"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 rounded-md bg-slate-50 p-3 text-sm">
                  <div>
                    <div className="text-xs text-slate-500">Theo tháng</div>
                    <div className="mt-1 font-semibold text-slate-800">{formatCurrency(item.monthlyPrice)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Theo năm</div>
                    <div className="mt-1 font-semibold text-slate-800">{formatCurrency(item.annualPrice)}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <FeatureMark enabled={item.searchPriority} label="Tìm kiếm" />
                  <FeatureMark enabled={item.aiPriority} label="AI" />
                  <FeatureMark enabled={item.homePriority} label="Trang chủ" />
                  <FeatureMark enabled={item.partnerBadge} label="Huy hiệu" />
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-500">
                    Hệ số ưu tiên <strong className="text-slate-700">{item.priorityCoefficient}</strong>
                  </span>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(item)}
                      aria-label={`Sửa gói ${item.name}`}
                      title="Sửa gói"
                    >
                      <Edit3 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isUpdatingStatus}
                      onClick={() => handleStatusChange(item)}
                      aria-label={`${item.isActive ? "Vô hiệu hóa" : "Kích hoạt"} gói ${item.name}`}
                      title={item.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                      className={item.isActive ? "text-rose-700" : "text-emerald-700"}
                    >
                      {item.isActive ? <PowerOff className="h-4 w-4" aria-hidden="true" /> : <Power className="h-4 w-4" aria-hidden="true" />}
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-[980px] w-full border-collapse text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">Gói</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Giá</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Hệ số</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Quyền lợi</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Trạng thái</th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPackages.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="max-w-xs px-5 py-4 align-top">
                      <div className="font-semibold text-slate-900">{item.name}</div>
                      <div className="mt-1 line-clamp-2 text-xs text-slate-500">
                        {item.description || "Không có mô tả"}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 align-top text-slate-700">
                      <div>{formatCurrency(item.monthlyPrice)} / tháng</div>
                      <div className="mt-1 text-xs text-slate-500">{formatCurrency(item.annualPrice)} / năm</div>
                    </td>
                    <td className="px-5 py-4 align-top font-semibold text-slate-700">{item.priorityCoefficient}</td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex max-w-xs flex-wrap gap-1.5">
                        <FeatureMark enabled={item.searchPriority} label="Tìm kiếm" />
                        <FeatureMark enabled={item.aiPriority} label="AI" />
                        <FeatureMark enabled={item.homePriority} label="Trang chủ" />
                        <FeatureMark enabled={item.partnerBadge} label="Huy hiệu" />
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <span className={`inline-flex rounded px-2 py-1 text-xs font-semibold ${
                        item.isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-200 text-slate-700"
                      }`}>
                        {item.isActive ? "Hoạt động" : "Đã tắt"}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(item)}
                          aria-label={`Sửa gói ${item.name}`}
                          title="Sửa gói"
                        >
                          <Edit3 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={isUpdatingStatus}
                          onClick={() => handleStatusChange(item)}
                          aria-label={`${item.isActive ? "Vô hiệu hóa" : "Kích hoạt"} gói ${item.name}`}
                          title={item.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                          className={item.isActive ? "text-rose-700" : "text-emerald-700"}
                        >
                          {item.isActive ? <PowerOff className="h-4 w-4" aria-hidden="true" /> : <Power className="h-4 w-4" aria-hidden="true" />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </section>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader>
              <DialogTitle>{editingPackage ? "Sửa gói nhà cung cấp" : "Tạo gói nhà cung cấp"}</DialogTitle>
              <DialogDescription>
                {editingPackage ? editingPackage.name : "Nhập thông tin danh mục và quyền lợi của gói."}
              </DialogDescription>
            </DialogHeader>

            {formError && (
              <div className="border-l-4 border-rose-600 bg-rose-50 p-3 text-sm text-rose-800" role="alert">
                {formError}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="package-name" className="text-sm font-medium text-slate-700">Tên gói</label>
                <input
                  id="package-name"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className={inputClass}
                  maxLength={100}
                  required
                  autoFocus
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="package-description" className="text-sm font-medium text-slate-700">Mô tả</label>
                <textarea
                  id="package-description"
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  className={`${inputClass} min-h-24 resize-y py-2`}
                  maxLength={1000}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="monthly-price" className="text-sm font-medium text-slate-700">Giá tháng</label>
                <input id="monthly-price" type="number" min="0" step="1000" value={form.monthlyPrice} onChange={(event) => updateField("monthlyPrice", event.target.value)} className={inputClass} required />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="annual-price" className="text-sm font-medium text-slate-700">Giá năm</label>
                <input id="annual-price" type="number" min="0" step="1000" value={form.annualPrice} onChange={(event) => updateField("annualPrice", event.target.value)} className={inputClass} required />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="priority-coefficient" className="text-sm font-medium text-slate-700">Hệ số ưu tiên</label>
                <input id="priority-coefficient" type="number" min="0.01" max="999.99" step="0.01" value={form.priorityCoefficient} onChange={(event) => updateField("priorityCoefficient", event.target.value)} className={inputClass} required />
              </div>
            </div>

            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold text-slate-800">Quyền lợi</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["searchPriority", "Ưu tiên tìm kiếm"],
                  ["aiPriority", "Ưu tiên AI"],
                  ["homePriority", "Ưu tiên trang chủ"],
                  ["partnerBadge", "Huy hiệu đối tác"],
                ].map(([field, label]) => (
                  <label key={field} className="flex min-h-10 cursor-pointer items-center gap-3 rounded border border-slate-200 px-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={form[field]}
                      onChange={(event) => updateField(field, event.target.checked)}
                      className="h-4 w-4 accent-teal-700"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={isCreating || isUpdating}>
                Hủy
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {(isCreating || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                Lưu gói
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

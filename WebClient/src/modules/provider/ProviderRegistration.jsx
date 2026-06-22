import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, CheckCircle2, FileCheck2, Loader2, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { baseApi } from "../../api/baseApi";
import { useAppDispatch } from "../../store/hooks";
import {
  useGetProviderStatusQuery,
  useRegisterProviderMutation,
} from "../../store/apis/providerApi";
import {
  PROVIDER_APPROVED_ROUTES,
  PROVIDER_PENDING_ROUTES,
} from "../../router/routes";

const initialForm = {
  businessName: "",
  taxCode: "",
  licenseNumber: "",
  phone: "",
  address: "",
};

const normalizeStatus = (provider) =>
  String(provider?.status ?? provider?.trangThai ?? "").toUpperCase();

export default function ProviderRegistration() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const {
    data: providerStatus,
    isLoading: isLoadingStatus,
    isError: isStatusError,
    refetch,
  } = useGetProviderStatusQuery();
  const [registerProvider, { isLoading: isRegistering }] = useRegisterProviderMutation();
  const [form, setForm] = useState(initialForm);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!providerStatus?.registered) return;
    const status = normalizeStatus(providerStatus);
    navigate(
      status === "ACTIVE" || status === "APPROVED"
        ? PROVIDER_APPROVED_ROUTES.DASHBOARD
        : PROVIDER_PENDING_ROUTES.PENDING,
      { replace: true },
    );
  }, [navigate, providerStatus]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim()]),
    );

    if (payload.businessName.length < 2) {
      setError("Ten doanh nghiep can it nhat 2 ky tu.");
      return;
    }
    if (payload.taxCode.length < 3 || payload.licenseNumber.length < 3) {
      setError("Ma so thue va so giay phep la thong tin bat buoc.");
      return;
    }
    if (payload.phone.length < 8 || payload.address.length < 5) {
      setError("So dien thoai hoac dia chi doanh nghiep chua hop le.");
      return;
    }
    if (!confirmed) {
      setError("Ban can xac nhan thong tin dang ky la chinh xac.");
      return;
    }

    try {
      const result = await registerProvider(payload).unwrap();
      if (result?.success === false) {
        throw new Error(result.message ?? "Khong the dang ky nha cung cap.");
      }

      dispatch(baseApi.util.invalidateTags(["User", "Provider"]));
      toast({
        title: "Da tao ho so doanh nghiep",
        description: "Buoc tiep theo la nop giay to xac minh tren trang cho duyet.",
        variant: "success",
      });
      navigate(PROVIDER_PENDING_ROUTES.PENDING, { replace: true });
    } catch (err) {
      setError(
        err?.data?.message ??
          err?.message ??
          "Khong the dang ky nha cung cap. Vui long thu lai.",
      );
    }
  };

  if (isLoadingStatus) {
    return (
      <div className="container mx-auto flex min-h-[55vh] max-w-4xl items-center justify-center px-4">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 pb-14">
      <div className="mb-8">
        <p className="text-sm font-semibold text-primary">Khu vuc doi tac</p>
        <h1 className="mt-2 text-3xl font-bold text-foreground">Dang ky nha cung cap</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Tao ho so phap ly cua doanh nghiep. Giay to xac minh se duoc nop o buoc ke tiep.
        </p>
      </div>

      {isStatusError && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <span>Khong the kiem tra ho so hien tai.</span>
          <button type="button" className="font-semibold underline" onClick={() => refetch()}>
            Thu lai
          </button>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <form className="space-y-7" onSubmit={handleSubmit}>
          <section>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Thong tin doanh nghiep</h2>
                <p className="text-sm text-muted-foreground">Thong tin nay se duoc Admin doi chieu voi giay to.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <FormField
                id="provider-business-name"
                label="Ten doanh nghiep"
                value={form.businessName}
                onChange={(value) => updateField("businessName", value)}
                placeholder="Cong ty Du lich Bien Xanh"
                className="sm:col-span-2"
                maxLength={255}
                disabled={isRegistering}
              />
              <FormField
                id="provider-tax-code"
                label="Ma so thue"
                value={form.taxCode}
                onChange={(value) => updateField("taxCode", value)}
                placeholder="0101234567"
                maxLength={50}
                disabled={isRegistering}
              />
              <FormField
                id="provider-license-number"
                label="So giay phep"
                value={form.licenseNumber}
                onChange={(value) => updateField("licenseNumber", value)}
                placeholder="GP-2026-001"
                maxLength={100}
                disabled={isRegistering}
              />
              <FormField
                id="provider-phone"
                label="So dien thoai lien he"
                value={form.phone}
                onChange={(value) => updateField("phone", value)}
                placeholder="0901234567"
                maxLength={20}
                disabled={isRegistering}
              />
              <FormField
                id="provider-address"
                label="Dia chi doanh nghiep"
                value={form.address}
                onChange={(value) => updateField("address", value)}
                placeholder="Quan Hai Chau, Da Nang"
                className="sm:col-span-2"
                maxLength={500}
                disabled={isRegistering}
              />
            </div>
          </section>

          <section className="border-t pt-7">
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-muted-foreground">
              <input
                className="mt-1 h-4 w-4 accent-primary"
                type="checkbox"
                checked={confirmed}
                onChange={(event) => {
                  setConfirmed(event.target.checked);
                  if (error) setError("");
                }}
              />
              <span>
                Toi xac nhan thong tin phap ly la chinh xac va chap nhan quy trinh kiem duyet doi tac.
              </span>
            </label>
          </section>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-md border bg-background px-5 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Quay lai
            </Link>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isRegistering || !confirmed}
            >
              {isRegistering ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Tao ho so
            </button>
          </div>
        </form>

        <aside className="h-fit rounded-md border bg-background p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <FileCheck2 className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-foreground">Quy trinh xac minh</h2>
          </div>
          <div className="mt-5 space-y-4 text-sm text-muted-foreground">
            {[
              "Tao ho so voi thong tin phap ly cua doanh nghiep.",
              "Nop ban PDF/JPG/PNG cua giay phep, toi da 5 MB.",
              "Admin xem giay to truoc khi kich hoat khu Provider.",
            ].map((item) => (
              <p key={item} className="flex items-start gap-2 leading-6">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                {item}
              </p>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function FormField({ id, label, value, onChange, placeholder, className = "", ...inputProps }) {
  return (
    <div className={className}>
      <label className="text-sm font-semibold text-foreground" htmlFor={id}>{label}</label>
      <input
        id={id}
        className="mt-2 h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required
        {...inputProps}
      />
    </div>
  );
}

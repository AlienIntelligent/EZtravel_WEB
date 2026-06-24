import { useState } from "react";
import { Link } from "react-router-dom";
import { AUTH_ROUTES } from "../../router/routes";
import {
 Building2,
 CalendarDays,
 Camera,
 KeyRound,
 Loader2,
 Mail,
 Phone,
 Save,
 ShieldCheck,
 UserRound,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
 useGetProfileQuery,
 useUpdateAvatarMutation,
 useUpdatePasswordMutation,
 useUpdateProfileMutation,
} from "../../store/apis/authApi";
import PageHero from "@/shared/components/PageHero";

const formatDate = (value) => {
 if (!value) return "Chưa cập nhật";
 const date = new Date(value);
 if (Number.isNaN(date.getTime())) return "Chưa cập nhật";
 return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(date);
};

const responseError = (response, fallback) =>
 response?.success === false ? response?.message ?? fallback : "";

export default function Profile() {
 const { toast } = useToast();
 const { data: profile, isLoading, isError, refetch } = useGetProfileQuery();
 const [updateProfile, { isLoading: isSavingProfile }] = useUpdateProfileMutation();
 const [updateAvatar, { isLoading: isSavingAvatar }] = useUpdateAvatarMutation();
 const [updatePassword, { isLoading: isSavingPassword }] = useUpdatePasswordMutation();

 const [profileFormDraft, setProfileFormDraft] = useState(null);
 const [avatarUrlDraft, setAvatarUrlDraft] = useState(null);
 const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
 const [profileError, setProfileError] = useState("");
 const [avatarError, setAvatarError] = useState("");
 const [passwordError, setPasswordError] = useState("");

 const profileForm = profileFormDraft ?? {
 fullName: profile?.fullName ?? profile?.hoTen ?? profile?.name ?? "",
 phone: profile?.phone ?? profile?.soDienThoai ?? "",
 };
 const avatarUrl = avatarUrlDraft ?? profile?.avatarUrl ?? "";

 const handleProfileSubmit = async (event) => {
 event.preventDefault();
 const fullName = profileForm.fullName.trim();
 if (!fullName) {
 setProfileError("Họ tên là bắt buộc.");
 return;
 }

 try {
 const result = await updateProfile({ fullName, phone: profileForm.phone.trim() }).unwrap();
 const error = responseError(result, "Không thể cập nhật hồ sơ.");
 if (error) throw new Error(error);
 setProfileError("");
 toast({ title: "Đã cập nhật hồ sơ", description: "Thông tin cá nhân đã được lưu.", variant: "success" });
 } catch (err) {
 const message = err?.data?.message ?? err?.message ?? "Không thể cập nhật hồ sơ.";
 setProfileError(message);
 }
 };

 const handleAvatarSubmit = async (event) => {
 event.preventDefault();
 try {
 const result = await updateAvatar({ avatarUrl: avatarUrl.trim() }).unwrap();
 const error = responseError(result, "Không thể cập nhật ảnh đại diện.");
 if (error) throw new Error(error);
 setAvatarError("");
 toast({ title: "Đã cập nhật ảnh", description: "Ảnh đại diện đã được lưu.", variant: "success" });
 } catch (err) {
 const message = err?.data?.message ?? err?.message ?? "Không thể cập nhật ảnh đại diện.";
 setAvatarError(message);
 }
 };

 const handlePasswordSubmit = async (event) => {
 event.preventDefault();
 if (passwordForm.newPassword.length < 8) {
 setPasswordError("Mật khẩu mới cần ít nhất 8 ký tự.");
 return;
 }
 if (passwordForm.newPassword !== passwordForm.confirmPassword) {
 setPasswordError("Xác nhận mật khẩu không khớp.");
 return;
 }

 try {
 const result = await updatePassword({
 oldPassword: passwordForm.oldPassword,
 newPassword: passwordForm.newPassword,
 }).unwrap();
 const error = responseError(result, "Không thể đổi mật khẩu.");
 if (error) throw new Error(error);
 setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
 setPasswordError("");
 toast({ title: "Đã đổi mật khẩu", description: "Mật khẩu mới đã có hiệu lực.", variant: "success" });
 } catch (err) {
 const message = err?.data?.message ?? err?.message ?? "Không thể đổi mật khẩu.";
 setPasswordError(message);
 }
 };

 if (isLoading) {
 return (
 <div className="container mx-auto max-w-5xl px-4 py-8">
 <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
 <div className="h-72 animate-pulse rounded-md bg-muted/40" />
 <div className="h-96 animate-pulse rounded-md bg-muted/40" />
 </div>
 </div>
 );
 }

 if (isError || !profile) {
 return (
 <div className="container mx-auto max-w-5xl px-4 py-8">
 <div className="rounded-md border border-red-200 bg-red-50 p-5 text-sm text-red-700">
 Không thể tải hồ sơ.{" "}
 <button type="button" className="font-semibold underline" onClick={() => refetch()}>
 Thử lại
 </button>
 </div>
 </div>
 );
 }

 const fullName = profile.fullName ?? profile.hoTen ?? profile.name ?? "Traveler";
 const role = profile.role ?? profile.vaiTro ?? "TRAVELER";
 const status = profile.status ?? profile.trangThai ?? "ACTIVE";

 return (
 <div className="w-full">
 <PageHero
 title="Hồ sơ cá nhân"
 description="Quản lý thông tin đăng nhập và danh tính hiển thị trên ezTravel."
 bgImage="/images/bg_1.jpg"
 />
 <div className="container mx-auto max-w-5xl px-4 py-8 pb-14">
 <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
 <aside className="h-fit rounded-md border bg-background p-5 shadow-sm">
 <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-muted">
 {avatarUrl ? (
 <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop"; }} />
 ) : (
 <UserRound className="h-10 w-10 text-muted-foreground" />
 )}
 </div>
 <div className="mt-4 text-center">
 <h2 className="font-bold text-foreground">{fullName}</h2>
 <p className="mt-1 text-sm text-muted-foreground">{profile.email}</p>
 </div>

 <dl className="mt-6 space-y-4 border-t pt-5 text-sm">
 <div className="flex items-center justify-between gap-3">
 <dt className="inline-flex items-center gap-2 text-muted-foreground">
 <ShieldCheck className="h-4 w-4" /> Vai trò
 </dt>
 <dd className="font-semibold text-foreground">{role}</dd>
 </div>
 <div className="flex items-center justify-between gap-3">
 <dt className="text-muted-foreground">Trạng thái</dt>
 <dd className="font-semibold text-emerald-600">{status}</dd>
 </div>
 <div className="flex items-center justify-between gap-3">
 <dt className="inline-flex items-center gap-2 text-muted-foreground">
 <CalendarDays className="h-4 w-4" /> Tham gia
 </dt>
 <dd className="text-right font-semibold text-foreground">{formatDate(profile.createdAt)}</dd>
 </div>
 </dl>

 {profile.providerId ? (
 <div className="mt-5 border-t pt-5">
 <p className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
 <Building2 className="h-4 w-4" /> Nhà cung cấp
 </p>
 <p className="mt-2 text-sm font-bold text-foreground">{profile.providerName ?? profile.tenDoanhNghiep}</p>
 <p className="mt-1 text-xs text-muted-foreground">{profile.providerStatus ?? "PENDING"}</p>
 </div>
 ) : (
 <div className="mt-5 border-t pt-5">
 <p className="text-sm font-medium leading-relaxed text-muted-foreground">
 Bạn có dịch vụ du lịch? Hãy đăng ký làm đối tác để tiếp cận hàng triệu du khách.
 </p>
 <Link
 to={AUTH_ROUTES.PROVIDER_REGISTRATION}
 className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-primary text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
 >
 <Building2 className="h-4 w-4" />
 Trở thành Nhà cung cấp
 </Link>
 </div>
 )}
 </aside>

 <main className="space-y-9">
 <section>
 <div className="mb-5">
 <h2 className="text-xl font-bold text-foreground">Thông tin cá nhân</h2>
 <p className="mt-1 text-sm text-muted-foreground">Email là định danh đăng nhập và không thay đổi tại đây.</p>
 </div>
 <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleProfileSubmit}>
 <div>
 <label className="text-sm font-semibold text-foreground" htmlFor="profile-name">Họ tên</label>
 <input
 id="profile-name"
 className="mt-2 h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary"
 value={profileForm.fullName}
 onChange={(event) => {
 setProfileFormDraft((current) => ({ ...(current ?? profileForm), fullName: event.target.value }));
 if (profileError) setProfileError("");
 }}
 disabled={isSavingProfile}
 maxLength={200}
 required
 />
 </div>
 <div>
 <label className="text-sm font-semibold text-foreground" htmlFor="profile-phone">Số điện thoại</label>
 <div className="relative mt-2">
 <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
 <input
 id="profile-phone"
 className="h-11 w-full rounded-md border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary"
 value={profileForm.phone}
 onChange={(event) => setProfileFormDraft((current) => ({ ...(current ?? profileForm), phone: event.target.value }))}
 disabled={isSavingProfile}
 maxLength={30}
 type="tel"
 />
 </div>
 </div>
 <div className="sm:col-span-2">
 <label className="text-sm font-semibold text-foreground" htmlFor="profile-email">Email</label>
 <div className="relative mt-2">
 <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
 <input
 id="profile-email"
 className="h-11 w-full rounded-md border bg-muted/40 pl-10 pr-3 text-sm text-muted-foreground"
 value={profile.email ?? ""}
 disabled
 />
 </div>
 </div>
 {profileError && <p className="text-sm text-red-600 sm:col-span-2">{profileError}</p>}
 <button
 type="submit"
 className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60 sm:col-span-2"
 disabled={!profileForm.fullName.trim() || isSavingProfile}
 >
 {isSavingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
 Lưu thông tin
 </button>
 </form>
 </section>

 <section className="border-t pt-8">
 <div className="mb-5">
 <h2 className="text-xl font-bold text-foreground">Ảnh đại diện</h2>
 <p className="mt-1 text-sm text-muted-foreground">Dùng URL ảnh công khai; để trống để xóa ảnh hiện tại.</p>
 </div>
 <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleAvatarSubmit}>
 <input
 className="h-11 flex-1 rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary"
 placeholder="https://..."
 value={avatarUrl}
 onChange={(event) => {
 setAvatarUrlDraft(event.target.value);
 if (avatarError) setAvatarError("");
 }}
 disabled={isSavingAvatar}
 type="url"
 />
 <button
 type="submit"
 className="inline-flex h-11 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-60"
 disabled={isSavingAvatar}
 >
 {isSavingAvatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
 Cập nhật ảnh
 </button>
 </form>
 {avatarError && <p className="mt-3 text-sm text-red-600">{avatarError}</p>}
 </section>

 <section className="border-t pt-8">
 <div className="mb-5">
 <h2 className="text-xl font-bold text-foreground">Đổi mật khẩu</h2>
 <p className="mt-1 text-sm text-muted-foreground">Mật khẩu mới cần ít nhất 8 ký tự.</p>
 </div>
 <form className="grid gap-5 sm:grid-cols-2" onSubmit={handlePasswordSubmit}>
 <div className="sm:col-span-2">
 <label className="text-sm font-semibold text-foreground" htmlFor="current-password">Mật khẩu hiện tại</label>
 <input
 id="current-password"
 className="mt-2 h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary"
 value={passwordForm.oldPassword}
 onChange={(event) => setPasswordForm((current) => ({ ...current, oldPassword: event.target.value }))}
 disabled={isSavingPassword}
 type="password"
 autoComplete="current-password"
 required
 />
 </div>
 <div>
 <label className="text-sm font-semibold text-foreground" htmlFor="new-password">Mật khẩu mới</label>
 <input
 id="new-password"
 className="mt-2 h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary"
 value={passwordForm.newPassword}
 onChange={(event) => {
 setPasswordForm((current) => ({ ...current, newPassword: event.target.value }));
 if (passwordError) setPasswordError("");
 }}
 disabled={isSavingPassword}
 type="password"
 autoComplete="new-password"
 required
 />
 </div>
 <div>
 <label className="text-sm font-semibold text-foreground" htmlFor="confirm-password">Nhập lại mật khẩu</label>
 <input
 id="confirm-password"
 className="mt-2 h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary"
 value={passwordForm.confirmPassword}
 onChange={(event) => setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))}
 disabled={isSavingPassword}
 type="password"
 autoComplete="new-password"
 required
 />
 </div>
 {passwordError && <p className="text-sm text-red-600 sm:col-span-2">{passwordError}</p>}
 <button
 type="submit"
 className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60 sm:col-span-2"
 disabled={!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword || isSavingPassword}
 >
 {isSavingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
 Đổi mật khẩu
 </button>
 </form>
 </section>
 </main>
 </div>
      </div>
    </div>
  );
}

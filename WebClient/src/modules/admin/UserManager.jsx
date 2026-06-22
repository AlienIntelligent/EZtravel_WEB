import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Filter,
  Loader2,
  Lock,
  RefreshCw,
  Search,
  Unlock,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetAdminUsersQuery,
  useUpdateUserStatusMutation,
} from "../../store/apis/adminApi";

const roleStyles = {
  ADMIN: "bg-red-50 text-red-700",
  PROVIDER: "bg-cyan-50 text-cyan-700",
  TRAVELER: "bg-slate-100 text-slate-700",
};

const statusStyles = {
  ACTIVE: "bg-emerald-50 text-emerald-700",
  LOCKED: "bg-red-50 text-red-700",
  INACTIVE: "bg-slate-100 text-slate-600",
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("vi-VN").format(date);
};

const normalizedStatus = (user) =>
  String(user.status ?? user.trangThai ?? "ACTIVE").toUpperCase();

function UserAvatar({ name }) {
  const initial = name?.trim().charAt(0).toUpperCase() || "U";
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-white">
      {initial}
    </span>
  );
}

function StatusAction({ user, isLoading, onClick }) {
  if (user.role === "ADMIN") {
    return <span className="text-xs text-slate-400">Không áp dụng</span>;
  }

  const isLocked = ["LOCKED", "INACTIVE"].includes(normalizedStatus(user));
  const label = `${isLocked ? "Mở khóa" : "Khóa"} ${user.hoTen}`;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => onClick(user)}
      disabled={isLoading}
      aria-label={label}
      title={label}
      className={isLocked ? "text-emerald-700 hover:bg-emerald-50" : "text-red-600 hover:bg-red-50"}
    >
      {isLocked ? (
        <Unlock className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Lock className="h-4 w-4" aria-hidden="true" />
      )}
    </Button>
  );
}

export default function UserManager() {
  const [keyword, setKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const { data: users = [], isLoading, isError, refetch } =
    useGetAdminUsersQuery();
  const [updateUserStatus, { isLoading: isUpdating }] =
    useUpdateUserStatusMutation();

  const filteredUsers = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return users.filter((user) => {
      const name = String(user.hoTen ?? "").toLowerCase();
      const email = String(user.email ?? "").toLowerCase();
      return (
        (!normalizedKeyword ||
          name.includes(normalizedKeyword) ||
          email.includes(normalizedKeyword)) &&
        (!roleFilter || user.role === roleFilter)
      );
    });
  }, [users, keyword, roleFilter]);

  const handleStatusChange = async (user) => {
    const currentStatus = normalizedStatus(user);
    const nextStatus = ["LOCKED", "INACTIVE"].includes(currentStatus)
      ? "ACTIVE"
      : "LOCKED";
    const action = nextStatus === "ACTIVE" ? "mở khóa" : "khóa";

    if (!window.confirm(`Bạn có chắc muốn ${action} tài khoản "${user.hoTen}"?`)) {
      return;
    }

    try {
      await updateUserStatus({
        id: user.id,
        body: { status: nextStatus },
      }).unwrap();
    } catch {
      window.alert("Không thể cập nhật trạng thái tài khoản. Vui lòng thử lại.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center" role="status">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-red-500" aria-hidden="true" />
          Đang tải danh sách người dùng...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-5 py-4">
        <div>
          <h1 className="page-title">Quản lý người dùng</h1>
          <p className="page-description">Không thể tải danh sách từ backend.</p>
        </div>
        <div className="flex max-w-xl items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          Vui lòng kiểm tra Gateway hoặc thử tải lại dữ liệu.
        </div>
        <Button type="button" variant="outline" onClick={refetch}>
          <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="page-title">Quản lý người dùng</h1>
        <p className="page-description">
          Tìm kiếm theo tên hoặc email, kiểm tra vai trò và cập nhật trạng thái tài khoản.
        </p>
      </header>

      <section className="overflow-hidden rounded-md border border-slate-200 bg-white" aria-labelledby="users-table-title">
        <div className="grid gap-3 border-b border-slate-200 p-4 sm:grid-cols-[minmax(0,1fr)_220px]">
          <label className="relative block">
            <span className="sr-only">Tìm người dùng</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm theo họ tên hoặc email"
              className="h-10 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </label>
          <label className="relative block">
            <span className="sr-only">Lọc theo vai trò</span>
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="h-10 w-full appearance-none rounded-md border border-slate-300 bg-white pl-9 pr-8 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Tất cả vai trò</option>
              <option value="TRAVELER">Traveler</option>
              <option value="PROVIDER">Provider</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>
        </div>

        <h2 id="users-table-title" className="sr-only">Danh sách người dùng</h2>

        {filteredUsers.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Users className="mx-auto h-8 w-8 text-slate-300" aria-hidden="true" />
            <p className="mt-3 text-sm font-medium text-slate-700">
              Không tìm thấy người dùng phù hợp.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-semibold">Người dùng</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Email</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Vai trò</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Ngày tạo</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Trạng thái</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => {
                    const status = normalizedStatus(user);
                    return (
                      <tr key={user.id} className="transition-colors hover:bg-slate-50">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <UserAvatar name={user.hoTen} />
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-slate-900">{user.hoTen}</p>
                              <p className="mt-0.5 text-xs text-slate-500">ID: {user.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="max-w-[260px] truncate px-5 py-3 text-slate-700" title={user.email}>
                          {user.email}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex rounded px-2 py-1 text-xs font-semibold ${roleStyles[user.role] ?? roleStyles.TRAVELER}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3 text-slate-600">{formatDate(user.createdAt)}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex rounded px-2 py-1 text-xs font-semibold ${statusStyles[status] ?? statusStyles.INACTIVE}`}>
                            {status === "ACTIVE" ? "Hoạt động" : status === "LOCKED" ? "Bị khóa" : status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <StatusAction user={user} isLoading={isUpdating} onClick={handleStatusChange} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-slate-200 md:hidden">
              {filteredUsers.map((user) => {
                const status = normalizedStatus(user);
                return (
                  <article key={user.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <UserAvatar name={user.hoTen} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-slate-900">{user.hoTen}</h3>
                            <p className="mt-1 break-all text-sm text-slate-600">{user.email}</p>
                          </div>
                          <StatusAction user={user} isLoading={isUpdating} onClick={handleStatusChange} />
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                          <span className={`rounded px-2 py-1 font-semibold ${roleStyles[user.role] ?? roleStyles.TRAVELER}`}>
                            {user.role}
                          </span>
                          <span className={`rounded px-2 py-1 font-semibold ${statusStyles[status] ?? statusStyles.INACTIVE}`}>
                            {status === "ACTIVE" ? "Hoạt động" : status === "LOCKED" ? "Bị khóa" : status}
                          </span>
                          <span className="text-slate-500">{formatDate(user.createdAt)}</span>
                          <span className="text-slate-400">ID {user.id}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        <footer className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500 sm:text-sm">
          Hiển thị {filteredUsers.length} / {users.length} người dùng
        </footer>
      </section>
    </div>
  );
}

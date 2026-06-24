import { useMemo, useState, useEffect, useRef } from "react";
import {
  Loader2,
  Lock,
  RefreshCw,
  Search,
  Users,
  Download,
  Plus,
  User,
  CheckCircle2,
  UserCheck,
  Clock,
  Filter,
  X,
  Eye,
  Edit2,
  MoreVertical,
  Key,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUpload from "../../shared/components/ImageUpload";
import {
  useGetAdminUsersQuery,
  useUpdateUserStatusMutation,
} from "../../store/apis/adminApi";

const roleColors = {
  TRAVELER: 'bg-slate-100 text-slate-600',
  PREMIUM_TRAVELER: 'bg-blue-50 text-blue-600',
  PROVIDER: 'bg-teal-50 text-teal-600',
  ADMIN: 'bg-red-50 text-red-600'
};

const statusColors = {
  ACTIVE: { bg: 'bg-emerald-50 border-emerald-100 text-emerald-700', dot: 'bg-emerald-500', text: 'Hoạt động' },
  PENDING: { bg: 'bg-orange-50 border-orange-100 text-orange-700', dot: 'bg-orange-500', text: 'Đang chờ duyệt' },
  LOCKED: { bg: 'bg-red-50 border-red-100 text-red-700', dot: 'bg-red-500', text: 'Bị khóa' },
  INACTIVE: { bg: 'bg-slate-50 border-slate-200 text-slate-600', dot: 'bg-slate-400', text: 'Không HĐ' }
};

const getAvatarColor = (name) => {
  const char = name ? name.charAt(0).toUpperCase() : 'U';
  if (['A','B','C','D'].includes(char)) return 'bg-blue-600';
  if (['E','F','G','H'].includes(char)) return 'bg-emerald-600';
  if (['I','J','K','L'].includes(char)) return 'bg-orange-500';
  if (['M','N','O','P','Q'].includes(char)) return 'bg-slate-800';
  return 'bg-slate-500';
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
};

const normalizedStatus = (user) => {
  const status = String(user.status ?? user.trangThai ?? "ACTIVE").toUpperCase();
  if (status === "PENDING" || status === "CHO_DUYET") return "PENDING";
  if (status === "LOCKED" || status === "BI_KHOA") return "LOCKED";
  if (status === "ACTIVE" || status === "HOAT_DONG") return "ACTIVE";
  return "INACTIVE";
};

function UserAvatar({ name }) {
  const initial = name?.trim().charAt(0).toUpperCase() || "U";
  const bgColor = getAvatarColor(name);
  return (
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${bgColor} text-sm font-semibold text-white`}>
      {initial}
    </span>
  );
}

export default function UserManager() {
  const [keyword, setKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const dropdownRef = useRef(null);

  const { data: users = [], isLoading, isError, refetch } = useGetAdminUsersQuery();
  const [updateUserStatus, { isLoading: isUpdating }] = useUpdateUserStatusMutation();

  // Handle outside click for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return users.filter((user) => {
      const name = String(user.hoTen ?? "").toLowerCase();
      const email = String(user.email ?? "").toLowerCase();
      return (
        (!normalizedKeyword || name.includes(normalizedKeyword) || email.includes(normalizedKeyword)) &&
        (!roleFilter || user.role === roleFilter)
      );
    });
  }, [users, keyword, roleFilter]);

  const totalUsers = users.length;
  const activeUsers = users.filter(u => normalizedStatus(u) === 'ACTIVE').length;
  const providerUsers = users.filter(u => u.role === 'PROVIDER').length;
  const pendingUsers = users.filter(u => normalizedStatus(u) === 'PENDING').length;
  const lockedUsers = users.filter(u => normalizedStatus(u) === 'LOCKED').length;

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentData = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleStatusChange = async (user, nextStatus) => {
    setOpenDropdownId(null);
    const action = nextStatus === "ACTIVE" ? "mở khóa" : "khóa";
    if (!window.confirm(`Bạn có chắc muốn ${action} tài khoản "${user.hoTen}"?`)) return;

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
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
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
          <h1 className="text-2xl font-bold text-foreground">Quản lý người dùng</h1>
          <p className="mt-1 text-sm text-muted-foreground">Không thể tải danh sách từ backend.</p>
        </div>
        <div className="flex max-w-xl items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          Vui lòng kiểm tra kết nối mạng hoặc thử tải lại dữ liệu.
        </div>
        <Button type="button" variant="outline" onClick={refetch}>
          <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-10 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quản lý người dùng</h1>
          <p className="text-sm text-muted-foreground mt-1">Danh sách người dùng được lấy từ endpoint hiện có của backend.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2 bg-white">
            <Download className="w-4 h-4" /> Xuất dữ liệu
          </Button>
          <Button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white">
            <Plus className="w-4 h-4" /> Thêm người dùng
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 border border-border bg-background rounded-t-md divide-x divide-y lg:divide-y-0 divide-border overflow-hidden">
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <User className="w-4 h-4" /> Tổng người dùng
          </div>
          <div className="text-2xl font-bold text-foreground">{totalUsers.toLocaleString('vi-VN')}</div>
        </div>
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-500" /> Đang hoạt động
          </div>
          <div className="text-2xl font-bold text-foreground">{activeUsers.toLocaleString('vi-VN')}</div>
        </div>
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <UserCheck className="w-4 h-4 text-blue-500" /> Nhà cung cấp
          </div>
          <div className="text-2xl font-bold text-foreground">{providerUsers.toLocaleString('vi-VN')}</div>
        </div>
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Clock className="w-4 h-4 text-orange-500" /> Đang chờ duyệt
          </div>
          <div className="text-2xl font-bold text-foreground">{pendingUsers.toLocaleString('vi-VN')}</div>
        </div>
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Lock className="w-4 h-4 text-red-500" /> Bị khóa
          </div>
          <div className="text-2xl font-bold text-foreground">{lockedUsers.toLocaleString('vi-VN')}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-4 border border-t-0 border-b-0 border-border bg-background">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => { setKeyword(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-8 h-10 rounded-md border border-input text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            placeholder="Tìm theo họ tên hoặc email"
          />
          {keyword && (
            <button onClick={() => setKeyword('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="w-[180px] relative">
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
            className="w-full h-10 pl-3 pr-8 rounded-md border border-input text-sm appearance-none bg-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all cursor-pointer"
          >
            <option value="">Tất cả vai trò</option>
            <option value="TRAVELER">TRAVELER</option>
            <option value="PREMIUM_TRAVELER">PREMIUM_TRAVELER</option>
            <option value="PROVIDER">PROVIDER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        <Button variant="outline" className="flex items-center gap-2 h-10 bg-white">
          <Filter className="w-4 h-4" /> Bộ lọc
        </Button>
        <Button variant="outline" className="h-10 w-10 p-0 flex items-center justify-center bg-white" onClick={refetch}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Table Area */}
      <div className="border border-border bg-background rounded-b-md overflow-visible relative">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-border bg-slate-50/50 text-xs font-semibold text-slate-600">
              <tr>
                <th scope="col" className="px-6 py-4">Người dùng &#8597;</th>
                <th scope="col" className="px-6 py-4">Email</th>
                <th scope="col" className="px-6 py-4">Vai trò &#8597;</th>
                <th scope="col" className="px-6 py-4">Ngày tạo &#8597;</th>
                <th scope="col" className="px-6 py-4">Trạng thái &#8597;</th>
                <th scope="col" className="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-muted-foreground">
                    Không tìm thấy người dùng phù hợp.
                  </td>
                </tr>
              ) : (
                currentData.map((user) => {
                  const status = normalizedStatus(user);
                  const statusConfig = statusColors[status] || statusColors.INACTIVE;
                  const isMenuOpen = openDropdownId === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <UserAvatar name={user.hoTen} />
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate">{user.hoTen}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">
                        {user.email}
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex rounded text-[11px] font-bold px-2 py-1 uppercase tracking-wider ${roleColors[user.role] || roleColors.TRAVELER}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-3">
                        <div className={`inline-flex items-center gap-1.5 border rounded-full px-2.5 py-1 text-xs font-semibold ${statusConfig.bg}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></div>
                          {statusConfig.text}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-center gap-2 relative">
                          <button 
                            className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-slate-100 transition-colors" 
                            title="Xem chi tiết"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-slate-100 transition-colors" title="Chỉnh sửa">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          
                          {/* Dropdown Menu Trigger */}
                          <button 
                            className={`p-1 rounded transition-colors ${isMenuOpen ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'text-muted-foreground hover:text-foreground hover:bg-slate-100'}`}
                            onClick={() => setOpenDropdownId(isMenuOpen ? null : user.id)}
                            title="Nhiều hơn"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Dropdown Menu Content */}
                          {isMenuOpen && (
                            <div 
                              ref={dropdownRef}
                              className="absolute right-12 top-0 mt-8 w-48 bg-white border border-border shadow-lg rounded-md py-1 z-50 flex flex-col"
                            >
                              <button 
                                className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-slate-50 w-full text-left"
                                onClick={() => { setSelectedUser(user); setOpenDropdownId(null); }}
                              >
                                <Eye className="w-4 h-4 text-muted-foreground" /> Xem chi tiết
                              </button>
                              <button className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-slate-50 w-full text-left">
                                <Edit2 className="w-4 h-4 text-muted-foreground" /> Chỉnh sửa
                              </button>
                              <button className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-slate-50 w-full text-left">
                                <Key className="w-4 h-4 text-muted-foreground" /> Đổi mật khẩu
                              </button>
                              <button 
                                className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-slate-50 w-full text-left"
                                onClick={() => handleStatusChange(user, status === 'LOCKED' ? 'ACTIVE' : 'LOCKED')}
                              >
                                {status === 'LOCKED' ? (
                                  <><Lock className="w-4 h-4 text-emerald-600" /> <span className="text-emerald-600">Mở khóa tài khoản</span></>
                                ) : (
                                  <><Lock className="w-4 h-4 text-muted-foreground" /> Khóa tài khoản</>
                                )}
                              </button>
                              <button className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left border-t border-slate-100 mt-1 pt-2">
                                <Trash2 className="w-4 h-4" /> Xóa
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="border-t border-border p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-background">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Hiển thị</span>
            <select 
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="h-8 border border-input rounded-md px-2 bg-transparent focus:outline-none focus:border-blue-500"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <span>trên mỗi trang</span>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center border border-border rounded hover:bg-slate-50 disabled:opacity-50"
              >
                &lt;
              </button>
              
              {/* Pagination logic simplified for demo */}
              {[...Array(Math.min(3, totalPages))].map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 flex items-center justify-center border rounded ${
                    currentPage === idx + 1 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'border-border hover:bg-slate-50 text-foreground'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              
              {totalPages > 3 && (
                <span className="px-1 text-muted-foreground">...</span>
              )}

              {totalPages > 3 && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-8 h-8 flex items-center justify-center border rounded ${
                    currentPage === totalPages 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'border-border hover:bg-slate-50 text-foreground'
                  }`}
                >
                  {totalPages}
                </button>
              )}

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center border border-border rounded hover:bg-slate-50 disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            Tổng {filteredUsers.length.toLocaleString('vi-VN')} người dùng
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card w-full max-w-2xl rounded-xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Hồ sơ người dùng
              </h3>
              <button onClick={() => setSelectedUser(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="info">Thông tin cá nhân</TabsTrigger>
                  <TabsTrigger value="avatar">Avatar</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-6 mt-0">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                      <UserAvatar name={selectedUser.hoTen} />
                      <div>
                        <h4 className="text-xl font-bold text-foreground">{selectedUser.hoTen}</h4>
                        <p className="text-sm text-muted-foreground mt-0.5">{selectedUser.email}</p>
                      </div>
                    </div>
                    <div>
                      <span className={`inline-flex rounded text-[11px] font-bold px-2 py-1 uppercase tracking-wider ${roleColors[selectedUser.role] || roleColors.TRAVELER}`}>
                        {selectedUser.role}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Ngày tham gia</p>
                      <p className="font-medium text-foreground">{formatDate(selectedUser.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Trạng thái hiện tại</p>
                      <div className={`inline-flex items-center gap-1.5 border rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors[normalizedStatus(selectedUser)]?.bg}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${statusColors[normalizedStatus(selectedUser)]?.dot}`}></div>
                        {statusColors[normalizedStatus(selectedUser)]?.text}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="avatar" className="mt-0 space-y-4">
                  <p className="text-sm font-semibold text-foreground mb-2">Ảnh đại diện (Avatar)</p>
                  <div className="flex flex-col gap-4">
                    <ImageUpload 
                      currentImage={selectedUser.avatarUrl} 
                      onUpload={(file) => console.log("Uploaded avatar:", file)}
                      label="Tải ảnh đại diện lên"
                      helpText="Định dạng JPG, PNG, WEBP (Tối đa 2MB, vuông 1:1)"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedUser(null)}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

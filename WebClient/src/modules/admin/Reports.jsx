import { useState, useMemo } from 'react';
import { 
  Search, Filter, Eye, AlertTriangle, ShieldCheck, CheckCircle, 
  Trash2, XCircle, Clock, FileText, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Pagination from '../../shared/components/Pagination';

// MOCK DATA
const MOCK_REPORTS = Array.from({ length: 28 }).map((_, i) => {
  const statusList = ['PENDING', 'RESOLVED', 'DISMISSED'];
  const types = ['SPAM', 'INAPPROPRIATE', 'SCAM', 'COPYRIGHT'];
  const targets = ['POST', 'SERVICE', 'USER_PROFILE', 'REVIEW'];
  return {
    id: `REP-${8000 + i}`,
    reporter: `User ${Math.floor(Math.random() * 100) + 1}`,
    targetType: targets[i % 4],
    targetId: `TGT-${Math.floor(Math.random() * 5000)}`,
    reasonType: types[i % 4],
    status: i < 5 ? 'PENDING' : statusList[Math.floor(Math.random() * statusList.length)],
    createdAt: new Date(Date.now() - Math.random() * 5000000000).toISOString(),
    description: `Tôi nghi ngờ nội dung này là giả mạo hoặc có tính chất lừa đảo. Vui lòng kiểm tra lại hình ảnh và mô tả để đảm bảo an toàn cho cộng đồng.`
  };
});

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const ITEMS_PER_PAGE = 10;

  // Filter & Pagination Logic
  const filteredData = useMemo(() => {
    return MOCK_REPORTS.filter(item => {
      const matchSearch = item.reporter.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.targetId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'PENDING': return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-200">Chờ xử lý</Badge>;
      case 'RESOLVED': return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200">Đã giải quyết</Badge>;
      case 'DISMISSED': return <Badge className="bg-slate-500/10 text-slate-600 hover:bg-slate-500/20 border-slate-200">Đã bỏ qua</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getReasonBadge = (reason) => {
    switch(reason) {
      case 'SPAM': return <Badge variant="outline" className="text-muted-foreground">Spam/Quảng cáo</Badge>;
      case 'INAPPROPRIATE': return <Badge variant="outline" className="text-orange-500 border-orange-200">Nội dung phản cảm</Badge>;
      case 'SCAM': return <Badge variant="outline" className="text-rose-500 border-rose-200 bg-rose-50">Lừa đảo</Badge>;
      case 'COPYRIGHT': return <Badge variant="outline" className="text-blue-500 border-blue-200">Vi phạm bản quyền</Badge>;
      default: return <Badge variant="outline">{reason}</Badge>;
    }
  };

  const getTargetLabel = (type) => {
    switch(type) {
      case 'POST': return 'Bài viết';
      case 'SERVICE': return 'Dịch vụ';
      case 'USER_PROFILE': return 'Người dùng';
      case 'REVIEW': return 'Đánh giá';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-rose-500" />
            Quản lý Báo cáo Vi phạm
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Xử lý các báo cáo vi phạm tiêu chuẩn cộng đồng từ người dùng.
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-lg border border-border shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Tìm theo người báo cáo, mã đối tượng..." 
            className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select 
            className="w-full sm:w-auto px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">Chờ xử lý</option>
            <option value="RESOLVED">Đã giải quyết</option>
            <option value="DISMISSED">Đã bỏ qua</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Mã BC</th>
                <th className="px-6 py-4 font-medium">Người Báo Cáo</th>
                <th className="px-6 py-4 font-medium">Đối tượng</th>
                <th className="px-6 py-4 font-medium">Lý do</th>
                <th className="px-6 py-4 font-medium">Thời gian</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentData.length > 0 ? currentData.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-muted-foreground">{item.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-medium text-foreground">
                      <User className="h-3 w-3 text-muted-foreground" /> {item.reporter}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{getTargetLabel(item.targetType)}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">{item.targetId}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getReasonBadge(item.reasonType)}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedReport(item)}>
                      <Eye className="h-4 w-4 mr-2" /> Xử lý
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-muted-foreground">
                    Không tìm thấy dữ liệu báo cáo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border flex justify-center">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </div>
        )}
      </div>

      {/* Details Modal Overlay */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card w-full max-w-2xl rounded-xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-rose-50 dark:bg-rose-950/20">
              <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Chi tiết Báo cáo Vi phạm
              </h3>
              <button onClick={() => setSelectedReport(null)} className="text-rose-400 hover:text-rose-600">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="bg-muted p-3 rounded-full">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground">
                      Báo cáo {getTargetLabel(selectedReport.targetType).toLowerCase()}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 font-mono">
                      Mã đối tượng: {selectedReport.targetId}
                    </p>
                  </div>
                </div>
                {getStatusBadge(selectedReport.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Người báo cáo</p>
                  <p className="font-medium text-foreground">{selectedReport.reporter}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Thời gian</p>
                  <p className="font-medium text-foreground">{new Date(selectedReport.createdAt).toLocaleString('vi-VN')}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg col-span-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Phân loại vi phạm</p>
                  <div className="mt-1">{getReasonBadge(selectedReport.reasonType)}</div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  Nội dung chi tiết (Do người dùng cung cấp)
                </p>
                <div className="bg-rose-50/50 dark:bg-rose-950/10 p-4 rounded-lg text-sm text-foreground leading-relaxed border border-rose-100 dark:border-rose-900/30 italic">
                  "{selectedReport.description}"
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border bg-muted/30 flex flex-wrap justify-between items-center gap-4">
              <Button variant="outline" className="text-primary hover:text-primary hover:bg-primary/10">
                <Eye className="h-4 w-4 mr-2" /> Xem chi tiết đối tượng
              </Button>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" onClick={() => setSelectedReport(null)}>
                  Đóng
                </Button>
                {selectedReport.status === 'PENDING' && (
                  <>
                    <Button variant="secondary" onClick={() => setSelectedReport(null)}>
                      Bỏ qua
                    </Button>
                    <Button className="bg-rose-600 hover:bg-rose-700 text-white shadow-sm">
                      <Trash2 className="h-4 w-4 mr-2" /> Xóa nội dung
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
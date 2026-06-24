import { useState } from 'react';
import { 
  Settings, Server, Database, Globe, Shield, Mail, 
  Save, RefreshCw, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const tabs = [
    { id: 'general', label: 'Cấu hình Chung', icon: Globe },
    { id: 'security', label: 'Bảo mật & Phân quyền', icon: Shield },
    { id: 'mail', label: 'Email Template', icon: Mail },
    { id: 'server', label: 'Máy chủ & Cache', icon: Server },
    { id: 'database', label: 'Cơ sở dữ liệu', icon: Database },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            Cấu hình Hệ thống
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý các tham số hệ thống, email, bảo mật và kết nối dịch vụ bên thứ ba.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {showSuccess && (
            <span className="text-emerald-600 flex items-center gap-1 text-sm font-medium animate-in fade-in slide-in-from-right-4">
              <CheckCircle2 className="h-4 w-4" /> Đã lưu thành công
            </span>
          )}
          <Button variant="outline" className="bg-background">
            <RefreshCw className="h-4 w-4 mr-2" /> Khôi phục mặc định
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="min-w-[120px]">
            {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Lưu thay đổi
          </Button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
              }`}
            >
              <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="border-b border-border pb-4">
                <h3 className="text-lg font-bold text-foreground">Thông tin chung</h3>
                <p className="text-sm text-muted-foreground">Cấu hình các thông tin cơ bản của website.</p>
              </div>
              
              <div className="grid gap-6 max-w-2xl">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Tên Website</label>
                  <input type="text" defaultValue="ezTravel - Nền tảng du lịch thông minh" className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Mô tả (Meta Description)</label>
                  <textarea rows={3} defaultValue="Nền tảng kết nối du khách với các dịch vụ du lịch, khách sạn, tour nội địa và quốc tế tốt nhất hiện nay." className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email Liên hệ</label>
                    <input type="email" defaultValue="support@eztravel.vn" className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Hotline</label>
                    <input type="text" defaultValue="1900 1234 56" className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    Chế độ bảo trì
                  </label>
                  <div className="flex items-center gap-3 bg-muted/50 p-4 rounded-lg border border-border">
                    <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-slate-300 dark:bg-slate-700">
                      <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Tạm đóng website</p>
                      <p className="text-xs text-muted-foreground">Chỉ Admin mới có thể truy cập hệ thống khi bật chế độ này.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OTHER TABS PLACEHOLDER */}
          {activeTab !== 'general' && (
            <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <Settings className="h-16 w-16 text-muted mb-4 opacity-20" />
              <h3 className="text-lg font-bold text-foreground">Mô-đun đang nâng cấp</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                Tính năng cấu hình chuyên sâu đang được đồng bộ hóa với hệ thống Microservices backend.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import {
 Loader2,
 Plus,
 RefreshCw,
 Search,
 Tag,
 Trash2,
 Eye,
 X,
 Image as ImageIcon
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUpload from "../../shared/components/ImageUpload";
import {
 useCreateCategoryMutation,
 useDeleteCategoryMutation,
 useGetCategoriesQuery,
} from "../../store/apis/adminApi";
import Pagination from "../../shared/components/Pagination";

const getCategoryId = (category) => category?.id ?? category?.maTag;
const getCategoryName = (category) => category?.name ?? category?.tenTag ?? "Danh mục";
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
 const [currentPage, setCurrentPage] = useState(1);
 const [selectedCategory, setSelectedCategory] = useState(null);
 const ITEMS_PER_PAGE = 10;

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
 setError("Tên danh mục cần ít nhất 2 ký tự.");
 return;
 }

 try {
 await createCategory({ name, type }).unwrap();
 setForm({ name: "", type: "GENERAL" });
 setError("");
 toast({
 title: "Đã tạo danh mục",
 description: "Danh mục mới đã được lưu vào hệ thống.",
 variant: "success",
 });
 } catch (err) {
 setError(err?.data?.message ?? "Không thể tạo danh mục.");
 }
 };

 const handleDelete = async (category) => {
 const id = getCategoryId(category);
 const placeCount = category.placeCount ?? 0;
 if (!id || placeCount > 0) return;
 if (!window.confirm(`Xóa danh mục "${getCategoryName(category)}"?`)) return;

 setDeletingId(id);
 try {
 await deleteCategory(id).unwrap();
 toast({
 title: "Đã xóa danh mục",
 description: "Danh mục không còn xuất hiện trong hệ thống.",
 variant: "success",
 });
 } catch (err) {
 toast({
 title: "Không thể xóa danh mục",
 description: err?.data?.message ?? "Vui lòng thử lại.",
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
 <h1 className="text-2xl font-bold text-foreground">Danh mục địa điểm</h1>
 <p className="mt-2 text-sm text-muted-foreground">
 Quản lý tag dùng để phân loại và tìm kiếm địa điểm.
 </p>
 </div>
 <button
 type="button"
 className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-semibold text-muted-foreground hover:bg-muted"
 onClick={() => refetch()}
 >
 <RefreshCw className="h-4 w-4" />
 Làm mới
 </button>
 </div>

 <section>
 <h2 className="text-lg font-bold text-foreground">Tạo danh mục</h2>
 <form className="mt-4 grid gap-4 md:grid-cols-[1fr_220px_auto]" onSubmit={handleCreate}>
 <div>
 <label className="text-sm font-semibold text-muted-foreground" htmlFor="category-name">
 Tên danh mục
 </label>
 <input
 id="category-name"
 className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-slate-500"
 value={form.name}
 onChange={(event) => {
 setForm((current) => ({ ...current, name: event.target.value }));
 if (error) setError("");
 }}
 disabled={isCreating}
 maxLength={100}
 placeholder="VD: Biển đảo"
 required
 />
 </div>
 <div>
 <label className="text-sm font-semibold text-muted-foreground" htmlFor="category-type">
 Loại
 </label>
 <input
 id="category-type"
 className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm uppercase outline-none focus:border-slate-500"
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
 Tạo
 </button>
 </form>
 {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
 </section>

 <section className="border-t pt-7">
 <div className="mb-5 flex flex-col gap-3 md:flex-row">
 <div className="relative flex-1">
 <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
 <input
 className="h-10 w-full rounded-md border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-slate-500"
 value={keyword}
 onChange={(event) => { setKeyword(event.target.value); setCurrentPage(1); }}
 placeholder="Tìm theo tên danh mục..."
 />
 </div>
 <select
 className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none"
 value={typeFilter}
 onChange={(event) => { setTypeFilter(event.target.value); setCurrentPage(1); }}
 >
 <option value="">Tất cả loại</option>
 {availableTypes.map((type) => (
 <option key={type} value={type}>
 {type}
 </option>
 ))}
 </select>
 </div>

 {isLoading ? (
 <div className="flex min-h-56 items-center justify-center rounded-md border border-border bg-background">
 <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
 </div>
 ) : isError ? (
 <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
 Không thể tải danh mục.{" "}
 <button type="button" className="font-semibold underline" onClick={() => refetch()}>
 Thử lại
 </button>
 </div>
 ) : filteredCategories.length === 0 ? (
 <div className="rounded-md border border-border bg-background px-5 py-12 text-center">
 <Tag className="mx-auto h-8 w-8 text-muted-foreground" />
 <h3 className="mt-4 font-bold text-foreground">Không có danh mục phù hợp</h3>
 <p className="mt-2 text-sm text-muted-foreground">Thử đổi bộ lọc hoặc tạo danh mục mới.</p>
 </div>
 ) : (
 <div className="overflow-hidden rounded-md border border-border bg-background">
 <div className="grid grid-cols-[1fr_160px_120px_96px] gap-4 border-b border-border bg-background px-4 py-3 text-xs font-bold uppercase text-muted-foreground">
 <span>Danh mục</span>
 <span>Loại</span>
 <span>Địa điểm</span>
 <span className="text-right">Thao tác</span>
 </div>
 <div className="divide-y divide-slate-200">
 {(() => {
   const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
   const currentData = filteredCategories.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
   return currentData.map((category) => {
 const id = getCategoryId(category);
 const placeCount = category.placeCount ?? 0;
 return (
 <div
 key={id}
 className="grid grid-cols-[1fr_160px_120px_96px] items-center gap-4 px-4 py-4 text-sm hover:bg-muted/30 transition-colors"
 >
 <span className="font-semibold text-foreground flex items-center gap-2">
   <Tag className="h-4 w-4 text-muted-foreground" />
   {getCategoryName(category)}
 </span>
 <span className="text-muted-foreground">
   <span className="bg-muted px-2 py-1 rounded text-[11px] font-semibold">{getCategoryType(category)}</span>
 </span>
 <span className="text-muted-foreground">{placeCount}</span>
 <div className="flex justify-end gap-1">
   <button
     type="button"
     className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-slate-100 hover:text-foreground"
     onClick={() => setSelectedCategory({
       ...category,
       thumbnail: id.toString().length % 2 === 0 ? 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80' : null
     })}
     title="Xem chi tiết"
   >
     <Eye className="h-4 w-4" />
   </button>
   <button
     type="button"
     className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-35"
     onClick={() => handleDelete(category)}
     disabled={isDeleting || placeCount > 0}
     title={placeCount > 0 ? "Danh mục đang được sử dụng" : "Xóa danh mục"}
   >
     {deletingId === id ? (
     <Loader2 className="h-4 w-4 animate-spin" />
     ) : (
     <Trash2 className="h-4 w-4" />
     )}
   </button>
 </div>
 </div>
 );
 })})()}
 </div>
 {Math.ceil(filteredCategories.length / ITEMS_PER_PAGE) > 1 && (
   <div className="p-4 border-t border-border flex justify-center">
     <Pagination 
       currentPage={currentPage} 
       totalPages={Math.ceil(filteredCategories.length / ITEMS_PER_PAGE)} 
       onPageChange={setCurrentPage} 
     />
   </div>
 )}
 </div>
 )}
 </section>

 {selectedCategory && (
   <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
     <div className="bg-card w-full max-w-xl rounded-xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]">
       <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
         <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
           <Tag className="h-5 w-5 text-primary" />
           Chi tiết Danh mục
         </h3>
         <button onClick={() => setSelectedCategory(null)} className="text-muted-foreground hover:text-foreground">
           <X className="h-6 w-6" />
         </button>
       </div>
       
       <div className="p-6 overflow-y-auto flex-1">
         <Tabs defaultValue="info" className="w-full">
           <TabsList className="grid w-full grid-cols-2 mb-6">
             <TabsTrigger value="info">Thông tin</TabsTrigger>
             <TabsTrigger value="thumbnail">Thumbnail</TabsTrigger>
           </TabsList>
           
           <TabsContent value="info" className="space-y-6 mt-0">
             <div>
               <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Tên danh mục</p>
               <p className="font-bold text-xl text-foreground">{getCategoryName(selectedCategory)}</p>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-muted/50 p-4 rounded-lg">
                 <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Loại danh mục</p>
                 <p className="font-medium text-foreground">{getCategoryType(selectedCategory)}</p>
               </div>
               <div className="bg-muted/50 p-4 rounded-lg">
                 <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Số lượng địa điểm</p>
                 <p className="font-medium text-foreground">{selectedCategory.placeCount ?? 0}</p>
               </div>
             </div>
             
             <div>
               <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Mã ID</p>
               <p className="text-sm font-mono text-muted-foreground bg-muted/30 p-2 rounded">{getCategoryId(selectedCategory)}</p>
             </div>
           </TabsContent>
           
           <TabsContent value="thumbnail" className="mt-0 space-y-4">
             <p className="text-sm font-semibold text-foreground mb-2">Ảnh đại diện danh mục</p>
             <ImageUpload 
               currentImage={selectedCategory.thumbnail} 
               onUpload={(file) => console.log("Uploaded thumbnail:", file)}
               label="Tải ảnh thumbnail lên"
               helpText="Định dạng JPG, PNG, WEBP (Tối đa 2MB)"
             />
           </TabsContent>
         </Tabs>
       </div>

       <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-end gap-3">
         <Button variant="outline" onClick={() => setSelectedCategory(null)}>
           Đóng
         </Button>
       </div>
     </div>
   </div>
 )}
 </div>
 );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ImageIcon, Loader2, PenLine, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useCreateBlogMutation } from "../../store/apis/communityApi";

const initialForm = {
  title: "",
  summary: "",
  thumbnail: "",
  placeId: "",
  content: "",
};

const getCreatedBlogId = (blog) => blog?.id ?? blog?.maBaiViet ?? blog?.details?.id ?? blog?.details?.maBaiViet;

export default function BlogCreate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [createBlog, { isLoading }] = useCreateBlogMutation();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const title = form.title.trim();
    const content = form.content.trim();
    if (!title || !content) {
      setError("Tieu de va noi dung la bat buoc.");
      return;
    }

    const placeId = Number(form.placeId);
    const payload = {
      title,
      content,
      summary: form.summary.trim() || undefined,
      thumbnail: form.thumbnail.trim() || undefined,
      imageUrl: form.thumbnail.trim() || undefined,
      placeId: Number.isFinite(placeId) && placeId > 0 ? placeId : undefined,
    };

    try {
      const created = await createBlog(payload).unwrap();
      const blogId = getCreatedBlogId(created);

      toast({
        title: "Da dang bai",
        description: "Bai viet cua ban da duoc luu vao cong dong.",
        variant: "success",
      });

      navigate(blogId ? `/community/blogs/${blogId}` : "/community/blogs");
    } catch (err) {
      const message = err?.data?.message || "Khong the tao bai viet. Vui long thu lai.";
      setError(message);
      toast({
        title: "Khong the dang bai",
        description: message,
        variant: "error",
      });
    }
  };

  const canSubmit = form.title.trim().length > 0 && form.content.trim().length > 0 && !isLoading;
  const previewImage = form.thumbnail.trim();

  return (
    <div className="container mx-auto w-full max-w-5xl px-4 py-8">
      <Link
        to="/community/blogs"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lai blog
      </Link>

      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Viet bai blog</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Chia se lich trinh, kinh nghiem hoac cau chuyen du lich voi cong dong.
          </p>
        </div>
      </div>

      <form className="grid gap-6 lg:grid-cols-[1fr_320px]" onSubmit={handleSubmit}>
        <div className="rounded-md border bg-background p-5 shadow-sm">
          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-foreground" htmlFor="blog-title">
                Tieu de
              </label>
              <input
                id="blog-title"
                className="mt-2 h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary"
                placeholder="VD: 3 ngay an choi Da Nang tu tuc"
                value={form.title}
                onChange={updateField("title")}
                disabled={isLoading}
                maxLength={500}
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground" htmlFor="blog-summary">
                Tom tat
              </label>
              <textarea
                id="blog-summary"
                className="mt-2 min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                placeholder="Mot doan ngan de nguoi doc nam nhanh hanh trinh cua ban..."
                value={form.summary}
                onChange={updateField("summary")}
                disabled={isLoading}
                maxLength={1000}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground" htmlFor="blog-content">
                Noi dung
              </label>
              <textarea
                id="blog-content"
                className="mt-2 min-h-80 w-full rounded-md border bg-background px-3 py-2 text-sm leading-6 outline-none transition focus:border-primary"
                placeholder="Ke lai lich trinh, chi phi, mon ngon, luu y di chuyen..."
                value={form.content}
                onChange={updateField("content")}
                disabled={isLoading}
                required
              />
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-md border bg-background p-4 shadow-sm">
            <h2 className="text-sm font-bold text-foreground">Anh dai dien</h2>
            <div className="mt-3 overflow-hidden rounded-md border bg-muted/40">
              {previewImage ? (
                <img src={previewImage} alt="Blog preview" className="h-44 w-full object-cover" />
              ) : (
                <div className="flex h-44 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                  <ImageIcon className="h-7 w-7" />
                  Chua co anh
                </div>
              )}
            </div>
            <input
              className="mt-3 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary"
              placeholder="https://..."
              value={form.thumbnail}
              onChange={updateField("thumbnail")}
              disabled={isLoading}
              type="url"
            />
          </div>

          <div className="rounded-md border bg-background p-4 shadow-sm">
            <h2 className="text-sm font-bold text-foreground">Lien ket dia diem</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Neu da biet ma dia diem trong he thong, nhap vao de bai viet hien theo dia diem do.
            </p>
            <input
              className="mt-3 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary"
              placeholder="Ma dia diem"
              value={form.placeId}
              onChange={updateField("placeId")}
              disabled={isLoading}
              min="1"
              type="number"
            />
          </div>

          <div className="flex gap-3">
            <Link
              to="/community/blogs"
              className="inline-flex h-10 flex-1 items-center justify-center rounded-md border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Huy
            </Link>
            <button
              type="submit"
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!canSubmit}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Dang bai
            </button>
          </div>

          <div className="rounded-md border bg-muted/30 p-4 text-xs leading-5 text-muted-foreground">
            <div className="mb-2 inline-flex items-center gap-2 font-semibold text-foreground">
              <PenLine className="h-4 w-4" />
              Trang thai
            </div>
            <p>Bai viet moi duoc luu truc tiep qua API blog va hien ngay tren danh sach cong dong.</p>
          </div>
        </aside>
      </form>
    </div>
  );
}

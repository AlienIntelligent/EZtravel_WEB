import { useGetAdminPromotionsPreviewQuery } from "../../store/apis/adminApi";
import { Star, ShieldCheck, Crown } from "lucide-react";

export default function PromotionsPreview() {
  const { data: promotions, isLoading, error } = useGetAdminPromotionsPreviewQuery();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Xem Trước Quảng Bá</h2>
      </div>
      <p className="text-slate-600 dark:text-slate-400">
        Danh sách các nhà cung cấp đang được quảng bá trên hệ thống theo gói cước (Dữ liệu thực tế từ Backend).
      </p>

      {isLoading ?
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) =>
        <div key={i} className="bg-white dark:bg-slate-900 rounded-xl h-48 animate-pulse border border-slate-200 dark:border-slate-800"></div>
        )}
        </div> :
      error ?
      <div className="p-12 text-center text-rose-500 bg-rose-50 dark:bg-rose-900/10 rounded-xl">
          <p>Có lỗi xảy ra khi tải dữ liệu quảng bá.</p>
        </div> :
      promotions && promotions.length > 0 ?
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {promotions.map((promo) => {
          const isPremium = promo.badge === "PREMIUM_PARTNER";
          const isVerified = promo.badge === "VERIFIED_PARTNER";

          return (
            <div
              key={promo.providerId}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all flex flex-col">
              
                <div className={`h-2 ${isPremium ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500' : isVerified ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1" title={promo.providerName}>
                      {promo.providerName}
                    </h3>
                    {isPremium ?
                  <Crown className="w-5 h-5 text-amber-500 shrink-0" /> :
                  isVerified ?
                  <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" /> :
                  null}
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Gói hiện tại:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{promo.packageName || "—"}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Hệ số ưu tiên:</span>
                      <div className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-500">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        {promo.promotionScore}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className={`w-2 h-2 rounded-full ${promo.appearsOnHomepage ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                      <span className={promo.appearsOnHomepage ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}>Trang chủ</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className={`w-2 h-2 rounded-full ${promo.appearsOnExplore ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                      <span className={promo.appearsOnExplore ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}>Khám phá</span>
                    </div>
                  </div>
                </div>
              </div>);

        })}
        </div> :

      <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Chưa có dữ liệu quảng bá</h3>
          <p className="text-slate-500">Không có nhà cung cấp nào đang được quảng bá trên hệ thống.</p>
        </div>
      }
    </div>);

}
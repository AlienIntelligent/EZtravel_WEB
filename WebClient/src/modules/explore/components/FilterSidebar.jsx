import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setFilters, resetFilters } from '../../../store/exploreSlice';

function FilterSidebar() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.explore);
  const { activeTab, keyword, province, budgetMin, budgetMax, rating, serviceCategory } = filters;

  const handleKeywordChange = (e) => {
    dispatch(setFilters({ keyword: e.target.value }));
  };

  const handleProvinceChange = (e) => {
    dispatch(setFilters({ province: e.target.value || null }));
  };

  const handleCategoryChange = (e) => {
    dispatch(setFilters({ serviceCategory: e.target.value || null }));
  };

  const handleBudgetChange = (min, max) => {
    dispatch(setFilters({ budgetMin: min, budgetMax: max }));
  };

  const handleRatingChange = (val) => {
    dispatch(setFilters({ rating: val }));
  };

  return (
    <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '16px' }}>
        <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="font-weight-bold m-0">Bộ lọc tìm kiếm</h5>
                <button className="btn btn-sm btn-link text-muted" onClick={() => dispatch(resetFilters())}>Xóa lọc</button>
            </div>

            <div className="mb-4">
                <label className="small font-weight-bold text-muted mb-2">TỪ KHÓA</label>
                <input
            type="text"
            className="form-control bg-light border-0"
            placeholder="Nhập tên địa điểm..."
            value={keyword}
            onChange={handleKeywordChange} />
          
            </div>

            <div className="mb-4">
                <label className="small font-weight-bold text-muted mb-2">TỈNH / THÀNH PHỐ</label>
                <select className="form-control bg-light border-0 custom-select" value={province || ''} onChange={handleProvinceChange}>
                    <option value="">Tất cả</option>
                    <option value="Da Nang">Đà Nẵng</option>
                    <option value="Hoi An">Hội An</option>
                    <option value="Hue">Huế</option>
                </select>
            </div>

            {activeTab === 'services' &&
        <div className="mb-4">
                    <label className="small font-weight-bold text-muted mb-2">LOẠI DỊCH VỤ</label>
                    <select className="form-control bg-light border-0 custom-select" value={serviceCategory || ''} onChange={handleCategoryChange}>
                        <option value="">Tất cả</option>
                        <option value="ACCOMMODATION">Khách sạn / Chỗ ở</option>
                        <option value="FOOD">Nhà hàng / Ăn uống</option>
                        <option value="ACTIVITY">Hoạt động / Vui chơi</option>
                        <option value="TRANSPORT">Phương tiện di chuyển</option>
                    </select>
                </div>
        }

            {activeTab === 'services' &&
        <div className="mb-4">
                    <label className="small font-weight-bold text-muted mb-2">MỨC GIÁ</label>
                    <div className="d-flex justify-content-between mb-2">
                        <span className="small">{budgetMin.toLocaleString()}đ</span>
                        <span className="small">{budgetMax.toLocaleString()}đ</span>
                    </div>
                    <input
            type="range"
            className="custom-range"
            min="0"
            max="5000000"
            step="100000"
            value={budgetMax}
            onChange={(e) => handleBudgetChange(0, parseInt(e.target.value))} />
          
                </div>
        }

            <div className="mb-4">
                <label className="small font-weight-bold text-muted mb-2">ĐÁNH GIÁ TỐI THIỂU</label>
                <select className="form-control bg-light border-0 custom-select" value={rating} onChange={(e) => handleRatingChange(parseFloat(e.target.value))}>
                    <option value={0}>Bất kỳ</option>
                    <option value={5}>5 Sao</option>
                    <option value={4}>4 Sao trở lên</option>
                    <option value={3}>3 Sao trở lên</option>
                </select>
            </div>
        </div>
    </div>);

}

export default FilterSidebar;
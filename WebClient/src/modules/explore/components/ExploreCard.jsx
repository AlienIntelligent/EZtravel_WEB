
import { useToast } from '@/components/ui/use-toast';






function ExploreCard({ item, type }) {
  const { toast } = useToast();

  const handleAddToPlanner = () => {
    toast({
      title: 'Sắp ra mắt',
      description: 'Tính năng Planner sẽ được triển khai ở Sprint sau.'
    });
  };

  return (
    <div className="col-md-4 mb-4">
        <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <div
          className="card-img-top"
          style={{
            height: '200px',
            backgroundImage: `url(${item.images?.[0] || 'https://via.placeholder.com/400x300'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} />
        
            <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title font-weight-bold mb-0" style={{ fontSize: '1.1rem' }}>{item.name}</h5>
                    {type === 'SERVICE' && 'type' in item &&
            <span className="badge bg-warning text-dark ml-2">{item.type}</span>
            }
                </div>
                
                <div className="d-flex align-items-center mb-3">
                    <span className="text-warning mr-1">★</span>
                    <span className="small font-weight-bold">{item.averageRating?.toFixed(1) || '0.0'}</span>
                    <span className="text-muted small ml-1">({item.totalReviews || 0} đánh giá)</span>
                </div>

                <p className="card-text text-muted small flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.description}
                </p>

                {type === 'SERVICE' && 'price' in item &&
          <div className="mb-3 text-primary font-weight-bold">
                        {item.price?.toLocaleString() || 0} đ
                    </div>
          }

                <button
            className="btn btn-outline-primary w-100 mt-auto font-weight-bold"
            onClick={handleAddToPlanner}
            style={{ borderRadius: '8px' }}>
            
                    + Thêm vào chuyến đi
                </button>
            </div>
        </div>
    </div>);

}

export default ExploreCard;
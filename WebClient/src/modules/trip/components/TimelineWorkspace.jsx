import { useAppSelector } from '../../../store/hooks';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';


function SortableItem({ item, title }) {
  const isPlace = !('serviceId' in item);
  const id = isPlace ? `place-${item.id}` : `service-${item.id}`;

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    data: { type: isPlace ? 'PLACE' : 'SERVICE', item }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="card border-0 shadow-xs mb-3">
      
        <div className="card-body p-3 d-flex align-items-center bg-white" style={{ borderRadius: '12px' }}>
            <div {...attributes} {...listeners} className="mr-3 text-muted" style={{ cursor: 'grab', fontSize: '20px' }}>
                ☰
            </div>
            <div className="flex-grow-1">
                <h6 className="m-0 font-weight-bold">
                    {title}
                </h6>
            </div>
        </div>
    </div>);

}

function DayCard({ dayId, title }) {
  const { setNodeRef } = useDroppable({
    id: dayId
  });

  // In a real implementation we would fetch the items for this day
  const nodes = useAppSelector((state) => state.trip.timelineDays.find((d) => d.id === dayId)?.nodes || []);
  const placesDict = useAppSelector((state) => state.trip.placesDictionary);
  const servicesDict = useAppSelector((state) => state.trip.servicesDictionary);

  return (
    <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "16px" }}>
        <div className="card-header bg-white border-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
            <h4 className="font-weight-bold m-0" style={{ color: "#2f3542" }}>{title}</h4>
            <span className="badge badge-light px-3 py-2 text-dark font-weight-bold" style={{ borderRadius: "15px" }}>
                {nodes.length} hoạt động
            </span>
        </div>
        <div className="card-body">
            <div
          ref={setNodeRef}
          style={{
            minHeight: "120px",
            padding: "12px",
            borderRadius: "12px",
            backgroundColor: "#f8f9fa",
            border: "2px dashed #ddd",
            transition: "0.2s"
          }}>
          
                <SortableContext
            id={dayId}
            items={nodes.map((n) => n.id)}
            strategy={verticalListSortingStrategy}>
            
                    {nodes.length === 0 ?
            <div className="text-center py-5 text-muted small">
                            📥 Kéo địa điểm từ bên trái thả vào đây để xây dựng timeline
                        </div> :

            nodes.map((node) => {
              if (node.type === 'TIMELINE_ITEM') {
                const item = node.item;
                const itemTitle = 'placeId' in item ?
                item.title || placesDict[item.placeId]?.name || `Địa điểm ${item.placeId}` :
                item.title || servicesDict[item.serviceId]?.name || `Dịch vụ ${item.serviceId}`;
                return <SortableItem key={item.id} item={item} title={itemTitle} />;
              }
              return <div key={node.id}>[Location Canvas / Segment]</div>;
            })
            }
                </SortableContext>
            </div>
        </div>
    </div>);

}

function TimelineWorkspace() {
  const days = useAppSelector((state) => state.trip.timelineDays);

  return (
    <div>
        {days.length === 0 ?
      <div className="text-center text-muted py-5">
                No days planned yet.
            </div> :

      days.map((day) =>
      <DayCard key={day.id} dayId={day.id} title={`Day ${day.sequence + 1}: ${day.date}`} />
      )
      }
    </div>);

}

export default TimelineWorkspace;
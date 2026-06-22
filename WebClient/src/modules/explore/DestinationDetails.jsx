import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Eye,
  ImageIcon,
  MapPin,
  Navigation,
  Star,
} from "lucide-react";
import {
  useGetDestinationDetailsQuery,
  useGetDestinationServicesQuery,
} from "../../store/apis/exploreApi";

const getDestinationName = (destination) => destination?.name ?? destination?.tenDiaDiem ?? "Dia diem";
const getDescription = (destination) => destination?.description ?? destination?.moTa ?? "";
const getAddress = (destination) =>
  destination?.address ?? destination?.diaChi ?? destination?.tenTinhThanh ?? "Vietnam";
const getImage = (destination) =>
  destination?.images?.[0] ?? destination?.thumbnailUrl ?? destination?.thumbnail ?? "";
const getRating = (destination) => destination?.averageRating ?? destination?.ratingAvg ?? 0;
const getReviewCount = (destination) => destination?.totalReviews ?? destination?.totalReview ?? 0;

const formatPrice = (value) => {
  const amount = Number(value ?? 0);
  return amount > 0 ? new Intl.NumberFormat("vi-VN").format(amount) + " d" : "Lien he";
};

export default function DestinationDetails() {
  const { id } = useParams();
  const destinationId = Number(id);
  const invalidId = !Number.isFinite(destinationId) || destinationId <= 0;

  const {
    data: destination,
    isLoading,
    isError,
    refetch,
  } = useGetDestinationDetailsQuery(destinationId, { skip: invalidId });
  const {
    data: serviceData = [],
    isLoading: isLoadingServices,
    isError: isServicesError,
    refetch: refetchServices,
  } = useGetDestinationServicesQuery(destinationId, { skip: invalidId });

  const services = Array.isArray(serviceData)
    ? serviceData
    : serviceData?.items ?? serviceData?.data ?? [];

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="h-80 animate-pulse rounded-md bg-muted/50" />
        <div className="mt-6 h-28 animate-pulse rounded-md bg-muted/30" />
      </div>
    );
  }

  if (invalidId || isError || !destination) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Link
          to="/explore"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lai kham pha
        </Link>
        <div className="rounded-md border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Khong the tai dia diem nay.{" "}
          {!invalidId && (
            <button className="font-semibold underline" type="button" onClick={() => refetch()}>
              Thu lai
            </button>
          )}
        </div>
      </div>
    );
  }

  const image = getImage(destination);
  const latitude = destination.latitude;
  const longitude = destination.longitude;
  const hasCoordinates = Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude));
  const mapUrl = hasCoordinates
    ? `https://www.google.com/maps?q=${encodeURIComponent(`${latitude},${longitude}`)}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getAddress(destination))}`;
  const tags = destination.tags ?? [];

  return (
    <div className="pb-12">
      <div className="container mx-auto max-w-6xl px-4 pt-8">
        <Link
          to="/explore"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lai kham pha
        </Link>

        <div className="overflow-hidden rounded-md border bg-background">
          {image ? (
            <img src={image} alt={getDestinationName(destination)} className="h-72 w-full object-cover sm:h-96" />
          ) : (
            <div className="flex h-72 items-center justify-center bg-muted text-muted-foreground sm:h-96">
              <ImageIcon className="h-10 w-10" />
            </div>
          )}
        </div>

        <div className="grid gap-8 py-7 lg:grid-cols-[1fr_280px]">
          <main>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                {getAddress(destination)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {Number(getRating(destination)).toFixed(1)} ({getReviewCount(destination)})
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                {destination.luotXem ?? destination.viewCount ?? 0} luot xem
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              {getDestinationName(destination)}
            </h1>

            {tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="rounded border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-6 whitespace-pre-line text-base leading-8 text-muted-foreground">
              {getDescription(destination) || "Thong tin chi tiet dang duoc cap nhat."}
            </p>
          </main>

          <aside className="h-fit rounded-md border bg-background p-5">
            <h2 className="text-sm font-bold text-foreground">Thong tin dia diem</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Tinh thanh</dt>
                <dd className="mt-1 font-semibold text-foreground">{destination.tenTinhThanh ?? "Chua cap nhat"}</dd>
              </div>
              {hasCoordinates && (
                <div>
                  <dt className="text-muted-foreground">Toa do</dt>
                  <dd className="mt-1 font-semibold text-foreground">
                    {Number(latitude).toFixed(4)}, {Number(longitude).toFixed(4)}
                  </dd>
                </div>
              )}
            </dl>
            <a
              className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Navigation className="h-4 w-4" />
              Mo ban do
            </a>
          </aside>
        </div>

        <section className="border-t pt-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Dich vu tai dia diem</h2>
              <p className="mt-1 text-sm text-muted-foreground">Khach san, am thuc, hoat dong va di chuyen dang hoat dong.</p>
            </div>
            <Building2 className="h-6 w-6 text-primary" />
          </div>

          {isLoadingServices ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-64 animate-pulse rounded-md border bg-muted/40" />
              ))}
            </div>
          ) : isServicesError ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Khong the tai dich vu.{" "}
              <button className="font-semibold underline" type="button" onClick={() => refetchServices()}>
                Thu lai
              </button>
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-md border bg-background px-4 py-10 text-center text-sm text-muted-foreground">
              Chua co dich vu dang hoat dong tai dia diem nay.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const serviceId = service.id ?? service.maDichVu;
                const serviceImage = service.images?.[0] ?? service.thumbnail ?? "";
                return (
                  <Link
                    key={serviceId}
                    to={`/explore/services/${serviceId}`}
                    className="group overflow-hidden rounded-md border bg-background shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {serviceImage ? (
                      <img src={serviceImage} alt={service.name ?? service.tenDichVu} className="h-44 w-full object-cover" />
                    ) : (
                      <div className="flex h-44 items-center justify-center bg-muted text-muted-foreground">
                        <ImageIcon className="h-7 w-7" />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="line-clamp-2 font-bold text-foreground group-hover:text-primary">
                          {service.name ?? service.tenDichVu}
                        </h3>
                        <span className="shrink-0 text-sm font-semibold text-primary">
                          {formatPrice(service.price ?? service.giaTu)}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {service.description ?? service.moTa ?? ""}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{service.providerName ?? "Nha cung cap"}</span>
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {Number(service.averageRating ?? service.ratingAvg ?? 0).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

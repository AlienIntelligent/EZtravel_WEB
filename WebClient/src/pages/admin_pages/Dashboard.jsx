import React from 'react';
import {
    adminStats,
    bookings,
    communityFeeds,
    destinations,
    formatCompactCurrency,
    formatCurrency,
    trips,
} from '../../data/usecaseData';

const Dashboard = () => {
    return (
        <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Dashboard thong ke</h1>
                <span className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">UC024 Analytics</span>
            </div>

            <div className="row">
                {adminStats.map((stat) => (
                    <div className="col-xl-3 col-md-6 mb-4" key={stat.id}>
                        <div className="card border-left-primary shadow h-100 py-2">
                            <div className="card-body">
                                <div className="row no-gutters align-items-center">
                                    <div className="col mr-2">
                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">{stat.label}</div>
                                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                                            {stat.id === 'revenue' ? formatCompactCurrency(stat.value) : stat.value}
                                        </div>
                                        <div className="small text-success">{stat.trend} so voi thang truoc</div>
                                    </div>
                                    <div className="col-auto">
                                        <i className={`${stat.icon} fa-2x text-gray-300`}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row">
                <div className="col-lg-7 mb-4">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">Booking gan day</h6>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Dich vu</th>
                                            <th>Khach hang</th>
                                            <th>Trang thai</th>
                                            <th>So tien</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.map((booking) => (
                                            <tr key={booking.id}>
                                                <td>{booking.serviceName}</td>
                                                <td>{booking.customer}</td>
                                                <td><span className="badge badge-info">{booking.status}</span></td>
                                                <td>{formatCurrency(booking.amount)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-5 mb-4">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">Diem den hot</h6>
                        </div>
                        <div className="card-body">
                            {destinations.slice(0, 5).map((place) => (
                                <div className="mb-3" key={place.id}>
                                    <div className="d-flex justify-content-between">
                                        <strong>{place.name}</strong>
                                        <span>{place.rating}/5</span>
                                    </div>
                                    <div className="small text-muted">{place.province} - {place.listingCount} dich vu</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-6 mb-4">
                    <div className="card shadow">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">Trip public moi</h6>
                        </div>
                        <div className="card-body">
                            {trips.filter((trip) => trip.status === 'Cong khai').slice(0, 4).map((trip) => (
                                <p key={trip.id} className="mb-2">{trip.title} - {trip.destination}</p>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 mb-4">
                    <div className="card shadow">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">Noi dung can kiem duyet</h6>
                        </div>
                        <div className="card-body">
                            {communityFeeds.map((feed) => (
                                <p key={feed.id} className="mb-2">{feed.title} <span className="badge badge-light">{feed.tag}</span></p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

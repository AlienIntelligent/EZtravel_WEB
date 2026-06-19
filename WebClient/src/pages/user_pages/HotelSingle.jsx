import React from 'react';
import { Link } from 'react-router-dom';
import { bookings, formatCurrency, hotels } from '../../data/usecaseData';

const HotelSingle = () => {
    const hotel = hotels[0];
    const relatedBookings = bookings.filter((booking) => booking.serviceName === hotel.name);

    return (
        <>
            <div className="hero-wrap js-fullheight" style={{ backgroundImage: `url(${hotel.image})`, minHeight: '100vh' }}>
                <div className="overlay"></div>
                <div className="container">
                    <div className="row no-gutters slider-text js-fullheight align-items-center justify-content-center">
                        <div className="col-md-9 ftco-animate text-center">
                            <p className="breadcrumbs"><span className="mr-2"><Link to="/">Trang chu</Link></span> <span>{hotel.type}</span></p>
                            <h1 className="mb-3 bread">{hotel.name}</h1>
                            <p>{hotel.province} - {formatCurrency(hotel.price)}/{hotel.unit}</p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="ftco-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <h2>{hotel.name}</h2>
                            <p>{hotel.description}</p>
                            <p>
                                {hotel.amenities.map((item) => (
                                    <span className="badge badge-light mr-2" key={item}>{item}</span>
                                ))}
                            </p>
                            <h4>Quy trinh booking</h4>
                            <ol>
                                <li>Chon so luong phong va thoi gian su dung dich vu.</li>
                                <li>He thong tinh lai tong tien tu gia dich vu tren backend.</li>
                                <li>Tao don dat cho va cap nhat trang thai thanh toan.</li>
                            </ol>
                        </div>
                        <div className="col-lg-4">
                            <div className="sidebar-wrap bg-light p-4">
                                <h3>Thong tin dat cho</h3>
                                <p><strong>Trang thai:</strong> {hotel.availability}</p>
                                <p><strong>Gia:</strong> {formatCurrency(hotel.price)}/{hotel.unit}</p>
                                <p><strong>Rating:</strong> {hotel.rating}/5 tu {hotel.reviews} danh gia</p>
                                <Link className="btn btn-primary py-3 px-5" to="/hotels">Dat dich vu</Link>
                            </div>
                            <div className="sidebar-wrap bg-light p-4 mt-4">
                                <h3>Booking gan nhat</h3>
                                {relatedBookings.map((booking) => (
                                    <p key={booking.id}>
                                        {booking.customer}: {booking.status} - {formatCurrency(booking.amount)}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HotelSingle;

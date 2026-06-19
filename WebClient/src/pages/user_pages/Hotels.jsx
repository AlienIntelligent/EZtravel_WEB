import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCompactCurrency, formatCurrency, hotels, restaurants } from '../../data/usecaseData';

const Rating = ({ value, reviews }) => (
    <p className="rate">
        {[0, 1, 2, 3, 4].map((index) => (
            <i key={index} className={index < Math.round(value) ? 'icon-star' : 'icon-star-o'}></i>
        ))}
        <span>{reviews} danh gia</span>
    </p>
);

const Hotels = () => {
    const [keyword, setKeyword] = useState('');
    const [province, setProvince] = useState('');
    const [maxPrice, setMaxPrice] = useState(1500000);

    const provinces = [...new Set(hotels.map((hotel) => hotel.province))];
    const filteredHotels = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();

        return hotels.filter((hotel) => {
            const matchKeyword =
                !normalizedKeyword ||
                hotel.name.toLowerCase().includes(normalizedKeyword) ||
                hotel.description.toLowerCase().includes(normalizedKeyword) ||
                hotel.type.toLowerCase().includes(normalizedKeyword);
            const matchProvince = !province || hotel.province === province;

            return matchKeyword && matchProvince && hotel.price <= maxPrice;
        });
    }, [keyword, maxPrice, province]);

    return (
        <>
            <div className="hero-wrap js-fullheight" style={{ backgroundImage: 'url("/images/bg_2.jpg")', minHeight: '100vh' }}>
                <div className="overlay"></div>
                <div className="container">
                    <div className="row no-gutters slider-text js-fullheight align-items-center justify-content-center">
                        <div className="col-md-9 ftco-animate text-center">
                            <p className="breadcrumbs">
                                <span className="mr-2"><Link to="/">Trang chu</Link></span> <span>Dich vu dat cho</span>
                            </p>
                            <h1 className="mb-3 bread">Khach san, homestay va nha hang</h1>
                            <p className="mb-0">Du lieu theo UC013-UC016: tim dich vu, dat cho, thanh toan va voucher.</p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="ftco-section ftco-degree-bg">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 sidebar ftco-animate">
                            <div className="sidebar-wrap bg-light ftco-animate">
                                <h3 className="heading mb-4">Loc dich vu</h3>
                                <div className="fields">
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Ten khach san, homestay..."
                                            value={keyword}
                                            onChange={(event) => setKeyword(event.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <div className="select-wrap one-third">
                                            <div className="icon"><span className="ion-ios-arrow-down"></span></div>
                                            <select className="form-control" value={province} onChange={(event) => setProvince(event.target.value)}>
                                                <option value="">Tat ca tinh thanh</option>
                                                {provinces.map((item) => (
                                                    <option value={item} key={item}>{item}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Gia toi da: {formatCurrency(maxPrice)}</label>
                                        <input
                                            type="range"
                                            className="form-control"
                                            min="300000"
                                            max="1500000"
                                            step="50000"
                                            value={maxPrice}
                                            onChange={(event) => setMaxPrice(Number(event.target.value))}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <button className="btn btn-primary py-3 px-5" type="button">Dang co {filteredHotels.length} dich vu</button>
                                    </div>
                                </div>
                            </div>

                            <div className="sidebar-wrap bg-light ftco-animate">
                                <h3 className="heading mb-4">Nhom use case</h3>
                                <p><strong>UC014</strong> tao booking, chon so luong va thoi gian.</p>
                                <p><strong>UC015</strong> cap nhat trang thai thanh toan.</p>
                                <p><strong>UC016</strong> ap voucher hop le.</p>
                            </div>
                        </div>

                        <div className="col-lg-9">
                            <div className="row">
                                {filteredHotels.map((hotel) => (
                                    <div className="col-md-4 ftco-animate" key={hotel.id}>
                                        <div className="destination">
                                            <Link
                                                to="/hotel-single"
                                                className="img img-2 d-flex justify-content-center align-items-center"
                                                style={{ backgroundImage: `url(${hotel.image})` }}
                                            >
                                                <div className="icon d-flex justify-content-center align-items-center">
                                                    <span className="icon-search2"></span>
                                                </div>
                                            </Link>
                                            <div className="text p-3">
                                                <div className="d-flex">
                                                    <div className="one">
                                                        <h3><Link to="/hotel-single">{hotel.name}</Link></h3>
                                                        <Rating value={hotel.rating} reviews={hotel.reviews} />
                                                    </div>
                                                    <div className="two">
                                                        <span className="price per-price">{formatCompactCurrency(hotel.price)}<br /><small>/{hotel.unit}</small></span>
                                                    </div>
                                                </div>
                                                <p>{hotel.description}</p>
                                                <p className="mb-2">
                                                    {hotel.amenities.map((item) => (
                                                        <span className="badge badge-light mr-1" key={item}>{item}</span>
                                                    ))}
                                                </p>
                                                <hr />
                                                <p className="bottom-area d-flex">
                                                    <span><i className="icon-map-o"></i> {hotel.province}</span>
                                                    <span className="ml-auto"><Link to="/hotel-single">{hotel.availability}</Link></span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="row mt-5">
                                <div className="col-md-12 heading-section ftco-animate">
                                    <span className="subheading">Dich vu an uong</span>
                                    <h2 className="mb-4"><strong>Nha hang</strong> lien quan</h2>
                                </div>
                                {restaurants.map((restaurant) => (
                                    <div className="col-md-6 ftco-animate" key={restaurant.id}>
                                        <div className="destination d-flex">
                                            <Link
                                                to="/hotels"
                                                className="img img-2"
                                                style={{ backgroundImage: `url(${restaurant.image})`, minWidth: 180 }}
                                            ></Link>
                                            <div className="text p-3">
                                                <h3><Link to="/hotels">{restaurant.name}</Link></h3>
                                                <Rating value={restaurant.rating} reviews={restaurant.reviews} />
                                                <p>{restaurant.description}</p>
                                                <p className="bottom-area d-flex">
                                                    <span><i className="icon-map-o"></i> {restaurant.province}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Hotels;

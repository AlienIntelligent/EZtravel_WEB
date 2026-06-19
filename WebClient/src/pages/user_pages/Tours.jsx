import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { destinations, formatCompactCurrency, formatCurrency, trips } from '../../data/usecaseData';

const Rating = ({ value, reviews }) => (
    <p className="rate">
        {[0, 1, 2, 3, 4].map((index) => (
            <i key={index} className={index < Math.round(value) ? 'icon-star' : 'icon-star-o'}></i>
        ))}
        <span>{reviews} danh gia</span>
    </p>
);

const Tours = () => {
    const [searchParams] = useSearchParams();
    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
    const [region, setRegion] = useState('');
    const [maxBudget, setMaxBudget] = useState(10000000);
    const [minRating, setMinRating] = useState(0);

    const filteredTrips = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();

        return trips.filter((trip) => {
            const matchKeyword =
                !normalizedKeyword ||
                trip.title.toLowerCase().includes(normalizedKeyword) ||
                trip.destination.toLowerCase().includes(normalizedKeyword) ||
                trip.description.toLowerCase().includes(normalizedKeyword);
            const matchRegion = !region || trip.region === region;
            const matchBudget = trip.budget <= maxBudget;
            const matchRating = trip.rating >= minRating;

            return matchKeyword && matchRegion && matchBudget && matchRating;
        });
    }, [keyword, maxBudget, minRating, region]);

    const regions = [...new Set(destinations.map((place) => place.region))];

    return (
        <>
            <div className="hero-wrap js-fullheight" style={{ backgroundImage: 'url("/images/bg_3.jpg")', minHeight: '100vh' }}>
                <div className="overlay"></div>
                <div className="container">
                    <div className="row no-gutters slider-text js-fullheight align-items-center justify-content-center">
                        <div className="col-md-9 ftco-animate text-center">
                            <p className="breadcrumbs">
                                <span className="mr-2"><Link to="/">Trang chu</Link></span> <span>Lich trinh tu tuc</span>
                            </p>
                            <h1 className="mb-3 bread">Lich trinh tu tuc Viet Nam</h1>
                            <p className="mb-0">Du lieu theo UC005-UC010: tao trip, them diem, clone va tinh chi phi.</p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="ftco-section ftco-degree-bg">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 sidebar ftco-animate">
                            <div className="sidebar-wrap bg-light ftco-animate">
                                <h3 className="heading mb-4">Tim lich trinh</h3>
                                <div className="fields">
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Ban muon di dau?"
                                            value={keyword}
                                            onChange={(event) => setKeyword(event.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <div className="select-wrap one-third">
                                            <div className="icon"><span className="ion-ios-arrow-down"></span></div>
                                            <select className="form-control" value={region} onChange={(event) => setRegion(event.target.value)}>
                                                <option value="">Tat ca vung mien</option>
                                                {regions.map((item) => (
                                                    <option value={item} key={item}>{item}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Budget toi da: {formatCurrency(maxBudget)}</label>
                                        <input
                                            value={maxBudget}
                                            min="1000000"
                                            max="10000000"
                                            step="500000"
                                            type="range"
                                            className="form-control"
                                            onChange={(event) => setMaxBudget(Number(event.target.value))}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <button className="btn btn-primary py-3 px-5" type="button">Dang co {filteredTrips.length} ket qua</button>
                                    </div>
                                </div>
                            </div>
                            <div className="sidebar-wrap bg-light ftco-animate">
                                <h3 className="heading mb-4">Xep hang sao</h3>
                                <div className="star-rating">
                                    {[5, 4, 3, 2, 1].map((star) => (
                                        <div className="form-check" key={star}>
                                            <input
                                                type="radio"
                                                name="rating"
                                                className="form-check-input"
                                                id={`rating-${star}`}
                                                checked={minRating === star}
                                                onChange={() => setMinRating(star)}
                                            />
                                            <label className="form-check-label" htmlFor={`rating-${star}`}>
                                                <p className="rate">
                                                    <span>
                                                        {[0, 1, 2, 3, 4].map((index) => (
                                                            <i key={index} className={index < star ? 'icon-star' : 'icon-star-o'}></i>
                                                        ))}
                                                    </span>
                                                </p>
                                            </label>
                                        </div>
                                    ))}
                                    <button className="btn btn-link p-0" type="button" onClick={() => setMinRating(0)}>Bo loc sao</button>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-9">
                            <div className="row">
                                {filteredTrips.map((trip) => (
                                    <div className="col-md-4 ftco-animate" key={trip.id}>
                                        <div className="destination">
                                            <Link
                                                to="/tours"
                                                className="img img-2 d-flex justify-content-center align-items-center"
                                                style={{ backgroundImage: `url(${trip.image})` }}
                                            >
                                                <div className="icon d-flex justify-content-center align-items-center">
                                                    <span className="icon-search2"></span>
                                                </div>
                                            </Link>
                                            <div className="text p-3">
                                                <div className="d-flex">
                                                    <div className="one">
                                                        <h3><Link to="/tours">{trip.title}</Link></h3>
                                                        <Rating value={trip.rating} reviews={trip.reviews} />
                                                    </div>
                                                    <div className="two">
                                                        <span className="price">{formatCompactCurrency(trip.budget)}</span>
                                                    </div>
                                                </div>
                                                <p>{trip.description}</p>
                                                <p className="days"><span>{trip.days} ngay {trip.nights} dem - {trip.people} nguoi</span></p>
                                                <p className="mb-2">
                                                    {trip.highlights.map((item) => (
                                                        <span className="badge badge-light mr-1" key={item}>{item}</span>
                                                    ))}
                                                </p>
                                                <hr />
                                                <p className="bottom-area d-flex">
                                                    <span><i className="icon-map-o"></i> {trip.destination}</span>
                                                    <span className="ml-auto"><Link to="/tours">Clone</Link></span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {filteredTrips.length === 0 && (
                                <div className="alert alert-light border">Khong co lich trinh phu hop voi bo loc hien tai.</div>
                            )}

                            <div className="row mt-5">
                                <div className="col text-center">
                                    <div className="block-27">
                                        <ul>
                                            <li><span>&lt;</span></li>
                                            <li className="active"><span>1</span></li>
                                            <li><span>2</span></li>
                                            <li><span>&gt;</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Tours;

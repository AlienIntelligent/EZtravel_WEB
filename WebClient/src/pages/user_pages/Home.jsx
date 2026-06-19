import React from 'react';
import { Link } from 'react-router-dom';
import {
    communityFeeds,
    destinations,
    formatCompactCurrency,
    formatCurrency,
    formatDate,
    hotels,
    restaurants,
    testimonials,
    trips,
} from '../../data/usecaseData';

const Rating = ({ value, reviews }) => (
    <p className="rate">
        {[0, 1, 2, 3, 4].map((index) => (
            <i key={index} className={index < Math.round(value) ? 'icon-star' : 'icon-star-o'}></i>
        ))}
        <span>{reviews} danh gia</span>
    </p>
);

const Home = () => {
    const topTrips = trips.slice(0, 6);
    const featuredHotels = hotels.slice(0, 6);
    const latestFeeds = communityFeeds.slice(0, 4);
    const counters = [
        { label: 'Nguoi dung', value: 2480 },
        { label: 'Diem den', value: destinations.length },
        { label: 'Lich trinh mau', value: trips.length },
        { label: 'Dich vu luu tru', value: hotels.length },
    ];

    return (
        <>
            <div
                className="hero-wrap js-fullheight"
                style={{ backgroundImage: 'url("/images/bg_1.jpg")', minHeight: '100vh' }}
            >
                <div className="overlay"></div>
                <div className="container">
                    <div className="row no-gutters slider-text js-fullheight align-items-center justify-content-start">
                        <div className="col-md-9 ftco-animate">
                            <h1 className="mb-4">
                                <strong>EZTravel</strong><br />Lap lich trinh tu tuc tren mot nen tang
                            </h1>
                            <p>
                                Tim dia diem, clone itinerary, tinh chi phi, dat dich vu va chia se trai nghiem cong dong.
                            </p>

                            <div className="block-17 my-4">
                                <form action="/tours" method="get" className="d-block d-flex">
                                    <div className="fields d-block d-flex">
                                        <div className="textfield-search one-third">
                                            <input
                                                type="text"
                                                name="keyword"
                                                className="form-control"
                                                placeholder="Ban muon di dau? Da Nang, Ha Giang..."
                                            />
                                        </div>
                                        <div className="select-wrap one-third">
                                            <div className="icon">
                                                <span className="ion-ios-arrow-down"></span>
                                            </div>
                                            <select name="days" className="form-control" style={{ color: '#000' }}>
                                                <option value="">Thoi gian</option>
                                                <option value="2">2-3 ngay</option>
                                                <option value="4">4-5 ngay</option>
                                                <option value="7">7 ngay</option>
                                            </select>
                                        </div>
                                    </div>
                                    <input type="submit" className="search-submit btn btn-primary" value="Tim kiem" />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="ftco-section services-section bg-light">
                <div className="container">
                    <div className="row d-flex">
                        {[
                            ['flaticon-guarantee', 'Tinh chi phi realtime', 'Tong hop ve, luu tru, di chuyen va voucher theo tung lich trinh.'],
                            ['flaticon-like', 'Clone lich trinh', 'Sao chep itinerary cong khai tu cong dong roi chinh lai theo ngay nghi cua ban.'],
                            ['flaticon-detective', 'Tim kiem tap trung', 'Loc dia diem, dich vu, tinh thanh va rating trong cung mot luong kham pha.'],
                            ['flaticon-support', 'Quan ly booking', 'Theo doi trang thai dat dich vu, thanh toan va lich su booking.'],
                        ].map(([icon, title, text]) => (
                            <div className="col-md-3 d-flex align-self-stretch ftco-animate" key={title}>
                                <div className="media block-6 services d-block text-center">
                                    <div className="d-flex justify-content-center">
                                        <div className="icon"><span className={icon}></span></div>
                                    </div>
                                    <div className="media-body p-2 mt-2">
                                        <h3 className="heading mb-3">{title}</h3>
                                        <p>{text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="ftco-section ftco-destination">
                <div className="container">
                    <div className="row justify-content-start mb-5 pb-3">
                        <div className="col-md-7 heading-section ftco-animate">
                            <span className="subheading">Search & Discovery</span>
                            <h2 className="mb-4"><strong>Diem den</strong> noi bat</h2>
                        </div>
                    </div>
                    <div className="row">
                        {destinations.map((place) => (
                            <div className="col-md-4 ftco-animate" key={place.id}>
                                <div className="destination">
                                    <Link
                                        to="/tours"
                                        className="img d-flex justify-content-center align-items-center"
                                        style={{ backgroundImage: `url(${place.image})` }}
                                    >
                                        <div className="icon d-flex justify-content-center align-items-center">
                                            <span className="icon-search2"></span>
                                        </div>
                                    </Link>
                                    <div className="text p-3">
                                        <h3><Link to="/tours">{place.name}</Link></h3>
                                        <span className="listing">{place.listingCount} dich vu</span>
                                        <p className="mt-2">{place.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="ftco-section bg-light">
                <div className="container">
                    <div className="row justify-content-start mb-5 pb-3">
                        <div className="col-md-7 heading-section ftco-animate">
                            <span className="subheading">Trip Planning</span>
                            <h2 className="mb-4"><strong>Lich trinh</strong> tu tuc hang dau</h2>
                        </div>
                    </div>
                    <div className="row">
                        {topTrips.map((trip) => (
                            <div className="col-md-6 col-lg-4 ftco-animate" key={trip.id}>
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
                                        <p className="days"><span>{trip.days} ngay {trip.nights} dem</span></p>
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
                </div>
            </section>

            <section
                className="ftco-section ftco-counter img"
                id="section-counter"
                style={{ backgroundImage: 'url("/images/bg_1.jpg")' }}
            >
                <div className="container">
                    <div className="row justify-content-center mb-5 pb-3">
                        <div className="col-md-7 text-center heading-section heading-section-white ftco-animate">
                            <h2 className="mb-4">Du lieu van hanh</h2>
                            <span className="subheading">Thong ke mau theo UC024 Dashboard</span>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        {counters.map((item) => (
                            <div className="col-md-3 d-flex justify-content-center counter-wrap ftco-animate" key={item.label}>
                                <div className="block-18 text-center">
                                    <div className="text">
                                        <strong className="number">{item.value}</strong>
                                        <span>{item.label}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="ftco-section">
                <div className="container">
                    <div className="row justify-content-start mb-5 pb-3">
                        <div className="col-md-7 heading-section ftco-animate">
                            <span className="subheading">Booking</span>
                            <h2 className="mb-4"><strong>Khach san</strong> &amp; cho o pho bien</h2>
                        </div>
                    </div>
                    <div className="row">
                        {featuredHotels.map((hotel) => (
                            <div className="col-md-6 col-lg-4 ftco-animate" key={hotel.id}>
                                <div className="destination">
                                    <Link
                                        to="/hotels"
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
                                                <h3><Link to="/hotels">{hotel.name}</Link></h3>
                                                <Rating value={hotel.rating} reviews={hotel.reviews} />
                                            </div>
                                            <div className="two">
                                                <span className="price per-price">{formatCompactCurrency(hotel.price)}<br /><small>/{hotel.unit}</small></span>
                                            </div>
                                        </div>
                                        <p>{hotel.description}</p>
                                        <hr />
                                        <p className="bottom-area d-flex">
                                            <span><i className="icon-map-o"></i> {hotel.province}</span>
                                            <span className="ml-auto"><Link to="/hotels">Dat ngay</Link></span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="ftco-section testimony-section bg-light">
                <div className="container">
                    <div className="row justify-content-start">
                        <div className="col-md-8 heading-section ftco-animate">
                            <span className="subheading">Community</span>
                            <h2 className="mb-4 pb-3"><strong>Trai nghiem</strong> thuc te</h2>
                        </div>
                    </div>
                    <div className="row">
                        {testimonials.map((item) => (
                            <div className="col-md-3 ftco-animate" key={item.id}>
                                <div className="testimony-wrap p-4 pb-5">
                                    <div className="user-img mb-5" style={{ backgroundImage: `url(${item.avatar})` }}>
                                        <span className="quote d-flex align-items-center justify-content-center">
                                            <i className="icon-quote-left"></i>
                                        </span>
                                    </div>
                                    <div className="text">
                                        <p className="mb-5">{item.content}</p>
                                        <p className="name">{item.name}</p>
                                        <span className="position">{item.position}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="ftco-section">
                <div className="container">
                    <div className="row justify-content-start mb-5 pb-3">
                        <div className="col-md-7 heading-section ftco-animate">
                            <span className="subheading">Dich vu lien quan</span>
                            <h2 className="mb-4"><strong>Nha hang</strong> pho bien</h2>
                        </div>
                    </div>
                    <div className="row">
                        {restaurants.map((restaurant) => (
                            <div className="col-md-6 col-lg-3 ftco-animate" key={restaurant.id}>
                                <div className="destination">
                                    <Link
                                        to="/hotels"
                                        className="img img-2 d-flex justify-content-center align-items-center"
                                        style={{ backgroundImage: `url(${restaurant.image})` }}
                                    >
                                        <div className="icon d-flex justify-content-center align-items-center">
                                            <span className="icon-search2"></span>
                                        </div>
                                    </Link>
                                    <div className="text p-3">
                                        <h3><Link to="/hotels">{restaurant.name}</Link></h3>
                                        <Rating value={restaurant.rating} reviews={restaurant.reviews} />
                                        <p>{restaurant.description}</p>
                                        <hr />
                                        <p className="bottom-area d-flex">
                                            <span><i className="icon-map-o"></i> {restaurant.province}</span>
                                            <span className="ml-auto"><Link to="/hotels">Kham pha</Link></span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="ftco-section bg-light">
                <div className="container">
                    <div className="row justify-content-start mb-5 pb-3">
                        <div className="col-md-7 heading-section ftco-animate">
                            <span className="subheading">Feed cong dong</span>
                            <h2 className="mb-4"><strong>Bai viet</strong> moi nhat</h2>
                        </div>
                    </div>
                    <div className="row d-flex">
                        {latestFeeds.map((post) => (
                            <div className="col-md-3 d-flex ftco-animate" key={post.id}>
                                <div className="blog-entry align-self-stretch">
                                    <Link to="/blog-single" className="block-20" style={{ backgroundImage: `url(${post.image})` }}></Link>
                                    <div className="text p-4 d-block">
                                        <span className="tag">{post.tag}</span>
                                        <h3 className="heading mt-3"><Link to="/blog-single">{post.title}</Link></h3>
                                        <p>{post.description}</p>
                                        <div className="meta mb-3">
                                            <div><Link to="/blog">{formatDate(post.date)}</Link></div>
                                            <div><Link to="/blog">{post.author}</Link></div>
                                            <div><Link to="/blog" className="meta-chat"><span className="icon-chat"></span> {post.comments}</Link></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="ftco-section-parallax">
                <div className="parallax-img d-flex align-items-center" style={{ background: 'linear-gradient(45deg, #2ecc71, #3498db)', padding: '100px 0' }}>
                    <div className="container">
                        <div className="row d-flex justify-content-center">
                            <div className="col-md-7 text-center heading-section heading-section-white ftco-animate">
                                <h2>Bat dau lap ke hoach</h2>
                                <p>Chi phi goi y cho lich trinh pho bien tu {formatCurrency(Math.min(...trips.map((trip) => trip.budget)))}.</p>
                                <p><Link to="/tours" className="btn btn-primary py-3 px-5">Xem lich trinh</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;

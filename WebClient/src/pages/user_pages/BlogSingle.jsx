import React from 'react';
import { Link } from 'react-router-dom';
import { communityFeeds, formatDate, trips } from '../../data/usecaseData';

const BlogSingle = () => {
    const post = communityFeeds[0];
    const trip = trips.find((item) => item.id === post.tripId);

    return (
        <>
            <div className="hero-wrap js-fullheight" style={{ backgroundImage: `url(${post.image})`, minHeight: '100vh' }}>
                <div className="overlay"></div>
                <div className="container">
                    <div className="row no-gutters slider-text js-fullheight align-items-center justify-content-center">
                        <div className="col-md-9 ftco-animate text-center">
                            <p className="breadcrumbs"><span className="mr-2"><Link to="/">Trang chu</Link></span> <span>{post.tag}</span></p>
                            <h1 className="mb-3 bread">{post.title}</h1>
                            <p>{post.author} - {formatDate(post.date)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="ftco-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <p>{post.description}</p>
                            <h3>Du lieu cong dong</h3>
                            <p>Bai viet gan voi trip public de nguoi dung co the xem, clone va dieu chinh lich trinh rieng.</p>
                            {trip && (
                                <div className="bg-light p-4">
                                    <h4>{trip.title}</h4>
                                    <p>{trip.description}</p>
                                    <p>{trip.days} ngay {trip.nights} dem - {trip.destination}</p>
                                    <Link className="btn btn-primary" to="/tours">Clone lich trinh</Link>
                                </div>
                            )}
                        </div>
                        <div className="col-lg-4 sidebar ftco-animate">
                            <div className="sidebar-box bg-light p-4">
                                <h3>Tuong tac</h3>
                                <p><span className="icon-heart"></span> {post.likes} luot thich</p>
                                <p><span className="icon-chat"></span> {post.comments} binh luan</p>
                                <p><span className="icon-map-o"></span> {post.destination}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default BlogSingle;

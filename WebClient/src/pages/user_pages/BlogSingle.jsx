import React from 'react';
import { Link } from 'react-router-dom';

const BlogSingle = () => {
    return (
        <>
            <div className="hero-wrap js-fullheight" style={{ backgroundImage: 'url("/images/bg_4.jpg")', minHeight: '100vh' }}>
                <div className="overlay"></div>
                <div className="container">
                    <div className="row no-gutters slider-text js-fullheight align-items-center justify-content-center" data-scrollax-parent="true">
                        <div className="col-md-9 ftco-animate text-center" data-scrollax=" properties: { translateY: '70%' }">
                            <p className="breadcrumbs" data-scrollax="properties: { translateY: '30%', opacity: 1.6 }">
                                <span className="mr-2"><Link to="/">Trang chủ</Link></span>
                                <span className="mr-2"><Link to="/blog">Kinh nghiệm</Link></span>
                                <span>Chi tiết</span>
                            </p>
                            <h1 className="mb-3 bread" data-scrollax="properties: { translateY: '30%', opacity: 1.6 }">Kinh nghiệm du lịch</h1>
                        </div>
                    </div>
                </div>
            </div>

            <section className="ftco-section ftco-degree-bg">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 ftco-animate">
                            <h2 className="mb-3">8 Cách Tiết Kiệm Chi Phí Khi Du Lịch Tự Túc</h2>
                            <p>Du lịch tự túc ngày càng trở nên phổ biến bởi sự linh hoạt và trải nghiệm cá nhân hóa. Tuy nhiên, nếu không biết cách quản lý tài chính, chuyến đi của bạn có thể tốn kém hơn dự tính. Dưới đây là những bí quyết giúp bạn tối ưu hóa chi phí mà vẫn tận hưởng trọn vẹn hành trình.</p>
                            <p>
                                <img src="/images/image_7.jpg" alt="" className="img-fluid" style={{ borderRadius: '10px' }} />
                            </p>
                            <p>Đầu tiên, việc đặt vé máy bay và phòng khách sạn sớm ít nhất 1-2 tháng sẽ giúp bạn tiết kiệm được một khoản đáng kể. Hãy sử dụng các ứng dụng so sánh giá để tìm được deal tốt nhất. Ngoài ra, việc lựa chọn đi vào mùa thấp điểm không chỉ giúp giảm chi phí mà còn giúp bạn tránh được sự đông đúc tại các điểm tham quan.</p>
                            <h2 className="mb-3 mt-5">#2. Lựa chọn phương tiện di chuyển địa phương</h2>
                            <p>Thay vì sử dụng taxi, hãy thử trải nghiệm xe buýt, tàu hỏa hoặc thuê xe máy để tự mình khám phá. Điều này không chỉ giúp bạn tiết kiệm tiền mà còn mang lại những trải nghiệm chân thực hơn về cuộc sống của người dân địa phương.</p>
                            <p>
                                <img src="/images/image_8.jpg" alt="" className="img-fluid" style={{ borderRadius: '10px' }} />
                            </p>
                            <p>Cuối cùng, hãy tìm hiểu về các địa điểm ăn uống của người bản địa thay vì vào những nhà hàng sang trọng nằm ở khu du lịch. Những quán ăn nhỏ ven đường thường mang lại hương vị đặc sắc nhất với mức giá vô cùng hợp lý.</p>
                            <div className="tag-widget post-tag-container mb-5 mt-5">
                                <div className="tagcloud">
                                    <a href="#" className="tag-cloud-link">Kinh nghiệm</a>
                                    <a href="#" className="tag-cloud-link">Tiết kiệm</a>
                                    <a href="#" className="tag-cloud-link">Du lịch</a>
                                    <a href="#" className="tag-cloud-link">Tự túc</a>
                                </div>
                            </div>

                            <div className="about-author d-flex p-5 bg-light" style={{ borderRadius: '10px' }}>
                                <div className="bio align-self-md-center mr-5">
                                    <img src="/images/person_1.jpg" alt="Image placeholder" className="img-fluid mb-4" style={{ borderRadius: '50%' }} />
                                </div>
                                <div className="desc align-self-md-center">
                                    <h3>Admin ezTravel</h3>
                                    <p>Đam mê du lịch và chia sẻ những giá trị tích cực đến cộng đồng phượt thủ Việt Nam.</p>
                                </div>
                            </div>


                            <div className="pt-5 mt-5">
                                <h3 className="mb-5">3 Bình luận</h3>
                                <ul className="comment-list">
                                    <li className="comment">
                                        <div className="vcard bio">
                                            <img src="/images/person_1.jpg" alt="Image placeholder" />
                                        </div>
                                        <div className="comment-body">
                                            <h3>Nguyễn Văn A</h3>
                                            <div className="meta">05/05/2026 lúc 14:00</div>
                                            <p>Bài viết rất hữu ích, cảm ơn admin đã chia sẻ!</p>
                                            <p><a href="#" className="reply">Trả lời</a></p>
                                        </div>
                                    </li>
                                </ul>

                                <div className="comment-form-wrap pt-5">
                                    <h3 className="mb-5">Để lại bình luận</h3>
                                    <form action="#" className="p-5 bg-light" style={{ borderRadius: '10px' }}>
                                        <div className="form-group">
                                            <label htmlFor="name">Họ và tên *</label>
                                            <input type="text" className="form-control" id="name" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Email *</label>
                                            <input type="email" className="form-control" id="email" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="message">Lời nhắn</label>
                                            <textarea name="" id="message" cols="30" rows="10" className="form-control"></textarea>
                                        </div>
                                        <div className="form-group">
                                            <input type="submit" value="Gửi bình luận" className="btn py-3 px-4 btn-primary" />
                                        </div>

                                    </form>
                                </div>
                            </div>

                        </div>
                        <div className="col-md-4 sidebar ftco-animate">
                            <div className="sidebar-box">
                                <form action="#" className="search-form">
                                    <div className="form-group">
                                        <span className="icon fa fa-search"></span>
                                        <input type="text" className="form-control" placeholder="Tìm kiếm bài viết..." />
                                    </div>
                                </form>
                            </div>
                            <div className="sidebar-box ftco-animate">
                                <div className="categories">
                                    <h3>Danh mục</h3>
                                    <li><a href="#">Lộ trình <span>(12)</span></a></li>
                                    <li><a href="#">Khách sạn <span>(22)</span></a></li>
                                    <li><a href="#">Ẩm thực <span>(37)</span></a></li>
                                    <li><a href="#">Kinh nghiệm <span>(140)</span></a></li>
                                </div>
                            </div>

                            <div className="sidebar-box ftco-animate">
                                <h3>Bài viết mới nhất</h3>
                                {[1, 2, 3].map((i) => (
                                    <div className="block-21 mb-4 d-flex" key={i}>
                                        <a className="blog-img mr-4" style={{ backgroundImage: `url(/images/image_${i}.jpg)`, borderRadius: '5px' }}></a>
                                        <div className="text">
                                            <h3 className="heading"><Link to="/blog-single">Những điểm đến không thể bỏ qua trong năm 2026</Link></h3>
                                            <div className="meta">
                                                <div><a href="#"><span className="icon-calendar"></span> May 05, 2026</a></div>
                                                <div><a href="#"><span className="icon-person"></span> Admin</a></div>
                                                <div><a href="#"><span className="icon-chat"></span> 19</a></div>
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

export default BlogSingle;

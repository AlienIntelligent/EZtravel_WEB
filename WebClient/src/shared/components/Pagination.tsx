import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div className="row mt-5">
            <div className="col text-center">
                <div className="block-27">
                    <ul>
                        <li>
                            <button 
                                className="btn btn-link" 
                                disabled={currentPage === 1}
                                onClick={() => onPageChange(currentPage - 1)}
                                style={{ padding: '0 10px', textDecoration: 'none', border: '1px solid #e6e6e6', borderRadius: '50%', width: '40px', height: '40px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#f9a826' }}
                            >
                                &lt;
                            </button>
                        </li>
                        {pages.map(page => (
                            <li key={page} className={currentPage === page ? 'active' : ''} style={{ display: 'inline-block', margin: '0 5px' }}>
                                <button 
                                    className="btn btn-link"
                                    onClick={() => onPageChange(page)}
                                    style={{ 
                                        padding: '0',
                                        width: '40px', 
                                        height: '40px', 
                                        borderRadius: '50%',
                                        background: currentPage === page ? '#f9a826' : 'transparent',
                                        color: currentPage === page ? '#fff' : '#f9a826',
                                        border: currentPage === page ? 'none' : '1px solid #e6e6e6',
                                        textDecoration: 'none'
                                    }}
                                >
                                    {page}
                                </button>
                            </li>
                        ))}
                        <li>
                            <button 
                                className="btn btn-link" 
                                disabled={currentPage === totalPages}
                                onClick={() => onPageChange(currentPage + 1)}
                                style={{ padding: '0 10px', textDecoration: 'none', border: '1px solid #e6e6e6', borderRadius: '50%', width: '40px', height: '40px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#f9a826' }}
                            >
                                &gt;
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Pagination;

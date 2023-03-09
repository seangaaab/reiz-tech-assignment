interface PaginationProps {
    countriesPerPage: number;
    totalCountries: number;
    paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ countriesPerPage, totalCountries, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalCountries / countriesPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className="pagination">
                {pageNumbers.map((number: number) => (
                    <li key={number} className="page-item">
                        <a
                            className="page-link"
                            onClick={(e) => {
                                e.preventDefault();
                                paginate(number);
                            }}
                        >
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Pagination;
import styles from "./Pagination.module.css"

interface PaginationProps {
    countriesPerPage: number;
    totalCountries: number;
    currentPage: number;
    paginate: (pageNumber: number) => void;
}

const back: string = "<";
const forward: string = ">";

const Pagination: React.FC<PaginationProps> = ({ currentPage, countriesPerPage, totalCountries, paginate }) => {
    const pageNumbers = [];

    // computes for total number of pages and adds it to array
    for (let i = 1; i <= Math.ceil(totalCountries / countriesPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav id={styles.pagination}>
            <ul className={styles.listContainer}>
                {   // hides back button if 1st page
                    currentPage === 1 ? (
                        <li className={styles.disabled}>{back}</li>
                    ) : (
                        <li
                            onClick={(e) => {
                                e.preventDefault();
                                paginate(currentPage - 1);
                            }}
                        >{back}</li>
                    )
                }
                {
                    pageNumbers.map((number: number) => (
                        <li
                            key={number}
                            className={currentPage == number ? styles.active : ""}
                            onClick={(e) => {
                                e.preventDefault();
                                paginate(number);
                            }}
                        >
                            {number}
                        </li>
                    ))}
                { // hides next button if last page
                    currentPage === pageNumbers.length ? (
                        <li className={styles.disabled}>{forward}</li>
                    ) : (
                        <li
                            onClick={(e) => {
                                e.preventDefault();
                                paginate(currentPage + 1);
                            }}
                        >{forward}</li>
                    )
                }
            </ul>
        </nav>
    );
};

export default Pagination;
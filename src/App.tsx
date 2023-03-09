import React, { useState, useEffect } from "react";
import Pagination from "./components/Pagination/Pagination";

type Country = {
  name: string;
  region: string;
  area: number;
};

const App = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const countriesPerPage: number = 10;
  const [originalList, setOriginalList] = useState<Country[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      const response = await fetch(
        "https://restcountries.com/v2/all?fields=name,region,area"
      );
      const data = await response.json();
      const formattedData = data.map((country: any) => ({
        name: country.name,
        region: country.region,
        area: country.area || 0
      }));
      setCountries(formattedData);
      setOriginalList(formattedData);
      setLoading(false);
    };
    fetchCountries();
  }, []);

  const indexOfLastCountry: number = currentPage * countriesPerPage;
  const indexOfFirstCountry: number = indexOfLastCountry - countriesPerPage;
  let currentCountries: Country[] = []
  currentCountries = countries.slice(
    indexOfFirstCountry,
    indexOfLastCountry
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const sortByName = (arrangement: string) => {
    let sortedCountries: Country[] = [];

    if (arrangement === "asc") {
      sortedCountries = [...countries].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else if (arrangement === "desc") {
      sortedCountries = [...countries].sort((a, b) =>
        b.name.localeCompare(a.name)
      );
    }
    setCountries(sortedCountries);
    setCurrentPage(1);
  };

  const filterBy = (filterby: string) => {
    let filteredCountries: Country[] = [];
    if (filterby === "SmallerThanLithuania") {
      filteredCountries = [...countries].filter((country) => country.area < 65300);
    } else if (filterby === "InOceania") {
      filteredCountries = [...countries].filter((country) => country.region === "Oceania");
    }
    setCountries(filteredCountries);
    setCurrentPage(1);
  }

  const resetFilters = () => {
    setCountries(originalList);
    setCurrentPage(1);
    console.log(originalList)
  }

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div>
            <button onClick={() => sortByName("asc")}>Sort A-Z</button>
            <button onClick={() => sortByName("desc")}>Sort Z-A</button>
            <button onClick={() => filterBy("SmallerThanLithuania")}>Smaller than Lithuania</button>
            <button onClick={() => filterBy("InOceania")}>Countries in Oceania</button>
            <button onClick={() => resetFilters()}>Reset</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Region</th>
                <th>Area</th>
              </tr>
            </thead>
            <tbody>
              {currentCountries.map((country, index) => (
                <tr key={index}>
                  <td>{country.name}</td>
                  <td>{country.region}</td>
                  <td>{country.area}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            countriesPerPage={countriesPerPage}
            totalCountries={countries.length}
            paginate={paginate}
          />
        </div>
      )}
    </div>
  );
};

export default App;
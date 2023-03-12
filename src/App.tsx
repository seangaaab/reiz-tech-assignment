import React, { useState, useEffect, useRef } from "react";
import Pagination from "./components/Pagination/Pagination";
import filterList from './filters/filterList'
import './App.css'

type Country = {
  name: string;
  region: string;
  area: number;
};

const App: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const countriesPerPage: number = 20;
  const [originalList, setOriginalList] = useState<Country[]>([]);
  const [toggleSort, setToggleSort] = useState<boolean>(true);
  const [filters, setFilters] = useState<string[]>([]);

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
        area: country.area
      }));
      setCountries(formattedData);
      setLoading(false);
    };
    fetchCountries();
    sortByName("asc")
    setOriginalList(countries);
  }, []);

  useEffect(()=>{
    let filteredCountries: Country[] = originalList;

    filters.forEach((filter) => {
      switch (filter) {
        case "SmallerThanLithuania":
          filteredCountries = filteredCountries.filter((country) => country.area < 65200);
          break;
        case "InOceania":
          filteredCountries = filteredCountries.filter((country) => country.region === "Oceania");
          break;
        default:
          break;
      }
    });

    setCountries(filteredCountries);
    setCurrentPage(1);
    console.log(filters)
  },[filters])

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

  const sortBtn = () => {
    setToggleSort(!toggleSort);
    if (toggleSort) {
      sortByName("desc");
    } else {
      sortByName("asc");
    }
  }

  const [checked, setChecked] = useState<string[]>([]);

  const handleCheckBoxToggle = (value:string) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if(currentIndex === -1){
      newChecked.push(value);
    }
    else{
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    setFilters(newChecked);
  }

  const resetFilters = () => {
    setCountries(originalList);
    setToggleSort(true);
    setCurrentPage(1);
    setChecked([]);
    setFilters([]);
  }

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div>
            <button onClick={() => sortBtn()}>
              {
                toggleSort ? "Sort A-Z↥" : "Sort Z-A↧"
              }
            </button>

            {
              filterList.map((filter) => {

                return (
                  <span key={filter.id}>
                    <input
                      type="checkbox"
                      id={filter.name}
                      checked={checked.indexOf(filter.name) === -1 ? false : true}
                      onChange={() => {
                        handleCheckBoxToggle(filter.name)
                      }}
                    />
                    <label htmlFor={filter.name}>{filter.displayName}</label>
                  </span>
                )
              })
            }

            <button onClick={() => resetFilters()}> Reset</button>
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
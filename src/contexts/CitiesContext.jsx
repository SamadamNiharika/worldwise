import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();

const initialState = {
  isLoading: false,
  cities: [],
  currentCity: {},
  errorState: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loading":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };

    case "city/loading":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "city/added":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };

    case "rejected":
      return { ...state, isLoading: false, errorState: action.payload };

    default:
      throw new Error("Action is undefined");
  }
}
function CitiesProvider({ children }) {
  const [{ isLoading, cities, currentCity }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });

      try {
        // setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();

        // setCities(data);
        dispatch({ type: "cities/loading", payload: data });
      } catch (err) {
        // alert("Something went wrong...");
        dispatch({
          type: "rejected",
          payload: "There was an error loading the cities...",
        });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;

      dispatch({ type: "loading" });
      try {
        // setIsLoading(true);

        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        // setCurrentCity(data);

        dispatch({ type: "city/loading", payload: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "There was an error loading the cities...",
        });
      }
    },
    [currentCity.id],
  );

  async function addNewCity(newCity) {
    dispatch({ type: "loading" });
    try {
      if (cities.some((city) => city.cityName === newCity.cityName)) {
        throw new Error("City already exists");
      }

      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log(data);
      // setCities((cities) => [...cities, data]);
      dispatch({ type: "city/added", payload: data });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error loading the cities...",
      });
    }
  }

  async function deleteCity(id) {
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      // console.log(data);
      // setCities((cities) => cities.filter((city) => city.id !== id));

      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error loading the cities...",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        addNewCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context === undefined)
    throw new Error("CitiesContext is used outside of the CitiesProvider");

  return context;
}

/* eslint-disable react-refresh/only-export-components */
export { CitiesProvider, useCities };

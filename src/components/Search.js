import React, { useEffect, useState } from "react";

/**
 * Don't touch these imports!
 */
import {
  fetchAllCenturies,
  fetchAllClassifications,
  fetchQueryResults,
} from "../api";

const Search = ({ setIsLoading, setSearchResults }) => {
  // Make sure to destructure setIsLoading and setSearchResults from the props
  const [centurylist, setCenturyList] = useState([]);
  const [classificationList, setClassificationList] = useState([]);
  const [queryString, setQueryString] = useState("");
  const [century, setCentury] = useState("any");
  const [classification, setClassification] = useState("any");
  /**
   * We are at the Search component, a child of app. This has a form, so we need to use useState for
   * our controlled inputs:
   *
   * centuryList, setCenturyList (default should be an empty array, [])
   * classificationList, setClassificationList (default should be an empty array, [])
   * queryString, setQueryString (default should be an empty string, '')
   * century, setCentury (default should be the string 'any')
   * classification, setClassification (default should be the string 'any')
   */

  /**
   * Inside of useEffect, use Promise.all([]) with fetchAllCenturies and fetchAllClassifications
   *
   * In the .then() callback pass the returned lists to setCenturyList and setClassificationList
   *
   * Make sure to console.error on caught errors from the API methods.
   */

  // Need to understand why logic wouldnt work?

  // useEffect(() => {
  //   Promise.all([fetchAllCenturies(), fetchAllClassifications()])
  //   .then(([centuries, classifications]) => {
  //     setCenturyList(centuries);
  //     setClassificationList(classifications);
  //   })
  //   .catch((error) => {
  //     console.error('Error getting data', error);
  //   });

  // }, []);
  useEffect(() => {
    try {
      const classificationPromise = fetchAllClassifications();
      const centuryPromise = fetchAllCenturies();
      Promise.all([classificationPromise, centuryPromise]).then((data) => {
        setClassificationList(data[0]);
        setCenturyList(data[1]);
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    console.log(classification);
  }, [classification]);

  useEffect(() => {
    console.log(century);
  }, [century]);

  /**
   * This is a form element, so we need to bind an onSubmit handler to it which:
   *
   * calls event.preventDefault()
   * calls setIsLoading, set it to true
   *
   * then, in a try/catch/finally block:
   *
   * try to:
   * - get the results from fetchQueryResults({ century, classification, queryString })
   * - pass them to setSearchResults
   *
   * catch: error to console.error
   *
   * finally: call setIsLoading, set it to false
   */
  return (
    <form
      id="search"
      onSubmit={async (event) => {
        // write code here

        event.preventDefault();
        setIsLoading(true);
        try {
          let result = await fetchQueryResults({
            century,
            classification,
            queryString,
          });
          setSearchResults(result);
        } catch (error) {
          console.error("Error getting search results", error);
        }
        setIsLoading(false);
      }}
    >
      <fieldset>
        <label htmlFor="keywords">Query</label>
        <input
          id="keywords"
          type="text"
          placeholder="enter keywords..."
          value={queryString}
          onChange={(event) => setQueryString(event.target.value)}
        />
      </fieldset>
      <fieldset>
        <label htmlFor="select-classification">
          Classification{""}{" "}
          <span className="classification-count">
            ({classificationList.length})
          </span>
        </label>
        <select
          name="classification"
          id="select-classification"
          value={classification}
          onChange={(event) => setClassification(event.target.value)}
        >
          <option value="any">Any</option>
          {classificationList.map((classification) => (
            <option key={classification} value={classification}>
              {classification}
            </option>
          ))}
        </select>
      </fieldset>
      <fieldset>
        <label htmlFor="select-century">
          Century{""}{" "}
          <span className="century-count">({centurylist.length})</span>
        </label>
        <select
          name="century"
          id="select-century"
          value={century}
          onChange={(event) => setCentury(event.target.value)}
        >
          <option value="any">Any</option>
          {centurylist.map((century) => (
            <option key={century} value={century}>
              {century}
            </option>
          ))}
        </select>
      </fieldset>
      <button>SEARCH</button>
    </form>
  );
};

export default Search;

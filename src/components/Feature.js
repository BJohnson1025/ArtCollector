import React, { Fragment } from "react";

// Don't touch this import
import { fetchQueryResultsFromTermAndValue } from "../api";

/**
 * We need a new component called Searchable which:
 *
 * Has a template like this:
 *
 * <span className="content">
 *  <a href="#" onClick={async (event) => {}}>SOME SEARCH TERM</a>
 * </span>
 *
 * You'll need to read searchTerm, searchValue, setIsLoading, and setSearchResults off of the props.
 *
 * When someone clicks the anchor tag, you should:
 *
 * - preventDefault on the event
 * - call setIsLoading, set it to true
 *
 * Then start a try/catch/finally block:
 *
 * try:
 *  - await the result of fetchQueryResultsFromTermAndValue, passing in searchTerm and searchValue
 *  - send the result to setSearchResults (which will update the Preview component)
 * catch:
 *  - console.error the error
 * finally:
 *  - call setIsLoading, set it to false
 */
const Searchable = ({
  searchTerm,
  searchValue,
  setIsLoading,
  setSearchResults,
}) => {
  return (
    <span className="content">
      <a
        href="#"
        onClick={async (event) => {
          event.preventDefault();
          setIsLoading(true);
          try {
            const response = await fetchQueryResultsFromTermAndValue(
              searchTerm,
              searchValue.replaceAll(" ", "-")
            );
            setSearchResults(response);
          } catch (err) {
            console.error(err);
          } finally {
            setIsLoading(false);
          }
        }}
      >
        {searchValue}
      </a>
    </span>
  );
};

/**
 * We need a new component called Feature which looks like this when no featuredResult is passed in as a prop:
 *
 * <main id="feature"></main>
 *
 * And like this when one is:
 *
 * <main id="feature">
 *   <div className="object-feature">
 *     <header>
 *       <h3>OBJECT TITLE</h3>
 *       <h4>WHEN IT IS DATED</h4>
 *     </header>
 *     <section className="facts">
 *       <span className="title">FACT NAME</span>
 *       <span className="content">FACT VALUE</span>
 *       <span className="title">NEXT FACT NAME</span>
 *       <span className="content">NEXT FACT VALUE</span>
 *     </section>
 *     <section className="photos">
 *       <img src=IMAGE_URL alt=SOMETHING_WORTHWHILE />
 *     </section>
 *   </div>
 * </main>
 *
 * The different facts look like this: title, dated, images, primaryimageurl, description, culture, style,
 * technique, medium, dimensions, people, department, division, contact, creditline
 *
 * The <Searchable /> ones are: culture, technique, medium (first toLowerCase it), and person.displayname (one for each PEOPLE)
 *
 * NOTE: people and images are likely to be arrays, and will need to be mapped over if they exist
 *
 * This component should be exported as default.
 */
const Feature = ({ featuredResult, setIsLoading, setSearchResults }) => {
  const searchFacts = ["culture", "technique", "medium"];
  const otherFacts = [
    "description",
    "dated",
    "style",
    "dimensions",
    "department",
    "division",
    "contact",
    "creditline",
  ];
  return (
    <>
      {!featuredResult ? (
        <main id="feature"></main>
      ) : (
        <main id="feature">
          <div className="object-feature">
            <header>
              <h3>{featuredResult.title}</h3>
              <h4>{featuredResult.dated}</h4>
            </header>
            <section className="facts">
              {searchFacts.map((el, ind) => {
                return (
                  <React.Fragment key={ind + el}>
                    {featuredResult[el] ? (
                      <>
                        <span
                          className="title"
                          style={{ textTransform: "capitalize" }}
                        >
                          {el}
                        </span>
                        <Searchable
                          searchValue={featuredResult[el]}
                          searchTerm={el}
                          setIsLoading={setIsLoading}
                          setSearchResults={setSearchResults}
                        />
                      </>
                    ) : null}
                  </React.Fragment>
                );
              })}
              {featuredResult.people
                ? featuredResult.people.map((el, ind) => {
                    return (
                      <React.Fragment key={ind + el.displayname}>
                        <span
                          className="title"
                          style={{ textTransform: "capitalize" }}
                        >
                          person
                        </span>
                        <Searchable
                          searchValue={el.displayname}
                          searchTerm={"displayname"}
                          setIsLoading={setIsLoading}
                          setSearchResults={setSearchResults}
                        />
                      </React.Fragment>
                    );
                  })
                : null}
              {otherFacts.map((el, ind) => {
                return (
                  <React.Fragment key={ind + el}>
                    {featuredResult[el] ? (
                      <>
                        <span
                          className="title"
                          style={{ textTransform: "capitalize" }}
                        >
                          {el}
                        </span>
                        <span className="content">{featuredResult[el]}</span>
                      </>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </section>
            <section className="photos">
              {featuredResult.images
                ? featuredResult.images.map((el, ind) => {
                    return (
                      <img
                        key={`${ind}-${el.imageid}`}
                        src={el.baseimageurl}
                        alt={el.alttext}
                      />
                    );
                  })
                : null}
            </section>
          </div>
        </main>
      )}
    </>
  );
};

export default Feature;

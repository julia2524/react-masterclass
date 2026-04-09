import { useLocation } from "react-router-dom";
import { getSearchDatas, ISearchDatas } from "../api";
import styled from "styled-components";
import { useQuery } from "react-query";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background-color: black;
  padding: 60px;
  padding-top: 100px;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Section = styled.div`
  margin-bottom: 80px;
`;
const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 25px;
`;
const SearchItem = styled.div`
  cursor: pointer;
  position: relative;
  transition: transform 0.3s ease;
  img {
    width: 100%;
    border-radius: 4px;
  }
  &:hover img {
    transform: translateY(-10px);
    filter: brightness(0.7);
  }
  div {
    margin-top: 10px;
    h3 {
      font-size: 16px;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    p {
      font-size: 14px;
      color: #808080;
      margin-top: 5px;
    }
  }
`;
const Title = styled.h2`
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 30px;
  border-left: 5px solid red;
  padding-left: 15px;
`;
function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  console.log(keyword);
  const { data: searchData, isLoading } = useQuery<ISearchDatas>(
    ["search", keyword],
    () => getSearchDatas(keyword!),
    {
      enabled: !!keyword,
    }
  );
  const filteredResult = searchData?.results.filter(
    (item) => item.media_type !== "person" && item.poster_path
  );
  const movies = filteredResult?.filter((item) => item.media_type === "movie");
  const tvs = filteredResult?.filter((item) => item.media_type === "tv");
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {movies && movies.length > 0 && (
            <Section>
              <Title>Movies for "{keyword}"</Title>
              <ResultsGrid>
                {movies?.slice(0, 18).map((item) => (
                  <SearchItem key={item.id}>
                    <img src={makeImagePath(item.poster_path, "w200")} />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.release_date?.slice(0, 4)}</p>
                    </div>
                  </SearchItem>
                ))}
              </ResultsGrid>
            </Section>
          )}

          {tvs && tvs.length > 0 && (
            <Section>
              <Title>TV Shows for "{keyword}"</Title>
              <ResultsGrid>
                {tvs?.slice(0, 18).map((item) => (
                  <SearchItem key={item.id}>
                    <img src={makeImagePath(item.poster_path, "w200")} />
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.first_air_date?.slice(0, 4)}</p>
                    </div>
                  </SearchItem>
                ))}
              </ResultsGrid>
            </Section>
          )}
          {filteredResult?.length === 0 && (
            <Loader>Oops, Nothing found! Try again. 🧐</Loader>
          )}
        </>
      )}
    </Wrapper>
  );
}

export default Search;

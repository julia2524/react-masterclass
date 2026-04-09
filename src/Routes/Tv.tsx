import { useQuery } from "react-query";
import {
  getNowPlayingTvs,
  getPopularTvs,
  getTopRatedTvs,
  getTvDetail,
  ITvsResult,
  ITvDetailResult,
} from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { AnimatePresence, motion, useScroll, Variants } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

const Wrapper = styled.div`
  background-color: black;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;
const Slider = styled.div<{ isFirst?: boolean }>`
  position: relative;
  margin-bottom: 80px;
  height: 250px;
  margin-top: ${(props) => (props.isFirst ? "-100px" : "0px")};
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;
const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;
const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;
const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;
const BigTitle = styled.h3<{ isLong: boolean }>`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: ${(props) => (props.isLong ? "28px" : "46px")};
  position: relative;
  top: -80px;
  height: 100px;
`;
const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -140px;
  color: ${(props) => props.theme.white.lighter};
`;
const Category = styled.h1`
  font-size: 40px;
  font-weight: 600;
`;
const Button = styled.button`
  border: none;
  border-radius: 15px;
  background-color: ${(props) => props.theme.black.lighter};
  height: 100px;
  top: 95px;
  right: 20px;
  cursor: pointer;
  position: absolute;
  z-index: 10;
  color: ${(props) => props.theme.white.lighter};
`;
const BigMetaDatas = styled.ul`
  padding: 20px;
  position: relative;
  top: -110px;
  display: flex;
`;
const BigMetaData = styled.li`
  background-color: ${(props) => props.theme.black.darker};
  padding: 8px;
  margin-right: 5px;
  border-radius: 15px;
  font-size: 13px;
`;

const rowVariants: Variants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};
const boxVariants: Variants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: { delay: 0.5, duration: 0.1, type: "tween" },
  },
};
const infoVariant: Variants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const offset = 6;

function Tv() {
  const history = useHistory();
  const bigTvMatch = useRouteMatch<{ tvId: string; category: string }>(
    "/tvs/:category/:tvId"
  );
  const { scrollY } = useScroll();
  const nowPlayingData = useQuery<ITvsResult>(
    ["tvs", "nowPlaying"],
    getNowPlayingTvs
  );
  const popularData = useQuery<ITvsResult>(["tvs", "popular"], getPopularTvs);
  const topRatedData = useQuery<ITvsResult>(
    ["tvs", "topRated"],
    getTopRatedTvs
  );
  const isLoading =
    nowPlayingData.isLoading || popularData.isLoading || topRatedData.isLoading;
  const [nowPlayingindex, setNowPlayingIndex] = useState(0);
  const [popularIndex, setPopularIndex] = useState(0);
  const [topRatedIndex, setTopRatedIndex] = useState(0);
  const [nowLeaving, setNowLeaving] = useState(false);
  const toggleNowLeaving = () => setNowLeaving((prev) => !prev);
  const nowPlayingIncreaseIndex = () => {
    if (nowPlayingData.data) {
      if (nowLeaving) return;
      toggleNowLeaving();
      const totalTvs = nowPlayingData.data?.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setNowPlayingIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const [popularLeaving, setPopularLeaving] = useState(false);
  const togglePopularLeaving = () => setPopularLeaving((prev) => !prev);
  const popularIncreaseIndex = () => {
    if (popularData.data) {
      if (popularLeaving) return;
      togglePopularLeaving();
      const totalTvs = popularData.data?.results.length;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setPopularIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const [topRatedLeaving, setTopRatedLeaving] = useState(false);
  const toggleTopRatedLeaving = () => setTopRatedLeaving((prev) => !prev);
  const topRatedIncreaseIndex = () => {
    if (topRatedData.data) {
      if (topRatedLeaving) return;
      toggleTopRatedLeaving();
      const totalTvs = topRatedData.data?.results.length;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setTopRatedIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const onBoxClicked = (tvId: number, category: string) => {
    history.push(`/tvs/${category}/${tvId}`);
  };
  const onOverlayClick = () => history.push("/tv");

  const allTvs = [
    ...(nowPlayingData.data?.results ?? []),
    ...(popularData.data?.results ?? []),
    ...(topRatedData.data?.results ?? []),
  ];
  const clickedTv =
    bigTvMatch?.params.tvId &&
    allTvs.find((tv) => tv.id === +bigTvMatch.params.tvId);

  //check!!!!!!!!!!!!!!!!!!!!!
  const { data: tvDetail } = useQuery<ITvDetailResult>(
    ["tvDetail", bigTvMatch?.params.tvId],
    () => getTvDetail(bigTvMatch!.params.tvId),
    { enabled: !!bigTvMatch }
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              nowPlayingData.data?.results[0].backdrop_path || ""
            )}
          >
            <Title>{nowPlayingData.data?.results[0].name}</Title>
            <Overview>{nowPlayingData.data?.results[0].overview}</Overview>
          </Banner>
          <Slider isFirst>
            <Category>On The Air</Category>
            <AnimatePresence initial={false} onExitComplete={toggleNowLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 1 }}
                key={nowPlayingindex}
              >
                {nowPlayingData.data?.results
                  .slice(1)
                  .slice(
                    offset * nowPlayingindex,
                    offset * nowPlayingindex + offset
                  )
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + "now"}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id, "now")}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariant}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <Button onClick={nowPlayingIncreaseIndex}>Next</Button>
          </Slider>
          <Slider>
            <Category>Popular</Category>
            <AnimatePresence
              initial={false}
              onExitComplete={togglePopularLeaving}
            >
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 1 }}
                key={popularIndex}
              >
                {popularData.data?.results
                  .slice(1)
                  .slice(offset * popularIndex, offset * popularIndex + offset)
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + "popular"}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id, "popular")}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariant}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <Button onClick={popularIncreaseIndex}>Next</Button>
          </Slider>
          <Slider>
            <Category>Top Rated</Category>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleTopRatedLeaving}
            >
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 1 }}
                key={topRatedIndex}
              >
                {topRatedData.data?.results
                  .slice(1)
                  .slice(
                    offset * topRatedIndex,
                    offset * topRatedIndex + offset
                  )
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + "top"}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id, "top")}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariant}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <Button onClick={topRatedIncreaseIndex}>Next</Button>
          </Slider>

          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{
                    top: scrollY.get() + 100,
                  }}
                  layoutId={bigTvMatch.params.tvId + bigTvMatch.params.category}
                >
                  {clickedTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top,black, transparent), url(${makeImagePath(
                            clickedTv.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle isLong={clickedTv.name.length > 15}>
                        {clickedTv.name}
                      </BigTitle>
                      <BigMetaDatas>
                        <BigMetaData>
                          {tvDetail?.first_air_date?.slice(0, 4)}
                        </BigMetaData>
                        <BigMetaData>
                          {tvDetail?.adult ? "19+" : "15+"}
                        </BigMetaData>
                        {tvDetail?.genres.slice(0, 3).map((g) => (
                          <BigMetaData> {g.name} </BigMetaData>
                        ))}
                      </BigMetaDatas>
                      <BigOverview>{clickedTv.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Tv;

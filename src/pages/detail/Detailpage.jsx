import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  BrowserRouter as Router,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Slider from "react-slick";
import { useQuery, useMutation } from "react-query";
import axios from "axios";

// 아이콘
import star from "../../assets/star.svg";
import yellowStar from "../../assets/yellowStar.svg";
import locationWhite from "../../assets/iconLocationWhite.svg";
import locationGreen from "../../assets/iconLocationGreen.svg";
import arrowButtonRight from "../../assets/arrowbutton.png";
import arrowButtonLeft from "../../assets/arrowbutton.png";
import phoneGreen from "../../assets/phoneGreen.svg";
import clockGreen from "../../assets/clockGreen.svg";
import tagGreen from "../../assets/tagGreen.svg";
import smileGreen from "../../assets/smileGreen.svg";
import IconLeft from "../../assets/iconLeft.svg";
import NoImage from "../../assets/NoImage.jpg";

// 공통 컴포넌트
import {
  Button,
  CardBox,
  Header,
  NavigationBar,
  Container,
  Footer,
  SearchBar,
} from "../../components/index";
import { formatTime, endpoint_favorite } from "../../utils";

// 상수로 뽑아둔 color, fontSize 연결 링크
import colors from "../../constants/colors";
import fontSize from "../../constants/fontSize";

// 백엔드 주소
const BEdata = "http://34.64.69.226:5000/api/";

const Detail = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const hospitalID = searchParams.get("id");
  const token = localStorage.getItem("token")
    ? localStorage.getItem("token")
    : false;
  const navigate = useNavigate();

  const [hospitalData, setHospitalData] = useState({});
  const [hospitalImg, setHospitalImg] = useState([]);
  const [hospitalReviews, setHospitalReviews] = useState([]);
  const [hospitalReviewState, setHospitalReviewState] = useState({});
  const [userReviews, setUserReviews] = useState([]);
  const [likeState, setLikeState] = useState(false);

  // 병원,이미지,리뷰 정보
  useEffect(() => {
    fetch(`${BEdata}hospital/${hospitalID}`, {
      headers: {
        Accept: "application / json",
      },
      method: "GET",
    })
      .then((res) => res.json())
      .then((hospitalID) => {
        setHospitalData(hospitalID.data);
      });

    fetch(`${BEdata}image/hospital/${hospitalID}`)
      .then((res) => res.json())
      .then((hospitalD) => {
        console.log(hospitalD.data);
        setHospitalImg(hospitalD.data);
      });

    fetch(`${BEdata}reviews/${hospitalID}`)
      .then((res) => res.json())
      .then((reviewData) => {
        setHospitalReviews(reviewData.data);
      });

    if (token) {
      fetch(`${BEdata}favorite`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          res.data.forEach((like) => {
            if (like.hospitalId == hospitalID) {
              setLikeState(true);
            }
          });
        });
      fetch(`${BEdata}reviews/user/${hospitalID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
      })
        .then((res) => res.json())
        .then((reviewcheck) => {
          if (reviewcheck.data[0]) {
            setHospitalReviewState(reviewcheck.data[0].vote);
            setUserReviews(reviewcheck.data[0].vote);
          }
        });
    }
  }, []);

  useEffect(() => {
    fetch(`${BEdata}reviews/${hospitalID}`)
      .then((res) => res.json())
      .then((reviewData) => {
        setHospitalReviews(reviewData.data);
      });
  }, [hospitalReviewState]);

  // 병원리뷰
  function reviewClick(label) {
    if (token) {
      const data = { vote: label };
      fetch(`${BEdata}reviews/${hospitalID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((reviewData) => {
          if (reviewData.data.length == 1) {
            fetch(`${BEdata}reviews/user/${hospitalID}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              method: "GET",
            })
              .then((res) => res.json())
              .then((reviewcheck) => {
                setUserReviews(reviewcheck.data[0].vote);
              });
            setHospitalReviewState(reviewData.data[0].vote);
          } else setHospitalReviewState([]);
        })
        .catch((err) => {
          alert("잘못된 유저정보입니다");
        });
    } else {
      alert("로그인이 필요합니다");
    }
  }

  // 공통 컴포넌트 수정활용 *뒤로가기 클릭 이벤트 추가해야함
  const NewHeader = ({ label, onClick }) => {
    return (
      <>
        <HeaderWrap>
          <BtnBack onClick={() => navigate("/search")}>
            <img alt="icon-left" src={IconLeft}></img>
          </BtnBack>
          <HeaderName>
            <h2>{label}</h2>
          </HeaderName>
          <HeaderStar onClick={handleFavoriteClick}>
            {likeState ? (
              <img alt="like" src={yellowStar}></img>
            ) : (
              <img alt="notlike" src={star}></img>
            )}
          </HeaderStar>
        </HeaderWrap>
      </>
    );
  };

  function handleFavorite(data) {
    fetch(`${BEdata}favorite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.data.id) {
          setLikeState(true);
        } else {
          setLikeState(false);
        }
      });
  }

  const handleFavoriteClick = (event) => {
    //즐겨찾기 클릭 시 Link로 넘어가는 것을 막음
    event.preventDefault();
    if (token) {
      try {
        handleFavorite({ hospitalId: hospitalID });
      } catch (error) {
        console.error("Favorite post 요청 실패", error);
        // 필요한 에러 처리 작업 수행
      }
    } else {
      alert("로그인 후 즐겨찾기가 가능합니다");
    }
  };

  const Carousel = ({ data }) => {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    return (
      <Slider {...settings}>
        {data.map((img, index) => (
          <SlideImg key={index}>
            <img src={img.imageUrl} alt={index} />
          </SlideImg>
        ))}
      </Slider>
    );
  };

  return (
    <>
      <Container>
        <HeaderContainer>
          <NewHeader label={hospitalData.dutyName} />
        </HeaderContainer>
        <SlideContainer>
          {hospitalImg.length >= 1 ? (
            <Carousel data={hospitalImg} />
          ) : (
            <FixedImg>
              <img src={NoImage} alt="No Image" />
            </FixedImg>
          )}
          <ArrowRigth>
            <img src={arrowButtonRight} alt="" />
          </ArrowRigth>
          <ArrowLeft>
            <img src={arrowButtonLeft} alt="" />
          </ArrowLeft>
        </SlideContainer>
        <TopContentContainer>
          <NameBox>{hospitalData.dutyName}</NameBox>
          <Button
            width={"73px"}
            height={"39px"}
            bgcolor={colors.primary}
            label={
              <div>
                <img src={locationWhite} alt="" />
                <span>지도</span>
              </div>
            }
            borderOutLine={"#ffffff"}
            btnColor={"white"}
            btnFontSize={"16px"}
            linkTo={`/detail/map?id=${hospitalID}`}
          ></Button>
          <UnderLine />
        </TopContentContainer>
        <QueryMapBtn onClick={() => navigate(`/detail/map?id=${hospitalID}`)}>
          <div>
            <img src={locationWhite} alt="" />
            <span>지도</span>
          </div>
        </QueryMapBtn>
        <BottomContentContainer>
          <HpInfo>
            <img src={locationGreen} alt="" />
            <span>{hospitalData.dutyAddr}</span>
          </HpInfo>
          <HpInfo>
            <img src={phoneGreen} alt="" />
            <span>{hospitalData.dutyTel1}</span>
          </HpInfo>
          <HpInfo>
            <img src={clockGreen} alt="" />
            <HpInfoGrid>
              {hospitalData.dutyTime1c && hospitalData.dutyTime1s && (
                <HpInfoCard>
                  월 {formatTime(hospitalData.dutyTime1s)}-
                  {formatTime(hospitalData.dutyTime1c)}
                </HpInfoCard>
              )}
              {hospitalData.dutyTime2c && hospitalData.dutyTime2s && (
                <HpInfoCard>
                  화 {formatTime(hospitalData.dutyTime2s)}-
                  {formatTime(hospitalData.dutyTime2c)}
                </HpInfoCard>
              )}
              {hospitalData.dutyTime3c && hospitalData.dutyTime3s && (
                <HpInfoCard>
                  수 {formatTime(hospitalData.dutyTime3s)}-
                  {formatTime(hospitalData.dutyTime3c)}
                </HpInfoCard>
              )}
              {hospitalData.dutyTime4c && hospitalData.dutyTime4s && (
                <HpInfoCard>
                  목 {formatTime(hospitalData.dutyTime4s)}-
                  {formatTime(hospitalData.dutyTime4c)}
                </HpInfoCard>
              )}
              {hospitalData.dutyTime5c && hospitalData.dutyTime5s && (
                <HpInfoCard>
                  금 {formatTime(hospitalData.dutyTime5s)}-
                  {formatTime(hospitalData.dutyTime5c)}
                </HpInfoCard>
              )}
              {hospitalData.dutyTime6c && hospitalData.dutyTime6s && (
                <HpInfoCard>
                  토 {formatTime(hospitalData.dutyTime6s)}-
                  {formatTime(hospitalData.dutyTime6c)}
                </HpInfoCard>
              )}
              {hospitalData.dutyTime7c && hospitalData.dutyTime7s && (
                <HpInfoCard>
                  일 {formatTime(hospitalData.dutyTime7s)}-
                  {formatTime(hospitalData.dutyTime7c)}
                </HpInfoCard>
              )}
            </HpInfoGrid>
          </HpInfo>
          <HpInfo>
            <img src={tagGreen} alt="" />
            {hospitalData.dutyEtc ? (
              <HpInfoCard>{hospitalData.dutyEtc}</HpInfoCard>
            ) : (
              <HpInfoCard>태그가 없습니다</HpInfoCard>
            )}
          </HpInfo>
          <HpInfo>
            <img src={smileGreen} alt="" />
            <h1>이런 점이 좋았어요</h1>
          </HpInfo>
          <ReviewContainer>
            <ReviewButton
              onClick={() => reviewClick("kindDoctor")}
              clicked={hospitalReviewState}
              label={"kindDoctor"}
            >
              친절한 의사 선생님
              {hospitalReviews && (
                <span>{JSON.stringify(hospitalReviews[0])}</span>
              )}
            </ReviewButton>
            <ReviewButton
              onClick={() => reviewClick("professional")}
              clicked={hospitalReviewState}
              label={"professional"}
            >
              전문적인 치료
              {hospitalReviews && (
                <span>{JSON.stringify(hospitalReviews[1])}</span>
              )}
            </ReviewButton>
            <ReviewButton
              onClick={() => reviewClick("kindEmployee")}
              clicked={hospitalReviewState}
              label={"kindEmployee"}
            >
              상냥한 간호사·직원
              {hospitalReviews && (
                <span>{JSON.stringify(hospitalReviews[2])}</span>
              )}
            </ReviewButton>
            <ReviewButton
              onClick={() => reviewClick("goodReceipt")}
              clicked={hospitalReviewState}
              label={"goodReceipt"}
            >
              편리한 접수·예약
              {hospitalReviews && (
                <span>{JSON.stringify(hospitalReviews[3])}</span>
              )}
            </ReviewButton>
            <ReviewButton
              onClick={() => reviewClick("cleanHospital")}
              clicked={hospitalReviewState}
              label={"cleanHospital"}
            >
              깨끗한 시설
              {hospitalReviews && (
                <span>{JSON.stringify(hospitalReviews[4])}</span>
              )}
            </ReviewButton>
            <ReviewButton
              onClick={() => reviewClick("goodTraffic")}
              clicked={hospitalReviewState}
              label={"goodTraffic"}
            >
              편한 교통·주차
              {hospitalReviews && (
                <span>{JSON.stringify(hospitalReviews[5])}</span>
              )}
            </ReviewButton>
          </ReviewContainer>
          <ReserveContainer>
            <Button
              width={"237px"}
              height={"69px"}
              bgcolor={colors.primary}
              label={"예약하기"}
              borderOutLine={"#ffffff"}
              btnColor={"white"}
              btnFontSize={"30px"}
              linkTo={`/detail/reserve?id=${hospitalID}`}
            />
          </ReserveContainer>
        </BottomContentContainer>
        <NavigationBar></NavigationBar>
      </Container>
    </>
  );
};

//스타일 - 헤더
const HeaderContainer = styled.div`
  width: 100%;
  height: 74px;
  align-items: center;
  display: flex;
  border-bottom: 1px solid #b2b2b2;
`;

const HeaderStar = styled.div`
  cursor: pointer;
  display: flex;
  text-align: center;
  float: right;
  width: 29px;
  height: 28px;
  margin-right: 10px;
  @media screen and (max-width: 600px) {
    width: 21px;
    height: 21px;
  }
`;
const HeaderWrap = styled.div`
  width: 100%;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: space-between;
  & h2 {
    font-size: 20px;
    color: #00ad5c;
    font-weight: 600;
    @media screen and (max-width: 600px) {
      font-size: 17px;
    }
  }
`;

const HeaderName = styled.div`
  width: 80%;
`;

const BtnBack = styled.button`
  background: none;
  border: none;
  float: left;
  cursor: pointer;
`;

//스타일 - 메인컨텐츠
const SlideContainer = styled.div`
  margin-top: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
  .slick-slider {
    width: 100%;
  }
`;

const SlideImg = styled.div`
  width: 90%;
  img {
    width: 90%;
    height: 350px;
    border-radius: 20px;
    object-fit: cover;
    display: inherit;
    margin-bottom: 15px;
  }
`;

const FixedImg = styled.div`
  width: 90%;
  img {
    width: 100%;
    height: 350px;
    border-radius: 20px;
    object-fit: cover;
  }
`;

const ArrowRigth = styled.div`
  display: none;
  position: absolute;
  right: 72px;
  transform: rotate(180deg);
  cursor: pointer;
  img {
    width: 50px;
    height: 50px;
  }
`;

const ArrowLeft = styled.div`
  display: none;
  position: absolute;
  left: 72px;
  cursor: pointer;
  img {
    width: 50px;
    height: 50px;
  }
`;

const TopContentContainer = styled.div`
  position: relative;
  margin-top: 13px;
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 30px;
  @media screen and (max-width: 600px) {
    font-size: 20px;
  }
  a {
    position: absolute;
    right: 41px;
    @media screen and (max-width: 800px) {
      display: none;
    }
  }
  button {
    border: 1px solid #00a758;
    border-radius: 7px;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    &:hover {
      opacity: 70%;
    }
  }
  button div span {
    margin-left: 5px;
  }
`;

const NameBox = styled.div`
  width: 65%;
`;

const UnderLine = styled.div`
  position: absolute;
  bottom: 0px;
  width: 100px;
  border-bottom: 2px solid ${colors.primary};
`;

const QueryMapBtn = styled.button`
  cursor: pointer;
  display: none;
  margin-top: 20px;
  width: 90%;
  height: 39px;
  background-color: ${colors.primary};
  color: white;
  font-size: 16px;
  border: 1px solid #00a758;
  border-radius: 7px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  @media screen and (max-width: 800px) {
    display: inline-block;
  }
  &:hover {
    opacity: 70%;
  }
`;

const BottomContentContainer = styled.div`
  flex-direction: column;
  text-align: left;
  padding-left: 71px;
  padding-right: 71px;
  margin-bottom: 130px;
  @media screen and (max-width: 600px) {
    padding-left: 30px;
    padding-right: 30px;
  }
`;

const HpInfo = styled.div`
  margin-top: 42px;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 18px;
  span {
    margin-left: 22px;
  }
  h1 {
    margin-left: 22px;
    color: ${colors.primary};
  }
  @media screen and (max-width: 500px) {
    font-size: 15px;
  }
`;

const HpInfoCard = styled.span`
  font-weight: 400;
  font-size: 16px;
  padding: 7px 15px 7px 15px;
  border: solid 1px #bebebe;
  border-radius: 17.5px;
  @media screen and (max-width: 640px) {
    font-size: 13px;
  }
`;

const HpInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 10px;
  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 10px;
  }
  @media screen and (max-width: 450px) {
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
  }
`;

const ReviewContainer = styled.div`
  padding: 0 45px 0 45px;
  margin-top: 19px;
  width: 100%;
  height: 100px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 15px;
  @media screen and (max-width: 700px) {
    grid-template-columns: 1fr 1fr;
    padding: 0;
  }
`;

const ReviewButton = styled.button`
  cursor: pointer;
  background: ${({ clicked, label }) => {
    if (clicked == label) {
      return colors.primary;
    } else {
      return "#f4f4f4";
    }
  }};
  color: ${({ clicked, label }) => {
    if (clicked == label) {
      return "white";
    } else {
      return "#333333";
    }
  }};
  border: 1px solid #00ad5c;
  border-radius: 11px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  align-items: center;
  justify-content: space-around;
  font-weight: 600;
  font-size: 14px;
  position: relative;
  text-align: start;
  span {
    color: ${({ clicked, label }) => {
      if (clicked == label) {
        return "white";
      } else {
        return "#333333";
      }
    }};
    position: absolute;
    right: 10px;
  }
  @media screen and (max-width: 700px) {
    padding: 7px;
    font-size: 12px;
  }
  &:hover {
    opacity: 50%;
  }
`;

const ReserveContainer = styled.div`
  margin: 60px 0 41px 0;
  display: flex;
  width: 100%;
  justify-content: center;
  button {
    border: 1px solid #00a758;
    border-radius: 11px;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    &:hover {
      opacity: 70%;
    }
  }
`;

export default Detail;

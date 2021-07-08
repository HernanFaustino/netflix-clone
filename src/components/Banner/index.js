import React, { useEffect, useState } from 'react';

import axios from '../../utils/axios';
import requests from '../../utils/Requests';

import './styles.css';

function Banner() {
  const [movie, setMovie] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const request = await axios.get(requests.fetchNetflixOriginals);
      const initialIndex = Math.floor(
        Math.random() * request.data.results.length - 1
      );
      const movieWithDataIndex = request.data.results.findIndex(
        (movie, index) => {
          return movie.backdrop_path && index >= initialIndex;
        }
      );
      setMovie(
        request.data.results[
          movieWithDataIndex !== -1 ? movieWithDataIndex : initialIndex
        ]
      );

      return request;
    };

    fetchData();
  }, []);

  const truncate = (string, n) => {
    return string?.length > n ? string.substr(0, n - 1) + '...' : string;
  };

  return (
    <header
      className="banner"
      style={{
        backgroundSize: 'cover',
        backgroundImage: `url('https://image.tmdb.org/t/p/original/${movie?.backdrop_path}')`,
        backgroundPosition: 'center center',
      }}
    >
      <div className="banner__contents">
        <h1 className="banner_title">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>
        <div className="banner_buttons">
          <button className="banner__button">Play</button>
          <button className="banner__button">My List</button>
        </div>
        <h1 className="banner__description">
          {truncate(movie?.overview, 150)}
        </h1>
      </div>
      <div className="banner__fadeBottom"></div>
    </header>
  );
}

export default Banner;

import React, { useEffect, useState } from 'react';
import './Banner.css';

import axios from './axios'
import requests from './Requests';

function Banner() {

  const [movie, setMovie] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      const request = await axios.get(requests.fetchNetflixOriginals);
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length - 1)
        ]
      );

      return request;
    }

    fetchData();
  }, []);

  const truncate = (string, n) => {
    return string?.length > n ? string.substr(0, n - 1) + '...' : string;
  }
  console.log(movie);

  return (
    <header className="banner" style={{
      backgroundSize: 'cover',
      backgroundImage: `url('https://image.tmdb.org/t/p/original/${movie?.backdrop_path}')`,
      backgroundPosition: 'center center'
    }}>
      <div className="banner__contents">
        <h1 className="banner_title">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>
        <div className="banner_buttons">
          <button className="banner__button">Play</button>
          <button className="banner__button">My List</button>
        </div>
        <h1 className="banner__description">
          {truncate(`This is a test description This is a test description This is a test descriptionThis is a test description
        This is a test descriptionThis is a test description This is a test descriptionThis is a test descriptionThis is a test descriptionThis
        This is a test description This is a test descriptionThis is a test descriptionThisThis is a test description
        This is a test description This is a test description`, 150)}
        </h1>
      </div>
      <div className="banner__fadeBottom">

      </div>
    </header>
  )
}

export default Banner

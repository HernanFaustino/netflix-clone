import React, { useEffect, useState } from 'react';

import axios from '../../utils/axios';

import './styles.css';

function Row({ title, fetchUrl, isLargeRow = false }) {
  const [movies, setMovies] = useState([]);

  const baseURL = 'https://image.tmdb.org/t/p/original/';

  useEffect(() => {
    const fetchData = async () => {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);

      return request;
    };

    fetchData();
  }, [fetchUrl]);

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row__posters">
        {movies.map(
          (movie) =>
            ((isLargeRow && !!movie.poster_path) ||
              (!isLargeRow && !!movie.backdrop_path)) && (
              <img
                className={`row__poster ${isLargeRow && 'row__posterLarge'}`}
                key={movie.id}
                src={`${baseURL}${
                  isLargeRow ? movie.poster_path : movie.backdrop_path
                }`}
                alt=""
              />
            )
        )}
      </div>
    </div>
  );
}

export default Row;

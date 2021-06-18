# useAsync

The `useAsync` hook makes consuming async function in React components easier. Inspired by the Apollo `useQuery`/`useMutation` hooks, `useAsync` aims to provide a similar API for general-purpose async functions.

# Dependencies

- Compatible with React >= 16.8.0.
- Written in ES5 CJS.

# Install

```
npm i --save @jamsesso/use-async
```

# Usage

```js
import { useEffect, useCallback } from 'react';
import useAsync from '@jamsesso/use-async';

function getMoviesFromApi() {
  return fetch(/* your async code example */).then(res => res.json());
}

function MovieList() {
  const [getMovieList, { loading, error, result }] = useAsync(getMoviesFromApi);

  useEffect(() => {
    getMovieList();
  }, []);

  const refreshList = useCallback(() => getMovieList(), []);

  return (
    <div class="movie-list">
      <h1>Movies</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Oh no! Unable to load the movies 😭</p>}
      {result && (
        <ul>
          {result.map(movie => (
            <li key={movie.id}>{movie.title}</li>
          ))}
        </ul>
      )}
      <button onClick={refreshList}>Refresh movie list</button>
    </div>
  );
}
```

A few key things are outlined in this example:

- `useEffect` does not need an IIFE to call the function because the component re-renders as the promise is executed.
- `getMoviesFromApi` is the original async function.
- You can invoke `getMovieList` any number of times - state will cycle between `loading`, `error`, and `result` properly. Here it is used for the initial load and also to refresh the list on a button click event.
import { useState, useEffect } from 'react';

const BlockBuster = () => {
  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState({});

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    fetch('http://localhost:3000/movies')
      .then(response => response.json())
      .then(data => setMovies(data))
      .catch(error => console.error('Error fetching movies:', error));
  };

  const addMovie = (event) => {
    event.preventDefault();
    const newMovie = {
      title: event.target.title.value,
      creator: event.target.creator.value,
      studio: event.target.studio.value,
    };
    fetch('http://localhost:3000/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMovie)
    })
    .then(response => response.json())
    .then(data => {
      setMovies([...movies, data]);
      event.target.reset();
    })
    .catch(error => console.error('Error adding movie:', error));
  };

  const deleteMovie = (id) => {
    fetch(`http://localhost:3000/movies/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        setMovies(movies.filter(movie => movie._id !== id));
      }
    })
    .catch(error => console.error('Error deleting movie:', error));
  };

  const openUpdateModal = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    fetch(`http://localhost:3000/movies/${selectedMovie._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedMovie)
    })
    .then(response => response.json())
    .then(data => {
      setMovies(movies.map(movie => (movie._id === selectedMovie._id ? data : movie)));
      setShowModal(false);
    })
    .catch(error => console.error('Error updating movie:', error));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSelectedMovie({ ...selectedMovie, [name]: value });
  };

  return (
    <div className='container'>
      <form onSubmit={addMovie} className='my-3'>
        <div className='form-group'>
          <input type='text' name='title' className='form-control' placeholder='Title' required />
        </div>
        <div className='form-group'>
          <input type='text' name='creator' className='form-control' placeholder='Creator' required />
        </div>
        <div className='form-group'>
          <input type='text' name='studio' className='form-control' placeholder='Studio' required />
        </div>
        <button type='submit' className='btn btn-primary'>Add</button>
      </form>

      <div className='row'>
        {movies.map(movie => (
          <div key={movie._id} className='col-lg-4'>
            <div className='card mb-3'>
              <div className='card-body'>
                <h5 className='card-title'>{movie.title}</h5>
                <p className='card-text'>{movie.creator}</p>
                <p className='card-text'>{movie.studio}</p>
                <button type='button' className='btn btn-danger' onClick={() => deleteMovie(movie._id)}>Delete</button>
                <button type='button' className='btn btn-secondary ml-2' onClick={() => openUpdateModal(movie)}>Update</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <form onSubmit={handleUpdate}>
              <div className='form-group'>
                <label></label>
                <input
                  type='text'
                  name='title'
                  className='form-control'
                  value={selectedMovie.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='form-group'>
                <label></label>
                <input
                  type='text'
                  name='creator'
                  className='form-control'
                  value={selectedMovie.creator}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='form-group'>
                <label></label>
                <input
                  type='text'
                  name='studio'
                  className='form-control'
                  value={selectedMovie.studio}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type='submit' className='btn btn-primary'>Save changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockBuster;

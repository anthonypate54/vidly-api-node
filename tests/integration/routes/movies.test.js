const request = require('supertest');
const {Movie} = require('../../../models/movie');
const {User} = require('../../../models/user');
const {Genre} = require('../../../models/genre');
const mongoose = require('mongoose');

let server;
  
describe('/api/movies', () => {
  beforeEach(() => { server = require('../../../index'); })
  afterEach(async () => { 
    server.close(); 
    await Genre.remove({});
    await Movie.remove({});
   });

  describe('GET /', () => {
    it('should return all movies', async () => {
        let genre = new Genre({ name: 'genre1' });
        genre = await genre.save(); 

        let res = await request(server).get('/api/genres');
        expect(res.status).toBe(200);
        const genres = [
            { name: 'genre1' },
            { name: 'genre2' },
          ];
    
        let movies = [
            {
            title: 'movie1',
            genre: genre,
            numberInStock: 5,
            dailyRentalRate: 10 
            },
            {
            title: 'movie2',
            genre: genre,
            numberInStock: 5,
            dailyRentalRate: 10 
            }
        ];
        await Movie.collection.insertMany(movies);
        res = await request(server).get('/api/movies'); 

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
        
        movies = await Movie.find();
        res = await request(server).get('/api/movies');

        expect(res.status).toBe(200); 
        expect(res.body.some( m => m.title === 'movie1')).toBeTruthy(); 
    });
  });
  describe('GET /:id', () => {
    it('should return a movie if valid id is passed', async () => {
        // first create genre
        let genre = new Genre({ name: 'genre1' });
        genre = await genre.save(); 
        let res = await request(server).get('/api/genres');
        expect(res.status).toBe(200);
        
        const aMovie = {
            title: 'movie1',
            genre: genre,
            numberInStock: 5,
            dailyRentalRate: 10 
        };
        // insert the movie with required genre
        const movie = new Movie(aMovie);
        await movie.save();
    
        res = await request(server).get('/api/movies/' + movie._id);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('title', movie.title);     
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/movies/1');

      expect(res.status).toBe(404);
    });

    it('should return 404 if no movie with the given id exists', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get('/api/movies/' + id);

      expect(res.status).toBe(404);
    });
  }); 
 /*
  describe('POST /', () => {

    // Define the happy path, and then in each test, we change 
    // one parameter that clearly aligns with the name of the 
    // test. 
    let token;     
    let genre;
    let aMovie;    
    let movieObj;
    let m_title;
    let m_numberInStock;
    let m_dailyRentalRate;
    // create a genre

    const createGenre = async () => {
        genre = new Genre({ name: 'genre1' });
        await genre.save(); 
        let res = await request(server).get('/api/genres');
        expect(res.status).toBe(200);
    }

    aMovie = {
        title: m_title,
        genre: genre,
        numberInStock: m_numberInStock,
        dailyRentalRate: m_dailyRentalRate 
    };

    const exec = async () => {
       return await request(server)
        .post('/api/movies')
 //       .auth('anthonypate@gmail,com', '4everA1p')
        .set('x-auth-token', token)
        .send(aMovie);
    }
     beforeEach(async () => {
        token = new User().generateAuthToken();
     })
     afterEach(async () => { 
        await Genre.remove({});
        await Movie.remove({});
    });

    it('should return 401 if client is not logged in', async () => {
        token = ''; 
        m_title = 'Movie1';
        m_numberInStock = 5;
        m_dailyRentalRate = 10;

        const genreRes = await createGenre();
        const res = await exec();
        console.log(res.message);
        expect(res.status).toBe(401);
    });
  });
    
    it('should return 400 if genre is less than 5 characters', async () => {
      name = '1234'; 
      
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if genre is more than 50 characters', async () => {
      name = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should save the genre if it is valid', async () => {
      await exec();

      const genre = await Genre.find({ name: 'genre1' });

      expect(genre).not.toBeNull();
    });

    it('should return the genre if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genre1');
    });

  });
*/
}); 


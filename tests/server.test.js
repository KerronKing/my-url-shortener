const expect = require('expect');
const request = require('supertest');
const { app } = require('../server');
const { Url } = require('../models/url');

describe('POST /urls', () => {
  it('should create a new url object with an app generated shortcode', done => {
    const originalUrl = 'https://learn.freecodecamp.org/';

    request(app)
      .post('/urls')
      .send({ originalUrl })
      .expect(200)
      .expect(res => {
        expect(res.body.originalUrl).toBe(originalUrl)
        expect(res.body.shortenedUrl).toExist()
      })
      
    done();
  });

  it('should return a 400 status code if the email is invalid', done => {
    const originalUrl = 'test';

    request(app)
      .post('/urls')
      .send({ originalUrl })
      .expect(400)
      
    done();
  })
});

describe('POST /urls/custom', () => {
  it('should create a new url object with a custom shortcode', done => {
    const originalUrl = 'https://learn.freecodecamp.org/';
    const shortenedUrl = 'codecamp';

    request(app)
      .post('/urls/custom')
      .send({ originalUrl, shortenedUrl })
      .expect(200)
      .expect(res => {
        expect(res.body.originalUrl).toBe(originalUrl)
        expect(res.body.shortenedUrl).toExist()
      })
    
    done();
  })

  it('should return an error if the shortcode is less than 4 characters', done => {
    const originalUrl = 'https://learn.freecodecamp.org/';
    const shortenedUrl = 'tst';

    request(app)
      .post('/urls')
      .send({ originalUrl, shortenedUrl })
      .expect(400)

    done();
  })
})

describe('GET /urls/:shortcode', () => {
  it('should redirect to the relevant url', done => {
    const originalUrl = 'https://learn.freecodecamp.org/';
    const shortenedUrl = 'codecamp';

    request(app)
      .post('/urls/custom')
      .send({ originalUrl, shortenedUrl })
      .get('/urls/codecamp')
      expect(200)
    
    done();
  })

  it('should return a 400 status code if no such shortcode exists in the db', done => {
    const originalUrl = 'https://learn.freecodecamp.org/';
    const shortenedUrl = 'codecamp';

    request(app)
      .post('/urls/custom')
      .send({ originalUrl, shortenedUrl })
      .get('/urls/test')
      expect(400)
    
    done();
  })
})

describe('GET /urls/:shortcode/stats', () => {
  it('should return the lastAccessed and click count data associated with the url', done => {
    const originalUrl = 'https://learn.freecodecamp.org/';
    const shortenedUrl = 'codecamp';

    request(app)
      .post('/urls/custom')
      .send({ originalUrl, shortenedUrl })
      .get('/urls/codecamp/stats')
      expect(res => {
        expect(res.body.lastAccessed).toExist()
        expect(res.body.urlClickCount).toExist()
      })
    
    done();
  })
})
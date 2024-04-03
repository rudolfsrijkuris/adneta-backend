import request from 'supertest';
import app from '../routes/ImageUpload/imageUpload.js'; // Import your Express.js application (assuming the 'imageUpload' is the file with your Express app)
import expect from 'chai';

describe('Image Upload Route', () => {
  it('should upload an image and return a 200 status code', (done) => {
    request(app)
      .post('/imageUpload')
      .field('project_Name', 'Test Project')
      .field('country', 'Test Country')
      .field('category', 'Test Category')
      .field('aboutProject', 'Test Description')
      .attach('profileImage', '../assets/images/cafio.png') // Replace with the path to your test image
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('should return a 400 status code when missing required fields', (done) => {
    request(app)
      .post('/imageUpload')
      .field('category', 'Test Category')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  // Add more test cases as needed
});

import express from 'express';
import { OpenAIApi, Configuration } from 'openai';
import supertest from 'supertest';
import app from '../routes/AdIdeaGenerator/adIdeaGenerator.js'; // Import your Express.js application (assuming the 'adIdeaGenerator' is the file with your Express app)
import nock from 'nock';
import chai from 'chai';

// Import your router

const request = supertest(app);

describe('OpenAI API Integration Test', () => {
  before(() => {
    // Mock the OpenAI API request
    const openaiUrl = 'https://api.openai.com';
    nock(openaiUrl)
      .post('/v1/engines/gpt-3.5-turbo/completions')
      .reply(200, {
        id: 'chatcmpl-6p9XYPYSTTRi0xEviKjjilqrWU2Ve',
        object: 'chat.completion',
        created: 1677649420,
        model: 'gpt-3.5-turbo',
        usage: { prompt_tokens: 56, completion_tokens: 31, total_tokens: 87 },
        choices: [
          {
            message: {
              role: 'assistant',
              content: 'Sure! Here is an ad idea: [Your generated ad].',
            },
          },
        ],
      });
  });

  it('should generate an ad idea', (done) => {
    request
      .post('/ad-idea-generator')
      .send({ content: 'Your content here' }) // Provide test data
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        // Perform assertions on the response
        // For example, you can check if the response contains the generated ad idea
        const response = JSON.parse(res.text);
        chai.expect(response.data).to.include('Sure! Here is an ad idea:');
        done();
      });
  });

  after(() => {
    nock.cleanAll(); // Clean up mocked requests
  });
});

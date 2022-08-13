## Technical Requirements

1. [Node.js](https://nodejs.org/en/)
2. [TypeScript](https://www.typescriptlang.org/)
3. [Jest](https://jestjs.io/)
4. [JWT](https://jwt.io/)
5. [WebRTC](https://webrtc.org/)
6. [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
7. [Sequelize TypeScript](https://www.npmjs.com/package/sequelize-typescript)
8. [PostgreSQL](https://www.postgresql.org/)
9. (Optional) [CircleCI](https://circleci.com/)


## Project Overview

This application is a chatting application. Instead of using actual users, your application will load data
from JSONPlaceholder (/users) and fetch a random user (with a chance of error) upon the user connecting, creating a new JWT
with the relevant user information. Every 10 seconds, the application will send a random message to the chat, the contents
of which are also grabbed from JSONPlaceholder (/posts). Once a message is generated, both the user and the message need to exist
on the database as logs.


## Application Behavior

You are required to create a chat messaging application. The chat behaves as follows:
1. A user connects to the chat.
2. A random user (0..N) is fetched from JSONPlaceholder from list of users of N size, this means there's a chance 
of error (could fetch user #10 from a list of 10 users at zero indexing, which doesn't exist).
    1. This is meant to emulate bad data, and showcase error handling when connecting to external APIs.
3. A new JWT is created with the user information.
4. The client is then sent the JWT.
5. Every 0 to 10 seconds (randomly), a random post from JSONPlaceholder is grabbed for each user in the chat and posted.
6. Your WebRTC Client should receive the name of the user and the post.
7. Users should also be able to manually post a message.

## Requirements

1. Fork this repository.
2. Setup a WebRTC server and a WebRTC client.
3. Create tests via jest by leveraging the WebRTC client.
4. Ensure your connection to the database is fine.
5. Integrate JSONPlaceholder API to load users and posts as described above.
6. Integrate WebRTC to send messages to the chat.
7. Integrate Sequelize to create a database of users and posts.
8. Integrate JWT to create a JWT for each user, verify the JWT and get the user information.
9. Ensure your application fits your test requirements.
10. Ensure your JWT validates the authenticity of the token itself (that it's been issued by your host, and hasn't been tampered).
11. Create a PR with your project once you're done - you must show that your tests are successful.
12. (Optional) You may use CircleCI/GitHub CI if you'd like to automatically test your application. 
CircleCI is easier/quicker to integrate.

The quality of your tests and their successes are the only thing that matters throughout this project. Your tests should
not only test for sanity, but also for performance. Both literal coverage (amount of code covered) and logical coverage
(important logical aspects such as performance) are important. The tests should be as thorough as possible, as the
quality of the code depends on it.
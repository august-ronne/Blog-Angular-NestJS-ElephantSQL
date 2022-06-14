### Basic Blog Built with Angular, NestJS, and ProstgreSQL aaS (ElephantSQL)
<br />
A basic blog consisting of an Angular frontend, a NestJS backend integrated with an ElephantSQL database, and a small set of Cypress e2e tests. Authentication and authorization is handled using JWT.<br /><br />
Read up on ElephantSQL here:<br />
:link: https://www.elephantsql.com/docs/index.html <br /><br />
Read up on JWT here:<br />
:link: https://jwt.io/introduction <br />

### Example Images of Running App
__Frontpage showing blog entries__
| <img src="https://github.com/august-ronne/Blog-Angular-NestJS-ElephantSQL/blob/develop/blog-frontpage.png?raw=true" /> |
| ------ |
Same view for both unauthenticated and authenticated users. Blog entries are paginated with a selection of page sizes. Blog entry images are those uploaded by the author when posting entry

__Register Page__
| <img src="https://github.com/august-ronne/Blog-Angular-NestJS-ElephantSQL/blob/develop/blog-register.png?raw=true" /> |
| ------ |
Not yet fully completed. TODOs include not being visitable by logged in users, among others.

__Page for posting new blog entry__
| <img src="https://github.com/august-ronne/Blog-Angular-NestJS-ElephantSQL/blob/develop/blog-post-entry.png?raw=true" /> |
| ------ |
Only available to authenticated users. Header image upload creates a new directory in the local project in order to work. Blog entries are written in .md and a preview is available to the user.

__Page for updating your user profile__
| <img src="https://github.com/august-ronne/Blog-Angular-NestJS-ElephantSQL/blob/develop/blog-update-profile.png?raw=true" /> |
| ------ |
The image at the top of the page is the user's current profile image. As with the blog entries, the profile image upload creates a new directory in the local project the first time it is used. TODOs include implementing changing of email and password (as visible in the image)

### Instructions for Running Project
Clone to directory, then
1. In the /api directory, create a .env file. Add the ElephantSQL database URL and JWT Secret to the file.<br />
  The file should look like this:<br /><br />
  _.env example_:
  ```
  DATABASE_URL=<your elephant sql url>
  JWT_SECRET=<your JWT secret string>
  ```
  
2. Start the NestJS backend in development mode by running the following commands in your terminal (opened in the project root):<br />
  `cd api/`<br />
  `npm install`<br />
  `npm run start:dev`<br />
  
3. Start the Angular frontend in development mode by running the following commands in your terminal (opened in the project root):<br />
  `cd frontend/`<br />
  `npm install`<br />
  `ng serve`<br />
  
4. Start the e2e tests by running the following commands in your terminal (opened in the project root):<br />
  `cd e2e/`<br />
  `npm install`<br />
  `npm run cypress:open`<br />

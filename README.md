<a name="readme-top"></a>

<br />
<div align="center">
  <a href="https://github.com/rubenodegard">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Developer Console</h3>

<p align="center">
        A self-hostable console to manage a collection development tools and miscellaneous urls.
    <br />
    <a href="https://github.com/rubenodegard/developer-console"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="demo.developer-console.udev.no">View Demo</a>
    ·
    <a href="https://github.com/rubenodegard/developer-console/issues">Report Bug</a>
    ·
    <a href="https://github.com/rubenodegard/developer-console/issues">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

<!-- Content -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [Next.js (Framework)](https://nextjs.org/)
- [Tailwind (CSS)](https://tailwindcss.com/)
- [Turso (DB)](link_to_turso)
- [Kinde (Auth)](link_to_kinde)
- [Drizzle (ORM)](link_to_drizzle)
- [Zod (Validation)](link_to_zod)
- [Zustand (State Management)](link_to_zustand)
- [Node HTML Parser](https://www.npmjs.com/package/node-html-parser)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

This is an example of how you may give instructions on setting up your project
locally. To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to
install them.

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

When running in a local development environment, a persistent sqlite database is
initiated inside the .src/ folder. When running a production environment a
external Turso link is required.

By default, registration for new users is disabled and a new users has to be
created manually your dashboard at Kinde.

1. Clone the repo
   ```sh
   git clone https://github.com/rubenodegard/developer-dashboard.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Rename `example.env.local` to `.env.local`
4. Populate `.env.local` with the correct variables.

   ```
   # From Turso Dashboard
   TURSO_DATABASE_URL=
   TURSO_AUTH_TOKEN=

   # From Kinde Dashboard
   KINDE_CLIENT_ID=
   KINDE_CLIENT_SECRET=
   KINDE_ISSUER_URL=
   KINDE_SITE_URL=
   KINDE_POST_LOGOUT_REDIRECT_URL=
   KINDE_POST_LOGIN_REDIRECT_URL=
   ```

5. Run the application

   Local:

   ```sh
   npm run dev
   ```

   Production:

   ```sh
   npm run build
   npm run start
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

Use this space to show useful examples of how a project can be used. Additional
screenshots, code examples and demos work well in this space. You may also link
to more resources.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

**App**
- [x] **Basic UI Structure**
- [ ] **CI/CD:** Linting and Formatting with Github Actions _(can also be ran locally in dev)_
- [x] **Authentication w/Kinde** (Registration disabled by default for self hosting)
- [x] **Setup Database Schema** (Local and Production)
- [x] **Local Database** (persistent local database is created and automaticly started in developer environment)
- [x] **Production Database** (Turso)
- [x] **API Route:** Fetch Metadata by URL
- [x] **Server Actions** (CRUD actions against database)
- [x] **Protect API routes and Server Actions with Authorization**
- [x] **Timeouts for database and API calls**
- [ ] **Ratelimiting for database and API calls**
- [ ] **Custom Login Page** 
- [ ] **Custom 404 Page**
- [x] **Animations** 
- [x] **Confirmation dialogs on critical actions**

**Collections**
- [x] **Predefined collections;** "All" and "Favorites"
- [x] **Add a URL to a collection** (existing or new category)
- [x] **Add a URL to Favorites** (predefined collection)
- [x] **Delete a URL from a collection**
- [x] **Preview metadata from a specified url**
- [x] **Fetch metadata from a specified url**
- [x] **Collapsed/Extended view option in Collections tab**

**Projects**
- [x] **Add a Project:** Name _(required)_, Github _(optional)_ and Live Demo _(optional)_
- [x] **Edit a Project's Options** (Name, Github, Live Demo)
- [x] **Add a URL from a Collection to a Project**
- [x] **Delete a URL from a Project**
- [x] **Delete a Project**

**Miscellaneous maybes**
- [ ] **? Add Notes to a Collection Item ?**
- [ ] **? Add Notes to a Project ?**
- [ ] **Fetch and display the README.md from a optional Github Repo on a Project** (automatically)

See the
[open issues](https://github.com/othneildrew/Best-README-Template/issues) for a
full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to
learn, inspire, and create. Any contributions you make are **greatly
appreciated**.

If you have a suggestion that would make this better, please fork the repo and
create a pull request. You can also simply open an issue with the tag
"enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/42069`)
3. Commit your Changes (`git commit -m 'Add some 42069'`)
4. Push to the Branch (`git push origin feature/42069`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Ruben Odegard (Ruben Ødegård) - [Homepage](https://rubenodegard.com) -
contact@rubenodegard.com

Project Link:
[https://github.com/rubenodegard/developer-console](https://github.com/RubenOdegard/developer-dashboard)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

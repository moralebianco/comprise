# Comprise

Backend for inventory management system, designed for small and medium-sized stores. Built using Node.js, SQLite and Express 5.

## Installation

1. Clone the repository with Git

   ```bash
   git clone https://github.com/moralebianco/comprise.git
   cd comprise
   ```

   > Check the [`ProcessEnv`](./src/types.d.ts) interface before setting the `.env` file!

2. Build and run the Docker container

   ```bash
   docker build -t comprise .
   docker run -p 3000:3000 comprise
   ```

## Usage

## Documentation

For detailed documentation, please refer to the `docs/` directory:

- [Introduction](./docs/introduction.md)
- [Architecture](./docs/architecture.md)

## License

[MIT](./LICENSE)

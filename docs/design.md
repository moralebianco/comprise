# Design

## Architecture

It uses a simple version of the [hexagonal architecture](<https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)>).
Each module in `src/modules` contains three layers (or _slices_) in the order detailed below.

### Domain

This is the smallest layer.
Since objects are used primarily to share data, there are no typical classes.
Entity classes would be over-engineering; they would involve mapping, for example.
However, a static template is very important for type safety.
So the entities of each module are defined with _JSDoc_.
Those types are infered from objects previously defined.

### Application

Also known as the service layer.
All services are functions of the class with the name of the module (in Pascal case.)
Services are mostly the _CRUD_ operations for domain entities.
Hence, service classes can also viewed as [repositories](https://martinfowler.com/eaaCatalog/repository.html).

A connection to the database must be injected.
That flexibility is useful for unit testing, for example.
In general, all services share a single connection exported in `src/database.js`.

### Infrastructure

Each module exports an Express router as _default_.
The function `isTypeOf` is used to validate inputs (such as request bodys.)
Check [this]() for a better comprehension about validations.

All routers are joined to the Express app in the `src/index.js` module.
This fact matters since their dynamic process is not common.
All middleware are used in this module; for instance, the [morgan](https://expressjs.com/en/resources/middleware/morgan.html) logger.

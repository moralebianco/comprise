## Architecture

Modules in `src/modules` are designed to maximize internal cohesion (grouping related functionalities around a single domain) and to minimize external coupling (reducing dependencies between modules.)
They also follow a three-layer structure, as detailed below.

### Domain Layer

Primarily responsible for defining data types.
Since objects are mainly used for data sharing, there are no traditional entity classes to avoid unnecessary complexity, such as object-relational mapping.
Instead, entities are defined using _JSDoc_.
The types are inferred from predefined objects and offer type safety.

### Application Layer

Also known as the **service layer**, this contains business logic.
Each module has a service class where all service functions reside.
Services primary handle _CRUD operations_ for domain entities. Because of this, service classes can also be viewed as _repositories_ following the repository pattern.

For flexibility, database connection must be injected into services.
This design makes unit testing easier by allowing the use of mock dependencies.

### Infrastructure Layer

Each module exports an Express router as its default export and must do.
The user-defined function `isTypeOf` validates input data.
All endpoints of each router have only access to an instance of the service class and all services share a single database connection.
The lack of a connection pool could be a trouble but SQLite has proven sufficient performance.

Finally, all routers are combined to the Express app in `src/index.js` module and the middlewares are applied.
This fact matters since their asynchronous process is not common.

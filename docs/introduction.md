## Introduction

Many small shops lack an inventory management system, making it difficult to track their products efficiently.
**Comprise** was created to address this need by providing an open-source backend as a foundation for a complete solution.
Its primary goal is to simplify backend development, allowing other developers to extend and build upon it, ultimately leading to an inventory management and POS system for stores.

### Stack

Most full-stack and frontend developers already know **JavaScript**, making it easier for them to contribute to and extend the project.
By using **Node.js**, Comprise ensures a smooth learning curve for web developers who want to interact with it.

Comprise prioritizes built-in Node.js libraries over third-party _npm_ packages whenever possible.
This keeps the project lightweight, reduces external dependencies, and ensures long-term maintainability.
However, it still benefits from the rich ecosystem when necessary.

- **Express.js** - Used as the backend framework for its simplicity, flexibility, and widespread adoption.
  Its minimalistic design keeps the project lightweight while still providing enough features to handle HTTP endpoints efficiently.

- Built-in **SQLite** – Chosen because it provides all the necessary functionalities keeping the minismalist approach.
  An _ORM_ would require additional knowledge and less control over the database.
  The main downside of this approach is that, for now, this version only supports blocking synchronous operations.

- **Prettier** – Enforced to maintain a consistent code style and improve readability.
  Using a linter was considered, but the type checking offered by _VS Code_ was sufficient and avoids configuration overhead.

### DevOps

**Git** serves as the cornerstone for version control, enabling collaborative development and ensuring code traceability.
**Docker** is employed to containerize the application, providing consistent deployment across various environments and simplifying the setup process on local servers.

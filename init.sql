CREATE TABLE IF NOT EXISTS people(
  id     TEXT PRIMARY KEY,
  names  TEXT NOT NULL,
  phone  TEXT
  -- TODO add columns as needed
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS suppliers(
  id    TEXT PRIMARY KEY,
  name  TEXT NOT NULL,
  phone TEXT,
  email TEXT
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS items(
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  name      TEXT NOT NULL,
  price     REAL DEFAULT 0.0,
  metadata  TEXT,
  quantity  REAL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS permissions(
  admin_id  TEXT NOT NULL,
  role      TEXT CHECK(role IN ('ADMIN', 'ALL', 'CASHIER'))
  FOREIGN KEY(admin_id) REFERENCES people(id),
  PRIMARY KEY(admin_id, role)
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS orders(
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_id    TEXT,
  supplier_id TEXT,
  price       REAL,
  datetime    INT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(admin_id)     REFERENCES people(id),
  FOREIGN KEY(supplier_id)  REFERENCES suppliers(id)
);

CREATE TABLE IF NOT EXISTS sales(
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  checkout_id INT NOT NULL,
  customer_id TEXT,
  price       REAL,
  datetime    INT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(customer_id)  REFERENCES people(id)
);

CREATE TABLE IF NOT EXISTS orders_detail(
  item_id   INT,
  order_id  INT,
  price     REAL,
  quantity  REAL,
  FOREIGN KEY(item_id)  REFERENCES items(id),
  FOREIGN KEY(order_id) REFERENCES orders(id),
  PRIMARY KEY(item_id, order_id)
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS sales_detail(
  item_id   INT,
  sale_id   INT,
  price     REAL,
  quantity  REAL,
  FOREIGN KEY(item_id)  REFERENCES items(id),
  FOREIGN KEY(sale_id)  REFERENCES sales(id),
  PRIMARY KEY(item_id, sale_id)
) WITHOUT ROWID;

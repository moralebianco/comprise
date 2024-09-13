CREATE TABLE IF NOT EXISTS people(
  id     TEXT PRIMARY KEY,
  role   INT DEFAULT 1,
  names  TEXT NOT NULL,
  phone  TEXT
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS suppliers(
  id    TEXT PRIMARY KEY,
  name  TEXT NOT NULL,
  phone TEXT,
  email TEXT
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS items(
  name      TEXT NOT NULL,
  price     REAL DEFAULT 0.0,
  metadata  TEXT,
  quantity  REAL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS orders(
  admin_id    TEXT,
  supplier_id TEXT,
  price       REAL,
  datetime    INT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(admin_id)     REFERENCES people(id),
  FOREIGN KEY(supplier_id)  REFERENCES suppliers(id)
);

CREATE TABLE IF NOT EXISTS sales(
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
  FOREIGN KEY(item_id)  REFERENCES items(rowid),
  FOREIGN KEY(order_id) REFERENCES orders(rowid),
  PRIMARY KEY(item_id, order_id)
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS sales_detail(
  item_id   INT,
  sale_id   INT,
  price     REAL,
  quantity  REAL,
  FOREIGN KEY(item_id)  REFERENCES items(rowid),
  FOREIGN KEY(sale_id)  REFERENCES sales(rowid),
  PRIMARY KEY(item_id, sale_id)
) WITHOUT ROWID;

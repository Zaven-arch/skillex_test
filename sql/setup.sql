CREATE TABLE IF NOT EXISTS combinations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  combination VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  combination_id INT,
  response TEXT,
  FOREIGN KEY (combination_id) REFERENCES combinations(id)
);
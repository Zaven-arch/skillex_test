/*
 * SQL Script to create the necessary tables for the combination and response system.
 *
 * The script ensures that the tables are created only if they do not already exist,
 * providing a structure for storing combinations and their associated responses.
 */
/**
 * Creates the combinations table to store unique combinations.
 *
 * Table: combinations
 * Columns:
 * - id: INT, Auto-incrementing primary key to uniquely identify each combination.
 * - combination: VARCHAR(255), A string to store the combination data (up to 255 characters).
 */
CREATE TABLE IF NOT EXISTS combinations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  combination VARCHAR(255) NOT NULL
);
/**
 * Creates the responses table to store responses associated with combinations.
 *
 * Table: responses
 * Columns:
 * - id: INT, Auto-incrementing primary key to uniquely identify each response.
 * - combination_id: INT, A foreign key referencing the id column in the combinations table.
 * - response: TEXT, A text field to store the response associated with the combination.
 *
 * Foreign Key Constraint:
 * - combination_id: References the id column in the combinations table, establishing
 *   a relationship between the two tables.
 */
CREATE TABLE IF NOT EXISTS responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  combination_id INT,
  response TEXT,
  FOREIGN KEY (combination_id) REFERENCES combinations(id)
);
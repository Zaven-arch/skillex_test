/*
 * SQL Script to create the necessary tables for the combination and response system.
 *
 * This script sets up the database structure required to manage and store unique combinations,
 * their associated responses, and the items that make up those combinations. Each table is created
 * only if it does not already exist, ensuring that the database schema remains intact across
 * deployments.
 */
/**
 * Creates the combinations table to store unique combinations of items.
 * Each combination is identified by a unique ID and can contain multiple items.
 *
 * Table Structure:
 * - id: An auto-incrementing primary key that uniquely identifies each combination.
 * - combination: A VARCHAR field to store the representation of the combination.
 */
CREATE TABLE IF NOT EXISTS combinations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  combination VARCHAR(255) NOT NULL
);
/**
 * Creates the responses table to store responses associated with specific combinations.
 * Each response is linked to a combination by its ID, allowing for the retrieval
 * of responses based on the combinations used.
 *
 * Table Structure:
 * - id: An auto-incrementing primary key that uniquely identifies each response.
 * - combination_id: A foreign key referencing the combinations table, linking the response to
 *   the corresponding combination.
 * - response: A TEXT field to store the actual response content.
 */
CREATE TABLE IF NOT EXISTS responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  combination_id INT,
  response TEXT,
  FOREIGN KEY (combination_id) REFERENCES combinations(id)
);
/**
 * Creates the items table to store individual items that can be part of combinations.
 * Each item is identified by a unique ID and may be associated with multiple responses.
 *
 * Table Structure:
 * - id: An auto-incrementing primary key that uniquely identifies each item.
 * - item_name: A VARCHAR field to store the name of the item.
 * - response_id: A foreign key referencing the responses table, linking the item to
 *   the response it belongs to.
 */
CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_name VARCHAR(255) NOT NULL,
  response_id INT,
  FOREIGN KEY (response_id) REFERENCES responses(id)
);
/**
 * Creates the combination_items table to establish a many-to-many relationship between
 * combinations and items.
 * This table allows for the storage of which items are included in each combination.
 *
 * Table Structure:
 * - combination_id: A foreign key referencing the combinations table, indicating which
 *   combination an item is part of.
 * - item_id: A foreign key referencing the items table, indicating the item that is
 *   included in the combination.
 * - PRIMARY KEY: A composite primary key consisting of both combination_id and item_id
 *   to ensure uniqueness.
 */
CREATE TABLE IF NOT EXISTS combination_items (
  combination_id INT,
  item_id INT,
  PRIMARY KEY (combination_id, item_id),
  FOREIGN KEY (combination_id) REFERENCES combinations(id),
  FOREIGN KEY (item_id) REFERENCES items(id)
);
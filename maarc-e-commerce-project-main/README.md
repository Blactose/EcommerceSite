**Things to be done**
1) Add to basket feature
2) Functional basket page
3) checkout 

**Files being worked on**

Rohan Raj
* Working on basket page 

Mohammed Babiker
* Currently working on homepage - 09/11/2024
* Currenty working on catalogue/shop page - 10/11/2024
* Currenty working on seperate item pages - 10/11/2024

Aadit Singhal 
* Currently working on account deletion - 11/11/2024
* Currently working on products table in maarc_db - 11/11/2024
* Currently working on shop page -11/11/2024
* Currently working on basket page - 12/11/2024

Alen Saju

Cailan White


SQL Code for the tables in maarc_db
users table:
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);

products table:
CREATE TABLE products ( 
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL (10,2) NOT NULL,
    category ENUM('T-shirt', 'Shirt', 'Pants', 'Jeans', 'Top', 'Accessories') NOT NULL,
    gender ENUM('Male','Female')NOT NULL,
    image_url VARCHAR(255)
);

basket table:
CREATE TABLE basket (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CAS CADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

review table:
CREATE TABLE webreviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rating INT,  -- Ensure the rating is stored as an integer
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Setting Up the Shop Page
To view the items on the shop page, you'll need to set up the products table in your maarc_db database and add product images.
1. Create the products table with the SQL code provided above
2. Place your product images in the `htdocs/images` folder within your XAMPP installation directory. This will make them accessible from your local server.
3. Configure the `image_url` field in your database for each product to reference the corresponding image in the `images` folder. 
   - For example, if you have an image named `christmas-pants.png` located in `htdocs/images`, structure the URL as:
   http://localhost/images/christmas-pants.png
4. Store this URL in the `image_url` field for each product in your database. This setup enables your application to load images dynamically from the local server when displaying products.
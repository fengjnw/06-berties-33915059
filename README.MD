
# Berties Books

Sample code for Dynamic Web Applications module.

Uses node.js with Express and EJS.

To install and run:

npm install
node index.js

Project structure
-----------------

create_db.sql
insert_test_data.sql
index.js
package.json
README.MD
public/
	main.css
routes/
	books.js
	main.js
	users.js
views/
	about.ejs
	addbook.ejs
	index.ejs
	list.ejs
	register.ejs
	search.ejs

Routes
------

/: Home page (renders `index.ejs`)

/about: About page (renders `about.ejs`)

/bookadded (POST): Accepts form data to add a book to the database and returns a confirmation message.

/books/list: Shows all books (renders `list.ejs`).

/books/search: Search form (renders `search.ejs`).

/books/search_result: Handles search queries and renders `search_result.ejs` with results.

/books/addbook: Renders add-book form (`addbook.ejs`).

/books/bargainbooks: Lists books priced under 20 (renders `bargainbooks.ejs`).

/users/register: Renders the user registration form (`register.ejs`).

/users/registered (POST): Accepts registration form and returns a confirmation message.


import dotenv from "dotenv";
dotenv.config();

import { MongoClient, ObjectId } from "mongodb";

const url = process.env.MONGODB_URL;

const dbName = "plp_bookstore";
const collectionName = "books";

async function runQueries() {
    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        //Task 1: Find all books in a specific genre
        async function findBooksByGenre(genre) {
            return collection.find({ genre: genre }).toArray();
        }

        const genre = "Fiction";
        const booksInGenre = await findBooksByGenre(genre);

        if (booksInGenre.length > 0) {
            console.log(`\nBooks in genre "${genre}":`.toUpperCase());
            booksInGenre.forEach((book, index) => {
                console.log(
                    `${index + 1}. ${book.title} by ${book.author} (${book.published_year
                    })`
                );
            });
            console.log(`\nTotal books found: ${booksInGenre.length}`);
        } else {
            console.log(`No books found in genre "${genre}".`);
        }

        // Task 2: Find books published after a certain year
        async function BooksPublishedAfter(year) {
            return collection.find({ published_year: { $gt: year } }).toArray();
        }

        const year = 1950;
        const recentBooks = await BooksPublishedAfter(year);

        if (recentBooks.length > 0) {
            console.log(`\nBooks published after ${year}:`.toUpperCase());

            recentBooks.forEach((book, index) => {
                console.log(
                    `${index + 1}. ${book.title} by ${book.author} (${book.published_year
                    })`
                );
            });
            console.log(`\nTotal books found: ${recentBooks.length}`);
        } else {
            console.log(`No books found published after ${year}.`);
        }

        // Task 3: Find books by a specific author
        async function findBookByAuthor(author) {
            return collection.find({ author: author }).toArray();
        }

        const author = "George Orwell";
        const booksByAuthor = await findBookByAuthor(author);

        if (booksByAuthor.length > 0) {
            console.log(`\nBooks by author "${author}":`.toUpperCase());
            booksByAuthor.forEach((book, index) => {
                console.log(`${index + 1}. ${book.title} (${book.published_year})`);
            });
            console.log(`\n${booksByAuthor.length} book(s) found.`);
        } else {
            console.log(`No books found by author "${author}".`);
        }

        // Task 4: Update the price of a specific book
        async function updatePrice(bookId, newPrice) {
            return collection.updateOne(
                { _id: bookId },
                { $set: { price: newPrice } }
            );
        }

        const bookId = new ObjectId("68dde3e44c7020e977652a33");
        const newPrice = 22.99;

        const updateResult = await updatePrice(bookId, newPrice);
        console.log(`Updated ${updateResult.modifiedCount} book(s)`);
        if (updateResult.modifiedCount > 0) {
            const updatedBook = await collection.findOne({ _id: bookId });
            console.log(
                `Updated Book: ${updatedBook.title},  New Price: $${updatedBook.price}`
            );
        }

        // Task 5: Delete a book by its title
        async function deleteBookByTitle(title) {
            return collection.deleteOne({ title: title });
        }

        const bookTitle = "To Kill a Mockingbird";
        const deleteResult = await deleteBookByTitle(bookTitle);

        console.log(`\nDeleted ${deleteResult.deletedCount} book(s)`);

        if (deleteResult.deletedCount > 0) {
            console.log(`"${bookTitle}" has been deleted.\n`);
        } else {
            console.log(`No book found with title "${bookTitle}".`);
        }

        // ADVANCED QUERIES

        // Task 1: Find books that are both in stock AND published after 2010.
        async function findInStockBooksAfterYear(year) {
            return collection
                .find({ in_stock: true, published_year: { $gt: year } })
                .toArray();
        }
        const stockYear = 2010;
        const inStockRecentBooks = await findInStockBooksAfterYear(stockYear);
        console.log(
            `\nBooks in stock and published after ${stockYear}:`.toUpperCase()
        );
        if (inStockRecentBooks.length > 0) {
            inStockRecentBooks.forEach((book, index) => {
                console.log(
                    `${index + 1}. ${book.title} by ${book.author} (${book.published_year
                    })`
                );
            });
            console.log(`\nTotal books found: ${inStockRecentBooks.length}`);
        } else {
            console.log(
                `No books found that are in stock and published after ${stockYear}.`
            );
        }

        // Task 2: Use projection (return only title, author, price).
        async function findBooksProjection() {
            return collection
                .find({}, { projection: { title: 1, author: 1, price: 1, _id: 0 } })
                .toArray();
        }
        const projectedBooks = await findBooksProjection();
        console.log(
            `\nBooks with projection (title, author, price):`.toUpperCase()
        );
        projectedBooks.forEach((book, index) => {
            console.log(
                `${index + 1}. ${book.title} by ${book.author} - $${book.price}`
            );
        });
        console.log(`\nTotal books found: ${projectedBooks.length}`);

        // Task 3:Implement sorting by price (ascending + descending).
        async function findBooksSortedByPrice(order = "asc") {
            const sortOrder = order === "asc" ? 1 : -1;
            return collection.find({}).sort({ price: sortOrder }).toArray();
        }
        // ascending
        const ascSortedBooks = await findBooksSortedByPrice("asc");
        console.log(`\nBooks sorted by price (ascending):`.toUpperCase());
        ascSortedBooks.forEach((book, index) => {
            console.log(
                `${index + 1}. ${book.title} by ${book.author} - $${book.price}`
            );
        });
        // descending
        const descSortedBooks = await findBooksSortedByPrice("desc");
        console.log(`\nBooks sorted by price (descending):`.toUpperCase());
        descSortedBooks.forEach((book, index) => {
            console.log(
                `${index + 1}. ${book.title} by ${book.author} - $${book.price}`
            );
        });

        // Task 4: Implement pagination with .limit(5).skip(n)
        async function findBooksWithPagination(page = 1, limit = 5) {
            const skip = (page - 1) * limit;
            return collection.find({}).limit(limit).skip(skip).toArray();
        }

        const page = 1;
        const limit = 5;
        const paginatedBooks = await findBooksWithPagination(page, limit);
        console.log(`\nBooks - Page ${page} (limit ${limit}):`.toUpperCase());
        paginatedBooks.forEach((book, index) => {
            console.log(
                `${index + 1}. ${book.title} by ${book.author} - $${book.price}`
            );
        });


    } catch (error) {
        console.error("Error occurred:", error);
    } finally {
        await client.close();
    }
}

runQueries().catch(console.error);

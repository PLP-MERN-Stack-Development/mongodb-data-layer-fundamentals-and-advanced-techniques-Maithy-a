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
            console.log(`Updated Book: ${updatedBook.title},  New Price: $${updatedBook.price}`);
        }

        // Task 5: Delete a book by its title
        async function deleteBookByTitle(title){
            return collection.deleteOne({title:title})
        }

        const bookTitle = "To Kill a Mockingbird";
        const deleteResult = await deleteBookByTitle(bookTitle);

        console.log(`\nDeleted ${deleteResult.deletedCount} book(s)`);

        if (deleteResult.deletedCount > 0) {
            console.log(`"${bookTitle}" has been deleted.\n`);
        } else {
            console.log(`No book found with title "${bookTitle}".`);
        }

    } catch (error) {
        console.error("Error occurred:", error);
    } finally {
        await client.close();
    }
}

runQueries().catch(console.error);

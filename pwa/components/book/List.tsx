import { FunctionComponent, useState } from "react";
import Link from "next/link";
import ReferenceLinks from "components/common/ReferenceLinks";
import { Book } from "types/Book";
import { mercureSubscribe, normalize } from "utils/dataAccess";

interface Props {
  books: Book[];
  hubURL: string;
}

export const List: FunctionComponent<Props> = (props) => {
  const [books, setBooks] = useState(props.books);

  if (typeof window !== "undefined" && books && books.length !== 0) {
    books.map((book, pos) => {
      mercureSubscribe(new URL(props.hubURL, window.origin), [book["@id"]]).addEventListener("message", (event) => {
        books[pos] = normalize(JSON.parse(event.data));
        setBooks([...books]);
      });
    });
  }

  return (
    <div>
      <h1>Book List</h1>
      <Link href="/books/create">
        <a className="btn btn-primary">Create</a>
      </Link>
      <table className="table table-responsive table-striped table-hover">
        <thead>
        <tr>
          <th>id</th>
          <th>isbn</th>
          <th>title</th>
          <th>description</th>
          <th>author</th>
          <th>publicationDate</th>
          <th>reviews</th>
          <th/>
        </tr>
        </thead>
        <tbody>
        {books &&
        books.length !== 0 &&
        books.map((book) => (
          <tr key={book["@id"]}>
            <th scope="row">
              <ReferenceLinks items={book["@id"]} type="book"/>
            </th>
            <td>{book["isbn"]}</td>
            <td>{book["title"]}</td>
            <td>{book["description"]}</td>
            <td>{book["author"]}</td>
            <td>{book["publicationDate"]}</td>
            <td>{book["reviews"] &&
            book["reviews"].length !== 0 &&
            book["reviews"].map((review: string) => (
              <div key={review}><Link href={review}>{review}</Link></div>
            ))}</td>
            <td>
              <ReferenceLinks
                items={book["@id"]}
                type="book"
                useIcon={true}
              />
            </td>
            <td>
              <Link href={`${book["@id"]}/edit`}>
                <a>
                  <i className="bi bi-pen" aria-hidden="true"/>
                  <span className="sr-only">Edit</span>
                </a>
              </Link>
            </td>
          </tr>
        ))}
        {/* todo Add pagination */}
        </tbody>
      </table>
    </div>
  );
};

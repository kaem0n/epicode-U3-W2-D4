// DATA IMPORTS

import fantasy from '../data/fantasy.json'
import history from '../data/history.json'
import horror from '../data/horror.json'
import romance from '../data/romance.json'
import scifi from '../data/scifi.json'

// COMPONENT IMPORTS

import { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form'
import SingleBook from './SingleBook'
import SideCommentArea from './SideCommentArea'

// COMPONENT FUNCTION

const AllTheBooks = () => {
  const [genreSelected, setGenreSelected] = useState(fantasy)
  const [searchText, setSearchText] = useState('')
  const [bookSelected, setBookSelected] = useState(null)

  const setBook = (book) => setBookSelected(book)
  const handleSubmit = (e) => e.preventDefault()

  const filter = () => {
    const filteredBooks = []
    for (let i = 0; i < genreSelected.length; i++) {
      if (genreSelected[i].title.toLowerCase().indexOf(searchText) !== -1) {
        filteredBooks.push(genreSelected[i])
      }
    }
    return filteredBooks
  }

  return (
    <>
      <Container fluid>
        <Row className="mb-3">
          <Col
            xs={12}
            md={8}
            lg={6}
            xxl={4}
            className="d-flex justify-content-between align-items-center"
          >
            <Dropdown className="me-2">
              <Dropdown.Toggle variant="dark">Generi</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setGenreSelected(fantasy)}>
                  Fantasy
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setGenreSelected(history)}>
                  History
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setGenreSelected(horror)}>
                  Horror
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setGenreSelected(romance)}>
                  Romance
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setGenreSelected(scifi)}>
                  Sci-Fi
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Form className="flex-grow-1" onSubmit={handleSubmit}>
              <Form.Control
                type="search"
                placeholder="Cerca un libro"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Form>
          </Col>
          <Col className="d-flex align-items-center">
            <p className="m-0 mt-2 mt-md-0 text-secondary">
              {' '}
              Sono presenti {genreSelected.length} libri.
            </p>
          </Col>
        </Row>
      </Container>
      <Container fluid className="mb-5">
        <Row>
          <Col xs={6} lg={8} xxl={9}>
            <Container fluid className="px-0">
              <Row
                xs={1}
                md={2}
                lg={3}
                xl={4}
                xxl={5}
                className="g-3 border-end"
              >
                {searchText === '' ? (
                  genreSelected.map((book) => {
                    return (
                      <SingleBook
                        book={book}
                        key={book.asin}
                        bookSelected={bookSelected}
                        setBook={setBook}
                      />
                    )
                  })
                ) : filter().length !== 0 ? (
                  filter().map((book) => {
                    return (
                      <SingleBook
                        book={book}
                        key={book.asin}
                        bookSelected={bookSelected}
                        setBook={setBook}
                      />
                    )
                  })
                ) : (
                  <h1 className="flex-grow-1 text-center text-secondary mt-5">
                    Nessun libro trovato.
                  </h1>
                )}
              </Row>
            </Container>
          </Col>
          <Col xs={6} lg={4} xxl={3}>
            {bookSelected ? (
              <>
                <h4 className="mb-4">
                  Area commenti -{' '}
                  <span className="fst-italic">{bookSelected.title}</span>
                </h4>
                <SideCommentArea bookSelected={bookSelected.asin} />
              </>
            ) : (
              <h3 className="text-center">Nessun libro selezionato</h3>
            )}
          </Col>
        </Row>
      </Container>
    </>
  )
}

// EXPORT

export default AllTheBooks

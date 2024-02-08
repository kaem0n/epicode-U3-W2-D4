// COMPONENT IMPORTS

import { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import CommentArea from './CommentArea'

// COMPONENT FUNCTION

const SingleBook = (props) => {
  const [selected, setSelected] = useState(false)

  const select = () => {
    setSelected(true)
    props.setBook(props.book)
  }

  useEffect(() => {
    if (props.bookSelected === props.book) {
      select()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Col>
      <Card
        data-testid="book-card"
        className={
          selected && props.book === props.bookSelected
            ? 'border-4 border-danger h-100'
            : 'h-100'
        }
      >
        <Card.Img variant="top" src={props.book.img} onClick={select} />
        <Card.Body className="d-flex flex-column justify-content-between">
          <div className="mb-2">
            <Card.Title>{props.book.title}</Card.Title>
            <Card.Subtitle>
              <Badge bg="danger">ASIN: {props.book.asin}</Badge>
            </Card.Subtitle>
          </div>
          <div>
            <Card.Text className="m-0">
              <span className="fw-bold">Categoria:</span>{' '}
              {toCapitalize(props.book.category)}
            </Card.Text>
            <Card.Text>
              <span className="fw-bold">Prezzo:</span>{' '}
              {fixPrice(String(props.book.price))}€
            </Card.Text>
            <div className="d-flex">
              <Button
                variant="dark"
                className="flex-grow-1 me-2 px-0"
                onClick={select}
              >
                Seleziona <i className="bi bi-cart-plus-fill"></i>
              </Button>
              <CommentArea book={props.book} />
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
}

// OTHER FUNCTIONS

const fixPrice = (str) => {
  let text = str.replace('.', ',')
  if (text.slice(text.indexOf(',')).length === 2) {
    text += '0'
  } else if (text.indexOf(',') === -1) {
    text += ',00'
  }
  return text
}

const toCapitalize = (str) => {
  let text
  if (str === 'scifi') {
    text = 'Sci-Fi'
  } else {
    const textArray = str.split('')
    textArray[0] = textArray[0].toUpperCase()
    text = textArray.join('')
  }
  return text
}

// EXPORT

export default SingleBook

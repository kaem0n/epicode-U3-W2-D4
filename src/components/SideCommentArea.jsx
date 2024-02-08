import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'

const API_KEY =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWFhNTMwNDE4N2U1YzAwMTgxNGM2OWUiLCJpYXQiOjE3MDY3OTUzMjksImV4cCI6MTcwODAwNDkyOX0.z776mNx_nkW-OchLZgq0pX1G0Fvqfzy-JBFhRt38tac'

const SideCommentArea = ({ bookSelected }) => {
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')
  const [rate, setRate] = useState('1')
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState('')
  const [counter, setCounter] = useState(30)
  const [timer, setTimer] = useState(null)

  const getComments = (asin) => {
    setIsLoading(true)
    setCounter(30)
    fetch('https://striveschool-api.herokuapp.com/api/comments/' + asin, {
      method: 'GET',
      headers: {
        Authorization: API_KEY,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        } else {
          throw new Error(res.status)
        }
      })
      .then((data) => {
        console.log(data)
        setComments(data)
        setIsLoading(false)
      })
      .catch((err) => {
        setIsError(true)
        setIsLoading(false)
        setError(`${err}`)
      })
  }

  const deleteComment = (id) => {
    fetch('https://striveschool-api.herokuapp.com/api/comments/' + id, {
      method: 'DELETE',
      headers: {
        Authorization: API_KEY,
      },
    })
      .then((res) => {
        if (res.ok) {
          getComments(bookSelected)
        } else {
          throw new Error(res.status)
        }
      })
      .catch((err) => {
        setIsError(true)
        setIsLoading(false)
        setError(`${err}`)
      })
  }

  const addComment = (e) => {
    e.preventDefault()
    fetch('https://striveschool-api.herokuapp.com/api/comments/', {
      method: 'POST',
      headers: {
        Authorization: API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment: comment,
        rate: rate,
        elementId: bookSelected,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setComment('')
          setRate('1')
          getComments(bookSelected)
        } else {
          throw new Error(res.status)
        }
      })
      .catch((err) => {
        setIsError(true)
        setIsLoading(false)
        setError(`${err}`)
      })
  }

  const printStars = (n) => {
    const iconContainer = []
    for (let i = 0; i < n; i++) {
      const icon = <i key={i} className="bi bi-star-fill text-warning"></i>
      iconContainer.push(icon)
    }
    return iconContainer
  }

  useEffect(() => {
    getComments(bookSelected)
    clearInterval(timer)
    setTimer(
      setInterval(() => {
        setCounter((value) => {
          if (value === 0) {
            getComments(bookSelected)
          }
          return value - 1
        })
      }, 1000)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookSelected])

  return (
    <>
      {bookSelected && (
        <Col className="my-3">
          <div className="mb-4">
            {isLoading && (
              <div className="text-center">
                <Spinner
                  animation="border"
                  variant="danger"
                  data-testid="spinner"
                />
              </div>
            )}
            {isError && !isLoading ? (
              <h1 className="text-center text-danger">{error}</h1>
            ) : comments.length === 0 && !isLoading && !isError ? (
              <h3 className="text-center text-secondary">
                Non ci sono commenti.
              </h3>
            ) : (
              !isLoading &&
              comments.map((el) => (
                <div key={el._id} data-testid="comment">
                  <div className="d-flex justify-content-between align-items-start">
                    <p>
                      <span className="fw-semibold me-2">{el.author}</span>
                      {printStars(el.rate)}
                    </p>
                    <Button
                      variant="danger"
                      onClick={() => deleteComment(el._id)}
                    >
                      <i className="bi bi-trash-fill"></i>
                    </Button>
                  </div>
                  <p className="fst-italic border-bottom">{el.comment}</p>
                </div>
              ))
            )}
          </div>
          <div className="text-center mb-5">
            <Button variant="dark" onClick={() => getComments(bookSelected)}>
              AGGIORNA
            </Button>
            <p className="mt-2 text-secondary">
              I commenti si aggiorneranno tra {counter} secondi.
            </p>
          </div>
          <hr />
          <Form
            className="d-flex flex-column justify-content-between mt-5"
            onSubmit={addComment}
          >
            <div>
              <Form.Group className="mb-2">
                <Form.Label>Valutazione (da 1 a 5 stelle)</Form.Label>
                <Form.Select
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Aggiungi un commento</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
            <Button type="submit" variant="dark" className="align-self-end">
              INVIA
            </Button>
          </Form>
        </Col>
      )}
    </>
  )
}

export default SideCommentArea

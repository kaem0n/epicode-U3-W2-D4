import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App'
import userEvent from '@testing-library/user-event'

describe('General component mounting', () => {
  it('correctly mounts Welcome component', () => {
    render(<App />)
    const text = screen.getByText(/benvenuto/i)
    expect(text).toBeInTheDocument()
  })

  it('correctly renders all the books', () => {
    render(<App />)
    const books = screen.getAllByText(/asin/i)
    const maxNumberOfBooks = 150
    expect(books.length).toBeLessThanOrEqual(maxNumberOfBooks)
  })

  it('correctly mounts SideCommentArea component', () => {
    render(<App />)
    const initialTxt = screen.getByText(/nessun libro selezionato/i)
    expect(initialTxt).toBeInTheDocument()
    const firstBookSelectBtn = screen.getAllByText(/seleziona/i)[1]
    fireEvent.click(firstBookSelectBtn)
    const loadedTxt = screen.getByText(/area commenti/i)
    expect(loadedTxt).toBeInTheDocument()
  })
})

describe('Book section behavior', () => {
  it('properly filters books using search bar', () => {
    render(<App />)
    const books = screen.getAllByText(/asin/i)
    const searchBar = screen.getByPlaceholderText(/cerca un libro/i)
    userEvent.type(searchBar, 'a')
    const filteredBooks = screen.getAllByText(/asin/i)
    expect(filteredBooks.length).toBeLessThan(books.length)
  })

  it("changes book's card border color on selection", () => {
    render(<App />)
    const firstBook = screen.getAllByTestId('book-card')[0]
    const firstBookSelectBtn = screen.getAllByText(/seleziona/i)[1]
    fireEvent.click(firstBookSelectBtn)
    expect(firstBook).toHaveClass('border-danger')
  })

  it("changes first book's card back to normal after selecting another book", () => {
    render(<App />)
    const firstBook = screen.getAllByTestId('book-card')[0]
    const secondBook = screen.getAllByTestId('book-card')[1]
    const firstBookSelectBtn = screen.getAllByText(/seleziona/i)[1]
    const secondBookSelectBtn = screen.getAllByText(/seleziona/i)[2]
    fireEvent.click(firstBookSelectBtn)
    fireEvent.click(secondBookSelectBtn)
    expect(firstBook).not.toHaveClass('border-danger')
    expect(secondBook).toHaveClass('border-danger')
  })
})

describe('Comment Area behavior', () => {
  // const test = () => {
  //   const comments = screen.getAllByTestId('comment')
  //   const emptyTxt = screen.getByText(/non ci sono commenti/i)
  //   if (comments.length === 0) {
  //     return emptyTxt
  //   } else {
  //     return comments
  //   }
  // }
  it('properly loads comments', async () => {
    render(<App />)
    const firstBookSelectBtn = screen.getAllByText(/seleziona/i)[1]
    fireEvent.click(firstBookSelectBtn)
    const spinner = screen.getByTestId('spinner')
    expect(spinner).toBeInTheDocument()
    await waitFor(() => {
      expect(spinner).not.toBeInTheDocument()
      // expect(test()).toBeInTheDocument()
    })
  })
})

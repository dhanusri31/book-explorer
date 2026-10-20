import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    course: ''
  })

  // Girls names
  const girls = [
    'Nila',
    'Aadhya',
    'Diya',
    'Riya',
    'Siara',
    'Krishitha',
    'Tara',
    'Meera',
    'Anvi',
    'Sana',
    'Arshu',
    'Vidhya',
    'Keerthi',
    'Dharshana',
    'Heera',
    'Yashu'
  ]

  // Boys names
  const boys = [
    'Aadhav',
    'Kavin',
    'Rayan',
    'krishav',
    'Viyan',
    'Dharsh',
    'Arjun',
    'Dhruv',
    'Sanjay',
    'Rithvik',
    'Aarav',
    'Nihan',
    'Vihaan',
    'Adhi',
    'Rishi',
    'Karthik'
  ]

  // Combine girls and boys names
  const names = [...girls, ...boys]

  // Fetch student details from API
  useEffect(() => {
    fetch('https://dummyjson.com/users?limit=32')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch students')
        }

        return response.json()
      })
      .then((data) => {
        const students = data.users.slice(0, 32).map((user, index) => ({
          ...user,
          firstName: names[index],
          lastName: '',
          gender: index < girls.length ? 'Female' : 'Male',
          course: 'React'
        }))

        setUsers(students)
        setSuccess('Students loaded successfully!')
        setLoading(false)
      })
      .catch(() => {
        setError('Unable to load students. Please try again.')
        setLoading(false)
      })
  }, [])

  // Search students by name
  const filteredUsers = users.filter((user) =>
    user.firstName.toLowerCase().includes(search.toLowerCase())
  )

  // Pagination
  const usersPerPage = 6
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (page - 1) * usersPerPage

  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  )

  // Handle search
  function handleSearch(event) {
    setSearch(event.target.value)
    setPage(1)
  }

  // Handle form input
  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  // Handle form submission
  function handleSubmit(event) {
    event.preventDefault()

    const newStudent = {
      id: Date.now(),
      firstName: form.name.trim(),
      lastName: '',
      email: form.email.trim(),
      age: Number(form.age),
      gender: form.gender,
      course: form.course.trim()
    }

    // Add new student to the existing list
    setUsers((previousUsers) => [...previousUsers, newStudent])

    // Show the updated student list
    setSearch('')
    setPage(1)

    // Success message
    setSuccess('Student added successfully!')
    setError('')

    // Clear the form
    setForm({
      name: '',
      email: '',
      age: '',
      gender: '',
      course: ''
    })
  }

  return (
    <div className="container">

      {/* Header */}
      <header>
        <h1>Student Explorer</h1>
        <p>Explore student details using React and API</p>
      </header>

      {/* Student Details */}
      <section className="user-section">
        <h2>Student Details</h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search student name..."
          value={search}
          onChange={handleSearch}
          className="search"
        />

        {/* Loading Message */}
        {loading && <p>Loading students...</p>}

        {/* Error Message */}
        {error && <p className="error">{error}</p>}

        {/* Success Message */}
        {!loading && !error && success && (
          <p className="success">{success}</p>
        )}

        {/* No Students Found */}
        {!loading && !error && currentUsers.length === 0 && (
          <p>No students found.</p>
        )}

        {/* Student Cards */}
        <div className="user-list">
          {currentUsers.map((user) => (
            <div className="user-card" key={user.id}>
              <h3>{user.firstName}</h3>

              <p>Email: {user.email}</p>

              <p>Age: {user.age}</p>

              <p>Gender: {user.gender}</p>

              <p>Course: {user.course || 'React'}</p>
            </div>
          ))}
        </div>

        {/* Pagination Buttons */}
        {!loading && !error && totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* Add Student Form */}
      <section className="form-section">
        <h2>Add Student Details</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter student name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="age"
            placeholder="Enter age"
            value={form.age}
            onChange={handleChange}
            min="1"
            required
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="text"
            name="course"
            placeholder="Enter course"
            value={form.course}
            onChange={handleChange}
            required
          />

          <button type="submit">Submit</button>
        </form>
      </section>

    </div>
  )
}

export default App
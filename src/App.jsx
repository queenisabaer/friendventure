import styles from './App.module.css'
import NavBar from './components/NavBar'
import Container from 'react-bootstrap/Container'
import {Route, Routes} from 'react-router-dom'

function App() {
  
  return (
    <>
      <div className={styles.App}>
        <NavBar />
        <Container className={styles.Main}>
          <Routes>
            <Route exact path='/' element= {<h1>Home Page</h1>} />
            <Route exact path='/signup' element={<h1>Sign Up</h1> }/>
            <Route path="*" element={<p>Sorry, Page not found</p>} />
          </Routes>
        </Container>
      </div>
    </>
  )
}

export default App

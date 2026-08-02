import { BrowserRouter, Route, Routes } from 'react-router'
import { Layout } from './components/Layout/Layout'
import { Home } from './pages/Home/Home'
import { AboutMe } from './pages/AboutMe/AboutMe'
import { NotFound } from './pages/NotFound/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/aboutme" element={<AboutMe />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { ItemList } from './pages/ItemList'
import { ItemDetail } from './pages/ItemDetail'
import { Simulator } from './pages/Simulator'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="items" element={<ItemList />} />
        <Route path="item/:id" element={<ItemDetail />} />
        <Route path="simulator" element={<Simulator />} />
      </Route>
    </Routes>
  )
}

export default App

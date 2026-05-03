import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ItemList } from './pages/ItemList'
import { ItemDetail } from './pages/ItemDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ItemList />} />
        <Route path="item/:id" element={<ItemDetail />} />
      </Route>
    </Routes>
  )
}

export default App

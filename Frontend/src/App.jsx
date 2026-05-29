import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"

function App() {
  return (
    <RouterProvider route={router} />
  )
}



export default App

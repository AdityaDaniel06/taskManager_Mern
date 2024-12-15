import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Homepage from "./pages/Homepage";
import CreateTask from "./pages/CreateTask";
import Admindashboard from "./pages/Admindashboard";
import ShowTask from "./pages/ShowTask";
import CreateUser from "./pages/CreateUser";
import AssignedTask from "./pages/AssignedTask";
import EditTask from "./pages/EditTask";
import Userdashboard from "./pages/Userdashboard";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Homepage />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="dashboard/:userId" element={<Userdashboard />} />
          </Route>
        </Routes>
        <Routes>
          <Route path="/admin" element={<Admindashboard />}>
            <Route index element={<CreateTask />} />
            <Route path="add-task" element={<CreateTask />} />
            <Route path="create-user" element={<CreateUser />} />
            <Route path="show-task" element={<ShowTask />} />
            <Route path="assign-task" element={<AssignedTask />} />
            <Route path="edit/:id" element={<EditTask />} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

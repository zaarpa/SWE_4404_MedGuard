import Landing from "./Components/LogRegister/Landing";
import ProfilePageForCustomers from "./Components/profile/profilePageForCustomers";
import ProfilePageForPharmacy from "./Components/profile/profilePageForPharmacy";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";



function App() {
  const user=useSelector((state)=>state.userState.user);
  console.log(user);
  return (
    <Router>
      <div className="App">
      <div className="content">
        <Routes>
          <Route exact path='/' element={!user?<Landing />:(user.userType==='buyer'?<Navigate to={'/profileBuyer/'+user._id}/>:<Navigate to={'/profileSeller/'+user._id}/>) }/>

          <Route exact path='/profileBuyer/:id' element={user?<ProfilePageForCustomers/>:<Navigate to='/'/>}/>

          <Route exact path='/profileSeller/:id' element={user?<ProfilePageForPharmacy/>:<Navigate to='/'/>}/>
        </Routes>
      </div>
    </div>
    </Router>
  );
}

export default App;
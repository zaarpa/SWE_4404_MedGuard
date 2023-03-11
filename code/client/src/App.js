import Landing from "./Components/LogRegister/Landing";
import ProfilePageForCustomers from "./Components/profile/profilePageForCustomers";
import ProfilePageForPharmacy from "./Components/profile/profilePageForPharmacy";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import ChangePassword from "./Components/profile/changePassword";



function App() {
  const user=useSelector((state)=>state.userState.user);
  return (
    <Router>
      <div className="App">
      <div className="content">
        <Routes>
          <Route exact path='/' element={!user?<Landing />:(user.userType==='buyer'?<Navigate to={'/profileBuyer/'+user._id}/>:<Navigate to={'/profileSeller/'+user._id}/>) }/>
          <Route exact path='/profileBuyer/:id' element={user?<ProfilePageForCustomers/>:<Navigate to='/'/>}/>
          <Route exact path='/profileSeller/:id' element={user?<ProfilePageForPharmacy/>:<Navigate to='/'/>}/>
          <Route exact path='/profileBuyer/changePassword/:id' element={<ChangePassword/>} />
          <Route exact path='/profileSeller/changePassword/:id' element={<ChangePassword/>} />
          <Route path='/forgotPassword' element={<ForgotPassword/>} />
        </Routes>
      </div>
    </div>
    </Router>
  );
}

export default App;
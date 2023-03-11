import axios from 'axios';
import { useEffect , useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "../../index.css";
import 'boxicons';
import { useDispatch, useSelector } from 'react-redux';
import { setSellerUser } from '../../Contexts/action';

const ProfileFormPharmacy=(id)=> {
  const _id=id;
  const user=useSelector((state) => state.userState.sellerState);
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isLocked , setisLocked] = useState(false);
  const [username,setUsername]=useState("");
  const [phone,setPhone]=useState("");
  const [pharmacy,setPharmacy]=useState("");
  const [address,setAddress]=useState("");
  const [userData,setuserData]=useState(null);
  useEffect(()=>{
    setUsername(user.username);
    console.log(user.phone);
    console.log(user.address);
    setPhone(user.phone);
    setAddress(user.address);
  },[user])
  
  const [password,setPassword]=useState(null);
  console.log(username);


  const turnOnEdit = () => {
    setIsDisabled(false);
    setIsEditing(true);
  }
  const turnOffEdit = () => {
    setIsDisabled(true);
    setIsEditing(false);
  }
  console.log(_id.id);
  const handleSubmit = async (e) =>{
    e.preventDefault();
    turnOffEdit();
    setisLocked(true);
    await axios.patch('/api/profile/user/'+id.id,{
      username:username,
      phone:phone,
      address:address
    },{
      headers: { 'Content-type': 'application/json' }
  }).then((result)=>{
      setuserData(result.data);
    })
    .catch(error=>console.log(error));
    await axios.patch('/api/profile/buyer/'+user.email,{
      email:user.email,
      pharmacy:pharmacy
    }).then((result)=>{
      console.log(result);
      dispatch(setSellerUser(...userData,...result.data));
    })
    .catch(error=>console.log(error));
    setPassword(null);
    setIsEditing(false);
    setisLocked(false);
  }

  return (
    <div>
      <div className="profileInfo d-flex justify-content-between">
        <h4 className="InfoHeader mb-4">Personal Information</h4>
        <button className="btn btn-outline-dark btn-editProfile " onClick={turnOnEdit}>Edit Profile
        <i className='bx bx-cog bx-sm' ></i></button>
      </div>
      <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Pharmacy Name</Form.Label>
          <Form.Control type="pharmacyName" placeholder="Enter name of your pharmacy" disabled={isDisabled} value = {pharmacy} onChange={(e)=>setPharmacy(e.target.value)}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Name of Owner</Form.Label>
          <Form.Control type="ownerName" placeholder="Enter name of owner"  disabled={isDisabled} value = {username} onChange={(e)=>setUsername(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Contact No.</Form.Label>
          <Form.Control type="email" placeholder="Enter contact no." disabled={isDisabled} value ={phone} onChange={(e)=>setPhone(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Address</Form.Label>
          <Form.Control type="address" placeholder="Address" disabled={isDisabled} value={address}  onChange={(e)=>setAddress(e.target.value)}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email"   disabled={isDisabled} value = {user.email} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" disabled={isDisabled} value={password} onChange={(e)=>setPassword(e.target.value)}/>
          {isEditing &&(<a href='#' disabled={isLocked}>Change Password?</a>)}
        </Form.Group>
        
        {isEditing && (
          <Button className="btn btn-outline-dark btn-save" type="submit" disabled={isLocked} onClick={(e)=>handleSubmit(e)}>
            Save
          </Button>
        )}</Form>
    </div>
  );
}

export default ProfileFormPharmacy;
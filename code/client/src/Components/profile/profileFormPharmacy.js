import axios from "axios";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { InputGroup } from "react-bootstrap";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import "../../index.css";
import { useDispatch, useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import { setSellerDetails, setSellerUser } from '../../Contexts/action';
import PhoneVerify from "../partials/phone/phoneVerify";

const ProfileFormPharmacy=(id)=> {
  const _id=id;
  const socket=id.socket;
  const user=useSelector((state)=>state.userState.user);
  const seller=useSelector((state) => state.userState.sellerState);
  const sellerDetails=useSelector((state) => state.userState.sellerDetails);
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isLocked , setisLocked] = useState(false);
  const [username,setUsername]=useState("");
  const [phone,setPhone]=useState("");
  const [pharmacy,setPharmacy]=useState("");
  const [address,setAddress]=useState("");
  const [error,setError]=useState("");
  const [currentPasswordVisibility, setCurrentPasswordVisibility] =useState(false);
  const [showPhoneVerify,setShowPhoneVerify]=useState(false);
  const [phoneNumberChanged,setPhoneNumberChanged] = useState(false);
  const handleClosePhoneVerify=()=>{
    setShowPhoneVerify(false);
  }

  const [errorPassword,setErrorPassword] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(()=>{
    setUsername(seller.username);
    setPhone(seller.phone);
    setAddress(seller.address);
    setPharmacy(sellerDetails.pharmacy);
    console.log(sellerDetails.pharmacy);
  },[seller,sellerDetails])
  const [password,setPassword]=useState(null);


  const turnOnEdit = () => {
    setIsDisabled(false);
    setIsEditing(true);
  }
  const turnOffEdit = () => {
    setIsDisabled(true);
    setIsEditing(false);
  }

  const verify = async (_id,password) => {
    await axios.post("/api/profile/user/verify", {_id,password}, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }).then((result)=>{
      console.log(result);
      setErrorPassword(!result.data.success);
    }).catch((error)=>{
      console.log(error);
      setErrorPassword(true);
    })
  };

  const setPhoneNumber=(phone)=>{
    setPhoneNumberChanged(true);
    if(phone.length!=11){
      setError("Phone Number Must be 11 digits");
    }
    else{
      setError("");
    }
    setPhone(phone);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    turnOffEdit();
    setisLocked(true);
    setError("");
    await verify(_id.id,CryptoJS.SHA512(password).toString());
    if(!errorPassword){
      if(!phoneNumberChanged){
        await axios
      .patch(
        "/api/profile/user/updateUser/" + _id.id,
        {
          username: username,
          address: address,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((result) => {
        console.log(result);
        dispatch(setSellerUser(result.data));
      })
      await axios.patch('/api/profile/seller/'+seller.email,{
        email:seller.email,
        pharmacy:pharmacy
      },{headers: {
        'Authorization': `Bearer ${user.token}`
      }}).then((result)=>{
        console.log(result);
        handleClose();
        dispatch(setSellerDetails(result.data));
      });
      }
      else{
        handleClose();
        let OTP = Math.floor(100000 + Math.random() * 900000).toString();
        let currentDate=new Date();
        socket.emit('OTP',{phone:phone,otp:OTP,sendingTime:currentDate});
        await axios.post('/api/mobile/OTPsend',{
          phone:phone,
          otp:OTP,
          sendingTime:currentDate
        },{
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }).then(()=>{
          setShowPhoneVerify(true);
        }).catch((err)=>{
          setError(err.response.data.error);
        })
      }
    }
    else{
      console.log('comes here');
      setError("Password is incorrect");
    }
    setIsEditing(false);
    setisLocked(false);
  };

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
          <Form.Control type="pharmacyName" placeholder="Enter name of your pharmacy" disabled={isDisabled} value={pharmacy} onChange={(e)=>setPharmacy(e.target.value)}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Name of Owner</Form.Label>
          <Form.Control type="ownerName" placeholder="Enter name of owner"  disabled={isDisabled} value = {username} onChange={(e)=>setUsername(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Contact No.</Form.Label>
          <InputGroup>
          <InputGroup.Text>+880</InputGroup.Text>
          <Form.Control type="email" placeholder="Enter contact no." disabled={isDisabled} value ={phone} onChange={(e)=>setPhoneNumber(e.target.value)} />
          </InputGroup>
          <div className="errorMessage" style={{color:"red"}}>{error}</div>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Address</Form.Label>
          <Form.Control type="address" placeholder="Address" disabled={isDisabled} value={address} onChange={(e)=>setAddress(e.target.value)}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email"   disabled={true} value = {seller.email} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          {isEditing &&(<a href={"changePassword/" + user._id}>Change Password</a>)}
        </Form.Group>
        
        {isEditing && (
          <Button className="btn btn-outline-dark btn-save" disabled={isLocked} onClick={handleShow}>
            Save
          </Button>
        )}
        <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Enter password to confirm changes</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="errorMessageShow" style={{color:"red"}}>{error}</div>
                  <Form.Group className="mb-3" controlId="enterPassword">
            
            <Form.Label>Enter Password</Form.Label>
            <InputGroup>
            <Form.Control  type={currentPasswordVisibility?"text":"password"} placeholder="Password" value={password}  onChange={(e)=>setPassword(e.target.value)}/>                 
            <InputGroup.Text>
                    {(currentPasswordVisibility && (
                      <EyeFill color="#3354a9" onClick={()=>setCurrentPasswordVisibility(false)} />
                    )) ||
                      (!currentPasswordVisibility && (
                        <EyeSlashFill color="#3354a9" onClick={()=>setCurrentPasswordVisibility(true)} />
                      ))}
                  </InputGroup.Text>
                  </InputGroup>
          </Form.Group>
                 
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleSubmit}>
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>
              </Form>
              <PhoneVerify _id={_id.id} user={user} data={{email:seller.email,pharmacy:pharmacy,phone:phone,username:username,address:address}} show={showPhoneVerify} handleClose={handleClosePhoneVerify} socket={socket}/>
    </div>
  );
}

export default ProfileFormPharmacy;
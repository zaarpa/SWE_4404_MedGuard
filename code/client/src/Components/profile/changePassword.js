import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import NavbarLanding from '../partials/landing/navbarLanding';
import { InputGroup } from 'react-bootstrap';
import {EyeFill,EyeSlashFill} from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { passwordAuth, confirmPasswordAuth } from '../../Authentication/Auth'; 

const ChangePassword = () => {
    const [currentPasswordVisibility, setCurrentPasswordVisibility] = useState(false);
    const [NewPasswordVisibility, setNewPasswordVisibility] = useState(false);
    const [confirmNewPasswordVisibility, setConfirmNewPasswordVisibility] = useState(false);
    const {id} = useParams();
    const [password,setPassword]=useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error,setError]=useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorConfirmPassword, setErrorCPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const handleSubmit = async(e) =>{
      e.preventDefault();
      if(await verify()){
        await axios.patch('/api/profile/changePassword/' + id, 
      {
        password:CryptoJS.SHA512(newPassword).toString()
      }, {
        headers: { 'Content-Type' : 'application/json'}

      }).then((result)=>{
        setNewPassword(result.data);
      })
      .catch((error) =>setError(error));
        return;
      }
      setError("account does not exist");
    }
    const verify = async() =>{
      const user={id:id, password:CryptoJS.SHA512(password).toString()};
      const response = await fetch('api/profile/changePassword/' + id, {
        method: 'POST',
        body: JSON.stringify(user),
        headers:{
          'Content-Type': 'application/json'
        },
      })
      if(response.ok){
        console.log("ok");
        return true;
      }
      else{
        console.log(password);  
        console.log("current password is incorrect");
        return false;
      }
    }
    const passwordChange = (event) => {
      const passwordValidation=passwordAuth(event.target.value);
      const confirmPasswordValidation=confirmPasswordAuth(confirmPassword);
      setErrorPassword(passwordValidation.error);
      setNewPassword(passwordValidation.newPassword);
      setErrorCPassword(confirmPasswordValidation.error);
    };
    const confirmPasswordChange = (event) => {
      const confirmPasswordValidation=confirmPasswordAuth(newPassword, event.target.value);
      setErrorCPassword(confirmPasswordValidation.error);
      setConfirmPassword(confirmPasswordValidation.confirmPassword);
    };
    return ( 
        <div>
            <NavbarLanding/>
            <section className='d-flex justify-content-center'>
            <Card className='changePasswordCard'>
        <Card.Header className='' style={{textAlign: "center", fontSize: "20px"}}><b>Change Password</b></Card.Header>
        <Card.Body>
        <Form onSubmit={handleSubmit}>       
            <Form.Group className="mb-3" controlId="formCurrentPassword">
            
            <Form.Label>Current Password</Form.Label>
            <InputGroup>
            <Form.Control  type={currentPasswordVisibility?"text":"password"} placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}  />                 
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

        <Form.Group className="mb-3" controlId="formNewPassword">
            
          <Form.Label>New Password</Form.Label>
          <InputGroup>
          <Form.Control  type={NewPasswordVisibility?"text":"password"} placeholder="Password" onChange={passwordChange}
                    value={newPassword} />                 
          <InputGroup.Text>
                  {(NewPasswordVisibility && (
                    <EyeFill color="#3354a9" onClick={()=>setNewPasswordVisibility(false)} />
                  )) ||
                    (!NewPasswordVisibility && (
                      <EyeSlashFill color="#3354a9" onClick={()=>setNewPasswordVisibility(true)} />
                    ))}
                </InputGroup.Text>
                </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formConfirmNewPassword">
            
          <Form.Label>Confirm New Password</Form.Label>
          <InputGroup>
          <Form.Control  type={confirmNewPasswordVisibility?"text":"password"} placeholder="Password" value={confirmPassword}
                    onChange={confirmPasswordChange}/>                 
          <InputGroup.Text>
                  {(confirmNewPasswordVisibility && (
                    <EyeFill color="#3354a9" onClick={()=>setConfirmNewPasswordVisibility(false)} />
                  )) ||
                    (!confirmNewPasswordVisibility && (
                      <EyeSlashFill color="#3354a9" onClick={()=>setConfirmNewPasswordVisibility(true)} />
                    ))}
                </InputGroup.Text>
                </InputGroup>
        </Form.Group>
        <div className='d-flex justify-content-between'>
        <Button variant="primary" type="submit">
          Confirm
        </Button>
            <a href='#'>Back To Profile</a>
            </div>
      </Form>
        </Card.Body>
      </Card>
      </section>
        </div>   
     );
}
 
export default ChangePassword;
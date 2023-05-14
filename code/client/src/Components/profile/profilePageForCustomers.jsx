import { useParams } from 'react-router-dom';

import NavbarCustomer from "../partials/profile/navbarCustomer";

import ProfileFormCustomer from './profileFormCustomer';
import ProfilePicture from './profilePictureBox';
import axios from 'axios';
import { useEffect } from 'react';
import {useDispatch } from 'react-redux';
import { setBuyerUser } from '../../Contexts/action';
import { useSocket } from '../../Hooks/useSocket';
import { useToken } from '../../Hooks/useToken';

const  ProfilePageForCustomers = () => {
  const user = useToken();
  const {id}=useParams();
  const socket=useSocket();
  const dispatch=useDispatch();
  useEffect(()=>{
    const retrieveUser = async() =>{
      await axios.get('/api/profile/user/getUser/'+id,{
        headers:{'Authorization': `Bearer ${user.token}`,
        'idType':user.googleId?'google':'email'
      }
      }).then((result)=>{
        dispatch(setBuyerUser(result.data));
      })
    };
    retrieveUser();
  },[])
  return (     
    <div>
      <NavbarCustomer id={id}/>
  
      <section>
      <div className="container h-100">
        <div className="pt-5">
      <div className="mt-5 d-lg-none d-flex justify-content-center"><ProfilePicture id={id} user={user}/></div></div>
        <div className="d-flex justify-content-around h-100 mx-auto my-5 w-100" style={{alignItems : 'center'}}>
        <div className="my-3 d-none d-lg-flex"><ProfilePicture id={id} user={user}/></div>
          <div className="profile-form-outer w-50 mt-5">
            <ProfileFormCustomer socket={socket} id={id} user={user}/>
          </div>
        </div>
      </div>
      </section>  
      </div>
    );
  }
   
  export default  ProfilePageForCustomers;


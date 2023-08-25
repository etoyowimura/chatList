import React, { useState } from 'react';
import { Button, Input, Layout, Space } from 'antd';
import ContactList from './Components/ContactList/ContactList';
import Login from './Components/ContactList/Login';


const App: React.FC = () => {

  return (
    <div>
      <Layout>
        {localStorage.getItem("token") ? (
            <Space direction="vertical" style={{
            width: '100%',
            height: '100%'
          }}>
            <ContactList />
          </Space> 
          ):(
            <Login />
        )}
      </Layout>
    </div>
  )
};

export default App;


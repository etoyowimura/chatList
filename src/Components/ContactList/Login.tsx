import React from 'react';
import { LoginApi } from '../../services/auth/Login';
import { Form, Field } from 'react-final-form';
import { UserOutlined } from '@ant-design/icons';

const Login: React.FC = () => {
  const submit = async (values: { username: string; password: string }) => {
    LoginApi(values.username, values.password);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f3f5f7',
      }}
    >
      <div
        style={{
          maxWidth: '300px',
          width: '100%',
          padding: '20px',
          background: '#fff',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          Log in to Your Account
        </h2>
        <Form onSubmit={submit}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: '10px',
                }}
              >
                <label style={{ marginBottom: '5px' }}>Username</label>
                <Field
                  name="username"
                  component="input"
                  placeholder="Please input your username"
                  icon={<UserOutlined />}
                  style={{
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    outline: 'none',
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: '20px',
                }}
              >
                <label style={{ marginBottom: '5px' }}>Password</label>
                <Field
                  name="password"
                  component="input"
                  type="password"
                  placeholder="Please input your password"
                  icon={<UserOutlined />}
                  style={{
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    outline: 'none',
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  background: '#0088cc',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '10px',
                  cursor: 'pointer',
                  transition: 'background 0.3s',
                }}
              >
                Log in
              </button>
            </form>
          )}
        </Form>
      </div>
    </div>
  );
};

export default Login;

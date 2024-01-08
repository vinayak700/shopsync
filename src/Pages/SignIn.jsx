import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { authSelector, setUser, signIn, signInWithGoogle } from '../Redux/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';

const SignIn = () => {
  const { loading } = useSelector(authSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    dispatch(setUser());
  }, [])


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      dispatch(signIn({ email: formData.email, password: formData.password })).unwrap().then(() => {
        toast.success('User Signed In Successfully!');
        navigate('/');
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      dispatch(signInWithGoogle()).unwrap().then(() => {
        toast.success('Signed In with Google Successfully!');
        navigate('/');
      });
    } catch (error) {
      console.log(error);
      toast.error('Error during Google sign-in.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container>
      <Card className='py-5 my-5' style={{ boxShadow: '2px 2px 25px gray' }}>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <h1 className="text-center mb-4 fw-bolder">Sign In</h1>
            <Form onSubmit={handleLogin} className='w-75 mx-auto'>
              <Form.Label>Please Enter Your Email address & Password</Form.Label>
              <Form.Group controlId="formEmail" className='my-3'>
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formPassword" className='my-3'>
                <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <p className="small">
                  <Link className="text-primary" to="/forgetpassword">
                    Forgot password?
                  </Link>
                </p>
              </Form.Group>
              <Button type="submit" variant="primary" className="w-100 mb-3">
                Sign In
              </Button>
            </Form>
            <div className="text-center">
              <Button variant="danger" onClick={handleGoogleSignIn} disabled={loading}>
                Sign In with Google
              </Button>
              <Row className='mt-4 mb-2'>
                <Col className="d-flex align-items-center justify-content-center">
                  <p className="m-0">Don't have an account?</p>
                  <Link to="/signup" className="text-decoration-none ms-2">
                    Sign Up
                  </Link>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default SignIn;

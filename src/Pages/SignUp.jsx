import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signUp } from '../Redux/reducers/authReducer';
import { useDispatch } from 'react-redux';

const SignUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            dispatch(signUp({ email: formData.email, password: formData.password })).unwrap().then(() => {
                navigate('/signin');
                toast.success('User Signed Up Successfully!');
            });
        } catch (error) {
            console.log(error);
            switch (error.code) {
                case 'auth/email-already-in-use':
                    toast.error('Email address is already in use.');
                    break;
                case 'auth/invalid-email':
                    toast.error('Invalid email address.');
                    break;
                case 'auth/weak-password':
                    toast.error('Password is too weak.');
                    break;
                default:
                    toast.error('Error during sign-up.');
            }
        }

        setFormData({
            name: '',
            email: '',
            password: '',
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Container>
            <Card style={{ boxShadow: '2px 2px 25px gray', backgroundColor: '' }} className="py-5 my-5">
                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={6}>
                        <h1 className="text-center mb-4 fw-bolder">Sign Up</h1>
                        <Form onSubmit={handleRegister} className='w-75 mx-auto'>
                            <Form.Label>Please Enter Your Name, Email & Password: </Form.Label>
                            <Form.Group controlId="formName" className='my-3'>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Name"
                                    required
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formEmail" className='my-3       '>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter Email"
                                    required
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formPassword" className='my-3        '>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter Password"
                                    required
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Button type="submit" variant="primary" className="w-100">
                                Register
                            </Button>
                        </Form>
                        <Row className='mt-4 mb-2'>
                            <Col className="d-flex align-items-center justify-content-center">
                                <p className="m-0">Already have an account?</p>
                                <Link to="/signin" className="text-decoration-none ms-2">
                                    Sign In
                                </Link>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card>

        </Container>
    );
};

export default SignUp;

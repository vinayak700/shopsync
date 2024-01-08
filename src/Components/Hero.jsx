import React from 'react';
import { Container} from 'react-bootstrap';

const Hero = () => {
    return (
        <Container className="text-center mb-5">
            <img
                className="d-block mx-auto mb-1"
                src="https://img.freepik.com/free-photo/arrangement-black-friday-shopping-carts-with-copy-space_23-2148667047.jpg?w=1060&t=st=1703174091~exp=1703174691~hmac=cdf80dd8e90439986d42a2059f6caf5939666ccbb9b2c69be704c85e872eaad5"
                alt=""
                width="85%"
                height="20%"
                style={{ backgroundAttachment: 'fixed', backgroundRepeat: 'no-repeat', position: 'absolute', backgroundSize: 'contain', zIndex: -1 }}
            />
            <h1 className="display-5 fw-bold text-body-secondary pb-5 pt-3 mb-5">New Arrivals</h1>
        </Container>
    );
};

export default Hero;

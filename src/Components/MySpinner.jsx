import React from 'react'
import Spinner from 'react-spinner-material';

const MySpinner = () => {
    return (
        <div>
            <Spinner radius={60} color={"#333"} stroke={2} visible={true} />
        </div>
    );
}

export default MySpinner;
import React from 'react';
import PropType from 'prop-types';

import './Loading.css';

const Loading = (props) => {
    const { size } = props;
    return <div className={`loading ${size ? size : 'large'}`} />;
}

Loading.defaultProps = {
  size: 'large'
};

Loading.propTypes = {
    size: PropType.string,
}

export default Loading;
import React from "react";
import "./Preloader.scss";

import Icon from "@containers/Icons";

const Preloader = () => {
	return (
		<div className='appPreloader'>
			<Icon name='preloader' />
		</div>
	);
};

export default Preloader;

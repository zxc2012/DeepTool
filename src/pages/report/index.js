import React from 'react';
import './index.less';


class Report extends React.Component {

    state = {
        reportInfo: null,
        detailsIsVisible: false,
    };


    viewDetails = () => this.setState({ detailsIsVisible: true });

    componentWillMount() {
    }

    render() {
        return (
            <div>
                <br />
                &emsp; &emsp;&emsp;&emsp;
                正在开发中，敬请期待
            </div>
        );
    }
}

export default Report;
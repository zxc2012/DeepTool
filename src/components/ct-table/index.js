import React from 'react';
import { Upload, Icon, Modal, Button } from 'antd';
import './index.less';

class UploadCTTable extends React.Component {

    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [
            {
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },

        ],
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = ({ fileList }) => this.setState({ fileList });


    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
                <a href="www.baidu.com">去标注</a>
            </div>
        );
    }
}



function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class MarkCTTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            canvasURL: [],
            isDraw: false,
            locationArr: [],
        };
    }


    recallClick = () => {
        const { canvas, canvasURL } = this.state;
        let ctx = canvas.getContext('2d');
        let step = canvasURL.length - 1;
        if (step >= 0) {
            step--;
            ctx.clearRect(0, 0, 1000, 1000);
            let canvasPic = new Image();
            canvasPic.src = canvasURL[step];
            canvasPic.addEventListener('load', () => {
                ctx.drawImage(canvasPic, 0, 0);
            });
            canvasURL.pop()
            this.setState({
                canvasURL
            })
        } else {
            console.log('不能再继续撤销了');
        }
    }

    mouseEvent = (e) => {
        const { canvas, isDraw, locationArr } = this.state;
        let ctx = canvas.getContext('2d');

        e.persist();

        let canvasContext = document.getElementsByClassName('ant-modal')[0];

        if (e.type === 'mousedown') {
            locationArr.push([e.clientX - canvas.offsetLeft - canvasContext.offsetLeft, e.clientY - canvas.offsetTop - canvasContext.offsetTop]);
            this.setState({
                isDraw: true,
                locationArr: [],
            });
            return;
        }


        if (e.type === 'mousemove' && isDraw) {
            locationArr.push([e.clientX - canvas.offsetLeft - canvasContext.offsetLeft, e.clientY - canvas.offsetTop - canvasContext.offsetTop]);

            let left = locationArr[0][0];
            let top = locationArr[0][1];
            let prewidth = locationArr.length > 1 && locationArr[locationArr.length - 2][0] - left;
            let preheight = locationArr.length > 1 && locationArr[locationArr.length - 2][1] - top;
            let width = locationArr[locationArr.length - 1][0] - left;
            let height = locationArr[locationArr.length - 1][1] - top;
            console.log("left = ", left, " top = ", top, " prewidth = ", prewidth, "preheight = ", preheight, " width = ", width, " height = ", height);
            ctx.beginPath();
            ctx.lineWidth = "6";
            ctx.strokeStyle = "red";
            ctx.clearRect(left, top, prewidth, preheight);
            ctx.strokeRect(left, top, width, height);

        }
        if (e.type === 'mouseup') {
            let { canvasURL, canvas } = this.state;
            canvasURL.push(canvas.toDataURL());
            this.setState({
                canvasURL,
                isDraw: false
            });
        }

    }

    componentDidMount() {
        this.setState({
            canvas: document.querySelector(`#canvas`)
        });
    }

    render() {
        return (
            <div className="paint-box">
                <canvas
                    id="canvas"
                    width={750}
                    height={350}
                    onMouseDown={this.mouseEvent}
                    onMouseMove={this.mouseEvent}
                    onMouseUp={this.mouseEvent}
                    className="mark-ct"
                ></canvas>
                <Button icon="rollback" onClick={() => this.recallClick()}>撤销</Button>
            </div>
        )
    }
}

export {
    UploadCTTable,
    MarkCTTable,
};
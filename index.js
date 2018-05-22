import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { DatePicker } from 'antd';
import { List, Card } from 'antd';
import { Carousel } from 'antd';
import { Avatar } from 'antd';
const { Meta } = Card;
import { Tag } from 'antd';
import { Row, Modal, Col } from 'antd';
import { Router, Route, Link, hashHistory } from 'react-router';
import { Form, InputNumber, Input, Button, Checkbox } from 'antd';
const { TextArea } = Input;
const FormItem = Form.Item;
const data = [
  {
    title: 'Title 1',
  },
  {
    title: 'Title 2',
  },
  {
    title: 'Title 3',
  },
  {
    title: 'Title 4',
  },
  {
    title: 'Title 5',
  }
];


class IndexPage extends React.Component {
  state = { visible: false }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  render() {
    return (
      <div>
        <div>
          <div>
            <Row className="lottery_header">
              <Col span={6} className="lottery_header_item"><img className="lottery_header_img" src="https://nebulas.io/assets/images/nebulasx60.png" /></Col>
              <Col span={8} offset={2} className="lottery_header_item"><center>去中心化抽奖系统</center></Col>
              <Col span={4} offset={4} className="lottery_header_item"><Button onClick={this.showModal} type="primary">发起抽奖</Button></Col>
            </Row>
            <AddFormDialog visable={this.state.visible} />
          </div>
          <Carousel autoplay className="lottery_pics">
            <img src="imgs/page1.png" />
            <img src="imgs/page1.png" />
          </Carousel>
        </div>
        <Row>
          <Col className="lottery_title" span={24}>正在进行的抽奖</Col>
        </Row>
        <div className="lottery_content">
          <List
            grid={{ gutter: 20, xs: 3 }}
            dataSource={data}
            renderItem={item => (
              <List.Item>
                <Link to="/lottery/1">
                  <div className="events-box">
                    <div className="card-img">
                      <img src="https://nebulas.io/assets/images/events/consensus-2018.jpg" />
                    </div>
                    <div className="text-content">
                      <Tag style={{ marginBottom: 16 }} color="#f50">未开奖</Tag>
                      <p ><strong>这是抽奖的标题</strong></p>
                      <p >机械键盘*1 机械键盘*2</p>
                      <p >n1JeGQzges7KXzeMqP1u26izTqRVuhPsWTc</p>
                    </div>
                  </div>
                </Link>
              </List.Item>
            )}
          />
        </div>
        <div className="lottery_footer">
          <div className="container">
            <Row type="flex" justify="center">
            </Row>
          </div>
        </div>
      </div>
    )
  }
}


class AddForm extends React.Component {
  state = {
    visable: false
  }
  onCancel = () => {
    this.setState({
      visable: false
    })
  }
  componentWillReceiveProps(newProps) {
    this.setState({ visable: newProps.visable });
  }
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        title="发起抽奖活动"
        visible={this.state.visable}
        onCancel={this.onCancel}
        footer={[]}
      >
        <FormItem
          label="抽奖标题" wrapperCol={{ span: 18 }} labelCol={{ span: 4 }}
        >
          {getFieldDecorator('title', {
            rules: [{
              type: 'email', message: '请输入抽奖标题',
            }, {
              required: true, message: '请输入抽奖标题',
            }],
          })(
            <Input placeholder="请输入抽奖标题" />
          )}
        </FormItem>
        <FormItem label="描述" wrapperCol={{ span: 18 }} labelCol={{ span: 4 }} >
          {getFieldDecorator('username', {
            rules: [{
              required: true,
              message: '请输入描述',
            }],
          })(
            <TextArea placeholder="请输入描述" rows={4} />
          )}
        </FormItem>
        <FormItem label="奖品" labelCol={{ span: 4 }}>
          {getFieldDecorator('nickname', {
            rules: [{
              required: true,
              message: '请输入奖品',
            }],
          })(
            <Row>
              <Col span={10}>
                <Input placeholder="奖品名称" />
              </Col>
              <Col span={7} offset={1}>
                数量：<InputNumber min={1} />
              </Col>
            </Row>
          )}
        </FormItem>
        <FormItem wrapperCol={{ offset: 4 }} >
          <Button type="primary" onClick={this.check}>
            提交
          </Button>
        </FormItem>
      </Modal>
    );
  }
}
const AddFormDialog = Form.create()(AddForm);


class DetailPage extends React.Component {
  render() {
    return (
      <div>
        <div>
          <div>
            <Row className="lottery_header">
              <Col span={6} className="lottery_header_item"><img className="lottery_header_img" src="https://nebulas.io/assets/images/nebulasx60.png" /></Col>
              <Col span={8} offset={2} className="lottery_header_item"><center>去中心化抽奖系统</center></Col>
            </Row>
            <AddFormDialog />
          </div>
          <Row style={{ marginTop: 50, marginBottom: 50 }}>
            <Col span={6} />
            <Col span={12} className="lottery_detail_content">
              <center><h1>抽奖标题</h1></center>
              <h2>抽奖描述</h2>
              <p>这是一段抽奖描述</p>
              <h2>奖品</h2>
              <p>书*1</p>
              <h2>抽奖状态</h2>
              <p><Tag color="red">进行中</Tag></p>
              <h2>发起人</h2>
              <p>这是一段抽奖描述</p>
              <h2>参与人</h2>
              <ul>
                <li>书*1</li>
                <li>书*1</li>
                <li>书*1</li>
              </ul>
              <Button type="primary">参与抽奖</Button>
            </Col >
            <Col span={6} />
          </Row>
        </div>
      </div>
    )
  }
}


ReactDOM.render((<Router history={hashHistory}>
  <Route path="/" component={IndexPage} />
  <Route path="/lottery/:id" component={DetailPage} />
</Router>)
  , document.getElementById('root'))


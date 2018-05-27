import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { DatePicker } from 'antd';
import { List, Card } from 'antd';
import { Carousel } from 'antd';
import { Avatar } from 'antd';
const { Meta } = Card;
import { Tag, message } from 'antd';
import { Row, Modal, Col } from 'antd';
import { Router, Route, Link, hashHistory } from 'react-router';
import { Form, InputNumber, Input, Button, Checkbox } from 'antd';
const { TextArea } = Input;
const FormItem = Form.Item;
var NebPay = require("nebpay");
var Nebulas = require('nebulas')
//合约地址：n22efHoRF4V4bf8q3U23K1yzga1onfQsoJm
//交易地址：01a4fba357bcf03bfc4b76a9c1a98dd5e17f3bab8e8ee6081033cae024a5f22b
//钱包地址：n1JaALxEwFH8d1hZbLADButrYsH9L7BXGwZ

var nebPay = new NebPay();
var neb = new Nebulas.Neb(new Nebulas.HttpRequest("https://testnet.nebulas.io"));
var Account = Nebulas.Account;
const dappAddress = "n22efHoRF4V4bf8q3U23K1yzga1onfQsoJm"

var listData = [];
function getPlanList() {
  var from = "n1JaALxEwFH8d1hZbLADButrYsH9L7BXGwZ"
  var value = "0";
  var nonce = "0"
  var gas_price = "1000000"
  var gas_limit = "2000000"
  var callFunction = "getLotterys";
  var contract = {
    "function": callFunction,
    "args": "\[\]"
  }
  neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then((resp) => {
    var result = JSON.parse(resp['result']);
    listData = result['lotteries'];
  });
}

function addLottery(title, desc, award, awardCount, callback) {
  var value = "0";
  var callFunction = "addLottery"
  var callArgs = "[\"" + title + "\",\"" + desc + "\",\"" + award + "\"," + awardCount + "]"
  console.log(callArgs)
  nebPay.call(dappAddress, value, callFunction, callArgs, {
    listener: callback
  });
}

class IndexPage extends React.Component {
  state = { visible: false }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  render() {
    getPlanList()
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
            dataSource={listData}
            renderItem={item => (
              <List.Item>
                <Link to='/lottery/1'>
                  <div className="events-box">
                    <div className="card-img">
                      <img src="https://nebulas.io/assets/images/events/consensus-2018.jpg" />
                    </div>
                    <div className="text-content">
                      <Tag style={{ marginBottom: 16 }} color="#f50">
                        {item['state'] == 'ing' &&
                          '进行中'
                        }
                        {item['state'] == 'finished' &&
                          '已结束'
                        }
                      </Tag>
                      <p ><strong>{item['title']}</strong></p>
                      <p >{item['award'] + ' * ' + item['awardCount']}</p>
                      <p >{item['starter']}</p>
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

  submitCallback = (resp) => {
    var intervalQuery = setInterval(() => {
      this.setState({ visible: false });
      neb.api.getTransactionReceipt({ hash: resp["txhash"] }).then((receipt) => {
        if (receipt["status"] === 2) {
          message.warning('交易中，请稍后...', 2);
        } else if (receipt["status"] === 1) {
          message.success('交易成功!!!');
          clearInterval(intervalQuery)
        } else {
          message.error('交易失败!!!');
          clearInterval(intervalQuery)
        }
      });
    }, 3000);
  }

  handleSubmit = () => {
    var title = this.props.form.getFieldValue('title')
    var desc = this.props.form.getFieldValue('desc')
    var award = this.props.form.getFieldValue('award')
    var awardCount = this.props.form.getFieldValue('awardCount')
    addLottery(title, desc, award, awardCount, this.submitCallback)
    this.setState({
      visable: false
    })
  }

  onCancel = () => {
    this.setState({
      visable: false
    })
  }

  componentWillReceiveProps(newProps) {
    console.log('newProps:' + newProps.visable)
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
              message: '请输入抽奖标题',
            }, {
              required: true, message: '请输入抽奖标题',
            }],
          })(
            <Input placeholder="请输入抽奖标题" />
          )}
        </FormItem>
        <FormItem label="描述" wrapperCol={{ span: 18 }} labelCol={{ span: 4 }} >
          {getFieldDecorator('desc', {
            rules: [{
              required: true,
              message: '请输入描述',
            }],
          })(
            <TextArea placeholder="请输入描述" rows={4} />
          )}
        </FormItem>
        <FormItem label="奖品" wrapperCol={{ span: 18 }} labelCol={{ span: 4 }}>
          {getFieldDecorator('award', {
            rules: [{
              required: true,
              message: '请输入奖品',
            }],
          })(<Input placeholder="奖品名称" />)}
        </FormItem>
        <FormItem label="奖品数量" labelCol={{ span: 4 }}>
          {getFieldDecorator('awardCount', {
            rules: [{
              required: true,
              message: '请输入奖品数量',
            }],
          })(<InputNumber min={1} />)}
        </FormItem>
        <FormItem wrapperCol={{ offset: 4 }} >
          <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>
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


import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { DatePicker } from 'antd';
import { List, Card } from 'antd';
import { Carousel } from 'antd';
import { Icon, Avatar } from 'antd';
const { Meta } = Card;
import { Tag } from 'antd';

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
import { Row, Col } from 'antd';

ReactDOM.render(
  <div>
    <div>
      <div className="lottery_header">
        <img src="https://nebulas.io/assets/images/nebulasx60.png" />
      </div>
      <Carousel autoplay >
        <img src="imgs/page1.png" />
        <img src="imgs/page1.png" />
      </Carousel>
    </div>
    <Row>
      <Col className="lottery_title" span={24}>正在进行的抽奖</Col>
    </Row>
    <div className="lottery_footer">
      <div class="container">
        <Row type="flex" justify="center">
        </Row>
      </div>
    </div>
  </div>
  , document.getElementById('root'));


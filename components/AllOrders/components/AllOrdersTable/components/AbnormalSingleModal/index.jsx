import React, { useState, useEffect } from 'react';
import { Modal, Form, Spin, Input, Message } from 'antd';
import { connect } from 'dva';
const { TextArea } = Input;

const mapStateToProps = state => ({});
export default connect(mapStateToProps)(props => {
  const { dispatch, setModalVisible, visible, insureNum, refreshData } = props;
  // 表单实例
  const [form] = Form.useForm();
  // 加载动画
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    form.resetFields();
  }, [visible]);

  // 确定按钮
  const handleOk = () => {
    form.validateFields().then(response => {
      if (dispatch) {
        setLoading(true);
        dispatch({
          type: 'order/exception',
          payload: {
            insureNum: insureNum.current === undefined ? insureNum : insureNum.current,
            comment: response.reason,
            lockState: 4,
          },
          callback: res => {
            setLoading(false);
            if (res.code === 200) {
              Message.info('操作成功');
              setModalVisible(false);
              // 刷新数据
              if (refreshData) {
                refreshData();
              }
            } else {
              Message.error(res.msg);
            }
          },
        });
      }
    });
  };
  // 取消按钮
  const handleCancel = () => {
    if (dispatch) {
      setLoading(true);
      dispatch({
        type: 'order/inureLockEnd',
        payload: {
          insureNum: insureNum.current === undefined ? insureNum : insureNum.current,
          comment: '',
          lockState: 4,
        },
        callback: res => {
          setLoading(false);
          if (res.code === 200) {
            Message.info('放弃处理操作成功');
            setModalVisible(false);
            // 刷新数据
            if (refreshData) {
              refreshData();
            }
          } else {
            Message.error(res.msg);
          }
        },
      });
    }
  };

  return (
    <Modal
      title="打入异常单"
      visible={visible}
      onOk={handleOk}
      okText="打入异常单"
      onCancel={handleCancel}
      maskClosable={false}
      okButtonProps={{ disabled: loading }}
    >
      <Spin spinning={loading}>
        <Form form={form} onSubmitCapture={handleOk}>
          <Form.Item
            name="reason"
            label="异常单原因"
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 5 }}
            rules={[{ required: true, message: '异常单原因为必选项' }]}
          >
            <TextArea rows={3} placeholder="请填写该单为异常单原因" allowClear />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
});

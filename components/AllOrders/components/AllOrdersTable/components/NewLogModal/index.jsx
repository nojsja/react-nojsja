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
          type: 'order/addInsureLog',
          payload: {
            insureNum: insureNum.current,
            operateDesc: response.log,
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
    setModalVisible(false);
  };

  return (
    <Modal
      title="新增日志"
      visible={visible}
      onOk={handleOk}
      okText="提交日志"
      onCancel={handleCancel}
      maskClosable={false}
      okButtonProps={{ disabled: loading }}
    >
      <Spin spinning={loading}>
        <Form form={form} onSubmitCapture={handleOk}>
          <Form.Item
            name="log"
            label="日志描述"
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 5 }}
            rules={[{ required: true, message: '日志描述为必选项' }]}
          >
            <TextArea rows={3} placeholder="请输入日志描述" allowClear />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
});

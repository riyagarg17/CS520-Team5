import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Alert } from 'antd';
import { SafetyOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

const MFAVerification = ({ email, onComplete, tempToken }) => {
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const [form] = Form.useForm();

  const startResendCountdown = () => {
    setResendDisabled(true);
    setCountdown(30);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      await axios.post('http://127.0.0.1:8080/resend-mfa', { email });
      message.success('New code sent successfully');
      startResendCountdown();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    setError(''); // Clear any previous errors
    try {
      console.log('Attempting to verify code:', values.code);
      const response = await axios.post('http://127.0.0.1:8080/verify-mfa', {
        email,
        otp: values.code,
        tempToken
      });
      
      if (response.data.token) {
        message.success('Verification successful');
        onComplete(response.data.user);
      }
    } catch (error) {
      console.error('MFA verification error:', error);
      console.error('Error response:', error.response);
      
      // Determine error message based on status code
      let errorMessage = 'Invalid verification code';
      if (error.response?.status === 401) {
        errorMessage = 'Invalid or expired verification code. Please try again.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Please enter a valid 6-digit code.';
      }
      
      // Set error state
      setError(errorMessage);
      
      // Show error in form
      form.setFields([
        {
          name: 'code',
          errors: [errorMessage],
        },
      ]);
      
      // Clear the form field on error
      form.resetFields(['code']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
          Verify Your Email
        </Title>
        <Text style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}>
          We've sent a verification code to {email}
        </Text>
        
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}
        
        <Form
          form={form}
          name="mfa-verification"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="code"
            rules={[
              { required: true, message: 'Please input the verification code!' },
              { len: 6, message: 'Code must be 6 digits!' }
            ]}
          >
            <Input
              prefix={<SafetyOutlined />}
              placeholder="Enter 6-digit code"
              size="large"
              maxLength={6}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{ 
                background: '#1890ff',
                height: '40px',
                fontSize: '16px',
                marginBottom: 16
              }}
            >
              Verify
            </Button>
            <Button
              onClick={handleResendCode}
              disabled={resendDisabled}
              block
              size="large"
            >
              {resendDisabled ? `Resend code in ${countdown}s` : 'Resend code'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default MFAVerification; 
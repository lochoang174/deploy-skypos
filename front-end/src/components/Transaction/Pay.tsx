import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  notification,
  Input,
  Button,
  Card,
  List,
  Avatar,
  Typography,
  Divider,
} from "antd";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import { useAuth } from "../../hooks/useAuth";
import { resestInformation } from "../../redux/slices/cartSlice";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const { Title, Text } = Typography;
interface Pros {
  backToFirstStep: () => void;
}
const Pay = ({ backToFirstStep }: Pros) => {
  const [amountPaid, setAmountPaid] = useState("");
  const [change, setChange] = useState(0);
  const [isPaymentEnabled, setIsPaymentEnabled] = useState(false);
  const { auth } = useAuth();
  const { items, total, customer } = useAppSelector((state) => state.cart);
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const axios = usePrivateAxios();
  const dispatch = useAppDispatch();
  const openNotification = () => {
    api.open({
      message: "Transaction success!",
      description: "Transaction success!",
      // icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    });
  };
  const base_url = import.meta.env.VITE_BE_URL + "/public/images/";
  const calculateChange = () => {
    const paid = parseFloat(amountPaid);
    if (!isNaN(paid) && paid >= total) {
      setChange(paid - total);
      if(items.length>0){
        setIsPaymentEnabled(true);

      }
    } else {
      setChange(0);
      setIsPaymentEnabled(false);
    }
  };
  const generatePDF = async () => {
    const receiptContent = document.getElementById('receipt-content');
    if (!receiptContent) return;

    const canvas = await html2canvas(receiptContent);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth+20) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('transaction-receipt.pdf');
  };
  const handleTransaction = async () => {
    setLoading(true);
    const bodayRequest = {
      staffId: auth!._id,
      phoneNumber: customer.phoneNumber,
      transactionInfo: {
        customerName: customer.fullName,
        customerAddress: customer.address,
        customerEmail: customer.email,
        productTransactions: items.map((item) => ({
          variantId: item.variant._id,
          quantity: item.quantity,
        })),
      },
      amountPaid: parseFloat(amountPaid),
    };
    axios
      .post("transaction/transactionProcessing", {
        ...bodayRequest,
      })
      .then((res) => {
        openNotification();
        generatePDF();
        dispatch(resestInformation());
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="max-w-6xl mx-auto p-4">
      {contextHolder}

      <div id="receipt-content">
        <div className="flex flex-col md:flex-row gap-4">
          <Card className="flex-1">
            <Title level={3}>Customer information</Title>
            <div>
              <div>
                <Text strong>Name:</Text> {customer.fullName}
              </div>
              <div>
                <Text strong>Phone Number:</Text> {customer.phoneNumber}
              </div>
              <div>
                <Text strong>Email:</Text> {customer.email}
              </div>
              <div>
                <Text strong>Address:</Text> {customer.address}
              </div>
            </div>
          </Card>

          <Card className="flex-1">
            <Title level={4}>Total: {total} VND</Title>
            <div className="mb-4">
              <Text>Amount paid by customer:</Text>
              <Input
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className="mt-1"
                style={{ height: '40px' }}  // Thêm style này để tăng chiều cao

              />
            </div>
            <Button onClick={calculateChange} type="primary" className="mb-4">
              Calculate Change
            </Button>
            {change > 0 && (
              <div className="mb-4">
                <Text strong>Change: {change} VND</Text>
              </div>
            )}
            <Button
              disabled={!isPaymentEnabled }
              type="primary"
              size="large"
              block
              onClick={handleTransaction}
            >
              Pay
            </Button>
          </Card>
        </div>

        <Card className="mt-4">
          <Title level={3}>List of products</Title>
          <List
            itemLayout="horizontal"
            dataSource={items}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      shape="square"
                      size={64}
                      src={`${base_url}${item.variant.Product._id}/${item.variant._id}/${item.variant.images[0]}`}
                    />
                  }
                  title={item.variant.Product.productName}
                  description={
                    <div>
                      <Text>Số lượng: {item.quantity}</Text>
                      <br />
                      <Text>
                        Giá: {item.variant.retailPrice * item.quantity} VND
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
          <Divider />
        </Card>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          type="primary"
          onClick={() => {
            backToFirstStep();
          }}
        >
          Back To First Step
        </Button>
        <Button
          type="primary"
          onClick={generatePDF}
        >
          Print Receipt
        </Button>
      </div>
    </div>
  );
};

export default Pay;

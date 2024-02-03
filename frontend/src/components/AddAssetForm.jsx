import { Button, DatePicker, Divider, Form, InputNumber, Result, Select, Space } from "antd";
import { useRef, useState } from "react"
import { useCrypto } from "../context/crypto-context";
import CoinInfo from "./CoinInfo";

export default function AddAssetForm({onClose}) {
    const [form] = Form.useForm();
    const { crypto, addAsset } = useCrypto();
    const [coin, setCoin] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const assetRef = useRef();

    function handleSelect(value) {
		setCoin(crypto.find(c => c.id === value));
	};

    const onFinish = (values) => {
        const newAsset = {
            id: coin.id,
            amount: values.amount,
            price: values.price,
            date: values.date?.$d ?? new Date()
        };

        assetRef.current = newAsset;
        setIsSubmitted(true);
        addAsset(newAsset);
    };

    function handleAmountChange(value) {
        const price = form.getFieldValue('price');
        form.setFieldsValue({
            total: +(value * price).toFixed(2)
        })
    }

    function handlePriceChange(value) {
        const amount = form.getFieldValue('amount');
        form.setFieldsValue({
            price: +(value * amount).toFixed(2)
        })
    }

    const validateMessages = {
        required: "${label} is required!",
        types: {
            number: "${label} is not a valid number"
        },
        number: {
            range: "${label} must be from ${min} to ${max}"
        }
    }

    if(isSubmitted){
        return (
            <Result
                status="success"
                title="Successfully Added New Asset"
                subTitle={`Added ${assetRef.current.amount} of ${coin.name} by price ${assetRef.current.price}`}
                extra={[
                    <Button type="primary" key="console" onClick={onClose}>
                        Close
                    </Button>,
                ]}
            />
        )
    }

    if(!coin){
        return (
            <Select
				style={{
					width: '100%',
				}}
				onSelect={handleSelect}
				placeholder='Select coin'
				options={crypto.map(coin => ({
					label: coin.name,
					value: coin.id,
					icon: coin.icon
				}))}
				optionRender={(option) => (
					<Space>
						<img style={{width: 20}} src={option.data.icon} alt={option.data.id} /> {option.data.label}
					</Space>
				)}
            />
        )
    }

    return (
        <Form
            form={form}
            name="basic"
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 16,
            }}
            style={{
                maxWidth: 700,
            }}
            initialValues={{
                price: +coin.price.toFixed(2),
            }}
            onFinish={onFinish}
            validateMessages={validateMessages}
        >
            <CoinInfo coin={coin}/>
            <Divider/>
        
            <Form.Item
                label="Amount"
                name="amount"
                rules={[
                    {
                        required: true,
                        type: 'number',
                        min: 0,
                    },
                ]}
            >
                <InputNumber onChange={handleAmountChange} placeholder="Enter amount of coins" style={{width: '100%'}} />
            </Form.Item>

            <Form.Item 
                label="Price" 
                name="price" 
                rules={[
                    {
                        required: true,
                        type: 'number',
                        min: 0,
                    },
                ]}
            >
                <InputNumber onChange={handlePriceChange} style={{width: '100%'}} />
            </Form.Item>

            <Form.Item label="Date & Time" name="date" >
                <DatePicker showTime style={{width: '100%'}} />
            </Form.Item>

            <Form.Item label="Total" name="total" >
                <InputNumber disabled style={{width: '100%'}} />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Add
                </Button>
            </Form.Item>
        </Form>
    )
}
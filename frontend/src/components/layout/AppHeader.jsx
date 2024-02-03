import { Button, Drawer, Modal, Select, Space } from "antd";
import { Header } from "antd/es/layout/layout";
import { useCrypto } from "../../context/crypto-context";
import { useEffect, useState } from "react";
import CoinInfoModal from "../CoinInfoModal";
import AddAssetForm from "../AddAssetForm";

const headerStyle = {
    textAlign: 'center',
    height: 60,
    width: '100%',
    padding: '1rem',
    display: 'flex',
    // backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'center'
};

export default function AppHeader() {
	const [select, setSelect] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [coin, setCoin] = useState(null);
	const { crypto } = useCrypto();

	useEffect(() => {
		const keypress = event => {
			if(event.key  === '/'){
				setSelect(prev => !prev);
			}
		};

		document.addEventListener('keypress', keypress)

		return () => document.removeEventListener('keypress', keypress)
	}, []);

    function handleSelect(value) {
		setCoin(crypto.find(c => c.id === value))
		setIsModalOpen(true);
	};

    return (
        <Header style={headerStyle}>
            <Select
				style={{
					width: 250,
				}}
				onSelect={handleSelect}
				onClick={() => setSelect(prev => !prev)}
				open={select}
				value='Press / to open'
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

			<Button onClick={() => setIsDrawerOpen(true)} type="primary">Add Asset</Button>

			<Drawer destroyOnClose title="Add Asset" onClose={() => setIsDrawerOpen(false)} open={isDrawerOpen}>
				<AddAssetForm onClose={() => setIsDrawerOpen(false)}/>
			</Drawer>

			<Modal 
				open={isModalOpen} 
				onCancel={() => setIsModalOpen(false)}
				footer={null}
			>
				<CoinInfoModal coin={coin}/>
			</Modal>
        </Header>
    )
}
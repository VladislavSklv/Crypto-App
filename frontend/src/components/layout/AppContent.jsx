import { Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import { useCrypto } from '../../context/crypto-context';
import PortfolioChart from "../PortfolioChart";
import AssetsTable from "../AssetsTable";

const contentStyle = {
    textAlign: 'center',
    minHeight: 'calc(100vh - 60px)',
    color: '#fff',
    backgroundColor: '#001529',
    padding: '1rem'
};

export default function AppContent() {
    const {assets, crypto} = useCrypto();

    const cryptoPriceMap = crypto.reduce((acc, v) => {
        acc[v.id] = v.price;
        return acc
    }, {});

    return (
        <Content style={contentStyle}>
            <Typography.Title style={{textAlign: 'left', color: '#fff'}} level={3}>
                Portfolio:{' '}
                {assets
                    .map(asset => (asset.amount * cryptoPriceMap[asset.id]))
                    .reduce((acc, v) => (acc += v), 0)
                    .toFixed(2)}$
            </Typography.Title>
            <PortfolioChart/>
            <AssetsTable/>
        </Content>
    );
}
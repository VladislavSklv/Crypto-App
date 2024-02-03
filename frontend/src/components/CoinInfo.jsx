import { Flex, Typography } from "antd";

export default function CoinInfo({coin, withSymbol}){
    return (
        <Flex style={{marginTop: 10}} align="center">
            <img src={coin.icon} alt={coin.id} style={{width: 40, marginRight: 10}}/>
            <Typography.Title style={{margin: 0, marginRight: 10}} level={2}>{withSymbol && '(' + coin.symbol + ')'} {coin.name}</Typography.Title>
        </Flex>
    )
}
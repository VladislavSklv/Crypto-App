import { createContext, useContext, useEffect, useState } from "react";
import { fakeFetchAssets, fakeFetchCrypto } from "../api";
import { percentDifference } from "../utils";

const CryptoContext = createContext({
    assets: [],
    crypto: [],
    loading: false,
});

export function CryptoContextProvider({children}) {
    const [isLoading, setIsLoading] = useState(false);
    const [crypto, setCrypto] = useState([]);
    const [assets, setAssets] = useState([]);

    function mapAssets(assetsResult, result){
        return assetsResult.map(asset => {
            const coin = result.find(c => c.id === asset.id);

            return {
                grow: asset.price < coin.price,
                growPercent: percentDifference(asset.price, coin.price),
                totalAmount: asset.amount * coin.price,
                totalProfit: asset.amount * coin.price - asset.amount * asset.price,
                name: coin.name,
                ...asset
            }
        })
    }

    useEffect(() => {
        async function preload() {
            setIsLoading(true);
            const {result} = await fakeFetchCrypto();
            const assetsResult = await fakeFetchAssets();

            setCrypto(result);
            setAssets(mapAssets(assetsResult, result));
            setIsLoading(false);
        }
        preload();
    }, []);

    function addAsset(newAsset){
        setAssets(prev => mapAssets([...prev, newAsset], crypto));
    }

    return <CryptoContext.Provider value={{loading: isLoading, crypto, assets, addAsset}}>{children}</CryptoContext.Provider>
}

export default CryptoContext;

export function useCrypto() {
    return useContext(CryptoContext);
}
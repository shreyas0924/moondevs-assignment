//@ts-nocheck
import { useContext } from 'react'
import BurnButtonBar from './components/BurnButtonBar'
import BurnStatsContainer from './components/BurnStatsContainer'
import { Context } from './context/ContextProvider'

export const BurnPage = () => {
  const { openChainSelector, setOpenChainSelector } = useChainSelector()
  const { chains: receiveChains, walletChain } = useWallet()
  const { setSuppliesChain, suppliesChain } = useAppSupplies(true)
  const { burnTransactions, setCoinData, setBurnTransactions, isOldToken } = useContext(Context)
  const { toastMsg, toastSev } = useAppToast()

  const ethersSigner = useEthersSigner({
    chainId: walletChain?.id ?? chainEnum.mainnet,
  })

  useEffect(() => {
    CoinGeckoApi.fetchCoinData()
      .then((data: any) => {
        //console.log("coin stats", data);
        setCoinData(data?.market_data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    if (!walletChain) return
    //console.log(suppliesChain);
    let isSubscribed = true
    // const newTokenAddress = fetchAddressForChain(
    //   walletChain?.id,
    //   isOldToken ? "oldToken" : "newToken"
    // );
    if (isSubscribed) setBurnTransactions([])
    const isTestnet = isChainTestnet(walletChain?.id)
    let _chainObjects: any[] = [mainnet, avalanche, fantom]
    if (isTestnet) _chainObjects = [sepolia, avalancheFuji, fantomTestnet]
    Promise.all(ChainScanner.fetchAllTxPromises(isTestnet))
      .then((results: any) => {
        //console.log(results, isTestnet);
        if (isSubscribed) {
          let new_chain_results: any[] = []
          results.forEach((results_a: any[], index: number) => {
            new_chain_results.push(
              results_a.map((tx: any) => ({
                ...tx,
                chain: _chainObjects[index],
              }))
            )
          })
          let res = new_chain_results.flat()
          console.log(res, isTestnet)
          res = ChainScanner.sortOnlyBurnTransactions(res)
          res = res.sort((a: any, b: any) => b.timeStamp - a.timeStamp)
          setBurnTransactions(res)
        }
      })
      .catch((err) => {
        console.log(err)
      })
    return () => {
      isSubscribed = false
    }
  }, [walletChain, isOldToken])

  return (
    <div>
      <DashboardLayoutStyled className='burnpage'>
        <div
          className='top_conatiner burnpage'
          style={{ alignItems: 'flex-start' }}
        >
          <div className='info_box filled'>
            <h1 className='title'>App TOKEN BURN</h1>
            <p className='description medium'></p>
            <BurnButtonBar />
          </div>
          <BurnStatsContainer />
        </div>
      </DashboardLayoutStyled>
      <TransactionTableStyled>
        <div className='header'>
          <p className='header_label'>Burn Transactions</p>
        </div>
        <BurnTxTable
          data={burnTransactions}
          priceUSD={coinData?.current_price?.usd}
        />
      </TransactionTableStyled>
      <ChainSelector
        title={'Switch Token Chain'}
        openChainSelector={openChainSelector}
        setOpenChainSelector={setOpenChainSelector}
        chains={receiveChains}
        selectedChain={suppliesChain}
        setSelectedChain={setSuppliesChain}
      />
      <AppToast
        position={{ vertical: 'bottom', horizontal: 'center' }}
        message={toastMsg}
        severity={toastSev}
      />
    </div>
  )
}

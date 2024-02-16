//@ts-nocheck
import React, { createContext, useContext, useState } from 'react'

const Context = createContext()

const Provider = ({ children }) => {
  const { supplies } = useWallet()
  const [burnAmount, setBurnAmount] = useState('')
  const [burnTransactions, setBurnTransactions] = useState<any[]>([])
  const [isOldToken, setIsOldToken] = useState(false)
  const [txButton, setTxButton] = useState<BurnTxProgress>(
    BurnTxProgress.default
  )
  const [txProgress, setTxProgress] = useState<boolean>(false)
  const [approveTxHash, setApproveTxHash] = useState<string | null>(null)
  const [burnTxHash, setBurnTxHash] = useState<string | null>(null)

  const [coinData, setCoinData] = useState<any>({})

  const tokenAddress = fetchAddressForChain(
    suppliesChain?.id,
    isOldToken ? 'oldToken' : 'newToken'
  )

  const statsSupplies = supplies
  const onChangeBurnAmount = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value == '') setBurnAmount('')
    if (isNaN(parseFloat(e.target.value))) return
    setBurnAmount(e.target.value)
  }

  const refetchTransactions = () => {
    Promise.all(
      ChainScanner.fetchAllTxPromises(isChainTestnet(walletChain?.id))
    )
      .then((results: any) => {
        //console.log(res);
        let res = results.flat()
        res = ChainScanner.sortOnlyBurnTransactions(res)
        res = res.sort((a: any, b: any) => b.timeStamp - a.timeStamp)
        setBurnTransactions(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <Context.Provider
      value={{
        burnAmount,
        setBurnAmount,
        burnTransactions,
        setBurnTransactions,
        isOldToken,
        setIsOldToken,
        txButton,
        setTxButton,
        txProgress,
        setTxProgress,
        approveTxHash,
        setApproveTxHash,
        burnTxHash,
        setBurnTxHash,
        coinData,
        setCoinData,
        tokenAddress,
        statsSupplies,
        onChangeBurnAmount,
        refetchTransactions,
      }}
    >
      {children}
    </Context.Provider>
  )
}

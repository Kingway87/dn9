'use client'
import styles from './page.module.css'
import Decimal from 'decimal.js'
import { useEffect, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  getIdoInfo,
  getContributeInfo,
  tokenClaim,
  contribution
} from '@/@utils/contracts_ido'
import { useEthersSigner } from '@/@utils/ethers'
import Button from '@/components/Button'

export default function Home() {
  const signer = useEthersSigner()

  // Start here
  const [tokenPrice, setTokenPrice] = useState<string>('-')
  const [totalTokenAllocation, setTotalTokenAllocation] = useState<string>('-')
  const [totalParticipants, setTotalParticipants] = useState<string>('-')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [contribute, setContribute] = useState<string>('0')
  const [expectedAllocation, setExpectedAllocation] = useState<string>('0')
  const [minContribution, setMinContribution] = useState<string>('0')
  const [maxContribution, setMaxContribution] = useState<string>('0')
  const [claimedTokens, setClaimedTokens] = useState<string>('0')
  const [totalRaise, setTotalRaise] = useState<string>('0')

  const [amount, setAmount] = useState<number>(0)
  const [isInsuranceChecked, setIsInsuranceChecked] = useState<boolean>(false)

  useEffect(() => {
    async function fetchIdoInfo() {
      const idoInfo = await getIdoInfo()

      if (!idoInfo) return

      setTokenPrice(idoInfo.tokenPrice)
      setTotalTokenAllocation(idoInfo.totalTokenAllocation)
      setTotalParticipants(idoInfo.totalParticipants)
      setStartDate(idoInfo.startDate)
      setEndDate(idoInfo.endDate)
      setMinContribution(idoInfo.minContribution)
      setMaxContribution(idoInfo.maxContribution)
      setTotalRaise(idoInfo.totalContributeAmount)
    }

    async function fetchContributeInfo() {
      if (signer) {
        const { contribute, expectedAllocation, claimedTokens } =
          await getContributeInfo(signer._address)
        setContribute(contribute)
        setExpectedAllocation(expectedAllocation)
        setClaimedTokens(claimedTokens)
      }
    }

    fetchIdoInfo()

    if (signer) {
      fetchContributeInfo()
    }

    const intervalId = setInterval(() => {
      fetchIdoInfo()
      if (signer) {
        fetchContributeInfo()
      }
    }, 60000) // 60 seconds

    return () => clearInterval(intervalId)
  }, [signer])

  async function handleClaim() {
    await tokenClaim()
  }

  const calculateInsurance = (
    amount: number,
    isInsuranceChecked: boolean
  ): number => {
    if (isInsuranceChecked && amount !== 0) {
      return (amount * 15) / 100
    }
    return 0
  }

  const handleContribute = () => {
    const insurance = calculateInsurance(amount, isInsuranceChecked)
    const total = new Decimal(amount).plus(insurance).toNumber()

    if (amount < Number(minContribution)) {
      alert(`Minimum contribution is ${minContribution} Caga`)
      return
    }

    if (amount > Number(maxContribution)) {
      alert(`Maximum contribution is ${maxContribution} Caga`)
      return
    }

    contribution(total, isInsuranceChecked)
  }

  return (
    <main className={styles.main}>
      <div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
      {!signer ? (
        <ConnectButton />
      ) : (
        <>
          <ConnectButton />
          <div className={styles.container}>
            <h2>Public Sales DN9</h2>
          </div>

          <div>
            <div>
              Raise: {totalRaise} /{' '}
              {Number(tokenPrice) * Number(totalTokenAllocation)} CAGA
            </div>
            <div>Token Price: {tokenPrice} CAGA</div>
            <div>Quantity: {totalTokenAllocation} DN9</div>
            <div>Participant: {totalParticipants}</div>
            <div>Start Date: {startDate}</div>
            <div>End Date: {endDate}</div>
            <div>You contributed: {contribute} CAGA</div>
            <div>Expected Allocation: {expectedAllocation} DN9</div>
          </div>

          {new Date() > new Date(startDate) &&
          new Date() < new Date(endDate) ? (
            <div>
              <div>Contribute Amount (CAGA)</div>

              <div>
                <input
                  type="number"
                  placeholder="Amount (Caga)"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>

              <div>
                <input
                  type="checkbox"
                  checked={isInsuranceChecked}
                  onChange={(e) => setIsInsuranceChecked(e.target.checked)}
                />
                Insurance: {calculateInsurance(amount, isInsuranceChecked)} CAGA
                (15% charge for 100% coverage)
              </div>

              <Button onClick={handleContribute}>Contribute</Button>
            </div>
          ) : new Date() > new Date(endDate) ? (
            'Sales end'
          ) : (
            'Sales not started yet'
          )}

          {new Date() > new Date(endDate) && Number(expectedAllocation) > 0 ? (
            <div>
              <h2>Claim token</h2>
              <div>Claimed: {claimedTokens} DN9</div>
              <Button
                onClick={handleClaim}
                disabled={claimedTokens === expectedAllocation}
              >
                {claimedTokens === expectedAllocation ? 'Fully Claim' : 'Claim'}
              </Button>
            </div>
          ) : null}
        </>
      )}
    </main>
  )
}

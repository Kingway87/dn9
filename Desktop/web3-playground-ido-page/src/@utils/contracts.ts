import { BigNumber, BigNumberish, Contract, providers } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { ERC20_ABI, ERC20_ADDRESS, STAKING_ABI, STAKING_ADDRESS } from './abi'
import { toast } from 'react-toastify'

export async function getTierName(
  signer: providers.JsonRpcSigner | undefined,
  address: string | undefined,
  stakingContractAddress = STAKING_ADDRESS,
  stakingAbi = STAKING_ABI
) {
  if (!signer || !address) return 0
  const stakingContract = new Contract(
    stakingContractAddress,
    stakingAbi,
    signer
  )
  const tierName = await stakingContract.getTier(address)
  return tierName
}

export async function getLockPeriod(
  signer: providers.JsonRpcSigner | undefined,
  stakingContractAddress = STAKING_ADDRESS,
  stakingAbi = STAKING_ABI
) {
  if (!signer) return 0
  const stakingContract = new Contract(
    stakingContractAddress,
    stakingAbi,
    signer
  )
  const lockPeriodInSecond = BigNumber.from(
    await stakingContract.lockPeriod()
  ).toString()
  return parseFloat(lockPeriodInSecond)
}

export async function balanceOf(
  signer: providers.JsonRpcSigner | undefined,
  address: string | undefined,
  tokenAddress = ERC20_ADDRESS,
  tokenAbi = ERC20_ABI
) {
  if (!signer || !address) return '0'
  const tokenContract = new Contract(tokenAddress, tokenAbi, signer)
  const balance = formatUnits(
    BigNumber.from(await tokenContract.balanceOf(address))
  )
  return balance
}

export async function getStakeBalance(
  signer: providers.JsonRpcSigner | undefined,
  address: string | undefined,
  stakingContractAddress = STAKING_ADDRESS,
  stakingAbi = STAKING_ABI
) {
  if (!signer || !address) return '0'
  const stakingContract = new Contract(
    stakingContractAddress,
    stakingAbi,
    signer
  )
  const stakeBalance = formatUnits(
    BigNumber.from(await stakingContract.getStakeBalance(address))
  )

  return stakeBalance
}

export async function getClaimable(
  signer: providers.JsonRpcSigner | undefined,
  address: string | undefined,
  stakingContractAddress = STAKING_ADDRESS,
  stakingAbi = STAKING_ABI
) {
  if (!signer || !address) return '0'
  const stakingContract = new Contract(
    stakingContractAddress,
    stakingAbi,
    signer
  )
  const claimable = formatUnits(
    BigNumber.from(await stakingContract.getClaimable(address))
  )

  return claimable
}

export async function claim(
  signer: providers.JsonRpcSigner | undefined,
  address: string | undefined,
  stakingContractAddress = STAKING_ADDRESS,
  stakingAbi = STAKING_ABI
) {
  if (!signer || !address) return 0
  try {
    const stakingContract = new Contract(
      stakingContractAddress,
      stakingAbi,
      signer
    )
    const claimTx = await stakingContract.claim()

    return claimTx
  } catch (e) {
    console.error('[claim] error=', e)
    toast.error('Claim transaction declined/failed')
  }
}

export async function getStakeHistory(
  signer: providers.JsonRpcSigner | undefined,
  address: string | undefined,
  stakingContractAddress = STAKING_ADDRESS,
  stakingAbi = STAKING_ABI
) {
  if (!signer || !address) return 0
  const stakingContract = new Contract(
    stakingContractAddress,
    stakingAbi,
    signer
  )
  const rawStakeHistory = await stakingContract.getStakeHistory(address)
  const stakeHistory = rawStakeHistory.map(
    (stake: { amount: any; timestamp: any }) => {
      return {
        type: 'Stake',
        amount: formatUnits(BigNumber.from(stake.amount)),
        timestamp: BigNumber.from(stake.timestamp)
      }
    }
  )
  // console.log('[stakeHistory Raw]', stakeHistory)
  return stakeHistory
}

export async function getUnstakeHistory(
  signer: providers.JsonRpcSigner | undefined,
  address: string | undefined,
  stakingContractAddress = STAKING_ADDRESS,
  stakingAbi = STAKING_ABI
) {
  if (!signer || !address) return 0
  const stakingContract = new Contract(
    stakingContractAddress,
    stakingAbi,
    signer
  )
  const rawUnstakeHistory = await stakingContract.getUnstakeHistory(address)
  const unstakeHistory = rawUnstakeHistory.map(
    (stake: { amount: any; timestamp: any }) => {
      return {
        type: 'Unstake',
        amount: formatUnits(BigNumber.from(stake.amount)),
        timestamp: BigNumber.from(stake.timestamp)
      }
    }
  )
  // console.log('[unstakeHistory Raw]', unstakeHistory)
  return unstakeHistory
}

export async function approveTokenSpending(
  signer: providers.JsonRpcSigner | undefined,
  amount: string,
  spenderAddress: string,
  tokenAddress = ERC20_ADDRESS,
  tokenAbi = ERC20_ABI
) {
  if (!signer) return
  const amountToApprove = parseUnits(amount, 'ether')
  const tokenContract = new Contract(tokenAddress, tokenAbi, signer)

  try {
    // Call the allowance function to check the current allowance granted
    const currentAllowance = await tokenContract.allowance(
      signer._address,
      spenderAddress
    )

    if (currentAllowance.lt(amountToApprove)) {
      const tx = await tokenContract.approve(spenderAddress, amountToApprove)
      const txReceipt = await tx.wait()

      console.log(
        '[approveTokenSpending] Approval successful! txReceipt=',
        txReceipt
      )
      if (txReceipt) toast.success('Approval transaction completed!')
      return txReceipt
    } else {
      console.log(
        '[approveTokenSpending] Already approved sufficient amount:',
        formatUnits(amountToApprove)
      )
      return true
    }
  } catch (error) {
    console.error(
      '[approveTokenSpending] Error approving token spending:',
      error
    )
    toast.error('Approval transaction declined/failed.')
  }
}

export async function stake(
  signer: providers.JsonRpcSigner | undefined,
  amountStaking: string,
  stakeAddress = STAKING_ADDRESS,
  stakeAbi = STAKING_ABI
) {
  if (!signer) return
  const amount = parseUnits(amountStaking, 'ether')
  const stakingContract = new Contract(stakeAddress, stakeAbi, signer)

  try {
    const tx = await stakingContract.stake(amount)
    const txReceipt = await tx.wait()
    console.log('[stake] txReceipt=', txReceipt)
    return txReceipt
  } catch (e) {
    console.error('[stake] error:', e)
    toast.error('Stake transaction declined/failed.')
  }
}

export async function unstake(
  signer: providers.JsonRpcSigner | undefined,
  amountUnstaking: string,
  stakeAddress = STAKING_ADDRESS,
  stakeAbi = STAKING_ABI
) {
  if (!signer) return
  const amount = parseUnits(amountUnstaking, 'ether')
  const stakingContract = new Contract(stakeAddress, stakeAbi, signer)
  try {
    const tx = await stakingContract.unstake(amount)
    const txReceipt = await tx.wait()
    console.log('[unstake] txReceipt=', txReceipt)
    return txReceipt
  } catch (e) {
    console.error('[unstake] error:', e)
    toast.error('Unstake transaction declined/failed')
  }
}

import {
  BigNumber,
  BigNumberish,
  Contract,
  providers,
  ethers,
  utils
} from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { IDO_SALES_ADDRESS, IDO_SALES_ABI } from './abi'

let provider: providers.Web3Provider | undefined

if (typeof window !== 'undefined') {
  provider = new ethers.providers.Web3Provider(window.ethereum)
}

// Get the signer that will be used to sign transactions
const signer = provider?.getSigner()

const contract = new Contract(IDO_SALES_ADDRESS, IDO_SALES_ABI, signer)

export async function getIdoInfo() {
  const [
    totalTokenAllocation,
    tokenPrice,
    totalParticipants,
    startDate,
    endDate,
    minContribution,
    maxContribution,
    totalContributeAmount
  ] = await Promise.all([
    contract.totalTokenAllocation(),
    contract.tokenPrice(),
    contract.totalParticipants(),
    contract.startDate(),
    contract.endDate(),
    contract.minContribution(),
    contract.maxContribution(),
    contract.totalContributeAmount()
  ])

  return {
    totalTokenAllocation: formatUnits(
      BigNumber.from(totalTokenAllocation).toString()
    ),
    tokenPrice: formatUnits(BigNumber.from(tokenPrice).toString()),
    totalParticipants: BigNumber.from(totalParticipants).toString(),
    startDate: new Date(
      BigNumber.from(startDate).toNumber() * 1000
    ).toUTCString(),
    endDate: new Date(BigNumber.from(endDate).toNumber() * 1000).toUTCString(),
    minContribution: formatUnits(BigNumber.from(minContribution).toString()),
    maxContribution: formatUnits(BigNumber.from(maxContribution).toString()),
    totalContributeAmount: formatUnits(
      BigNumber.from(totalContributeAmount).toString()
    )
  }
}

export async function getContributeInfo(address: string) {
  const [contribute, expectedAllocation, claimedTokens] = await Promise.all([
    contract.getContribution(address),
    contract.getExpectedAllocation(address),
    contract.claimedTokens(address)
  ])

  return {
    contribute: formatUnits(BigNumber.from(contribute[0]).toString()),
    expectedAllocation: formatUnits(
      BigNumber.from(expectedAllocation).toString()
    ),
    claimedTokens: formatUnits(BigNumber.from(claimedTokens[1]).toString())
  }
}

export async function contribution(amount: number, isCoverage: boolean) {
  return contract.contribution(isCoverage, {
    value: utils.parseEther(amount.toString())
  })
}

export async function tokenClaim() {
  return contract.claimTokens()
}

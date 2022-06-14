import { Box, Button, Text, Image, Alert, AlertIcon, CircularProgress, CircularProgressLabel, Skeleton, SkeletonText, Link } from '@chakra-ui/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { InjectedConnector } from '@web3-react/injected-connector';
import { Injected } from '../injected/connector';
import { useWeb3React } from "@web3-react/core";
import ABI from '../abi/abi';
import web3 from "web3";


export default function Collection() {

  const { active, account, library, activate, deactivate } = useWeb3React()

  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [isLoading, setLoading] = useState(false);
  const [balance, setBalance] = useState();
  const [contract, setContract] = useState();

  const address = "0x113b7C63E2E2eeB896B74403b5F800B06F5A9377";
  const baseurl = "https://cool-snowman-nfts.infura-ipfs.io/ipfs/QmWM7kfLutWpZRDUYdFRqib5eFtLp1vLaR2CNPsdNHwUha/";

  
  async function connect() {
    try {
      await activate(Injected);
    } catch (ex) {
      console.error(ex)
    }
  }

  useEffect(() => {
    connect()
    try {
        const contract = new library.eth.Contract(ABI, address)
        setContract(contract);
        contract.methods.walletOfOwner(account).call().then(balance => {
            var bal = [];
            balance.forEach(id => {
                bal.push({id: id, url: baseurl+id+".png"});
            });
            console.log(bal)
            setBalance(bal)
        })
        .catch(err => {
            console.log(err);
        })
    } catch (e) {
        console.log(e)
    }
  }, [active])

  return (
    <div>
      <Head>
        <title>{active ? "Collection | Cool Snowman NFTs" : "Login | Cool Snowman NFTs"}</title>
      </Head>
      {error ? <Alert status={'error'}><AlertIcon />{error}</Alert> : null}
      {success ? <Alert status={'success'}><AlertIcon />{success}</Alert> : null}
      <Box p={'10px'} fontSize={'20px'} display={'flex'} justifyContent={'space-between'}>SnowMan NFT <Text onClick={active ? deactivate : connect} width={['150px', 'auto', 'auto']} overflow={'hidden'} whiteSpace={'nowrap'} textOverflow={'ellipsis'} padding={'10px'} background={'gray.700'} borderRadius={'xl'} fontSize={'15px'} _hover={{backgroundColor: 'gray.600'}}>{active ? account : "Connect"}</Text></Box>
      <Box minHeight={'100vh'}>
        {isLoading ? <CircularProgress /> : null}
        {active ?
        <Box>
        <Box display={'flex'} flexWrap={'wrap'} p={'40px'} justifyContent={['center', 'center', 'flex-start']}>
                {balance ? balance.map((item) => {
                    return (
                        <Box borderRadius={'lg'} bgColor={'gray.700'} p={'20px'} display={'flex'} flexDirection={'column'} key={item.id} marginLeft={['0','0','20px']} marginTop={'10px'}>
                            <Image src={item.url} borderRadius={'2xl'} alt={'Snowman'} width={'200px'} />
                            <Text fontSize={'20px'} as={'b'} mt={'10px'}>Cool Snowman #{item.id}</Text>
                        </Box>
                    )
                }) : 
                    <CircularProgress isIndeterminate color={'orange'}/>
                }
                {balance == 0 ? <Text fontSize={'20px'}>You have no Snowmen</Text> : null}
        </Box>
            <Link href="/">
                <Button colorScheme={'blue'} ml={'50px'} variant={'outline'}>Back to Mint</Button>
            </Link>
        </Box>
        : <Button onClick={connect}>Connect</Button>}
      </Box>
    </div>
  )
}

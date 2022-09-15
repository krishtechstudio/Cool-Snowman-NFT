import { Box, Button, Text, Image, Alert, AlertIcon, CircularProgress, CircularProgressLabel, Skeleton, SkeletonText, Link } from '@chakra-ui/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { InjectedConnector } from '@web3-react/injected-connector';
import { Injected } from '../injected/connector';
import { useWeb3React } from "@web3-react/core";
import ABI from '../abi/abi';
import web3 from "web3";


export default function Home() {

  const { active, account, library, activate, deactivate } = useWeb3React()

  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [isLoading, setLoading] = useState(false);
  const [price, setPrice] = useState();
  const [contract, setContract] = useState();

  const address = "0x113b7C63E2E2eeB896B74403b5F800B06F5A9377";
  const maxMint = 20;

  
  async function connect() {
    try {
      await activate(Injected);
    } catch (ex) {
      console.error(ex)
    }
  }

  async function checkMax() {
    try {
    contract.methods.balanceOf(account).call().then(balance => {
      setLoading(true);
        if (balance >= maxMint) {
            setLoading(false);
            setError("You have reached the maximum amount of Snowmen you can own. Please sell some Snowmen to gain more.");
        }else{
            mint();
        }
    });
    }catch(e){
        console.log(e);
        setError("Error checking balance. Please refresh and try again.");
        setLoading(false);
    }
  }

  async function mint() {
    setLoading(true);
    try {
      library.eth.sendTransaction({
        from: account,
        to: '0xdCD83ff826ebA1765bdD2fa1C14e8dcF217Aa480',
        value: web3.utils.toWei('0.01', 'ether'),
        gas: 300000,
      })
      .on('receipt', function(receipt) {
        console.log(receipt)
        setSuccess('Successfully minted a Cool Snowman !!');
        setLoading(false);
      })
      .on('error', function(error, receipt) {
        setError('Transaction failed. Please try again.');
        setLoading(false);
      });
      }catch (e) {
        console.log(e)
        setLoading(false);
      }
    // try {
    //   contract.methods.isWhitelisted(account).call().then(result => {
    //     if(result) {
    //       try {
    //       contract.methods.mint(1).send({ from: account, gas: 1000000, value: web3.utils.toWei('0.01', 'ether') })
    //       .on('transactionHash', function(hash) {
    //         console.log(hash)
    //       })
    //       .on('confirmation', function(confirmationNumber, receipt) {
    //         console.log(receipt)
    //       })
    //       .on('receipt', function(receipt) {
    //         console.log(receipt)
    //         setSuccess('Successfully minted a Cool Snowman !!');
    //         setLoading(false);
    //       })
    //       }catch (e) {
    //         console.log(e)
    //         setLoading(false);
    //       }
    //     } else {
    //       setError("You are not whitelisted !!");
    //       setLoading(false)
    //     }
    //     }).catch(err => {
    //       console.error(err);
    //       setLoading(false)
    //     })
      
    // } catch(ex) {
    //   console.log(ex)
    //   setLoading(false)
    // }
  }

  useEffect(() => {
    connect();
  }, [])

  useEffect(() => {
    try {
    const contract = new library.eth.Contract(ABI, address)
    setContract(contract);
    console.log(contract)
    contract.methods.cost().call().then(res => {
      setPrice(res / 10 ** 18)
      console.log(res)
    })
  } catch (e) {
    console.log(e)
  }
  }, [active])

  return (
    <div>
      <Head>
        <title>{active ? "Mint | Cool Snowman NFTs" : "Login | Cool Snowman NFTs"}</title>
      </Head>
      <Box p={'10px'} fontSize={'20px'} display={'flex'} justifyContent={'space-between'}>SnowMan NFT <Text onClick={active ? deactivate : connect} width={['150px', 'auto', 'auto']} overflow={'hidden'} whiteSpace={'nowrap'} textOverflow={'ellipsis'} padding={'10px'} background={'gray.700'} borderRadius={'xl'} fontSize={'15px'} _hover={{backgroundColor: 'gray.600'}} cursor={'pointer'}>{active ? account : "Connect"}</Text></Box>
      {error ? <Alert status={'error'}><AlertIcon />{error}</Alert> : null}
      {success ? <Alert status={'success'}><AlertIcon />{success}</Alert> : null}
      <Box display={'flex'} alignItems={'center'} justifyContent={'center'} minHeight={'100vh'}>
        <Box>
          <Box borderRadius={'lg'} bgColor={'gray.700'} p={'20px'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
            <Image src={'https://cool-snowman-nft.vercel.app/snowman.gif'} borderRadius={'2xl'} alt={'MetaMask'} width={'200px'}/>
            <Text as={'b'} fontSize={'20px'} mt={'15px'}>Get your Snowman</Text>
            {active ? <Box>
              {price ? <Button mt={'10px'} width={'100%'} colorScheme='yellow' isLoading={isLoading} onClick={checkMax}>Mint</Button> : <Skeleton mt={'10px'} height={'35px'} width={'200px'}></Skeleton>}
              {price ? <Link href='/collection'><Button mt={'10px'} width={'100%'} colorScheme='blue'>Your Collection</Button></Link> : <Skeleton mt={'10px'} height={'35px'} width={'200px'}></Skeleton>}
              <Box textAlign={'left'} mt={'10px'}>{price ? <Box><Text as={'b'}>Mint Price:</Text> {price} BNB</Box> : <Skeleton height={'10px'}></Skeleton>}</Box>
            </Box> : <Button colorScheme={'orange'} mt={'10px'} width={'100%'} disabled={error} onClick={connect}>Connect to mint</Button>}
          </Box>
        </Box>
      </Box>
    </div>
  )
}

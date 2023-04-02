import { Alchemy, Network } from 'alchemy-sdk';
import { React, useEffect, useState } from 'react';
import '/Users/michaelmccoy/Documents/GitHub/blockexplorer/src/App.css';
import {Table, Label } from "semantic-ui-react";
//import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const { Utils } = require("alchemy-sdk");
const settings = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
// https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface

const alchemy = new Alchemy(settings);

function App() {
    const [blockNumber, setBlockNumber] = useState();
		useEffect(() => {
			async function getBlockNumber() {
				setBlockNumber(await alchemy.core.getBlockNumber());
			}
		getBlockNumber();
        });

    const [gasPrice, setGasPrice] = useState();
        useEffect(() => { 
            async function getGasPrice() {
                setGasPrice(await alchemy.core.getGasPrice());
            }
        getGasPrice();
        }); 
    //const { id } = useParams();
    const [recentTransaction, setRecentTransaction] = useState();
    const { id } = useParams();
        useEffect(() => {
            async function getRecentTransaction() { 
                setRecentTransaction(await alchemy.core.getTransactionReceipt(id));
            };
            getRecentTransaction();
        }, [id]);

    
    const [value, setValue] = useState();
    const [block, setBlock] = useState();
        
        useEffect(() => {
            async function getBlockWithTransactions() {
                const latestBlock = await alchemy.core.getBlockWithTransactions(blockNumber);
                if (!latestBlock.transactions || latestBlock.transactions.length === 0) {
                  // handle case where block has no transactions
                  return;
                }
                const transactionHash = latestBlock.transactions[0].hash;
                const blockWithTransactions = await alchemy.core.getBlockWithTransactions(latestBlock.number);
                setBlock(blockWithTransactions);
              
                let value = null;
                for (let i = 0; i < blockWithTransactions.transactions.length; i++) {
                  if (transactionHash === blockWithTransactions.transactions[i].hash) {
                    value = Utils.formatEther(blockWithTransactions.transactions[i].value);
                  }
                }
              
                if (value !== null) {
                  setValue(value);
                }
              }
              
        
          getBlockWithTransactions();
        }, [blockNumber, setValue]);
        
        // use `block` and `value` in your component
        
    return (
            <div> 
                <Table className='centered'>
                    <Table.Header>
                        <Table.Row>
                            <Table.Cell style={{ color: "#1d6fa5", padding: '10px' }}>
                                <h4> Block Number: </h4>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>
                                <Label color="blue">Block</Label> {blockNumber}
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell style={{ color: "#1d6fa5" }}>
                                <h4> Estimated Gas: </h4>
                            </Table.Cell>
                        </Table.Row> 
                        <Table.Row>
                            <Table.Cell>
                                <Label color="blue">Gas</Label> {parseInt(gasPrice)/10**18}
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell style={{ color: "#1d6fa5" }}>
                                <h4> Recent Transaction: </h4>
                                <Label color="blue">Recent Transaction</Label> {recentTransaction}
                            </Table.Cell> 
                        </Table.Row> 
                        <Table.Row>
                            <Table.Cell>
                                <Label color="blue">Block</Label> {blockNumber}
                            </Table.Cell>
                            <Table.Cell>
                                <Label color="blue">Value</Label> {value}
                            </Table.Cell>
                        </Table.Row>
                    </Table.Header>    
                </Table>
            </div>
        );
    }

export default App;
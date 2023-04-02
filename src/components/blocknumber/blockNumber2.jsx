//websocket approach 
import { Alchemy, Network } from 'alchemy-sdk';
import { React, useEffect, useState } from 'react';
import '/Users/michaelmccoy/Documents/GitHub/blockexplorer/src/App.css';
import { Table, Label } from "semantic-ui-react";
import { useParams } from "react-router-dom";

const { Utils } = require("alchemy-sdk");
const settings = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function App() {
    const [blockNumber, setBlockNumber] = useState();
    const [gasPrice, setGasPrice] = useState();
    const [recentTransaction, setRecentTransaction] = useState();
    const [value, setValue] = useState();
    const [block, setBlock] = useState();

    const { id } = useParams();

    useEffect(() => {
        async function connectToWebSocket() {
            const socket = new WebSocket("wss://eth-mainnet.ws.alchemyapi.io/v2/your-websocket-endpoint");

            socket.onopen = function(event) {
                socket.send(JSON.stringify({
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "eth_subscribe",
                    "params": ["newHeads"]
                }));
            };

            socket.onmessage = async function(event) {
                const data = JSON.parse(event.data);

                if (data.method === "eth_subscription") {
                    const blockNumber = parseInt(data.params.result.number, 16);
                    setBlockNumber(blockNumber);

                    const gasPrice = parseInt(await alchemy.core.getGasPrice(), 16);
                    setGasPrice(gasPrice / 10 ** 18);
                }
            };

            return () => {
                socket.close();
            };
        }

        connectToWebSocket();
    }, []);

    useEffect(() => {
        async function getRecentTransaction() {
            setRecentTransaction(await alchemy.core.getTransactionReceipt(id));
        }

        getRecentTransaction();
    }, [id]);

    useEffect(() => {
        async function getBlockWithTransactions() {
            const latestBlock = await alchemy.core.getBlockWithTransactions(blockNumber);
            if (!latestBlock.transactions || latestBlock.transactions.length === 0) {
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

    return (
        <div>
            <Table fixed>
                <Table.Header>
                    <Table.Row>
                        <Table.Cell style={{ color: "#1d6fa5" }}>
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
                            <h4> Estimated Gas </h4>
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

import { Component,OnInit } from '@angular/core';
import {ethers} from 'ethers';
import { ConstructorFragment } from 'ethers/lib/utils';
declare let window:any;
import Wallet from '../artifacts/contracts/Wallet.sol/Wallet.json';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public addressWallet:any;
  public balance!:any;
  public amountSend!:any;
  public amountWithdraw!:any;
  public message!:string;
  constructor(){
    this.addressWallet="0x5FbDB2315678afecb367f032d93F642f64180aa3";
  }
  async getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
      const accounts=await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider =new ethers.providers.Web3Provider(window.ethereum);
      const contract =new ethers.Contract(this.addressWallet,Wallet.abi,provider);
      let overrides={
        from:accounts[0]
      }

      const data =await contract['getBalance'](overrides);
      this.balance=String(data);

    }else{
      this.message="you must create your metaMask account";
      console.log(this.message);
    }
  }
  async  transfer() {
    if(!this.amountSend) {
      return;
    }
    if(typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      try {
        const tx = {
          from: accounts[0],
          to: this.addressWallet,
          value: ethers.utils.parseEther(this.amountSend)
        }
        const transaction = await signer.sendTransaction(tx);
        await transaction.wait();
        this.amountSend='';
        this.getBalance();
        this.message='Votre argent a bien été transféré sur le portefeuille ! ';
      }
      catch(err) {
        this.message='Une erreur est survenue.';
      }
    }
  }
  async  withdraw() {
    if(!this.amountWithdraw) {
      return;
    }
    this.message="il faut taper un nombre";
    const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(this.addressWallet, Wallet.abi, signer);
    try {
      const transaction = await contract['withdrawMoney'](accounts[0], ethers.utils.parseEther(this.amountWithdraw));
      await transaction.wait();
      this.amountWithdraw="";
      this.getBalance();
      this.message='Votre argent a bien été retiré du portefeuille ! ';
    }
    catch(err) {
      this.message='Une erreur est survenue.';
    }
  }

  changeAmountSend(e:any) {
    this.amountSend=e;
    
  }
  changeAmountWithdraw(e:any) {
    this.amountWithdraw=e;

  }
  

  ngOnInit(): void {
    //this.changeAmountSend("20");
    //this.transfer();
    this.getBalance();
    throw new Error('Method not implemented.');
  }  
  title = 'WalletAZ';
}

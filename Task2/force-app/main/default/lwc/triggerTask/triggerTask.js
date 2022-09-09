import { LightningElement, track, wire,api } from 'lwc';
import getAccountList from '@salesforce/apex/AccountContoller.getAccountList';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import insertAcc from '@salesforce/apex/AccountContoller.insertAcc';
import deleteAcc from '@salesforce/apex/AccountContoller.deleteAcc';
import updateAcc from '@salesforce/apex/AccountContoller.updateAcc';
import { refreshApex } from '@salesforce/apex';


export default class TriggerTask extends LightningElement {
    @track columns = [{ label: 'Account name', fieldName: 'Name', type: 'text'},
    { label: 'Annual Revenue',fieldName: 'AnnualRevenue', type: 'Currency' },
    { label: 'Phone',fieldName: 'Phone',type: 'phone' }
];
@api recordId;
@track error;
@track isModalOpen = false;
@track isModalOpenDelete = false;
@track isModalOpenUpdate = false;
refresh
accountList;
Name;
AnnualRevenue;
Phone;
@track account ={};

@wire (getAccountList) wiredAccounts(result){
    const {data, error} = result;
    this.refresh = result;
    if (data) {
         this.accountList = data;
    console.log(data); 
    } else if (error) {
    console.log(error);
    }
}

    openModal() {
        this.isModalOpen = true;
    }
    closeModal() {
        this.isModalOpen = false;
    }

    openModalDelete() {
        this.isModalOpenDelete = true;
    }
    closeModalDelete() {
        this.isModalOpenDelete = false;
    }

    openModalUpdate() {
        this.isModalOpenUpdate = true;
    }
    closeModalUpdate() {
        this.isModalOpenUpdate = false;
    }

    handlerName(event){
        this.Name = event.target.value;
        this.account.Name=this.Name;
    }
    handleAnnualRevenue(event){
        this.AnnualRevenue = event.target.value;
        this.account.AnnualRevenue=this.AnnualRevenue;
    }
    handlePhone(event){
        this.Phone = event.target.value;
        this.account.Phone=this.Phone;
    }   
    handleForSave(){ 
       this.isModalOpen = false;
        insertAcc({ acc : this.account})
        .then(result =>{
            const toastEvent = new ShowToastEvent({
                title:'Record Save',
                message:'Record saved successfully',
                variant:'success',
            })
            this.dispatchEvent(toastEvent);
            window.location.reload()
        })
        .catch(error =>{
    this.error = error.message;
    const toastEvent = new ShowToastEvent({
        title:'Duplicate record exist',
        message:'Please Enter Unique Record',
        variant:'error',
    })
    this.dispatchEvent(toastEvent);
    })
    }

    handleForDelete(){
        this.isModalOpenDelete = false;
        deleteAcc({accName:  this.Name})
        .then(result =>{
            const toastEvent = new ShowToastEvent({
                title:'Record Deleted',
                message:'Record deleted successfully',
                variant:'success',
            })
            this.dispatchEvent(toastEvent);
            window.location.reload()
         })
        .catch(error=>{
            this.errors = error.message;
        })
    }
   

    selectedRow(event){
        const selectedRows = event.detail.selectedRows;
        for (let i = 0; i < selectedRows.length; i++){
            this.recordId = selectedRows[i].Id;
        }
    }

    handleForUpdate(event){
        this.account = event.detail.id;    
        updateAcc({accData : JSON.stringify(this.account)})
         .then(result =>{
               const toastEvent = new ShowToastEvent({
                 title:'Record Updated',
                 message:'Record Updated successfully',
                 variant:'success',
             })
             this.dispatchEvent(toastEvent);
             window.location.reload()
            })
         .catch(error=>{
             this.errors = error.message;
             console.log(this.error);
         })
     }
     
     handleRefresh(){
      return refreshApex(this.refresh);
     }
}

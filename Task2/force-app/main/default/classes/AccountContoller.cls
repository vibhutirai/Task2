public with sharing class AccountContoller {
    @AuraEnabled
    public static List<Account> getAccountList() {
        return [SELECT Id, Name, Type, Phone, AnnualRevenue FROM Account];
    }

    @AuraEnabled
    public static void insertAcc(account acc){
        try{
            insert acc;
            Contact con = new Contact(
                LastName='Smith',
                Phone='9876543',
                AccountId=acc.id);
            insert con;
        }catch(Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
    }

    @AuraEnabled
    public static void deleteAcc(String accName){
       List<Account> accountName = [SELECT Id, Name FROM Account WHERE Name =: accName]; 
        try{
            delete accountName;
        }catch(Exception ex){ 
            throw new AuraHandledException(ex.getMessage());
        }
    }

    @AuraEnabled
    public static void updateAcc(account accData){
    try{
       Account acList = [SELECT Id, Name, Phone, AnnualRevenue FROM Account WHERE Name =: accData.Name];
      Account acct = new Account();
      acct.Name = accData.Name;
      acct.AnnualRevenue =accData.AnnualRevenue;
      acct.Phone = accData.Phone;
      Update acct;
        }catch(Exception ex){ 

        }
    }
}
